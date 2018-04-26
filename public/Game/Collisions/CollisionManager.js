
class CollisionManager {

  constructor(level){

    this.level = level;

  }

  checkAll(){

    let agents = this.level.agents.getAgents();

    let walls = this.level.walls;

    // structure so walls are checked against players and enemies
    for(let wall of walls){

      // checking wall against every agent
      for(let agent of agents){

        // checking agent for wall collision
        if(agent.getAlive()) this.checkWallEnemy(wall,agent);

      }

      // checking player for wall collision
      this.checkWallPlayer(wall,this.level.player);
    }

    // checking player has a weapon
    if(this.level.player.weapon){
      // structure so player bullets are checked against walls and enemies
      for(let bullet of this.level.player.weapon.bullets){

        // checking bullets against enemies
        for(let agent of agents){
          if(agent.getAlive()) this.checkBulletEnemy(bullet,agent);
        }

        // structure so walls are checked against players and enemies
        for(let wall of walls){
          this.checkWallBullet(wall,bullet);
        }

      }

    }

    // structure so enemy bullets are checked against walls and player
    for(let agent of agents){

      if(!agent.getAlive()) continue;

      // iterating over bullets
      for(let bullet of agent.weapon.bullets){

        // checking bullet with every wall
        for(let wall of walls){
          // checking wall for bullet collision
          this.checkWallBullet(wall,bullet);
        }

        // checking player for bullet collision
        this.checkBulletPlayer(bullet,this.level.player);

      }

    }


    // for(var wall = 0 ; wall < this.level.walls.length ; wall++){
    //
    //   if(this.level.player.weapon)
    //     for(var bullet = 0 ; bullet < this.level.player.weapon.bullets.length ; bullet++){
    //
    //       // this.checkBulletPlayer(this.level.player.weapon.bullets[bullet],this.level.player);
    //
    //       for(var i = 0 ; i < agents.length ; i++){
    //         if(agents[i].getAlive()){
    //           this.checkBulletEnemy(this.level.player.weapon.bullets[bullet],agents[i]);
    //         }
    //       }
    //
    //       this.checkWallBullet(this.level.walls[wall],this.level.player.weapon.bullets[bullet]);
    //
    //     }
    //
    //   for(var i = 0 ; i < agents.length ; i++){
    //
    //     if(agents[i].getAlive()){
    //
    //       this.checkWallEnemy(this.level.walls[wall],agents[i]);
    //
    //       for(var bullet = 0 ; bullet < agents[i].weapon.bullets.length ; bullet++){
    //
    //         this.checkBulletPlayer(agents[i].weapon.bullets[bullet],this.level.player);
    //
    //         this.checkWallBullet(this.level.walls[wall],agents[i].weapon.bullets[bullet]);
    //
    //       }
    //
    //     }
    //
    //   }
    //
    //   this.checkWallPlayer(this.level.walls[wall],this.level.player);
    //
    // }


  }

  checkWallBullet(wall,bullet){

    if(!wall.collider || !bullet.collider) return;

    let r = wall.collider.test(bullet.collider);

    if(r){

      bullet.collider.getPos().add(r.overlapV);

      bullet.pos.set(bullet.collider.getPos());

      bullet.setRicochetCount(bullet.getRicochetCount()-1);

      switch (wall.checkSide(bullet.collider.getPos())) {
        case "LEFT":   bullet.setDirection(180 - bullet.getDirection()); break;
        case "RIGHT":  bullet.setDirection(180 - bullet.getDirection()); break;
        case "TOP":    bullet.setDirection(360 - bullet.getDirection()); break;
        case "BOTTOM": bullet.setDirection(360 - bullet.getDirection()); break;
        default:
      };

      this.level.ParticleSystem.addParticle(bullet.pos.x,bullet.pos.y,bullet.getDirection(),ParticleType.GENERIC);

    } else {
      bullet.collider.setPos(bullet.pos);
    }

  }

  checkWallPlayer(wall,player){

    if(!wall.collider || !player.collider) return;

    let r = wall.collider.test(player.collider);
    if(r){

      // this.level.camera.resetShake();

      player.collider.getPos().add(r.overlapV);

      player.pos.set(player.collider.getPos());

      player.updateWeaponPos()

    } else {
      player.collider.setPos(player.pos);
    }
  }

  checkWallEnemy(wall,enemy){

    if(!wall.collider || !enemy.collider) return;

    let r = wall.collider.test(enemy.collider);
    if(r){

      // TODO EXPERIMENTAL CHANGE
      // enemy.collider.getPos().add(r.overlapV);
      enemy.applyImpulse(r.overlapV.scale(2));

      enemy.pos.set(enemy.collider.getPos());

      enemy.updateWeaponPos()

      enemy.isColliding = true;
    } else {
      enemy.collider.setPos(enemy.pos);
    }
  }

  checkBulletPlayer(bullet,player){

    if(!bullet.collider || !player.collider) return;

    let r = player.collider.test(bullet.collider);
    if(r){

      // remove particle on collision
      bullet.setAlive(false);

      // checking player is not invincible
      if(player.getInvincibility()){

        this.level.ParticleSystem.addParticle(bullet.pos.x,bullet.pos.y,bullet.getDirection()+180,ParticleType.GUNSMOKE);

      } else {
        // applying bullets damage to player
        player.applyDamage(bullet);

        // adding blood particles to world when shot
        this.level.ParticleSystem.addParticle(bullet.pos.x,bullet.pos.y,bullet.getDirection(),ParticleType.BLOOD);
      }

    }

  }

  checkBulletEnemy(bullet,enemy){

    if(!bullet.collider || !enemy.collider) return;

    let r = enemy.collider.test(bullet.collider);
    if(r){

      enemy.applyDamage(bullet);

      // remove particle on collision
      bullet.setAlive(false);

      // adding blood particles to world when shot
      this.level.ParticleSystem.addParticle(bullet.pos.x,bullet.pos.y,bullet.getDirection(),ParticleType.BLOOD);
      // enemy.setShot(true);
    }
  }



}
