const router = require('express').Router()
let Workpiece = require('../models/workpiece.model')
let StatePlaces = require('../helper/places/statePlaces.js')
const url = require('url')
let clientStorage = require('./storage.js')
let qualityControl = require('./qualityControl.js')
const valueConverter = require('../helper/mongo/valueConverter')
const mongoose = require('mongoose');
let wpHelper = require('./workpiece.js')

/**
 * Rückgabe der Datensätze des gedruckten Werkstückes
 * 
 * http://localhost:5000/pi/printed-wst?color=blue
 * http://localhost:5000/pi/printed-wst?color=orange
 *
 * Liefert den zuerst zuletzt gedruckten Datensatz in der Farbe zurück
 * http://localhost:5000/pi/printed-wst?color=blue
 * => 20:30 Blau [X] <= Wird zurückgeliefert
 *    20:35 Blau
 *
 * http://localhost:5000/pi/printed-wst?color=orange
 * => 20:32 Orange [X] <= Wird zurückgeliefert
 *
 * http://localhost:5000/pi/printed-wst?color=schwarz (Farbe gibt es nicht)
 * => [] <= Wird zurückgeliefert
 *
 * (Zuerst zuletzt gedruckt: state.id == 1)
 * [{"color":{"actualValue":null,"toValue":"Blau"},"shape":{"actualValue":null,"toValue":"Dreieck"},"state":{"place":{"id":1,"faculty":"MBUT","floor":"Erdgeschoss","room":"0123","subproject":"TP1"},"id":1,"message":"Wird gedruckt.","storageProcesses":[]},"order":{"customer":{"firstname":"Vorname 10","name":"Nachname","zip":123,"email":"vorname@name","address":"14","ort":"there"},"shape":{"toValue":"Dreieck"},"color":{"toValue":"Blau"},"number":"abc10","updatedAt":"2020-05-10T08:17:18.714Z","createdAt":"2020-05-10T08:17:18.714Z"},"_id":"5ee7312f13237f05339c78e3","workpieceId":"BlauDreieck-200615-1","updatedAt":"2020-06-15T09:30:53.964Z","createdAt":"2020-06-15T08:28:31.632Z","__v":0}]
 * 
 * Wenn nicht: Dann war keiner im Druck!
 * => []
 * 
 * @returns Dokument-Eintrag als JSON
 */
router.route('/printed-wst').get((req, res) => {
  let color = valueConverter.readColor(req, res)

  Workpiece.find({
    "color.toValue": {$eq: color},
    "state.id": {$eq: StatePlaces.RUNNING_PRINT.id},
  })
  .sort({updatedAt: 1}) // 1: Aufsteigend, -1: Absteigend
  .then(workpieces => {
    if (workpieces.length > 0) {
      // Zuletzt gedrucktes WST auslesen
      // Dieses wird jetzt auf einen neuen State (ausgeliefert) gesetzt
      // Wir gehen hier davon aus, dass die Übertragung
      // und das Schreiben auf den WST klappt
      let lastPrintedWst = workpieces[0]

      const state = {
        id: StatePlaces.POST_PRODUCTION_TRANSFERING_TO_QC.id,
        message: StatePlaces.POST_PRODUCTION_TRANSFERING_TO_QC.message,
        timeEstimate: lastPrintedWst.state.timeEstimate,
        timeCurrent: lastPrintedWst.state.timeCurrent,
        timeLeft: lastPrintedWst.state.timeLeft,
        completion: lastPrintedWst.state.completion,
        printStartingTime: lastPrintedWst.state.printStartingTime,
        printCompletionTime: lastPrintedWst.state.printCompletionTime,
        controlProcesses: lastPrintedWst.state.controlProcesses || [],
        storageProcesses: lastPrintedWst.state.storageProcesses || [],
        place: StatePlaces.POST_PRODUCTION_TRANSFERING_TO_QC.place
      }

      lastPrintedWst.state = state
      lastPrintedWst.updatedAt = Date.now()
      lastPrintedWst.save()

      res.json(lastPrintedWst)
    } else {
      res.json(workpieces)
    }
  })
  .catch(err => res.status(400).json('Error: ' + err))
})

