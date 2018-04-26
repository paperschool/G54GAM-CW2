class Actor extends Rectangle {

  constructor(x = 0,y = 0) {

    super(x,y,0,0);

    // living state of actor
    this.setAlive(true);

    // lifespan
    this.setLifespan(0);

    // direction value in degrees
    this.setDirection(0)

    this.collider = null;

    this.isColliding = false;

    // default value
    this.acc = new SAT.Vector(0,0);

    // calulcated Acceleration based off of input / friction
    this.setAcc(new SAT.Vector(0,0));

    // default value
    this.vel = new SAT.Vector(0,0);

    // final velocity applies to actor
    this.setVel(new SAT.Vector(0,0));

    // default value
    this.oldPos = new SAT.Vector(0,0);

    // roll back position
    this.setOldPos(new SAT.Vector(this.getPos().x,this.getPos().y));

    // friction applies to acceleration vector before being set to velocity
    this.setFriction(0.9);

    // player speed increment
    this.setSpeed(0);

    // speed cap
    this.setTopSpeed(0)

    // turning speed
    this.setTopSpeed(0)

    // weapon actor is holding
    this.weapon = null;

    this.weaponType = null;

    // boolean for weapon firing state
    this.firing = false;

    // life at beginning
    this.initialLife = 100;

    // life variable
    this.life = this.initialLife;

    // this.sprite = new Sprite("Game/Assets/Sprites/topDown.gif",250,213,this.pos.x,this.pos.y,1);

    this.sprite = null;

    // switch debug draw on or off
    this.debugOn = true;

  }

  getRadius(){
    return this.radius;
  }

  getFiring(){
    return this.firing;
  }

  getDebugOn(){
    return this.debugOn;
  }

  getLife(){
    return this.life;
  }

  getShot(){
    return this.shot;
  }

  getAlive(){
    return this.alive;
  }

  getDirection(){
    return this.direction;
  }

  getAcc(){
    return this.acc;
  }

  getVel(){
    return this.vel;
  }

  getFriction(){
    return this.friction;
  }

  getSpeed(){
    return this.speed;
  }

  getTopSpeed(){
    return this.topSpeed;
  }

  getWeapon(){
    return this.weapon;
  }

  getLifespan(){
    return this.lifespan;
  }

  getCollider(){
    return this.collider;
  }

  getCollisionState(){
    return this.isColliding;
  }

  getTurnSpeed(){
    return this.turnSpeed;
  }

  getLevel(){
    return this.level;
  }

  getOldPos(){
    return this.oldPos;
  }

  getWeaponType(){
    return this.weaponType;
  }

  getSprite(){
    return this.sprite;
  }

  setRadius(radius){
    this.radius = radius;
  }

  setFiring(firing){
    this.firing = firing;
  }

  setDebugOn(debugOn){
    this.debugOn = debugOn;
  }

  setLife(life){
    this.life = life;
  }

  setAlive(alive){
    this.alive = alive;
  }

  setDirection(direction){
    this.direction = direction;
  }

  setAcc(acc){
    this.acc.set(acc);
  }

  setVel(vel){
    this.vel.set(vel);
  }

  setFriction(friction){
    this.friction = friction;
  }

  setSpeed(speed){
    this.speed = speed;
  }

  setTopSpeed(speed){
    this.topSpeed = speed;
  }

  setWeaponType(weaponType){
    this.weaponType = weaponType;
  }

  setWeapon(weapon){
    this.weapon = weapon;
  }

  updateWeaponPos(){
    if(this.weapon){
      this.weapon.setPos(this.getPos());
      this.weapon.setWeaponOffset();
    }
  }

  setLifespan(lifespan){
    this.lifespan = lifespan;
  }

  setShot(shot){
    this.shot = shot;
  }

  setCollider(collider){
    this.collider = collider;
  }

  setCollisionState(state){
    this.isColliding = false;
  }

  setLevel(level){
    this.level = level;
  }

  setSprite(sprite){
    this.sprite = sprite;
  }

  setOldPos(){
    this.oldPos.set(this.getPos())
  }

  rollBackPosition(){
    this.getPos().set(this.getOldPos());
    if(this.weapon) this.weapon.setPos(this.getPos());
  }

  setTurnSpeed(turnspeed){
    this.turnSpeed = turnspeed;
  }

  flipDirection(){
      this.direction += 180;
  }

  applyDamage(bullet){

    let d = Math.floor(20 * ((1.0 / bullet.getInitialLifeSpan()) * bullet.getLifespan()));

    // diagnostic.updateLine("-Bullet Dmg",bullet);
    this.life -= bullet.getBulletDamage();

  }

  applyAcc(newAcc){

    // using acceleration as an impulse rather than as a force
    // this.acc.set(newAcc);
    this.acc.set(newAcc);

  }

  applyVel(newVel){
    this.vel.add(newAcc);
  }

  applyImpulse(impulse){
    this.acc.add(impulse);
  }

  // calculates polar position from cartesian
  getPolarVector(pos,d,r){
    return new SAT.Vector(
      pos.x + Math.cos(Utility.Radians(d)) * r,
      pos.y + Math.sin(Utility.Radians(d)) * r
    );
  }

  evaluateVelocity(deltaTime){

    // setting back up position
    this.oldPos.set(this.getPos());

    // updating velocity with acceleration
    this.vel.add(this.acc);

    // updating position velocity vector
    this.pos.add(this.vel);

    // setting acceleration to 0
    this.acc.scale(0);

    // setting velocity scale by friction value
    this.vel.scale(this.getFriction());


  }

  calculateDirection(pointFrom,pointTo){
    // short circuit NaN catch clause
    this.setDirection((Utility.Degrees(Utility.angle(pointFrom,pointTo)) || this.getDirection()));
  }

  // turning with considerations on turning speed
  turnTo(pointFrom,pointTo,speed = this.turnSpeed){

    let dir =  Utility.Degrees(Utility.angle(pointFrom,pointTo));

    if(Math.abs(dir-this.direction) <= 1) return;

    let s = Math.sign(dir - this.direction);

    this.direction += s*this.turnSpeed;

    if(isNaN(s) || isNaN(this.getDirection())){
      throw new Error("Direction Calculated Wrong");
    }


  }

  update(deltaTime){

    super.update(deltaTime);

    // calculating velocity from acceleration, friction etc
    this.evaluateVelocity(deltaTime);

    if(this.sprite != null){
      this.sprite.setDirection(this.getDirection());
      this.sprite.setPos(this.getPos())
    }

  }

  draw(camera){
    super.draw(camera);
  }

}
