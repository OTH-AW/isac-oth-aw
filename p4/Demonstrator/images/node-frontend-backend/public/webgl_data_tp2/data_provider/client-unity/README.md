### 1. Kopieren der Dateien in den /assets Ordner von Unity

### 2. Verknüpfen der TextMesh auf das GameObject

### 3. In der CustomTemperaturTextMesh.cs die Parameter konfigurieren (Server, NodeId)

### 4. OpcuaProxy.jslib beim Start laden (Checkbox in Unity bei Klick auf diese)

Hinweise:
Beim Kompilieren werden viele moderne JavaScript Syntax nicht unterstützt.
Nicht unterstützt wird zum Beispiel:
- let
=> Stattdessen var verwenden. Der Compiler von Unity scoped von selbst.
- Schreibweise: test = () => {}
=> Stattdessen muss test = function() {} geschrieben werden.

Es ist normal, dass beim UnityEditor die JS-Bibliothek nicht ausgeführt werden kann.
Unity unterstützt das nicht.
Die Funktionen werden erst beim exportierten WebGL ausgeführt.
Die Funktionen also am besten davor ohne Unity ausgiebig testen.

