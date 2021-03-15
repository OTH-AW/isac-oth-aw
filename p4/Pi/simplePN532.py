import ndef
import RPi.GPIO as GPIO
import pn532.pn532 as nfc
from pn532 import *
import json

class simplePN532:
    #Settings
    maxBlocksUltralight = 220 #Wie viele Blocks beschrieben werden koennen auf Ultralight
    allowedClassicBlocks = [1,2] #Welche Blocks beschrieben werden duerfen auf Classic
    lenACB = len(allowedClassicBlocks)

    #Konstruktor
    def __init__(self):
    	#SPI connection
    	#self.pn532 = PN532_SPI(debug=False, reset=20, cs=4)
    	#I2C connection
    	self.pn532 = PN532_I2C(debug=False, reset=20, req=16)

    	ic, ver, rev, support = self.pn532.get_firmware_version()
    	print("Firmware version: {0}.{1}".format(ver, rev))

    	self.pn532.SAM_configuration()

    #Destruktor
    def __del__(self):
    	GPIO.cleanup()

    #Erstellt aus einem String eine NDEF Message
    #Return: Tupel (Boolean, Data)
    #        True -> Data = Bytearray
    #        False -> Data = String
    def ndefEncode(self,data):
    	#JSON Minimierung
    	try:
    		data = json.loads(data)
    	except:
    		return False, "Fehler beim Kodieren (kein JSON)"

    	if len(json.dumps(data).replace(" ","")) > 830:
    		if 'storageProcesses' in data['state']:
    			data['state'].pop('storageProcesses')
    		if 'timeEstimate' in data['state']:
    			data['state'].pop('timeEstimate')
    		if 'timeCurrent' in data['state']:
    			data['state'].pop('timeCurrent')
    		if 'timeLeft' in data['state']:
    			data['state'].pop('timeLeft')
    		if 'completion' in data['state']:
    			data['state'].pop('completion')
    		if 'printStartingTime' in data['state']:
    			data['state'].pop('printStartingTime')
    	if 'controlProcesses' in data['state']:
    		CPLength = len(data['state']['controlProcesses'])
    		if len(json.dumps(data).replace(" ","")) > 830 and CPLength > 1:
    			lastControl = data['state']['controlProcesses'][CPLength -1]
    			data['state']['controlProcesses']  =  []
    			data['state']['controlProcesses'].append(lastControl)
    	if len(json.dumps(data).replace(" ","")) > 830:
    		if 'order' in data:
    			if 'address' in data['order']['customer']:
    				data['order']['customer'].pop('address')
    			if 'address2' in data['order']['customer']:
    				data['order']['customer'].pop('address2')
    			if 'ort' in data['order']['customer']:
    				data['order']['customer'].pop('ort')
    	if len(json.dumps(data).replace(" ","")) > 830:
    		if 'order' in data:
    			if 'shape' in data['order']:
    				data['order'].pop('shape')
    			if 'color' in data['order']:
    				data['order'].pop('color')
    			if 'createdAt' in data['order']:
    				data['order'].pop('createdAt')
    			if 'createdAt' in data:
    				data.pop('createdAt')

    	data = json.dumps(data).replace(" ","")

    	#Encoding des Records und Message
    	recordsLength=200
    	dataSplitted = [data[i:i+recordsLength] for i in range(0, len(data),recordsLength)]
    	recordList = []
    	for i in dataSplitted:
    		recordList.append(ndef.TextRecord(i))

    	try:
    		ndefData = bytearray(b''.join(ndef.message_encoder(recordList)))
    	except:
    		return False, "Fehler beim Kodieren"

    	#Hinzufuegen von TLV
    	messageStart = bytearray(b'')
    	messageStart.extend([0x03])
    	dataLen = len(ndefData)

    	if dataLen > 65535:
    		return False, "String kann nicht kodiert werden! Grund: Zu lang"
    	if dataLen <= 254:
    		messageStart.extend([dataLen])
    	else:
    		hex_string = '{:04x}'.format(dataLen) #Formatierung der Laenge in Hex 2er Komplement
    		messageStart.extend([0xFF])
    		messageStart.extend([int(hex_string[0:2],16)])
    		messageStart.extend([int(hex_string[2:4],16)])

    	ndefData = messageStart + ndefData
    	ndefData.extend([0xFE])

    	return True, ndefData

    #Entfernt TLV + leere Felder und decoded die Message
    #Arg: data als Bytearray
    #Return: Text Record (Zugriff auf Daten: record.text)
    def ndefDecode(self,data):
    	ndefLen = 0

    	#Entfernt alle unnoetigen Bytes ab dem TLV-Ende (0xFE)
    	for i in range(len(data)):
    		if data[i] == 0xFE:
    			ndefLen = i
    			break
    	data = data[:ndefLen]

    	#Ist data[1] auf 0xFF (255) gesetzt, verwendet TLV 2 Bytes fuer die Laengenangabe. Dementsprechend muessen wir auch mehr entfernen
    	try:
    		if data[1] == 0xFF:
    			data = data[4:]
    		else:
    			data = data[2:]
    	except:
    		return False, "Fehler beim Dekodieren (kein NDEF)"

    	try:
    		records = list(ndef.message_decoder(data))
    	except:
    		return False, "Fehler beim Dekodieren"

    	text = ""
    	for record in records:
    		text += record.text
    	return True, text

    #Gibt UID zurueck wenn ein Tag gefunden wird
    #Return: Bytearray
    def scanForTag(self):
    	uid = self.pn532.read_passive_target(timeout=0.5)
    	return uid

    #Schreibt ein Bytearray auf ein Ultralight bzw. NTAG2XX Tag
    #Arg: data als Bytearray
    #Return: Boolean
    def writeToUltralight(self,data):
    	arrLen = len(data)

    	#Da immer 4 Bytes pro Block geschrieben werden muessen, fuellen wir das Bytearray passend auf
    	data.extend([0] * (4 - (arrLen%4)))

    	#Schreiben der einzelnen Blocks
    	for i in range(len(data) // 4):
    		if i >= self.maxBlocksUltralight:
    			return False

    		try:
    			self.pn532.ntag2xx_write_block(4 + i, data[i * 4:(i+1) * 4])
    		except:
    			print("Tag wurde entfernt oder kann nicht mehr erkannt werden!")
    			return False

    	return True

    #Liest den Speicher des Tags aus (Nur die Anzahl der Blocks aus den Settings)
    #Return: Tupel (Boolean, Data)
    #        True -> data = Bytearray
    #        False -> data = String
    def readFromUltralight(self):
    	data = b''
    	for i in range(self.maxBlocksUltralight):
    		try:
    			block = self.pn532.ntag2xx_read_block(4+i)
    			data += block
    			for byte in block:
    				if byte == 254:
    					return True, data
    		except:
    			return False, "Fehler beim Lesen"
    	return True, data

    #Arg: data als String
    def writeToClassic(self,data,uid):
    	dataByteArr = bytearray(data, 'utf-8')
    	arrLen = len(dataByteArr)

    	#Da immer 16 Byte pro Block geschrieben werden muessen, fuellen wird das Bytearray passend auf
    	dataByteArr.extend([0] * (16 - (arrLen%16)))

    	#Schreiben der einzelnen Blocks
    	for i in range(len(dataByteArr) // 16):
    		if i >= self.lenACB:
    			return False

    		try:
    			#Vor dem Lesen bzw. Schreiben, muss man sich authentifizieren. Dies geschieht hier mit dem Standard-Schluessel: 0xFF 0xFF 0xFF 0xFF 0xFF 0xFF
    			self.pn532.mifare_classic_authenticate_block(uid, self.allowedClassicBlocks[i], nfc.MIFARE_CMD_AUTH_A,[0xFF,0xFF,0xFF,0xFF,0xFF,0xFF])
    			self.pn532.mifare_classic_write_block(self.allowedClassicBlocks[i], dataByteArr[i * 16:(i+1) * 16])
    		except:
    			print("Tag wurde entfernt oder kann nicht erkannt werden!")
    			return False
    	return True

    def clearClassic(self,uid):
    	for i in self.allowedClassicBlocks:
    		try:
    			self.pn532.mifare_classic_authenticate_block(uid,i,nfc.MIFARE_CMD_AUTH_A,[0xFF,0xFF,0xFF,0xFF,0xFF,0xFF])
    			self.pn532.mifare_classic_write_block(i,[0]*16)
    		except:
    			return False
    	return True

    #Return: Tupel (Boolean, Data)
    #        True -> Data = String
    #        False -> Data = String
    def readFromClassic(self, uid):
    	data = b''
    	for i in range(self.lenACB):
    		try:
    			self.pn532.mifare_classic_authenticate_block(uid, self.allowedClassicBlocks[i], nfc.MIFARE_CMD_AUTH_A,[0xFF,0xFF,0xFF,0xFF,0xFF,0xFF])
    			data += self.pn532.mifare_classic_read_block(self.allowedClassicBlocks[i])
    		except:
    			return False, "Tag wurde entfernt oder kann nicht erkannt werden!"
    	leng = 0
    	for i in range(len(data)):
    		if data[i] == 0x00:
    			leng = i
    			break
    	content = data[:leng].decode("utf-8")
    	return True, content
