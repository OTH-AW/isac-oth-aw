const router = require('express').Router();
const opcua = require("node-opcua");
const opcuaConnector = require('../helper/opcua/connector')
opcClient = new opcuaConnector.Client(process.env.OPCUA_TP2_URI)
const valueConverter = require('../helper/mongo/valueConverter')

var async = require("async");
let Workpiece = require('../models/workpiece.model');
let StatePlaces = require('../helper/places/statePlaces.js')

let isStorageBusy = false

/**
 * 
 * 
 * Angelegte Test-Route:
 * http://localhost:5000/storage/is-storage-ready
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} respond 
 * @param {*} callback 
 */
function isStorageReady (req, res, respond, callback) {
  console.log("isStorageReady")
  opcClient.call(async () => {
    let nodeId = await opcClient.findNodeId("2", "storage", "storage_ready")

    opcClient.readNode(nodeId, (node, dataValue) => {
      console.log(`Status storage_ready: ${dataValue.value.value}`)
      if (dataValue.value.value === true) {
        // Bereit, um Lageraktionen durchzuführen
        console.log("Storage is ready :)")
        if (respond === false)
          callback(null, req, res, false)
        else
          res.json("Storage is ready :)")
      } else {
        console.log("Storage is not ready :(")
        if (res !== null) {
          // res.json("Storage is not ready :(")
        }
      }
    })
  })
}

/**
 * Setzt die ID des Werkstückes, das eingelagert werden soll.
 * 
 * Angelegte Test-Route:
 * http://localhost:5000/storage/set-id
 * 
 * @param {*} id 
 * @param {*} req 
 * @param {*} res 
 * @param {*} respond 
 * @param {*} callback 
 */
function setID (id, req, res, respond, callback) {
  console.log("setID")
  console.log(id)
  opcClient.call(async () => {
    let nodeId = await opcClient.findNodeId("2", "storage", "store", "workpiece", "mongo_objectid")
    console.log(nodeId)
    console.log(id)
    opcClient.writeNode(nodeId, opcua.DataType.String, id, () => {
      console.log("ID gesetzt")
      if (respond === false)
      {
        if (callback !== null)
          callback(null, req, res, false)
      }
      else
        res.json(`ID auf ${id} gesetzt`)
    })
  });
}

/**
 * Setzt die Form des Werkstückes, das eingelagert werden soll.
 * 
 * Angelegte Test-Route:
 * http://localhost:5000/storage/set-shape
 * 
 * @param {*} shape 
 * @param {*} req 
 * @param {*} res 
 * @param {*} respond 
 * @param {*} callback 
 */
function setShape (shape, req, res, respond, callback) {
  console.log("setShape")
  opcClient.call(async () => {
    let nodeId = await opcClient.findNodeId("2", "storage", "store", "workpiece", "shape_to_value")

    opcClient.writeNode(nodeId, opcua.DataType.String, shape, () => {
      console.log("Shape gesetzt")
      if (respond === false)
      {
        if (callback !== null)
          callback(null, req, res, false)
      }
      else
        res.json(`Shape auf ${shape} gesetzt`)
    })
  });
}

/**
 * Setzt die Farbe des Werkstückes, das eingelagert werden soll.
 * 
 * Angelegte Test-Route:
 * http://localhost:5000/storage/set-color
 * 
 * @param {*} color 
 * @param {*} req 
 * @param {*} res 
 * @param {*} respond 
 * @param {*} callback 
 */
function setColor (color, req, res, respond, callback) {
  console.log("setColor")
  opcClient.call(async () => {
    let nodeId = await opcClient.findNodeId("2", "storage", "store", "workpiece", "color_to_value")

    opcClient.writeNode(nodeId, opcua.DataType.String, color, () => {
      console.log("Color gesetzt")
      if (respond === false)
      {
        if (callback !== null)
          callback(null, req, res, false)
      }
      else
        res.json(`Color auf ${color} gesetzt`)
    })
  });
}

