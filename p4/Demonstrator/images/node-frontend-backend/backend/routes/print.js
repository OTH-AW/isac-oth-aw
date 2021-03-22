const router = require('express').Router();
const opcua = require("node-opcua");
const url = require('url')
const opcuaConnector = require('../helper/opcua/connector')
let StatePlaces = require('../helper/places/statePlaces.js')
const valueConverter = require('../helper/mongo/valueConverter')
var async = require("async");
let Workpiece = require('../models/workpiece.model');



class PrintClient {
  constructor(endpoint) {
    this.endpoint = endpoint // URL
    this.printerName = "Octoprint" // Root-Nodename für die Drucker-Informationen

    this.client = new opcuaConnector.Client(endpoint)

    this.isOnline = this.isOnline.bind(this)
    this.isPrinting = this.isPrinting.bind(this)
    this.validateWorkpiece = this.validateWorkpiece.bind(this)
    this.setShape = this.setShape.bind(this)
    this.startPrint = this.startPrint.bind(this)
    this.startPrintWorkpiece = this.startPrintWorkpiece.bind(this)

    this.getCurrentPrintWst = this.getCurrentPrintWst.bind(this)
    this.getEquippedColor = this.getEquippedColor.bind(this)
    this.getInfo = this.getInfo.bind(this)
  }

  isOnline (req, res, respond, callback) {
    console.log("isOnline")
    this.client.call(async () => {
      let nodeId = await this.client.findNodeId("2", this.printerName, "base_information", "state_online")
      this.client.readNode(nodeId, (node, dataValue) => {
        console.log(`Status online: ${dataValue.value.value}`)
        console.log(typeof dataValue.value.value)
        if (dataValue.value.value === true) {
          if (respond === false)
            callback(null, req, res, false)
          else
            res.json("is online")
        } else {
          console.log("is not online :(")
          res.json("is not online :(")
        }
      })
    })
  }
  
  isPrinting (req, res, respond, callback) {
    console.log("isPrinting")
    this.client.call(async () => {
      let nodeId = await this.client.findNodeId("2", this.printerName, "state", "printing")
      console.log(nodeId)
      this.client.readNode(nodeId, (node, dataValue) => {
        console.log(`Is printing: ${dataValue.value.value}`)
        if (dataValue.value.value) {
          if (res !== null) {
            res.json("True")
          }
        } 
        else {
          if (respond === false)
            callback(null, req, res, false)
          else
            res.json("False")
        }
      })
    });
  }
  
  validateWorkpiece (color, req, res, respond, callback) {
    console.log("validateWorkpiece")
    if (typeof color === "undefined") {
      color = valueConverter.readColor(req, res)
    } 

    this.client.call(async () => {
      let nodeIdColorEquipped = await this.client.findNodeId("2", this.printerName, "base_information", "color_equipped")
      let nodeIdColorToValue = await this.client.findNodeId("2", this.printerName, "color", "color_to_value")
      this.client.readNode(nodeIdColorEquipped, (node, dataValue) => {
        console.log(`Color equipped @ Printer: ${dataValue.value.value}`)
        console.log(`Requested Color @ WST: ${color}`)
        
        if (dataValue.value.value === color) {
          // Druckfarbe entspricht der gewünschten Farbe
          this.client.writeNode(nodeIdColorToValue, opcua.DataType.String, color, () => {
            console.log("Farbe gesetzt")
            if (respond === false)
              callback(null, req, res, false)
            else
              res.json(`Farbe auf ${color} gesetzt`)
          })
        } else {
          console.log(`Falsche Farbe im Drucker (${dataValue.value.value})`)
          res.json(`Falsche Farbe im Drucker (${dataValue.value.value})`)
        }
      })
    });
  }
  
  setShape (shape, req, res, respond, callback) {
    console.log("setShape")
    if (typeof shape === "undefined") {
      shape = valueConverter.readShape(req, res)
    } 

    this.client.call(async () => {
      let nodeId = await this.client.findNodeId("2", this.printerName, "shape", "shape_to_value")
      this.client.writeNode(nodeId, opcua.DataType.String, shape, () => {
        console.log("Form gesetzt")
        if (respond === false)
          callback(null, req, res, false)
        else
          res.json(`Form auf ${shape} gesetzt`)
      })
    });
  }
  
