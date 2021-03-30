### 1. Starten des opcua-servers
./opcua-server
python temperaturServer.py

=> ist jetzt in einem eigenem Container

### 2. Starten des Proxys (Node Server)
./
node proxy

### 3. Verbindung aus Browser aus aufbauen
./client
index.html öffnen
In der Konsole werden die Werte ausgegeben