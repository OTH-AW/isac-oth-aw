const router = require('express').Router()
let Workpiece = require('../models/workpiece.model')
let StatePlaces = require('../helper/places/statePlaces.js')
const url = require('url')
const mergeHelper = require('../helper/mongo/merge')
const valueConverter = require('../helper/mongo/valueConverter')
let printClient = require('./print.js')
const storage = require('./storage')

// https://docs.mongodb.com/manual/reference/change-events/
// https://zgadzaj.com/development/docker/docker-compose/turning-standalone-mongodb-server-into-a-replica-set-with-docker-compose
// https://docs.mongodb.com/manual/reference/method/db.collection.watch/
Workpiece.watch({ fullDocument: "updateLookup"}).
  on('change', data => { 
    // console.log(data.operationType)
    if (data.operationType === "insert") {
      // Neues Dokument angelegt
      console.log("Ein Dokument wurde hinzugefügt")

      if ("order" in data.fullDocument) {
        newOrderAdded(data)
      } else {
        newWorkpieceAdded(data)
      }
    }
    else {
      // Ein Dokument wurde geändert
      console.log("Ein Dokument wurde aktualisiert")

      if (typeof data.fullDocument !== "undefined") {
        if (data.fullDocument.state.id === StatePlaces.CREATED_AND_IN_PRODUCTION_QUEUE.id) {
          // Neue Bestellung bzw. Werkstück erstellt
          // Kann gedruckt werden
          // let color = data.fullDocument.color.toValue
          // console.log(`Zur Warteschlange für Druck hinzugefügt: ${color}`)
          checkPrintWorkpiece(data.fullDocument)
        } else if (data.fullDocument.state.id === StatePlaces.POST_PRODUCTION_TRANSFERING_TO_QC.id) {
          let color = data.fullDocument.color.toValue
          console.log(`Druck abgeschlossen: ${color}`)
          // Pi hat ein WST als gedruckt erkannt
          // Es kann jetzt ein neues WST der Farbe <color> gedruckt werden
          checkPrintWorkpiece(data.fullDocument)
        } else if (data.fullDocument.state.id === StatePlaces.POST_PRODUCTION_RUNNING_QC.id ||
                   data.fullDocument.state.id === StatePlaces.POST_STORAGE_RUNNING_QC.id) {
          // QC gestartet
        }
      }
    }
  });

// Druckaufträge überwachen ...
setInterval(() => {
  // Der Drucker fällt manchmal aus ...
  let dummyOrange = {
    state: {
      id: StatePlaces.CREATED_AND_IN_PRODUCTION_QUEUE.id
    },
    color: {
      toValue: "Orange"
    }
  }

  let dummyBlue = {
    state: {
      id: StatePlaces.CREATED_AND_IN_PRODUCTION_QUEUE.id
    },
    color: {
      toValue: "Blau"
    }
  }

  checkPrintWorkpiece(dummyOrange)
  checkPrintWorkpiece(dummyBlue)
}, 10000)

// Lager überwachen ...
setInterval(() => {
  // Check Lager
  checkIsThereSomethingToOutsource()
}, 3000)

/**
 * Durch den Trigger auf die Dokumente in der Datenbank wurde erkannt,
 * dass eine neue Bestellung hinzugefügt wurde. 
 * @param {*} data 
 */
function newOrderAdded (data) {
  mergeHelper.tryMergeOrdersAndWorkpieces(null, null, () => {
    startPrintForOrdersWithoutWst()
    checkPrintWorkpiece (data.fullDocument)
  });
}

/**
 * Durch den Trigger auf die Dokumente in der Datenbank wurde erkannt,
 * dass ein neues Werkstück hinzugefügt wurde. 
 * @param {*} data 
 */
function newWorkpieceAdded (data) {
  mergeHelper.tryMergeOrdersAndWorkpieces(null, null, () => {
    checkPrintWorkpiece (data.fullDocument)
  });
}

