var OrbitalType = {
  GENERIC:"generic",
  TELEPORTING:"teleporting"
}

class OrbitalManager {

  constructor(level){

    this.level = level;

    this.orbitals = [];

  }

  addOrbital(core,orbitalProperties){

    let newOrbital = null;

    switch(orbitalProperties.type){
      case OrbitalType.GENERIC     :
        newOrbital = new Orbital(this.level,0,0,orbitalProperties);
        break;
      case OrbitalType.TELEPORTING :
        newOrbital = new TeleportingOrbital(this.level,0,0,orbitalProperties);
        break;
      default                      :
        newOrbital = new Orbital(this.level,0,0,orbitalProperties);
        break;
    }

    core.addChild(newOrbital,orbitalProperties.angle);

    this.orbitals.push(newOrbital);

  }

  update(deltaTime){

    for(let orbital of this.orbitals){

      orbital.update(deltaTime);

      /// Checking Collisions with playerSeen

      let r = orbital.getCollider().test(this.level.player.getCollider());

      if(r){
        // this.level.player.setAlive(false);
        this.level.player.applyDamage(1);
        // this.level.player.beingDamaged = true;
      }

    }

}

  draw(camera){
    for(let orbital of this.orbitals){
      orbital.draw(camera);
    }
  }

}
