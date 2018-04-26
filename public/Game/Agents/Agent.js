
class Agent extends Actor {

  constructor(x,y,environment){

    super(x,y,0.9,0.9,3.0,6.0);

    this.setLife(10);

    this.setAlive(true);

    this.setSpeed(5);

    this.setTopSpeed(100.0);

    this.setSize(new SAT.Vector(50,50));

    // agent colour
    this.setColour(new Colour().setHex(gameTheme['ENEMY-GENERIC']));

    // agent collision body
    this.setCollider(new PolygonCollider(this.pos.x,this.pos.y,Draw.polygonQuadNorm(40.0,20.0,this.getDirection())));

    // agent position
    this.setDirection(90)

    // collision state
    this.setCollisionState(false);

    // turning speed of ai
    this.setTurnSpeed(10);

    // disable debuging
    this.setDebugOn(false);

    // array storing all path positions to reach player
    this.path = null;

    this.type = AgentType.GENERIC;

    // BEHAVIOUR VARIABLES / STATES //
    this.stepBehaviour = false;

    // reference to environment for full access when evaluating
    this.setLevel(environment);

    this.player = environment.player;

    // environment
    this.grid = environment.grid;

    // a vector representing the agents pathfinding focus
    this.focusPosition = this.chooseRandomFocusPosition();

    this.pathfindingFocus = AgentPathFindingFocus.WANDER;

    // non player focused position
    // this.nonPlayerFocusPosition = this.focusPosition;

    // player distance
    this.playerDistance = -1;

    // last position of player
    this.lastKnownPlayerPosition = new SAT.Vector(-1,-1);

    // behaviour tree for agent
    this.behaviour = new Agent_Behaviour(this);

    // distance representing agent sight distance
    this.sightDistance = 700;

    // angle representing range of agent sight (degrees)
    this.sightAngle = 80;

    // boolean representing if player is within angle of sight
    this.isWithinFieldOfView = false;

    // boolean representing if player is within line of sight
    this.isWithinLineOfSight = false;

    // minimum distance for firing
    this.firingDistance = 400;

    // boolean to determine if player within firing range
    this.isWithinFireRange = false;

    // player shooting boolean
    this.isShooting = false;

    // array of line of sight data
    this.lineOfSightData = [];

    // boolean to determine if player is within alert distance
    this.isAlerted = false;

    // min distance required to alert player
    this.alertDistance = 800;

    // integer representing alert cool down
    this.alertTimeout = 1000;

    // integer represending alert remaining time
    this.alertRemaining = 0;

    // alerted buffs
    this.alertedSpeed = 0.6;

    this.alertedSightAngle = 30;

    this.alertedSightDistance = 1000

    this.alertedFiringDistance = 600

    // look around behaviour variables

    this.directionChangeCounter = -1;

    this.directionChangeTimeout = 100;

    // relaxed buffs
    this.relaxedSpeed = 0.2;

    this.relaxedSightAngle = 80;

    this.relaxedSightDistance = 800;

    this.relaxedFiringDistance = 400;

  }

  // AGENT UTILITY FUNCTIONS

  // getters

  getPath(){
    return this.path;
  }

  getNext(){
    return (this.path[1] !== 'undefined' ? this.path[1] : this.getPos())
  }

  getDirectionChangeCounter(){
    return this.directionChangeCounter;
  }

  getDirectionChangeTimeout(){
    return this.directionChangeTimeout;
  }

  getPathFindingFocus(){
    return this.pathfindingFocus;
  }

  getFocusPosition(){
    return this.focusPosition;
  }

  getSightAngle(){
    return this.sightAngle;
  }

  getSightDistance(){
    return this.sightDistance;
  }

  getFiringDistance(){
    return this.firingDistance;
  }

  // recalculating and returning calculated player distance
  getPlayerDistance(){

    this.setPlayerDistance(Utility.dist(this.pos,this.getPlayerPosition()));

    return this.playerDistance;

  }

