import simplePN532
import time
import requests
import json
import os
from dotenv import load_dotenv

load_dotenv()

#0 - Undefined
#1 - Einlagern
#2 - Auslagern
STATUS = 0

workpieceID = ""
IP = os.getenv("IP")

nfc = simplePN532.simplePN532()

while True:
    uid = nfc.scanForTag()

    if uid is None:
    	continue

    #Classic Tag wurder erkannt -> Status wird gesetzt
    elif len(uid) == 4:
    	time.sleep(0.5)
    	print("Classic")
    	success, data = nfc.readFromClassic(uid)
    	if success is True:
    		if data == "EINLAGERN":
    			STATUS = 1
    			print("Status gesetzt: Einlagern")
    		elif data == "AUSLAGERN":
    			STATUS = 2
    			print("Status gesetzt: Auslagern")
    		else:
    			STATUS = 0
    			print("Kein gueltiger Status erkannt!")
    	elif success is False:
    		STATUS = 0
    		print("Fehler beim Lesen!")

    #Ultralight Tag wurde erkann -> Auslesen der WorkpieceId + API Aufruf
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
    		else:
    			print(data)
    	if STATUS is not 0 and workpieceID is not "":
    		if STATUS is 1:
    			r = requests.get(IP + '/pi/store-wst?workpieceId=' + workpieceID)
    		elif STATUS is 2:
    			r = requests.get(IP + '/pi/scan-outsource-wst?workpieceId=' + workpieceID)

    		data = r.json()
    		text = json.dumps(data)

    		#Wurde kein Datensatz mit passender workpieceId gefunden erhält man []
    		if text != "[]":
    			success, data = nfc.ndefEncode(text)
    			if success is True:
    				if nfc.writeToUltralight(data):
    					print("Einlagerung/Auslagerung war erfolgreich und das Werkstück wurde beschrieben")
    				else:
    					STATUS = 0
    					print("Fehler beim Schreiben")
    		else:
     			print("Werkstück konnte nicht gefunden werden!")

    		STATUS = 0
    		workpieceID = ""
    	else:
    		print("Kein STATUS oder workpieceID gesetzt!")
    time.sleep(3)

del nfc
