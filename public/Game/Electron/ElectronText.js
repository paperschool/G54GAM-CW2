class ElectronText extends Entity {

  constructor(x=0,y=0,text,font,fontsize,alignment,spacing,height,marginx,marginy,colour){

    super(x,y);

    this.text = text || 'null';

    this.alignment = alignment || 'left';

    this.font = font || 'futurist' ;

    this.fontsize = fontsize || 100;

    this.spacing = spacing || 0;

    this.height = height || 0;

    this.marginx = marginx || 20;

    this.marginy = marginy || 20;

    this.setColour(colour || new Colour(51,51,51));

    this.center = new SAT.Vector(0,0);

    this.centerOffset = new SAT.Vector(0,0);

    this.useCamera = true;

    this.printIndex = 0;
    this.printDelay = 100;
    this.printLastTime = Date.now();

  }

  reset(){
    this.printIndex = 0;
    this.printLastTime = Date.now();
  }

  update(deltaTime){

    this.center.x = this.getPos().x + ((this.text.length-1)*this.spacing)/2;
    this.center.y = this.getPos().y - (this.height)/2;

    this.centerOffset.x = ((this.text.length-1)*this.spacing)/2;
    this.centerOffset.y = (this.height)/2;

    if(Date.now() - this.printLastTime > this.printDelay){

      if(this.printIndex < this.text.length){

        this.printIndex++;
        this.printLastTime = Date.now();

      }

    }


  }

  draw(camera){

    // Draw.fill(150,150,255);
    // Draw.rect(
    //   this.getPos().x-this.centerOffset.x-camera.x-(this.marginx/2),
    //   this.getPos().y-this.centerOffset.y-camera.y-(this.marginy/2),
    //   ((this.text.length-1)*this.spacing)+this.marginx,
    //   this.height/2+this.marginy/2
    // );


    // Draw.line(
    //   this.center.x-camera.x,this.center.y-camera.y,
    //   this.center.x-camera.x,this.center.y-camera.y-this.height)
    //
    // Draw.line(
    //   this.center.x-camera.x,this.center.y-camera.y,
    //   this.center.x-camera.x+100,this.center.y-camera.y)
    //
    // ///////////
    //
    // Draw.fill(51,51,51);
    // Draw.circle(this.getPos().x-camera.x,this.getPos().y-camera.y,10);
    //
    // Draw.line(
    //   this.getPos().x-camera.x,this.getPos().y-camera.y,
    //   this.getPos().x-camera.x,this.getPos().y-camera.y-this.height)
    //
    // Draw.line(
    //   this.getPos().x-camera.x,this.getPos().y-camera.y,
    //   this.getPos().x-camera.x+100,this.getPos().y-camera.y)


    Draw.fillCol(this.getColour());
    for(let c = 0 ; c < this.printIndex ; c++){
      Draw.text(
        this.fontsize,
        this.font,
        this.alignment,
        new SAT.Vector(
          this.getPos().x-this.centerOffset.x+(c*this.spacing) - ( this.useCamera ? camera.x : 0 ),
          this.getPos().y-this.centerOffset.y                  - ( this.useCamera ? camera.y : 0 )
        ),
        this.text.charAt(c)
        );

    }

  }

}
