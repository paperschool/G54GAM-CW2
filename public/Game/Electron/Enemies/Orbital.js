class Orbital extends Electron {

  constructor(level,x,y,properties){

    super(x,y);

    this.level = level;

    this.setSpeed(properties.speed || 1.5);

    this.setOrbitDirection(properties.direction || -1)

    this.setTopSpeed(10.0);

    this.setRadius(Sizes.ENEMY.unit);

    this.setFriction(0.95);

    this.setInvincibility(false);

    this.setMargin(Sizes.MARGIN.unit);

    this.setCollider(new CircularCollider(this.getPos().x,this.getPos().y,this.getRadius()));

  }

  getOrbitDirection(){
    return this.orbitDirection;
  }

  getRadiusOffset(){
    return this.radiusOffset;
  }

  setOrbitDirection(orbitDirection){
    this.orbitDirection = orbitDirection;
  }

  setRadiusOffset(orbitOffset){
    this.orbitOffset = orbitOffset;
  }

  // TODO: Fix poor association to parent class
  update(deltaTime){

    // calculating angle of player relative to mouse (Kinda hacky as i know player is centered)
    // this.calculateDirection({x:CW/2,y:CH/2},input.mouse);

    this.getRadiusOffset(Utility.Random(-5,5));

    this.applyImpulse(new SAT.Vector(this.getSpeed()*this.getOrbitDirection(),0));

    super.update(deltaTime);

    this.setCollider(new CircularCollider(this.getPos().x,this.getPos().y,this.getRadius()+this.getRadiusOffset()));

    if(this.getLife() <= 0) this.setAlive(false);

  }

  draw(camera){

    Draw.fillCol(new Colour(255,100,100));
    Draw.circle(this.getPos().x-camera.x,this.getPos().y-camera.y,this.getRadius()+this.getRadiusOffset());

  }


}
