
// the state class is a generic state object that is subtyped for various states
// of the game state (play, pause etc)

class State {

  constructor(level,changeState){

    this.level = level;

    this.changeState = changeState;

  }

  setLevel(level){
    this.level = level;
  }

  setup(){}

  update(){}

  draw(){}


}

class StartState extends State {

  constructor(level,changeState){
    super(level,changeState);

    this.ready = false;

    this.colour = new PulseColour(new Colour().random());
    this.colour.setR(0,0);
    this.colour.setG(100,230);
    this.colour.setB(100,230);

    this.center = new Actor(CW/2,CH/2);

    this.snow = new EnvironmentalParticleSystem(this,this.center,new SAT.Vector(1,0.5),1000,new SAT.Vector(10000,10000));

    // text level
    this.title = new ElectronText(CW/2,CH/2,'ELECTRON','futurist',100,'center',90,55,50,50,null)
    this.title.useCamera = false;
    this.title.printDelay = 250;
    this.title.setColour(new Colour(255,255,255));
    this.title.shadowPosition = new SAT.Vector(5,5);

    this.subtitle = new ElectronText(CW/2,CH*2/3,'PRESS SPACE','futurist',50,'center',40,55,50,50,null)
    this.subtitle.useCamera = false;
    this.subtitle.printDelay = 200;
    this.subtitle.setColour(new Colour(255,255,255));
    this.subtitle.shadowPosition = new SAT.Vector(2,2);


  }

  setup(){
    sound.play(SoundLabel.START_STATE_MUSIC);
    this.title.reset();
    this.subtitle.reset();
  }

  setReady(){
    this.ready = true;
  }

  update(deltaTime){

    this.colour.step();
    this.colour.getColour().a = 0.4;

    this.title.update(deltaTime);
    this.subtitle.update(deltaTime);

    this.snow.update(deltaTime);

  }

  draw(){

    Draw.fillCol(this.colour.getColour());
    Draw.rect(0,0,CW,CH);

    this.snow.draw({x:CW/2,y:CH/2});

    this.title.draw({x:CW/2,y:CH/2});

    if(this.ready){
      this.subtitle.draw({x:CW/2,y:CH/2});
    }

  }

}

class PlayState         extends State {

  constructor(level,changeState,reloadLevel,nextLevel) {

    super(level,changeState);

    this.reloadLevel = reloadLevel;

    this.nextLevel = nextLevel;

    this.colour = new PulseColour(new Colour().random());

  }

  setup(){
    this.level.levelStart();
  }

  update(deltaTime){

    this.colour.step();

    this.level.update(deltaTime);

    if(this.level.getLevelState() === LevelState.PLAYER_DEAD ||
       this.level.getLevelState() === LevelState.TIMEOUT ){

       this.changeState(GameState.GAMEOVER_STATE);

       sound.play(SoundLabel.STATE_GAMEOVER_1);
       sound.play(SoundLabel.STATE_GAMEOVER_2);

      // this.reloadLevel();
    }

    if(this.level.getLevelState() === LevelState.EXITED){
      this.changeState(GameState.LEVEL_SWITCH_STATE);
      // this.nextLevel();
    }

  }

  draw(){

    this.level.draw();

  }

}

class GameOverState     extends State {

  constructor(level,changeState,reloadLevel,nextLevel){

    super(level,changeState);

    this.reloadLevel = reloadLevel;

    this.nextLevel = nextLevel;

    this.titleOffset = 0;

    // text level
    this.title = new ElectronText(CW/2,CH/2,'PHASED OUT','futurist',100,'center',90,55,50,50,null)
    this.title.useCamera = false;
    this.title.printDelay = 50;
    this.title.setColour(new Colour(255,100,100));
    this.title.shadowPosition = new SAT.Vector(5,5);

    this.subtitle = new ElectronText(CW/2,CH*2/3,'PRESS R TO TRY AGAIN','futurist',50,'center',40,55,50,50,null)
    this.subtitle.useCamera = false;
    this.subtitle.printDelay = 20;
    this.subtitle.setColour(new Colour(255,255,255));

  }

