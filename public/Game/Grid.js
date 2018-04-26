
class Grid {

  constructor(x,y,gs){

    this.levelSize = new SAT.Vector(x/gs,y/gs);

    this.levelSizeAbsolute = new SAT.Vector(x,y);

    this.gridSize = gs;

    ////////////////////////

    this.EMPTY = 1
    this.WALL  = 0
    this.MARGIN = 10;

    // size of margin surrounding wall
    this.marginSize = 2;

    this.pathMesh = []
    this.pathMeshInverted = [];

    // path mesh of non obstacle positions
    this.pathMeshFree = {};

    // building obstacle grid for internal operations
    for(var y = 0 ; y < this.levelSize.y ; y++){
      let row = [];
      for(var x = 0 ; x < this.levelSize.x ; x++){
        row.push(this.EMPTY);
        this.pathMeshFree[this.hashCode(x,y)] = {'x':x,'y':y};
      }
      this.pathMesh.push(row);
    }


    // building obstacle grid for a star search library
    for(var x = 0 ; x < this.levelSize.x ; x++){
      let row = [];
      for(var y = 0 ; y < this.levelSize.y ; y++){
        row.push(this.EMPTY);
      }
      this.pathMeshInverted.push(row);
    }



    // this is the object that will hold the aStar search area
    this.graph = []

    // this array will return the path
    this.result = [];

    // line of sight boolean to cancel once obstacle found (optimisation)
    this.lineOfSightComplete = false;

    // Debug
    this.lineofsight = [];

    // draw grid switch boolean
    this.drawDebugGrid = false;

    // checking input for render options
    input.setCallBack(InputKeys.DEBUG_GRID,'griddebugon',(function(){
      this.toggleDrawDebugGrid();
    }).bind(this));


  }

  // position hash
  hashCode(x,y){
    return (((x & 0xff) << 16) + (y & 0xff));
  }

  // recreating graph array to fresh search area.
  rebuildMesh(){
    this.graph = new Graph(this.pathMeshInverted,{ diagonal: true });
  }

  // this method will parse a non-grid normalised vector to a grid-normalised vector by rounding to a grid unit then dividing to that grid unit
  getGridVector(pos){
    return new SAT.Vector((Utility.roundTo(pos.x,this.gridSize)/this.gridSize),(Utility.roundTo(pos.y,this.gridSize)/this.gridSize));
  }

  // this will return false if the position exceeds the search grid
  checkGraphBound(position){
    if(typeof this.pathMesh[position.y] !== 'undefined'){
      if(typeof this.pathMesh[position.y][position.x] !== 'undefined'){
        return true;
      }
    }
    return false;
  }

  // for checking if normalised position is wall
  isWall(position){
    if(this.isOutsideBoundsGrid(position)) return true;
    return this.pathMesh[position.y][position.x] === this.WALL
  }

  isEmpty(position){
    return this.pathMesh[position.y][position.x] === this.EMPTY
  }

    // this method will query the obstacle grid to determine if that position is
  // an obstacle or not
  isObstacle(position){

    if(this.isOutsideBoundsGrid(position)) return true;

    // return this.graph.grid[position.y][position.x].closed === true;
    return this.pathMesh[position.y][position.x] !== this.EMPTY
  }

  // converts the grid array at position.x/.y to an obstacle.
  addObstacle(position,weight = 0){

    if(!this.checkGraphBound(position)){
      return;
     }

    if(this.pathMesh[position.y][position.x] !== this.WALL || weight === this.WALL){
      // this.graph.grid[position.y][position.x].closed = true;
      this.pathMesh[position.y][position.x] = weight;

      // deleting object reference in free position collection
      delete this.pathMeshFree[this.hashCode(position.x,position.y)];

      // temp object designed for astar library
      this.pathMeshInverted[position.x][position.y] = weight;
     }
  }