  /// bad encapsulation ///

  getPlayerPosition(){
    return this.player.getPos();
  }

  ////////////////////////////////

  getBehaviour(){
    return this.behaviour;
  }

  // getter for fetching last known player position
  getLastKnownPlayerPosition(){
    return this.lastKnownPlayerPosition;
  }

  getPathDirection(){
    if(this.getPath().getLength() > 1) {
      this.calculateDirection(this.getPos(),this.getPath().peekNext());
      return this.getDirection();
    } else {
      return this.getDirection();
    }
  }

  getWithinFieldOfView(){
    return this.isWithinFieldOfView;
  }

  getWithinLineOfSight(){
    return this.isWithinLineOfSight;
  }

  getLineofSightData(){
    return this.lineOfSightData;
  }

  getWithinFireRange(){
    return this.isWithinFireRange;
  }

  getAlerted(){
    return this.isAlerted;
  }

  getShooting(){
    return this.isShooting;
  }

  getAlertDistance(){
    return this.alertDistance;
  }

  getAlertTimeout(){
    return this.alertTimeout;
  }

  getAlertRemaining(){
    return this.alertRemaining;
  }

  // getters for alerted version of data

  getAlertedSpeed(){
    return this.alertedSpeed;
  }

  getAlertedSightAngle(){
    return this.alertedSightAngle;
  }

  getAlertedSightDistance(){
    return this.alertedSightDistance;
  }

  getAlertedFiringDistance(){
    return this.alertedFiringDistance;
  }

  // getters for relaxed version of data

  getRelaxedSpeed(){
    return this.relaxedSpeed;
  }

  getRelaxedSightAngle(){
    return this.relaxedSightAngle;
  }

  getRelaxedSightDistance(){
    return this.relaxedSightDistance;
  }

  getRelaxedFiringDistance(){
    return this.relaxedFiringDistance;
  }

  // setters

  setAlertRemaining(remaining){
    this.alertRemaining = remaining;
  }

  setPath(path){

    // if(path.length === 0) console.log("path Impossible")

    this.path = path;
  }

  setFocusPosition(position){
    this.focusPosition = position;
  }

  setDirectionChangeCounter(counter){
    this.directionChangeCounter = counter;
  }

  setDirectionChangeTimeout(timeout){
    this.directionChangeTimeout = timeout;
  }

  setBehaviour(behaviour){
    this.behaviour = behaviour;
  }

  setSightDistance(distance){
    this.sightDistance = distance;
  }

  setSightAngle(angle){
    this.sightAngle = angle;
  }

  setFiringDistance(distance){
    this.firingDistance = distance;
  }

  setPlayerDistance(distance){
    this.playerDistance = distance;
  }

  setTurnSpeed(turnspeed){
    this.turnSpeed = turnspeed
  }

  setWithinFieldOfView(state){
    this.isWithinFieldOfView = state;
  }

  setWithinLineOfSight(state){
    this.isWithinLineOfSight = state;
  }

  setWithinFireRange(state){
    this.isWithinFireRange = state;
  }

  setShooting(state){
    this.isShooting = state;
  }

  // setters for alerted version of data

  setAlerted(state){
    this.isAlerted = state;
  }

  setAlertedSpeed(speed){
    this.alertedSpeed = speed;
  }

  setAlertedSightAngle(angle){
    this.alertedSightAngle = angle;
  }

  setAlertedSightDistance(distance){
    this.alertedSightDistance = distance;
  }

  setAlertedFiringDistance(distance){
    this.alertedFiringDistance = distance;
  }

  // setters for relaxed version of data

  setRelaxedSpeed(speed){
    this.relaxedSpeed = speed;
  }

  setRelaxedSightAngle(angle){
    this.relaxedSightAngle = angle;
  }

  setRelaxedSightDistance(distance){
    this.relaxedSightDistance = distance;
  }

