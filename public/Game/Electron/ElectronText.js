class ElectronText extends Entity {

  constructor(x=0,y=0,text,font,fontsize,alignment,spacing,height,marginx,marginy,colour){

    super(x,y);

    // setting renderable text
    this.text = text || 'null';

    // setting text alignment
    this.alignment = alignment || 'left';

    // setting desired font
    this.font = font || 'futurist' ;

    // setting font size
    this.fontsize = fontsize || 100;

    // setting font spacing
    this.spacing = spacing || 0;

    // setting height of outline shape
    this.height = height || 0;

    // setting margin between lettering and outline
    this.marginx = marginx || 20;
    this.marginy = marginy || 20;

    // setting primary colour of text
    this.setColour(colour || new Colour(51,51,51));

    // setting secondary colour text
    this.setSecondaryColour(this.getColour());

    // setting center of text
    this.center = new SAT.Vector(0,0);

    // setting center offset
    this.centerOffset = new SAT.Vector(0,0);

    // boolean that determines if the text object should use the camera offset or not
    this.useCamera = true;

    // vector that offsets secondary text layer
    this.shadowPosition = new SAT.Vector(0,0);

    // variables that enable the print delay effect
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

    // updating center of the text position
    this.center.x = this.getPos().x + ((this.text.length-1)*this.spacing)/2;
    this.center.y = this.getPos().y - (this.height)/2;

    // resetting the center offset of the text
    this.centerOffset.x = ((this.text.length-1)*this.spacing)/2;
    this.centerOffset.y = (this.height)/2;

    // incrementing the print out character index when timedout
    if(Date.now() - this.printLastTime > this.printDelay){
      if(this.printIndex < this.text.length){
        this.printIndex++;
        this.printLastTime = Date.now();
      }
    }


  }

  draw(camera){

    // looping to the current max character index
    for(let c = 0 ; c < this.printIndex ; c++){

      // drawing the secondary layer first (so it sits underneath the primary layer)
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

      // drawing the primary character layer
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