/**
 * Startet das Einlagern des Werkstückes.
 * 
 * Angelegte Test-Route:
 * http://localhost:5000/storage/start-store
 * 
 * @param {*} workpiece 
 * @param {*} shallStart 
 * @param {*} req 
 * @param {*} res 
 * @param {*} respond 
 * @param {*} callback 
 */
function startStore(workpiece, shallStart, req, res, respond, callback) {
  console.log("startStore")
  opcClient.call(async () => {
    let nodeId = await opcClient.findNodeId("2", "storage", "store", "start_store")
    let nodeIdStartingTime = await opcClient.findNodeId("2", "storage", "store", "starting_time")

    opcClient.writeNode(nodeId, opcua.DataType.Boolean, shallStart, () => {
      console.log("Start Store gesetzt")

      if (shallStart && workpiece) {
        // WST wird eingelagert
        opcClient.readNode(nodeIdStartingTime, (node, dataValue) => {
          let timestamp = dataValue.value.value

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

          // - /state/storageProcesses[newIndex]/storageStartingTime
          const storageProcess = {
            storageStartingTime: timestamp, // Einlagerungszeit-Beginn
            storageCompletionTime: null, // Einlagerungszeit-Ende
            outsourceStartingTime: null, // Auslagerungszeit-Beginn 
            outsourceCompletionTime: null, // Auslagerungszeit-Ende
          };

          // Neuer Ein/Auslagerungsprozess
          workpiece.state.storageProcesses.push(storageProcess)

          // Wird eingelagert
          workpiece.updatedAt = timestamp

          // Änderungen speichern
          workpiece.save()
        })
      }

      if (respond === false)
      {
        if (callback !== null)
          callback(null, req, res, false)
      }
      else
        res.json(`Start Store auf ${shallStart} gesetzt`)
    })
  });
}

/**
 * Legt einen Listener an, der beim Abschließen des Einlagerns
 * die Dokumente in der MongoDB updated sowie die OPCUA-Variablen
 * zurücksetzt.
 * 
 * Angelegte Test-Route:
 * http://localhost:5000/storage/subscribe-store-complete
 * 
 * @param {*} workpiece 
 * @param {*} req 
 * @param {*} res 
 * @param {*} respond 
 * @param {*} callback 
 */
function subscribeStoreComplete (workpiece, req, res, respond, callback) {
  console.log("subscribeStoreComplete")
  opcClient.call(async () => {
    let nodeId = await opcClient.findNodeId("2", "storage", "store", "complete")
    let nodeIdCompletionTime = await opcClient.findNodeId("2", "storage", "store", "completion_time")

    let subscription = opcClient.monitorNodes([nodeId], dataValue => {
      if(dataValue.value.value == true) {
        // Werkstück wurde erfolgreich eingelagert
        if (workpiece) {
          opcClient.readNode(nodeIdCompletionTime, (node, dataValue) => {
            // Datensatz in der MongoDB updaten
            let timestamp = dataValue.value.value
            // Setzen:
            // - /state/storageProcesses[newIndex]/storageCompletionTime
            let lastStorageProcess = workpiece.state.storageProcesses.slice(-1)[0]
            lastStorageProcess.storageCompletionTime = timestamp

            // - /updatedAt
            workpiece.updatedAt = timestamp

            // Änderungen speichern
            workpiece.save()
          })
        }

        // OPCUA Variablen zurücksetzen
        console.log("OPCUA-Variablen zurücksetzen")
        setID(null, req, res, false, null)
        setShape(null, req, res, false, null)
        setColor(null, req, res, false, null)
        startStore(null, false, req, res, false, null)

        // Subscription wird nicht mehr benötigt, da Einlagern abgeschlossen wurde.
        // Also muss diese Variable nicht mehr überwacht werden.
        subscription.terminate()

        if (respond === false) {
          callback(null, req, res, false)
        } else {
          res.json(`Eingelagert, verarbeitet und auf Default zurückgesetzt`)
        }
      }
    })
  });
}

