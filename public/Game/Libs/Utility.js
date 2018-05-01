class Utility {

  // returns current time in seconds
  static Now(){
    let d = new Date();
    return d.getSeconds();
  }

  static pow(val){
    return val*val
  }

  static pyth(x,y){
    return Math.sqrt( (x*x) + (y*y) );
  }

  static Map(value,oldmin,oldmax,newmin,newmax){
    return (((value - oldmin) * (newmax - newmin)) / (oldmax - oldmin)) + newmin;
  }

  static Gradient(iteration,max,f1,f2,f3,p1,p2,p3,center,offset){
    return new Colour(
      Math.sin(f1*Utility.Map(iteration,0,max,0,32) + p1) * center + offset,
      Math.sin(f2*Utility.Map(iteration,0,max,0,32) + p2) * center + offset,
      Math.sin(f3*Utility.Map(iteration,0,max,0,32) + p3) * center + offset
    );
  }

  static GradientCos(iteration,max,f1,f2,f3,p1,p2,p3,center,offset){
    return new Colour(
      Math.cos(f1*Utility.Map(iteration,0,max,0,32) + p1) * center + offset,
      Math.cos(f2*Utility.Map(iteration,0,max,0,32) + p2) * center + offset,
      Math.cos(f3*Utility.Map(iteration,0,max,0,32) + p3) * center + offset
    );
  }

  static GradientTan(iteration,max,f1,f2,f3,p1,p2,p3,center,offset){
    return new Colour(
      Math.tan(f1*Utility.Map(iteration,0,max,0,32) + p1) * center + offset,
      Math.tan(f2*Utility.Map(iteration,0,max,0,32) + p2) * center + offset,
      Math.tan(f3*Utility.Map(iteration,0,max,0,32) + p3) * center + offset
    );
  }

  static shortestAngleDifference(a,b){
    return ( ( a-b )  + 180 ) % 360 - 180 ; 
  }

  static signPolarAngleDifference(a,b){
    return (a - b >= 0 && a - b < 180) || ( a - b <= -180 && a - b >= -360 ) ? 1 : -1;
  }

  static signedPolarAngleDifference(a,b){
    let s = (a - b >= 0 && a - b < 180) || ( a - b <= -180 && a - b >= -360 ) ? 1 : -1;
    return s * Utility.polarAngleDifference(a,b)
  }

  static polarAngleDifference(a,b){
    let phi = Math.abs(b-a) % 360;
    return phi > 180 ? 360 - phi : phi;
  }

  // this will return a number representing the quadrant of a circle
  // with degrees
  static circularQuadrantDegree(angle){
    return Utility.circularQuadrant(Utility.Radians(angle));
  }

  // this will return a number representing the quadrant of a circle
  // 0->90 being 1, 90->180 being 2, 180->270 being 3 and 270->360 being 4
  static circularQuadrant(angle){

    // returning remainder if greater than 360
    if(angle > Math.PI*2){
      angle = angle % Math.PI*2;
    }

    if(Math.PI/2 > angle && angle >= 0){
      return 1;
    }

    if(Math.PI > angle && angle >= Math.PI/2){
      return 2;
    }

    if(Math.PI*3/2 > angle && angle >= Math.PI){
      return 3;
    }

    if(Math.PI*2 > angle && angle >= Math.PI*3/2){
      return 4;
    }

  }


  static normaliseDegrees(angle){
    return (angle % 360) < 0 ? (angle % 360) + 360 : (angle % 360)
  }

  static normaliseRadians(angle){
    return (angle % (2*Math.PI) ) < 0 ? (angle % (2*Math.PI) ) + (2*Math.PI) : (angle % (2*Math.PI) )
  }

  // returns a random float between @min and @max
  static Random(min,max){
    return Math.random() * (max - min) + min;
  }

  // returns a random int between @min and @max
  static RandomInt(min,max){
    return Math.floor(Math.random() * (max - min) + min);
  }

  // converts @radian to degrees
  static Degrees(radian){
    return radian*180.0/Math.PI;
  }

  // converts @degree to radians
  static Radians(degree){
    return degree*Math.PI/180;
  }

  // takes two vectors (@v1, @v2) and calculates the angle between them
  static VectorAngle(v1,v2){
    let d = Utility.Dot(v1,v2);
    let m = Utility.Mag(v1) * Utility.Mag(v2);
    return Utility.Degrees(Math.cos(d/m));
  }

  // takes two vectors (@v1,@v2) and calculates the dot product
  static Dot(v1,v2){
    return (v1.x*v2.x)+(v1.y*v2.y);
  }

  // takes a single vector (@v1) and calculates the magnitude
  static Mag(v1){
    return Math.sqrt((v1.x*v1.x)+(v1.y*v1.y));
  }

  // takes a vector @v and two ints @x and @y
  static Set(v,x,y){
    v.x = x;
    v.y = y;
    return v;
  }

  // takes two vectors (@v1,@v2) and calculates the angle between them
  static angle(v1,v2){
    return Math.atan2((v2.y-v1.y),(v2.x-v1.x));
  }

  static slope(v1,v2){
    return (v2.y-v1.y) / (v2.x-v1.x) ;
  }

  static pointsToVector(v1,v2){
    return new SAT.Vector(Math.abs(v1.x-v2.x),Math.abs(v1.y-v2.y));
  }

  // takes an index and a column count and calculates the column position
  static linColPosArr(index,cc){
    return (index%cc);
  }

  // takes an index and a column count and returns the row position
  static linRowPosArr(index,cc){
    return Math.floor(index/cc);
  }

  static dist(v1,v2){
    return Math.sqrt(Utility.pow(v2.x-v1.x)+Utility.pow(v2.y-v1.y));
  }

  static roundTo(value,round)
  {
    return Math.floor((value+1)/round)*round;
  }

  static vectorFromAngle(dir){
    return new SAT.Vector(Math.cos(Utility.Radians(dir)),Math.sin(Utility.Radians(dir)));
  }

  static isInsideSector(dir,p1,p2,sectorAngle,sectorRadius){

    // direction vector;
    let direction = Utility.vectorFromAngle(dir);
    let distance  = new SAT.Vector(p2.x-p1.x,p2.y-p1.y);

    // magnitude
    let mDirection = Utility.Mag(direction);
    let mDistance  = Utility.Mag(distance);

    // if second point is too far from origin of sector
    if(mDistance > sectorRadius) return false;

    // calculate angle between player and enemy vector
    let angleBetween = Math.acos(
      Utility.Dot(direction,distance) / (mDistance*mDirection)
    );

    // if angle is greater half the sector angle it is outside
    if(Math.abs(angleBetween) > Utility.Radians(sectorAngle/2)) return false;

    // return true as sector is intersected
    return true;

  }


}


