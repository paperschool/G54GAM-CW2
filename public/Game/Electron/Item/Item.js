class Item extends Electron {

  constructor(level,x,y,properties){
    super(x,y);

    this.level = level;

    this.setColour(new Colour(100,255,100,0.8));

    this.setSpeed(0);
    this.setTopSpeed(0);

    this.setCollected(false);

    this.setRadius(Sizes.ITEM.unit);

    this.setFriction(1);

    this.setInvincibility(true);

    this.setMargin(55);

    this.setRotateAngle(0);

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

    this.setRotateAngle(this.getRotateAngle()+4);

    this.setCollider(new PolygonCollider(this.getPos().x,this.getPos().y,Draw.polygonQuadNorm(Sizes.ITEM.unit,Sizes.ITEM.unit,this.getRotateAngle())));

    if(this.getLife() <= 0) this.setAlive(false);

  }

  draw(camera){

    if(!this.getCollected()){
      Draw.fillCol(this.getColour());
      Draw.polygon(Draw.polygonQuad(this.getPos().x-camera.x,this.getPos().y-camera.y,Sizes.ITEM.unit,Sizes.ITEM.unit,this.getRotateAngle()));
      Draw.resetStroke();
    }

  }

}
