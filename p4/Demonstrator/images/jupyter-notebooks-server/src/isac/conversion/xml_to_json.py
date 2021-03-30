import json
import codecs
from xml.etree.ElementTree import fromstring
import xmljson

class XmlToJsonConverter:
    CONST_ABDERA = "Abdera"
    CONST_BadgerFish = "BadgerFish"

    def __init__(self):
        pass
        
    def convert(self, importFile, exportFile, importCharset = 'iso-8859-1', exportCharset = 'utf-8', jsonConvention = ''):
        with codecs.open(importFile, 'r', importCharset) as f:
            xmlString = f.read()
            encodedXmlString = str(xmlString.encode(exportCharset), exportCharset)

        log = ""
        log = log + "XML input " + importFile + " as " + importCharset + "\n"
        log = log + "Converted from " + importCharset + " to " + exportCharset + "\n"

        converter = self.getConverter(jsonConvention)
            
        jsonString = json.dumps(converter.data(fromstring(encodedXmlString)), indent=4)

        log = log + "\nJSON output to " + exportFile
        
        with codecs.open(exportFile, 'w') as f:
            f.write(jsonString)
        
        return log

    def getConverter(self, jsonConvention):
        converter = None
        if jsonConvention == self.CONST_BadgerFish:
            converter = xmljson.BadgerFish() 
        elif jsonConvention == self.CONST_ABDERA:
            converter = xmljson.Abdera()
        else:
            converter = xmljson.BadgerFish() 
        return converter