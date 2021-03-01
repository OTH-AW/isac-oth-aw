class ForceAgent extends DrawableSample {

 constructor(id, agentController, x, y, obj) {
    super(id, agentController, x, y, obj) ;

    this.dir=new Vect(2,0); //Initial Speed
    this.dir = VectMath.rotate(this.dir,Math.random()*360);
    this.acceleration = new Vect(0,0);
    //if destination is set, agent will seek/arrive at that position
    this.destination = null;
  }


  setDestination(destination){
    this.destination = destination;
  }
  removeDestination(){
    this.destination = null;
  }

  //going to a destination, but still add separation, so agents don't overap
  goToDestination(){
    if(!this.destination) return;
    return true;
  }

  // Applys Schooling Algo
  //Like Shiffman Nature of Code
  school(agents) {
    var neighbors = this.getNeighbors(this.column,this.row);

    this.separate(neighbors);
    this.cohesion(neighbors);
  }

  separate(agents) { 
    var fRep = 2000.0;
    var steer = new Vect(0,0);
    agents.forEach( (other) => {
      if (other !== this){
        var dist = VectMath.subtract(this.pos,other.pos);
        var lensq = VectMath.getLengthSq(diff);
	     var force = lensq > 0 ? fRep/lensq : 0.0;
	     var normal = VectMath.normalize(dist);
	     var f = VectMath.scalarMultiply(normal, force);
        this.acceleration = VectMath.add(this.acceleration, f);
    }
  });
  }

  cohesion(agents) {
    var neighbordistSq = 2500;
    var sum = new Vect(0,0);
    var count = 0;
    agents.forEach( (other) => {
     var diff = VectMath.subtract(this.pos,other.pos);
     var dist = VectMath.getLengthSq(diff);
     if (dist > 0 && dist < neighbordistSq && this.howSimilarIs(other) > 0.5 ) {
        sum = VectMath.add(sum, other.pos);
      //sum = VectMath.add(sum, VectMath.scalarMultiply(other.dir,this.howSimilarIs(other)));
      count++;
    }
  });
    if (count > 0) {
     sum = VectMath.scalarMultiply(sum,1/count);
     return this.seek(sum);
   } else {
     return new Vect(0,0);
   }
 }

update() {
    super.update();
    //Move
    this.dir = VectMath.add(this.dir, this.acceleration);
    this.dir = VectMath.limit(this.dir, this.agentController.maxspeed);
    this.acceleration = new Vect(0,0);
    this.pos = VectMath.add(this.pos, this.dir);
  }

}
