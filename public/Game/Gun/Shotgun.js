class Shotgun extends Gun {

  constructor(x,y){
    super(x,y,0,0,0);
    this.setFireRate(30);
    this.setRange(100);
    this.setRicochetCount(1)
    this.setSpeed(7);
    this.setShotCount(4);
    this.spread = 6;
    this.setDamage(10);
  }

  update(deltaTime){
    super.update(deltaTime);
  }

  draw(camera){
    super.draw(camera)

  }

  fire(player){
    if(this.cycling <= 0) {

      sound.play(SoundLabel.SHOTGUN);

      for(let b = 0 ; b < this.shotCount ; b++){

        this.bullets.push(
          new Shotgun_Bullet(
            this.pos.x,
            this.pos.y,
            this.getSpeed(), //+Utility.RandomInt(-5,5),
            this.getDirection()+Utility.RandomInt(-this.spread,this.spread),
            this.getRange(),
            this.getRicochetCount(),
            this.getDamage()
          )
        )
      }
      this.cycling = this.fireRate;
      return true;
    } else {
      return false;
    }
  }
}

class Shotgun_Bullet extends Bullet {

  constructor(x,y,s,d,l,rc,dmg){

    super(x,y,s,d,l,rc,dmg);

    this.setBulletAccuracy(4);

    this.setTrail(30);
    this.setTrailWidth(3);

    this.colour = new Colour(255,0,0,1);

  }

  update(deltaTime){

    super.update(deltaTime);

    this.colour.g += 10;

    this.direction+= Utility.Random(-2,2);

  }

  draw(camera){

    super.draw(camera);



  }

}