  setRelaxedFiringDistance(distance){
    this.relaxedFiringDistance = distance;
  }

  setLineOfSightData(data){
    this.lineOfSightData = data;
  }

  // this setter updates the agents last known position variable
  setLastKnownPlayerPosition(){
    this.lastKnownPlayerPosition.set(this.getPlayerPosition());

    // checking last known position is an obstacle or not, if so
    // updating to this position will damage the behaviour

    //this.setLastKnownPlayerPosition(this.getPlayerPosition())

    // let p = this.grid.getGridVector(this.getPlayerPosition());
    // if(!this.grid.isObstacle(p)){
    //   this.playerLastKnownLocation.set(this.getPlayerPosition());
    // }
  }

  // functional utility functions

  // this method will be used to set the alert state back to true;
  alertAgent(){
    this.setAlertRemaining(this.getAlertTimeout());
    this.setAlerted(true);
  }

  // this method will relax the agent
  relaxAgent(){
    this.setAlertRemaining(-1);
    this.setAlerted(false);
  }

  updateAlert(deltaTime){

    if(this.getAlerted() && this.getAlertRemaining() > 0){

      this.setAlertRemaining(this.getAlertRemaining() - deltaTime);
      this.colour.setRGBA(255,100,100);

      this.setSpeed(this.getAlertedSpeed());
      this.setSightDistance(this.getAlertedSightDistance());
      this.setFiringDistance(this.getAlertedFiringDistance());
      this.setSightAngle(this.getAlertedSightAngle());

    } else {

      this.setSpeed(this.getRelaxedSpeed());
      this.setSightDistance(this.getRelaxedSightDistance());
      this.setFiringDistance(this.getRelaxedFiringDistance());
      this.setSightAngle(this.getRelaxedSightAngle());

      this.colour.setRGBA(100,255,100);
      this.relaxAgent()
    }

  }

  // has last known player position
  canFocusPlayerPosition(){
    return this.lastKnownPlayerPosition.x !== -1 &&
           this.lastKnownPlayerPosition.y !== -1
  }


  // this method will update the internal focus position state
  setAgentPathfindingFocus(focus = AgentPathFindingFocus.WANDER){

    let changed = this.pathfindingFocus !== focus;

    this.pathfindingFocus = focus;

    switch(this.pathfindingFocus){
      case AgentPathFindingFocus.PLAYER:     this.setFocusPosition(this.getPlayerPosition());   break;
      case AgentPathFindingFocus.NEARPLAYER: this.setFocusPosition(this.getPlayerPosition());   break;
      case AgentPathFindingFocus.OLDPLAYER:  this.setFocusPosition(this.getLastKnownPlayerPosition()); break;
      case AgentPathFindingFocus.PATROL:     /* this.setFocusPosition(this.getPath().getNext()); */    break;
      case AgentPathFindingFocus.WANDER:     /* this.setFocusPosition(this.nonPlayerFocusPosition); */ break;
      default: break;
    }

    // checking if focus state has changed
    if(changed){
      this.path = null;
      this.newPath();
    }

  }

  // AGENT WANDER MECHANICS

  // this method will set the agents focus to a random position on the map
  chooseRandomFocusPosition(){

    this.setFocusPosition(this.grid.getRoutableRandomNonObstacleMapPosition(this.getPos()));

    this.path = null;

    this.newPath();

    return this.getFocusPosition();
  }

  // method will determine if agent has reached node in path (to move to next point)
  agentArrivedAtPathNode(){

    if(this.getPath().peekNext() === -1)
      return true;

    if(!this.checkNextPossible(this.getPath().peekNext())){
      this.setPath(null);
      this.newPath();
      // console.log("Path Obstructed - Building New Path")
    }

    if(this.grid.isAtMapPosition(this.getPos(),this.getPath().peekNext())){
      this.getPath().getNextPoint();
    } else {}
  }


