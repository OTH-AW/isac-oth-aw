import simplePN532
import time

nfc = simplePN532.simplePN532()

text = '{"_id":"5df7a7cb9d966f190f91bc1a","workpieceId":"greenTriangle-191216-1","color":{"actualValue":null,"toValue":"GrÃ¼n"},"shape":{"actualValue":null,"toValue":"Dreieck"},"state":{"id":0,"message":"Wird gedruckt","controlProcesses":[{"controlStartingTime":"2019-12-16 17:30:00.000","controlCompletionTime":"2019-12-16 17:30:30.000","function":true,"color":true,"shape":true}],"place":{"id":1}},"oder":{"number":"vs-92224-191216-gr-tri-1","customer":{"customerFirstname":"Veit","customerName":"Stephan","customerZip":"92224","customerEmail":"v.stephan@oth-aw.de"},"shape":{"toValue":"Dreieck"},"color":{"toValue":"GrÃ¼n"},"createdAt":"2019-12-16T16:48:25.000Z"},"createdAt":"2019-12-16T15:48:25.000Z"}'
textClassic = "BLAU"

while True:
    # scanForTag() gibt die uid des Tags zurück, wenn kein Tag gefunden wird dann None
    uid = nfc.scanForTag()

    # Wir unterscheiden die Tags durch die Länge ihrer uid
    # 4 := Mifare Classic
    # 7 := Mifare Ultralight oder NTAG2XX
    if uid is None:
    	continue
    if len(uid) == 4:
    	print("Mifare Classic")
    	print("UID:", [hex(i) for i in uid])

    	print("_______WRITE_______")
    	# Bevor wir auf einen Tag schreiben, löschen wir den alten Inhalt!
    	# Dies machen wir nur for die Mifare Classic Tags, da wir diese nicht NDEF formatiert beschreiben (Ende nicht ersichtlich).
    	success = nfc.clearClassic(uid)
    	if success is False:
    		print("Fehler beim Clearen des Tags")
    	elif success is True:
    		print("Alte Daten auf dem Tag wurden gelöscht")

    	# Für das Lesen und Schreiben von Classic Tags muss für die Authentifizierung die uid angegeben werden.
    	# Der Key für die Authentifizierung muss nicht angegeben werden, weil wir immer den Standardschlüssel verwenden.
    	if nfc.writeToClassic(textClassic,uid):
    		print("Tag erfolgreich beschrieben")
    	else:
    		print("Fehler beim Schreiben")

    	print("________READ_______")
    	# Ist success == True, dann enthält data die Daten auf dem Tag
    	# Ist success == False, dann enthält data die Fehlermeldung
    	success, data = nfc.readFromClassic(uid)
    	if success is False:
    		print(data)
    	elif success is True:
    		print(data)
    elif len(uid) == 7:
    	print("Mifare Ultralight")
    	print("UID:", [hex(i) for i in uid])

    	print("_______WRITE_______")
    	# Ist success == True, dann enthält data die NDEF Message
    	success, data = nfc.ndefEncode(text)
    	if success is False:
    		print(data)
    	elif success is True:
    		if nfc.writeToUltralight(data):
    			print("Tag erfolgreich beschrieben")
    		else:
    			print("Fehler beim Schreiben")

    	print("_______READ________")
    	success, data = nfc.readFromUltralight()
    	if success is False:
    		print(data)
    	elif success is True:
    		print("NDEF Message:",data)
    		success, data = nfc.ndefDecode(data)
    		if success is False:
    			print(data)
    		elif success is True:
    			print("Text:",data)
    time.sleep(5)

del nfc
