# Raspberry Pi und NFC
Durch Low-Cost-Computer, günstige NFC-Lables und die Einbindung des Smartphones lässt sich eine Verfolgung sehr einfach abbilden.

In diesem Teil des Repository befindet sich alles für die Umsetzung der Verfolgung:
- Unter */pn532* befindet sich die Bibliothek des PN532 NFC HAT
- *simplePN532.py* ist unsere eigene Klasse für einfaches Lesen/Schreiben und Kodieren/Dekodieren (NDEF)
- Beispiel-Skripte für die verschiedenen Einsatzgebiete (Erstbeschreibung, Qualitätskontrolle, Lager, Abholstation)

### Folgende Bibliothek wird zusätzlich benötigt:
- python-dotenv [https://pypi.org/project/python-dotenv/](https://pypi.org/project/python-dotenv/)

