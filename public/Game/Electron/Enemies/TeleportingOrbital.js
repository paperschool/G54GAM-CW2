
class TeleportingOrbital extends Orbital {

  constructor(level,x,y,properties){

    super(level,x,y,properties);

    // setting actor colour
    this.setColour(new Colour(255,100,255));

    // setting teleportation positions
    this.setTeleportLocations(properties.teleports);

    // setting teleport time out
    this.setTeleportTimeout(properties.timeout);

    // setting speed 0
    this.setSpeed(0);

    // setting index of current teleport
    this.setTeleportIndex(0);

    // defining level timeout
    this.teleportTimer = null;

    // setting timeout to 0 for first run
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

    // resetting teleport for next jump
    this.resetTeleportTimeout();

    // loop index trap
    this.setTeleportIndex(this.getTeleportIndex()+1);
    if(this.getTeleportIndex()+1 > this.getTeleportLocations().length){
      this.setTeleportIndex(0);
    }

    // inverting direction
    this.setDirection(this.getTeleportLocations()[this.getTeleportIndex()]);

  }

  update(deltaTime){

    super.update(deltaTime);

    // updating teleport time out
    this.teleportTimer.update(deltaTime);

    // checking timer has ended / not ended meaning teleport should happen
    if(this.teleportTimer.isEnded()){
      this.teleport();
    }

  }

  draw(camera){

    // drawing all possible teleport locations for hinting purposes
    for(let teleport = 0 ; teleport < this.getTeleportLocations().length ; teleport++){
      
      Draw.fill(255,255,255);
      let pos = this.getCore().getOrbitPosition(this,this.getTeleportLocations()[teleport]);
      Draw.circle(pos.x - camera.x,pos.y - camera.y,5);
      Draw.resetStroke();

    }

    super.draw(camera);
    Draw.resetStroke();

    // Draw.strokeCol(1,new  Colour(255,255,255));


  }

}
