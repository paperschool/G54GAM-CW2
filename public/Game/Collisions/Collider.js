class Collider {

  constructor(){

    this.type = ColliderType.GENERIC;

    this.collider = null;

    this.response = new SAT.Response();

  }

  setPos(pos){
    this.collider.pos.set(pos)
  }

  getPos(){
    return this.collider.pos;
  }

}

class PolygonCollider extends Collider {

  constructor(x,y,points){
    super();

    this.type = ColliderType.POLYGON;

    this.collider = null;

    this.rebuild(x,y,points);

  }

  // a generic method for passing in other collision class objects and it will
  // figure out the appropriate test based on the class type
  test(object){
    switch(object.type){
      case ColliderType.GENERIC: return;
      case ColliderType.POINT  : return this.testPoint(object.collider);
      case ColliderType.CIRCLE : return this.testCircle(object.collider);
      case ColliderType.BOX    : return this.testBox(object.collider);
      case ColliderType.POLYGON: return this.testPolygon(object.collider);
    }
  }

  rebuild(x,y,points){
      this.collider = new SAT.Polygon(new SAT.Vector(x,y),points);
  }

  testPoint(){
    return SAT.pointToPolygon(point,this.collider);
  }

  testCircle(circle){
    this.response.clear();
    if(SAT.testPolygonCircle(this.collider,circle,this.response)){
      return this.response;
    } else {
      return false;
    }
  }

  testBox(box){
      return this.testBox(box.toPolygon());
  }

  testPolygon(polygon){
    this.response.clear();
    if(SAT.testPolygonPolygon(this.collider,polygon,this.response)){
      return this.response;
    } else {
      return null;
    }
  }
}

class CircularCollider extends Collider {

  constructor(x,y,r){
    super();

    this.type = ColliderType.CIRCLE;

    this.collider = null;

    this.rebuild(x,y,r);

  }

  // method for passing in other collision class objects
  test(object){
    switch(object.type){
      case ColliderType.GENERIC: return;
      case ColliderType.POINT  : return this.testPoint(object.collider);
      case ColliderType.CIRCLE : return this.testCircle(object.collider);
      case ColliderType.BOX    : return this.testBox(object.collider);
      case ColliderType.POLYGON: return this.testPolygon(object.collider);
    }
  }

  rebuild(x,y,r){
      this.collider = new SAT.Circle(new SAT.Vector(x,y),r);
  }

  testPoint(point){
    return SAT.pointInCircle(point,this.collider);
  }

  testCircle(circle){
    this.response.clear();
    if(SAT.testCircleCircle(circle,this.collider,this.response)){
      return this.response;
    } else {
      return null;
    }
  }

  testBox(box){
    return this.testBox(box.toPolygon());
  }

  testPolygon(polygon){
    this.response.clear();
    if(SAT.testCirclePolygon(this.collider,polygon,this.response)){
      return this.response;
    } else {
      return null
    }

  }

}
