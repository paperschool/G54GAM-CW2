class LevelTutorial {

  constructor(world,worldsize,levelsize,player){

    this.worldreference = world;

    // size of world in virtual pixels (offscreen and onscreen)
    this.worldSize = new SAT.Vector(worldsize.x,worldsize.y);

    // setting level state
    this.levelState = LevelState.RUNNING;

    // manager for enemies
    this.orbitals = new OrbitalManager(this);

    // creating player and setting position to center of canvas
    this.player = new Player(0,0,null);

    this.player.setCanMoveLeft(true);
    this.player.setCanMoveRight(false);

    input.setCallBack(InputKeys.SPACE,'tutorial-level-exit',(function(){

      if(this.cores.end.getPlayerCollided() && this.levelState === LevelState.CAN_EXIT){
        this.levelState = LevelState.EXITED;
        input.removeCallBack(InputKeys.SPACE,'tutorial-level-exit');
      }

    }).bind(this));

    // environmental particle system
    this.snow = new EnvironmentalParticleSystem(this,this.player,new SAT.Vector(0.5,0.1),400,new SAT.Vector(10000,10000));

    // particle system
    this.particleSystem = new ParticleSystem();

    // storm class
    this.storm = new Storm(this,30000,10000);

    // manager or origin cores
    this.cores = new CoreManager(this);

    // level count down timer
    this.timer = new LevelTimer(30000,-1,false,this.levelSize,null);

    // creating new camera objext
    this.camera = new CameraShudder(0,0,CW,CH,this.worldSize.x,this.worldSize.y);

    // this.camera.setFocus(this.player,new SAT.Vector(CW/2,CH/2));

    this.colour = new PulseColour(new Colour().random());
    this.colour.setR(0,0);
    this.colour.setG(100,200);
    this.colour.setB(100,200);

    this.tutorialTextIndex = 0;
    this.tutorialtext = [
      'PRESS LEFT TO MOVE LEFT',
      'PRESS RIGHT TO MOVE RIGHT',
      'EXIT AT THE TUNNEL'
    ];

    // text level
    this.leveltext = new ElectronText(0,0,this.tutorialtext[this.tutorialTextIndex],'futurist',25,'center',40,35,50,50,null)

    this.leveltext.printDelay = 20;

    input.setCallBack(InputKeys.LEFT,'tutorial-level-left',(function(){

      this.tutorialTextIndex = 1;
      this.leveltext.text = this.tutorialtext[this.tutorialTextIndex];
      this.leveltext.reset();
      input.removeCallBack(InputKeys.LEFT,'tutorial-level-left');



    }).bind(this));

    input.setCallBack(InputKeys.RIGHT,'tutorial-level-right',(function(){

      if(this.tutorialTextIndex === 1){

        this.player.setCanMoveRight(true);

        this.tutorialTextIndex = 2;
        this.leveltext.text = this.tutorialtext[this.tutorialTextIndex];
        this.leveltext.reset();
        input.removeCallBack(InputKeys.RIGHT,'tutorial-level-right');

        this.cores.setHighlightExit(true);

      }

    }).bind(this));

    this.setLevelInvert(false);

    input.setCallBack(InputKeys.DOWN,'tutorial-level-core-drop',(function(){
      this.setLevelInvert(true);
      this.player.setDive(true);
    }).bind(this));

    input.setCallBack(InputKeys.UP,'tutorial-level-core-rise',(function(){
      this.setLevelInvert(false);
      this.player.setDive(false);
    }).bind(this));



  }

  // method to set up initial level settings
  levelStart(){

    let texty = this.cores.end.getCore().getRadius() + this.player.getRadius()*2 + this.player.getMargin()*2;

    this.leveltext.getPos().y = -texty;

    this.camera.setFocus(this.player,new SAT.Vector(CW/2,CH/2));

  }

  // this method runs only once per level switch ( does not fire on restart )
  levelInit(){

    // this.music.play();
    this.camera.setFocus(this.player,new SAT.Vector(CW/2,CH/2));

  }

  getLevelInvert(){
    return this.levelInvert;
  }

  setLevelInvert(levelInvert){
    this.levelInvert = levelInvert;
  }

  update(deltaTime){

    this.colour.step();

    // this.camera.resetShake(3);

    this.camera.update(deltaTime);

    this.timer.update(deltaTime);

    this.storm.update(deltaTime);

    this.particleSystem.update(deltaTime);

    this.cores.update(deltaTime);

    this.orbitals.update(deltaTime);

    // update player
    this.player.update(deltaTime);

    this.snow.update(deltaTime);

    //
    if(this.levelState === LevelState.CAN_EXIT){
      this.player.getPos().set(this.cores.end.getPos());
      this.player.setVel(new SAT.Vector(0,0));
    }

    this.leveltext.update(deltaTime);

    this.updateLevelState();

  }

  draw(){

    let camera = this.camera.getOffset();

    this.colour.getColour().a = 0.4

    Draw.fillCol(this.colour.getColour())

    Draw.rect(0,0,CW,CH);

    if(this.levelInvert){
      Draw.fillCol(new Colour(255,255,255,0.5));
      Draw.rect(0,0,CW,CH);
      this.orbitals.draw(camera);
      this.cores.draw(camera);
      this.snow.draw(camera);
    } else {

      this.snow.draw(camera);
      this.cores.draw(camera);
      this.orbitals.draw(camera);

    }

    this.storm.draw(camera);

    this.particleSystem.draw(camera);

    this.player.draw(camera);

    this.leveltext.draw(camera);


  }

  addPickup(x,y,type){
    this.pickups.newPickup(x,y,type);
  }

  updateLevelState(){

    if(this.levelState !== LevelState.EXITED) {

      if(!this.player.getAlive()){
        this.levelState = LevelState.PLAYER_DEAD;
      }

      if(this.cores.end.getPlayerCollided()){
        this.levelState = LevelState.CAN_EXIT;
      }

    }

  }

  getLevelState(){
    return this.levelState;
  }

}
