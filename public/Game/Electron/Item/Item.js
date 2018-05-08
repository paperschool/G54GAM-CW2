class Item extends Electron {

  constructor(level,x,y,properties){
    super(x,y);

    // storing reference to level
    this.level = level;

    // setting actor colour
    this.setColour(new Colour(100,255,100,0.8));

    // setting actor speed
    this.setSpeed(0);

    // setting actor top speed
    this.setTopSpeed(0);

    // setting collected state to false
    this.setCollected(false);

    // setting item render radius
    this.setRadius(Sizes.ITEM.unit);

    // setting friction to 1
    this.setFriction(1);

    // setting item invincibility to true ( just incase )
    this.setInvincibility(true);

    // setting orbit offset margin
    this.setMargin(55);

    // setting angle of rotation
    this.setRotateAngle(0);

    // setting up collider as square collider to differenciate the item from other orbitals
    this.setCollider(new PolygonCollider(this.getPos().x,this.getPos().y,Draw.polygonQuadNorm(Sizes.ITEM.unit,Sizes.ITEM.unit,this.getRotateAngle())));

  }

  getRotateAngle(){
    return this.rotateAngle;
  }

  getCollected(){
    return this.collected;
  }

  setRotateAngle(angle){
    this.rotateAngle = angle;
  }

  setCollected(collected){
    this.collected = collected;
  }

  // TODO: Fix poor association to parent class
  update(deltaTime){

    super.update(deltaTime);

    // incrementing item rotation
    this.setRotateAngle(this.getRotateAngle()+4);

    // recreating polygonal item collider
    this.setCollider(new PolygonCollider(this.getPos().x,this.getPos().y,Draw.polygonQuadNorm(Sizes.ITEM.unit,Sizes.ITEM.unit,this.getRotateAngle())));

    // checking life state
    if(this.getLife() <= 0) this.setAlive(false);

  }

  draw(camera){

    // checking that the item has not been collected yet
    if(!this.getCollected()){
      // setting item colour and drawing the polygonal shape of the item at its current rotation
      Draw.fillCol(this.getColour());
      Draw.polygon(Draw.polygonQuad(this.getPos().x-camera.x,this.getPos().y-camera.y,Sizes.ITEM.unit,Sizes.ITEM.unit,this.getRotateAngle()));
      Draw.resetStroke();
    }

  }

}