/**
 * Einlagern eines WST
 *
 * Liefert den Datensatz zurück, der eingelagert wird
 * http://localhost:5000/pi/store-wst?workpieceId=BlauKreis-200615-4
 * 
 * Ergebnisse:
 * - workpieceId=abc => [] => Datensatz konnte nicht gefunden werden
 * - workpieceId=BlauKreis-200615-4 => [<Informationen zum Datensatz>] =>
 *     richtiger Datensatz wird zurückgeliefert (evt. zur Kontrolle wichtig)
 * 
 * @returns Dokument-Eintrag als JSON
 */
router.route('/store-wst').get((req, res) => {
  let wstId = readWstId(req, res)

  Workpiece.findOne({
    "workpieceId": {$eq: wstId},
  })
  .then(workpiece => {
    if(workpiece) { 
      let timestamp = Date.now()
      
      // - /state/place
      // - /state/id
      // - /state/message
      const state = {
        id: StatePlaces.IN_STORAGE.id,
        message: StatePlaces.IN_STORAGE.message,
        timeEstimate: workpiece.state.timeEstimate,
        timeCurrent: workpiece.state.timeCurrent,
        timeLeft: workpiece.state.timeLeft,
        completion: workpiece.state.completion,
        printStartingTime: workpiece.state.printStartingTime,
        printCompletionTime: workpiece.state.printCompletionTime,
        controlProcesses: workpiece.state.controlProcesses || [],
        storageProcesses: workpiece.state.storageProcesses || [],
        place: StatePlaces.IN_STORAGE.place
      }

      workpiece.state = state

      // Wird eingelagert
      workpiece.updatedAt = timestamp

      // Änderungen speichern
      workpiece.save()
      .then(() => {
        // Werkstück gefunden, Datensatz aktualisieren
        clientStorage.storeWorkpieceByWorkpieceId(req, res, workpiece._id)

        // Aktualisierten Datensatz zurückgeben
        res.json(workpiece)
      })
    } else {
      // Kein WST mit dieser workpieceId gefunden
      res.json([])
    }
  })
  .catch(err => res.status(400).json('Error store-wst: ' + err))
})

/**
 * Auslagern eines WST
 *
 * Liefert den Datensatz zurück, der ausgelagert wird
 * http://localhost:5000/pi/scan-outsource-wst?workpieceId=BlauKreis-200615-4
 * 
 * Ergebnisse:
 * - workpieceId=abc => [] => Datensatz konnte nicht gefunden werden
 * - workpieceId=BlauKreis-200615-4 => [<Informationen zu den neuen Datensatzinformationen>] =>
 *     richtiger Datensatz wird zurückgeliefert (evt. zur Kontrolle wichtig)
 * 
 * @returns Dokument-Eintrag als JSON
 */
router.route('/scan-outsource-wst').get((req, res) => {
  let wstId = readWstId(req, res)

  Workpiece.findOne({
    "workpieceId": {$eq: wstId},
  })
  .then(workpiece => {
    if(workpiece) { 
      // Setzen:
      let timestamp = Date.now()

      // - /state/place
      // - /state/id
      // - /state/message
      const state = {
        id: StatePlaces.POST_STORAGE_TRANSFERING_TO_QC.id,
        message: StatePlaces.POST_STORAGE_TRANSFERING_TO_QC.message,
        timeEstimate: workpiece.state.timeEstimate,
        timeCurrent: workpiece.state.timeCurrent,
        timeLeft: workpiece.state.timeLeft,
        completion: workpiece.state.completion,
        printStartingTime: workpiece.state.printStartingTime,
        printCompletionTime: workpiece.state.printCompletionTime,
        controlProcesses: workpiece.state.controlProcesses || [],
        storageProcesses: workpiece.state.storageProcesses || [],
        place: StatePlaces.POST_STORAGE_TRANSFERING_TO_QC.place
      }

      workpiece.state = state

      // Wird ausgelagert
      workpiece.updatedAt = timestamp

      // Werkstück gefunden, Datensatz aktualisieren
      workpiece.save()
      .then(updatedWst => {
        // Werkstück gefunden, Datensatz aktualisieren
        clientStorage.outsourceWorkpieceByWorkpieceId(req, res, workpiece._id)

        // Aktualisierten Datensatz zurückgeben
        res.json(updatedWst)
      })
      .catch(err => res.status(400).json('Aktualisieren des WST-State beim Auslagern nicht erfolgreich: ' + err))
    } else {
      // Kein WST mit dieser workpieceId gefunden
      res.json([])
    }
  })
  .catch(err => res.status(400).json('Error scan-outsource-wst: ' + err))
})

