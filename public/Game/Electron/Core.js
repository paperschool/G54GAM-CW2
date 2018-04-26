
// name for circles that are orbited
class Core extends Actor {

  constructor(level,x,y,radius,properties = {}){

    super(x,y,)

    this.level = level;

    this.radius = radius;

    this.properties = properties;

    this.end = null;

    this.jumpAccuracy = 2;

  }

  checkAdjacent(other){

    // distance from this core to adjacent core
    let d = Utility.dist(this.getPos(),other.getPos());

    // minimum distance to allow for exchange
    let md = this.getRadius() + other.getRadius() + Sizes.UNIT.unit;

    return md <= d;

  }

  checkAngularAdjacent(player,other){

    let m = (player.getPos().y - other.getPos().y)/(player.getPos().x - other.getPos().x);

    let angle = Utility.Degrees(Math.atan(m));

    return Math.abs(angle) <= this.jumpAccuracy;

  }

  getOrbitPosition(other,d = null){

    let direction = d || other.getDirection();

    return this.getPolarVector(
      this.getPos(),
      direction,
      (this.getRadius() + other.getRadius() + other.getMargin())
    );

  }

  update(deltaTime){

    super.update(deltaTime);

    let player = this.level.player;

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

    Draw.fill(255,255,255);
    Draw.circle(this.getPos().x-camera.x,this.getPos().y-camera.y,this.getRadius());
    Draw.resetStroke();

  }



}
