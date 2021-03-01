class KMeans {
	
	constructor(ocean) {
		this.ocean = ocean;	
		this.centroids = [];
	}		

	rescale(val){
		for (let i = 0; i < this.centroids.length; i++){
			this.centroids[i].fontsize = this.centroids[i].initialFontsize * (parseFloat(val));
			this.centroids[i].dimension = this.centroids[i].initialDimension * (parseFloat(val));
		}
	}

	addCentroid(agent) {
		//check if centroid is there
		var foundCentroidAtClick=false;
		for (var i = 0; i < this.centroids.length; i++){
			if(Math.abs(this.ocean.clickInfo.x - this.centroids[i].pos.x) < this.centroids[i].dimension
				&& Math.abs(this.ocean.clickInfo.y - this.centroids[i].pos.y) < this.centroids[i].dimension){
				foundCentroidAtClick = true;
				this.centroids.splice(i,1);
				//remove all traces of centroids on agents if none is left
				if(this.centroids.length === 0){
					for(var j = 0; j < this.ocean.agents.length; j++){
						this.ocean.agents[j].assignedCentroid = null;
					}
				}
			}
		}
		if (!foundCentroidAtClick){
			this.centroids.push(this.getCentroid(agent));
			this.ocean.rescale(this.ocean.scale);
		}

	}
	// For common usage together with KModes
	getCentroid(agent) {
		return new Centroid(this.ocean, new Vect(this.ocean.clickInfo.x, this.ocean.clickInfo.y));
	}

	getAgent(id, agentController, clustering, x, y, obj){
		return new KMeansAgent(id, agentController, clustering, x, y, obj);
	}
	draw() {
		//Loop over centroids, rearrange and draw them
		for (var i = 0; i < this.centroids.length; i++){
			this.centroids[i].rearrange();
			this.centroids[i].draw();
		}
	}
}
