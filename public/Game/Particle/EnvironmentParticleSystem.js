class EnvironmentalParticleSystem {

  constructor(level,focus,force,count,bound){

    this.level = level;

    this.count = count;

    this.focusObject = focus;

    this.force = new SAT.Vector(force.x,force.y);

    this.areaOffset = 1;

    this.area = new SAT.Vector(100,100);

    this.particles = [];

    this.setup();

  }


  setup(){

    this.updateLiveSpace();

    for(let p = 0 ; p < this.count ; p++){
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

    // this.area = new SAT.Vector(CW/2,CH/2);
    this.area = new SAT.Vector(CW,CH);

    this.playerPos = new SAT.Vector(this.focusObject.getPos().x,this.focusObject.getPos().y);

    this.minBound = new SAT.Vector(
      this.playerPos.x-(this.areaOffset*this.area.x),
      this.playerPos.y-(this.areaOffset*this.area.y)
    );

    this.maxBound = new SAT.Vector(
      (this.areaOffset*this.area.x)+this.playerPos.x,
      (this.areaOffset*this.area.y)+this.playerPos.y
    );

  }

  update(deltaTime){

    this.updateLiveSpace();

    for(let particle of this.particles){

      particle.update(deltaTime);

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

      // offscreen migration
      // if(particle.getPos().x > this.xBound.y){
      //   particle.getPos().x = this.xBound.x;
      // }
      //
      // if(particle.getPos().x < this.xBound.x){
      //   particle.getPos().x = this.xBound.y;
      // }
      //
      // if(particle.getPos().y > this.yBound.y){
      //   particle.getPos().y = this.yBound.x;
      // }
      //
      // if(particle.getPos().y < this.yBound.x){
      //   particle.getPos().y = this.yBound.y;
      // }

    }

  }

  draw(camera){

    for(let particle of this.particles){
      particle.draw(camera);
    }

  }

}

class EnvironmentParticle extends Actor {

  constructor(pos,size){

    super(pos.x,pos.y);

    this.setSize(new SAT.Vector(size,size));

    this.setColour(new Colour(255,255,255).randomGrey(240,255));

  }

  update(deltaTime){
    super.update(deltaTime);
  }

  draw(camera){

    Draw.fillCol(this.getColour());
    Draw.circle(this.getPos().x-camera.x,this.getPos().y-camera.y,this.getSize().x);

  }

}
