class TutorialElectronLevel extends ElectronLevel {

  constructor(world,worldsize,levelsize,properties){
    super(world,worldsize,levelsize,properties);

    this.player.setCanMoveLeft(true);
    this.player.setCanMoveRight(false);

    this.tutorialTextIndex = 0;
    this.tutorialtext = [
      'PRESS LEFT TO MOVE LEFT',
      'PRESS RIGHT TO MOVE RIGHT',
      'EXIT AT THE TUNNEL'
    ];

    // text level
    this.leveltext = new ElectronText(0,0,this.tutorialtext[this.tutorialTextIndex],'futurist',25,'center',40,35,50,50,null)

    this.leveltext.printDelay = 20;

  }

  levelStart(){
    let texty = this.cores.end.getCore().getRadius() + this.player.getRadius()*2 + this.player.getMargin()*2;
    this.leveltext.getPos().y = -texty;

    super.levelStart();

  }

  enableControls(){

    super.enableControls();

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

  }

  update(deltaTime){

    super.update(deltaTime);

    this.leveltext.update(deltaTime);

  }

  draw(){

    super.draw();

    let camera = this.camera.getOffset();

    this.leveltext.draw(camera);

  }

}
