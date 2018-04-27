class OrbitalManager {

  constructor(level){

    this.level = level;

    this.orbitals = [];

  }

  addOrbital(core,orbitalProperties){

    let newOrbital = new Orbital(this.level,0,0,orbitalProperties);

    core.addChild(newOrbital,orbitalProperties.angle);

    this.orbitals.push(newOrbital);

  }

  update(deltaTime){

    for(let orbital of this.orbitals){

      orbital.update(deltaTime);

      /// Checking Collisions with playerSeen

      let r = orbital.getCollider().test(this.level.player.getCollider());

      if(r){
        this.level.player.setAlive(false);
      }

    }

}

  draw(camera){
    for(let orbital of this.orbitals){
      orbital.draw(camera);
    }
  }

}
