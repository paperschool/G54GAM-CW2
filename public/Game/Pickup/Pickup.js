
class Pickup extends Actor {

  constructor(x,y,w,h,radius) {
    super(x,y,0,0,0,0);

    // if pickup has been picked up;
    this.setAlive(true);

    this.type = PickupType.GENERIC;

    // this.bounds = new Circle(x+w/2,y+h/2,radius);

    this.setCollider(new CircularCollider(this.pos.x,this.pos.y,radius));

    this.pickupRadius = radius;

    this.colour = new Colour().random();

    this.setSize(new SAT.Vector(w,h));

    this.setSprite(new Sprite("Game/Assets/Sprites/pistol.png",40,30,this.pos.x,this.pos.y,1));

  }

  // method to check if player position is overlaping pickup
  isNearPlayer(other){
    return this.getCollider().test(other.getCollider()) != null;
  }

  update(deltaTime){
    // super.update(deltaTime)
  }

  draw(camera){

    if(this.getAlive()){

      // super.draw(camera);

      Draw.fillCol(this.colour);

      Draw.circle(this.pos.x-camera.x,this.pos.y-camera.y,this.pickupRadius);

      Draw.fillCol(new Colour(255,255,255));
      Draw.circle(this.pos.x-camera.x,this.pos.y-camera.y,20);

      this.sprite.draw(camera);

    }

  }

}

class Pickup_Gun extends Pickup {

  constructor(x,y,w,h,radius){
    super(x,y,w,h,radius);

    this.type = PickupType.GUN;

    this.ricochetCount = 2;

    this.fireRate = 25;

    this.range = 100;

    // setting colour of actor
    this.colour = new Colour(51,51,51);

    this.setSprite(new Sprite("Game/Assets/Sprites/pistol.png",40,30,this.pos.x,this.pos.y,1));

  }

  update(deltaTime) {
    super.update(deltaTime);
  }

  draw(camera){

    super.draw(camera);

    // Draw.fillCol(this.colour);

    this.sprite.draw(camera);

  }

}

class Pickup_Pistol_Gun extends Pickup_Gun {

  constructor(x,y,w,h,radius){
    super(x,y,w,h,radius);

    this.type = PickupType.PISTOL;

    // setting colour of actor
    this.colour = new Colour(51,255,51);

    this.setSprite(new Sprite("Game/Assets/Sprites/pistol.png",40,30,this.pos.x,this.pos.y,1));

  }

}

class Pickup_Shot_Gun extends Pickup_Gun {

  constructor(x,y,w,h,radius){
    super(x,y,w,h,radius);

    this.type = PickupType.SHOTGUN;

    // setting colour of actor
    this.colour = new Colour(51,51,255);

    this.setSprite(new Sprite("Game/Assets/Sprites/shotgun.png",40,30,this.pos.x,this.pos.y,1));

  }

}

class Pickup_Machine_Gun extends Pickup_Gun {

  constructor(x,y,w,h,radius){
    super(x,y,w,h,radius);

    this.type = PickupType.MACHINEGUN;

    // setting colour of actor
    this.colour = new Colour(255,51,51);

    this.setSprite(new Sprite("Game/Assets/Sprites/m16.png",40,30,this.pos.x,this.pos.y,1));

  }

}


class Pickup_Flamethrower extends Pickup_Gun {

  constructor(x,y,w,h,radius){
    super(x,y,w,h,radius);

    this.type = PickupType.FLAMETHROWER;

    // setting colour of actor
    this.colour = new Colour(51,51,51);

    this.setSprite(new Sprite("Game/Assets/Sprites/flamethrower.png",40,30,this.pos.x,this.pos.y,1));

  }

}
