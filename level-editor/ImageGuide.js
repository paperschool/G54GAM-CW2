class ImageGuide {

  constructor(x,y,img){

    this.img = img;

    this.hide = true;

    this.pos = createVector(x,y);

    this.scaleSize = createVector(this.img.width,this.img.height)

  }

  up(){
    this.pos.y -= gridSize;
  }

  down(){
    this.pos.y += gridSize;
  }

  left(){
    this.pos.x -= gridSize;
  }

  right(){
    this.pos.x += gridSize;
  }

  scale(direction){
    this.scaleSize.x *= 1 + (direction/10);
    this.scaleSize.y *= 1 + (direction/10);
    this.img.resize(this.scaleSize.x, this.scaleSize.y);

  }

  update(){

  }

  draw(){

    if(!this.hide)
      image(this.img, this.pos.x-camera.x, this.pos.y-camera.y);

  }

}
