class Level {

  constructor(world,worldsize,levelsize,player,grid){

    this.worldreference = world;

    // size of world in virtual pixels (offscreen and onscreen)
    this.worldSize = new SAT.Vector(worldsize.x,worldsize.y);

    // setting level state
    this.levelState = LevelState.RUNNING;

    // creating player and setting position to center of canvas
    this.player = new Player(0,0,null);

    // manager or origin cores
    this.cores = new CoreManager(this);

    // level count down timer
    this.timer = new LevelTimer(30000,-1,false,this.levelSize,null);

    // creating new camera objext
    this.camera = new CameraShudder(0,0,CW,CH,this.worldSize.x,this.worldSize.y);

    this.colour = new PulseColour(new Colour().random());

    this.leveltext = new ElectronText(0,-400,'PRESS LEFT TO MOVE LEFT','futurist',20,'center',40,35,50,50,null)

    // size of level in terms of grid units
    // this.levelSize = new SAT.Vector(levelsize.x*grid,levelsize.y*grid);

    // background render stuff
    // this.background = new Level_Background(this.levelSize);

    // grid array for pathfinding
    // this.grid = new Grid(this.levelSize.x,this.levelSize.y,grid);

    // collision manager
    // this.CollisionManager = new CollisionManager(this);

    // particle system
    // this.ParticleSystem = new ParticleSystem();

    // creating player and setting position to center of canvas
    // this.player = new Player(player.x,player.y);

    // this.player.setLevel(this);

    // core manager object

    // manager
    // this.agents = new AgentManager(this);

    // manager for handling pickup related events
    // this.pickups = new PickupManager(this.player);

    // hud map
    // this.hudmap = new HUDMap(this.worldSize,this.levelSize);

    // this.hud = new HUD(this,this.timer);

    // array for storing walls
    // this.walls = [];



    // this.music = new LevelMusic();

    // astar search tick cooldown
    // this.pfCoolDown = 1;
    // this.pfCoolDownCounter = 0;

    // input.setCallBack(InputKeys.GODMODE,'levelgodmode',(function(){
    //
    //   console.log("Gode Mode Set To: " + !this.player.getInvincibility())
    //   this.player.setInvincibility(!this.player.getInvincibility());
    //
    // }).bind(this));
    //
    // input.setCallBack(InputKeys.TOGGLETHEME,'levelthemetoggle',(function(){
    //   gameTheme = gameTheme === LightTheme ? DarkTheme : LightTheme;
    //   this.floor.setHex(gameTheme['FLOOR']);
    //
    // }).bind(this));
    //
    // // pause incrmeneting time through the use of a trap
    // input.setCallBack(InputKeys.PAUSE,'timerpause',(function(){
    //   if(!this.timer.paused){
    //     this.timer.pauseTimer();
    //   } else if(this.timer.paused){
    //     this.timer.unpauseTimer();
    //   }
    // }).bind(this));

  }

  // method to set up initial level settings
  levelStart(){
    // this.pickups.setLevelReady(true);

    this.camera.setFocus(this.player,new SAT.Vector(CW/2,CH/2));

  }

  // this method runs only once per level switch ( does not fire on restart )
  levelInit(){
    // this.music.play();
    // this.camera.setFocus(this.cores.cores[0].getPos(),new SAT.Vector(CW/2,CH/2));

  }

  update(deltaTime){


    this.camera.update(deltaTime);

    this.colour.step();

    // this.background.update(deltaTime);

    this.timer.update(deltaTime);

    this.cores.update(deltaTime);

    // update player
    this.player.update(deltaTime);

    this.leveltext.update(deltaTime);


    // this.pickups.update(deltaTime,this.player);
    //
    // this.agents.update(deltaTime);
    //
    // this.ParticleSystem.update(deltaTime);
    //
    // this.CollisionManager.checkAll();
    //
    // this.grid.update();
    //
    // // rolling back positions of out of bound playerIsShooting
    // this.agents.checkOutOfBounds();
    //
    // // checking player movement exceeded level boundaries or entered obstacle
    // if(this.grid.isOutsideBounds(this.player.getPos()) || this.grid.isWall(this.grid.getGridVector(this.player.getPos()))) {
    //   this.player.rollBackPosition();
    // }

    // this.updateLevelState();

    // this.hud.update(deltaTime);

  }

  draw(){

    this.colour.getColour().a = 0.4

    Draw.fillCol(this.colour.getColour())

    Draw.rect(0,0,CW,CH);

    let camera = this.camera.getOffset();

    // this.background.draw(camera);

    this.cores.draw(camera);

    this.player.draw(camera);

    this.leveltext.draw(camera);


    // this.grid.draw(camera);
    //
    // this.ParticleSystem.draw(camera);
    //
    // this.pickups.draw(camera);
    //
    //
    // this.agents.draw(camera);
    //
    // this.timer.draw(camera);
    //
    // this.hud.draw(camera);


  }

  addAgent(x,y,type,weapon,patrol,team){
    this.agents.addAgent(x,y,type,weapon,patrol,team);
  }

  addPickup(x,y,type){
    this.pickups.newPickup(x,y,type);
  }

  updateLevelState(){

    if(!this.player.getAlive()){
      this.levelState = LevelState.PLAYER_DEAD;
    }

    if(this)

    if(this.agents.getLiveAgents() <= 0){
      this.levelState = LevelState.ENEMY_DEAD;
    }

    if(this.timer.isEnded()){
      this.levelState = LevelState.TIMEOUT;
    }

  }

  getLevelState(){
    return this.levelState;
  }

}
