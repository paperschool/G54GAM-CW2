
class Level_Background {

  constructor(area){

    this.area = area;

    this.cells = [];

    for(var i = 0 ; i < 5 ; i++){
      let c = new Circle(Utility.RandomInt(0,this.area.x),Utility.RandomInt(0,this.area.y),Utility.RandomInt(600,1300));

      // c.setColour(new Colour(200,200,200,0.2));

      let col = new Colour();
      col.setHex(gameTheme['CIRCLES']);
      col.setA(0.1);

      c.setColour(col);

      this.cells.push(c)
    }

  }

  update(deltaTime){

    for(var i = 0 ; i < 5 ; i++){
      this.cells[i].getPos().x += Utility.RandomInt(-5,5);
      this.cells[i].getPos().y += Utility.RandomInt(-5,5);
    }

  }

  draw(camera){
    for(var i = 0 ; i < 5 ; i++){
      this.cells[i].draw(camera);
    }
  }

}