/**
 * Gibt die ID des Werkstückes zurück.
 * Ausgelesen wird diese aus der URL.
 */
function readWstId(req, res) {
  const reqUrl = url.parse(req.url, true)
  let wstId = reqUrl.query.workpieceId

  if (wstId) {
    return wstId
  } else {
    res.statusCode = 400
    res.json("Invalid request - no workpieceId defined")
  }
}

/**
 * WST liegt zur Abholung bereit
 *
 * Teilt mit, dass das Werkstück an der Abholstation angelangt ist.
 * http://localhost:5000/pi/pickup-wst?workpieceId=BlauKreis-200615-4
 * 
 * Ergebnisse:
 * - workpieceId=abc => [] => Datensatz konnte nicht gefunden werden
 * - workpieceId=BlauKreis-200615-4 => [<Informationen zum Datensatz>] =>
 *     richtiger Datensatz wird zurückgeliefert (evt. zur Kontrolle wichtig)
 * 
 * @returns Dokument-Eintrag als JSON
 */
router.route('/pickup-wst').get((req, res) => {
  let wstId = readWstId(req, res)

  Workpiece.findOne({
    "workpieceId": {$eq: wstId},
  })
  .then(workpiece => {
    if(workpiece) { 
      let timestamp = Date.now()
      
      // - /state/place
      // - /state/id
      // - /state/message
      const state = {
        id: StatePlaces.AVAILABLE_FOR_PICKUP.id,
        message: StatePlaces.AVAILABLE_FOR_PICKUP.message,
        timeEstimate: workpiece.state.timeEstimate,
        timeCurrent: workpiece.state.timeCurrent,
        timeLeft: workpiece.state.timeLeft,
        completion: workpiece.state.completion,
        printStartingTime: workpiece.state.printStartingTime,
        printCompletionTime: workpiece.state.printCompletionTime,
        controlProcesses: workpiece.state.controlProcesses || [],
        storageProcesses: workpiece.state.storageProcesses || [],
        place: StatePlaces.AVAILABLE_FOR_PICKUP.place
      }

      workpiece.state = state
      workpiece.updatedAt = timestamp

      // Änderungen speichern
      workpiece.save()
      .then(() => {
        // Aktualisierten Datensatz zurückgeben
        res.json(workpiece)
      })
    } else {
      // Kein WST mit dieser workpieceId gefunden
      res.json([])
    }
  })
  .catch(err => res.status(400).json('Error pickup-wst: ' + err))
})

/**
 * Eingang WST bei der QC
 *
 * Liefert den Datensatz zurück, der bei der QC angekommen ist.
 * Dieser Datensatz wird jetzt von der QC überprüft.
 * http://localhost:5000/pi/qc-entry-wst?workpieceId=BlauKreis-200615-4
 * 
 * Ergebnisse:
 * - workpieceId=abc => [] => Datensatz konnte nicht gefunden werden
 * - workpieceId=BlauKreis-200615-4 => [<Informationen zum Datensatz>] =>
 *     richtiger Datensatz wird zurückgeliefert (evt. zur Kontrolle wichtig)
 * 
 * @returns Dokument-Eintrag als JSON
 */
