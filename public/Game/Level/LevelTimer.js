class LevelTimer {

  constructor(duration,direction = -1,renderable){

    this.direction = direction;

    // time timer should tick for
    this.duration = duration;

    // time timer was created at
    this.startTime = Date.now();

    // time timer should end (DEPRECIATED)
    this.endTime = Date.now() + duration;

    // time string for rendering time
    this.timeString = "00:00:00:0000";

    this.timeHour = "00";
    this.timeMinute = "00";
    this.timeSecond = "00";
    this.timeMillis = "0000";

    // time string for time out rendering
    this.defaultString = "00:00:00:0000";

    // time accumulated during a pause state
    this.pauseTime = -1;

    // RENDER PARAMS

    // this.margin = 50;
    // this.shadowOffset = 10;
    // this.fontSize = 100;
    // this.charSize = 80;

    // boolean to track if game paused or not
    this.paused = false;

    // size of timer?
    // this.size = new SAT.Vector(size.x || 0 ,size.y || 0);

    // renders within the class
    this.renderable = renderable || false;

    // position
    // this.pos = new SAT.Vector(pos.x,pos.y);

  }

  getHour(){
    return this.timeHour;
  }

  getMinute(){
    return this.timeMinute;
  }

  getSecond(){
    return this.timeSecond;
  }

  getMillis(){
    return this.timeMillis;
  }

  pauseTimer(){
    this.pauseTime = Date.now();
    this.paused = true;
  }

  unpauseTimer(){
    this.duration = this.duration + (Date.now() - this.pauseTime);
    this.pauseTime = 0;
    this.paused = false;
  }

  update(deltaTime){

    if(!this.paused){
      this.getFormatTime();
    }

  }

  draw(camera){}

  getPercentageComplete(){
    return (this.isEnded() ? 1 : (1.0 / this.duration) * (Date.now() - this.startTime) );
  }

  getFormatTime(){

    let time = new Date(this.startTime - Date.now() + this.duration);

    this.timeMinute = (time.getMinutes()  > 9 ? time.getMinutes() : "0" + time.getMinutes());
    this.timeSecond = (time.getSeconds()  > 9 ? time.getSeconds() : "0" + time.getSeconds());
    this.timeMillis = (time.getMilliseconds() > 99 ? "0" + time.getMilliseconds() : time.getMilliseconds() > 9 ? "00" + time.getMilliseconds() : "000" + time.getMilliseconds());

    // this.timeString = hour + ":" + min + ":" + sec;
    this.timeString =  this.timeMinute + ":" + this.timeSecond + ":" + this.timeMillis;

    return this.timeString;

  }

  // this multiplies by direction to ensure that the >= will
  // always hold.
  isEnded(){
    // return Date.now() >= this.endTime + this.pauseTime;
    return Date.now() - this.startTime >= this.duration;
  }

}