  checkNextPossible(position){
    return this.grid.lineOfSight(
      this.grid.getGridVector(this.getPos()),
      this.grid.getGridVector(position),[])[0].success;
  }


  // method that will determine if agent has reached focus position
  agentArrivedFocusPosition(){

    if(this.grid.isAtMapPosition(this.getPos(),this.getFocusPosition())){
      return true;
    } else {
      this.agentArrivedAtPathNode()
      return false;
    }
  }

  // AGENT SENSING MECHANICS

  playerWithinNavRange(){
    return this.getPlayerDistance() <= this.getAlertDistance()
  }

  // method that checks if player is shooting
  playerIsShooting(){
    return this.player.getFiring();
  }

  // method checks that player is within agent field of view
  playerWithinFieldOfView(){
    if(Utility.isInsideSector(this.getDirection(),this.getPos(),this.getPlayerPosition(),this.getSightAngle(),this.getSightDistance())){
      this.setWithinFieldOfView(true);
      return true;
    } else {
      this.setWithinFieldOfView(false);
      return false;
    }
  }

  // checks line to player is unobstructed, by performing a three step check,
  // the first checks the players center mass against the line of sight calculation
  // if this passes the line of sight is set to true and the method ends
  // if this fails, it attempts the left shoulder then the right one, this
  // ensures that uncessary checks are avoided where possible
  playerWithinLineOfSight(){

    // returning array of paths
    this.grid.lineOfSight(this.grid.getGridVector(this.getPos()),this.grid.getGridVector(this.getPlayerPosition()),       this.lineOfSightData);

    if(this.lineOfSightData[0].success) {
      this.setWithinLineOfSight(true);
      return true;
    }

    this.grid.lineOfSight(this.grid.getGridVector(this.getPos()),this.grid.getGridVector(this.player.getLeftShoulder()),  this.lineOfSightData);

    if(this.lineOfSightData[0].success) {
      this.setWithinLineOfSight(true);
      return true;
    }

    this.grid.lineOfSight(this.grid.getGridVector(this.getPos()),this.grid.getGridVector(this.player.getRightShoulder()), this.lineOfSightData);

    if(this.lineOfSightData[0].success) {
      this.setWithinLineOfSight(true);
      return true;
    }

    this.setWithinLineOfSight(false);
    return false;

  }

  // AGENT DIRECTION AND MOVEMENT MECHANICS

  lookAround(){

    if(this.getDirectionChangeCounter() >= 0){

      // reset timer
      this.setDirectionChangeCounter(this.getDirectionChangeTimeout());

      // changing direction
      this.setDirection(Utility.RandomInt(0,360)+90);

    }

  }

  // this will turn the agent in the direction of the focus position
  lookAtFocus(){

    if(this.getPathFindingFocus() === AgentPathFindingFocus.PLAYER){

      // this.setDirection(Utility.Degrees(Utility.angle(this.getPos(),this.getFocusPosition())));

      this.turnTo(this.getPos(),this.getFocusPosition());

    } else {

      if(this.getPath() === null || !this.getPath().getLength()) return;

      // this method will return the new direction but also set the direction when its
      // calculated
      this.getPathDirection();
      // this.setDirection(this.getNext());

    }

    return true;
  }

  // this move the agent in the direction specified above
  moveToFocus(){

    if(!this.focusProximityLimitation()){
      // setting current acceleration to speed directed by agent direction
      this.applyImpulse(
          new SAT.Vector(
            (this.getSpeed()) * Math.cos(Utility.Radians(this.getDirection())),
            (this.getSpeed()) * Math.sin(Utility.Radians(this.getDirection()))
          )
      );
    }

    return true;
  }

