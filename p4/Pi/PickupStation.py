import simplePN532
import time
import requests
import json
import os
from dotenv import load_dotenv

load_dotenv()

workpieceID = ""
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
    			print("workpieceid" + workpieceID)

    			r = requests.get(IP + '/pi/pickup-wst?workpieceId=' + workpieceID)

    			data = r.json()
    			text = json.dumps(data)

    			if text != "[]":
    				success, data = nfc.ndefEncode(text)
    				if success is True:
    					if nfc.writeToUltralight(data):
    						print("Werkstück wurde erfolgreich eingecheckt")
    					else:
    						print("Fehler beim Schreiben")

    		else:
    			print(data)
    time.sleep(3)