class Draw {

  static checkGame(){
    return (game !== null);
  }

  static clear(x,y,w,h){
    if(Draw.checkGame()){
      game.ctx.clearRect(x,y,w,h);
    }
  }

  static gameText(
    text,sizeMax,repMax,offsetX = 0,offsetY = 0,shudder = 3,offsetMagnitude = 10,highlightFront = false,followMouse = false,rollingOffset = 0,
    f1=0.3,f2=0.3,f3=0.3,p1=0,p2=2,p3=4,center=127,width=127,font='crt'){

    // let offsetMagnitude = 10;

    for(var i = 0 ; i < repMax ; i++){

      if(i === repMax-1 && highlightFront){
        Draw.fill(255,255,255);
      } else {
        Draw.fillCol(Utility.Gradient(i,repMax,f1,f2,f3,p1,p2,p3,center,width));
      }

      Draw.text(
        Utility.Map(i,0,repMax,0,sizeMax),
        font,
        "center",
        new SAT.Vector(
          Math.cos(Utility.Radians(i+rollingOffset))*offsetMagnitude+Utility.Random(-shudder,shudder)-(offsetX*i)+(Utility.Map(i,0,repMax,(followMouse ? input.mouse.x : CW/2),CW/2)),
          Math.sin(Utility.Radians(i+rollingOffset))*offsetMagnitude+Utility.Random(-shudder,shudder)+(offsetY*i)+(Utility.Map(i,0,repMax,(followMouse ? input.mouse.y : CH/2),CH/2))
        ),
        text
      );

    }

  }

  static polygonQuadNorm(w, h,angle){
    return Draw.polygonQuad(0,0,w,h,angle);
  }


  // TODO: Calculate correct offset width and height from those angles
  static polygonQuad(x, y, w, h,angle) {

    // create point array
    var points = [];

    // long vs short side ratio
    var ratio  = (w > h ? w/h : h/w);

    var width  = ((360.0 / (ratio + 1.0)) * ratio)/4.0;
    var height = (360.0 / (ratio + 1.0))/4.0;

    points.push(new SAT.Vector(
      w*Math.cos(Utility.Radians(-width)+Utility.Radians(angle))+x,
      w*Math.sin(Utility.Radians(-width)+Utility.Radians(angle))+y
    ));

    points.push(new SAT.Vector(
      w*Math.cos(Utility.Radians(width)+Utility.Radians(angle))+x,
      w*Math.sin(Utility.Radians(width)+Utility.Radians(angle))+y
    ));

    points.push(new SAT.Vector(
      w*Math.cos(Utility.Radians(180-width)+Utility.Radians(angle))+x,
      w*Math.sin(Utility.Radians(180-width)+Utility.Radians(angle))+y
    ));

    points.push(new SAT.Vector(
      w*Math.cos(Utility.Radians(180+width)+Utility.Radians(angle))+x,
      w*Math.sin(Utility.Radians(180+width)+Utility.Radians(angle))+y
    ));

    return points;

  }

  static normalisedAARect(w,h){
    return Draw.axisAlignedRect(0,0,w,h)
  }

  static axisAlignedRect(x,y,w,h){

    var points = [];

    points.push(new SAT.Vector(x,y));
    points.push(new SAT.Vector(x+w,y));
    points.push(new SAT.Vector(x+w,y+h));
    points.push(new SAT.Vector(x,y+h));

    return points;

  }

