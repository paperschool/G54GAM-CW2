class LevelTutorial {

  constructor(world,worldsize,levelsize,player){

    this.worldreference = world;

    // size of world in virtual pixels (offscreen and onscreen)
    this.worldSize = new SAT.Vector(worldsize.x,worldsize.y);

    // setting level state
    this.levelState = LevelState.RUNNING;

    // creating player and setting position to center of canvas
    this.player = new Player(0,0,null);

    input.setCallBack(InputKeys.SPACE,'tutorial-level-exit',(function(){

      if(this.cores.end.getPlayerCollided() && this.levelState === LevelState.CAN_EXIT){
        this.levelState = LevelState.EXITED;
        input.removeCallBack(InputKeys.SPACE,'tutorial-level-exit');
      }

    }).bind(this));

    // manager or origin cores
    this.cores = new CoreManager(this);

    // level count down timer
    this.timer = new LevelTimer(30000,-1,false,this.levelSize,null);

    // creating new camera objext
    this.camera = new CameraShudder(0,0,CW,CH,this.worldSize.x,this.worldSize.y);

    // this.camera.setFocus(this.player,new SAT.Vector(CW/2,CH/2));

    this.colour = new PulseColour(new Colour().random());


    this.tutorialTextIndex = 0;
    this.tutorialtext = [
      'PRESS LEFT TO MOVE LEFT',
      'PRESS RIGHT TO MOVE RIGHT',
      'EXIT AT THE TUNNEL'
    ];

    // text level
    this.leveltext = new ElectronText(0,0,this.tutorialtext[this.tutorialTextIndex],'futurist',25,'center',40,35,50,50,null)

    this.leveltext.printDelay = 50;

    input.setCallBack(InputKeys.LEFT,'tutorial-level-left',(function(){

      this.tutorialTextIndex = 1;
      this.leveltext.text = this.tutorialtext[this.tutorialTextIndex];
      this.leveltext.reset();
      input.removeCallBack(InputKeys.LEFT,'tutorial-level-left');



    }).bind(this));

    input.setCallBack(InputKeys.RIGHT,'tutorial-level-right',(function(){

      if(this.tutorialTextIndex === 1){
        this.tutorialTextIndex = 2;
        this.leveltext.text = this.tutorialtext[this.tutorialTextIndex];
        this.leveltext.reset();
        input.removeCallBack(InputKeys.RIGHT,'tutorial-level-right');

        this.cores.setHighlightExit(true);

      }

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

  update(deltaTime){

    this.colour.step();

    this.camera.update(deltaTime);

    this.timer.update(deltaTime);

    this.cores.update(deltaTime);

    // update player
    this.player.update(deltaTime);

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

    this.cores.draw(camera);

    this.player.draw(camera);

    this.leveltext.draw(camera);

  }

  addAgent(x,y,type,weapon,patrol,team){
    this.agents.addAgent(x,y,type,weapon,patrol,team);
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


    // if(this.timer.isEnded()){
    //   this.levelState = LevelState.TIMEOUT;
    // }

  }

  getLevelState(){
    return this.levelState;
  }

}
