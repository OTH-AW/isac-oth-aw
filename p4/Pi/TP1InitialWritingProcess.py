import simplePN532
import time
import requests
import json
import os
from dotenv import load_dotenv

load_dotenv()

# 0 - Undefined
# 1 - Orange
# 2 - Blue
COLOR = 0

IP = os.getenv("IP")

nfc = simplePN532.simplePN532()

while True:
    uid = nfc.scanForTag()

    if uid is None:
    	continue

    #Classic Tag wurde erkannt -> Einlesen der Farbe
    elif len(uid) == 4:
    	time.sleep(0.5)
    	print("Classic")
    	success, data = nfc.readFromClassic(uid)
    	if success is True:
    		if data == "ORANGE":
    			COLOR = 1
    			print("Farbcode: Orange")
    		elif data == "BLAU":
    			COLOR = 2
    			print("Farbcode: Blau")
    		else:
    			COLOR = 0
    			print("Kein gueltiger Farbcode erkannt!")
    	elif success is False:
    		COLOR = 0
    		print("Fehler beim Lesen!")

    #Ultralight Tag wurde erkannt -> Aufruf des letzten Werkstücks mit passender Farbe
    elif len(uid) == 7:
    	time.sleep(0.5)
    	print("Ultralight")
    	if COLOR is not 0:
    		if COLOR is 1:
    			r = requests.get(IP + '/pi/printed-wst?color=orange')
    		elif COLOR is 2:
    			r = requests.get(IP + '/pi/printed-wst?color=blue')

    		data = r.json()
    		text = json.dumps(data)

    		#Wurde kein passender Datensatz gefunden erhält man []
    		if text != "[]":
    			success, data = nfc.ndefEncode(text)
    			if success is True:
    				if nfc.writeToUltralight(data):
    					print("Tag erfolgreich beschrieben")
    				else:
    					print("Fehler beim Schreiben")
    			else:
    				print(data)
    		else:
    			print("Es konnte kein Datensatz zu dieser Farbe gefunden werden!")
    		COLOR = 0
    	else:
    		print("Keine Farbe definiert")

    time.sleep(3)

del nfc
