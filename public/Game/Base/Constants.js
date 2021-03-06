
var Sizes = {
  MARGIN     : { id:"margin",    unit:50,  scalar:1 },
  PLAYER     : { id:"player",    unit:50,  scalar:1 },
  ENEMY      : { id:"enemy",     unit:30,  scalar:1 },
  ITEM       : { id:"item",      unit:30,  scalar:1 },
  TUNNEL     : { id:"tunnel",    unit:70,  scalar:1 },
  UNIT       : { id:"unit",      unit:400, scalar:1 },
  CORE_SMALL : { id:"small",     unit:400, scalar:1 },
  CORE_MEDIUM: { id:"medium",    unit:400, scalar:2 },
  CORE_LARGE : { id:"large",     unit:400, scalar:3 }
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
  EXITING:2,
  EXITED:3,
  TIMEOUT:4
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
  SNOW     :8,
  ION      :9,
  IONBURST :10
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

  CLICK_1:"simpleClick1",
  CLICK_2:"simpleClick2",
  CLICK_3:"simpleClick3",
  CLICK_4:"simpleClick4",
  CLICK_5:"simpleClick5",

  WIN_1:"winSound",
  WIN_2:"winSound2",

  MAIN_AMBIENT_1:"mainAmbient1",
  MAIN_AMBIENT_2:"mainAmbient2",
  MAIN_AMBIENT_3:"mainAmbient3"

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
