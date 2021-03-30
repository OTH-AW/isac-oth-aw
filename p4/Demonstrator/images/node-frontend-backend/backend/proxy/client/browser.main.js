var endpointUrl = "ws://localhost:8089" // Verbindung zum Node-Server
let websocket = new WebSocket(endpointUrl)

websocket.onopen = function (evt) {
	console.log("Socket opened");
    updateOpcNodeListener();
}

websocket.onclose = () => {
    console.log("Socket closed");
}

websocket.onmessage = msg => {
	console.log("New message from server");
	console.log(msg.data);
}

websocket.onerror = console.error;

function updateOpcNodeListener() {
    let config = document.getElementById("nodeIds").value;
    config = config.replace(/\r/g, "");
    config = config.split("\n");
	config_json = JSON.stringify({
        nodes: config
    });

	console.log("Send message to server");
	console.log(config_json);
	
	    let obj = JSON.parse(config_json);
    let config2 = obj.nodes.filter(d => d);
	console.log(config2);
	
    websocket.send(config_json);
}