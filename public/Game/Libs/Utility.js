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

  static polarVectorDegrees(origin,a,r){
    return Utility.polarVectorRadians(origin,Utility.Radians(a),r);
  }

  static polarVectorRadians(origin,a,r){
    return new SAT.Vector(
      (Math.cos(a) * r) + origin.x,
      (Math.sin(a) * r) + origin.y
    )
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

  // takes two vectors (@v1, @v2) and calculates the angle between them
  static VectorAngle(v1,v2){
    let d = Utility.Dot(v1,v2);
    let m = Utility.Mag(v1) * Utility.Mag(v2);
    return Utility.Degrees(Math.cos(d/m));
  }

  static angleDegrees(v1,v2){
    return Utility.Degrees(Utility.angle(v1,v2));
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
