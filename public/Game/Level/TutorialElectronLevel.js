class TutorialElectronLevel extends ElectronLevel {

  constructor(world,worldsize,levelsize,properties){
    super(world,worldsize,levelsize,properties);

    // setting tutorial text array index
    this.tutorialTextIndex = 0;

    // setting up simple tutorial text array
    this.tutorialtext = [
      'TAP LEFT TO MOVE LEFT',
      'TAP RIGHT TO MOVE RIGHT',
      'EXIT AT THE TUNNEL'
    ];

    // settng up level text which will print all the hints for the tutuorial
    this.leveltext = new ElectronText(0,0,this.tutorialtext[this.tutorialTextIndex],'futurist',25,'center',40,35,50,50,null)
    this.leveltext.printDelay = 20;

  }

  levelStart(){

    // setting text hint offset (above tunnel)
    let texty = this.cores.end.getCore().getRadius() + this.player.getRadius()*2 + this.player.getMargin()*2;
    this.leveltext.getPos().y = -texty;

    // invoking super level start method
    super.levelStart();

  }

  enableControls(){

    // invoking super control enable
    super.enableControls();

    // setting input callback for when left is pressed
    input.setCallBack(InputKeys.LEFT,'tutorial-level-left',(function(){

      // enable left movement
      this.player.setCanMoveLeft(true);

      // incrementing tutorial text when successfully pressed
      this.tutorialTextIndex = 1;
      // updating level text
      this.leveltext.text = this.tutorialtext[this.tutorialTextIndex];
      // resetting level text print
      this.leveltext.reset();
      // removing this callback from further invocation
      input.removeCallBack(InputKeys.LEFT,'tutorial-level-left');

    }).bind(this));

    // setting input callback for when right is pressed
    input.setCallBack(InputKeys.RIGHT,'tutorial-level-right',(function(){

      // if previous tutorial step was met
      if(this.tutorialTextIndex === 1){

        // enable right movement
        this.player.setCanMoveRight(true);

        // incrementing tutorial text when successfully pressed
        this.tutorialTextIndex = 2;
        // resetting level text print
        this.leveltext.text = this.tutorialtext[this.tutorialTextIndex];
        // resetting level text print
        this.leveltext.reset();
        // removing this callback from further invocation
        input.removeCallBack(InputKeys.RIGHT,'tutorial-level-right');

        // allowing exit highlighting to occur
        this.cores.setHighlightExit(true);

      }

    }).bind(this));

    // enabling left control
    this.player.setCanMoveLeft(false);

    // enabling right control
    this.player.setCanMoveRight(false);

  }

  update(deltaTime){

    super.update(deltaTime);

    // updating tutorial text
    this.leveltext.update(deltaTime);

  }

  draw(){

    super.draw();

    // getting camera offset
    let camera = this.camera.getOffset();

    // drawing hint text
    this.leveltext.draw(camera);

  }

}
