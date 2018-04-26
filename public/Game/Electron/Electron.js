class Electron extends Actor {

  constructor(x = 0,y = 0,core = null){

    super(x,y);

    this.setCore(core);

    this.setRadius(100);

    this.setMargin(10);

    this.setJump(2);

  }

  // getting origin point of location
  getCore(){
    return this.core;
  }

  // spacing for radial calculation purposes
  getMargin(){
    return this.margin;
  }

  getJump(){
    return this.jump;
  }

  setMargin(margin){
    this.margin = margin;
  }

  // origin point of rotation
  setCore(core){
    this.core = core;
  }

  setJump(jump){
    this.jump = jump;
  }

  // apply impulse in left acceleration
  moveLeft(){
    this.applyImpulse(new SAT.Vector(-this.getSpeed().x,0));
  }

  evaluateVelocity(deltaTime){

    // setting back up position
    this.oldPos.set(this.getPos());

    // updating velocity with acceleration
    this.vel.add(this.acc);

    // set the direction
    this.setDirection(this.getDirection()+this.getVel().x);

    // normalise to 360
    this.setDirection(this.getDirection() % 360);

    this.pos.set(
      this.getCore().getOrbitPosition(this)
    );

    // setting acceleration to 0
    this.acc.scale(0);

    // setting velocity scale by friction value
    this.vel.scale(this.getFriction());

  }

  update(deltaTime){

    super.update(deltaTime);

    this.setCollider(new CircularCollider(this.getPos().x,this.getPos().y,this.radius));

  }


}
