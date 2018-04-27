
class Colour {

  constructor(r = 255,g = 255,b = 255,a = 1.0){
    this.r = r;
    this.g = g;
    this.b = b;
    this.a = a;
  }

  getR(){
    return this.r;
  }

  getG(){
    return this.g;
  }

  getB(){
    return this.b;
  }

  getA(){
    return this.a;
  }

  setR(r){
    this.r = r;
  }

  setG(g){
    this.g = g;
  }

  setB(b){
    this.b = b;
  }

  setA(a){
    this.a = a;
  }

  getHexComponent(v){
    return
  }

  getHex(){
    // return "#" + (Utility.Map(this.a,0,1,0,255) << 8).toString(16) + ((Math.floor(this.r) << 16) + (Math.floor(this.g) << 8) + Math.floor(this.b)).toString(16).slice(1);
    return "#" + ((Math.floor(this.r) << 16) + (Math.floor(this.g) << 8) + Math.floor(this.b)).toString(16).slice(1);
  }

  getRGBA(){
    return 'rgba('+Math.floor(this.r)+','+Math.floor(this.g)+','+Math.floor(this.b)+','+this.a+')';
  }

  random(min = 0,max = 255){
      this.r = Math.floor(Utility.Random(min,max));
      this.g = Math.floor(Utility.Random(min,max));
      this.b = Math.floor(Utility.Random(min,max));
    return this;
  }

  randomR(min = 0,max = 255){
      this.r = Math.floor(Utility.Random(min,max));
      this.g = 0;
      this.b = 0;
    return this;
  }

  randomG(min = 0,max = 255){
      this.r = 0;
      this.g = Math.floor(Utility.Random(min,max));
      this.b = 0;
    return this;
  }

  randomB(min = 0,max = 255){
      this.r = 0;
      this.g = 0;
      this.b = Math.floor(Utility.Random(min,max));
    return this;
  }

  randomA(min = 0,max = 255){
      this.a = Math.floor(Utility.Random(min,max));
    return this;
  }

  randomRGB(r,g,b){
    this.r = (r ? Math.floor(Utility.Random(0,255)) : 0);
    this.g = (g ? Math.floor(Utility.Random(0,255)) : 0);
    this.b = (b ? Math.floor(Utility.Random(0,255)) : 0);
    return this
  }

  randomRGBLock(min = 0,max = 255,r,g,b){
    let c = Math.floor(Utility.Random(min,max));
    this.r = (r ? c : 0);
    this.g = (g ? c : 0);
    this.b = (b ? c : 0);
    return this
  }

  randomGrey(min = 0,max = 255){
      let grey = Math.floor(Utility.Random(min,max))
      this.r = grey;
      this.g = grey;
      this.b = grey;
    return this;
  }

  setColour(colour){
    this.r = colour.r;
    this.g = colour.g;
    this.b = colour.b;
    this.a = colour.a || 1.0;
    return this;
  }

  setRGBA(r,g,b,a){
    this.r = r || 255;
    this.g = g || 255;
    this.b = b || 255;
    this.a = a || 1.0;
  }

  setDefault(def = DefaultColours.ASPHALT){
    this.setHex(def + "FF");
  }

  // setHex(hex = "#ffffff"){
  //   this.r = hex.substring(1,3) || 255;
  //   this.g = hex.substring(3,5) || 255;
  //   this.b = hex.substring(5,7) || 255;
  //   this.a = 1.0;
  // }

  setHex(hex){
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

    if(result.length === 0 || result === null) return this;

    this.r = parseInt(result[1], 16) || 0;
    this.g = parseInt(result[2], 16) || 0;
    this.b = parseInt(result[3], 16) || 0;
    return this;
  }

}

class PulseColour {

  constructor(base){

    this.base = base;

    this.cr = 0;

    this.cg = 0;

    this.cb = 0;

    this.minr = 0;
    this.maxr = 255;

    this.ming = 0;
    this.maxg = 255;

    this.minb = 0;
    this.maxb = 255;

  }

  setR(min = 0, max = 255){
    this.minr = min;
    this.maxr = max;
  }

  setG(min = 0, max = 255){
    this.ming = min;
    this.maxg = max;
  }

  setB(min = 0, max = 255){
    this.minb = min;
    this.maxb = max;
  }

  step(inc = 0.01){

    this.cr+=inc;
    this.cg+=inc;
    this.cb+=inc;

    if(this.cr >= 2*Math.PI) this.cr = 0;
    if(this.cb >= 2*Math.PI) this.cg = 0;
    if(this.cg >= 2*Math.PI) this.cb = 0;

    this.base.r = Utility.Map(Math.sin(this.cr)  ,-1,1,this.minr,this.maxr);
    this.base.g = Utility.Map(Math.sin(this.cg*2),-1,1,this.ming,this.maxg);
    this.base.b = Utility.Map(Math.sin(this.cb*4),-1,1,this.minb,this.maxb);

  }

  getColour(){
    return this.base;
  }

}