/**
 * Lagert ein Werkstück ein.
 * Dabei werden mehrere einzelne Schritte hintereinander ausgeführt,
 * alle im Zusammenspiel mit dem externen OPCUA-Server.
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {String} workpieceDocumentId ObjectId des Dokumentes
 */
function storeWorkpieceByWorkpieceId(req, res, workpieceDocumentId) { 
  Workpiece.findById(workpieceDocumentId, (err, workpiece) => {
    console.log(workpiece)

    async.waterfall([
      function passArgumentsToFirstFunction(callback) {
        callback(null, req, res, false)
      },
      isStorageReady,
      (req, res, respond, callback) => {
        console.log(`Is storage busy: ${isStorageBusy}`)
        if (isStorageBusy) {
          // Stop processing, if storage is already busy
          console.log("OPCUA Storage is ready, but isStorageBusy says its busy ...")
          res.json("OPCUA Storage is ready, but isStorageBusy says its busy ...")
        } else {
          isStorageBusy = true
          callback(null, req, res, false)
        }
      },
      async.apply(setID, "" + workpiece._id),
      async.apply(setShape, workpiece.shape.toValue),
      async.apply(setColor, workpiece.color.toValue),
      async.apply(startStore, workpiece, true),
      async.apply(subscribeStoreComplete, workpiece),
    ], (err, result) => {
      isStorageBusy = false
      console.log(`Is storage busy: ${isStorageBusy}`)

      if (err == null) {
        res.json("Workpiece stored")
      } else {  
        console.log(`err: ${err}`)
        console.log(`result: ${result}`)
        console.log("error occured")
      }
    })
  })
}













/**
 * Setzt die Farbe des Werkstückes, das ausgelagert werden soll.
 * 
 * Angelegte Test-Route:
 * http://localhost:5000/storage/set-color-outsource
 * 
 * @param {*} color 
 * @param {*} req 
 * @param {*} res 
 * @param {*} respond 
 * @param {*} callback 
 */
function setColorOutsource (color, req, res, respond, callback) {
  console.log("setColorOutsource")
  opcClient.call(async () => {
    let nodeId = await opcClient.findNodeId("2", "storage", "outsource", "workpiece", "color_to_value")

    opcClient.writeNode(nodeId, opcua.DataType.String, color, () => {
      console.log("Color gesetzt")
      if (respond === false)
      {
        if (callback !== null)
          callback(null, req, res, false)
      }
      else
        res.json(`Color auf ${color} gesetzt`)
    })
  });
}

/**
 * Setzt die Form des Werkstückes, das ausgelagert werden soll.
 * 
 * Angelegte Test-Route:
 * http://localhost:5000/storage/set-shape-outsource
 * 
 * @param {*} shape 
 * @param {*} req 
 * @param {*} res 
 * @param {*} respond 
 * @param {*} callback 
 */
function setShapeOutsource (shape, req, res, respond, callback) {
  console.log("setShapeOutsource")
  opcClient.call(async () => {
    let nodeId = await opcClient.findNodeId("2", "storage", "outsource", "workpiece", "shape_to_value")

    opcClient.writeNode(nodeId, opcua.DataType.String, shape, () => {
      console.log("Shape gesetzt")
      if (respond === false)
      {
        if (callback !== null)
          callback(null, req, res, false)
      }
      else
        res.json(`Shape auf ${shape} gesetzt`)
    })
  });
}

/**
 * Startet das Auslagern des Werkstückes.
 * 
 * Angelegte Test-Route:
 * http://localhost:5000/storage/start-store-outsource
 * 
 * @param {*} workpiece 
 * @param {*} shallStart 
 * @param {*} req 
 * @param {*} res 
 * @param {*} respond 
 * @param {*} callback 
 */