  createWorkpieceInDatabase (colorValue, shapeValue, req, res, respond, callback) {
    const updatedAt = Date.now()
    const createdAt = Date.now()

    if (typeof colorValue === "undefined") {
      colorValue = valueConverter.readColor(req, res)
    } 

    if (typeof shapeValue === "undefined") {
      shapeValue = valueConverter.readShape(req, res)
    } 

    const color = {
      "toValue": colorValue,
    }
    const shape = {
      "toValue": shapeValue,
    }
    const state = {
      id: StatePlaces.CREATED_AND_IN_PRODUCTION_QUEUE.id,
      message: StatePlaces.CREATED_AND_IN_PRODUCTION_QUEUE.message,
      place: StatePlaces.CREATED_AND_IN_PRODUCTION_QUEUE.place
    }
    const order = null
  
    // Werkstück wird virtuell erstellt
    const newWorkpiece = new Workpiece({
      updatedAt,
      createdAt,
      color,
      shape,
      state,
      order
    })
  
    console.log("Create workpiece entry in MongoDB")
    newWorkpiece.save()
    .then(
      (wst) => {
        if (respond === false)
          callback(null, wst, req, res, false)
        else
          res.json('Workpiece added!')
      }
    )
    .catch(err => 
      {
        res.status(400).json('Error: ' + err)
      }
    );
  }
  
  startPrint (wst, req, res, respond, callback) {
    console.log("startPrint")
    
    this.client.call(async () => {
      let nodeId = await this.client.findNodeId("2", this.printerName, "base_information", "start_printing")
      this.client.writeNode(nodeId, opcua.DataType.Boolean, true, () => {
        console.log("Printing started")
        if (wst !== null) {
          let timestamp = Date.now()
          
          const state = {
            id: StatePlaces.RUNNING_PRINT.id,
            message: StatePlaces.RUNNING_PRINT.message,
            timeEstimate: wst.state.timeEstimate,
            timeCurrent: wst.state.timeCurrent,
            timeLeft: wst.state.timeLeft,
            completion: wst.state.completion,
            printStartingTime: timestamp,
            printCompletionTime: wst.state.printCompletionTime,
            controlProcesses: wst.state.controlProcesses || [],
            storageProcesses: wst.state.storageProcesses || [],
            place: StatePlaces.RUNNING_PRINT.place
          }
  
          wst.state = state
          
          wst.updatedAt = timestamp
          wst.save()
        }
  
        this.progressDemoPrintProcess((progress) => {
            // Callback bei einzelnen abgeschlossenen Intervallabschnitten
            console.log(`%%% progress demo print ${progress} %%%`)
          }, () => {
            // Callback, wenn abgeschlossen
            if (wst !== null) {
              let timestamp = Date.now()
              wst.updatedAt = timestamp
              wst.state.printCompletionTime = timestamp
              wst.save()
            }
  
            if (respond === false) {
              callback(null, "done")
            }
            else {
              res.json("Printing started")
            }
        })
      })
    });
  }
  
  progressDemoPrintProcess (intervallCallback, callback) {
    let timeSteps = 400
    setTimeout(() => {
      intervallCallback(20)
      setTimeout(() => {
        intervallCallback(40)
        setTimeout(() => {
          intervallCallback(60)
          setTimeout(() => {
            intervallCallback(80)
            setTimeout(() => {
              intervallCallback(100)
              callback()
            }, timeSteps)
          }, timeSteps)
        }, timeSteps)
      }, timeSteps)
    }, timeSteps)
  }
     
