class Machinegun extends Gun {

  constructor(x,y){
    super(x,y,0,0,0);
    this.setFireRate(5);
    this.setRange(300);
    this.setSpeed(5)
    this.setRicochetCount(1);
    this.setDamage(10);
    this.setShotCount(1);

  }

  fire(player){
    if(this.cycling <= 0) {

      sound.play(SoundLabel.MACHINEGUN);


      for(let b = 0 ; b < this.getShotCount() ; b++){

        this.bullets.push(
          new Machinegun_Bullet(
            this.pos.x,
            this.pos.y,
            this.getSpeed(),
            this.getDirection(),
            this.getRange(),
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

}

class Machinegun_Bullet extends Bullet {

  constructor(x,y,s,d,l,rc,dmg){
    super(x,y,s,d,l,rc,dmg);
    this.setBulletAccuracy(1);
    // this.setSpeed(100);

    this.setTrail(30);

    this.colour = new Colour(200,0,20);

    this.setSize(new SAT.Vector(10,10));

    this.collider = new CircularCollider(this.pos.x,this.pos.y,this.size.x);

  }


  update(deltaTime){

    super.update(deltaTime);

    this.colour.g += 10;

    this.direction+=Utility.Random(-0.5,0.5);

  }

  draw(camera){

    super.draw(camera);
    //
    // Draw.fill(51,51,51);

    Draw.fillCol(this.colour);

    Draw.circle(
      this.pos.x-camera.x+Math.cos(Utility.Radians(this.getDirection()+180))*this.size.x*5,
      this.pos.y-camera.y+Math.sin(Utility.Radians(this.getDirection()+180))*this.size.x*5,
      2
    );

    Draw.circle(
      this.pos.x-camera.x+Math.cos(Utility.Radians(this.getDirection()+180))*this.size.x*4,
      this.pos.y-camera.y+Math.sin(Utility.Radians(this.getDirection()+180))*this.size.x*4,
      3
    );


  }

}
