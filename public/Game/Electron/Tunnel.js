
let TunnelType = {
  ENTRANCE:"",
  EXIT:"NICE ONE"
}

class Tunnel extends Electron {

  constructor(level,type,properties = {}){

    super(0,0,null);

    this.level = level;

    this.properties = properties;

    this.setType(type);

    this.setDirection(this.properties.angle);

    this.setMargin(30);

    this.setRadius(Sizes.TUNNEL.unit);

    this.setCollider(new CircularCollider(this.getPos().x,this.getPos().y,this.getRadius()));


    // text level
    this.tunnelText = new ElectronText(0,0,this.getType(),'futurist',25,'center',40,35,50,50,null)

    this.tunnelText.printDelay = 50;

    this.playerColliding = false;

    this.playerCollided = false;

  }

  getType(){
    return this.type;
  }

  getPlayerCollided(){
    return this.playerCollided;
  }

  getPlayerColliding(){
    return this.playerColliding;
  }

  setType(type){
    this.type = type;
  }

  setPlayerCollided(state){
    this.playerCollided = state;
  }

  setPlayerColliding(state){
    this.playerColliding = state;
  }

  checkPlayerCollision(){

    // if(this.getType() === TunnelType.ENTRANCE) return;

    let r = this.getCollider().test(this.level.player.getCollider());

    if(r){

      if(r.aInB || r.bInA){

        // simple implementation of single fire trap
        if(!this.getPlayerColliding() && !this.getPlayerCollided()){
          this.setPlayerCollided(true);
          this.level.player.canExit = true;
        }
        this.setPlayerColliding(true);

        if(this.type === TunnelType.EXIT){
          this.getColour().setRGBA(100,255,100,1);
        } else {
          this.getColour().setRGBA(255,100,100,1);
        }


      } else {

        this.getColour().setRGBA(255,200,100,1);

      }

      return true;

    } else {

      // reset player collision trap
      this.setPlayerColliding(false);

      this.getColour().setRGBA(255,255,255,1);

      return false;

    }

  }

  update(deltaTime){

    super.update(deltaTime);

    this.setCollider(new CircularCollider(this.getPos().x,this.getPos().y,this.getRadius()));

    if(this.getPlayerCollided() && this.type === TunnelType.EXIT){
      this.tunnelText.getPos().x = this.getPos().x;
      this.tunnelText.getPos().y = this.getPos().y + this.getRadius() + this.getMargin()*3;
      this.tunnelText.update(deltaTime);
      this.level.player.setDirection(this.getDirection());
      this.level.player.setCanMoveLeft(false);
      this.level.player.setCanMoveRight(false);
    } else {
      this.checkPlayerCollision();
    }


  }

  draw(camera){

    if(this.getPlayerCollided() && this.getType() === TunnelType.EXIT){
      this.tunnelText.draw(camera);
    }

    Draw.resetStroke();

    if(this.getType() === TunnelType.EXIT){

      for(let i = 11 ; i >= 0 ; i-=1){

        Draw.strokeCol(i/2,new Colour(
          100,
          255,
          Utility.Map(i,0,10,0,255)
        ));

        Draw.circleOutline(
          this.getPos().x - camera.x+Utility.Random(-(10-i),(10-i)),
          this.getPos().y - camera.y + Utility.Map(i,0,11,this.getRadius(),0),
          ((this.getRadius()+Utility.Random(-2,2))*0.1*i));

      }

    } else if(this.getType() === TunnelType.ENTRANCE){

        for(let i = 1 ; i < 11 ; i+=2){

          Draw.strokeCol(i/2,this.getColour());
          Draw.circleOutline(
            this.getPos().x-camera.x,
            this.getPos().y-camera.y,
            ((this.getRadius()+Utility.Random(-2,2))*0.1*i));


        }

    }

    Draw.resetStroke();

  }

}
