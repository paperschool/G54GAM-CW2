
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

    let direction = d || other.getDirection();

    // defining dive behaviour
    if(other.getDive()){

      return this.getPolarVector(
        this.getPos(),
        direction,
        (this.getRadius() - (other.getRadius() + other.getMargin()))
      );

    } else {

      return this.getPolarVector(
        this.getPos(),
        direction,
        (this.getRadius() + other.getRadius() + other.getMargin())
      );

    }

  }

  // this method will facilicate the jump mechanic when its pressed
  jump(other,angle){
    if(this.getJumpCore()){
      this.migrateCore(this.getJumpCore(),other,angle);
      // other.updateQuadrantDirection(true);
      // other.getVel().x *= -1;
    }
  }

  update(deltaTime){

    super.update(deltaTime);

    if(this.end){
      this.end = this.getPolarVector(
        this.getPos(),
        this.properties.end.angle,
        this.getRadius()+Sizes.PLAYER.unit+Sizes.MARGIN.unit
      );
    }

  }

  draw(camera){

    super.draw(camera);


    Draw.resetStroke();


    if(this.level.getLevelInvert()){
      Draw.fillCol(this.level.colour.getColour().setA(1));
    } else {
      Draw.fill(255,255,255,0.5);
    }

    Draw.circle(this.getPos().x-camera.x,this.getPos().y-camera.y,this.getRadius());

    Draw.stroke(3,new Colour(255,255,255).getRGBA());
    Draw.circleOutline(
      this.getPos().x-camera.x,
      this.getPos().y-camera.y,
      this.getRadius()
    )

    // debug

    let pCore = this.level.player.getCore();

    let cCore = pCore.getJumpCore();

    let player = this.level.player;

    if(cCore && pCore.getCanJump()){

      let alternativeOffset = cCore.getOrbitPosition(this.level.player,this.level.player.getDirection()+180);

      let jumpAngle = Utility.angle(this.getPos(),pCore.getPos());

      let jumpAngleDistance = Math.abs(jumpAngle-Utility.Radians(this.level.player.getDirection()))

      let colour = new Colour(255,255,255,1);

      // colour.setA(
      //   Utility.Map(jumpAngleDistance,0,Utility.Radians(this.getJumpAccurracy()),1,0)
      // );

      Draw.stroke(3,colour.getRGBA());
      Draw.circleOutline(
        alternativeOffset.x-camera.x,
        alternativeOffset.y-camera.y,
        Sizes.PLAYER.unit
      );

      // Draw.fillCol(colour);
      // Draw.circle(
      //   alternativeOffset.x-camera.x,
      //   alternativeOffset.y-camera.y,
      //   Sizes.PLAYER.unit
      // )

    }



    // let pangle = this.level.player.getDirection();
    //
    // Draw.line(
    //   this.getPos().x-camera.x,this.getPos().y-camera.y,
    //   Math.cos(Utility.Radians(pangle)) * this.getRadius() + this.getPos().x-camera.x,
    //   Math.sin(Utility.Radians(pangle)) * this.getRadius() + this.getPos().y-camera.y,
    //   2, new Colour(51,51,51).getRGBA()
    // );
    //
    // Draw.line(
    //   this.getPos().x-camera.x,this.getPos().y-camera.y,
    //   Math.cos(Utility.Radians(pangle+this.jumpAccuracy)) * this.getRadius() + this.getPos().x-camera.x,
    //   Math.sin(Utility.Radians(pangle+this.jumpAccuracy)) * this.getRadius() + this.getPos().y-camera.y,
    //   2, new Colour(51,51,51).getRGBA()
    // );
    //
    // Draw.line(
    //   this.getPos().x-camera.x,this.getPos().y-camera.y,
    //   Math.cos(Utility.Radians(pangle-this.jumpAccuracy)) * this.getRadius() + this.getPos().x-camera.x,
    //   Math.sin(Utility.Radians(pangle-this.jumpAccuracy)) * this.getRadius() + this.getPos().y-camera.y,
    //   2, new Colour(51,51,51).getRGBA()
    // );
    //
    // Draw.fill(51,51,51);
    // Draw.text(100,'futurista','center',
    //   new SAT.Vector(
    //     this.getPos().x-camera.x,
    //     this.getPos().y-camera.y,
    //   ),
    //   this.getPos().x+':'+this.getPos().y
    // );

  }



}
