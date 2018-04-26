class HUDMap {

  constructor(world,level){
    this.player = new SAT.Vector(0,0);
    this.world  = new SAT.Vector(world.x,world.y);
    this.level  = new SAT.Vector(level.x,level.y);
    this.view = new SAT.Vector(CW,CH);
    this.size = 200;
    this.margin = 20;
  }

  update(){

  }

  draw(){

    Draw.fill(51,51,51);
    Draw.rect(this.margin,this.margin,this.size,this.size);
    Draw.fill(255,255,255);
    Draw.rect(this.margin+2,this.margin+2,this.size-4,this.size-4);

    Draw.fill(0,255,0);
    Draw.rect(this.margin,this.margin,(200/this.world.x)*this.level.x,(200/this.world.y)*this.level.y);

    var pPos = new SAT.Vector((200/this.world.x)*this.player.x,(200/this.world.y)*this.player.y);

    var vpSize = new SAT.Vector((200/this.world.x)*CW,(200/this.world.y)*CH);

    var vpPos = new SAT.Vector(pPos.x - vpSize.x/2,pPos.y - vpSize.y/2);

    Draw.rectOutline(
      this.margin+vpPos.x,
      this.margin+vpPos.y,
      vpSize.x,vpSize.y
    );

    Draw.fill(200,0,0);
    Draw.rect(this.margin+pPos.x,this.margin+pPos.y,2,2);

  }

}
