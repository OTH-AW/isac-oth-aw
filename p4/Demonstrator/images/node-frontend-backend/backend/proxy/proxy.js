const WebSocket = require('ws');
const opcConnector = require('../helper/opcua/connector');
const wss = new WebSocket.Server({ port: process.env.WS_PROXY_PORT }); // Muss gleich mit dem WebSocket sein

const opcClientPrinterOrange = new opcConnector.Client(process.env.OPCUA_TP1_URI_1)
const opcClientPrinterBlue = new opcConnector.Client(process.env.OPCUA_TP1_URI_2)

let activeClientsSize = 0

const startProxyConnection = () => {
  wss.on('connection', function connection(ws) {
    ws.on('message', function incoming(data) { 
      let obj = JSON.parse(data);
      let opcClient = obj.printer === 'Orange'? opcClientPrinterOrange : opcClientPrinterBlue

      if (ws.subscription) {
        try {
          // Offene OPC UA Verbindungen <=> WebSockets prüfen?
          // opcClient.terminateSubscription(ws.subscription)
          console.log("ws.subscription.terminate()")
          ws.subscription.terminate()
        } catch (error) {
          console.log(error)
        }
      }

      let config = obj.nodes.filter(d => d);
    
      console.log("new message from client: ", config);
      console.log(opcClient.isConnected)
      if (typeof opcClient.session === "undefined") {
        opcClient.call(startProxyConnection)
        return
      }

      ws.subscription = opcClient.monitorNodes(config, dataValue => {
        ws.readyState == WebSocket.OPEN && ws.send(dataValue.value.value.toString())
      })
    });
  });

  // cleaning deprecated subscription
  setInterval(() => {
    // Prüfe, ob sich die Anzahl der offenen WS geändert hat
    if (activeClientsSize != wss.clients.size) {
      console.log("Anzahl WS-Clients: " + activeClientsSize + " => " + wss.clients.size)
      activeClientsSize = wss.clients.size
    }
    
    wss.clients.forEach(ws => {
      if (ws.readyState !== WebSocket.OPEN && ws.subscription) {
        if (typeof opcClientPrinterOrange !== "undefined") {
          try {
            console.log("??? opcClientPrinterOrange.terminateSubscription()")
            // Offene OPC UA Verbindungen <=> WebSockets prüfen?
            // opcClientPrinterOrange.terminateSubscription()  
          } catch (error) {
            console.log(error)
          }
        }
        if (typeof opcClientPrinterBlue !== "undefined") {
          try {
            console.log("??? opcClientPrinterBlue.terminateSubscription()")
            // Offene OPC UA Verbindungen <=> WebSockets prüfen?
            // opcClientPrinterBlue.terminateSubscription()
          } catch (error) {
            console.log(error)
          }
        }
      }
    })
  }, 1000);
}

opcClientPrinterOrange.call(startProxyConnection) // Verbindung zum OpcUa-Server
opcClientPrinterBlue.call(startProxyConnection) // Verbindung zum OpcUa-Server