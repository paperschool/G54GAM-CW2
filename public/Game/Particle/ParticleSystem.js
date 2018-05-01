
class ParticleSystem {

  constructor(){

    this.particles = [];

    this.particleLimit = 1000;

  }

  update(deltaTime){

    for(var i = this.particles.length-1 ; i >= 0 ; i--){
      this.particles[i].update(deltaTime);
      if(this.particles[i].life <= 0){
        this.particles.splice(i,1);
      }
    }

    diagnostic.updateLine("- Particles",this.particles.length);


  }

  draw(camera){

    for(var i = 0 ; i < this.particles.length ; i++){
      this.particles[i].draw(camera);
    }

  }

  addParticle(x,y,d,type){

    if(this.particleLimit < this.particles.length) this.particles.splice(this.particleLimit-1,1);

    switch(type){
      case ParticleType.GENERIC:
        this.particles.push(new Particle(x,y));
        break;
      case ParticleType.SNOW:
        this.particles.push(new Particle(x,y));
        break;
      case ParticleType.BURN:
        break;
      case ParticleType.SMOKE:
        this.particles.push(new Particle_Smoke(x,y,d));
        break;
      case ParticleType.BLOOD:
        this.particles.push(new Particle_Blood(x,y,d));
        break;
      case ParticleType.DEBRIS:
        break;
      case ParticleType.GUNSMOKE:
        this.particles.push(new Particle_GunSmoke(x,y,d));
        break;
      case ParticleType.FIREWORK:
        this.particles.push(new Particle_Firework(x,y,d));
        break;
      case ParticleType.GLITTER:
        this.particles.push(new Particle_Glitter(x,y,d));
        break;
      case ParticleType.ION:
        this.particles.push(new Particle_Ionisation(x,y,d));
        break;
    }

  }

}

class Particle extends Entity {

  constructor(x,y){

    super(x,y,3,3);

    this.colour.randomGrey();

    this.setLife(10);

  }

  getLife(){
    return this.life;
  }

  setLife(life){
    this.life = life;
  }

  update(deltaTime){

    super.update(deltaTime);

    this.life--;

    this.colour.setA(Utility.Map(this.life,0,10,1.0,0));


  }

  draw(camera){

    super.draw(camera);

    Draw.fillCol(this.colour);
    Draw.circle(this.pos.x-camera.x,this.pos.y-camera.y,this.size.x);

  }

}

class Particle_Blood {

  constructor(x,y,d){

    this.drops = [];

    for(let drop = 0 ; drop < Utility.RandomInt(5,20) ; drop++){
      this.drops.push(new Blood_Splatter(x,y,d));
    }

  }

  update(deltaTime){
    for(let drop of this.drops){
      drop.update(deltaTime);
    }
  }

  draw(camera){
    for(let drop of this.drops){
      drop.draw(camera);
    }
  }

}

class Blood_Splatter extends Particle {

  constructor(x,y,d){

    super(x,y);

    this.colour.randomR(50,255);
    this.colour.randomA(0,255);

    this.life = 500;

    this.setSize(new SAT.Vector(Utility.RandomInt(5,20),Utility.RandomInt(5,20)));

    this.setPos(new SAT.Vector(x,y));

    this.getPos().x += Math.cos(Utility.Radians(Utility.Random(-20,20) + d))*Utility.Random(1,200)
    this.getPos().y += Math.sin(Utility.Radians(Utility.Random(-20,20) + d))*Utility.Random(1,200)

  }

  update(deltaTime){

    super.update(deltaTime);
    this.colour.setA(Utility.Map(this.life,100,0,1.0,0.0));
  }

  draw(camera){
    super.draw(camera);
    Draw.fillCol(this.colour);
    Draw.circle(this.pos.x-camera.x,this.pos.y-camera.y,this.size.x);
  }

}

class Particle_GunSmoke extends Particle {

  constructor(x,y,d){
    super(x,y);

    this.colour.randomGrey(51,255);

    this.life = 10;

    this.size.x = Utility.RandomInt(5,15)

    this.direction = new SAT.Vector(
      Math.cos(Utility.Radians(Utility.Random(-5,5) + d))*Utility.Random(1,20),
      Math.sin(Utility.Radians(Utility.Random(-5,2) + d))*Utility.Random(1,20)
    );

    this.pos.add(this.direction);

  }

  update(deltaTime){

    super.update(deltaTime);

    this.colour.setA(Utility.Map(this.life,10,0,1.0,0.0));

    // this.getPos().add(this.direction);

    this.size.x += 0.1;

    this.pos.add(this.direction.scale(0.9))

  }

  draw(camera){
    super.draw(camera);
    Draw.fillCol(this.colour);
    Draw.circle(this.pos.x-camera.x,this.pos.y-camera.y,this.size.x);
  }

}

class Particle_Smoke extends Particle {

  constructor(x,y,d){

    super(x,y);

    this.colour.randomG(150,255);

    this.life = 100;

    this.direction = new SAT.Vector(
      Math.cos(Utility.Radians(Utility.Random(-20,20) + d))*Utility.Random(1,200),
      Math.sin(Utility.Radians(Utility.Random(-20,20) + d))*Utility.Random(1,200)
    );

    this.setPos(new SAT.Vector(x,y));

  }

  update(deltaTime){

    super.update(deltaTime);
    this.colour.setA(Utility.Map(this.life,100,0,1.0,0.0));

    this.getPos().add(this.direction);

    this.size.x+=0.01;
    this.size.y+=0.01;

  }

