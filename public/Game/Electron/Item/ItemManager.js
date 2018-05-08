// psuedo enum type for item class
var ItemType = {
  GENERIC:"generic"
}

class ItemManager {

  constructor(level){

    // storing reference to level
    this.level = level;

    // item collection
    this.items = [];

  }

  getCollected(){
    // method will return true if the item count is 0 (all collected) or if still unchecked will perform
    // an inline reduction to check if the collection of items contain an uncollected item
    return this.items.length === 0 || this.items.reduce((a,v) => !v.getCollected() ? a = false : a = a, true);
  }

  addItem(core,itemProperties){

    // reference to new item
    let newItem = null;

    // switching through item types (only one for now)
    switch(itemProperties.type){
      case ItemType.GENERIC     :
        newItem = new Item(this.level,0,0,itemProperties);
        break;
      default                      :
        newItem = new Item(this.level,0,0,itemProperties);
        break;
    }

    // adding child to given core at described angle
    core.addChild(newItem,itemProperties.angle);

    // pushing item to item collection
    this.items.push(newItem);

  }

  update(deltaTime){

    for( let i = this.items.length-1 ; i >= 0 ; i--){

      let item = this.items[i];

      item.update(deltaTime);

      /// Checking Collisions with playerSeedn
      let r = item.getCollider().test(this.level.player.getCollider());

      // response from test implies collision
      if(r){
        // set collected item state to true for audit purposes later
        item.setCollected(true);
        // play sound for feedback communication
        sound.play(SoundLabel.CLICK_1);
        // spawning ion burst particles
        this.level.particleSystem.addParticle(item.getPos().x,item.getPos().y,0,ParticleType.IONBURST)
        // removing current item from item collection 
        this.items.splice(i,1);
      }

    }

}

  draw(camera){

    Draw.resetStroke();

    // drawing all items within collection
    for(let item of this.items){
      item.draw(camera);
    }
  }

}
