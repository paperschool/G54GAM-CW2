
let TunnelType = {
  ENTRANCE:"",
  EXIT:"PRESS SPACE TO EXIT"
}

class Tunnel extends Electron {

  constructor(level,type,properties = {}){

    super(0,0,null);

    this.level = level;

    this.properties = properties;

    this.setType(type);

    this.setDirection(this.properties.angle);

    this.setMargin(30);

    this.setRadius(this.level.player.getRadius()+20);

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

    if(this.getType() === TunnelType.ENTRANCE) return;

    let r = this.getCollider().test(this.level.player.getCollider());

    if(r){

      if(r.aInB || r.bInA){

        // simple implementation of single fire trap
        if(!this.getPlayerColliding() && !this.getPlayerCollided()){
          this.setPlayerCollided(true);
          this.level.player.canExit = true;
        }
        this.setPlayerColliding(true);

        this.getColour().setRGBA(100,255,100,1);

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
      this.tunnelText.getPos().x = this.getCore().getPos().x;
      this.tunnelText.getPos().y = this.getCore().getPos().y+50;
      // this.tunnelText.getPos().y = this.getCore().getRadius() + (this.getRadius()+20)*2 + this.getMargin()*2;
      this.tunnelText.update(deltaTime);
      // this.setRadius(this.getRadius()-0.5);
      // this.getColour().setA(this.getColour().getA()*0.9);
    } else {
      this.checkPlayerCollision();
    }


  }

  draw(camera){

    Draw.circleOutline(
      this.getPos().x-camera.x,
      this.getPos().y-camera.y,
      this.getRadius());

    Draw.strokeCol(10,this.getColour());

    if(this.getPlayerCollided()){
      this.tunnelText.draw(camera);
    }

  }

}