  static polygonPoints(x, y, radius, sides,angle) {

    // check if polygon is possible
    if (sides < 3) return;

    // create point array
    var points = [];

    // calculate inner angle of vertex (2PI divided into side count)
    var a = ((Math.PI * 2)/sides);

    // iterating over side count
    for (var i = 0; i < sides; i++) {
      // calculating x and y points at ofset for polygon
      points.push({x:radius*Math.cos((a*i)+Utility.Radians(angle))+x,y:radius*Math.sin((a*i)+Utility.Radians(angle))+y});
    }

    return points;

  }


  // Drawing Polygon from points with undefined fill style
  static polygonOutline(points){
    if(Draw.checkGame()){
      for(var i = 0 ; i < points.length-1 ; i++){
        Draw.line(points[i].x,points[i].y,points[i+1].x,points[i+1].y,2);
      }
      Draw.line(points[points.length-1].x,points[points.length-1].y,points[0].x,points[0].y,2);
    }
  }

  // Drawing Polygon from points with undefined fill style
  static polygon(points){
    if(Draw.checkGame()){
      game.ctx.beginPath();
      game.ctx.moveTo(points[0].x,points[0].y);
      for(var i = 1 ; i < points.length ; i++){
        game.ctx.lineTo(points[i].x,points[i].y);
      }
      game.ctx.closePath();
      game.ctx.fill();
    }
  }

  static line(x1,y1,x2,y2,w,fill){
    if(Draw.checkGame()){
      game.ctx.beginPath();
      game.ctx.moveTo(x1,y1);
      game.ctx.lineWidth = w;
      game.ctx.lineTo(x2,y2);
      Draw.stroke(w,fill);
    }
  }

  static circle(x,y,r){
    if(Draw.checkGame()){
      // Draw.sector(x,y,r,0,360);
      game.ctx.beginPath();
      game.ctx.arc(x, y, r, 0, 2 * Math.PI, false);
      game.ctx.fill();
    }
  }

  static sector(x,y,r,s,f){
    if(Draw.checkGame()){
      game.ctx.beginPath();
      game.ctx.moveTo(x,y);
      game.ctx.arc(x, y, r, Utility.Radians(s), Utility.Radians(f), false);
      game.ctx.lineTo(x,y);
      game.ctx.fill();
    }
  }

  static circleOutline(x,y,r){
    if(Draw.checkGame()){
      game.ctx.beginPath();
      game.ctx.arc(x, y, r, 0, 2 * Math.PI, false);
      game.ctx.stroke()
    }
  }



  static rectOutline(x,y,w,h){
    if(Draw.checkGame()){
      game.ctx.strokeRect(x,y,w,h);
    }
  }

  static rect(x,y,w,h){
    if(Draw.checkGame()){
      game.ctx.fillRect(x,y,w,h);
    }
  }

  static strokeCol(w = 1,col){
    if(Draw.checkGame()){
      game.ctx.lineWidth = w;
      game.ctx.strokeStyle = 'rgba('+col.r+','+col.g+','+col.b+','+col.a+')';
      game.ctx.stroke();
    }
  }

  static stroke(w = 1,fill = "#000000"){
    if(Draw.checkGame()){
      game.ctx.lineWidth = w;
      game.ctx.strokeStyle = fill;
      game.ctx.stroke();
    }
  }

  static resetStroke(){
    if(Draw.checkGame()){
      game.ctx.lineWidth = 0;
      game.ctx.strokeStyle = "rgba(1, 1, 1, 0)";
    }
  }

  static image(i,x,y){
    if(Draw.checkGame()){
      game.ctx.drawImage(i,x,y);
    }
  }

  // this SO explains the logic https://stackoverflow.com/a/4200413
  static imageCrop(image, cropX, cropY, cropW, cropH, placeX, placeY, placeW, placeH){
    if(Draw.checkGame()){
      game.ctx.drawImage(image, cropX, cropY, cropW, cropH, placeX, placeY, placeW, placeH);
    }
  }

  static text(size = 40,font = "Ariel",align = "center",position = {x:0,y:0},body = "textbody",weight = 'normal'){
    if(Draw.checkGame()){
      game.ctx.textAlign = align;
      game.ctx.font = weight + ' ' + size + "px " + font;
      game.ctx.fillText(body,position.x,position.y);
    }
  }

  static fill(r,g,b,a = 1.0){
    if(Draw.checkGame()){
      game.ctx.fillStyle = 'rgba('+Math.floor(r)+','+Math.floor(g)+','+Math.floor(b)+','+a+')';
    }
  }

  static fillCol(col){
    if(Draw.checkGame()){
      game.ctx.fillStyle = col.getRGBA();
    }
  }

  static fillHex(hex = "#ffffff"){
    if(Draw.checkGame()){
      game.ctx.fillStyle = hex;
    }
  }



  static save(){
    if(Draw.checkGame()){
      game.ctx.save();
    }
  }

  static translate(x,y){
    if(Draw.checkGame()){
      game.ctx.translate(x,y);
    }
  }

  static restore(){
    if(Draw.checkGame()){
      game.ctx.restore();
    }
  }

  static rotate(angle){
    if(Draw.checkGame()){
      game.ctx.rotate(Utility.Radians(angle));
    }
  }

}
