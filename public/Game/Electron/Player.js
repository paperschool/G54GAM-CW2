class Player extends Electron {

  constructor(x,y){

    // calling super with position, friction, speed and top speed values
    super(x,y);

    // setting player speed
    this.setSpeed(2);

    // setting player top speed
    this.setTopSpeed(10.0);

    // setting player render radius
    this.setRadius(Sizes.PLAYER.unit);

    // setting friction of player movement
    this.setFriction(0.95);

    // setting invincibility state
    this.setInvincibility(false);

    // setting margin offset of player
    this.setMargin(Sizes.MARGIN.unit);

    // setting collider of player
    this.setCollider(new CircularCollider(this.getPos().x,this.getPos().y,this.getRadius()));

    // setting lives (not used mechanic in the end)
    this.setLife(3);

    // setting life spawn (intial life variable)
    this.setLifespan(3);

    // setting value for current quadrant direction`
    this.setQuadrantDirection(-1)

    // setting exit state
    this.canExit = false;

    // trap for damage application (never applied)
    this.beingDamaged = false;

    this.setCanMoveLeft(false);
    this.setCanMoveRight(false);

  }

  getInvincibility(){
    return this.invincible;
  }

  getQuadrantDirection(){
    return this.quadrantDirection;
  }

  setCanMoveLeft(canMoveLeft){
    this.canMoveLeft = canMoveLeft;
  }

  setQuadrantDirection(quadrantDirection){
    this.quadrantDirection = quadrantDirection;
  }

  // experimental feature to invert controls depending on which side of the core the
  // player is currently on. Mirroring a mario oddesy (circle platformer) style of movement
  updateQuadrantDirection(force){

    // this will basically mean the direction is not adjusted until the player releases a key
    if(!force && input.isDown(InputKeys.LEFT) || input.isDown(InputKeys.RIGHT)) return;

    // getting quadrant of circle
    let playerQuadrant = Utility.circularQuadrantDegree(this.getDirection());

    // if qudrant is 3 or 4 set direction to negative
    if( playerQuadrant === 3 || playerQuadrant === 4 ) {
        this.setQuadrantDirection(-1);
    }

    // if qudrant is 1 or 2 set direction to positive
    if( playerQuadrant === 1 || playerQuadrant === 2 ) {
          this.setQuadrantDirection(1);
    }

  }

  // method that applies damage to player assuming player is not invincible
  applyDamage(damage){
    if(!this.invincible){
      if(!this.beingDamaged){
        this.setLife(this.getLife()-damage);
      }
    }
  }


  // method given to player only for checking input states
  checkKeyboardInput(deltaTime){

    // if up is pressed apply a negative vertical acc
    if(input.isDown(InputKeys.UP)) this.applyImpulse(new SAT.Vector(0.0,this.jump));

    // if down is pressed apply a positive vertical acc
    if(input.isDown(InputKeys.DOWN)) this.applyImpulse(new SAT.Vector(0.0,this.speed));

    // if left is pressed apply a negative horizontal acc
    if(input.isDown(InputKeys.LEFT) && this.getCanMoveLeft()){
       this.applyImpulse(new SAT.Vector(this.getQuadrantDirection()*this.getSpeed(),0.0));
    }

    // if right is pressed apply a positive horizontal acc
    if(input.isDown(InputKeys.RIGHT) && this.getCanMoveRight()){
       this.applyImpulse(new SAT.Vector(this.getQuadrantDirection()*-this.getSpeed(),0.0));
    }
  }

  // TODO: Fix poor association to parent class
  update(deltaTime){

    // checking for user input
    this.checkKeyboardInput(deltaTime);

    super.update(deltaTime);

    // updating player collider
    this.setCollider(new CircularCollider(this.getPos().x,this.getPos().y,this.getRadius()));

    // checking life state of player
    if(this.getLife() <= 0) this.setAlive(false);

  }

  draw(camera){

    // setting circle outline
    Draw.strokeCol(4,new Colour(255,255,255));

    // iteraing over number of lives (not used for anythign but render flair at this point)
    for(let life = this.getLife() ; life >= 0 ; life--){
      let radius = this.getRadius()*Utility.Map(life,0,this.getLifespan(),1,0);
      let pos = this.getCore().getOrbitPosition(this,this.getDirection() + this.getVel().x*Utility.Map(life,0,this.getLifespan(),3,0));
      Draw.circleOutline(pos.x - camera.x,pos.y - camera.y,radius);
    }

    Draw.resetStroke();

    // DEBUG FOR JUMP MECHANIC
    // if(this.canExit){
    //
    //   // Draw.fill(100,255,100);
    //   // Draw.circle(this.getPos().x-camera.x,this.getPos().y-camera.y,this.getRadius());
    //
    // } else {
    //
    //   let split = this.canExit ? 0 : -this.vel.x;
    //
    //   let offsetPos = null;
    //
    //   offsetPos = this.getPolarVector(
    //     this.getCore().getPos(),
    //     this.getDirection()+split*1.5,
    //     this.getCore().getRadius() + this.getRadius() + this.getMargin()+Utility.Random(-5,5)
    //   )
    //
    //   Draw.fillCol(new Colour(255,0,0,0.5));
    //   Draw.circle(offsetPos.x-camera.x,offsetPos.y-camera.y,this.getRadius()*0.8);
    //
    //
    //   offsetPos = this.getPolarVector(
    //     this.getCore().getPos(),
    //     this.getDirection()+split,
    //     this.getCore().getRadius() + this.getRadius() + this.getMargin()+Utility.Random(-5,5)
    //   )
    //
    //   Draw.fillCol(new Colour(0,0,255,0.5));
    //   Draw.circle(offsetPos.x-camera.x,offsetPos.y-camera.y,this.getRadius()*0.9);
    //
    //   Draw.fillHex(gameTheme['PLAYER'])
    //   Draw.circle(this.getPos().x-camera.x,this.getPos().y-camera.y,this.getRadius());
    // }

  }

}
