class Cursor {

  constructor(){
    this.pos = createVector(
      floor( mouseX / gridSize ) * gridSize,
      floor( mouseY / gridSize ) * gridSize
    )

    this.color = color(0, 255, 0);

  }

  get(){
    return this.pos;
  }

  getUnit(){
    return createVector(Math.round(this.pos.x/gridSize),Math.round(this.pos.y/gridSize));
  }

  offscreen() {
    return (mouseX < 0 || mouseX > width || mouseY < 0 || mouseY > height);
  }

  update(){

    this.pos.x = ( floor( mouseX / gridSize ) * gridSize ) + camera.x;
    this.pos.y = ( floor( mouseY / gridSize ) * gridSize ) + camera.y;

    if(activeTool === 0){
      if(grid.newWall != null){

        let ws = grid.newWall.startPos;
        let we = grid.newWall.endPos;

        if(grid.newWall.alignment() && !grid.newWall.single()){
          this.color = color(0,255,0);
        } else {
          this.color = color(255,0,0);
        }

      }
    }

  }

  draw(){

    fill(this.color)
    rect(
      this.pos.x-camera.x,
      this.pos.y-camera.y,
      gridSize,
      gridSize
    );


    // if(grid.newWall != null){
    //
    //   let ws = grid.newWall.startPos;
    //   let we = grid.newWall.endPos;
    //
    //   fill(255,255,0);
    //
    //   if(ws != null){
    //
    //     let offsetx = 0;
    //     let offsety = 0;
    //
    //     if(this.pos.x > width/2) offsetx = -100;
    //     if(this.pos.y < height/2) offsety = 40;
    //
    //     textSize(15);
    //     text("Start: " + Math.round(ws.x/gridSize) + ":" + Math.round(ws.y/gridSize), this.pos.x + offsetx,this.pos.y-20 + offsety);
    //     text("End  : " + Math.round(this.pos.x/gridSize) + ":"+ Math.round(this.pos.y/gridSize), this.pos.x + offsetx,this.pos.y + offsety);
    //
    //   }
    //
    // }

  }

}
