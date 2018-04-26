class Flamethrower extends Gun {

  constructor(x,y){
    super(x,y,0,0);
    this.setFireRate(4);
    this.setRange(200);
    this.setRicochetCount(1)
    this.setShotCount(6)
    this.setSpeed(2.5);
    this.setDamage(5);
  }

  update(deltaTime){

    super.update(deltaTime);

  }

  fire(player){
    if(this.cycling <= 0) {


      for(let b = 0 ; b < this.getShotCount() ; b++){
        this.bullets.push(
          new Flamethrower_Bullet(
            this.pos.x,
            this.pos.y,
            this.getSpeed(),
            this.getDirection()+Utility.RandomInt(-8,8),
            this.getRange()+Utility.Random(-this.getShotCount()*2,this.getShotCount()*2),
            this.getRicochetCount(),
            this.getDamage()
          )
        );
      }
      this.cycling = this.fireRate;
      return true;
    } else {
      return false;
    }
  }

  // mainly for sound effects
  startedFiring(){
    sound.play(SoundLabel.FLAMETHROWER_S);
    sound.play(SoundLabel.FLAMETHROWER_M);
  }

  stillFiring(){

  }

  endedFiring(){
    sound.stop(SoundLabel.FLAMETHROWER_M);
    sound.play(SoundLabel.FLAMETHROWER_E);
  }

}

class Flamethrower_Bullet extends Bullet {

  constructor(x,y,s,d,l,rc,dmg){

    super(x,y,s,d,l,rc,dmg);

    this.setBulletAccuracy(4);

    this.colour.setColour(255,0,0,1);

    this.setSize(new SAT.Vector(Utility.Random(4,10),Utility.Random(4,10)));

    this.setFriction(0.95);

    this.applyImpulse(this.getAcc().scale(this.getSpeed()));

    this.setTrail(0);

    // console.log(this.getAcc());

    // this.getAcc().add(acc);

  }

  update(deltaTime){

    super.update(deltaTime);

  }

  draw(camera){

    super.draw(camera);

    let lowerBound = 20;

    if(this.alive){

      if(this.getLifespan() > lowerBound) {
        this.colour.setR(255);
        this.colour.setG(Utility.Map(this.getLifespan(),0,this.getInitialLifeSpan()*1.4,0,255));
        this.colour.setB(0);
        this.colour.setA(Utility.Map(this.getLifespan(),0,this.getInitialLifeSpan(),0,1.0));
      } else {
        this.colour.setR(1);
        this.colour.setG(1);
        this.colour.setB(1);
        this.colour.setA(Utility.Map(this.getLifespan(),0,lowerBound,0,1.0));
      }

      Draw.fillCol(this.colour);
      Draw.circle(this.pos.x-camera.x,this.pos.y-camera.y,this.size.x);
    }

  }

}
