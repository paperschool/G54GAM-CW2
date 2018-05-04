class StaticOrbital extends Orbital {

  constructor(level,x,y,properties){

    super(level,x,y,properties);

    this.level = level;

    this.setColour(new Colour(51,51,51));

    this.setSpeed(0);

  }

  // TODO: Fix poor association to parent class
  update(deltaTime){

    super.update(deltaTime);

  }

  draw(camera){

    super.draw(camera);

  }


}
