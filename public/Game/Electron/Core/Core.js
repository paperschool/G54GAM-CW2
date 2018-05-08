
// name for circles that are orbited
class Core extends Actor {

  constructor(level,x,y,radius,properties = {}){

    super(x,y,)

    this.level = level;

    this.radius = radius;

    this.properties = properties;

    this.end = null;

    // parameters for jump

    this.children = [];

    this.canJump = false;

    this.jumpCore = null;

    this.jumpAccuracy = 10;

  }

  getJumpAccurracy(){
    return this.jumpAccuracy;
  }

  getCanJump(canJump){
    return this.canJump;
  }

  getJumpCore(){
    return this.jumpCore;
  }

  setJumpAccurracy(accuracy){
    this.jumpAccuracy = accuracy;
  }

  setCanJump(canJump){
    this.canJump = canJump;
  }

  setJumpCore(jumpCore){
    this.jumpCore = jumpCore;
  }

  // appending child to core
  addChild(other,angle){

    // adding child to local collection
    this.children.push(other);

    // setting childs parent to self
    other.setCore(this);

    // setting childs angle to specified angle
    other.setDirection(angle);

  }

  // removing child from core
  releaseChild(other){

    // iterating over cores children and removing associated child
    for(let c = this.children.length-1 ; c >= 0 ; c--){

      // storing child for easier comparison
      let child = this.children[c];

      // checking child matches desired migration candidate
      if(child === other){

        // releasing core
        child.releaseCore();

        // removing child from local collection and
        // return child being removed
        return this.children.splice(c,1)[0];

      }

    }

  }

  migrateCore(otherCore,otherChild,otherAngle){

    // removing child from core and storing released child locally
    let migrationCandidate = this.releaseChild(otherChild)

    // adding child to other core
    otherCore.addChild(migrationCandidate || null,otherAngle);

  }

  checkAdjacent(other){

    // distance from this core to adjacent core
    let d = Utility.dist(this.getPos(),other.getPos());

    // minimum distance to allow for exchange
    let md = this.getRadius() + other.getRadius() + Sizes.UNIT.unit;

    return md >= d;

  }

  // needs serious optimisation
  checkAngularAdjacent(player,other){

    // angle of current player
    // let playerAngle = Math.atan(Utility.slope(this.getPos(),player.getPos()));
    let playerAngle = Utility.Radians(player.getDirection());

    // angle joining the two cores
    let connectingAngle = Utility.angle(this.getPos(),other.getPos());

    let side = Utility.circularQuadrantDegree(this.getDirection());

    // // checking side of circle is correct
    // let sideCheck = (playerAngle > (Math.PI*3/2)) && playerAngle <= (Math.PI*2) ||
    //                 (playerAngle < (Math.PI/2  )) && playerAngle >= (0);

    // special case for when player sits on angle between 360 -> 0
    if(Math.abs(connectingAngle) === 0 && (side === 1 || side === 4) ){

      // normalising angle to bring into negative range again
      playerAngle = playerAngle > Math.PI ? playerAngle-2*Math.PI : playerAngle;

      // angle offsets for viable jump
      let connectNegativeAccuracy = connectingAngle + Utility.Radians(this.getJumpAccurracy())
      let connectPositiveAccuracy = connectingAngle - Utility.Radians(this.getJumpAccurracy())

      // running jump possibility check
      return playerAngle < connectNegativeAccuracy && playerAngle > connectPositiveAccuracy;

    } else {

      // angle offsets for viable jump
      let connectNegativeAccuracy = Utility.normaliseRadians(connectingAngle + Utility.Radians(this.getJumpAccurracy()))
      let connectPositiveAccuracy = Utility.normaliseRadians(connectingAngle - Utility.Radians(this.getJumpAccurracy()))

      // running jump possibility check
      return playerAngle < connectNegativeAccuracy && playerAngle > connectPositiveAccuracy;

    }

  }

  getOrbitPosition(other,d = null){

    // null value shortcut assignment
    let direction = d || other.getDirection();

    // defining dive behaviour, this is an unused mechanic whereby the player
    // can dive within a core ( Still under design )
    if(other.getDive()){

      // deriving orbit position for internal core position
      return this.getPolarVector(
        this.getPos(),
        direction,
        (this.getRadius() - (other.getRadius() + other.getMargin()))
      );

    } else {

      // deriving orbit position for external core position
      return this.getPolarVector(
        this.getPos(),
        direction,
        (this.getRadius() + other.getRadius() + other.getMargin())
      );

    }

  }

  // this method will facilicate the jump mechanic when its pressed
  jump(other,angle){
    // if jump core is available
    if(this.getJumpCore()){
      // attempting to migrate player core
      this.migrateCore(this.getJumpCore(),other,angle);
      // other.updateQuadrantDirection(true);
      // other.getVel().x *= -1;
    }
  }

  update(deltaTime){

    super.update(deltaTime);

    // if the core has a reference to an exit tunnel
    if(this.end){
      // setting the position
      this.end = this.getPolarVector(
        this.getPos(),
        this.properties.end.angle,
        this.getRadius()+Sizes.PLAYER.unit+Sizes.MARGIN.unit
      );
    }

  }

  draw(camera){

    super.draw(camera);

    // render behaviour for diving mechanic ( not used )
    if(this.level.getLevelInvert()){
      Draw.fillCol(this.level.colour.getColour().setA(1));
    } else {
      Draw.fill(255,255,255,0.5);
    }

    // drawing core space
    Draw.circle(this.getPos().x-camera.x,this.getPos().y-camera.y,this.getRadius());

    // drawing core outline
    Draw.stroke(3,new Colour(255,255,255).getRGBA());
    Draw.circleOutline(
      this.getPos().x-camera.x,
      this.getPos().y-camera.y,
      this.getRadius()
    )

    // player occupied core
    let pCore = this.level.player.getCore();

    // candidate jump core
    let cCore = pCore.getJumpCore();

    if(cCore && pCore.getCanJump()){

      // angle on adjacent core for visual feedback purposes
      let alternativeOffset = cCore.getOrbitPosition(this.level.player,this.level.player.getDirection()+180);

      let colour = new Colour(255,255,255,1);
      Draw.stroke(3,colour.getRGBA());
      Draw.circleOutline(
        alternativeOffset.x-camera.x,
        alternativeOffset.y-camera.y,
        Sizes.PLAYER.unit
      );

      // alternativeOffset = cCore.getPolarVector(
      //   cCore.getPos(),
      //   this.level.player.getDirection()+180,
      //   cCore.getRadius()+this.level.player.getRadius()+this.level.player.getMargin()+Utility.Random(0,20)
      // );
      //
      // Draw.stroke(3,colour.getRGBA());
      // Draw.circleOutline(
      //   alternativeOffset.x-camera.x,
      //   alternativeOffset.y-camera.y,
      //   Sizes.PLAYER.unit*0.8
      // );
      //
      // alternativeOffset = cCore.getPolarVector(
      //   cCore.getPos(),
      //   this.level.player.getDirection()+180,
      //   cCore.getRadius()+this.level.player.getRadius()+this.level.player.getMargin()+Utility.Random(10,30)
      // );
      //
      // Draw.stroke(3,colour.getRGBA());
      // Draw.circleOutline(
      //   alternativeOffset.x-camera.x,
      //   alternativeOffset.y-camera.y,
      //   Sizes.PLAYER.unit*0.4
      // );

    }
    Draw.resetStroke();

  }



}