  // this method will check the agents distance to the player, if too close the
  // method will not permit any more movement towards the player
  focusProximityLimitation(){
    if(this.pathfindingFocus === AgentPathFindingFocus.PLAYER && Utility.dist(this.getPos(),this.getPlayerPosition()) < 100){
      this.applyImpulse(
          new SAT.Vector(
            (this.getSpeed()*2) * Math.cos(Utility.Radians(this.getDirection()+180)),
            (this.getSpeed()*2) * Math.sin(Utility.Radians(this.getDirection()+180))
          )
      );
      return true;
    }
    return false;
  }

  // methods used when player is visible

  // this method will turn the player to look at player position
  lookAtPlayer(){
    this.turnTo(this.getPos(),this.getFocusPosition());
    // this.setDirection(Utility.Degrees(Utility.angle(this.getPos(),this.getPlayerPosition())));

    return true;
  }

  moveToPlayer(){

    if(this.pathfindingFocus === AgentPathFindingFocus.PLAYER && Utility.dist(this.pos.x,this.pos.y,this.getPlayerPosition().x,this.getPlayerPosition().y) > 100)
      return true;

    // setting current acceleration to speed directed by agent direction
    this.applyImpulse(
        new SAT.Vector(
          (this.speed) * Math.cos(Utility.Radians(this.getDirection())),
          (this.speed) * Math.sin(Utility.Radians(this.getDirection()))
        )
    );

    return true;
  }

  // AGENT COMBAT MECHANICS

  playerWithinFiringRange(){

    if(this.getPlayerDistance() <= this.getFiringDistance()){
      this.setWithinFireRange(true);
    } else {
      this.setWithinFireRange(true);
    }

    return this.getWithinFireRange();
  }

  shootPlayer(){

    this.setShooting(true);

    if(this.weapon !== null){
      this.setFiring(true);
      if(this.weapon.fire(this)){
        this.getLevel().ParticleSystem.addParticle(this.getPos().x,this.getPos().y,this.getDirection(),ParticleType.GUNSMOKE);
        // this.getLevel().camera.resetShake(2);
      }

    }

    return true;
  }

  newPath(){

    if(this.path === null || this.getAlerted()) {
      this.setPath(
        this.grid.requestSearchPath(
          this.getPos(),
          this.getFocusPosition()
        )
      )
    }
  }

  // AGENT UPDATE AND DRAW METHODS

  update(deltaTime,behaviour = true){

    // resetting values

    this.setFiring(false);

    this.setLineOfSightData([]);

    this.setShooting(false);
    // checking if agent is alive
    if(this.getLife() <= 0) {  this.setAlive(false); return; }

    super.update(deltaTime);

    // evaluate new velocity from current acceleration,direction,speed etc

    // console.log(Math.round(this.pos.x),Math.round(this.player.pos.x),Math.round(this.pos.y),Math.round(this.player.pos.y));

    // decrimenting alert value
    this.updateAlert(deltaTime);

    // updating player distance from agent for radius violation checks
    this.getPlayerDistance();

    // updating look around timer
    this.setDirectionChangeCounter(this.getDirectionChangeCounter() - deltaTime);


    // fetching new path
    // this.newPath();

    // this.agentArrivedAtPathNode();

    // redrawing collision polygon from a normalised position
    this.setCollider(new PolygonCollider(this.pos.x,this.pos.y,Draw.polygonQuadNorm(40.0,20.0,this.getDirection())))

    if(this.weapon) {
      this.weapon.setPos(this.getPos());
      this.weapon.setDirection(this.getDirection());
      this.weapon.update(deltaTime);

      for(var i = 0 ; i < this.weapon.bullets.length ; i++)
          this.weapon.bullets[i].update(deltaTime);
    }

    if(behaviour){
      // stepping through the behaviour tree
      this.behaviour.step();
    }


    // if(this.stepBehaviour){
    //   this.stepBehaviour = !this.stepBehaviour;
    // }



  }

