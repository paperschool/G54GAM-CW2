
let PickupType = {
  PISTOL:1,
  MACHINEGUN:2,
  SHOTGUN:3,
  FLAMETHROWER:4
}

let EnemyType = {
  GENERIC:1,
  PATROL:2,
  MULTI:3
}

let Weapon = {
  PISTOL:1,
  MACHINEGUN:2,
  SHOTGUN:3,
  FLAMETHROWER:4,
}



class Tools {

  constructor(){

    this.tools = {};

    for(let tool in ToolTypes){
      this.tools[tool] = {}
    }

    this.tools[ToolTypes.ENEMY] = {
      type:null,
      weapon:null
    }

  }



}