function startStoreOutsource(workpiece, shallStart, req, res, respond, callback) {
  console.log("startStoreOutsource")
  opcClient.call(async () => {
    let nodeId = await opcClient.findNodeId("2", "storage", "outsource", "start_outsource")
    let nodeIdStartingTime = await opcClient.findNodeId("2", "storage", "outsource", "starting_time")

    opcClient.writeNode(nodeId, opcua.DataType.Boolean, shallStart, () => {
      console.log("Start Outsource gesetzt")

      if (shallStart && workpiece) {
        // WST wird ausgelagert
        opcClient.readNode(nodeIdStartingTime, (node, dataValue) => {
          let timestamp = dataValue.value.value
          // Setzen:
          // - /state/storageProcesses[newIndex]/outsourceStartingTime
          let lastStorageProcess = workpiece.state.storageProcesses.slice(-1)[0]
          lastStorageProcess.outsourceStartingTime = timestamp

          // Wird ausgelagert
          workpiece.updatedAt = timestamp

          // Änderungen speichern
          workpiece.save()
        })
      }

      if (respond === false)
      {
        if (callback !== null)
          callback(null, req, res, false)
      }
      else
        res.json(`Start Outsource auf ${shallStart} gesetzt`)
    })
  });
}

/**
 * Legt einen Listener an, der beim Abschließen des Auslagerns
 * die Dokumente in der MongoDB updated sowie die OPCUA-Variablen
 * zurücksetzt.
 * 
 * Angelegte Test-Route:
 * http://localhost:5000/storage/subscribe-outsource-complete
 * 
 * @param {*} workpiece 
 * @param {*} req 
 * @param {*} res 
 * @param {*} respond 
 * @param {*} callback 
 */
function subscribeOutsourceComplete(workpiece, req, res, respond, callback) {
  console.log("subscribeOutsourceComplete")
  opcClient.call(async () => {
    let nodeId = await opcClient.findNodeId("2", "storage", "outsource", "complete")
    let nodeIdCompletionTime = await opcClient.findNodeId("2", "storage", "outsource", "completion_time")

    let subscription = opcClient.monitorNodes([nodeId], dataValue => {
      if(dataValue.value.value == true) {
        // Werkstück wurde erfolgreich ausgelagert
        if (workpiece) {
          opcClient.readNode(nodeIdCompletionTime, (node, dataValue) => {
            // Datensatz in der MongoDB updaten
            let timestamp = dataValue.value.value

            // - /state/storageProcesses[newIndex]/outsourceCompletionTime
            let lastStorageProcess = workpiece.state.storageProcesses.slice(-1)[0]
            lastStorageProcess.outsourceCompletionTime = timestamp

            // - /updatedAt
            workpiece.updatedAt = timestamp

            // Änderungen speichern
            workpiece.save()
          })
        }

        // OPCUA Variablen zurücksetzen
        console.log("OPCUA-Variablen zurücksetzen")
        setShapeOutsource(null, req, res, false, null)
        setColorOutsource(null, req, res, false, null)
        startStoreOutsource(null, false, req, res, false, null)

        // Subscription wird nicht mehr benötigt, da Auslagern abgeschlossen wurde.
        // Also muss diese Variable nicht mehr überwacht werden.
        subscription.terminate()

        if (respond === false) {
          callback(null, req, res, false)
        } else {
          res.json(`Ausgelagert, verarbeitet und auf Default zurückgesetzt`)
        }
      }
    })
  });
}

/**
 * Lagert ein Werkstück aus.
 * Dabei werden mehrere einzelne Schritte hintereinander ausgeführt,
 * alle im Zusammenspiel mit dem externen OPCUA-Server.
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {String} workpieceDocumentId ObjectId des Dokumentes
 */
