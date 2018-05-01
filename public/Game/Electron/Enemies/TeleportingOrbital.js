
class TeleportingOrbital extends Orbital {

  constructor(level,x,y,properties){

    super(level,x,y,properties);

    this.setColour(new Colour(255,100,255));

    this.setTeleportLocations(properties.teleports);

    this.setTeleportTimeout(properties.timeout);

    this.setSpeed(0);

    this.setTeleportIndex(0);

    // defining level timeout
    this.teleportTimer = null;

    this.resetTeleportTimeout();

  }

  getTeleportTimeout(){
    return this.teleportTimeout;
  }

  getTeleportIndex(){
    return this.teleportIndex;
  }

  getTeleportLocations(){
    return this.teleportLocations;
  }

  setTeleportTimeout(timeout){
    this.teleportTimeout = timeout;
  }

  setTeleportIndex(index){
    this.teleportIndex = index;
  }

  setTeleportLocations(teleportLocations){
    this.teleportLocations = teleportLocations;
  }

  resetTeleportTimeout(){

    // defining level timeout
    this.teleportTimer = new LevelTimer(
      this.getTeleportTimeout(),
      -1,false,new SAT.Vector(100,100),null
    );

  }

  teleport(){

    this.resetTeleportTimeout();

    // loop index trap
    this.setTeleportIndex(this.getTeleportIndex()+1);
    if(this.getTeleportIndex()+1 > this.getTeleportLocations().length){
      this.setTeleportIndex(0);
    }

    this.setDirection(this.getTeleportLocations()[this.getTeleportIndex()]);

  }

  update(deltaTime){

    super.update(deltaTime);

    this.teleportTimer.update(deltaTime);

    if(this.teleportTimer.isEnded()){

      this.teleport();

    }

  }

  draw(camera){

    super.draw(camera);

    Draw.resetStroke();

    for(let teleport = 0 ; teleport < this.getTeleportLocations().length ; teleport++){
      Draw.strokeCol(1,new  Colour(255,255,255));
      let pos = this.getCore().getOrbitPosition(this,this.getTeleportLocations()[teleport]);
      Draw.circleOutline(
        pos.x - camera.x,
        pos.y - camera.y,
        this.getRadius()
      )
    }

  }

}
