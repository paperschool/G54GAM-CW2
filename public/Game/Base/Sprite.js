class Sprite {

  constructor(file,width,height,x,y,fps){

    this.src = file;
    this.img = null;

    this.pos = {x:x,y:y};

    // tick based fps
    this.fps = fps;
    this.fpsC = 0;

    this.loaded = false;

    this.multiLayered = false

    this.width = width;
    this.height = height;

    this.frameCX = 0;
    this.frameCY = 0;

    this.frame = 0;
    this.frames = 0;

    this.scale = 2.5;

    this.load();

  }

  setFps(fps){  this.fps = fps; }

  setPos(pos)
  {
    this.pos.x = pos.x;
    this.pos.y = pos.y;
  }

  setDirection(direction){
    this.direction = direction;
  }

  load(){

    this.img = new Image();

    this.img.src = this.src;

    this.img.onload = (function() {

      // informing state that image is ready for rendering
      this.loaded = true;

      // calculating number of horizontal and vertical frames
      this.frameCX = Math.floor(this.img.width / this.width);
      this.frameCY = Math.floor(this.img.height / this.height);

      // calculating total frame count of animation
      this.frames = this.frameCY*this.frameCX;

    }).bind(this);

  }

  draw(camera){

    var r,c;

    if(this.loaded){

      if(this.fpsC >= this.fps){
        this.frame = (this.frame >= this.frames-1 ? 0 : this.frame+=1);
        this.fpsC = 0;
      }

      this.fpsC++;

      r = Utility.linRowPosArr(this.frame,this.frameCX);
      c = Utility.linColPosArr(this.frame,this.frameCX);

      Draw.save();

      Draw.translate(
        (CW/2),
        (CH/2)
      );

      Draw.rotate(this.direction);

      // Draw.imageCrop(
      //   this.img,
      //   c*this.width,
      //   r*this.height,
      //   this.width,
      //   this.height,
      //   (-this.width*0.5/2),
      //   (-this.height*0.5/2),
      //   this.width*0.5,
      //   this.height*0.5
      // );

      Draw.imageCrop(
        this.img,
        c*this.width,
        r*this.height,
        this.width,
        this.height,
        this.pos.x-camera.x-CW/2-this.width*1.5,
        this.pos.y-camera.y-CH/2-this.height*1.5,
        this.width*this.scale,
        this.height*this.scale
      );

      Draw.restore();

     // since the context is rotated, the image will be rotated also
     // game.ctx.drawImage(this.i,-this.i.width/2,-this.i.height/2);


    }






  }

}