  renderPuncuation(camera){

    switch(this.getPathFindingFocus()){
      case AgentPathFindingFocus.PLAYER:

        Draw.fillCol(new Colour(255,200,200,1));
        Draw.text(60,"cherry","center",new SAT.Vector(-camera.x+this.getPos().x+Utility.RandomInt(-5,5),-camera.y+this.getPos().y-50+Utility.RandomInt(-5,5)),"!");
        Draw.text(60,"cherry","center",new SAT.Vector(-camera.x+this.getPos().x+Utility.RandomInt(-5,5),-camera.y+this.getPos().y-50+Utility.RandomInt(-5,5)),"!");
        Draw.text(60,"cherry","center",new SAT.Vector(-camera.x+this.getPos().x+Utility.RandomInt(-5,5),-camera.y+this.getPos().y-50+Utility.RandomInt(-5,5)),"!");
        Draw.text(60,"cherry","center",new SAT.Vector(-camera.x+this.getPos().x+Utility.RandomInt(-5,5),-camera.y+this.getPos().y-50+Utility.RandomInt(-5,5)),"!");
        break;

      case AgentPathFindingFocus.NEARPLAYER:
      case AgentPathFindingFocus.OLDPLAYER:

        Draw.fillCol(new Colour(255,0,0,1));
        Draw.text(60,"cherry","center",new SAT.Vector(-camera.x+this.getPos().x+Utility.RandomInt(-5,5),-camera.y+this.getPos().y-50+Utility.RandomInt(-5,5)),"?",'bold');
        Draw.text(60,"cherry","center",new SAT.Vector(-camera.x+this.getPos().x+Utility.RandomInt(-5,5),-camera.y+this.getPos().y-50+Utility.RandomInt(-5,5)),"?",'bold');
        Draw.text(60,"cherry","center",new SAT.Vector(-camera.x+this.getPos().x+Utility.RandomInt(-5,5),-camera.y+this.getPos().y-50+Utility.RandomInt(-5,5)),"?",'bold');
        Draw.text(60,"cherry","center",new SAT.Vector(-camera.x+this.getPos().x+Utility.RandomInt(-5,5),-camera.y+this.getPos().y-50+Utility.RandomInt(-5,5)),"?",'bold');
        break;

      case AgentPathFindingFocus.PATROL:     break;
      case AgentPathFindingFocus.WANDER:     break;
      default: break;
    }


  }

