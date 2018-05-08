
// pseudo enum for tunnel type were the value is the print out text (messy but works)
let TunnelType = {
  ENTRANCE:"",
  EXIT:"NICE ONE"
}

class Tunnel extends Electron {

  constructor(level,type,properties = {}){

    super(0,0,null);

    // setting reference to level
    this.level = level;

    // storing properties of tunnel
    this.properties = properties;

    // setting tunnel type
    this.setType(type);

    // setting tunnel angle on core
    this.setDirection(this.properties.angle);

    // setting tunnel offset orbit
    this.setMargin(30);

    // setting size of tunnel
    this.setRadius(Sizes.TUNNEL.unit);

    // seting tunnel collider
    this.setCollider(new CircularCollider(this.getPos().x,this.getPos().y,this.getRadius()));


    // tunnel hint text and print delay
    this.tunnelText = new ElectronText(0,0,this.getType(),'futurist',25,'center',40,35,50,50,null)
    this.tunnelText.printDelay = 50;

    // set player collision state
    this.playerColliding = false;

    // set player collided trap state
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

    // performing player collisiion check
    let r = this.getCollider().test(this.level.player.getCollider());

    // response implies collision
    if(r){

      // if tunnel has entirely enveloped player and player has collected all items
      if((r.aInB || r.bInA) && this.level.items.getCollected()){

        // simple implementation of single fire trap
        if(!this.getPlayerColliding() && !this.getPlayerCollided()){
          this.setPlayerCollided(true);
          this.level.player.canExit = true;
        }
        // set player currently colliding to true
        this.setPlayerColliding(true);

        // checking if tunnel is an exit type
        if(this.type === TunnelType.EXIT){
          // setting colour to green
          this.getColour().setRGBA(100,255,100,1);
        } else {
          // setting colour to red warning player away
          this.getColour().setRGBA(255,100,100,1);
        }

      // if not enveloped (but colliding) and player has not collected all the items
      } else if(!this.level.items.getCollected()) {
        // highlight space red
        this.getColour().setRGBA(255,100,100,1);
      } else {
        // default is to colour the tunnel red
        this.getColour().setRGBA(255,200,100,1);
      }

      return true;

    } else {

      // reset player collision trap
      this.setPlayerColliding(false);

      // setting tunnel to white if no interaction
      this.getColour().setRGBA(255,255,255,1);

      return false;

    }

  }

  update(deltaTime){

    super.update(deltaTime);

    // updating player collider
    this.setCollider(new CircularCollider(this.getPos().x,this.getPos().y,this.getRadius()));

    // if the player has collided with the tunnel and type of tunnel is the exit type
    if(this.getPlayerCollided() && this.type === TunnelType.EXIT){

      // setting tunnel exit x and y position
      this.tunnelText.getPos().x = this.getPos().x;
      this.tunnelText.getPos().y = this.getPos().y + this.getRadius() + this.getMargin()*3;

      // updating exit text
      this.tunnelText.update(deltaTime);

      // setting the player direction to the tunnel direction to create locked effect
      this.level.player.setDirection(this.getDirection());

      // setting player invincible to stop post win damage
      this.level.player.setInvincibility(true);

      // disabling player left and right movement
      this.level.player.setCanMoveLeft(false);
      this.level.player.setCanMoveRight(false);
      this.level.player.setVel(new SAT.Vector(0,0));

    } else {
      // checking player collision if trap not set
      this.checkPlayerCollision();
    }

  }

  draw(camera){

    // drawing exit tunnel hint text if trap set and tunnel is exit type
    if(this.getPlayerCollided() && this.getType() === TunnelType.EXIT){
      this.tunnelText.draw(camera);
    }

    Draw.resetStroke();

    // drawing exit tunnel
    if(this.getType() === TunnelType.EXIT){

      // iterating over arbitrary number of circles
      for(let i = 11 ; i >= 0 ; i-=1){

        // relatively complex iterative scaling for circle thickness
        // Draw.strokeCol(i/2,new Colour(100,255,Utility.Map(i,0,10,0,255)));

        // default colour and iterative scaled thickness
        Draw.strokeCol(i/2,this.getColour());

        // drawing exit tunnel circles which scale with the iterations of the outer loop
        Draw.circleOutline(
          this.getPos().x - camera.x+Utility.Random(-(10-i),(10-i)),
          this.getPos().y - camera.y + Utility.Map(i,0,11,this.getRadius(),0),
          ((this.getRadius()+Utility.Random(-2,2))*0.1*i));

      }

    // drawing entrance tunnel
    } else if(this.getType() === TunnelType.ENTRANCE){

        // iterating over arbitrary number of circles
        for(let i = 1 ; i < 11 ; i+=2){

          // default colour and iterative scaled thickness
          Draw.strokeCol(i/2,this.getColour());

          // this will draw a series of concentric circles heading inwards which
          // are differenciated from the exit tunnels style
          Draw.circleOutline(
            this.getPos().x-camera.x,
            this.getPos().y-camera.y,
            ((this.getRadius()+Utility.Random(-2,2))*0.1*i));


        }

    }

    Draw.resetStroke();

  }

}
