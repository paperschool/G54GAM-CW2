
class CoreManager {

  constructor(level){

    this.level = level;

    this.player = this.level.player;

    this.cores = [];

    this.start = null;

    this.end = null;

    this.highlightExit = false;

    input.setCallBack(InputKeys.SPACE,'core-manager-jump-attempt',(function(){

      let currentCore = this.player.getCore();

      if(currentCore.getCanJump()){
        currentCore.jump(this.player,this.player.getDirection()+180);
      }

    }).bind(this));

  }

  setHighlightExit(highlight){
    this.highlightExit = highlight;
  }

  addCore(x,y,r,properties){

    let nCore = new Core(this.level,x,y,r,properties)

    this.cores.push(nCore);

    // sets player origin core;
    if(properties.start){

      nCore.addChild(this.player,properties.start.angle);

      this.start = new Tunnel(this.level,TunnelType.ENTRANCE,properties.start);

      nCore.addChild(this.start,properties.start.angle);

    }

    if(properties.end){

      this.end = new Tunnel(this.level,TunnelType.EXIT,properties.end);
      this.end.setCore(this.cores[this.cores.length-1]);

    }

    // returning core for addition level creation steps
    return nCore;

  }

  update(deltaTime){

    for(let core of this.cores){
      core.update(deltaTime);
    }

    this.start.update(deltaTime);

    this.end.update(deltaTime);

    this.canJump();

  }

  canJump(){

    // storing players core
    let pcore = this.player.getCore();

    pcore.setCanJump(false);

    // iterating over all cores
    for(let core of this.cores){

      // checking core is not parent of player, core is adjacent to player core
      // and player is within jump sector for migration
      if(pcore != core){
        if(pcore.checkAdjacent(core) &&  pcore.checkAngularAdjacent(this.player,core)){
          // console.log("Can Jump!");
          pcore.setCanJump(true);
          pcore.setJumpCore(core);
        } else {
          core.setCanJump(false);
        }
      }

    }

  }

  drawHighlight(camera){

    let player = this.level.player;

    let angle = Utility.signedPolarAngleDifference(this.end.getDirection(),player.getDirection());

    // let sign =  Utility.signPolarAngleDifference(this.end.properties.end.angle,player.getDirection());

    for(let dot = 0 ; dot < angle ; dot+=5 ){

      let pos = this.end.getPolarVector(
        this.end.getCore().getPos(),
        dot+player.getDirection(),
        this.end.getCore().getRadius()+Sizes.PLAYER.unit+Sizes.MARGIN.unit
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
