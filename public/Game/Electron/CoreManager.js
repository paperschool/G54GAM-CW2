
class CoreManager {

  constructor(level){

    this.level = level;

    this.player = this.level.player;

    this.cores = [];

    this.start = null;

    this.end = null;

    this.highlightExit = false;

  }

  setHighlightExit(highlight){
    this.highlightExit = highlight;
  }

  addCore(x,y,r,properties){

    this.cores.push(new Core(this.level,x,y,r,properties));

    // sets player origin core;
    if(properties.start){
      this.level.player.setCore(this.cores[this.cores.length-1]);
      this.level.player.setDirection(properties.start.angle);

      this.start = new Tunnel(this.level,TunnelType.ENTRANCE,properties.start);
      this.start.setCore(this.cores[this.cores.length-1]);

    }

    if(properties.end){

      this.end = new Tunnel(this.level,TunnelType.EXIT,properties.end);
      this.end.setCore(this.cores[this.cores.length-1]);

    }

  }

  update(deltaTime){

    for(let core of this.cores){
      core.update(deltaTime);
    }

    // checking adjacent jumping

    let pcore = this.player.getCore();

    for(let core of this.cores){

      // checking core is not player core and core is adjacent to player core
      if(
        pcore != core &&
        pcore.checkAdjacent(core) &&
        pcore.checkAngularAdjacent(this.player,core)){

        console.log(" Can Jump ");

      }

    }


    this.start.update(deltaTime);

    this.end.update(deltaTime);


  }

  drawHighlight(camera){

    let player = this.level.player;

    let angle = Utility.signedPolarAngleDifference(this.end.getDirection(),player.getDirection());

    // let sign =  Utility.signPolarAngleDifference(this.end.properties.end.angle,player.getDirection());

    for(let dot = 0 ; dot < angle ; dot+=5 ){

      let pos = this.end.getPolarVector(
        this.end.getCore().getPos(),
        dot+player.getDirection(),
        this.end.getCore().getRadius()+Size.PLAYER.unit+Size.MARGIN.unit
      );

      Draw.fill(255,255,255);
      Draw.circle(
        pos.x-camera.x,
        pos.y-camera.y,
        5);

    }

  }

  draw(camera){

    for(let core of this.cores){

      core.draw(camera);

      // draw highlight for exit tunnel
      if(core.properties.end && core === this.level.player.getCore() && this.highlightExit){
        this.drawHighlight(camera);
      }

    }

    this.start.draw(camera);

    this.end.draw(camera);

  }

}
