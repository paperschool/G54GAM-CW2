var EventTypes = {
  WALL:1,
  PLAYER:2,
  ENEMY:3,
  PICKUP:4,
  FLOOR:5,
  DEADSPACE:6,
}

class History {

  constructor(grid){

    this.grid = grid;

    this.events = [];

    this.addTrigger = false;

  }

  add(id,type){
    this.events.push({type:type,id:id});
  }

  remove(id,type){
    for(let e = this.events.length-1 ; e >= 0 ; e--){
      if(this.events[e].id === id && this.events[e].type === type){
        this.events.splice(e,1);
      }
    }
  }

  undo(){

    if(this.events.length === 0) return;

    // removing event
    let e = this.events.splice(this.events.length-1,1)[0];

    switch(e.type){

      case EventTypes.PLAYER :
        if(this.grid.player !== null){
          this.grid.player = null;
          return true;
        } else {
          return false;
        }
      case EventTypes.WALL :
        return this.genericRemove(this.grid.walls,e.id);
      case EventTypes.ENEMY :
        return this.genericRemove(this.grid.enemies,e.id);
      case EventTypes.PICKUP :
        return this.genericRemove(this.grid.pickups,e.id);
      case EventTypes.FLOOR :
        return this.genericRemove(this.grid.floors,e.id);
      case EventTypes.DEADSPACE :
        return this.genericRemove(this.grid.deadspaces,e.id);
      default : return false;
    }

  }

  genericRemove(array,id){

    for(let i = 0 ; i < array.length ; i++){
      if(array[i].id === id){
        array.splice(i,1);
        return true;
      }
    }
    return false;

  }

}
