class Pistol extends Gun {

  constructor(x,y){
    super(x,y,0,0,0);
    this.setFireRate(20);
    this.setRange(1000);
    this.setRicochetCount(1);
    this.setDamage(10);
    this.setSpeed(2)
  }

  fire(player){
    if(this.cycling <= 0) {
      this.bullets.push(
        new Bullet(
          this.pos.x,
          this.pos.y,
          this.getSpeed(),
          this.getDirection(),
          this.getRange(),
          this.getRicochetCount(),
          this.getDamage()
        )
      );

      this.cycling = this.fireRate;
      return true;
    } else {
      return false;
    }
  }
}
