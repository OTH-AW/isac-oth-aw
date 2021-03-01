class Centroid{
	constructor (ocean, pos=false){
		this.ocean = ocean;
		this.color = "rgb("+parseInt(Math.random()*255)+","+parseInt(Math.random()*255)+","+parseInt(Math.random()*255)+")";
		this.assignedAgents = [];
		this.label = "";
		this.dimension = 30;
		this.initialFontsize = 18;
		this.fontsize = 18;
		if(pos){
			//If position is given in options, spawn centroid at that point
			this.pos = new Vect(pos.x,pos.y);
		}else{
			this.pos = new Vect(0, 0);
		}
	}

	/*
	* Calculate new median point between all assigned Agents @assignedAgents
	*/

	rename(){
		var found={}, maxFound = 0;
		/*
		the found-object will hold the number of occurences of a specific value (currently label)
		the highest value will be used as label for the centroid itself
		*/
		for(var i = 0; i < this.assignedAgents.length; i++){
			//if there's already an entry, increment, otherwise create with 1
			if(!found[this.assignedAgents[i].__label]){
				found[this.assignedAgents[i].__label] = 1;
			}else{
				found[this.assignedAgents[i].__label]++;
			}
			//found[this.assignedAgents[i].__label] = found[this.assingedAgents[i].__label] ? found[this.assignedAgents[i].__label]++ : 1;
		}

		//assign the maximum value to the centroids label
		for(var key in found){
			if(found[key] > maxFound){
				maxFound = found[key];
				this.label = key;
			}
		}
	}

	rearrange(){
		this.rename();
		var x = 0, y = 0;

		for(var i = 0; i < this.assignedAgents.length; i++){
			x+=this.assignedAgents[i].pos.x;
			y+=this.assignedAgents[i].pos.y;

		}
		if(this.assignedAgents.length > 0){
			this.pos.x = x/this.assignedAgents.length;
			this.pos.y = y/this.assignedAgents.length;
		}
	}
	draw() {
	      this.ocean.context.fillStyle = this.color;
              //log.clear();
	      //log.println("X:"+this.pos.x+" Y:"+this.pos.y);		
	      this.ocean.context.beginPath();
	      this.ocean.context.arc(this.pos.x, this.pos.y, this.dimension, 0, Math.PI*2, true);
	      this.ocean.context.closePath();
	      this.ocean.context.fill();
	      this.ocean.context.textAlign = 'center';
	      this.ocean.context.fillStyle = "#000";
	      this.ocean.context.font = this.fontsize+"px Verdana";
	      this.ocean.context.fillText(this.label,  this.pos.x,this.pos.y);
	}
}
