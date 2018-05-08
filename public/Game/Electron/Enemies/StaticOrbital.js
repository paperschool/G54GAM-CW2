class StaticOrbital extends Orbital {

  constructor(level,x,y,properties){

    super(level,x,y,properties);

    // setting actor colour
    this.setColour(new Colour(51,51,51));

    // setting actor speed to 0 as entity is static
    this.setSpeed(0);

  }

  // simple pass through to super (largly not needed), incase additional functionality is added
  update(deltaTime){
    super.update(deltaTime);
  }

  draw(camera){
    super.draw(camera);
  }


}
