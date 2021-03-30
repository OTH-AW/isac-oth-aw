
# coding: utf-8

# In[1]:


get_ipython().run_line_magic('run', '../Setup.ipynb')

from isac.database.connection import database_connector as connector
from isac import configuration
from data_compare import sensor_data_provider as sdp

import pandas as pd
import math
import json
import urllib.parse


# In[2]:


dataProvider = None


# In[3]:


REQUEST = json.dumps({
    'path' : {},
    'args' : {
                'sensor_name': ['Bandbero_99_B09_Meldungen'],
                'wst': [1]
             }
})


# In[4]:


# Daten des Sensors Filtern
def filter_data(data, selected_wst):  
    cycle_every_n = 12 # Ein Zyklus ist nach n Signalen komplett
    
    # selected wst -1, da selected_wst von 1-6 statt 0-5
    wst_data = pd.concat([data[0 + (selected_wst-1) * 2::cycle_every_n],
                          data[1 + (selected_wst-1) * 2::cycle_every_n]]).sort_values(by=['Zeit'])

    return wst_data


# In[5]:


# Wird für die JSON-Konvertierung benötigt
def handle_datatypes(self, o):
    if isinstance(o, numpy.int64): return int(o)  
    raise TypeError
        
def df_to_json(sensor_name, df):
    json_data = {}
    json_data['name'] = sensor_name
    json_data['data'] = df[['Zeit', 'Wert']].to_dict(orient = 'records')

    return json.dumps(json_data, default=handle_datatypes)


# In[6]:


# GET /get_sensor_data  
if dataProvider is None:
    dataProvider = sdp.SensorDataProvider()
    
req = json.loads(REQUEST)
args = req['args']

if 'sensor_name' not in args:
    print("Missing parameter: 'sensor_name'")
else:
    sensor_name = urllib.parse.unquote(args['sensor_name'][0])  
    data = dataProvider.getSensorData(sensor_name)
    
    if 'wst' in args:
        data = filter_data(data, int(args['wst'][0]))
        
    print(df_to_json(sensor_name, data))

