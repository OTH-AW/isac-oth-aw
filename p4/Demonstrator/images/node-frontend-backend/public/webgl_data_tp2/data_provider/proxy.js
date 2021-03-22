const WebSocket = require('ws');
const opcClient = require('./proxy.opcua');
const wss = new WebSocket.Server({ port: 8089 }); // Muss gleich mit dem WebSocket sein
opcClient.initSession("opc.tcp://127.0.0.1:8080"); // Verbindung zum OpcUa-Server

wss.on('connection', function connection(ws) {
  
  ws.on('message', function incoming(data) {
    if (ws.subscription) {
      opcClient.terminateSubscription(ws.subscription);
    }

    let obj = JSON.parse(data);
    let config = obj.nodes.filter(d => d);
	
	console.log("new message from client: ", config);
	
    ws.subscription = opcClient.monitorNodes(config, dataValue => {
      ws.readyState == WebSocket.OPEN && ws.send(dataValue.value.value)
    })
  });
});

// cleaning deprecated subscription
setInterval(() => {
  wss.clients.forEach(ws => {
    ws.readyState !== WebSocket.OPEN 
    && ws.subscription 
    && opcClient.terminateSubscription();
  })
}, 1000);