function outsourceWorkpieceByWorkpieceId(req, res, workpieceDocumentId) {
  console.log("outsourceWorkpieceByWorkpieceId")
  Workpiece.findById(workpieceDocumentId, (err, workpiece) => {
    console.log(workpiece)

    async.waterfall([
      function passArgumentsToFirstFunction(callback) {
        callback(null, req, res, false)
      },
      isStorageReady,
      (req, res, respond, callback) => {
        console.log(`Is storage busy: ${isStorageBusy}`)
        if (isStorageBusy) {
          // Stop processing, if storage is already busy
          console.log("OPCUA Storage is ready, but isStorageBusy says its busy ...")
          if (res !== null) {
            res.json("OPCUA Storage is ready, but isStorageBusy says its busy ...")
          }
        } else {
          isStorageBusy = true
          callback(null, req, res, false)
        }
      },
      async.apply(setColorOutsource, workpiece.color.toValue),
      async.apply(setShapeOutsource, workpiece.shape.toValue),
      async.apply(startStoreOutsource, workpiece, true),
      async.apply(subscribeOutsourceComplete, workpiece),
    ], (err, result) => {
      isStorageBusy = false
      console.log(`Is storage busy: ${isStorageBusy}`)

      if (err == null) {
        if (res !== null) {
          res.json("Workpiece outsourced")
        }
      } else {  
        console.log(`err: ${err}`)
        console.log(`result: ${result}`)
        console.log("error occured")
      }
    })
  })
}











/**
 * 
 * 
 * TESTS
 * 
 * 
 */


// http://localhost:5000/storage/store-all
router.route('/store-all').get((req, res) => {
  console.log("####################")
  console.log("store-all")
  console.log("####################")

  // Kreis - Blau
  // let workpieceDocumentId = "5ee72e8e13237f05339c78cc"
  // Kreis - Orange
  storeWorkpieceByWorkpieceId(req, res, "5ee72ea213237f05339c78d0")
});

// http://localhost:5000/storage/store-all2
router.route('/store-all2').get((req, res) => {
  console.log("####################")
  console.log("store-all2")
  console.log("####################")

  // Kreis - Blau
  storeWorkpieceByWorkpieceId(req, res, "5ee72e8e13237f05339c78cc")
  // Kreis - Orange
  // let workpieceDocumentId = "5ee72ea213237f05339c78d0"
});

// http://localhost:5000/storage/outsource-all
router.route('/outsource-all').get((req, res) => {
  console.log("####################")
  console.log("outsource-all")
  console.log("####################")

  // Kreis - Blau
  // let workpieceDocumentId = "5ee72e8e13237f05339c78cc"
  // Kreis - Orange
  outsourceWorkpieceByWorkpieceId(req, res, "5ee72ea213237f05339c78d0")
});

// http://localhost:5000/storage/outsource-all2
router.route('/outsource-all2').get((req, res) => {
  console.log("####################")
  console.log("outsource-all2")
  console.log("####################")

  // Kreis - Blau
  outsourceWorkpieceByWorkpieceId(req, res, "5ee72e8e13237f05339c78cc")
  // Kreis - Orange
  // let workpieceDocumentId = "5ee72ea213237f05339c78d0"
});




/**
 * 
 * 
 * ROUTEN
 * 
 * 
 */



// Allgemein
router.route('/is-storage-ready').get((req, res) => { isStorageReady(req, res, true, null) });

// Einlagern
router.route('/set-id').get((req, res) => { setID("BlauKreis-200615-4", req, res, true, null) });
router.route('/set-shape').get((req, res) => { setShape("Kreis", req, res, true, null) });
router.route('/set-color').get((req, res) => { setColor("Blau", req, res, true, null) });
router.route('/start-store').get((req, res) => { startStore(null, true, req, res, true, null) });
router.route('/subscribe-store-complete').get((req, res) => { subscribeStoreComplete(req, res, true, null) });

// Auslagern
router.route('/set-color-outsource').get((req, res) => { setColorOutsource("Blau", req, res, true, null) });
router.route('/set-shape-outsource').get((req, res) => { setShapeOutsource("Kreis", req, res, true, null) });
router.route('/start-store-outsource').get((req, res) => { startStoreOutsource(null, true, req, res, true, null) });
router.route('/subscribe-outsource-complete').get((req, res) => { subscribeOutsourceComplete(null, req, res, true, null) });



module.exports = {
  storeWorkpieceByWorkpieceId: storeWorkpieceByWorkpieceId,
  outsourceWorkpieceByWorkpieceId: outsourceWorkpieceByWorkpieceId,
  isStorageBusy: isStorageBusy,
  router: router 
};