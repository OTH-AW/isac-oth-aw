let Workpiece = require('../../models/workpiece.model')
let denyChanges = false

function shallDenyChanges() {
  return denyChanges
}

function tryMergeOrdersAndWorkpieces (req, res, callback) {
  console.log("tryMergeOrdersAndWorkpieces - Start")

  Workpiece.find({order: {$eq: null}})
  .then(workpieces => {
    console.log("--- Workpieces:")
    workpieces.forEach(workpiece => {
      console.log(workpiece._id + "-" + workpiece.shape.toValue + "-" + workpiece.color.toValue)
    })

    Workpiece.find({ $and: [
      {order: {$ne: null}},
      {workpieceId: {$eq: null}}
    ]})
    .then(orders => {
      console.log("--- Orders:")
      orders.forEach(order => {
        console.log(order._id + "-" + order.order.shape.toValue + "-" + order.order.color.toValue)
      })

      let finishedStartinMerges = false
      let counterOrdersToSave = 0
      let callbackCalled = false

      // Find something to merge
      let usedWorkpieces = []
      orders.forEach(order => {
        let orderShape = order.order.shape.toValue
        let orderColor = order.order.color.toValue

        for (i = 0; i < workpieces.length; i++) {
          let wp = workpieces[i]
          if (usedWorkpieces.includes(wp._id))
          {
            // Wurde in diesem Merge-Durchlauf schon verwendet
            continue
          }

          let workpieceShape = wp.shape.toValue
          let workpieceColor = wp.color.toValue

          if (orderShape == workpieceShape && orderColor == workpieceColor) {
            // Match
            usedWorkpieces.push(wp._id)
            console.log(order._id + " => " + wp._id)
            // Mergen
            order.workpieceId = wp.workpieceId
            order.shape = wp.shape
            order.color = wp.color
            order.state = wp.state
            order.updatedAt = wp.updatedAt
            order.createdAt = wp.createdAt
            
            denyChanges = true
            counterOrdersToSave ++
            order.save()
            .then(() => {
              counterOrdersToSave --
              console.log('Bestellung mit Werkstück zusammengeführt!')
              wp.remove()
            })
            .catch(err => res.status(400).json('Error: ' + err))
            .finally(() => {
              denyChanges = false

              if (counterOrdersToSave === 0 && finishedStartinMerges) {
                callbackCalled = true
                callback()
              }
            })

            break
          }
        }
      })

      finishedStartinMerges = true
      if (counterOrdersToSave === 0 && !callbackCalled) {
        callbackCalled = true
        callback()
      }
      // Mergen Ende
    })
    .catch(err => res.status(400).json('Error: Fetching Orders - ' + err))
  })
  .catch(err => res.status(400).json('Error: Fetching Workpieces - ' + err))

  console.log("tryMergeOrdersAndWorkpieces - End")
}

module.exports = {
  tryMergeOrdersAndWorkpieces: tryMergeOrdersAndWorkpieces,
  shallDenyChanges: shallDenyChanges

}