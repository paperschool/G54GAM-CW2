
class Pickup_Health extends Pickup {

  constructor(x,y,w,h,radius){
    super(x,y,w,h,radius);

    // hard coded type (escaping javascripts poor typing)
    this.type = PickupType.HEALTH;

    this.setAlive(true);

    this.colour = new Colour(160,255,160);

    this.broken = [];

    for(var i = 0 ; i < 10 ; i++){
      this.broken.push(new Rectangle(this.pos.x + Utility.Random(-50,50),this.pos.y + Utility.Random(-50,50),Utility.Random(5,10),Utility.Random(5,10)));
      this.broken[this.broken.length-1].setColour(new Colour().random());
    }

  }


  draw(camera){

    if(this.getAlive()){

      super.draw(camera);

      Draw.fillCol(this.colour);
      // Draw.rect(this.pos.x-camera.x,this.pos.y-camera.y,this.size.x,this.size.y);


    } else {

      for(var i = 0 ; i < this.broken.length ; i++){
          this.broken[i].draw(camera);
      }

    }
  }
}
