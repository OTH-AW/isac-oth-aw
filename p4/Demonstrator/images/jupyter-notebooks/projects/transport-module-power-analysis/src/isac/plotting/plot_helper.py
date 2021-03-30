import matplotlib.cm as cm
import numpy as np
import matplotlib.pyplot as plt

from PIL import Image

def savePlotLocal(picture_name, figsize=None, dpi=300, cmap=cm.Greys_r):
	if figsize is None:
		figsize = plt.gcf().get_size_inches()
	# if dpi is None:
	#     dpi = plt.gcf().get_dpi()
		
	plt.savefig(picture_name, format='png', dpi=dpi, bbox_inches='tight', pad_inches=0.1)
	plt.figure(figsize=figsize, dpi=dpi)

	image=Image.open(picture_name).convert("L")
	arr=np.asarray(image)   
	plt.figimage(arr, cmap=cmap, resize=True)
	
	plt.savefig(picture_name.replace(".png", "_grey.png"), format='png')