class EnvironmentalParticleSystem {

  constructor(level,focus,force,count,bound){

    // storing level reference
    this.level = level;

    // particle count
    this.count = count;

    // object to focus tracking bounding box to
    this.focusObject = focus;

    // force of particles
    this.force = new SAT.Vector(force.x,force.y);

    // offset of area
    this.areaOffset = 1;

    // area of partcle system
    this.area = new SAT.Vector(100,100);

    // collection of particles
    this.particles = [];

    // setup method
    this.setup();

  }


  setup(){

    // setting particle system bound space
    this.updateLiveSpace();

    // iterating over particle count
    for(let p = 0 ; p < this.count ; p++){
      // adding particles to particle collection
      this.particles.push(
        new EnvironmentParticle(
          new SAT.Vector(
            Utility.Random(this.minBound.x*this.areaOffset,this.maxBound.x*this.areaOffset),
            Utility.Random(this.minBound.y*this.areaOffset,this.maxBound.y*this.areaOffset)),
          Utility.Random(1,4)
        )
      )
    }

  }

  updateLiveSpace(){

    // setting bounding box area of particle system
    this.area = new SAT.Vector(CW,CH);

    // getting player position
    this.playerPos = new SAT.Vector(this.focusObject.getPos().x,this.focusObject.getPos().y);

    // setting min bound area
    this.minBound = new SAT.Vector(
      this.playerPos.x-(this.areaOffset*this.area.x),
      this.playerPos.y-(this.areaOffset*this.area.y)
    );

    // setting max bound area
    this.maxBound = new SAT.Vector(
      (this.areaOffset*this.area.x)+this.playerPos.x,
      (this.areaOffset*this.area.y)+this.playerPos.y
    );

  }

  update(deltaTime){

    // updating current particle space
    this.updateLiveSpace();

    // iteratinv over particle collection
    for(let particle of this.particles){

      // updating particle system
      particle.update(deltaTime);

      // applying force impulse
      particle.applyImpulse({x:this.force.x+Utility.Random(1,-1),y:this.force.y+Utility.Random(1,-1)});

      // this model checks particles against a bounding box that tracks with the player
      if(particle.getPos().x < this.minBound.x){
        particle.getPos().x = this.maxBound.x;
      }

      if(particle.getPos().x > this.maxBound.x){
        particle.getPos().x = this.minBound.x;
      }

      if(particle.getPos().y < this.minBound.y){
        particle.getPos().y = this.maxBound.y;
      }

      if(particle.getPos().y > this.maxBound.y){
        particle.getPos().y = this.minBound.y;
      }

    }

  }

  draw(camera){

    // iteratinv over particle collection
    for(let particle of this.particles){
      // drawing each particle
      particle.draw(camera);
    }

  }

}

class EnvironmentParticle extends Actor {

  constructor(pos,size){

    super(pos.x,pos.y);

    // setting particle size
    this.setSize(new SAT.Vector(size,size));

    // setting particle colour
    this.setColour(new Colour(255,255,255).randomGrey(240,255));

  }

  update(deltaTime){
    super.update(deltaTime);
  }

  draw(camera){

    // drawing particle
    Draw.fillCol(this.getColour());
    Draw.circle(this.getPos().x-camera.x,this.getPos().y-camera.y,this.getSize().x);

  }

}
