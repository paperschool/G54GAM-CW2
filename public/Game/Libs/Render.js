


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
