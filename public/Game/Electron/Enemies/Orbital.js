class Orbital extends Electron {

  constructor(level,x,y,properties){

    super(x,y);

    // setting level reference
    this.level = level;

    // setting actor colour
    this.setColour(new Colour(255,100,100));

    // setting speed of actor
    this.setSpeed(properties.speed || 1);

    // setting rotational orbit direction
    this.setOrbitDirection(properties.direction || -1)

    // setting top speed of actor
    this.setTopSpeed(10.0);

    // setting renderable radius of actor
    this.setRadius(Sizes.ENEMY.unit);

    // setting movement friction value
    this.setFriction(0.95);

    // setting invincibility of actor
    this.setInvincibility(false);

    // setting radius margin for orbit
    this.setMargin(Sizes.MARGIN.unit);

    // creating collider for the circle for collision purposes
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

  setRadiusOffset(radiusOffset){
    this.radiusOffset = radiusOffset;
  }

  // TODO: Fix poor association to parent class
  update(deltaTime){

    // calculating angle of player relative to mouse (Kinda hacky as i know player is centered)
    // this.calculateDirection({x:CW/2,y:CH/2},input.mouse);

    // applying visual offset to radius
    this.setRadiusOffset(Utility.Random(-5,5));

    // applying a constant speed * orbit direction acceleration to player
    this.applyImpulse(new SAT.Vector(this.getSpeed()*this.getOrbitDirection(),0));

    // updating parent
    super.update(deltaTime);

    // updating collider object
    this.setCollider(new CircularCollider(this.getPos().x,this.getPos().y,this.getRadius()+this.getRadiusOffset()));

    // checking life state of the actor
    if(this.getLife() <= 0) this.setAlive(false);

  }

  draw(camera){

    // setting colour and drawing circle of actor
    Draw.fillCol(this.getColour());
    Draw.circle(this.getPos().x-camera.x,this.getPos().y-camera.y,this.getRadius()+this.getRadiusOffset());

  }


}
