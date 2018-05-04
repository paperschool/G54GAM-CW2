// object that stores game
var game = null;

var gameTheme = DarkTheme;
// var gameTheme = LightTheme;

// global mouse position object
var input = null

// canvas size and width
var CW = 0,CH = 0;

// diagnostic output text
var diagnostic = null

// chart that plots a running total of the given data (used here to track fps)
var chart = null;

// this class stores a key -> value pair relationship of sound effect labels to the
// sound object created by howler.js

var sound =  new EngineSounds(pageFilesReady);

$(window).ready(()=>sound.forceReady());


// // loading in relevant sound file locations and sound labels into sound engine
// sound.add(SoundLabel.PISTOL,'Game/Assets/sound/snd9mm.wav',0.1);
// sound.add(SoundLabel.SHOTGUN,'Game/Assets/sound/sndShotgun.wav',0.05);
// sound.add(SoundLabel.MACHINEGUN,'Game/Assets/sound/sndM16.wav',0.04);
// sound.add(SoundLabel.FLAMETHROWER_S,'Game/Assets/sound/sndFlameThrowerStart.wav',0.1);
// sound.add(SoundLabel.FLAMETHROWER_M,'Game/Assets/sound/sndFlameThrower.wav',0.1,true,false);
// sound.add(SoundLabel.FLAMETHROWER_E,'Game/Assets/sound/sndFlameThrowerEnd.wav',0.1);
//
// sound.add(SoundLabel.PICKUP_GUN,'Game/Assets/sound/sndPickUpWeapon.wav',0.1);
// sound.add(SoundLabel.PICKUP_SHOTGUN,'Game/Assets/sound/sndInsertShell.wav',0.1);
// sound.add(SoundLabel.PICKUP_FLAMETHROWER,'Game/Assets/sound/sndLightning1.wav',0.1);
//
// sound.add(SoundLabel.FIREWORK,'Game/Assets/sound/sndFirework.wav',0.1);
//
// sound.add(SoundLabel.STATE_PAUSED,'Game/Assets/sound/sndPause.wav',0.1);
// sound.add(SoundLabel.STATE_PLAY,'Game/Assets/sound/sndUnPause.wav',0.1);
// // sound.add(SoundLabel.STATE_START,'Game/Assets/sound/sndLightning1.wav',0.1);
// // sound.add(SoundLabel.STATE_VICTORY,'Game/Assets/sound/sndLightning1.wav',0.1);
//
// sound.add(SoundLabel.STATE_GAMEOVER_1,'Game/Assets/sound/sndSplashLogo.wav',0.1);
// sound.add(SoundLabel.STATE_GAMEOVER_2,'Game/Assets/sound/sndStopButton.wav',0.1);
//
//
// // music libraries
// sound.add(SoundLabel.START_STATE_MUSIC,'Game/Assets/sound/musicStart.mp3',0.2,true,false);
//
// sound.add(SoundLabel.PLAY_STATE_MUSIC_1,'Game/Assets/sound/musicPlay1.mp3',0.2,true,false);
// sound.add(SoundLabel.PLAY_STATE_MUSIC_2,'Game/Assets/sound/musicPlay2.mp3',0.2,true,false);
// sound.add(SoundLabel.PLAY_STATE_MUSIC_3,'Game/Assets/sound/musicPlay3.mp3',0.2,true,false);
// sound.add(SoundLabel.PLAY_STATE_MUSIC_4,'Game/Assets/sound/musicPlay4.mp3',0.2,true,false);
//
// sound.add(SoundLabel.VICTORY_STATE_MUSIC,'Game/Assets/sound/musicVictory.mp3',0.2,true,false);

function pageFilesReady(){

  $(".loader-frame").fadeTo("slow",0, function(){
    $(this).remove();
  });

  // settting canvas dimensions based on DOM inner width/height
  CW = window.innerWidth;
  CH = window.innerHeight;

  // setup diagnostic input
  diagnostic = new DiagnosticHUD(0,0);

  chart = new Chart(50,400,200,0,60);

  // Input Object instantiation
  input = new Input();

  // create mouse position vector
  mousePos = new SAT.Vector(0,0);

  // instantiating game object
  game = new Game();

  // resize window event to update global canvas size objects
  $(window).on('resize',function(){
    CW = window.innerWidth;
    CH = window.innerHeight;
    game.updateContext(CW,CH)
  });

}


class Game {

  constructor(){

    // define canvas
  	this.canvas = document.getElementById("game_canvas");

  	// define canvas context
  	this.ctx = this.canvas.getContext("2d");

    // setting canvas context height and width for rendering
    this.updateContext(CW,CH);

    // defining world object
    this.world = new World(5000,5000);

    // Begin game loop with loop object instantiation
    this.gameLoop = new GameLoop(120.0,60.0,this.update.bind(this),this.draw.bind(this));

  }

  updateContext(x,y){
    // setting canvas context height and width for rendering
    this.ctx.canvas.width = x;
    this.ctx.canvas.height = y;
  }

  update(deltaTime){

    // updating and updating world
    this.world.update(deltaTime);

  }

  draw(deltaTime){
    this.world.draw();
    // chart.draw();
    // diagnostic.draw();
  }

  end(){

  }

}

class GameLoop {


  constructor(sps,fps,updateCallback,drawCallback){

      console.log(" > GAME LOOP Started. ");

      // this value represents the number of phsical updates per second
      this.sps = 1000 / sps;

      // fps as a value over 1 second ( 1000 miliseconds / '30' fps ) = 33.3 ms before next tick
      this.fps = 1000.0 / fps;

      // variable to store time of current tick
      this.now = this.getNow();

      // variable to store time of last tick
      this.lastTimeS = this.getNow();

      this.lastTime = this.getNow();

      // call back to run on tick fire
      this.updateCallback = updateCallback;
      this.drawCallback = drawCallback;

      // tick total
      this.totalTick = 0;

      this.totalFrames = 0;

      this.deltaTime = 0;

      this.ticking = true;

      // this.tick();

      // new game loop

      this.tickSecond = 0;

      this.lastRender = 0;

      this.lastSecond = this.getNow();

      this.currentFPS = 0;

      window.requestAnimationFrame(this.tick.bind(this))

  }

  tick(time){

    // incrementing ticks
    this.totalTick++;
    // incrementing ticks since last second
    this.tickSecond++;

    // if the current time minus the time since the last frame poll is more than a second
    if(time - this.lastSecond > 1000){

      this.currentFPS = this.tickSecond;

      // reset ticks per second
      this.tickSecond = 0;

      // update last second time
      this.lastSecond = time;

    }

    // update fps diagnostic and chart
    diagnostic.updateLine("FPS: ",this.currentFPS);
    chart.addSample(this.currentFPS);

    let deltaTime = ((time - this.lastRender) / this.fps);

    let progress = (Math.round(deltaTime * 10000) / 10000);

    this.updateCallback(progress);
    this.drawCallback();

    this.lastRender = time;

    // diagnostic.updateLine("Prog-1: ",Math.round(((time - this.lastRender) / this.fps) * 100) / 100);
    diagnostic.updateLine("Prog-2: ",progress);

    // requesting new frame
    window.requestAnimationFrame(this.tick.bind(this));

  }

  getNow(){
    return window.performance && window.performance.now ? window.performance.now() : new Date().getTime();
  }

}
