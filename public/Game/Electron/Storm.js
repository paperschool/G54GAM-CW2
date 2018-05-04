
class Storm {

  constructor(level,duration = 20000,delay = 10000){

    this.level = level;

    this.duration = duration;

    this.delay = delay;
    // this.delay = 0;

    this.direction = null;

    this.bound = new Rectangle(0,0,0,0);

    this.ions = [];

    // params for storm administration

    // this will kill the storm if it lasts too long
    this.stormTimeout = null;

    // this timer will stop reattempts to restart a storm
    this.stormDelay = new LevelTimer(this.delay,-1,false);

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

      // setting random ion direction before setup
      // this.direction = new SAT.Vector(Utility.Random(-1,1),Utility.Random(-1,1));

      // setting ion count before setup
      this.count = Utility.RandomInt(20,100)

      // setting up storm bounds
      this.bound = new Rectangle(
        this.level.player.getPos().x-2000,
        this.level.player.getPos().y-2000,
        4000,
        4000
      );

      let startpoint = new SAT.Vector(0,0);

      startpoint.x = ( 1 > Utility.Random(0,1) ) ? this.bound.pos.x : this.bound.pos.x + this.bound.size.x;
      startpoint.y = ( 1 > Utility.Random(0,1) ) ? this.bound.pos.y : this.bound.pos.y + this.bound.size.y;

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

    this.level.colour = new PulseColour(new Colour().random());
    this.level.colour.setR(0,0);
    this.level.colour.setG(100,200);
    this.level.colour.setB(100,200);

    this.level.camera.constantShaking = false;
    this.level.camera.resetShake(0);

  }

  update(deltaTime){

    // do not allow update (aka attempt new storm) until cooldown has passed
    if(this.stormDelay !== null && !this.stormDelay.isEnded()){
      return;
    }

    if(!this.storming){

      // this will try to start a storm and may fail
      this.startStorm();

    } else if(this.storming && this.stormTimeout.isEnded()) {

      this.endStorm();

    } else {

      // check player Collisions
      // check core collision

      if(this.count <= 0 || this.stormTimeout.isEnded()) this.endStorm();

      this.stormTimeout.update();

      for(let i = this.ions.length-1 ; i >= 0 ; i--){

        let ion = this.ions[i];

        ion.update(deltaTime);

        if(this.checkIonCollision(ion,this.level.player)){
          this.level.player.setAlive(false);
          this.killIon(i);
        }

        for(let core of this.level.cores.cores){
          if(this.checkIonCollision(ion,core)){
            this.level.camera.resetShake(10);
            this.killIon(i);
            this.level.particleSystem.addParticle(
              ion.pos.x,
              ion.pos.y,
              180+Utility.Degrees(Utility.angle(ion.getPos(),core.getPos())),
              ParticleType.ION
            );
          }
        }

        if(this.bound.checkPointInRectangle(ion.getPos())) {
          ion.active = true;
        } else if (ion.active) {
          this.ions.splice(i,1);
          this.count--;
        }

      }
    }
  }

  checkIonCollision(ion,other){
    return ion.getSize().x+other.getRadius() > Utility.dist(ion.getPos(),other.getPos());
  }

  killIon(index){
    this.count--;
    return this.ions.splice(index,1);
  }

  draw(camera){

    // this.bound.setColour(new Colour(255,255,255,0.3));
    // this.bound.draw(camera)

    for(let ion of this.ions){
      ion.draw(camera);
    }
  }

}

class Ion extends Actor {

  constructor(x,y,force,end){

    super(x,y);

    this.setSpeed(1);

    this.setSize(new SAT.Vector(30,50));

    this.setColour(new Colour(255,Utility.RandomInt(150,255),255));

    this.end = end;

    this.force = force;

    this.force.scale(this.getSpeed());

    this.setDirection(
      Utility.angleDegrees(this.force,this.end)
    );

    this.active = false;

  }

  update(deltaTime){
    this.applyImpulse(this.force);
    super.update(deltaTime);
  }

  draw(camera){

    Draw.line(
      this.pos.x-camera.x,
      this.pos.y-camera.y,
      this.end.x-camera.x,
      this.end.y-camera.y,
      Utility.Random(1,10),
      new Colour(255,255,255,0.1).getRGBA()
    );

    Draw.resetStroke();

    Draw.fillCol(this.getColour());
    Draw.circle(this.getPos().x-camera.x,this.getPos().y-camera.y,this.getSize().x);

    for(let trail = 0 ; trail < 5 ; trail++){

      let shade = Utility.RandomInt(20,220);

      Draw.fillCol(new Colour(shade,shade,shade,0.5));

      let trailPos = Utility.polarVectorDegrees(
        this.getPos(),
        this.getDirection()+180+Utility.Random(-80,80),
        Utility.Random(10,200)
      );

      Draw.circle(trailPos.x-camera.x,trailPos.y-camera.y,Utility.Random(10,this.getSize().x));
    }

  }

}
