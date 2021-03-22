
# coding: utf-8

# In[1]:


import os
from os.path import dirname
import sys


# ## Root-Verzeichnis finden

# In[2]:


root_path = get_ipython().run_line_magic('pwd', '')

# Wenn diese Bedingungen erfüllt sind, ist es das gültige
# Root-Projektverzeichnis
def is_root_path(path):
    subfolders = [f.name for f in os.scandir(path) if f.is_dir()]
    if "data" in subfolders and "notebooks" in subfolders and "src" in subfolders:
        return True
    else:
        return False
    
def try_find_root_path(path):
    if is_root_path(path):
        return path
    else:
        # Versuche Parent-Verzeichnis
        parentdir = dirname(path)
        if parentdir == path:
            # Top-Level erreicht, Root-Path nicht gefunden
            return None
        else:
            return try_find_root_path(parentdir)
        
root_path = try_find_root_path(root_path)


# ## Zusätzliche Pfade einbinden

# In[3]:


module_path = os.path.join(root_path, 'notebooks')
sys.path.append(module_path)

module_path = os.path.join(root_path, 'src')
sys.path.append(module_path)


# ## Notebook Loader registrieren

# In[4]:


## Initialize Notebook Loader
from isac.loader import notebook_loader as loader
loader.register()