router.route('/qc-entry-wst').get((req, res) => {
  let wstId = readWstId(req, res)

  Workpiece.findOne({
    "workpieceId": {$eq: wstId},
  })
  .then(workpiece => {
    if(workpiece) { 
      let timestamp = Date.now()

      let idBySource = workpiece.state.id
      let messageBySource = workpiece.state.message
      let placeBySource = workpiece.state.place

      if (workpiece.state.id === StatePlaces.POST_PRODUCTION_TRANSFERING_TO_QC.id) {
        // Von Produktion nach QC
        idBySource = StatePlaces.POST_PRODUCTION_RUNNING_QC.id
        messageBySource = StatePlaces.POST_PRODUCTION_RUNNING_QC.message
        placeBySource = StatePlaces.POST_PRODUCTION_RUNNING_QC.place
      } else if (workpiece.state.id === StatePlaces.POST_STORAGE_TRANSFERING_TO_QC.id) {
        // Von Lager nach QC
        idBySource = StatePlaces.POST_STORAGE_RUNNING_QC.id
        messageBySource = StatePlaces.POST_STORAGE_RUNNING_QC.message
        placeBySource = StatePlaces.POST_STORAGE_RUNNING_QC.place
      }
      
      // - /state/place
      // - /state/id
      // - /state/message
      const state = {
        id: idBySource,
        message: messageBySource,
        timeEstimate: workpiece.state.timeEstimate,
        timeCurrent: workpiece.state.timeCurrent,
        timeLeft: workpiece.state.timeLeft,
        completion: workpiece.state.completion,
        printStartingTime: workpiece.state.printStartingTime,
        printCompletionTime: workpiece.state.printCompletionTime,
        controlProcesses: workpiece.state.controlProcesses || [],
        storageProcesses: workpiece.state.storageProcesses || [],
        place: placeBySource
      }

      workpiece.state = state

      // Kontrollprozess anlegen
      const controlProcess = {
        controlStartingTime: timestamp, // QC-Beginn
        controlCompletionTime: null, // QC-Ende
        function: null, // Zustand ok
        color: null, // Entspricht Farbe dem erwarteten Wert
        shape: null, // Entspricht Form dem erwarteten Wert
      };

      // Neuen Kontrollprozess hinzufügen
      workpiece.state.controlProcesses.push(controlProcess)

      // Wird eingelagert
      workpiece.updatedAt = timestamp

      // Änderungen speichern
      workpiece.save()
      .then(() => {
        qualityControl.startQcControl(req, res, workpiece._id)
        // Aktualisierten Datensatz zurückgeben
        res.json(workpiece)
      })
    } else {
      // Kein WST mit dieser workpieceId gefunden
      res.json([])
    }
  })
  .catch(err => res.status(400).json('Error qc-entry-wst: ' + err))
})

/**
 * Ausgang WST bei der QC
 *
 * Liefert den Datensatz zurück, der durch die QC gelaufen ist.
 * http://localhost:5000/pi/qc-exit-wst?workpieceId=BlauKreis-200615-4
 * 
 * Ergebnisse:
 * - workpieceId=abc => [] => Datensatz konnte nicht gefunden werden
 * - workpieceId=BlauKreis-200615-4 => [<Informationen zum Datensatz>] =>
 *     richtiger Datensatz wird zurückgeliefert (evt. zur Kontrolle wichtig)
 * 
 * @returns Dokument-Eintrag als JSON
 */
