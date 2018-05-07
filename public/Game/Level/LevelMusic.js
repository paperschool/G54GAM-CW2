class LevelMusic {

  constructor(id = null){

    this.song = null;

    // if(id === null) id = Utility.RandomInt(1,4);

    // music
    // switch(id){
    //   case 1 : this.song = SoundLabel.MAIN_AMBIENT_1; break;
    //   case 2 : this.song = SoundLabel.MAIN_AMBIENT_2; break;
    //   case 3 : this.song = SoundLabel.MAIN_AMBIENT_3; break;
    //   default: this.song = SoundLabel.MAIN_AMBIENT_1; break;
    // }

    this.song = SoundLabel.MAIN_AMBIENT_1;

  }

  play(){
    sound.stopAll();
    sound.play(this.song);
  }

  stop(){
    sound.stop(this.song);
  }

}
