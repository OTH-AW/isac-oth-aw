
# coding: utf-8

# # Daten in MongoDB importieren

# In[1]:


get_ipython().run_line_magic('run', '../Setup.ipynb')

from isac.database.connection import database_connector as connector
from isac import configuration
import datetime
import time


importDirectory = "../../data/db_data_export/"
connection = connector.DatabaseConnector(name = configuration.project_database).connect()


# # Vorsicht Limit für offene Dateien auf MacOS oder Linux anpassen
# 
# ```ulimit -n``` liegt in der Regel bei 256 (MacOs High Sierra, Stand Februar 2019). Dieses wird beim Bearbeiten von mehr als 128 Files überschritten. Da hier immer ein Import einer Datei ausgeführt wird, auf der eine sofortige neue Connection zum Bearbeiten des TimeStamps geöffnet wird. Bei mehr als 128 Files wird bei Files * 2 auch das ulimit -n überschritten.
# 
# ## ```ulimit -n 1024``` des für mongod-Session setzen
# 
# Mit ```ulimit -n 1024``` wird via Terminal für die aktuelle Terminal-Session das File-Limit angepasst. Session-Max-Limit liegt bei 1024 (MacOS HighSierra, Stand Februar 2019). 
# Damit auch das File-Limit für den entsprechend verantwortlichen ```mongod```an der richtigen Stelle greift, ist darauf zu achten, dass in der Session (also z.B. in dem Terminal-Fenster, in dem der mongod gestartet wird) des ```mongod``` das ulimit entsprechend gesetzt wird.

# ### In Mongo speichern

# In[2]:


def importFileIntoMongo(collection, file):
    print("Import File: " + str(file))
    exitcodeMassImport = connection.massImport(collection,
                                     file,
                                     'csv',
                                     True,
                                     '--fields',
                                     'Zeit,Wert')
    print("Exitcode Mass Import: " + str(exitcodeMassImport))
    return exitcodeMassImport

def addTimestamp(collection, timestamp):
    exitcode = connection.getCollection(collection).update_many(
        {},
        {
            '$inc': {'Zeit': timestamp}
        })
    return exitcode

for directory in os.listdir(importDirectory):
    path_sub_directory = os.path.join(importDirectory, directory)
    if os.path.isdir(path_sub_directory):
        year = int(directory.split("_")[0])
        month = int(directory.split("_")[1])
        day = int(directory.split("_")[2])
    
        for idx, filename in enumerate(os.listdir(path_sub_directory)):
            if filename.endswith(".csv"):
                print("File %i von %i" % (idx, len(os.listdir(path_sub_directory))))
                absFilePath = path_sub_directory + '/' + filename
                collection = os.path.splitext(filename)[0]
                importFileIntoMongo(collection, absFilePath)
                # Fix, da der Tag nicht in den Ursprungsdaten enthalten ist
                timestamp = datetime.datetime(year, month, day)
                unixtime = time.mktime(timestamp.timetuple()) * 1000
                addTimestamp(collection, unixtime)
                continue
            else:
                continue

