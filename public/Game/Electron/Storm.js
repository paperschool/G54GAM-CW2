
class Storm {

  constructor(level,duration = 20000,delay = 10000){

    // setting reference to level
    this.level = level;

    // setting storm duratiuon
    this.duration = duration;

    // setting minimum interval between storms
    this.delay = delay;
    // this.delay = 0;

    // direction of storm
    this.direction = null;

    // bounds of storm (centered around player)
    this.bound = new Rectangle(0,0,0,0);

    // collection of ions
    this.ions = [];

    // params for storm administration

    // this will kill the storm if it lasts too long
    this.stormTimeout = null;

    // this timer will stop reattempts to restart a storm
    this.stormDelay = new LevelTimer(this.delay,-1,false);

    // state of storm
    this.storming = false;

  }

  startStorm(){

    // chance of storm breaking out is 1 / 1000;
    if(1 > Utility.Random(0,100)){

      // hooking into level design for telegraphing
      this.level.colour = new PulseColour(new Colour().random());
      this.level.colour.setR(0,255);
      this.level.colour.setG(0,0);
      this.level.colour.setB(0,0);

      this.level.camera.constantShaking = true;
      this.level.camera.resetShake(4);

      // setting storm started flag
      this.storming = true;

      // setting ion count before setup
      this.count = Utility.RandomInt(20,100)

      // setting up storm bounds
      this.bound = new Rectangle(
        this.level.player.getPos().x-2000,
        this.level.player.getPos().y-2000,
        4000,
        4000
      );

      // start of storm set to top left
      let startpoint = new SAT.Vector(0,0);

      // horizontal start point is either far left or far right
      startpoint.x = ( 1 > Utility.Random(0,1) ) ? this.bound.pos.x : this.bound.pos.x + this.bound.size.x;

      // verticle start point is either top or bottom
      startpoint.y = ( 1 > Utility.Random(0,1) ) ? this.bound.pos.y : this.bound.pos.y + this.bound.size.y;

      // setting angle from start point to player position
      this.direction = Utility.pointsToVector(this.level.player.getPos(),startpoint);
      this.direction.normalize();

      // SETTING UP ION DIRECTION AND ION ARRAY

      // building ion arrays
      // iterating over count of o
      for(let ion = 0 ; ion < this.count ; ion++){

        // setting up default spawn position
        let pos = new SAT.Vector(this.bound.pos.x-this.bound.size.x,this.bound.pos.y-this.bound.size.y);

        // random selection for which axis the start is bound to (x,0) or (0,y);
        if(0.5 < Utility.Random(0,1)){

          // x is the dominant axis
          pos.x = Utility.Random(
            this.bound.pos.x - this.bound.size.x,
            this.bound.pos.x
          );

          pos.y = Utility.Random(
            this.bound.pos.y - this.bound.size.y,
            this.bound.pos.y
          );

          // if y direction will send ions up off the border immeditaly start
          // spawning at bottom of bound
          if(! Math.sign(this.direction.y) ){}

        } else {

          pos.x = Utility.Random(
            this.bound.pos.x - this.bound.size.x,
            this.bound.pos.x
          );

          // y is the dominant axis
          pos.y = Utility.Random(
            this.bound.pos.y - this.bound.size.y,
            this.bound.pos.y
          );

          // if x direction will send ions left off the border immeditaly start
          // spawning at right of bound
          if(! Math.sign(this.direction.x) ){}

        }

        let end = new SAT.Vector(
          pos.x+this.bound.size.x*2,
          pos.y+this.bound.size.y*2
        );

        // add new ion to array
        this.ions.push(new Ion(pos.x,pos.y,this.direction,end));

      }


      // setting up storm timeout incase storm takes "too long"
      this.stormTimeout = new LevelTimer(this.duration,-1,false);

      // nulling delay cool down
      this.stormDelay = null;

    }

  }

  endStorm(){

    // setting storming flag to false
    this.storming = false;

    // clearing ion array
    this.ions = [];

    // setting up storm cool down delay
    this.stormDelay = new LevelTimer(this.delay,-1,false);

    // setting background colour to calm colours again for telegraphing purposes
    this.level.colour = new PulseColour(new Colour().random());
    this.level.colour.setR(0,0);
    this.level.colour.setG(100,200);
    this.level.colour.setB(100,200);

    // disable camera shake
    this.level.camera.constantShaking = false;
    this.level.camera.resetShake(0);

  }

