import simplePN532
import time
import requests
import json
import os
from dotenv import load_dotenv

# laden der environment variable
load_dotenv()
IP = os.getenv("IP")

nfc = simplePN532.simplePN532()

#
toCheck = ""
value = ""

# main loop
print("Geben Sie an was geprüft wird")
while True:
	uid = nfc.scanForTag()

	if uid is None:
		continue
	elif len(uid) == 4:
		time.sleep(0.5)
		# classic tag gefunden mit der wir angeben um welchen pruefwert wir eingeben
		success, data = nfc.readFromClassic(uid)
		if success is True:
			#wir ueberpruefen welchen pruefwert wir anpassen
			if data == "function":
				toCheck = data
			elif data == "shape":
				toCheck = data
			elif data == "color":
				toCheck = data

		print("Geben Sie das Ergebnis der Prüfung an")
		time.sleep(2)
		#loop fuer das ergebnis der pruefung
		while True:
			uid = nfc.scanForTag()

			if uid is None:
				continue
			elif len(uid) == 4:
				time.sleep(0.5)
				# wir lesen und speichern das Ergbnis der Prüfung
				success, data = nfc.readFromClassic(uid)
				if success is True:
					if data == "True":
						value = True
					if data == "False":
						value = False

				print("Scannen Sie das Werkstück ein")
				# loop fuer das einscannen des werkstuecks
				while True:
					uid = nfc.scanForTag()
					if uid is None:
						continue
					elif len(uid) == 7:
						time.sleep(0.5)
						success, data = nfc.readFromUltralight()
						if success is False:
							print(data + "wht")
						elif success is True:
							success, data = nfc.ndefDecode(data)
							if success is True:
								jsonData = json.loads(data)
								jsonData['state']['controlProcesses'][-1][toCheck] = value

								text = json.dumps(jsonData)
								success, data = nfc.ndefEncode(text)
								if success is True:
									if nfc.writeToUltralight(data):
										print("Tag wurde erfolgreich mit dem Ergebnis beschrieben")
									else:
										print("Ergebnis konnte ncht auf das Tag geschrieben werden")
								break
				print("Geben Sie an was geprüft wird")
				break
