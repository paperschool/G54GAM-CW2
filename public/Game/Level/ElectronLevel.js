class ElectronLevel {

  constructor(world,worldsize,levelsize,properties){

    // storing reference to level properties
    this.levelProperties = properties;

    // storing level name from properties
    this.levelname = this.levelProperties.name;

    // reference to parent object
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
    // if level end state has been triggered reset the outro timer
    this.outroTimer = new LevelTimer(2000,-1,false,null,null);
    // set the level state to exiting
    this.levelState = LevelState.EXITING;
    // play outro sound
    sound.play(SoundLabel.WIN_2);
  }

  getLevelInvert(){
    return this.levelInvert;
  }

  setLevelInvert(levelInvert){
    this.levelInvert = levelInvert;
  }

  update(deltaTime){

    // steping level colour background
    this.colour.step();

    // updating level timer (not used though)
    this.timer.update(deltaTime);

    // updating level particle system
    this.particleSystem.update(deltaTime);

    // updating the core manager
    this.cores.update(deltaTime);

    // updating the orbital manager
    this.orbitals.update(deltaTime);

    // updating the item manager
    this.items.update(deltaTime);

    // update player
    this.player.update(deltaTime);

    // upating the environmental particle system
    this.snow.update(deltaTime);

    // if the level includes a storm object update it too
    if(this.levelProperties.storm)
      this.storm.update(deltaTime);

    // updating the outro timer if level is in exit state
    if(this.levelState === LevelState.EXITING){
      this.outroTimer.update(deltaTime);
    }

    // updating level state
    this.updateLevelState();

    // updating camera offset and focus position (incase of screen resize)
    this.camera.setCameraSize(new SAT.Vector(CW/2,CH/2))
    this.camera.setFocus(this.player,new SAT.Vector(CW/2,CH/2));

    // updating camera object
    this.camera.update(deltaTime);

  }

  updateLevelState(){

    // if level is not either exiting or exited
    if(this.levelState !== LevelState.EXITING && this.levelState !== LevelState.EXITED) {

      // check player live state
      if(!this.player.getAlive()){
        // if dead set level state to player dead
        this.levelState = LevelState.PLAYER_DEAD;
      }

      // if exit tunnel has allowed player exit
      if(this.cores.end.getPlayerCollided()){
        // spwan ion burt particle to system
        this.particleSystem.addParticle(this.player.getPos().x,this.player.getPos().y,0,ParticleType.IONBURST)
        // start level end
        this.levelEnd();
      }

    // if level is in exiting state
    } else if(this.levelState === LevelState.EXITING){
      // spawn particle system at player position
      this.particleSystem.addParticle(this.player.getPos().x,this.player.getPos().y,0,ParticleType.IONBURST)
      // if timer has ended
      if(this.outroTimer.isEnded()){
        // set level state to exited
        this.levelState = LevelState.EXITED;
      }
    }

  }

  renderHintText(){

    // if the player is in at adjacency angle between two cores
    if(this.player.getCore().getCanJump()){
      // if the hint text has not been rendered
      if(!this.hintText){
        // set up hint text, camera trcking, print speed, colour, secondary colour and shadow offset
        this.hintText = new ElectronText(CW/2,100,"PRESS SPACE TO JUMP",'futurist',40,'center',35,35,50,50,null);
        this.hintText.useCamera = false;
        this.hintText.printDelay = 10;
        this.hintText.setColour(new Colour(255,255,255));
        this.hintText.setSecondaryColour(new Colour(100,100,100));
        this.hintText.shadowPosition = new SAT.Vector(2,2);
      }
      // update and draw hint text if already exiting
      this.hintText.update(1);
      this.hintText.draw();
    } else {

      // reset hint text for next jump situation
      this.hintText = null;
    }

  }

  draw(){

    // get camera offset
    let camera = this.camera.getOffset();

    // set background colour to 40% opacity
    this.colour.getColour().a = 0.4

    // set fill to background colour
    Draw.fillCol(this.colour.getColour())

    // draw screensized rectangle
    Draw.rect(0,0,CW,CH);

    // if level inverison state is true (unsed feature)
    if(this.levelInvert){
      // set fill of overlay background to 50% opcacity white
      Draw.fillCol(new Colour(255,255,255,0.5));
      // draw screensized overlay
      Draw.rect(0,0,CW,CH);
      // draw obritals
      this.orbitals.draw(camera);
      // draw cores
      this.cores.draw(camera);
      // render environmental partcles
      this.snow.draw(camera);

    // if not inverted
    } else {
      // render environmental partcles
      this.snow.draw(camera);
      // draw cores
      this.cores.draw(camera);
      // draw obritals
      this.orbitals.draw(camera);
    }

    // draw lal items
    this.items.draw(camera);

    // if level has storm object, draw storm manager
    if(this.levelProperties.storm) this.storm.draw(camera);

    // render all particles in system
    this.particleSystem.draw(camera);

    // render player
    this.player.draw(camera);

    // render hint text
    this.renderHintText()

    // updating the outro timer
    if(this.levelState === LevelState.EXITING){
      // if exiting draw increasingly opaque overlay for level timeout
      Draw.fillCol(new Colour(255,255,255).setA(this.outroTimer.getPercentageComplete()))
      Draw.rect(0,0,CW,CH);
    }

  }

  getLevelState(){
    return this.levelState;
  }

}
