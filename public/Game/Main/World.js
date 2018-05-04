class World {

  constructor(w,h){

    // variable to store
    this.CURRENT_STATE = GameState.START_STATE;

    // state object array
    this.states = [
      new StartState(null,this.setState.bind(this)),
      new PlayState(null,this.setState.bind(this),this.reloadLevel.bind(this),this.nextLevel.bind(this)),
      new GameOverState(null,this.setState.bind(this),this.reloadLevel.bind(this),this.nextLevel.bind(this)),
      new VictoryState(null,this.setState.bind(this)),
      new PauseState(null,this.setState.bind(this)),
      new LevelSwitchState(null,this.setState.bind(this))
    ];

    // performing set up on the current state
    this.states[this.CURRENT_STATE].setup();

    // size of the virtual world (that needs to be projected to the canvas)
    this.size = new SAT.Vector(w,h)

    // size of grid squares for calculating / etc
    this.gridSize = 20;

    // array of level seed data
    this.levelData = new Array(0);

    // current level object
    this.levels = null;

    // counter to track number of levels requested
    this.requestedLevelCount = 0;

    // setting up ajax level loader
    this.levelManager = new LevelManager();

    // Tutorial Levels
    this.levelManager.loadLevel("Game/Assets/Levels/Tutorial/1.json",0,this.addLevelData.bind(this));
    this.levelManager.loadLevel("Game/Assets/Levels/Tutorial/2.json",1,this.addLevelData.bind(this));
    this.levelManager.loadLevel("Game/Assets/Levels/Tutorial/3.json",2,this.addLevelData.bind(this));
    this.levelManager.loadLevel("Game/Assets/Levels/Tutorial/4.json",3,this.addLevelData.bind(this));
    this.levelManager.loadLevel("Game/Assets/Levels/Tutorial/5.json",4,this.addLevelData.bind(this));
    this.levelManager.loadLevel("Game/Assets/Levels/Tutorial/6.json",5,this.addLevelData.bind(this));
    this.levelManager.loadLevel("Game/Assets/Levels/Tutorial/7.json",6,this.addLevelData.bind(this));

    //
    // this.levelManager.loadLevel("Game/Assets/Levels/1.json",0,this.addLevelData.bind(this));
    // this.levelManager.loadLevel("Game/Assets/Levels/2.json",1,this.addLevelData.bind(this));
    // this.levelManager.loadLevel("Game/Assets/Levels/3.json",2,this.addLevelData.bind(this));
    // this.levelManager.loadLevel("Game/Assets/Levels/4.json",3,this.addLevelData.bind(this));
    // this.levelManager.loadLevel("Game/Assets/Levels/5.json",0,this.addLevelData.bind(this));

    this.currentLevel = -1;


    // registering input call backs for state switching purposes (pause -> play or play -> pause)
    input.setCallBack(InputKeys.PAUSE,'worldpause',(function(){
      if(this.CURRENT_STATE === GameState.PAUSE_STATE){
        this.CURRENT_STATE = GameState.PLAY_STATE;
        sound.play(SoundLabel.STATE_PLAY);
      } else if(this.CURRENT_STATE === GameState.PLAY_STATE){
        this.CURRENT_STATE = GameState.PAUSE_STATE;
        sound.play(SoundLabel.STATE_PAUSED);
      }
    }).bind(this));

    // registering input call backs for state switching purposes (gameover -> play)
    input.setCallBack(InputKeys.REPLAY,'worldrestart',(function(){
      if(this.CURRENT_STATE === GameState.GAMEOVER_STATE){
        this.setState(GameState.PLAY_STATE);
      }
    }).bind(this));

    // registering input call backs for state switching purposes (start -> play or victory -> start)
    input.setCallBack(InputKeys.SPACE,'worldstart',(function(){
      if(this.levelManager.levelsLoaded()) {
        if(this.CURRENT_STATE === GameState.START_STATE){
          sound.stopAll();
          this.setState(GameState.LEVEL_SWITCH_STATE);
        } else if (this.CURRENT_STATE === GameState.VICTORY_STATE){
          sound.stopAll();
          this.setState(GameState.START_STATE);
        }
      }
    }).bind(this));

  }

  addLevelData(data,index){
    this.levelData[index] = data;
    // just for debugging
    // this.setState(GameState.LEVEL_SWITCH_STATE);
  }


  addLevel(data){

    // level variable
    let newLevel = null;

    // building tutorial level
    if(data.level.properties.tutorial){

      newLevel = new LevelTutorial(this,this.size,data.level.size,data.level.properties);

    } else {

      newLevel = new Level(this,this.size,data.level.size);

    }

    // create all walls within level
    for(var core of data.level.cores){

      let r = 0;
      let x = r * core.x;
      let y = r * core.y;

      switch(core.type){
        case Sizes.CORE_SMALL.id :
          r = Sizes.CORE_SMALL.unit*Sizes.CORE_SMALL.scalar;
          x = core.x*Sizes.CORE_SMALL.unit;
          y = core.y*Sizes.CORE_SMALL.unit;
          break;
        case Sizes.CORE_MEDIUM.id :
          r = Sizes.CORE_MEDIUM.unit*Sizes.CORE_MEDIUM.scalar;
          x = core.x*Sizes.CORE_MEDIUM.unit;
          y = core.y*Sizes.CORE_MEDIUM.unit;
          break;
        case Sizes.CORE_LARGE.id :
          r = Sizes.CORE_LARGE.unit*Sizes.CORE_LARGE.scalar;
          x = core.x*Sizes.CORE_LARGE.unit;
          y = core.y*Sizes.CORE_LARGE.unit;
          break;
        default: break;
      }

      let nCore = newLevel.cores.addCore(
        x,y,r,core.properties
      )

      // performing orbital addition
      if(core.orbitals){

        for(let orbital of core.orbitals){
          newLevel.orbitals.addOrbital(nCore,orbital)
        }

      }

    }

    // do a final build of the graph object ready for astar searching
    // newLevel.agents.grid.rebuildMesh();


    // // add world pickups
    // for(var pickup = 0 ; pickup < data.level.pickups.length ; pickup++){
    //   newLevel.addPickup(
    //     data.level.pickups[pickup].x*this.gridSize,
    //     data.level.pickups[pickup].y*this.gridSize,
    //     data.level.pickups[pickup].type
    //   )
    // }

    return newLevel;

  }

  // method invoked when a level needs to be restarted
  reloadLevel(){

    // nulling level
    this.level = null;

    // re creating level from file
    this.level = this.addLevel(this.levelData[this.currentLevel])

    // setting current states level to the current level
    this.states[GameState.PLAY_STATE].setLevel(this.level);

    // resetting play state
    this.CURRENT_STATE = GameState.PLAY_STATE;

    // this.states[this.CURRENT_STATE].setup();

  }

  // method invoked when switching levels
  nextLevel(){

    // setting game victory state when level count exceeded
    if(this.currentLevel+1 === this.levelData.length){

      this.setState(GameState.VICTORY_STATE);

      this.currentLevel = -1;

    } else {

      // incrementing current level
      this.currentLevel++;

      // setting up new level
      this.level = this.addLevel(this.levelData[this.currentLevel])

      // setting level in state
      this.states[GameState.PLAY_STATE].setLevel(this.level);

      // setting state to switch state for count down
      this.CURRENT_STATE = GameState.LEVEL_SWITCH_STATE;


      // initialising level
      this.level.levelInit();

      // running intial update for safety
      this.level.update(1);

    }

  }


  update(deltaTime){

    // setting up level when start state is first loaded in
    if(this.levelManager.levelsLoaded() && this.CURRENT_STATE === GameState.START_STATE){
      this.states[this.CURRENT_STATE].setReady();
    }

    // updating current state of generator
    this.states[this.CURRENT_STATE].update(deltaTime);

  }

  draw() {

    // drawing to screen depending on state rendering specific layers  as required
    if(this.CURRENT_STATE === GameState.PAUSE_STATE){
      this.states[GameState.PLAY_STATE].draw();
      this.states[GameState.PAUSE_STATE].draw();
    } else if(this.CURRENT_STATE === GameState.LEVEL_SWITCH_STATE) {
      this.states[GameState.PLAY_STATE].draw();
      this.states[GameState.LEVEL_SWITCH_STATE].draw();
    } else if (this.CURRENT_STATE === GameState.GAMEOVER_STATE) {
      this.states[GameState.PLAY_STATE].draw();
      this.states[GameState.GAMEOVER_STATE].draw();
    } else {
      this.states[this.CURRENT_STATE].draw();
    }

  }

  setState(state){

    // switching to level switch state
    if(state === GameState.LEVEL_SWITCH_STATE){

      // setting up next level while count down operates
      this.nextLevel();

      this.states[this.CURRENT_STATE].setup(this.level.levelname);


    } else if (state === GameState.PLAY_STATE && this.CURRENT_STATE === GameState.GAMEOVER_STATE) {

      // reloading level due to gameover
      this.reloadLevel();
      this.states[this.CURRENT_STATE].setup();

    } else {

      // remaining default behavuour
      this.CURRENT_STATE = state;
      this.states[this.CURRENT_STATE].setup();

    }

  }

}
