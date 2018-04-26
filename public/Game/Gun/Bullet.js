class Bullet extends Actor {

  constructor(x,y,s,d,l,rc,dmg){
    super(x,y,0,0,s,0);

    this.colour = new Colour().random();

    this.setSize(new SAT.Vector(5,5));

    this.setInitialLifeSpan(l);

    this.setLifespan(l);

    this.setDirection(d);

    this.setRicochetCount(rc);

    // getting the direction of the player in terms of a unit vector
    this.setAcc(new SAT.Vector(
      Math.cos(Utility.Radians(this.getDirection())),
      Math.sin(Utility.Radians(this.getDirection()))
    ));

    this.setSpeed(s);

    this.setFriction(1);

    this.setBulletDamage(dmg);

    this.applyImpulse(this.getAcc().scale(this.getSpeed()));

    this.setAirResistance(1.01);

    // 0 implies no random wobble
    this.setBulletAccuracy(0);

    this.collider = new CircularCollider(this.pos.x,this.pos.y,this.size.x);

    this.setTrail(10);
    this.setTrailWidth(5);

  }

  getBulletDamage(){
    return this.bulletDamage;
  }

  getBulletAccuracy(){
    return this.bulletAccurracy;
  }

  // getting the friction multiplier
  getAirResistance(){
    return this.airResistance;
  }

  getInitialLifeSpan(){
    return this.initialLifeSpan;
  }

  getRicochetCount(){
    return this.ricochetCount;
  }

  setBulletAccuracy(bulletAccurracy){
    return this.bulletAccurracy = bulletAccurracy;
  }

  setBulletDamage(bulletDamage){
    this.bulletDamage = bulletDamage;
  }

  setInitialLifeSpan(lifespan){
    this.initialLifeSpan = lifespan;
  }

  // a number that multiplies the friction effect on projectiles
  setAirResistance(airResistance){
    this.airResistance = airResistance;
  }

  setRicochetCount(count){
    this.ricochetCount = count;
  }

  setTrail(trail){
    this.trail = trail;
  }

  setTrailWidth(trailWidth){
    this.trailWidth = trailWidth;
  }

  evaluateVelocity(deltaTime){

    super.evaluateVelocity(deltaTime)

    // adding bullet inaccuracy
    this.getPos().add(new SAT.Vector(
      Utility.Random(-this.getBulletAccuracy(),this.getBulletAccuracy()),
      Utility.Random(-this.getBulletAccuracy(),this.getBulletAccuracy())
    ));

  }

  update(deltaTime){

    this.evaluateVelocity(deltaTime);

    // lifecycle methods
    if(!this.alive) return;

    // decrimenting life
    this.lifespan--;

    // checking ricochetCount count;
    if(this.ricochetCount <= 0) this.setAlive(false);

    // killing actor when lifespan ends
    if(this.lifespan <= 0) this.setAlive(false);

    // killing bullet when its too slow
    // if(this.getAcc().x === 0 && this.getAcc().y === 0) this.setAlive(false);

    // updating collider center position with current position
    this.collider.setPos(this.pos);

  }

  draw(camera){

    if(this.alive){

      Draw.fillCol(this.colour);

      Draw.circle(this.pos.x-camera.x,this.pos.y-camera.y,this.getSize().x);

    }

  }


}
