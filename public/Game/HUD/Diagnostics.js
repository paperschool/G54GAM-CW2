class DiagnosticHUD extends Entity {

  constructor(x,y){
    super(x,y,0,0);

    this.lines = {};

    this.lineCount = 0;

  }

  updateLine(key,value){
    this.lines[key] = value;
  }

  draw(){

    Draw.fill(100,100,100);
    Draw.rect(CW-300,0,CW-50,this.lineCount*35);

    var row = 0;

    for(var key in this.lines){
      row++;
      Draw.fillCol(new Colour(51,51,51));
      Draw.text(20,"mono","right",new SAT.Vector(CW-50,row*30),this.lines[key] + " : " + key);
    }

    this.lineCount = row;

  }

}

class Chart {

  constructor(samples,sizex,sizey,min,max){

    this.size = new SAT.Vector(sizex,sizey);

    this.margin = 10;

    this.topLeft = new SAT.Vector(CW - this.size.x - this.margin,CH - this.size.y - this.margin);

    this.botRight = new SAT.Vector(this.topLeft.x + this.size.x,this.topLeft.y+this.size.y);

    this.samples     = [];

    this.sampleLimit = samples;

    this.minmax = new SAT.Vector(min,max);

    this.lowest = null;

    this.highest = null;

  }

  addSample(sample){

    if(this.samples.length > this.sampleLimit){

      if( sample > this.highest || this.highest == null ) this.highest = sample;

      if( sample < this.lowest  || this.lowest == null ) this.lowest = sample;

      this.samples.splice(0,1);

    }

    this.samples.push(sample);

  }

  draw(){

    for(var i = 1 ; i < this.samples.length ; i++){

      Draw.fill(255,255,255);

      let prevV = new SAT.Vector(
        this.topLeft.x + Utility.Map( i, 0, this.sampleLimit, 0, this.size.x ),
        this.botRight.y - Utility.Map( this.samples[i], this.lowest, this.highest, 0, this.size.y )
      );

      let nextV = new SAT.Vector(
        this.topLeft.x + Utility.Map( i-1, 0, this.sampleLimit, 0, this.size.x ),
        this.botRight.y - Utility.Map( this.samples[i-1], this.lowest, this.highest, 0, this.size.y )
      );

      let c = new Colour(255,Utility.Map(this.samples[i],0,this.minmax.y,0,255),0).getHex();

      Draw.line(prevV.x,prevV.y,nextV.x,nextV.y,2,c);

    }

    Draw.line( this.topLeft.x,this.topLeft.y, this.topLeft.x, this.botRight.y, 3, new Colour(255,255,255).getHex() );
    Draw.line( this.topLeft.x,this.botRight.y,this.botRight.x,this.botRight.y, 3, new Colour(255,255,255).getHex() );

  }

}
