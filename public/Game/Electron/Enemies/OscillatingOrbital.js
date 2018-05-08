class OscillatingOrbital extends Orbital {

  constructor(level,x,y,properties){

    super(level,x,y,properties);

    // setting actor colour
    this.setColour(new Colour(100,255,255));

    // setting inital angle for oscillation
    this.setStartAngle(properties.angle);

    // setting goal angle for oscillation rebound
    this.setGoalAngle(properties.goal);

    // setting actor speed
    this.setSpeed(1);

  }

  getStartAngle(){
    return this.startAngle;
  }

  getGoalAngle(){
    return this.goalAngle;
  }

  setStartAngle(startAngle){
    this.startAngle = startAngle;
  }

  setGoalAngle(goalAngle){
    this.goalAngle = goalAngle;
  }

  // method for swaping focus and direction of orbital to simulate
  // oscilating behaviour
  swapGoalAngle(){

    // naturally this will break when at edge of 0 -> 360
    if(this.getOrbitDirection() === -1 &&
       this.getDirection() < this.getGoalAngle()){

      // inverting orbital direction
      this.setOrbitDirection(this.getOrbitDirection()*-1);

      // swaping goal angle and source angle to invert direction
      let oldGoal = this.getGoalAngle();
      this.setGoalAngle(this.getStartAngle());
      this.setStartAngle(oldGoal);

    } else if(this.getOrbitDirection() === 1 &&
      this.getDirection() > this.getGoalAngle()){

      // inverting orbital direction
      this.setOrbitDirection(this.getOrbitDirection()*-1);

      // swaping goal angle and source angle to invert direction
      let oldGoal = this.getGoalAngle();
      this.setGoalAngle(this.getStartAngle());
      this.setStartAngle(oldGoal);

    }


  }

  update(deltaTime){

    super.update(deltaTime);

    // speculative checking of direction
    this.swapGoalAngle();

  }

  draw(camera){

    super.draw(camera);

    // drawing hint as to next position of oscillation
    Draw.fill(255);
    let pos = this.getCore().getOrbitPosition(this,this.getGoalAngle());
    Draw.circle(pos.x - camera.x,pos.y - camera.y,5);

  }


}
