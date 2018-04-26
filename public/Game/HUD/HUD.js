class HUD {

  constructor(level = null,timer = null){

    this.level = level;

    if(this.level != null){
      this.killcounter = new KillCounter(level);
    }

    this.timer = timer;

  }

  update(deltaTime){

    if(this.level) this.killcounter.update(deltaTime);

  }

  drawTimer(){

    let min = this.timer.isEnded() ? '--' : this.timer.getMinute();
    let sec = this.timer.isEnded() ? '--' : this.timer.getSecond();
    let mil = this.timer.isEnded() ? '----' : this.timer.getMillis();

    let margin = 50;
    let size = 100;
    let charSize = 80;
    let shadowOffset = 10;

    let shake = Utility.Map(this.timer.getPercentageComplete(),0,1,0,7);
    let topColour = new Colour(
      255,
      Utility.Map(this.timer.getPercentageComplete(),0,1,255,0),
      Utility.Map(this.timer.getPercentageComplete(),0,1,255,0),
      1);

    let pos = new SAT.Vector(margin+Utility.Random(-shake,shake),CH-margin+Utility.Random(-shake,shake));

    Draw.fill(51,51,51);
    Draw.text(size,"wdata","left",{x:pos.x+shadowOffset,y:pos.y+shadowOffset},min);
    Draw.fillCol(topColour);
    Draw.text(size,"wdata","left",pos,min);

    pos.set2(pos.x+(2*charSize),pos.y);
    Draw.fill(51,51,51);
    Draw.text(size,"wdata","left",{x:pos.x+shadowOffset,y:pos.y+shadowOffset},sec);
    Draw.fillCol(topColour);
    Draw.text(size,"wdata","left",pos,sec);

    pos.set2(pos.x+(2*charSize),pos.y);
    Draw.fill(51,51,51);
    Draw.text(size,"wdata","left",{x:pos.x+shadowOffset,y:pos.y+shadowOffset},mil);
    Draw.fillCol(topColour);
    Draw.text(size,"wdata","left",pos,mil);

  }

  draw(camera){

    if(this.level) this.killcounter.draw(camera);

    if(this.timer) this.drawTimer();

  }

}

class KillCounter {

  constructor(level){

    this.level = level;

    this.start = 0;

    this.current = 0;

    this.currentChanged = this.start - this.current

    this.changed = false;
    this.changeTimeout = 30;
    this.changeCounter = this.changeTimeout;

    this.glitter = null;

    this.oscilate = 0;
    this.increment = 0;

  }

  setStart(start){
    this.start = start
  }

  setCurrent(current){
    this.current = current;
  }

  update(deltaTime){

    this.setStart(this.level.agents.getStartCount());
    this.setCurrent(this.level.agents.count());

    this.increment = this.increment < 360 ? 0 : this.increment+1;

    this.oscilate = Math.sin(Utility.Radians(this.increment))*10;

    if(this.start - this.current !== this.currentChanged){

      this.level.ParticleSystem.addParticle(100,100,0,ParticleType.GLITTER);

      this.currentChanged = this.start - this.current;
      this.changeCounter = this.changeTimeout;
      this.changed = true;
    }

    this.changeCounter = this.changeCounter > 0 ? this.changeCounter-deltaTime : 0;

  }

  drawText(){

    let offset = (this.start - this.current).toString().length * 50;

    let shift = Utility.Map(this.changeCounter,0,this.changeTimeout,0,5);

    // shadow

    let shadowOffset = 10;

    Draw.fill(10,10,10);
    Draw.text(120,"wdata","left",
    new SAT.Vector(320 + offset+shadowOffset,150+this.oscilate+shadowOffset),
    this.start);

    Draw.text(200,"wdata","left",
      new SAT.Vector(250+offset+shadowOffset,180+this.oscilate+shadowOffset),
      '/');

    Draw.text(200+Utility.Map(this.changeCounter,0,this.changeTimeout,0,30),"wdata","right",
      new SAT.Vector(200+offset+Utility.Random(-shift,shift)+shadowOffset,200+ Utility.Random(-shift,shift)+this.oscilate+shadowOffset),
      this.start - this.current);


    // cover

    Draw.fill(255,255,255);
    Draw.text(120,"wdata","left",
    new SAT.Vector(320 + offset, 150+this.oscilate),
    this.start);

    Draw.fill(255,255,60);
    Draw.text(200,"wdata","left",
      new SAT.Vector(250+offset,180+this.oscilate),
      '/');

    Draw.fill(255,Utility.Map(this.changeCounter,0,this.changeTimeout,255,0),Utility.Map(this.changeCounter,0,this.changeTimeout,255,0));
    Draw.text(200+Utility.Map(this.changeCounter,0,this.changeTimeout,0,30),"wdata","right",
      new SAT.Vector(200+offset+ Utility.Random(-shift,shift),200+ Utility.Random(-shift,shift)+this.oscilate),
      this.start - this.current);



  }

  draw(camera){
    this.drawText();
  }

}