router.route('/qc-exit-wst').get((req, res) => {
  let wstId = readWstId(req, res)

  Workpiece.findOne({
    "workpieceId": {$eq: wstId},
  })
  .then(workpiece => {
    if(workpiece) { 
      let timestamp = Date.now()

      // Zuvor durchgeführten Kontrollprozess abrufen
      let lastControlProcess = workpiece.state.controlProcesses.slice(-1)[0]
      lastControlProcess.controlCompletionTime = timestamp

      // Entscheidungsvariablen für Ziele berechnen
      let isWorkpieceValid = lastControlProcess.function && lastControlProcess.color && lastControlProcess.shape
      let isFunction = lastControlProcess.function

      // Ziel ermitteln
      let destinationIsStorage = false
      let destinationIsPickupStation = false
      let destinationIsTrash = false
      let splitOrderAndWst = false
      let fixColorAndShapeOnly = false

      if (isWorkpieceValid) {
        // Werkstück ist gültig - IST entspricht SOLL
        if (Object.keys(workpiece.order.toObject().color).length !== 0) {
          // Bestellung vorhanden
          // 1
          destinationIsPickupStation = true
        } else {
          // Keine Bestellung
          // 2
          destinationIsStorage = true
        }
      } else {
        // Werkstück SOLL entspricht nicht den IST-Angaben
        if (isFunction) {
          // Form und Farbe erkannt, SOLL stimmt aber nicht mit IST überein
          // 3
          if (Object.keys(workpiece.order.toObject().color).length !== 0) {
            // Bestellung vorhanden
            // Der Datensatz muss angepasst werden und
            // Die Bestellung muss von dem WST getrennt werden,
            // da es ja sonst nicht mehr zusammenpasst
            splitOrderAndWst = true
            console.log("QC - WST ist nicht wie erwartet (mit Order)")
          } else {
            // Keine Bestellung
            // Der Datensatz muss nur angepasst werden und dann
            // zurück ans Lager geschickt werden
            destinationIsStorage = true
            fixColorAndShapeOnly = true
            console.log("QC - WST ist nicht wie erwartet (ohne Order)")
          }
        } else {
          // Form oder Farbe kann nicht detektiert werden
          // SOLL kann nicht mit IST überprüft werden
          // 4
          destinationIsTrash = true
        }
      }

      // Ziel auf WST setzen
      let idByDestination = workpiece.state.id
      let messageByDestination = workpiece.state.message
      let placeByDestination = workpiece.state.place

      if (destinationIsStorage) {
        // Nach QC ins Lager
        console.log("Nach QC ins Lager")
        idByDestination = StatePlaces.POST_QC_TRANSFERING_TO_STORAGE.id
        messageByDestination = StatePlaces.POST_QC_TRANSFERING_TO_STORAGE.message
        placeByDestination = StatePlaces.POST_QC_TRANSFERING_TO_STORAGE.place
      } else if (destinationIsPickupStation) {
        // Nach QC zur Abholstation
        console.log("Nach QC zur Abholstation")
        idByDestination = StatePlaces.TRANSFERING_TO_PICKUP_STATION.id
        messageByDestination = StatePlaces.TRANSFERING_TO_PICKUP_STATION.message
        placeByDestination = StatePlaces.TRANSFERING_TO_PICKUP_STATION.place
      } else if (destinationIsTrash) {
        console.log("/qc-exit-wst - Not implemented (Trash)")
      } else if (splitOrderAndWst) {
        // Nach QC wird Order und WST getrennt.
        // Order wird wieder zurück zum Anfang versetzt
        idByDestination = StatePlaces.CREATED_AND_IN_PRODUCTION_QUEUE.id
        messageByDestination = StatePlaces.CREATED_AND_IN_PRODUCTION_QUEUE.message
        placeByDestination = StatePlaces.CREATED_AND_IN_PRODUCTION_QUEUE.place
      }
      
      // - /state/place
      // - /state/id
      // - /state/message
      let state = {
        id: idByDestination,
        message: messageByDestination,
        timeEstimate: workpiece.state.timeEstimate,
        timeCurrent: workpiece.state.timeCurrent,
        timeLeft: workpiece.state.timeLeft,
        completion: workpiece.state.completion,
        printStartingTime: workpiece.state.printStartingTime,
        printCompletionTime: workpiece.state.printCompletionTime,
        controlProcesses: workpiece.state.controlProcesses || [],
        storageProcesses: workpiece.state.storageProcesses || [],
        place: placeByDestination
      }

      if (splitOrderAndWst) {
        console.log("QC-Exit (Wrong Color or Shape - With Order)")
        // Datensatz muss gesplittet werden
        // Neuer WST Datensatz
        Workpiece.findById(workpiece._id).exec(
          function(err, doc) {
            var wst = doc;
            wst._id = mongoose.Types.ObjectId();
            wst.isNew = true;
            
            let stateWst = {
              id: idByDestination,
              message: messageByDestination,
              timeEstimate: workpiece.state.timeEstimate,
              timeCurrent: workpiece.state.timeCurrent,
              timeLeft: workpiece.state.timeLeft,
              completion: workpiece.state.completion,
              printStartingTime: workpiece.state.printStartingTime,
              printCompletionTime: workpiece.state.printCompletionTime,
              controlProcesses: workpiece.state.controlProcesses || [],
              storageProcesses: workpiece.state.storageProcesses || [],
              place: placeByDestination
            }

            wst.state = stateWst

            // wst.state.id = StatePlaces.POST_QC_TRANSFERING_TO_STORAGE.id
            // wst.state.message = StatePlaces.POST_QC_TRANSFERING_TO_STORAGE.message
            // wst.state.place = StatePlaces.POST_QC_TRANSFERING_TO_STORAGE.place
            wst.state.controlProcesses = workpiece.state.controlProcesses || []
            wst.state.storageProcesses = workpiece.state.storageProcesses || []

            wst.color.toValue = workpiece.color.actualValue
            wst.shape.toValue = workpiece.shape.actualValue

            wpHelper.getSpecificWorkpieces(workpiece.color.actualValue, workpiece.shape.actualValue, workpiece.createdAt,
              (workpieces) => {
              const nextWorkpieceCounter = workpieces.length + 1
              const workpieceId = wpHelper.createUid(workpiece.color.actualValue, workpiece.shape.actualValue, workpiece.createdAt, nextWorkpieceCounter)
              wst.workpieceId = workpieceId

              wst.order = undefined

              wst.updatedAt = timestamp

              wst.save()
              .then(() => {
                // Neuer Order Datensatz
                // Informationen zum WST von der Bestellung entfernen
                workpiece.color.actualValue = null
                workpiece.shape.actualValue = null
                state.timeEstimate = undefined
                state.timeCurrent = undefined
                state.timeLeft = undefined
                state.completion = undefined
                state.printStartingTime = undefined
                state.printCompletionTime = undefined
                state.controlProcesses = []
                state.storageProcesses = []

                workpiece.state = state

                // Wird eingelagert
                workpiece.updatedAt = timestamp
          
                // Änderungen speichern
                workpiece.save()
                .then(() => {
                  // Aktualisierten Datensatz (WST) zurückgeben
                  res.json(wst)
                })
              });
            })
          }
        );
      } else {
        if (fixColorAndShapeOnly) {
          console.log("QC-Exit (Wrong Color or Shape - No Order)")
          // Datensatz ohne Bestellung hat eine andere Farbe oder Form
          // als erwartete. Ändere Werte so ab, dass sie wieder stimmen.
          wpHelper.getSpecificWorkpieces(workpiece.color.actualValue, workpiece.shape.actualValue, workpiece.createdAt,
            (workpieces) => {
            const nextWorkpieceCounter = workpieces.length + 1
            const workpieceId = wpHelper.createUid(workpiece.color.actualValue, workpiece.shape.actualValue, workpiece.createdAt, nextWorkpieceCounter)
            workpiece.workpieceId = workpieceId

            workpiece.state = state

            workpiece.updatedAt = timestamp

            // Änderungen speichern
            workpiece.save()
            .then(() => {
              // Aktualisierten Datensatz mit Order zurückgeben
              res.json(workpiece)
            })
          })
        } else {
          console.log("QC-Exit (Success)")
          // Datensatz kann ganz normal verarbeitet werden
          workpiece.state = state

          // Wird eingelagert
          workpiece.updatedAt = timestamp
    
          // Änderungen speichern
          workpiece.save()
          .then(() => {
            // Aktualisierten Datensatz mit Order zurückgeben
            res.json(workpiece)
          })
        }
      }
    } else {
      // Kein WST mit dieser workpieceId gefunden
      res.json([])
    }
  })
  .catch(err => res.status(400).json('Error qc-exit-wst: ' + err))
})

module.exports = router