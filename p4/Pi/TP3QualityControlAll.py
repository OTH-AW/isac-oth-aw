import simplePN532
import time
import requests
import json
import os
from dotenv import load_dotenv

#QA
toValueColor = ""
toValueShape = ""

actualValueColor = ""
actualValueShape = ""

function = "False"

order = False
#
workpieceID = ""

load_dotenv()

IP = os.getenv("IP")

nfc = simplePN532.simplePN532()

while True:
    uid = nfc.scanForTag()

    if uid is None:
    	continue

    elif len(uid) == 7:
    	time.sleep(0.5)
    	print("Ultralight")
    	success, data = nfc.readFromUltralight()
    	if success is False:
    		print(data)
    	elif success is True:
    		success, data = nfc.ndefDecode(data)
    		if success is True:
    			jsonData = json.loads(data)
    			workpieceID = jsonData["workpieceId"]
    			print("workpieceid " + workpieceID)

    			r = requests.get(IP + '/pi/qc-entry-wst?workpieceId=' + workpieceID)

    			jsonData = r.json()
    			text = json.dumps(data)

    			if text != "[]":
    				toValueColor = jsonData["color"]["toValue"]
    				toValueShape = jsonData["shape"]["toValue"]
    				order = True if ('order' in jsonData) else False

    			print("Geben Sie die Farbe an!")
    			while True:
    				uid = nfc.scanForTag()
    				if uid is None:
    					continue
    				elif len(uid) == 4:
    					time.sleep(0.5)
    					print("Classic")
    					success, data = nfc.readFromClassic(uid)
    					if success is True:
    						actualValueColor = data
    						print("actualColor: " + data)
    						break

    			time.sleep(2)
    			print("Geben Sie die Form an!")
    			while True:
    				uid = nfc.scanForTag()
    				if uid is None:
    					continue
    				elif len(uid) == 4:
    					time.sleep(0.5)
    					print("Classic")
    					success, data = nfc.readFromClassic(uid)
    					if success is True:
    						actualValueShape = data
    						print("actualShape: " + data)
    						break

    			time.sleep(2)
    			print("Geben sie die Funktionstüchtigkeit an!")
    			while True:
    				uid = nfc.scanForTag()
    				if uid is None:
     					continue
    				elif len(uid) == 4:
    					time.sleep(0.5)
    					print("Classic")
    					success, data = nfc.readFromClassic(uid)
    					if success is True:
    						function = data
    						print("function: " + data)
    						break

    			#AUSWERTUNG
    			message = ""

    			color = False
    			if toValueColor.lower() == actualValueColor.lower():
    				color = True

    			shape = False
    			if toValueShape.lower() == actualValueShape.lower():
    				shape = True

    			if function == "False":
    				message = "Werkstück ist kaputt"

    			elif (color == False or shape == False):
    				message = "Fehler bei Farbe/Form"

    			elif (color == True and shape == True):
    				if order == True:
    					message = "Werkstück ist OK - mit Bestellung"
    				else:
    					message = "Werkstück ist OK - ohne Bestellung"

    			#EXIT/TAG BESCHREIBEN
    			r = requests.get(IP + '/pi/qc-exit-wst?workpieceId=' + workpieceID) #im späteren Verlauf wird hier das Ergebnis der Überprüfung mitgegeben
    			data = r.json()
    			text = json.dumps(data)

    			if text != "[]":
    				success, data = nfc.ndefEncode(text)
    				if success is True:
    					print("Scannen Sie das Werkstück zum Auschecken!")
    					while True:
    						uid = nfc.scanForTag()
    						if uid is None:
    							continue
    						elif len(uid) == 7:
    							time.sleep(0.5)
    							if nfc.writeToUltralight(data):
    								print("Tag erfolgreich beschrieben")
    							else:
    								print("Fehler beim Schreiben: " + data)
    							break
    				else:
    					print(data)

    			#ERGEBNIS AUSGEBEN
    			print(message)

    time.sleep(2)
