
// tools, 0 === wall, 1 === player, 2 === enemy, 3 === pickup
let activeTool = 0;

let wallThickness = 1;

let overlayOpen = false;

var can;

var gridSize = 10;

var grid = null;

var cursor = null;

var refImg = null;

var imgGuide = null;

var camera = null;

var ToolTypes = {
  ERASE:-1,
  WALL:0,
  PLAYER:1,
  ENEMY:2,
  PICKUP:3,
  FLOOR:4,
  DEADSPACE:5
}

function windowResized(){
  resizeCanvas(innerWidth,innerHeight);
}

let toolPosition = null

$(document).ready(function(){

  // storing references to dom toolbar buttons
  let wall       = $('#wall-button');
  let player     = $('#player-button');
  let enemy      = $('#enemy-button');
  let pickup     = $('#pickup-button');
  let build      = $('#build-button');
  let load       = $('#load-button');
  let floor      = $('#floor-button');
  let erase      = $('#erase-button');
  let deadspace  = $('#deadspace-button');
  let reset      = $('#reset-button');

  //
  toolPosition = $('#tool-position');

  $('.canvas-container').on('click',function(){
    $('.submenu-container').empty();
  })

  wall.on('click',function(){
    activeTool = 0;
    clicked();
  });

  player.on('click',function(){
    activeTool = 1;
    clicked();
  });

  enemy.on('click',function(){
    activeTool = 2;
    clicked();
  });

  pickup.on('click',function(){
    activeTool = 3;
    clicked();

    let submenu = $('<div class="toolbar-submenu-container"></div>')
      .css({top:pickup.position().top+10+"px",left:80+"px",})

    let dropdown = $('<form action="#"><fieldset><select name="speed" id="speed"></select></form>');

    for(let pickup in PickupType){

      let option = $('<option id="pickup-option-'+pickup+'" >'+pickup+'</option>');

      option.find('#pickup-option-'+pickup).on('click',function(){
        console.log(" Option Clicked" + pickup);
      });

      dropdown.find('select').append(option);

    }

    submenu.append(dropdown);

    $('.submenu-container').append(submenu);

  });

  floor.on('click',function(){
    activeTool = 4;
    clicked();
  });

  deadspace.on('click',function(){
    activeTool = 5;
    clicked();
  });

  erase.on('click',function(){
    activeTool = -1;
    clicked();
  });

  // method that generates the json object for the level files
  build.on('click',function(){

    overlayOpen = true;

    let close = $('<div class="dialogue-close"></div>');

    let code = $('<div class="dialogue-content"><pre>'+JSON.stringify(grid.buildLevel(),null, 2)+'</pre></div>')

    let dialogue = $('<div class="overlay-dialogue"></div>');

    $('body').find('.overlay-dialogue').remove();

    $('body').append(dialogue);

    dialogue.append(close);
    dialogue.append(code);

    close.on('click',function(){
      dialogue.remove();
      overlayOpen = false;
    })

  });

  load.on('click',function(){

    overlayOpen = true;

    let close = $('<div class="dialogue-close"></div>');

    let content = $(
      '<div class="dialogue-input">' +
        '<form>' +
          '<input id="load-level-input" type="text" >' +
          '<input type="submit" value=" Load! ">' +
        '</form>' +
      '</div>'
    );

    content.find('form').on('submit',function(event){

      grid = new Grid();

      let levelJson = JSON.parse($('body').find('#load-level-input').val());

      grid.load(levelJson);

      // console.log(event);

      event.preventDefault();

    });

    let dialogue = $('<div class="overlay-dialogue"></div>');

    dialogue.append(close);
    dialogue.append(content);

    $('body').find('.overlay-dialogue').remove();
    $('body').append(dialogue);

    close.on('click',function(){
      dialogue.remove();
      overlayOpen = false;
    })

  })

  reset.on('click',function(){
    grid = new Grid();
  });


  function clicked(){
    $('.submenu-container').empty();
    erase.css({'background-color':(activeTool === -1 ? '#e74c3c' : '#f39c12')});
    wall.css({'background-color':(activeTool === 0 ? '#e74c3c' : '#f39c12')});
    player.css({'background-color':(activeTool === 1 ? '#e74c3c' : '#f39c12')});
    enemy.css({'background-color':(activeTool === 2 ? '#e74c3c' : '#f39c12')});
    pickup.css({'background-color':(activeTool === 3 ? '#e74c3c' : '#f39c12')});
    floor.css({'background-color':(activeTool === 4 ? '#e74c3c' : '#f39c12')});
  }

  clicked();

});

function preload(){
    refImg = loadImage('/leveldesigns/test-level.jpg');
}

function setup(){

  can = createCanvas(innerWidth,innerHeight);

  can.parent("editor_canvas")

  camera = new Camera(5);

  imgGuide = new ImageGuide(0,0,refImg);

  grid = new Grid();

  cursor = new Cursor();

}

function draw(){

  toolPosition.html(
    cursor.getUnit().x + ":" + cursor.getUnit().y
  );

  noStroke();
  background(51);

  imgGuide.update();
  cursor.update();
  grid.update();

  imgGuide.draw();
  grid.draw();
  cursor.draw();

}

class Camera {

  constructor(unit = 1){
    this.x = 0;
    this.y = 0;

    this.unit = gridSize * unit;
  }

  up(){
    this.y = this.y - this.unit < 0 ? this.y : this.y - this.unit;
  }

  down(){
    this.y += this.unit;
  }

  left(){
    this.x = this.x - this.unit < 0 ? this.x : this.x - this.unit;
  }

  right(){
    this.x += this.unit;
  }

}