  setup(){
    this.title.reset();
    this.subtitle.reset();
  }

  update(deltaTime){

    this.title.update(deltaTime);
    this.subtitle.update(deltaTime);

  }

  draw(){

    Draw.fill(51,51,51,0.5);
    Draw.rect(0,0,CW,CH);

    this.title.draw()
    this.subtitle.draw()

  }

}

class VictoryState      extends State {

  constructor(level,changeState){
    super(level,changeState);

    this.ParticleSystem = new ParticleSystem();

    this.redirectAttempted = false;

    this.colour = new PulseColour(new Colour().random());
    this.colour.setR(100,255)
    this.colour.setG(100,255)
    this.colour.setB(100,255)

    //
    this.center = new Actor(CW/2,CH/2);
    this.snow = new EnvironmentalParticleSystem(this,this.center,new SAT.Vector(0.3,0.3),1000,new SAT.Vector(10000,10000));

    // text level
    this.title = new ElectronText(CW/2,CH/2,'VICTORY!','futurist',100,'center',90,55,50,50,null)
    this.title.useCamera = false;
    this.title.printDelay = 250;
    this.title.setColour(new Colour(255,255,255));
    this.title.shadowPosition = new SAT.Vector(5,5);

  }

  setup(){
    sound.stopAll();
    sound.play(SoundLabel.VICTORY_STATE_MUSIC);

    this.timer = new LevelTimer(2000,-1,false,new SAT.Vector(100,100));

  }

  update(deltaTime){

    this.timer.update(deltaTime);

    this.colour.step();
    this.title.update(deltaTime);
    this.snow.update(deltaTime);
  }

  draw(){

    Draw.fillCol(this.colour.getColour());
    Draw.rect(0,0,CW,CH);

    this.snow.draw({x:CW/2,y:CH/2});

    this.title.draw()

    Draw.fillCol(new Colour(255,255,255).setA(1-this.timer.getPercentageComplete()));
    Draw.rect(0,0,CW,CH);

  }

}

class PauseState        extends State {

  constructor(level,changeState){
    super(level,changeState);

    // text level
    this.title = new ElectronText(CW/2,CH/2,'FROZEN!','futurist',180,'center',200,55,50,50,null)
    this.title.useCamera = false;
    this.title.printDelay = 10;
    this.title.setColour(new Colour(255,100,100));
    this.title.shadowPosition = new SAT.Vector(10,10);

  }

  setup(){
    this.title.reset();
  }

  update(deltaTime){
    this.title.update(deltaTime);
  }

  draw(camera){

    Draw.fill(51,51,51,0.5);
    Draw.rect(0,0,CW,CH);

    this.title.draw(camera);


  }

}

class LevelSwitchState  extends State {

  constructor(level,changeState){

    super(level,changeState);

    this.levelName = "";

    // text level
    this.title = null;

  }

  setup(name = ""){

    this.timer = new LevelTimer(2000,-1,false,new SAT.Vector(100,100));

    this.hud = new HUD(null,this.timer);

    this.levelName = name;

    this.title = new ElectronText(CW/2,CH/2,this.levelName,'futurist',60,'center',50,55,50,50,null)
    this.title.useCamera = false;
    this.title.printDelay = 40;
    this.title.setColour(new Colour(200,200,200));
    this.title.shadowPosition = new SAT.Vector(3,3);
  }

  update(deltaTime){

    this.title.update(deltaTime);

    this.title.getColour().setA(Utility.Map(this.timer.getPercentageComplete(),0.8,1,1,0));

    this.timer.update(deltaTime);

    if(this.timer.isEnded()) this.changeState(GameState.PLAY_STATE);

  }

  draw(){

    Draw.fill(255,255,255,0.2*Math.log(1-this.timer.getPercentageComplete())+1);

    Draw.rect(0,0,CW,CH);

    this.title.draw({x:CW/2,y:CH/2});

  }

}