  draw(camera){
    // super.draw(camera);

    // Draw.fill(255,255,255);
    // Draw.circle(this.collider.collider.pos.x-camera.x,this.collider.collider.pos.y-camera.y,50);

    if(this.getAlive()){

      Draw.fillHex(gameTheme['ENEMY-GENERIC'])
      Draw.polygon(Draw.polygonQuad(this.pos.x-camera.x,this.pos.y-camera.y,40.0,20.0,this.getDirection()));

      // if(this.getWithinFireRange() && this.getShooting()){
      //   Draw.line(this.pos.x-camera.x,this.pos.y-camera.y,this.getPlayerPosition().x-camera.x,this.getPlayerPosition().y-camera.y);
      // }

      // Draw.fill(100,100,255,1);
      // Draw.circle(this.leftShoulder.x-camera.x,this.leftShoulder.y-camera.y,5);
      // Draw.circle(this.rightShoulder.x-camera.x,this.rightShoulder.y-camera.y,5);

      if(this.weapon) this.weapon.draw(camera);

      //Draw.line(this.pos.x,this.pos.y,this.getPlayerPosition().x-camera.x,this.getPlayerPosition().y-camera.y);

      this.renderPuncuation(camera)

      if(this.getLevel().agents.drawDebugProximity){

        // BASIC RADIUS DEBUG`
        Draw.circleOutline(this.pos.x-camera.x,this.pos.y-camera.y,this.firingDistance);
        Draw.stroke(1,'#FFFF00');

        Draw.circleOutline(this.pos.x-camera.x,this.pos.y-camera.y,this.alertDistance);
        Draw.stroke(1,'#00FFFF');

        // VIEW CONE
        Draw.line(
          this.getPos().x - camera.x,
          this.getPos().y - camera.y,
          this.getSightDistance() * Math.cos(Utility.Radians(this.getDirection() - (this.getSightAngle()/2))) + this.getPos().x - camera.x,
          this.getSightDistance() * Math.sin(Utility.Radians(this.getDirection() - (this.getSightAngle()/2))) + this.getPos().y - camera.y,
          (this.isWithinFieldOfView ? 3 : 1),
          (this.isWithinFieldOfView ? '#00FF00' : '#FF0000')
        );


        Draw.line(
          this.getPos().x - camera.x,
          this.getPos().y - camera.y,
          this.getSightDistance() * Math.cos(Utility.Radians(this.getDirection() + (this.getSightAngle()/2))) + this.getPos().x - camera.x,
          this.getSightDistance() * Math.sin(Utility.Radians(this.getDirection() + (this.getSightAngle()/2))) + this.getPos().y - camera.y,
          (this.isWithinFieldOfView ? 3 : 1),
          (this.isWithinFieldOfView ? '#00FF00' : '#FF0000')
        );

      }

      if(this.getDebugOn()){


        Draw.line(
          this.getPos().x - camera.x,
          this.getPos().y - camera.y,
          this.getFocusPosition().x - camera.x,
          this.getFocusPosition().y - camera.y,
          3,'#FF00FF'
        );

        // Draw.fill('#FFFFFF');
        // Draw.circle(this.playerLastKnownLocation.x-camera.x,this.playerLastKnownLocation.y-camera.y,5);

        let path = this.getPath();

        if(path){
          for(var node = 0 ; node < this.getPath().getLength() ; node++){

            Draw.fill(
              100,
              Utility.Map(node,0,path.getLength(),255,0),
              Utility.Map(node,0,path.getLength(),0,255)
              ,
              0.5
            );

            Draw.circle(
              path.getPoint(node).x-camera.x,
              path.getPoint(node).y-camera.y,
              this.grid.gridSize/4
            )

            Draw.line(
              path.getPoint(node).x-camera.x,
              path.getPoint(node).y-camera.y,
              (path.getPoint(node+1) !== null ? path.getPoint(node+1).x : path.getPoint(node).x ) -camera.x,
              (path.getPoint(node+1) !== null ? path.getPoint(node+1).y : path.getPoint(node).y ) -camera.y
            );

          }
        }

        for(var cell = 0 ; cell < this.lineOfSightData.length ; cell++){

          (this.lineOfSightData[cell].ok ? Draw.fill(100,255,100) : Draw.fill(255,100,100) );

          Draw.circle(
            (this.lineOfSightData[cell].x*this.grid.gridSize + this.grid.gridSize/2)-camera.x,
            (this.lineOfSightData[cell].y*this.grid.gridSize + this.grid.gridSize/2)-camera.y,
            this.grid.gridSize/8
          )

        }

        if(this.getAlerted()){

          Draw.fill(255,0,0,0.9);

          Draw.sector(
            this.getPos().x-camera.x,
            this.getPos().y-camera.y,
            20,
            0,
            Utility.Map(this.getAlertRemaining(),0,this.getAlertTimeout(),0,360)
          )

          // Draw.line(
          //   this.getPos().x - camera.x,
          //   this.getPos().y - camera.y,
          //   this.getSightDistance() * Math.cos(Utility.Radians(Utility.VectorAngle(this.getPos(),this.getPlayerPosition()))) + this.getPos().x - camera.x,
          //   this.getSightDistance() * Math.sin(Utility.Radians(Utility.VectorAngle(this.getPos(),this.getPlayerPosition()))) + this.getPos().y - camera.y,
          //   (this.getWithinFieldOfView() ? 3 : 1),
          //   (this.getWithinFieldOfView() ? '#00FF00' : '#FF0000')
          // );

        }

      }

    }
  }

}
