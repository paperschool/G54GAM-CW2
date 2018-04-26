
class Gun extends Actor {

  // x and y specify position, f = fire rate, ss = shot count;
  constructor(x,y,f,r,rc){
    super(x,y,1,1,0,0);

    // hard coded type (escaping javascripts poor typing)
    this.type = PickupType.GUN;

    // setting colour of actor
    this.colour = new Colour(51,51,51);

    // damage per shot
    this.damage = 10;

    // counter to reset fire rate
    this.cycling = 0;

    // ticks/shot
    this.fireRate = f;

    // number of ticks before bullet is despawned
    this.range = r;

    // array to store bullets
    this.bullets = [];

    // shot per fire
    this.shotCount = 1;

    // trigger states
    this.firing = false;
    this.attemptFire = false;

  }

  getRicochetCount(){
    return this.ricochetCount;
  }

  getFireRate(){
    return this.fireRate;
  }

  getRange(){
    return this.range;
  }

  getDamage(){
    return this.damage;
  }

  getShotCount(){
    return this.shotCount;
  }

  setRicochetCount(rc){
    this.ricochetCount = rc;
  }

  setFireRate(firerate){
    this.fireRate = firerate;
  }

  setRange(range){
    this.range = range;
  }

  setShotCount(count){
    this.shotCount = count;
  }

  setDamage(damage){
    this.damage = damage;
  }

  setAttemptedFire(firing){
    this.attemptFire = firing;
  }

  updateCycle(){

    if(this.cycling >= 0){
      this.cycling--;
    }

  }

  setFiringState(){

    // firing is on and attempting to fire is also true
    if(this.firing && this.attemptFire){
      this.stillFiring();
    }

    // firing is on and attempting to fire is not (not clicking)
    if(this.firing && !this.attemptFire){
      this.firing = false;
      this.endedFiring();
    }

    // firing is off and attempting to fire is on
    if(!this.firing && this.attemptFire){
      this.firing = true;
      this.startedFiring();
    }

  }

  startedFiring(){}

  stillFiring(){}

  endedFiring(){}

  setWeaponOffset(){
    this.getPos().x = Math.cos(Utility.Radians(this.getDirection())+90) + this.getPos().x;
    this.getPos().y = Math.sin(Utility.Radians(this.getDirection())+90) + this.getPos().y;
  }

  update(deltaTime){

    super.update(deltaTime);

    this.setWeaponOffset();

    // this.getPos().add(
    //   new SAT.Vector(
    //     Math.cos(Utility.Radians(this.direction+90)),
    //     Math.sin(Utility.Radians(this.direction+90))
    //   ).scale(20));


    this.updateCycle();

    this.setFiringState();

    // iterating through bullets
    for(var bullet = this.bullets.length-1 ; bullet >= 0 ; bullet--) {
      // updating bullet
      this.bullets[bullet].update(deltaTime);
      // checking if bullet is dead
      if(!this.bullets[bullet].getAlive()){
        // splicing bullet object from bullet array
        this.bullets.splice(bullet,1);
      }
    }

  }

  draw(camera){

    super.draw(camera);

    Draw.fill(255);
    Draw.circle(this.getPos().x-camera.x,this.getPos().y-camera.y,10);

    // iterating through bullets
    for(var bullet = this.bullets.length-1 ; bullet > 0; bullet--) {
      this.bullets[bullet].draw(camera);
    }

  }

  fire(player){

    if(this.cycling <= 0) {
      for(var i = 0 ; i < this.getShotCount() ; i++){
        this.bullets.push(new Bullet(player.pos.x+player.vel.x,player.pos.y+player.vel.y,15,player.direction + i*(10),1000));
      }
      this.cycling = this.fireRate;
      return true;
    } else {
      return false;
    }

  }

}
