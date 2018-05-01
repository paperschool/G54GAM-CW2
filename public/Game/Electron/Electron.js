class Electron extends Actor {

  constructor(x = 0,y = 0,core = null){

    super(x,y);

    this.setCore(core);

    this.setRadius(100);

    this.setMargin(10);

    this.setJump(2);

    this.setDive(false);

    this.setDove(false);

  }

  getCanMoveRight(){
    return this.canMoveRight;
  }

  getCanMoveLeft(){
    return this.canMoveLeft;
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

  getDive(){
    return this.dive;
  }

  getDove(){
    return this.dove;
  }

  setMargin(margin){
    this.margin = margin;
  }

  // origin point of rotation
  setCore(core){
    this.core = core;
  }

  setInvincibility(set){
    this.invincible = set;
  }

  setCanMoveRight(canMoveRight){
    this.canMoveRight = canMoveRight;
  }

  // may have more behaviuour later but for now simply nulls the core
  releaseCore(){
    this.core = null;
  }

  setJump(jump){
    this.jump = jump;
  }

  setDive(dive){
    this.dive = dive;
  }

  setDove(dove){
    this.dove = dove;
  }

  evaluateVelocity(deltaTime){

    // setting back up position
    this.oldPos.set(this.getPos());

    // scaling for radius by calculating the radial speed then multiplying by sign direction
    this.getAcc().x = (Math.pow(this.getAcc().x,2) / this.getRadius()) * Math.sign(this.getAcc().x);

    // updating velocity with acceleration
    this.vel.add(this.acc);

    // normalising direction around 360 -> 0
    let newDirection = (this.getDirection()+this.getVel().x) % 360;

    // wrapping direction to positive angles
    newDirection = (newDirection < 0 ? newDirection+360 : newDirection);

    // set the direction
    this.setDirection(newDirection);

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
