import pymongo
import subprocess
from os import environ

class DatabaseConnector:
    url = ''
    port = -1
    name = ''
    client = None

    def __init__(self, url = 'localhost', port = 27017, name = 'ISAC_Local'):
        if "MONGODB_HOST" in environ:
            self.url = environ['MONGODB_HOST']
        else:
            self.url = url
        self.port = port
        self.name = name
        pass
        
    def connect(self):
        self.client = pymongo.MongoClient(self.url, self.port)
        self.db = self.client[self.name]
        return self
    
    def disconnect(self):
        self.client.close()
        return self
    
    def getCollectionNames(self):
        return self.db.list_collection_names()

    def getCollection(self, collection):
        return self.db[collection]
    
    def massImport(self, collection, file, fileType = 'json', dropCollection = True, *optionalParameters):
        parameters = ['mongoimport',
                        '--db', self.name,
                        '--collection', collection,
                        '--type', fileType,
                        '--file', file]

        if dropCollection:
            parameters.append('--drop')

        if optionalParameters:
            for par in optionalParameters:
                parameters.append(par)

        return subprocess.call(parameters)