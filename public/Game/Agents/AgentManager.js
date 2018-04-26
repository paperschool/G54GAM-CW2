class AgentManager {

  constructor(level){

    this.level = level;

    this.grid = level.grid

    this.gridSize = this.grid.gridSize;

    this.teams = {};

    this.agents = [];

    this.agentStartCount = 0;

    this.seperation = 100;

    this.agentsWeapons = [];

    this.drawDebugPath        = false;
    this.drawDebugVision      = false;
    this.drawDebugLineOfSight = false;
    this.drawDebugProximity   = false;

    input.setCallBack(InputKeys.DEBUG_AGENT_PATH,'agentmanagerdebug1',(function(){
      this.toggleDrawDebugPath();
    }).bind(this));

    input.setCallBack(InputKeys.DEBUG_AGENT_VISION,'agentmanagerdebug2',(function(){
      this.toggleDrawDebugVision();
    }).bind(this));

    input.setCallBack(InputKeys.DEBUG_AGENT_PROXIMITY,'agentmanagerdebug3',(function(){
      this.toggleDrawDebugProximity();
    }).bind(this));

  }

  count(){
    return this.agents.length;
  }

  getStartCount(){
    return this.agentStartCount;
  }

  toggleDrawDebugPath(){
    this.drawDebugPath ^= true;
  }

  toggleDrawDebugProximity(){
    this.drawDebugProximity ^= true;
  }

  toggleDrawDebugVision(){

    this.drawDebugLineOfSight ^= true;

    this.drawDebugVision ^= true;

    for(var agent = 0 ; agent < this.agents.length ; agent++) {
      this.agents[agent].setDebugOn(this.drawDebugVision);
    }

  }

  getAgents(){
    return this.agents;
  }

  getLiveAgents(){
    return this.agents.reduce( (t,c,i) => t + (c.getAlive()) , 0 );
  }

  addTeam(team){
    if(!this.teams.hasOwnProperty(team)){

      this.teams[team] = {};

      for(let message in AgentMessageType){
        this.teams[team][AgentMessageType[message]] = false;
      }
    }
  }

  addAgent(x,y,type,weapon,patrol,team){

    this.agentStartCount++;

    if(team)
      this.addTeam(team);

    switch (type) {
      case AgentType.GENERIC   :
        this.agents.push(new Agent(x,y,this.level)); break;
      case AgentType.FOLLOW    : break;
      case AgentType.WANDERING : break;
      case AgentType.PATROL    :
        this.agents.push(new Agent_Patrol(x,y,this.level,patrol)); break;
      case AgentType.MULTIAGENT:
        this.agents.push(new Agent_Communicative(x,y,this.level,team)); break;
      // case AgentType.MULTIAGENT_PATROL:
        // this.agents.push(new Agent_Communicative(x,y,this.level,patrol,team)); break;

      default: break;
    }

    let a = this.agents[this.agents.length-1];

    switch(weapon){
      case PickupType.PISTOL       : a.setWeapon(new Pistol(a.getPos().x,a.getPos().y)); break;
      case PickupType.MACHINEGUN   : a.setWeapon(new Machinegun(a.getPos().x,a.getPos().y)); break;
      case PickupType.SHOTGUN      : a.setWeapon(new Shotgun(a.getPos().x,a.getPos().y)); break;
      case PickupType.FLAMETHROWER : a.setWeapon(new Flamethrower(a.getPos().x,a.getPos().y)); break;
    }

    a.update(1);

  }

  seperateAgents(){
    for(let a = 0 ; a < this.agents.length ; a++){
      this.agents[a].applyImpluse(this.seperateAgent(a));
    }
  }

  seperateAgent(agent){

    let steer = new SAT.Vector();

    let c = 0;

    for(let a = 0 ; a < this.agents.length ; a++){

      let other = this.agents[a];

      let d = Utility.dist(agent.getPos(),other.getPos());

      if(d > 0 && d < this.seperation){
        // calculate opposing vector for other agent
        let opp = new SAT.Vector();

        opp.set(agent.getPos().clone().sub(other.getPos()));
        opp.normalize();
        opp.scale(1.0 / d);

        steer.add(opp);

        c++

      }

    }

    if(c > 0){
      steer.scale(1/c);
      steer.scale(10);
      steer.round(1000);
    } else {
      steer.scale(0);
    }


    return steer;

  }

  broadcast(message){
    // if the message type associated with agents team is not set to true, set it to true for the update loop
    if(!this.teams[message.team][message.type]) this.teams[message.team][message.type] = true;
  }

  checkOutOfBounds(){

    for(let agent of this.agents){
      // checking player movement exceeded level boundaries or entered obstacle
      if(this.grid.isOutsideBounds(agent.getPos()) || this.grid.isWall(this.grid.getGridVector(agent.getPos()))) {
        agent.rollBackPosition();
      }
    }

  }


  update(deltaTime){

    diagnostic.updateLine("---- Agents",this.agents.length);

    // let directiontable = {};
    // let printtable = false;

    for(var agent = this.agents.length - 1 ; agent >= 0 ; agent--) {

      let a = this.agents[agent];

      // directiontable[agent] = a.getDirection();
      // printtable = isNaN(a.getDirection()) || printtable

      if(!a.getAlive()){

        this.agents.splice(agent,1);
        continue;

      } else {

        // space for top level behaviour

        // seperating agent
        let sep = this.seperateAgent(a);
        // ensuring seperation is not null;
        if(sep.x !== 0 && sep.y !== 0){
          // applying seperation calculation
          a.applyImpulse(sep);
        }

        // update agent internals
        a.update(deltaTime,true);

      }
    }

    // if(printtable)
      // console.table(directiontable);

    for(let a of this.agents){
      // checking agent is a communicative one
      if(a.type === AgentType.MULTIAGENT)
        // iterating over message types
        for(let message in AgentMessageType)
          // passing in each message if true
          if(this.teams[a.team][AgentMessageType[message]])
            // sending agent the message
            a.receive(AgentMessageType[message]);

    }

    // resseting all messages
    for(let team in this.teams)
      for(let message in this.teams[team])
        this.teams[team][message] = false;



  }

  draw(camera){

    for(var agent = 0 ; agent < this.agents.length ; agent++){
      // actual agent draw call
      this.agents[agent].draw(camera);
    }

  }

}
