const url = require('url')

function readShape (req, res) {
  const reqUrl = url.parse(req.url, true)
  let shape = reqUrl.query.shape

  if (typeof shape !== "undefined" && shape !== null && shape !== 'null') {
    const shapeMap = {
      "triangle": "Dreieck",
      "square": "Viereck",
      "circle": "Kreis"
    }

    return shapeMap[shape]
  }
}

function readColor (req, res) {
  const reqUrl = url.parse(req.url, true)
  let color = reqUrl.query.color

  if (typeof color !== "undefined" && color !== null && color !== 'null') {
    const colorMap = {
      "orange": "Orange",
      "blue": "Blau"
    }

    return colorMap[color]
  }
}

module.exports = {
  readShape: readShape,
  readColor: readColor
}