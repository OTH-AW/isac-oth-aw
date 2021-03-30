
# coding: utf-8

# ### Liest die Sensordaten für die Schnittstelle aus

# In[1]:


get_ipython().run_line_magic('run', '../Setup.ipynb')

import json
import numpy
import pandas as pd
from isac.database.connection import database_connector as connector
from isac import configuration


# In[2]:


connection = connector.DatabaseConnector(name = configuration.project_database).connect()


# In[3]:


class SensorDataProvider:
    
    def __init__(self):
        pass
    
    # Wird für die JSON-Konvertierung benötigt
    def handle_datatypes(self, o):
        if isinstance(o, numpy.int64): return int(o)  
        raise TypeError

    def getSensorData(self, sensorName):
        # getCollection
        collection = connection.getCollection(sensorName)

        # createDataframe 
        df = pd.DataFrame(list(collection.find()))

        are_bool_values = df.iloc[0]["Wert"] in ["False", "True"]
        if are_bool_values:
            df["Wert"] = df["Wert"].map({"False": 0, "True": 1})

        df = df.sort_values(by=['Zeit'])
        df = df.reset_index(drop=True)
        
        return df
        
    def getSensorDataAsJson(self, sensorName):
        df = self.getSensorData(sensorName)

        json_data = {}
        json_data['name'] = sensorName
        json_data['data'] = df[['Zeit', 'Wert']].to_dict(orient = 'records')

        return json.dumps(json_data, default=self.handle_datatypes)


# In[4]:


# # Beispiel
# if __name__ == "__main__":
#    provider = SensorDataProvider()
#    sensorName = "Bandbero_99_B09_Meldungen"
#    sensor_data = provider.getSensorDataAsJson(sensorName)
#    
#    obj = json.loads(sensor_data)
#    obj
#    
#    file_path = "../../data/json/" + str(sensorName) + ".json"
#    os.makedirs(os.path.dirname(file_path), exist_ok=True)
#                
#    with open(file_path, "w") as f:
#        f.write(sensor_data)


# In[5]:


if __name__ == "__main__":
    for collection in sorted(connection.getCollectionNames()):
        print(collection)
        provider = SensorDataProvider()
        sensorName = collection
        sensor_data = provider.getSensorDataAsJson(sensorName)

        file_path = "../../data/json/" + str(sensorName) + ".json"
        os.makedirs(os.path.dirname(file_path), exist_ok=True)

        with open(file_path, "w") as f:
            f.write(sensor_data)