function startPrintForOrdersWithoutWst() {
  // Wenn es zu einer Bestellung kein passendes Werkstück gibt, muss dieses
  // neu produziert werden. Dazu muss ein WST angelegt werden.
  Workpiece.find({ $and: [
    {order: {$ne: null}},
    {workpieceId: {$eq: null}}
  ]}).then(orders => {
    console.log("--- Orders, zu denen WST-Dokumente angelegt werden müssen:")
    orders.forEach(order => {
      console.log(order._id + "-" + order.order.shape.toValue + "-" + order.order.color.toValue)
      if (!mergeHelper.shallDenyChanges()) {
        createWst(null, null, order.order.color.toValue, order.order.shape.toValue)
      }
    })
  })
}

/**
 * Prüfe, ob ein WST in Druck gegeben werden kann
 * @param {*} data 
 */
function checkPrintWorkpiece (data) {
  // Kann ein weiteres Werkstück in Druck gegeben werden
  if (!("color" in data))
  {
    // Dokument ist kein Werkstück
    // Dokument ist eine Bestellung
    // Bestellungen werden gedruckt, indem ein Werkstücksauftrag
    // angelegt wird.
    return
  }

  if (data.state.id === StatePlaces.CREATED_AND_IN_PRODUCTION_QUEUE.id || 
    data.state.id === StatePlaces.POST_PRODUCTION_TRANSFERING_TO_QC.id) {
    // Neue Bestellung bzw. Werkstück erstellt
    let color = data.color.toValue
    // Prüfe, ob gedruckt werden kann
    canPrintBeStarted(color, (wst) => {
      let printPossible = wst == null
      // console.log(`Druckauftrag möglich? ${color} => ${printPossible}`)
      if (printPossible) {
        // Druck der Farbe color möglich
        // Suche WST, das mit dieser Farbe gedruckt werden soll
        startPrintWst(color, (wstPrint) => {
          let wstExists = wstPrint !== null
          if (wstExists) {
            // Druck durchführen
            console.log(`Druckauftrag übermitteln (${wstPrint._id})`)
            printClient.printDocumentByDocumentId(wstPrint._id)
          } else {
            // console.log("Keine offenen Druckaufträge")
          }
        })
      }
    })
  }   
}

