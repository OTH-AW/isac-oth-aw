mergeInto(LibraryManager.library, {
	  ConnectToOpcuaThroughProxy: function (proxyUrl, opcuaNode, callbackGameObject, callbackMethod, callbackSocketClosed) {
		
		// Pointer to string
		proxyUrl = Pointer_stringify(proxyUrl)
		opcuaNode = Pointer_stringify(opcuaNode)
		callbackGameObject = Pointer_stringify(callbackGameObject)
		callbackMethod = Pointer_stringify(callbackMethod)
		callbackSocketClosed = Pointer_stringify(callbackSocketClosed)
		
		console.log("proxyUrl: " + proxyUrl)
		console.log("opcuaNode: " + opcuaNode)
		console.log("callbackGameObject: " + callbackGameObject)
		console.log("callbackMethod: " + callbackMethod)
		console.log("callbackSocketClosed: " + callbackSocketClosed)
		
		var websocket = new WebSocket(proxyUrl)

		websocket.onopen = function (evt) {
			console.log("Socket opened");
			updateOpcNodeListener();
		}
		
		websocket.onclose = function () {
			console.log("Socket closed");
			unityInstance.SendMessage(callbackGameObject, callbackSocketClosed)
		}
		
		websocket.onmessage = function (msg) {
			console.log("New message from server");
			console.log(msg.data);
			unityInstance.SendMessage(callbackGameObject, callbackMethod, msg.data)
		}
		
		websocket.onerror = console.error;
		
		function updateOpcNodeListener() {
			config_json = JSON.stringify({
				nodes: [ opcuaNode ]
			});

			console.log("Send message to server");
			console.log(config_json);
			
			websocket.send(config_json);
		}
	},
});