  // this adds virtual obstacles to the a* map using wall dimensions as discrete obstacles
  addObstacles(x,y,w,h){

    var margin = 4;

    // iterating across wall dimensions to add obstacles to path finding grid
    for(var obly = -this.marginSize + y ; obly < y + h + this.marginSize ; obly++)
      for(var oblx = -this.marginSize + x ; oblx < x + w + this.marginSize ; oblx++){
        if(oblx >= x && oblx < x + w && obly >= y && obly < y + h){
          this.addObstacle(new SAT.Vector(oblx,obly),this.WALL);
        } else {

          // if(Math.abs(obly-y-(obly>y+h?h:0)) > 4 || Math.abs(oblx-x-(oblx>x+w?w:0)) > 4){
          //   console.log("Nothing")
          // }
          //
          // // normalising the wall position to 0 on the x axis, deriving a number between the margin and 0,
          // // a ternary accounting for the positions at x + width, and after abs'ing the value we map between 0,
          // // and the margin as a obstacle value of margin to margin * marginSize
          // let xMargin = Utility.Map(Math.abs(oblx-x-(oblx>x+w?w:0)),0,this.marginSize,this.MARGIN,this.MARGIN*this.marginSize)
          // let yMargin = Utility.Map(Math.abs(obly-y-(obly>y+h?h:0)),0,this.marginSize,this.MARGIN,this.MARGIN*this.marginSize)
          //
          // let finalMargin = Math.sqrt(Math.pow(xMargin,2) + Math.pow(yMargin,2))

          // this.addObstacle(new SAT.Vector(oblx,obly),finalMargin);

          // hard margin
          this.addObstacle(new SAT.Vector(oblx,obly),this.MARGIN);

        }
      }
  }

  addDeadSpace(x,y,w,h){

    for(let yc = y ; yc < y+h ; yc++)
      for(let xc = x ; xc < x+w ; xc++)
        this.addObstacle(new SAT.Vector(xc,yc),this.WALL);

  }

  // this method will take a non grid vector and determine if it
  // sit in a grid normalised obstacle position
  isObstacleNonGrid(position){
    this.isObstacle(this.getGridVector(position));
  }

  // this method will take two nongrid positions and determine if they are
  // within the same grid position
  isAtMapPosition(p1,p2){
    return this.getGridVector(p1).x === this.getGridVector(p2).x &&
           this.getGridVector(p1).y === this.getGridVector(p2).y;
  }

  // this method will take two grid positions and determine if they are
  // identical
  isAtGridPosition(p1,p2){
    return p1.x === p2.x && p1.y === p2.y;
  }

  // returning full search path
  getPath(){
    return this.result;
  }

  // returns a random grid cell from the map
  getRandomGridPosition(){
    // get random position
    return {
      x:Utility.RandomInt(0,this.pathMesh[0].length-1),
      y:Utility.RandomInt(0,this.pathMesh.length-1)
    }
  }

  // returns a random NON-OBSTACLE grid cell from the map
  getRandomNonObstacleGridPosition(startPos){

    // fetching a random position from the grid
    let pos = this.getRandomGridPosition();

    let c = 1;

    // looping until a position is found that isnt an obstacle
    while(this.isObstacle(pos)){
      // console.log("Random Non-Obs Attempt: ",c);
      c++;
      // updating position variable to new position
      pos = this.getRandomGridPosition();
    }

    return pos;
  }

  // returning a random non-obstacle position that can be routed to
  // as wander logic will break if outside of map bounds
  getRoutableRandomNonObstacleGridPosition(start){

      let p = this.getRandomNonObstacleGridPosition();

      let _start = this.getGridVector(start);

      let s = this.searchGrid(_start,p);

      let c = 1;

      while(s.length === 0 || s === null || typeof s === 'undefined'){
        // console.log("Route Attempt: ",c);
        c++;
        p = this.getRandomNonObstacleGridPosition();
        s = this.searchGrid(_start,p);

      }

      return p;

  }

  // this method simply wraps the get random non obstacle method except it
  // returns a position which is scaled to the map size rather then a grid cell
  getRandomNonObstacleMapPosition(){

    let p = this.getRandomNonObstacleGridPosition();

    // returning a map normalised position in the center of the selected grid cell
    return new SAT.Vector((p.x*this.gridSize) + (this.gridSize/2),(p.y*this.gridSize) + (this.gridSize/2))
  }


  getRoutableRandomNonObstacleMapPosition(start){

    let p = this.getRoutableRandomNonObstacleGridPosition(start);

    return new SAT.Vector((p.x*this.gridSize) + (this.gridSize/2),(p.y*this.gridSize) + (this.gridSize/2))

  }

  // SEARCHING METHODS

  // performing a star search on grid using non grid normalised positions,
  // therefore a preprocessing step requires the map positions to be normalised
  searchMap(start,end){
    // normalising start and end positions to grid prior to searching grid
    return this.searchGrid(this.getGridVector(start),this.getGridVector(end));

  }

  // performing a star search on grid using grid normalised positions
  searchGrid(start,end){

    if(!this.checkGraphBound(start)) return;

    if(!this.checkGraphBound(end)) return;

    this.start  = this.graph.grid[start.x][start.y];
    this.end    = this.graph.grid[end.x][end.y];

    this.result = astar.search(this.graph, this.start, this.end, { heuristic: astar.heuristics.diagonal });

    return this.result;

  }

