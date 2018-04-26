class Agent_Patrol extends Agent {

  constructor(x,y,environment,patrol){
    super(x,y,environment)

    this.type = AgentType.PATROL;

    this.patrol = null;

    this.patrolSet = false;

    this.setPatrolPath(patrol);

    this.choosePatrolPoint();

    this.setAgentPathfindingFocus(AgentPathFindingFocus.PATROL);

    // behaviour tree for agent which sets slicing mode to this abstraction
    this.behaviour = new Patrol_Agent_Behaviour(this);

  }

  choosePatrolPoint(){
    this.setVel(new SAT.Vector(0,0))
    this.setFocusPosition(
      this.grid.centerCellMap(this.patrol.getNextPoint())
    );
    this.path = null;
    this.newPath();
  }

  setPatrolPath(patrol){
    this.patrol = patrol;
    this.patrolSet = true;
  }

  update(deltaTime){
    super.update(deltaTime,true)
    // this.behaviour.step();
  }

  draw(camera){

    this.setColour(new Colour().setHex(gameTheme['ENEMY-PATROL']));

    super.draw(camera);

    for(let point of this.patrol.points){
      Draw.fill(255,0,0);
      Draw.circle(point.x*20-camera.x,point.y*20-camera.y,50);
    }


  }

}

class Patrol {

  constructor(loop = false, direction = 1){

    this.points = []

    this.point = 0;

    this.loop = loop

    this.direction = direction;

  }

  getLength(){
    return this.points.length;
  }

  getLast(){
    return this.poinss[this.points.length -1];
  }

  getPoint(index){
    if(index < 0 || index > this.points.length-1) return null;
    return this.points[index];
  }

  addPoint(point){
    this.points.push(point);
  }

  peekNext(){

    let p = this.point;

    let d = this.direction;

    if(p === p.length-1 || (p === 0 && d === -1)){

      if(this.loop){
        p = -1;
      } else {
        d *= -1;
      }

    }

    p+=d;

    if(!(p < 0 || p > this.points.length-1)) {
      return this.points[p];
    } else {
      return -1;
    }

  }


  getNextPoint(){

    if(this.point === this.points.length-1 || (this.point === 0 && this.direction === -1)){

      if(this.loop){
        this.point = -1;
      } else {
        this.direction *= -1;
      }
    }

    this.point+=this.direction;

    return this.points[this.point];

  }

}
