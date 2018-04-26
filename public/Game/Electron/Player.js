class Player extends Electron {

  constructor(x,y){

    // calling super with position, friction, speed and top speed values
    super(x,y);

    this.setSpeed(0.1);

    this.setTopSpeed(10.0);

    this.setRadius(50);

    this.setFriction(0.95);

    this.setInvincibility(false);

    this.setMargin(50);

    this.setCollider(new CircularCollider(this.getPos().x,this.getPos().y,this.getRadius()));

    this.canExit = false;

  }

  getInvincibility(){
    return this.invincible;
  }

  setInvincibility(set){
    this.invincible = set;
  }

  applyDamage(damage){
    if(!this.invincible){
      this.getLife()-=damage;
    }
  }


  // method given to player only for checking input states
  checkKeyboardInput(deltaTime){

    // if up is pressed apply a negative vertical acc
    if(input.isDown(InputKeys.UP)) this.applyImpulse(new SAT.Vector(0.0,this.this.jump));

    // if down is pressed apply a positive vertical acc
    if(input.isDown(InputKeys.DOWN)) this.applyImpulse(new SAT.Vector(0.0,this.speed));

    // if left is pressed apply a negative horizontal acc
    if(input.isDown(InputKeys.LEFT)) this.applyImpulse(new SAT.Vector(-this.speed,0.0));

    // if right is pressed apply a positive horizontal acc
    if(input.isDown(InputKeys.RIGHT)) this.applyImpulse(new SAT.Vector(this.speed,0.0));

  }

  // method given to player only for checking input states
  checkMouseInput(){

    if(input.mouse.click && input.mouse.button === "LEFT"){
      if(this.weapon !== null){
        this.weapon.setAttemptedFire(true);
        if(this.weapon.fire(this)){
          this.setFiring(true);
          this.getLevel().ParticleSystem.addParticle(this.getPos().x,this.getPos().y,this.getDirection(),ParticleType.GUNSMOKE);
          this.getLevel().camera.resetShake(this.getWeapon().getDamage()*2);
        }
      }
    } else {
      if(this.weapon !== null){
        this.setFiring(false);
        this.weapon.setAttemptedFire(false);
      }
    }

  }

  // TODO: Fix poor association to parent class
  update(deltaTime){

    // calculating angle of player relative to mouse (Kinda hacky as i know player is centered)
    // this.calculateDirection({x:CW/2,y:CH/2},input.mouse);

    // checking for user input
    this.checkKeyboardInput(deltaTime);

    this.checkMouseInput();

    super.update(deltaTime);

    this.setCollider(new CircularCollider(this.getPos().x,this.getPos().y,this.getRadius()));

    if(this.getLife() <= 0) this.setAlive(false);

    // diagnostic.updateLine("Acc: ",Math.round(Utility.pyth(this.acc.x,this.acc.y) * 1000) / 1000);
    // diagnostic.updateLine("Vel: ",Math.round(Utility.pyth(this.vel.x,this.vel.y) * 1000) / 1000);

  }

  draw(camera){

    if(this.canExit){
      Draw.fill(100,255,100);
      Draw.circle(this.getPos().x-camera.x,this.getPos().y-camera.y,this.getRadius());
    } else {

      let split = this.canExit ? 0 : -this.vel.x;

      let offsetPos = null;

      offsetPos = this.getPolarVector(
        this.getCore().getPos(),
        this.getDirection()+split,
        this.getCore().getRadius() + this.getRadius() + this.getMargin()
      )

      Draw.fillCol(new Colour(0,0,255,0.5));
      Draw.circle(offsetPos.x-camera.x,offsetPos.y-camera.y,this.getRadius()*0.95);


      offsetPos = this.getPolarVector(
        this.getCore().getPos(),
        this.getDirection()+split*1.5,
        this.getCore().getRadius() + this.getRadius() + this.getMargin()
      )

      Draw.fillCol(new Colour(255,0,0,0.5));
      Draw.circle(offsetPos.x-camera.x,offsetPos.y-camera.y,this.getRadius()*0.9);


      Draw.fillHex(gameTheme['PLAYER'])
      Draw.circle(this.getPos().x-camera.x,this.getPos().y-camera.y,this.getRadius());
    }

  }

}