  // from and to are assumed to be non normalised
  requestSearchPath(from,to){

    let path = this.searchMap(from,to);

    return this.simplifyPath(path);
  }


  // this algorithm will take a path and convert it to a series of pivotal positions
  // removing all intermediate details from the path
  simplifyPath(path){

    let primary = null;
    let secondary = null;

    let dir = null;

    let pdir = null;

    // let output = []


    // creating iterable path (saving on graph searching)
    let output = new Patrol();


    if(typeof path === 'undefined' || path.length === 0){
      return output;
    }

    if(path.length === 1){
      output.addPoint(this.centerCellMap(path[0]));
      return output;
    }

    for(var point = 0 ; point < path.length-1 ; point++){

      primary = path[point];
      secondary = path[point+1];

      if(point === 0){

        dir = this.cartesianDirection(primary,secondary);

        // output.push(this.centerCellMap(primary));

        output.addPoint(this.centerCellMap(primary));

      } else {

        pdir = dir;
        dir = this.cartesianDirection(primary,secondary);

        if(pdir !== dir){
          output.addPoint(this.centerCellMap(primary));

          // output.push(this.centerCellMap(primary));
        }
      }
    }

    // output.push(this.centerCellMap(path[path.length-1]));

    output.addPoint(this.centerCellMap(path[path.length-1]));

    // console.log(path.length + " => " + output.length)

    return output;

  }

  // taking grid vector and converting to map position
  // centering to middle of cell rather then top corner
  centerCellMap(v1){
    return new SAT.Vector((v1.x*this.gridSize) + this.gridSize/2,(v1.y*this.gridSize) + this.gridSize/2)
  }

  // determining cartesian direction from two points (UP, DOWN, LEFT, RIGHT, DIAGONALS)
  cartesianDirection(v1,v2){

    let dx = Math.sign(v1.x - v2.x);
    let dy = Math.sign(v1.y - v2.y);

    let dirx = null;
    let diry = null;

    if((dx === 0 && dy === 0) || (dx === -0 && dy === -0)) return "NONE"

    // right move
    if(dx === -1){
      dirx = "RIGHT"
    // left move
    } else if(dx === 1){
      dirx = "LEFT"
    }

    // down move
    if(dy === -1){
      diry = "DOWN"
    } else {
      diry = "UP"
    }

    if(dirx === null && diry !== null ) return diry;

    if(dirx !== null && diry === null ) return dirx;

    return dirx+"_"+diry;

  }

  // Purpose of his function is to determine if the line between an
  // enemy and a player is obstructed by an obstacle on the grid.
  // A evolved version of bresenham's line cover algorithm to also add squares
  // that might have been overlooked, code taken from:
  // https://www.redblobgames.com/grids/line-drawing.html
  // the algorithm has been modified to detect obstacle potential
  lineOfSight(start,end,returnPath){

    // failed boolean
    let success = true;

    // calculating seperated delta of axis
    let dx = end.x-start.x
    let dy = end.y-start.y;

    // calculating absolute delta
    let nx = Math.abs(dx)
    let ny = Math.abs(dy);

    // calculating seperated sign of delta
    let sign_x = (dx > 0 ? 1 : -1)
    let sign_y = (dy > 0 ? 1 : -1)

    // creating new point
    let p = {x:start.x,y:start.y};

    returnPath.push({x:p.x,y:p.y,ok:true,success:false})

    // iterating until ix or iy < nx or ny
    for (var ix = 0, iy = 0; ix < nx || iy < ny;) {

        if ((0.5+ix) / nx == (0.5+iy) / ny) {

          // next step is diagonal
          // increment position to next cell by gradient value
          p.x += sign_x;
          p.y += sign_y;

          // increment x and y direction
          ix++;
          iy++;

        } else if ((0.5+ix) / nx < (0.5+iy) / ny) {

            // next step is horizontal
            p.x += sign_x;
            // increment only horizontal direction
            ix++;

        } else {

            // next step is vertical
            p.y += sign_y;
            // increment only horizontal direction
            iy++;

        }

        returnPath.push({x:p.x,y:p.y,ok:true,success:false})

        // after new position has been calculated check if position lays on
        // obstacle position, if true, the method will return false denoting
        // no line of sight
        if(this.isWall(p)){
          returnPath[returnPath.length-1].ok = false;
          if(!this.lineOfSightComplete) return returnPath;
          success = false;
        }

      }


      // return true as no obstacle has been found yet or false for
      // the opposite, for debugging purposes, the algorithm is allowed to continue
      // till it reaches the end point to build a full render

      if(success){
        returnPath[0].success = true;
        return returnPath
      } else {
        // if another search has passed this test,
        // then nullifying that success would be an error
        if(returnPath[0].success !== true)
          returnPath[0].success = false;
        return returnPath
      }

  }

