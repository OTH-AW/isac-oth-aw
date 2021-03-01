class Sample {
	constructor(id, obj) {
	    //Copy all properties
	    this.props = {};
	    this.props.__id = id;
	    for (var p in obj) {
	      if (p == 'label') {
		this.__label = obj[p];
	      }
	      this.props[p] = obj[p];
	    }
	    // Caching similarity;
	    this.similarity = {};		
	}
  
	//Compare properties of two agents
	  similarTo(other) {

		var value = 1;

		if (this.similarity[other.props.__id] === undefined) {
		    var not_similar = 1;	
		    for (var p in this.props) {
			
			if (this.props[p] !== other.props[p]) {
				// Caching
					var not_sim = 0;
					this.similarity[other.props.__id] = 0;
					if (typeof this.props[p] === 'number' && typeof other.props[p] === 'number') {
						if (Math.abs(this.props[p] - other.props[p]) > 0.001) { // With tolerance
							not_sim = 1;
						}		
					} else {
						not_sim = StringMetrics.levenshteinDistanceFast(String(this.props[p]),  String(other.props[p]));
					}
					not_similar += not_sim;
				}
			}
			// var cnt_props = Math.max( Object.keys(this.props).length, Object.keys(other.props).length);
	 
			this.similarity[other.props.__id] = 1 / not_similar;
		    }

		return  this.similarity[other.props.__id];
	  }

	  howSimilarIs(other) {
		return this.similarTo(other);  
	  }

}

