export default class DataProvider {
    constructor() {
       this.use_rest_endpoint = true;
       this.url = window.location.hostname;
       this.port = 8898;
    }
 
    /**
     * @summary Schickt eine asynchrone Anfrage an das Backend zum Abfragen
     * von Datensätzen in der Datenbank.
     *
     * @param {String} 		sensor_name Sensorname
     * @param {Number} 		wst Filtere nach Werkstückträger (Es gibt 1-6),
     * 						null = Alle Werkstückträger
     * @param {function} 	callback Funktion, die aufgerufen werden soll,
     * 						wenn die Antwort erhalten wurde.
     * @param {Object} 		callbackArg Zusätzliche Parameter, die dem Callback
     * 						übergeben werden sollen
     * @param {Dictionary} 	filter_by Filtert die Datensätze nach dem MongoDB Filter-Schema.
     * 						Beispiel: {"Zeit": {"$gte": 1545133336890, "$lte": 1545135000000}}
     * 						$gte steht für Greater or Equals
     * @param {Dictionary}	options Führt weitere Operationen auf dem zurückgegebenen
     * 						Datensatz aus.
     * 						Beispiel: {"normalize": true}
     * 						- normalize: True|False
     * 
     * @see MongoDB Filter: https://docs.mongodb.com/manual/reference/operator/aggregation/filter/
     */
    get_sensor_data = function(sensor_name, wst, callback, callbackArg, filter_by, options) {
 
       /* Sorgt dafür, dass immer vollständige Power-Datensätze geladen werden */
       let call_url = '';
       let request = new XMLHttpRequest();
       var filterAsText = undefined;
       var b64Encoded = undefined;              

       if(this.use_rest_endpoint) {
          console.log("Use rest endpoint (Chrome)");
          call_url = 'http://' + this.url + ':' + this.port + '/get_sensor_data?sensor_name=' + encodeURIComponent(sensor_name);
          if (wst !== null) {
             call_url += '&wst=' + wst;
          }
 
          if (typeof filter_by !== "undefined" && filter_by !== null) {
             filterAsText = JSON.stringify(filter_by)
             b64Encoded = window.btoa(filterAsText)
    
             call_url += '&filter_by=' + b64Encoded
          }
 
          if (typeof options !== "undefined" && options !== null) {
             filterAsText = JSON.stringify(options)
             b64Encoded = window.btoa(filterAsText)
    
             call_url += '&options=' + b64Encoded
          }
       } else {
          console.log("Use local file (Edge)");
          call_url = '../data/json/' + sensor_name + '.json';
       }
       
       console.log(call_url);
 
       request.open("GET", call_url, true); // Method, Url, Async
       request.responseType = 'json';
       request.onload = function() {
          if (request.status === 200) {
             callback(null, request.response, callbackArg, wst);
          } else {
             callback(request.status);
          }
       };
       request.send();
    }
 }