
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


class StartState extends State{

  constructor(level,changeState){
    super(level,changeState);

    this.ready = false;

    this.colour = new PulseColour(new Colour().random());
    this.colour.setR(100,255);
    this.colour.setG(100,255);
    this.colour.setB(100,255);

    // text level
    this.title = new ElectronText(CW/2,CH/2,'ELECTRON','futurist',230,'center',200,55,50,50,null)
    this.title.useCamera = false;
    this.title.printDelay = 250;
    this.title.setColour(new Colour(255,255,255));

    this.title2 = new ElectronText((CW/2)+5,(CH/2)+5,'ELECTRON','futurist',230,'center',200,55,50,50,null)
    this.title2.useCamera = false;
    this.title2.printDelay = 200;

    this.ParticleSystem = new ParticleSystem();
    this.titleOffset = 0;
    this.secondaryOffset = 0;

  }

  setup(){
    sound.play(SoundLabel.START_STATE_MUSIC);
  }

  setReady(){
    this.ready = true;
  }

  update(deltaTime){

    this.colour.step();
    this.colour.getColour().a = 0.8;
    this.titleOffset = this.titleOffset < 360 ? this.titleOffset+4 : 0;

    this.title.update(deltaTime);
    this.title2.update(deltaTime);

    if(Utility.Random(0,100) < 5){
      this.ParticleSystem.addParticle(
        Utility.Random(100,CW-100),
        Utility.Random(100,CH-100),
        Utility.Random(10,100),
        ParticleType.FIREWORK
      )
    }

    this.ParticleSystem.update(deltaTime);

    this.secondaryOffset += 1;
  }

  draw(){

    Draw.fillCol(this.colour.getColour());
    Draw.rect(0,0,CW,CH);

    this.title2.draw({x:CW/2,y:CH/2});
    this.title.draw({x:CW/2,y:CH/2});

    if(this.ready){}


  }


}

class PlayState extends State{

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


class GameOverState extends State {

  constructor(level,changeState,reloadLevel,nextLevel){

    super(level,changeState);

    this.reloadLevel = reloadLevel;

    this.nextLevel = nextLevel;

    this.titleOffset = 0;

  }

  setup(){}

  update(deltaTime){
    this.titleOffset = this.titleOffset < 360 ? this.titleOffset+4 : 0;
  }

  draw(){

    Draw.fill(51,51,51,0.5);
    Draw.fill(51,51,51,0.5);
    Draw.rect(0,0,CW,CH);

    Draw.gameText(
      'GAMEOVER',100,80,0,-2,4,50,false,false,this.titleOffset,
      0.3,0.3,0.3,0,1,2,200,55
    );

    Draw.gameText(
      'PRESS R TO CONTINUE',40,80,0,2.5,4,50,true,false,this.titleOffset,
      0.3,0.3,0.3,0,1,2,200,55
    );

  }

}

class VictoryState extends State {

  constructor(level,changeState){
    super(level,changeState);

    this.ParticleSystem = new ParticleSystem();

    this.titleOffset = 0;

    this.redirectAttempted = false;

    this.colour = new PulseColour(new Colour().random());

    // text level
    this.title = new ElectronText(CW/2,CH/2,'VICTORY!','futurist',230,'center',200,55,50,50,null)
    this.title.useCamera = false;
    this.title.printDelay = 250;
    this.title.setColour(new Colour(255,255,255));


  }

  setup(){
    sound.stopAll();
    sound.play(SoundLabel.VICTORY_STATE_MUSIC);

    // this.timer = new LevelTimer(2000,-1,false,new SAT.Vector(100,100));
  }

  update(deltaTime){

    // stuff for testing survey redirect
    // this.timer.update(deltaTime);

    this.title.update(deltaTime)


  }

  draw(){

    Draw.fill(51,51,51,0.5);
    Draw.rect(0,0,CW,CH);

    this.title.draw()

  }

}

class PauseState extends State {

  constructor(level,changeState){
    super(level,changeState);

  }

  update(deltaTime){}

  draw(){

    Draw.fill(51,51,51,0.5);
    Draw.rect(0,0,CW,CH);

    Draw.gameText(
      'PAUSED',100,80,0,-2,4,50,false,false,this.titleOffset,
      0.3,0.3,0.3,1,2,4,127,127
    );

    Draw.gameText(
      'PRESS P / ESC TO CONTINUE',40,80,0,2,4,50,true,false,this.titleOffset,
      0.3,0.3,0.3,1,2,4,127,127
    );


  }

}

class LevelSwitchState extends State {

  constructor(level,changeState){

    super(level,changeState);

    this.setup();

  }

  setup(){

    this.timer = new LevelTimer(2000,-1,false,new SAT.Vector(100,100));

    this.hud = new HUD(null,this.timer);

  }

  update(deltaTime){

    this.timer.update(deltaTime);

    if(this.timer.isEnded()) this.changeState(GameState.PLAY_STATE);

  }

  draw(){


    Draw.fill(255,255,255,0.2*Math.log(1-this.timer.getPercentageComplete())+1);
    Draw.rect(0,0,CW,CH);

    // this.hud.draw();

  }

}