  startPrintWorkpiece (workpiece, callbackSuccess) {
    console.log("startPrintWorkpiece")

    let color = ""
    let shape = ""
    if (workpiece.hasOwnProperty('order')) {
      color = workpiece.order.color.toValue
      shape = workpiece.order.shape.toValue
    } else {
      color = workpiece.color.toValue
      shape = workpiece.shape.toValue
    }

    async.waterfall([
      function passArgumentsToFirstFunction(callback) {
        callback(null, null, null, false)
      },
      this.isOnline,
      this.isPrinting,
      async.apply(this.validateWorkpiece, color),
      async.apply(this.setShape, shape),
      // async.apply(this.createWorkpieceInDatabase, color, shape),
      async.apply(this.startPrint, workpiece, null, null, false, callbackSuccess)
    ], (err, result) => {
      if (err == null) {
        console.log("Print started")
      } else {  
        console.log(`err: ${err}`)
        console.log(`result: ${result}`)
        console.log("error occured")
      }
    })
  }
  
  getCurrentPrintWst (color, callback) { 
    Workpiece.find({
      "color.toValue": {$eq: color},
      "state.id": {$eq: StatePlaces.RUNNING_PRINT.id},
    })
    .sort({updatedAt: 1}) // 1: Aufsteigend, -1: Absteigend
    .then(workpieces => {
      if (workpieces.length > 0) {
        // Derzeit gedrucktes WST auslesen
        callback(workpieces[0])
      } else {
        callback(null)
      }
    })
    .catch(err => res.status(400).json('Error: ' + err))
  }

  async getEquippedColor () {
    let nodeId_BaseInformation_Color = await this.client.findNodeId("2", this.printerName, "base_information", "color_equipped")
    let printer_BaseInformation_Color = (await this.client.readNodeAsync(nodeId_BaseInformation_Color)).value.value
    return printer_BaseInformation_Color
  }

  getInfo (callback) { 
    this.client.call(async () => {
      // NodeId
      // BaseInformation
      let nodeId_BaseInformation_Name = await this.client.findNodeId("2", this.printerName, "base_information", "printer")
      let nodeId_BaseInformation_StateOnline = await this.client.findNodeId("2", this.printerName, "base_information", "state_online")
      let nodeId_BaseInformation_StateMessagePrinter = await this.client.findNodeId("2", this.printerName, "base_information", "state_message_printer")
      // State
      let nodeId_State_Printing = await this.client.findNodeId("2", this.printerName, "state", "printing")
      let nodeId_State_Completion = await this.client.findNodeId("2", this.printerName, "state", "completion")
      let nodeId_State_TimeCurrent = await this.client.findNodeId("2", this.printerName, "state", "time_current")
      let nodeId_State_TimeEstimate = await this.client.findNodeId("2", this.printerName, "state", "time_estimate")

      // Values
      // BaseInformation
      let printer_BaseInformation_Name = (await this.client.readNodeAsync(nodeId_BaseInformation_Name)).value.value
      let printer_BaseInformation_Color = await this.getEquippedColor()
      let printer_BaseInformation_StateOnline = (await this.client.readNodeAsync(nodeId_BaseInformation_StateOnline)).value.value
      let printer_BaseInformation_StateMessagePrinter = (await this.client.readNodeAsync(nodeId_BaseInformation_StateMessagePrinter)).value.value
      // State
      let printer_State_Printing = (await this.client.readNodeAsync(nodeId_State_Printing)).value.value
      let printer_State_Completion = (await this.client.readNodeAsync(nodeId_State_Completion)).value.value
      let printer_State_TimeCurrent = (await this.client.readNodeAsync(nodeId_State_TimeCurrent)).value.value
      let printer_State_TimeEstimate = (await this.client.readNodeAsync(nodeId_State_TimeEstimate)).value.value

      this.getCurrentPrintWst(printer_BaseInformation_Color, (wst) => {
        callback({
            base_information: {
              name: printer_BaseInformation_Name, // Renkforce RF2000
              color: printer_BaseInformation_Color, // Blau
              state_online: printer_BaseInformation_StateOnline, // Drucker online
              state_message_printer: printer_BaseInformation_StateMessagePrinter // ??? Was macht der Drucker gerade
            },
            state: {
              printing: printer_State_Printing, // Am Drucken
              completion: printer_State_Completion, // % Fertigstellung
              time_current: printer_State_TimeCurrent, // Druckt seit 0.15h
              time_estimate: printer_State_TimeEstimate, // Schätzung verbleibende Zeit
            },
            current: wst // Derzeit gedrucktes Document
          }
        )
      })
    })
  }
}

