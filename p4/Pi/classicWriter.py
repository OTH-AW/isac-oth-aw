import simplePN532
import time

nfc = simplePN532.simplePN532()
menu = 0
while True:
    if menu == 0:
    	print("""
    	######
    	1 - Blau\n
    	2 - Orange\n
    	3 - Einlagern\n
    	4 - Auslagern\n
    	5 - Dreieck\n
    	6 - Kreis\n
	7 - Viereck\n
	8 - True\n
    	9 - False\n
    	10 - QCstart\n
    	11 - QCend\n
    	12 - Function\n
    	13 - Color\n
	14 - Shape\n
    	15 - Nur auslesen
    	######
    	""")
    	key = int(input("Wartet auf Eingabe: "))
    	menu = 1
    else:
    	uid = nfc.scanForTag()

    	if uid is None:
    		continue
    	elif len(uid) == 4:
    		time.sleep(0.5)
    		print("Mifare Classic")
    		print("UID:", [hex(i) for i in uid])
    		print("____WRITE____")

    		if   key == 1: text = "BLAU"
    		elif key == 2: text = "ORANGE"
    		elif key == 3: text = "EINLAGERN"
    		elif key == 4: text = "AUSLAGERN"
    		elif key == 5: text = "Dreieck"
    		elif key == 6: text = "Kreis"
    		elif key == 7: text = "Viereck"
    		elif key == 8: text = "True"
    		elif key == 9: text = "False"
    		elif key == 10: text = "QCstart"
    		elif key == 11: text = "QCend"
    		elif key == 12: text = "function"
    		elif key == 13: text = "color"
    		elif key == 14: text = "shape"
    		elif key == 15: text = "Read"
    		else:
    			print("Ihre Eingabe wurde nicht erkannt")
    			text = "error"

    		if text == "Read":
    			success, data = nfc.readFromClassic(uid)
    			if success is True:
    				print("Aktuelle Daten auf dem Tag: " + data)

    		if text != "error" and text != "Read":
    			# Alte Daten des Tags werden gelöscht
    			success = nfc.clearClassic(uid)
    			if success is False:
    				print("Fehler beim Clearen des Tags aufgetreten")
    				text = ""
    				menu = 0
    				continue
    			elif success is True:
    				print("Alte Daten auf dem Tag wurden gelöscht")

    			# Neue Daten werden auf den Tag geschrieben
    			if nfc.writeToClassic(text,uid):
    				print("Tag erfolgreich beschrieben: " + text)
    			else:
    				print("Fehler beim Schreiben!")
    		text = ""
    		menu = 0
    	else:
    		print("Das ist kein Classic Tag!")
