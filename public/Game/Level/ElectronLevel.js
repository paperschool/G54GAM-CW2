class ElectronLevel {

  constructor(world,worldsize,levelsize,properties){

    this.levelProperties = properties;

    this.levelname = this.levelProperties.name;

    this.worldreference = world;

    // size of world in virtual pixels (offscreen and onscreen)
    this.worldSize = new SAT.Vector(worldsize.x,worldsize.y);

    // setting level state
    this.levelState = LevelState.RUNNING;

    // manager for enemies
    this.orbitals = new OrbitalManager(this);

    // manager for inventory items
    this.items = new ItemManager(this);

    // creating player and setting position to center of canvas
    this.player = new Player(0,0,null);
    this.player.setCanMoveLeft(true);
    this.player.setCanMoveRight(true);

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

    // level finished timeout
    this.outroTimer = null;

    // creating new camera objext
    this.camera = new CameraShudder(CW/2,CH/2,CW,CH,this.worldSize.x,this.worldSize.y);

    // setting initial camera focus to player object
    this.camera.setFocus(this.player,new SAT.Vector(CW/2,CH/2));

    // setting level inversion state to false ( unused mechanic )
    this.setLevelInvert(false);

    this.music = new LevelMusic();


    // setting background colour
    this.colour = new PulseColour(new Colour().random());
    this.colour.setR(0,0);
    this.colour.setG(100,200);
    this.colour.setB(100,200);

    // jump hint text
    this.hintText = null;

  }

  enableControls(){

    // input.setCallBack(InputKeys.SPACE,'tutorial-level-exit',(function(){
    //
    //   if(this.cores.end.getPlayerCollided() && this.levelState === LevelState.CAN_EXIT){
    //     this.levelState = LevelState.ATTEMPTED_EXITED;
    //     input.removeCallBack(InputKeys.SPACE,'tutorial-level-exit');
    //   }
    //
    // }).bind(this));

    // input.setCallBack(InputKeys.DOWN,'tutorial-level-core-drop',(function(){
    //   this.setLevelInvert(true);
    //   this.player.setDive(true);
    // }).bind(this));
    //
    // input.setCallBack(InputKeys.UP,'tutorial-level-core-rise',(function(){
    //   this.setLevelInvert(false);
    //   this.player.setDive(false);
    // }).bind(this));

  }

  // this method runs only once per level switch ( does not fire on restart )
  levelInit(){
    this.music.play();
  }

  // method to set up initial level settings
  levelStart(){
    this.enableControls();
  }

  levelEnd(){
    this.outroTimer = new LevelTimer(2000,-1,false,null,null);
    this.levelState = LevelState.EXITING;
    sound.play(SoundLabel.WIN_1);
  }

  getLevelInvert(){
    return this.levelInvert;
  }

  setLevelInvert(levelInvert){
    this.levelInvert = levelInvert;
  }

  update(deltaTime){

    this.colour.step();

    this.timer.update(deltaTime);

    this.particleSystem.update(deltaTime);

    this.cores.update(deltaTime);

    this.orbitals.update(deltaTime);

    this.items.update(deltaTime);

    // update player
    this.player.update(deltaTime);

    this.snow.update(deltaTime);

    if(this.levelProperties.storm)
      this.storm.update(deltaTime);

    // updating the outro timer
    if(this.levelState === LevelState.EXITING){
      this.outroTimer.update(deltaTime);
    }

    this.updateLevelState();

    this.camera.setCameraSize(new SAT.Vector(CW/2,CH/2))
    this.camera.setFocus(this.player,new SAT.Vector(CW/2,CH/2));

    this.camera.update(deltaTime);

  }

  updateLevelState(){

    if(this.levelState !== LevelState.EXITING && this.levelState !== LevelState.EXITED) {

      if(!this.player.getAlive()){
        this.levelState = LevelState.PLAYER_DEAD;
      }

      if(this.cores.end.getPlayerCollided()){
        this.particleSystem.addParticle(this.player.getPos().x,this.player.getPos().y,0,ParticleType.IONBURST)
        this.player.getPos().set(this.cores.end.getPos());
        this.player.setVel(new SAT.Vector(0,0));
        this.levelEnd();
      }

    } else if(this.levelState === LevelState.EXITING){
      this.particleSystem.addParticle(this.player.getPos().x,this.player.getPos().y,0,ParticleType.IONBURST)
      if(this.outroTimer.isEnded()){
        this.levelState = LevelState.EXITED;
      }
    }

  }

  renderHintText(){

    if(this.player.getCore().getCanJump()){
      if(!this.hintText){
        this.hintText = new ElectronText(CW/2,100,"PRESS SPACE TO JUMP",'futurist',40,'center',35,35,50,50,null);
        this.hintText.useCamera = false;
        this.hintText.printDelay = 10;
        this.hintText.setColour(new Colour(255,255,255));
        this.hintText.setSecondaryColour(new Colour(100,100,100));
        this.hintText.shadowPosition = new SAT.Vector(2,2);
      }
      this.hintText.update(1);
      this.hintText.draw();
    } else {
      this.hintText = null;
    }

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

    this.items.draw(camera);

    if(this.levelProperties.storm) this.storm.draw(camera);

    this.particleSystem.draw(camera);

    this.player.draw(camera);

    this.renderHintText()

    // updating the outro timer
    if(this.levelState === LevelState.EXITING){
      Draw.fillCol(new Colour(255,255,255).setA(this.outroTimer.getPercentageComplete()))
      Draw.rect(0,0,CW,CH);
    }

  }

  getLevelState(){
    return this.levelState;
  }

}
