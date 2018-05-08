
class CoreManager {

  constructor(level){

    // reference to level object
    this.level = level;

    // storing reference to player object
    this.player = this.level.player;

    // collection of core objects
    this.cores = [];

    // reference to entry tunnel`
    this.start = null;

    // reference to exit tunnel`
    this.end = null;

    // boolean to determine if the line to exit should be rendered
    this.highlightExit = true;

    // input callback for when player attempts to press space
    input.setCallBack(InputKeys.SPACE,'core-manager-jump-attempt',(function(){

      // getting core linked to current player position
      let currentCore = this.player.getCore();

      // checking if the player can jump and that the player hasnt dove into the Core
      if(currentCore.getCanJump() && !this.player.getDive()){

        // attempting jump method
        currentCore.jump(this.player,this.player.getDirection()+180);

        // sound to highlight successful jump
        sound.play(SoundLabel.CLICK_5);
      }

    }).bind(this));

  }

  setHighlightExit(highlight){
    this.highlightExit = highlight;
  }

  addCore(x,y,r,properties){

    // creating new core object
    let nCore = new Core(this.level,x,y,r,properties)

    // pushing new core object to core collection
    this.cores.push(nCore);

    // checking the properties contains a start tunnel paramter
    if(properties.start){

      // adding the player to the current core
      nCore.addChild(this.player,properties.start.angle);

      // creating start tunnel object
      this.start = new Tunnel(this.level,TunnelType.ENTRANCE,properties.start);

      // adding the tunnel object to the current core
      nCore.addChild(this.start,properties.start.angle);

    }

    // checking the properties contains a end tunnel paramter
    if(properties.end){

      // creating and adding an exit tunnel to the current core
      this.end = new Tunnel(this.level,TunnelType.EXIT,properties.end);
      this.end.setCore(this.cores[this.cores.length-1]);

    }

    // returning core for addition level creation steps
    return nCore;

  }

  update(deltaTime){

    // incrementing through the core collection updating each core`
    for(let core of this.cores){
      core.update(deltaTime);
    }

    // updating both the start and exit tunnels`
    this.start.update(deltaTime);
    this.end.update(deltaTime);

    // performing a core jump check
    this.canJump();

    // enabling / disabling the exit hint line if the player has finished the level
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

    // iterating over all cores
    for(let core of this.cores){

      // invoking the draw method of each core
      core.draw(camera);

      // draw highlight for exit tunnel if tunnel exists, if the current core is the exit core
      // and the highlight can be drawn
      if(core.properties.end && core === this.level.player.getCore() && this.highlightExit){
        this.drawHighlight(camera);
      }

    }

    // drawing the start and exit tunnel objects
    this.start.draw(camera);
    this.end.draw(camera);

  }

}
