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
    this.setSecondaryColour(this.getColour());

    this.center = new SAT.Vector(0,0);

    this.centerOffset = new SAT.Vector(0,0);

    this.useCamera = true;

    this.shadowPosition = new SAT.Vector(0,0);

    this.printIndex = 0;
    this.printDelay = 100;
    this.printLastTime = Date.now();

  }

  getSecondaryColour(){
    return this.secondaryColour ;
  }

  setSecondaryColour(colour){
    this.secondaryColour = colour;
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

    for(let c = 0 ; c < this.printIndex ; c++){

      Draw.fillCol(this.getSecondaryColour());
      Draw.text(
        this.fontsize,
        this.font,
        this.alignment,
        new SAT.Vector(
          this.shadowPosition.x+this.getPos().x-this.centerOffset.x+(c*this.spacing) - ( this.useCamera ? camera.x : 0 ),
          this.shadowPosition.y+this.getPos().y-this.centerOffset.y                  - ( this.useCamera ? camera.y : 0 )
        ),
        this.text.charAt(c)
        );

      Draw.fillCol(this.getColour());
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