  draw(camera){
    super.draw(camera);
    Draw.fillCol(this.colour);
    Draw.circle(this.pos.x-camera.x,this.pos.y-camera.y,this.size.x);
  }
}

class Particle_Firework extends Particle {

  constructor(x,y,d){
    super(x,y);

    sound.play(SoundLabel.FIREWORK);

    this.sparks = [];

    for(var i = 0 ; i < Utility.Random(10,50) ; i++) {
      this.sparks.push(new Firework_Spark(x,y,Utility.Random(1,8),Utility.Random(0,360)));
    }

    this.life = 100;

  }

  update(deltaTime){

    super.update(deltaTime);

    for(let spark of this.sparks){
      spark.update(deltaTime);
    }

  }

  draw(camera){
    for(let spark of this.sparks){
      spark.draw(camera);
    }
  }

}

class Firework_Spark extends Circle {

  constructor(x,y,s,d){
    super(x,y,s);

    this.direction = d;

    this.velocity = new SAT.Vector(
      Math.cos(Utility.Radians(Utility.Random(-5,5) + d))*Utility.Random(1,10),
      Math.sin(Utility.Radians(Utility.Random(-5,2) + d))*Utility.Random(1,10)
    );

    this.channelFocus = Utility.RandomInt(1,4);

    this.setColour(new Colour(
        (this.channelFocus === 1 ? 255 : (this.channelFocus === 2 ? 255 : 0)),
        (this.channelFocus === 2 ? 255 : (this.channelFocus === 3 ? 255 : 0)),
        (this.channelFocus === 3 ? 255 : (this.channelFocus === 1 ? 255 : 0)),
      )
    );

    this.life = 100;

  }

  update(deltaTime){

    this.life--;

    this.getPos().add(this.velocity);

    this.getPos().add({x:Utility.Random(-1,1),y:Utility.Random(-1,1)})

    if(this.channelFocus === 1) this.getColour().setR(Utility.Map(this.life,0,100,255,0));
    if(this.channelFocus === 2) this.getColour().setG(Utility.Map(this.life,0,100,255,0));
    if(this.channelFocus === 3) this.getColour().setB(Utility.Map(this.life,0,100,255,0));

    this.getColour().setA(0.5)

    this.getSize().x *= 1.01

  }

  draw(camera){

    super.draw(camera);
    //
    // Draw.fill(255);
    // Draw.circle(this.getPos().x,this.getPos().y,this.getSize().x);

  }

}


class Particle_Glitter extends Particle {

  constructor(x,y,d){
    super(x,y);

    sound.play(SoundLabel.FIREWORK);

    this.glitter = [];

    for(var i = 0 ; i < Utility.Random(10,50) ; i++) {
      this.glitter.push(new Glitter(x+Utility.Random(-40,40),y,Utility.Random(10,30),Utility.Random(0,360)));
    }

    this.life = 20;

  }

  update(deltaTime){

    super.update(deltaTime);

    for(let glitter of this.glitter){
      glitter.update(deltaTime);
    }

  }

  draw(camera){
    for(let glitter of this.glitter){
      glitter.draw({x:0,y:0});
    }
  }

}


class Glitter extends Circle {

  constructor(x,y,s,d){
    super(x,y,s);

    this.direction = d;

    this.velocity = new SAT.Vector(
      Math.cos(Utility.Radians(Utility.Random(-5,5) + d))*Utility.Random(1,10),
      Math.sin(Utility.Radians(Utility.Random(-5,2) + d))*Utility.Random(1,10)
    );

    this.setColour(new Colour().randomR());
    this.getColour().setA(0.3);
    this.life = 100;

  }

  update(deltaTime){

    this.life--;
    this.getPos().add(this.velocity);
    this.getPos().add({x:Utility.Random(-1,1),y:Utility.Random(-1,1)})
    this.getSize().x *= 0.99
  }

  draw(camera){
    super.draw(camera);
  }

}

class Particle_Ionisation extends Particle {

  constructor(x,y,d){
    super(x,y);

    // sound.play(SoundLabel.FIREWORK);

    this.ions = [];

    let count = Utility.Random(4,2)

    for(var i = 0 ; i < count ; i++) {
      this.ions.push(new Particle_Ions(x,y,Utility.Random(5,30),Utility.Random(d-50,d+50)));
    }

    this.life = 20;

  }

  update(deltaTime){

    super.update(deltaTime);

    for(let ion of this.ions){
      ion.update(deltaTime);
    }

  }

  draw(camera){
    for(let ion of this.ions){
      ion.draw(camera);
    }
  }

}


class Particle_Ions extends Circle {

  constructor(x,y,s,d){

    super(x,y,s);

    this.velocity = new SAT.Vector(
      Math.cos(Utility.Radians(d))*Utility.Random(1,20),
      Math.sin(Utility.Radians(d))*Utility.Random(1,20)
    );

    this.setColour(new Colour().randomGrey(150,255));

    this.getColour().setA(0.6);

    this.life = 200;

  }

  update(deltaTime){

    this.life--;

    this.getPos().add(this.velocity);

    this.getPos().add({x:Utility.Random(-1,1),y:Utility.Random(-1,1)})

    this.getSize().x *= 0.99

  }

  draw(camera){
    // Draw.resetStroke();
    Draw.stroke(2,new Colour(255,255,255).getRGBA())
    Draw.circleOutline(this.pos.x-camera.x,this.pos.y-camera.y,this.size.x)
  }

}
