class EngineSounds {

  constructor(readyCallback){

    this.sounds = {};

    this.isMute = false;

    this.ready = false;

    this.readyCallback = readyCallback;

  }

  getReady(){
    return this.ready;
  }

  setReady(ready){
    this.ready = ready;
  }

  mute(){
    this.isMute = true;
  }

  unmute(){
    this.isMute = false;
  }

  add(label,path,volume = 0.1,loop = false,autoplay = false){

    if(label === null || label === '' || typeof label === 'undefined') return -1;

    if(path === null || path === '' || typeof path === 'undefined') return -1;


    this.sounds[label] = {
      sound:new Howl({src:[path],loop:loop,autoplay:autoplay,volume:volume,callback:()=>this.addedCallback(label)}),
      ready:false
    }

  }

  forceReady(){
    this.readyCallback();
  }

  addedCallback(label){

    this.sounds[label].ready = true;

    let ready = false;

    for(let sound in this.sounds){
      ready = this.sounds[sound].ready;
      if(!ready) { break; }
    }

    if(ready) { this.readyCallback(); }
  }

  play(label,delay){

    if(label === null || label === '' || typeof label === 'undefined') return -1;

    if(this.sounds.hasOwnProperty(label)){
      if(!this.isMute){
        this.sounds[label].sound.play();
      }
    }

  }

  stop(label){
    if(label === null || label === '' || typeof label === 'undefined') return -1;

    if(this.sounds.hasOwnProperty(label)){
      this.sounds[label].sound.stop();
    }

  }

  stopAll(){
    for(let sound in this.sounds){
      this.sounds[sound].sound.stop();
    }
  }

}
