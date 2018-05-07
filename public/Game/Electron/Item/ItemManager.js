var ItemType = {
  GENERIC:"generic"
}

class ItemManager {

  constructor(level){

    this.level = level;

    this.items = [];

  }

  getCollected(){
    return this.items.length === 0 || this.items.reduce((a,v) => !v.getCollected() ? a = false : a = a, true);
  }

  addItem(core,itemProperties){

    let newItem = null;

    switch(itemProperties.type){
      case ItemType.GENERIC     :
        newItem = new Item(this.level,0,0,itemProperties);
        break;
      default                      :
        newItem = new Item(this.level,0,0,itemProperties);
        break;
    }

    core.addChild(newItem,itemProperties.angle);

    this.items.push(newItem);

  }

  update(deltaTime){

    for( let i = this.items.length-1 ; i >= 0 ; i--){

      let item = this.items[i];

      item.update(deltaTime);

      /// Checking Collisions with playerSeedn

      let r = item.getCollider().test(this.level.player.getCollider());

      // put collected logic here
      if(r){
        item.setCollected(true);
        sound.play(SoundLabel.CLICK_1);
        this.level.particleSystem.addParticle(item.getPos().x,item.getPos().y,0,ParticleType.IONBURST)
        this.items.splice(i,1);
      }

    }

}

  draw(camera){
    Draw.resetStroke();
    for(let item of this.items){
      item.draw(camera);
    }
  }

}