function canPrintBeStarted (color, callback) {
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

function startPrintWst (color, callback) {
  Workpiece.find({
    "color.toValue": {$eq: color},
    "state.id": {$eq: StatePlaces.CREATED_AND_IN_PRODUCTION_QUEUE.id},
  })
  .sort({updatedAt: 1}) // 1: Aufsteigend, -1: Absteigend
  .then(workpieces => {
    if (workpieces.length > 0) {
      // Nächstes WST auslesen
      callback(workpieces[0])
    } else {
      callback(null)
    }
  })
  .catch(err => res.status(400).json('Error: ' + err))
}

/**
 * Prüft, ob eine neue Bestellung ausgelagert werden kann.
 */
function checkIsThereSomethingToOutsource () {
  Workpiece.find({
    "state.id": {$eq: StatePlaces.IN_STORAGE.id},
    "order": {$ne: null},
  })
  .sort({updatedAt: 1}) // 1: Aufsteigend, -1: Absteigend
  .then(workpieces => {
    if (workpieces.length > 0) {
      // Nächstes WST auslesen, das ausgelagert werden soll
      let outsourcableWorkpieces = []
      workpieces.forEach((wst) => {
        let lastStorageProcess = wst.state.storageProcesses.slice(-1)[0]
        if (lastStorageProcess.storageStartingTime !== null &&
            lastStorageProcess.storageCompletionTime !== null &&
            lastStorageProcess.outsourceStartingTime === null &&
            lastStorageProcess.outsourceCompletionTime === null) {
          outsourcableWorkpieces.push(wst)
        }
      })

      let wstOutsource = outsourcableWorkpieces[0]
      if (typeof wstOutsource !== "undefined" && !storage.isStorageBusy) {
        // Storage kann einen neuen Auftrag entgegennehmen
        // Es wird gerade nichts ein- oder ausgelagert
        storage.outsourceWorkpieceByWorkpieceId(null, null, wstOutsource._id)
      }
    }
  })


}





/**
 * Gibt alle Dokumente zurück, die mit einem Werkstück versehen
 * worden sind.
 * Dh.:
 * - Werkstücke ohne Bestellungen
 * - Werkstücke mit Bestellungen
 */
router.route('/').get((req, res) => {
  Workpiece.find({workpieceId: {$ne: null}})
    .then(workpieces => res.json(workpieces))
    .catch(err => res.status(400).json('Error: ' + err))
})

/**
 * Gibt Werkstücke zurück, die noch keiner Bestellung
 * zugeordnet worden sind.
 */
router.route('/unused').get((req, res) => {
  Workpiece.find({order: {$eq: null}})
    .then(workpieces => res.json(workpieces))
    .catch(err => res.status(400).json('Error: ' + err))
})

/**
 * Gibt alle Bestellungen zurück
 */
router.route('/orders').get((req, res) => {
  Workpiece.find({order: {$ne: null}})
    .then(workpieces => res.json(workpieces))
    .catch(err => res.status(400).json('Error: ' + err))
})

/**
 * Gibt alle Dokumente zurück
 * - Bestellungen
 * - Werkstücke ohne Bestellungen
 * - Werkstücke mit Bestellungen
 */
router.route('/all').get((req, res) => {
  Workpiece.find()
    .then(workpieces => res.json(workpieces))
    .catch(err => res.status(400).json('Error: ' + err))
})

/**
 * Gibt Dokumente zurück, die dem Lager zugeordnet werden können.
 * Dh.:
 * - 4: Auf dem Weg zum Lager nach Prüfung
 * - 5: Eingelagert
 * - 6: Auf dem Weg zur Prüfung, nach Lager
 */
router.route('/storage').get((req, res) => {
  Workpiece.find({"state.id": {$in : [4, 5, 6]}})
    .then(workpieces => res.json(workpieces))
    .catch(err => res.status(400).json('Error: ' + err))
})














router.route('/update').get((req, res) => {
  // "Wird gedruckt."
  // let query = {order: {$eq: null}, "state.id": {$eq: 1}}
  // let update = {
  //   "state.place": StatePlaces.RUNNING_PRINT.place
  // };

  // "Eingelagert."
  // let query = {order: {$eq: null}, "state.id": {$eq: 5}}
  // let update = {
  //   "state.place": StatePlaces.IN_STORAGE.place
  // };

  // Update durchführen
  // let options = { multi: true, upsert: true };
  // Workpiece.updateMany(query, update, options, (err, doc) => {

  // });

  // Workpiece.find(query)
  //   .then(workpieces => res.json(workpieces))
  //   .catch(err => res.status(400).json('Error: ' + err))
})

router.route('/update2').get((req, res) => {
  // {order: {$eq: null}, "state.id": {$eq: 0}}

  // {order: {$eq: null}, "state.id": {$eq: 1}}
  
  // {order: {$eq: null}, "state.id": {$eq: 4}}
  // {order: {$ne: null}, "state.id": {$eq: 4}}
  
  // {order: {$eq: null}, "state.id": {$eq: 5}}
  
  // {order: {$eq: null}, "state.id": {$eq: 6}}

  // "Set Order."
  let query = {workpieceId: {$eq: "SchwarzDreieck-200615-1"}}
  let update = {
    "order": {
      "customer": {
        "firstname": "Vorname 10",
        "name": "Nachname",
        "zip": 123,
        "email": "vorname@name",
        "address": "here",
        "address": "14",
        "ort": "there"
      },
      "shape": {
        "toValue": "Dreieck"
      },
      "color": {
        "toValue": "Grün"
      },
      "number": "abc10",
      "updatedAt": "2020-05-10T08:17:18.714Z",
      "createdAt": "2020-05-10T08:17:18.714Z"
    }
  };

  // Update durchführen
  let options = { multi: false, upsert: true };
  Workpiece.findOneAndUpdate(query, update, options, (err, doc) => {

  });

  Workpiece.find(query)
    .then(workpieces => res.json(workpieces))
    .catch(err => res.status(400).json('Error: ' + err))
})

























/**
 * Erstellt eine neue UID anhand der übergebenen Parameter
 * Format: BlauDreieck-200623-1
 * 
 * @param {String} color Farbe
 * @param {String} shape Form
 * @param {Date} date Tag
 * @param {Int} workpieceCounter 
 */
function createUid(color, shape, date, workpieceCounter) {
  const year = date.getFullYear().toString().substr(-2)
  const month = ("0" + (date.getMonth() + 1)).slice(-2)
  const day = ("0" + date.getDate()).slice(-2)
  const dateFormatted = `${year}${month}${day}`

  return `${color}${shape}-${dateFormatted}-${workpieceCounter}`
}

/**
 * Gibt Werkstücke einer bestimmten Form und Farbe an einem
 * definierten Tag zurück.
 * 
 * @param {String} color Farbe
 * @param {String} shape Form
 * @param {Date} date Tag
 * @param {Function} callback Callback Funktion
 */
async function getSpecificWorkpieces(color, shape, date, callback) {
  const dateFrom = new Date(date.getFullYear(), date.getMonth(), date.getDate())
  let dateTo = new Date(date.getFullYear(), date.getMonth(), date.getDate())
  dateTo = new Date(dateTo.setDate(dateTo.getDate() + 1))

  await Workpiece.find({
    "createdAt": {"$gte": dateFrom, "$lt": dateTo},
    "shape.toValue": shape,
    "color.toValue": color
  }).exec((err, result) => {
    callback(result)
  })
}

function createWst(req, res, colorDef, shapeDef) {
  let colorValue = ''
  if (typeof colorDef === "undefined") {
    colorValue = valueConverter.readColor(req, res)
  } else {
    colorValue = colorDef
  }

  let shapeValue = ''
  if (typeof shapeDef === "undefined") {
    shapeValue = valueConverter.readShape(req, res)
  } else {
    shapeValue = shapeDef
  }

  if (typeof colorValue === "undefined" || typeof shapeValue === "undefined") {
    res.statusCode = 400
    res.json("Invalid request - no color/shape defined")
    return
  }

  const timestamp = Date.now()
  const updatedAt = timestamp
  const createdAt = timestamp
  const color = {
    "actualValue": null,
    "toValue": colorValue,
  }
  const shape = {
    "actualValue": null,
    "toValue": shapeValue,
  }
  const state = {
    id: StatePlaces.CREATED_AND_IN_PRODUCTION_QUEUE.id,
    message: StatePlaces.CREATED_AND_IN_PRODUCTION_QUEUE.message,
    place: StatePlaces.CREATED_AND_IN_PRODUCTION_QUEUE.place
  }
  const order = null
  const date = new Date(createdAt)

  getSpecificWorkpieces(color.toValue, shape.toValue, date,
  (workpieces) => {
    const nextWorkpieceCounter = workpieces.length + 1
    const workpieceId = createUid(color.toValue, shape.toValue, date, nextWorkpieceCounter)

    const newWorkpiece = new Workpiece({
      workpieceId,
      updatedAt,
      createdAt,
      color,
      shape,
      state,
      order
    })

    console.log("Create manual workpiece entry in MongoDB")
    newWorkpiece.save()
    .then((wst) => {
      if (typeof res !== "undefined" && res != null) {
        res.json(newWorkpiece._id)
      }
    })
    .catch(err => {
      if (typeof res !== "undefined" && res != null) {
        res.status(400).json('Error: ' + err)
      }
    })
  })
}

/**
 * Stößt die Produktion eines neuen Werkstückes an, ohne
 * dass eine neue Bestellung angelegt wird.
 */
router.route('/create-manual').get((req, res) => {
  createWst(req, res)
})

/**
 * Bestellung aufgeben
 * 
 * Gibt eine Bestellung auf. Diese Bestellung wird als
 * Dokument in der Datenbank erstellt.
 */
router.route('/create-order').get((req, res) => {
  const reqUrl = url.parse(req.url, true)
  const colorValue = valueConverter.readColor(req, res)
  const shapeValue = valueConverter.readShape(req, res)

  if (typeof colorValue === "undefined" || typeof shapeValue === "undefined") {
    res.statusCode = 400
    res.json("Invalid request - no color/shape defined")
    return
  }

  const state = {
    id: StatePlaces.CREATED_AND_IN_PRODUCTION_QUEUE.id,
    message: StatePlaces.CREATED_AND_IN_PRODUCTION_QUEUE.message,
    place: StatePlaces.CREATED_AND_IN_PRODUCTION_QUEUE.place
  }

  let timestamp = Date.now()

  const order = {
    number: `${reqUrl.query.firstName}-${reqUrl.query.lastName}-${colorValue}-${shapeValue}-${timestamp}`,
    customer: {
      firstname: reqUrl.query.firstName, // Vorname
      name: reqUrl.query.lastName, // Nachname
      zip: reqUrl.query.plz, // Polstleitzahl
      email: reqUrl.query.email, // E-Mail
      address: reqUrl.query.address, // Adresse
      address2: reqUrl.query.address2, // Adresse 2
      ort: reqUrl.query.ort, // Ort
    },
    shape: {
      toValue: shapeValue,
    },
    color: {
      toValue: colorValue,
    },
    createdAt: timestamp,
    updatedAt: timestamp
  }

  const workpieceId = null;
  const updatedAt = timestamp;
  const createdAt = timestamp;
  const color = null;
  const shape = null;

  const newWorkpiece = new Workpiece({
    workpieceId,
    updatedAt,
    createdAt,
    color,
    shape,
    state,
    order
  })

  console.log(newWorkpiece)

  console.log("Create order entry in MongoDB")
  newWorkpiece.save()
  .then(() => res.json(newWorkpiece))
  .catch(err => {
    console.log(err)
    res.status(400).json('Error: ' + err)
  })
})





















router.route('/add').post((req, res) => {
  console.log(req.body)
  const updatedAt = Date.parse(req.body.updatedAt)
  const createdAt = Date.parse(req.body.createdAt)

  const color = {
    "actualValue": req.body.color.actualValue,
    "toValue": req.body.color.toValue,
  }

  const shape = {
    "actualValue": req.body.shape.actualValue,
    "toValue": req.body.shape.toValue,
  }

  const state = {
    "id": Number(req.body.state.id),
    "message": req.body.state.message,
    "timeEstimate": Number(req.body.state.timeEstimate),
    "timeCurrent": Number(req.body.state.timeCurrent),
    "timeLeft": Number(req.body.state.timeLeft),
    "completion": Number(req.body.state.completion),
    "printStartingTime": Date.parse(req.body.state.printStartingTime),
    "printCompletionTime": Date.parse(req.body.state.printCompletionTime),
    // TODO: mehrere storageProcesses parsen?
    "storageProcesses": [
      {
        "storageStartingTime": Date.parse(req.body.state.storageProcesses[0].storageStartingTime),
        "storageCompletionTime": Date.parse(req.body.state.storageProcesses[0].storageCompletionTime),
        "outsourceStartingTime": Date.parse(req.body.state.storageProcesses[0].outsourceStartingTime),
        "outsourceCompletionTime": Date.parse(req.body.state.storageProcesses[0].outsourceCompletionTime)
      }
    ],
    "place": {
      "id": Number(req.body.state.place.id),
      "faculty": req.body.state.place.faculty,
      "floor": req.body.state.place.floor,
      "room": req.body.state.place.room,
      "subproject": req.body.state.place.subproject,
    }
  }

  const order = {
    "number": Number(req.body.order.number),
    "customer": {
      "customerFirstname": req.body.order.customer.customerFirstname,
      "customerName": req.body.order.customer.customerName,
      "customerZip": Number(req.body.order.customer.customerZip),
      "customerEmail": Number(req.body.order.customer.customerEmail),
    },
    "shape": {
      "actualValue": req.body.order.shape.actualValue,
      "toValue": req.body.order.shape.toValue,
    },
    "color": {
      "actualValue": req.body.order.color.actualValue,
      "toValue": req.body.order.color.toValue,
    },
    "updatedAt": Date.parse(req.body.order.updatedAt),
    "createdAt": Date.parse(req.body.order.createdAt)
  }

  const newWorkpiece = new Workpiece({
    updatedAt,
    createdAt,
    color,
    shape,
    state,
    order
  })

  newWorkpiece.save()
  .then(() => res.json('Workpiece added!'))
  .catch(err => res.status(400).json('Error: ' + err))
})

router.route('/:id').get((req, res) => {
  Workpiece.findById(req.params.id)
    .then(workpiece => res.json(workpiece))
    .catch(err => res.status(400).json('Error: ' + err))
})

router.route('/:id').delete((req, res) => {
  Workpiece.findByIdAndDelete(req.params.id)
    .then(() => res.json('Workpiece deleted.'))
    .catch(err => res.status(400).json('Error: ' + err))
})

router.route('/:id').put((req, res) => {
  Workpiece.findById(req.params.id)
    .then(workpiece => {
      const updatedAt = Date.parse(req.body.updatedAt)
      const createdAt = Date.parse(req.body.createdAt)
    
      const color = {
        "actualValue": req.body.color.actualValue,
        "toValue": req.body.color.toValue,
      }
    
      const shape = {
        "actualValue": req.body.shape.actualValue,
        "toValue": req.body.shape.toValue,
      }
    
      const state = {
        "id": Number(req.body.state.id),
        "message": req.body.state.message,
        "timeEstimate": Number(req.body.state.timeEstimate),
        "timeCurrent": Number(req.body.state.timeCurrent),
        "timeLeft": Number(req.body.state.timeLeft),
        "completion": Number(req.body.state.completion),
        "printStartingTime": Date.parse(req.body.state.printStartingTime),
        "printCompletionTime": Date.parse(req.body.state.printCompletionTime),
        // TODO: mehrere storageProcesses parsen?
        "storageProcesses": [
          {
          "storageStartingTime": Date.parse(req.body.state.storageProcesses[0].storageStartingTime),
          "storageCompletionTime": Date.parse(req.body.state.storageProcesses[0].storageCompletionTime),
          "outsourceStartingTime": Date.parse(req.body.state.storageProcesses[0].outsourceStartingTime),
          "outsourceCompletionTime": Date.parse(req.body.state.storageProcesses[0].outsourceCompletionTime)
          }
        ],
        "place": {
          "id": Number(req.body.state.place.id),
          "faculty": req.body.state.place.faculty,
          "floor": req.body.state.place.floor,
          "room": req.body.state.place.room,
          "subproject": req.body.state.place.subproject,
        }
      }
    
      const order = {
        "number": Number(req.body.order.number),
        "customer": {
          "customerFirstname": req.body.order.customer.customerFirstname,
          "customerName": req.body.order.customer.customerName,
          "customerZip": Number(req.body.order.customer.customerZip),
          "customerEmail": Number(req.body.order.customer.customerEmail),
        },
        "shape": {
          "actualValue": req.body.order.shape.actualValue,
          "toValue": req.body.order.shape.toValue,
        },
        "color": {
          "actualValue": req.body.order.color.actualValue,
          "toValue": req.body.order.color.toValue,
        },
        "updatedAt": Date.parse(req.body.order.updatedAt),
        "createdAt": Date.parse(req.body.order.createdAt)
      }

      workpiece.updatedAt = updatedAt
      workpiece.createdAt = createdAt
      workpiece.color = color
      workpiece.shape = shape
      workpiece.state = state
      workpiece.order = order

      workpiece.save()
        .then(() => res.json('Workpiece updated!'))
        .catch(err => res.status(400).json('Error: ' + err))
    })
    .catch(err => res.status(400).json('Error: ' + err))
})

module.exports = {
  startPrintForOrdersWithoutWst: startPrintForOrdersWithoutWst,
  getSpecificWorkpieces: getSpecificWorkpieces,
  createUid: createUid,
  router: router
}