
class CoreManager {

  constructor(level){

    this.level = level;

    this.player = this.level.player;

    this.cores = [];

    this.start = null;

    this.end = null;

    this.highlightExit = true;

    input.setCallBack(InputKeys.SPACE,'core-manager-jump-attempt',(function(){

      let currentCore = this.player.getCore();

      if(currentCore.getCanJump() && !this.player.getDive()){
        currentCore.jump(this.player,this.player.getDirection()+180);
        sound.play(SoundLabel.CLICK_5);
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

    this.setHighlightExit(this.level.items.getCollected());

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

    // storing reference to player
    let player = this.level.player;

    // calculating angle between both points
    let angle = Utility.signedPolarAngleDifference(this.end.getDirection(),player.getDirection());

    // figuring out direction of highlight
    let sign = Math.sign(angle)

    let highlightRadius = this.end.getCore().getRadius()+(Sizes.PLAYER.unit+Sizes.MARGIN.unit)*(player.getDive() ? -1 : 1)

    for(let dot = 0 ; dot < Math.abs(angle) ; dot+=3 ){

      let pos = this.end.getPolarVector(
        this.end.getCore().getPos(),
        (dot*sign)+player.getDirection(),
        highlightRadius
      );

      Draw.fillCol(new Colour(255,255,255,Utility.Map(dot,0,Math.abs(angle),0,1)));
      Draw.circle(
        pos.x-camera.x,
        pos.y-camera.y,
        Utility.Map(dot,0,Math.abs(angle),8,1)
      );

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