  update(deltaTime){

    // do not allow update (aka attempt new storm) until cooldown has passed
    if(this.stormDelay !== null && !this.stormDelay.isEnded()){
      return;
    }

    // if storming is false
    if(!this.storming){

      // this will try to start a storm and may fail
      this.startStorm();

    // if storming and storm time out has completed
    } else if(this.storming && this.stormTimeout.isEnded()) {

      // force end the storm
      this.endStorm();

    } else {

      // if ion count is 0 or timeout has ended, force end the storm
      if(this.count <= 0 ||  this.stormTimeout.isEnded()) this.endStorm();

      // update storm timer
      this.stormTimeout.update();

      // iterating over ions within storm
      for(let i = this.ions.length-1 ; i >= 0 ; i--){

        // getting reference to ion
        let ion = this.ions[i];

        // updating ion object
        ion.update(deltaTime);

        // checking ion collision with player
        if(this.checkIonCollision(ion,this.level.player)){
          // kill player
          this.level.player.setAlive(false);
          // kill ion
          this.killIon(i);
        }

        // iterating over each core of the level
        for(let core of this.level.cores.cores){
          // checking ion collision with core object
          if(this.checkIonCollision(ion,core)){

            // kill ion object
            this.killIon(i);

            // adding ion spray particles to system on collision
            this.level.particleSystem.addParticle(
              ion.pos.x,
              ion.pos.y,
              180+Utility.Degrees(Utility.angle(ion.getPos(),core.getPos())),
              ParticleType.ION
            );
          }
        }

        // if ion does not exceed bounds of storm
        if(this.bound.checkPointInRectangle(ion.getPos())) {
          // reset enable ion activity
          ion.active = true;

        // if not true and ion is currently active
        } else if (ion.active) {
          // kill ion
          this.killIon(i);
        }

      }
    }
  }

  // method to perform simple radial collision check ( a.radius + b.radius > distance(a,b) )
  checkIonCollision(ion,other){
    return ion.getSize().x+other.getRadius() > Utility.dist(ion.getPos(),other.getPos());
  }

  killIon(index){
    // deduct from counter
    this.count--;
    // splice ion out of ion collection
    return this.ions.splice(index,1);
  }

  draw(camera){

    // this.bound.setColour(new Colour(255,255,255,0.3));
    // this.bound.draw(camera)

    // iterating over ion collection
    for(let ion of this.ions){
      // drawing each ion
      ion.draw(camera);
    }
  }
}

class Ion extends Actor {

  constructor(x,y,force,end){

    super(x,y);

    // setting speed of ion
    this.setSpeed(1);

    // setting size of ion
    this.setSize(new SAT.Vector(30,50));

    // setting colour of ion as random purple grey colour
    this.setColour(new Colour(255,Utility.RandomInt(150,255),255));

    // setting end vector
    this.end = end;

    // setting launch vector
    this.force = force;

    // setting force direction
    this.force.scale(this.getSpeed());

    // setting direction as angle connecting start and end vectors
    this.setDirection(
      Utility.angleDegrees(this.force,this.end)
    );

    // setting activity to true
    this.active = false;

  }

  update(deltaTime){
    // applying impulse to ion using force value
    this.applyImpulse(this.force);

    // updating parent
    super.update(deltaTime);
  }

  draw(camera){

    // drawing hint line from current position to end
    Draw.line(
      this.pos.x-camera.x,
      this.pos.y-camera.y,
      this.end.x-camera.x,
      this.end.y-camera.y,
      Utility.Random(1,10),
      new Colour(255,255,255,0.1).getRGBA()
    );

    Draw.resetStroke();

    // drawing ion object
    Draw.fillCol(this.getColour());
    Draw.circle(this.getPos().x-camera.x,this.getPos().y-camera.y,this.getSize().x);

    // iterating over arbitrary number of trail particles
    for(let trail = 0 ; trail < 5 ; trail++){

      // determining shade of colour for trail item
      let shade = Utility.RandomInt(20,220);

      // setting fill as half visible shade colour
      Draw.fillCol(new Colour(shade,shade,shade,0.5));

      // drawing trail using inverted direction and random offset from that direction
      let trailPos = Utility.polarVectorDegrees(
        this.getPos(),
        this.getDirection()+180+Utility.Random(-80,80),
        Utility.Random(10,200)
      );

      // drawing trail sprite circle
      Draw.circle(trailPos.x-camera.x,trailPos.y-camera.y,Utility.Random(10,this.getSize().x));
    }

  }

}
