
var Sizes = {
  MARGIN     : { id:"margin", unit:10,  scalar:1 },
  PLAYER     : { id:"player", unit:50,  scalar:1 },
  ENEMY      : { id:"enemy",  unit:50,  scalar:1 },
  UNIT       : { id:"unit",   unit:400, scalar:1 },
  CORE_SMALL : { id:"small",  unit:400, scalar:1 },
  CORE_MEDIUM: { id:"medium", unit:400, scalar:2 },
  CORE_LARGE : { id:"large",  unit:400, scalar:3 }
}

///////////////////////////////

var GameState = {
  START_STATE:0,
  PLAY_STATE:1,
  GAMEOVER_STATE:2,
  VICTORY_STATE:3,
  PAUSE_STATE:4,
  LEVEL_SWITCH_STATE:5
}

var LevelState = {
  RUNNING:0,
  PLAYER_DEAD:1,
  CAN_EXIT:3,
  EXITED:4,
  TIMEOUT:5
}

var InputKeys = {
  UP:'UP',
  DOWN:'DOWN',
  LEFT:'LEFT',
  RIGHT:'RIGHT',
  SPACE:'SPACE',
  SHIFT:'SHIFT',
  PAUSE:'PAUSE',
  REPLAY:'REPLAY',

  DEBUG_GRID:'DEBUG_GRID',
  DEBUG_AGENT_VISION:'DEBUG_AGENT_VISION',
  DEBUG_AGENT_PATH:'DEBUG_AGENT_PATH',
  DEBUG_AGENT_PROXIMITY:'DEBUG_AGENT_PROXIMITY',

  GODMODE:'GODMODE',
  TOGGLETHEME:'TOGGLETHEME'
}

var ParticleType = {
  GENERIC  :0,
  BURN     :1,
  SMOKE    :2,
  BLOOD    :3,
  DEBRIS   :4,
  GUNSMOKE :5,
  FIREWORK :6,
  GLITTER  :7,
  SNOW     :8
}

var AgentType = {
  GENERIC:"generic",
  FOLLOW:"follow",
  WANDERING:"wander",
  PATROL:"patrol",
  MULTIAGENT:"multiagent",
  MULTIAGENT_PATROL:"multiagentPatrol",
  DELIBERATIVE:"deliberative"
}

var AgentMessageType = {
  PLAYER_SEEN:"playerSeen",
  PLAYER_HEARD:"playerHeard",
  PLAYER_FIRED:"playerFired",
  FRIEND_DEAD:"friendDead"
}

var AgentPathFindingFocus = {
  PLAYER:"player",
  NEARPLAYER:"nplayer",
  OLDPLAYER:"oplayer",
  WANDER:"wander",
  PATROL:"patrol"
}

var ColliderType = {
  GENERIC:"generic",
  POINT  :"point",
  CIRCLE :"circle",
  BOX    :"box",
  POLYGON:"polygon"
}

var PickupType = {

  GENERIC:"generic",
  HEALTH:"hp",
  GUN:"gun",
  PISTOL:"pistol",
  SHOTGUN:"shotgun",
  MACHINEGUN:"machinegun",
  FLAMETHROWER:"flamethrower"

}

var SoundLabel = {

  GUN:"gun",
  PISTOL:"pistol",
  SHOTGUN:"shotgun",
  SHOTGUN_L:"shotgunLoad",
  MACHINEGUN:"machinegun",
  FLAMETHROWER_S:"flamethrowerStart",
  FLAMETHROWER_M:"flamethrowerMiddle",
  FLAMETHROWER_E:"flamethrowerEnd",

  PICKUP_GUN:"pickupGun",
  PICKUP_SHOTGUN:"pickupGunShotgun",
  PICKUP_FLAMETHROWER:"pickupGunFlamethrower",

  FIREWORK:"firework",

  STATE_PAUSED:"statePaused",
  STATE_PLAY:"statePlay",
  STATE_START:"stateStart",
  STATE_VICTORY:"stateVictory",
  STATE_GAMEOVER_1:"stateGameover1",
  STATE_GAMEOVER_2:"stateGameover2",

  START_STATE_MUSIC:"startStartMusic",
  PLAY_STATE_MUSIC_1:"playStartMusic1",
  PLAY_STATE_MUSIC_2:"playStartMusic2",
  PLAY_STATE_MUSIC_3:"playStartMusic3",
  PLAY_STATE_MUSIC_4:"playStartMusic4",

  VICTORY_STATE_MUSIC:"victoryStateMusic"

}

var BulletType = {
  GENERIC:"generic",
  PISTOL:"pistol",
  SHOTGUN:"shotgun",
  MACHINEGUN:"machinegun",
  FLAMETHROWER:"flamethrower",

}

var DefaultColours = {
  TURQUIOSE:"#1abc9c",
  GREENSEA:"#16a085",
  EMERALD:"#2ecc71",
  TEAL:"#27ae60",
  RIVER:"#3498db",
  OCEAN:"#2980b9",
  PURPLE:"#9b59b6",
  DARKPURPLE:"#8e44ad",
  ASPHALT:"#34495e",
  MIDNIGHT:"#2c3e50",
  SUNFLOWER:"#f1c40f",
  ORANGE:"#f39c12",
  CARROT:"#e67e22",
  PUMPKIN:"#d35400",
  RUBY:"#e74c3c",
  POMEGRANATE:"#c0392b",
  CLOUD:"#ecf0f1",
  SLIVER:"#bdc3c7",
  CONCRETE:"#95a5a6",
  FLAT:"#7f8c8d"
}

var LightTheme = {
  'WALL':DefaultColours.CONCRETE,
  'WALL-INNER':DefaultColours.SLIVER,
  'FLOOR':DefaultColours.CLOUD,
  'PLAYER':DefaultColours.SUNFLOWER,
  'ENEMY-GENERIC':DefaultColours.PURPLE,
  'ENEMY-PATROL':DefaultColours.DARKPURPLE,
  'TIMER':DefaultColours.RUBY,
  'CIRCLES':DefaultColours.CLOUD
}

var DarkTheme = {
  'WALL':DefaultColours.CARROT,
  'WALL-INNER':DefaultColours.PUMPKIN,
  'FLOOR':DefaultColours.MIDNIGHT,
  'PLAYER':DefaultColours.CLOUD,
  'PLAYER-WIN':DefaultColours.TURQUIOSE,
  'ENEMY-GENERIC':DefaultColours.PURPLE,
  'ENEMY-PATROL':DefaultColours.DARKPURPLE,
  'ENEMY-MULTI':DefaultColours.DARKPURPLE,
  'TIMER':DefaultColours.RUBY,
  'CIRCLES':DefaultColours.CARROT
}