// Welche Drucker gibt es
let printers = [
  new PrintClient(process.env.OPCUA_TP1_URI_1),
  new PrintClient(process.env.OPCUA_TP1_URI_2)
]

/**
 * Druckt ein Werkstück zu einem Dokument.
 * Zuerst wird geprüft, welcher Drucker verwendet werden muss.
 * Anschließend wird der Druckauftrag an den Drucker übermittelt.
 * Dabei werden mehrere einzelne Schritte hintereinander ausgeführt,
 * alle im Zusammenspiel mit dem externen OPCUA-Server.
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {String} documentId ObjectId des Dokumentes
 */
function printDocumentByDocumentId(documentId) {
  Workpiece.findById(documentId, (err, workpiece) => {
    if (workpiece === null) {
      return
    }
    
    console.log(workpiece)

    let color = ""
    if (workpiece.hasOwnProperty('order')) {
      color = workpiece.order.color.toValue
    } else {
      color = workpiece.color.toValue
    }
    
    printers.forEach((printer) => {
      printer.client.call(async () => {
        let equippedColor = await printer.getEquippedColor()
        if (equippedColor === color) {
          console.log(printer.endpoint)
          printer.startPrintWorkpiece(workpiece, () => {
            console.log("Druck abgeschlossen")
          })
        }
      })
    })
  })
}


// http://localhost:5000/pi/printed-wst?color=blue
// http://localhost:5000/pi/printed-wst?color=orange



// Informationen zu den Druckern auslesen
router.route('/printers').get((req, res) => {
  let result = []

  printers.forEach((printer) => {
    printer.getInfo((info) => {
      result.push(info)
      if (printers.length === result.length) {
        // Alle Informationen erhalten
        res.json(result)
      }
    })
  })
})








































































router.route('/print-wst').get((req, res) => { 
  printDocumentByDocumentId("5ee72e9413237f05339c78cd") 
  res.json("Druck gestartet")
});
  
router.route('/create-workpiece').get((req, res) => { createWorkpieceInDatabase(req, res, true, null) });
router.route('/print-all').get((req, res) => {
  console.log("print-all")
  async.waterfall([
    function passArgumentsToFirstFunction(callback) {
      callback(null, req, res, false)
    },
    isOnline,
    isPrinting,
    validateWorkpiece,
    setShape,
    createWorkpieceInDatabase,
    startPrint
  ], (err, result) => {
    if (err == null) {
      res.json("Print started")
    } else {  
      console.log(`err: ${err}`)
      console.log(`result: ${result}`)
      console.log("error occured")
    }
  })
});
router.route('/is-online').get((req, res) => { isOnline(req, res, true, null) });
router.route('/is-printing').get((req, res) => { isPrinting(req, res, true, null) });
router.route('/validate-workpiece').get((req, res) => { validateWorkpiece(req, res, true, null) });
router.route('/set-shape').get((req, res) => { setShape(req, res, true, null) });
router.route('/start-print').get((req, res) => { startPrint(null, req, res, true, null) });
router.route('/print-finished').get((req, res) => {
  this.client.call(async () => {
    let nodeId = await this.client.findNodeId("2", "Octoprint RF2000", "base_information", "state_online")
    this.client.writeNode(nodeId, opcua.DataType.Boolean, false, () => {
      console.log("Printing finished")
      res.json("Printing finished")

      // TODO
      // SOLLTE NICHT NOTWENDIG SEIN!
      setTimeout(() => {
        this.client.writeNode(nodeId, opcua.DataType.Boolean, true, () => {
          console.log("Set Druckbereit")
        })
      }, 1000)
    })
  });
})

module.exports = {
  printDocumentByDocumentId: printDocumentByDocumentId,
  router: router
}