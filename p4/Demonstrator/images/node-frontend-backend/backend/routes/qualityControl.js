const router = require('express').Router();
const opcua = require("node-opcua");

let Workpiece = require('../models/workpiece.model');
let StatePlaces = require('../helper/places/statePlaces.js');
const workpiece = require('./workpiece');

function startQcControl (req, res, workpieceDocumentId) {
  console.log("startQcControl")

  Workpiece.findById(workpieceDocumentId, (err, workpiece) => {
    progressDemoControlProcess((progress) => {
      // Callback bei einzelnen abgeschlossenen Intervallabschnitten
      console.log(`%%% progress demo control process ${progress} %%%`)
    }, () => {
      console.log("Prüfung abgeschlossen")
      // Callback, wenn abgeschlossen
      if (workpiece !== null) {
        let timestamp = Date.now()
        
        let lastControlProcess = workpiece.state.controlProcesses.slice(-1)[0]

        // TODO: TP3 Umsetzung
        // Zum Testen können hier die Werte gesetzt werden.
        lastControlProcess.function = true // Zustand ok
        lastControlProcess.color = true // Entspricht Farbe dem erwarteten Wert
        lastControlProcess.shape = true // Entspricht Form dem erwarteten Wert

        workpiece.color.actualValue = workpiece.color.toValue
        // workpiece.color.actualValue = "Orange"
        workpiece.shape.actualValue = workpiece.shape.toValue
        // workpiece.shape.actualValue = "Viereck"

        // Quality Control abgeschlossen
        lastControlProcess.controlCompletionTime = timestamp
        
        workpiece.updatedAt = timestamp
        workpiece.save()
      }
    })
  })
}

function progressDemoControlProcess (intervallCallback, callback) {
  let timeSimulateQualityControl = 15 * 1000 // Sekunden * 1000 => ms
  setTimeout(() => {
    intervallCallback(20)
    console.log("Prüfe allgemeinen Zustand")
    setTimeout(() => {
      intervallCallback(40)
      console.log("Prüfe Form")
      setTimeout(() => {
        intervallCallback(60)
        console.log("Prüfe Farbe")
        setTimeout(() => {
          intervallCallback(80)
          setTimeout(() => {
            intervallCallback(100)
            callback()
          }, timeSimulateQualityControl / 5)
        }, timeSimulateQualityControl / 5)
      }, timeSimulateQualityControl / 5)
    }, timeSimulateQualityControl / 5)
  }, timeSimulateQualityControl / 5)
}

function activeWorkpieces (req, res) {
  Workpiece.find({
    "state.id": {
      $in : [3, 7] // Befindet sich am Prüfungsort
    },
    "state.controlProcesses": {
      $exists: true,
      $ne: []
    }
  })
  .then(workpieces => {
    let result = []

    workpieces.forEach(workpiece => {
      let lastControlProcess = workpiece.state.controlProcesses.slice(-1)[0]
      if (lastControlProcess.controlCompletionTime === null) {
        // Befindet sich noch in der aktiven Prüfungsphase
        result.push(workpiece)
      } else {
        // Befindet sich zwar am Prüfungsort, die Prüfung selbst ist aber
        // bereits abgeschlossen worden. Wst wartet auf den
        // Weitertransport.
        result.push(workpiece)
      }
    })

    return res.json(result)
  })
  .catch(err => res.status(400).json('Error: ' + err))
}

function history (req, res) {
  Workpiece.find({
      "state.controlProcesses": {
        $exists: true,
        $ne: []
      }
    })
    .then(workpieces => {
      let result = {
        "colors": {
          "blue": 0,
          "orange": 0
        },
        "shapes": {
          "circle": 0,
          "square": 0,
          "triangle": 0
        },
        "faulty": 0
      }

      workpieces.forEach(workpiece => {
        workpiece.state.controlProcesses.forEach(controlProcess => {
          // let lastControlProcess = workpiece.state.controlProcesses.slice(-1)[0]

          // Prüfgang war grundsätzlich erfolgreich
          // Farbprüfungen erfolgreich?
          if (controlProcess.color === true) {
            if (workpiece.color.actualValue === "Blau") {
              result["colors"]["blue"]++
            } else if (workpiece.color.actualValue === "Orange") {
              result["colors"]["orange"]++
            }
          } else {
            // Farbprüfung nicht erfolgreich
          }


          // Geometrieprüfung erfolgreich?
          if (controlProcess.shape === true) {
            if (workpiece.shape.actualValue === "Kreis") {
              result["shapes"]["circle"]++
            } else if (workpiece.shape.actualValue === "Viereck") {
              result["shapes"]["square"]++
            } else if (workpiece.shape.actualValue === "Dreieck") {
              result["shapes"]["triangle"]++
            }
          } else {
            // Geometrieprüfung nicht erfolgreich
          }
          

          if (controlProcess.function !== true) {
            // Letzter Prüfgang war fehlerhaft
            result["faulty"]++
          }
        })
      });
      

      
      return res.json(result)
    })
    .catch(err => res.status(400).json('Error: ' + err))
}

router.route('/').get((req, res) => { activeWorkpieces(req, res) });
router.route('/history').get((req, res) => { history(req, res) });

module.exports = {
  startQcControl: startQcControl,
  router: router 
};