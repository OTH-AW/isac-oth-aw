import simplePN532
import time
import requests
import json
import os
from dotenv import load_dotenv

# laedt die environment variables
load_dotenv()
IP = os.getenv("IP")

nfc = simplePN532.simplePN532()

print("Bereit für das Scannen von Tags")
# main loop
while True:
	uid = nfc.scanForTag()

	if uid is None:
		continue
	# liest classic tag um zu wissen ob es sich um start oder ende handelt
	elif len(uid) == 4:
		time.sleep(0.5)
		print("Classic Tag erkannt")
		success, data = nfc.readFromClassic(uid)
		if success is True:
			if data == "QCstart":
				print("Quality Control startet")
				# quality control startet, es wird auf ein werkstück gewartet
				while True:
					uid = nfc.scanForTag()
					if uid is None:
						continue
					elif len(uid) == 7:
						time.sleep(0.5)
						# tag eines werkstuecks wurde gefunden und wird nun ausgelesen
						success, data = nfc.readFromUltralight()
						if success is False:
							print(data)
						elif success is True:
							success, data = nfc.ndefDecode(data)
							if success is True:
								# ndef message wurde decoded, jetzt wird die workpiece id ausgelesen
								jsonData = json.loads(data)
								workpieceID = jsonData["workpieceId"]
								print(workpieceID)
								print(IP + '/pi/qa-entry?workpieceId=' + workpieceID)
								# api für qc start wird aufgerufen
								re = requests.get(IP + '/pi/qc-entry-wst?workpieceId=' + workpieceID)
								# wenn der aufruf erfolgreich war, erhalten wir einen datensatz zurueck
								jsonData = re.json()
								text = json.dumps(jsonData)

								# war der api call nicht erfolgreich, dann erhalten wir []
								# war der api call erfolgreich, dann erhalten wir alle informationen des werkstuecks
								if text != '[]':
									success, data = nfc.ndefEncode(text)
									if success is False:
										print(data)
									elif success is True:
										if nfc.writeToUltralight(data):
											print("QC wurde erfolgreich gestartet")
										else:
											print("Tag konnte nicht mit dem Neuen Prüfdatensatz beschrieben werden | " + data)
								else:
									print("QC konnte nicht gestartet werden")

								print("Bereit zum Scannen")
								break

			elif data == "QCend":
				print("QC wird beendet")
				# quality control wird beendet, es wird auf das werkstueck gewartet
				while True:
					uid = nfc.scanForTag()
					if uid is None:
						continue
					elif len(uid) == 7:
						time.sleep(0.5)
						# tag eines werkstuecks wurde gefunden und wird nun gelesen
						success, data = nfc.readFromUltralight()
						if success is False:
							print(data)
						elif success is True:
							success, data = nfc.ndefDecode(data)
							if success is True:
								# ndef message wurde decoded, das pruefergebnis kann jetzt ausgelesen werden
								jsonData = json.loads(data)
								workpieceID = jsonData['workpieceId']
								lastControlProcess = jsonData['state']['controlProcesses'][-1]
								# auslesen der ergebnisse der pruefung
								functionResult = lastControlProcess['function']
								colorResult = lastControlProcess['color']
								shapeResult = lastControlProcess['shape']

								re = requests.get(IP + '/pi/qc-exit-wst?workpieceId=' + workpieceID) # spaeter werden hier die ergebnisse der pruefung uebergeben
								jsonData = re.json()
								text = json.dumps(jsonData)

								if text != '[]':
									success, data = nfc.ndefEncode(text)
									if success is False:
										print(data)
									elif success is True:
										if nfc.writeToUltralight(data):
											print("QC wurde erfolgreich beendet")
										else:
											print("Tag konnte nicht mit dem Prüfergebnis beschrieben werden")
								else:
									print("QC konnte nicht beendet werden")

								print("Bereit zum Scannen")
								break
			else:
				print("Unbekannter Befehl:" + data)
		else:
			print("Fehler beim Lesen des Tags")

	time.sleep(2)
