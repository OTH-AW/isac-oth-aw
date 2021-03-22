mergeInto(LibraryManager.library, {
	  ConnectToOpcuaThroughProxy: function (proxyUrl, printerColor, opcuaNode, callbackGameObject, callbackMethod, callbackSocketClosed) {
		
		// Pointer to string
		proxyUrl = Pointer_stringify(proxyUrl)
		printerColor = Pointer_stringify(printerColor)
		opcuaNode = Pointer_stringify(opcuaNode)
		callbackGameObject = Pointer_stringify(callbackGameObject)
		callbackMethod = Pointer_stringify(callbackMethod)
		callbackSocketClosed = Pointer_stringify(callbackSocketClosed)
		
		console.log("proxyUrl: " + proxyUrl)
		console.log("printerColor: " + printerColor)
		console.log("opcuaNode: " + opcuaNode)
		console.log("callbackGameObject: " + callbackGameObject)
		console.log("callbackMethod: " + callbackMethod)
		console.log("callbackSocketClosed: " + callbackSocketClosed)
		
		var websocket = new WebSocket(proxyUrl)

		websocket.onopen = function (evt) {
			// console.log("Socket opened");
			updateOpcNodeListener();
		}
		
		websocket.onclose = function () {
			// console.log("Socket closed");
			if(typeof unityInstance.unityInstance !== "undefined")
			{
				unityInstance.unityInstance.SendMessage(callbackGameObject, callbackSocketClosed)
			}
			else if(typeof unityInstance !== "undefined")
			{
				unityInstance.SendMessage(callbackGameObject, callbackSocketClosed)
			}
		}
		
		websocket.onmessage = function (msg) {
			// console.log("New message from server");
			// console.log(msg.data);
			// console.log(unityInstance);
			// console.log(window.unityInstance);
			if(typeof unityInstance.unityInstance !== "undefined")
			{
				unityInstance.unityInstance.SendMessage(callbackGameObject, callbackMethod, msg.data)
			}
			else if(typeof unityInstance !== "undefined")
			{
				unityInstance.SendMessage(callbackGameObject, callbackMethod, msg.data)
			}
		}
		
		websocket.onerror = function (event) {
			console.error("WebSocket error observed:", event)
		}
		
		function updateOpcNodeListener() {
			config_json = JSON.stringify({
				printer: printerColor,
				nodes: [ opcuaNode ]
			});

			// console.log("Send message to server");
			// console.log(config_json);
			
			websocket.send(config_json);
		}
	},
});