  // this method will check if a given position is in a non-routable (out of bounds) position
  isOutsideBounds(pos){
    // getting grid vector from position;
    let p = this.getGridVector(pos);
    return (p.x < 0 || p.x > this.levelSize.x || p.y < 0 || p.y > this.levelSize.y)
  }

  // as above but assumes a normalsied vector
  isOutsideBoundsGrid(p){
    return (p.x < 0 || p.x > this.levelSize.x-1 || p.y < 0 || p.y > this.levelSize.y-1)
  }



  // UPDATE AND DRAW METHODS

  update(){

    this.lineofsight = []

  }

  toggleDrawDebugGrid(){
    this.drawDebugGrid ^= true;
  }

  draw(camera){

    this.drawGrid(camera);
    // this.drawSearchGrid(camera);

  }

  drawSearchGrid(camera){

    if(!this.drawDebugGrid) return;

    for(var x = 0 ; x < this.pathMeshInverted.length ; x++){
      for(var y = 0 ; y < this.pathMeshInverted[x].length ; y++){
        // calculated offset position taking camera offset into consideration
        let offsetPos = new SAT.Vector(-camera.x + (x*this.gridSize),-camera.y + (y*this.gridSize));

        // ignore drawing any squares that fall off screen
        if((offsetPos.x < 0 || offsetPos.x > CW) || (offsetPos.y < 0 || offsetPos.y > CH)){
          continue;
        }

        if(this.pathMeshInverted[x][y] === this.WALL){
          Draw.stroke(0.5,"#FF0000");
        if(this.pathMeshInverted[x][y] === this.MARGIN)
          Draw.stroke(0.5,"#000000");
        } else {
          Draw.stroke(0.5,"#000000");
        }
        Draw.rectOutline(offsetPos.x,offsetPos.y,this.gridSize,this.gridSize);

        Draw.fillCol(new Colour(0))
        Draw.text(9,"mono","right",new SAT.Vector(offsetPos.x+(this.gridSize/2),offsetPos.y+(this.gridSize/2)),x);
        Draw.text(9,"mono","right",new SAT.Vector(offsetPos.x+(this.gridSize/2),offsetPos.y+(this.gridSize/2)+9),y);


      }
    }

  }

  drawGrid(camera){


    if(!this.drawDebugGrid) return;

    for(var y = 0 ; y < this.pathMesh.length ; y++){
      for(var x = 0 ; x < this.pathMesh[y].length ; x++){
        // calculated offset position taking camera offset into consideration
        let offsetPos = new SAT.Vector(-camera.x + (x*this.gridSize),-camera.y + (y*this.gridSize));

        // ignore drawing any squares that fall off screen
        if((offsetPos.x < 0 || offsetPos.x > CW-this.gridSize) || (offsetPos.y < 0 || offsetPos.y > CH-this.gridSize /* || this.pathMesh[y][x] === this.EMPTY */)){
          continue;
        }

        if(this.pathMesh[y][x] === this.WALL){

          Draw.fillCol(new Colour(255,0,0,0.5));

        } else if(this.pathMesh[y][x] === this.EMPTY) {

          Draw.fillCol(new Colour(0,0,Utility.RandomInt(200,255),0.5));

        } else if(this.pathMesh[y][x] === this.MARGIN){

          // let max = Math.sqrt(Math.pow(this.MARGIN*this.marginSize,2) + Math.pow(this.MARGIN*this.marginSize,2))
          // Draw.fillCol(new Colour(255,Utility.Map(this.pathMesh[y][x],max,0,255),0,0.7));

          Draw.fillCol(new Colour(255,Utility.RandomInt(200,255),0,0.7));

        }


        // Draw.fillCol(new Colour(200,Utility.Map(this.pathMesh[y][x],0,this.EMPTY,0,255),Utility.Map(this.pathMesh[y][x],0,this.EMPTY,0,255),0.5));

        Draw.rect(offsetPos.x,offsetPos.y,this.gridSize,this.gridSize);
        // Draw.fillCol(new Colour(0))

        // Draw.text(9,"mono","right",new SAT.Vector(offsetPos.x+(this.gridSize/2),offsetPos.y+(this.gridSize/2)),x);
        // Draw.text(9,"mono","right",new SAT.Vector(offsetPos.x+(this.gridSize/2),offsetPos.y+(this.gridSize/2)+9),y);

      }
    }

  }

}
