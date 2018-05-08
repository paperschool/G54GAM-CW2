
// psuedo enum type for orbital class
var OrbitalType = {
  GENERIC:"generic",
  TELEPORTING:"teleporting",
  OSCILLATING:"oscillating",
  STATIC:"static"
}

class OrbitalManager {

  constructor(level){

    // setting level reference
    this.level = level;

    // collection of all orbitals within the game
    this.orbitals = [];

  }

  addOrbital(core,orbitalProperties){

    // reference to new orbital
    let newOrbital = null;

    // switching through various orbital types
    switch(orbitalProperties.type){
      case OrbitalType.GENERIC     :
        newOrbital = new Orbital(this.level,0,0,orbitalProperties);
        break;
      case OrbitalType.STATIC      :
        newOrbital = new StaticOrbital(this.level,0,0,orbitalProperties);
        break;
      case OrbitalType.TELEPORTING :
        newOrbital = new TeleportingOrbital(this.level,0,0,orbitalProperties);
        break;
      case OrbitalType.OSCILLATING :
        newOrbital = new OscillatingOrbital(this.level,0,0,orbitalProperties);
        break;
      default                      :
        newOrbital = new Orbital(this.level,0,0,orbitalProperties);
        break;
    }

    // adding newly constructed orbital object to given core
    core.addChild(newOrbital,orbitalProperties.angle);

    // pushing orbital to manager
    this.orbitals.push(newOrbital);

  }

  update(deltaTime){

    // iterating over orbital collection type
    for(let orbital of this.orbitals){

      // updating orbital
      orbital.update(deltaTime);

      /// Checking Collisions with playerSeedn
      let r = orbital.getCollider().test(this.level.player.getCollider());

      // if response from collision exists (collision has occured)
      if(r){
        // kill player and shake camera
        this.level.player.setAlive(false);
        this.level.camera.resetShake(7);
      }
    }

}

  draw(camera){

    Draw.resetStroke();

    // iterating over orbiatal collection
    for(let orbital of this.orbitals){
      // performing draw method of orbital object
      orbital.draw(camera);
    }
  }

}
