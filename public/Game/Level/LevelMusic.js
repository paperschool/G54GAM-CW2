class LevelMusic {

  constructor(id = null){

    this.song = null;

    if(id === null) id = Utility.RandomInt(1,5);

    // music
    switch(id){
      case 1 : this.song = SoundLabel.PLAY_STATE_MUSIC_1; break;
      case 2 : this.song = SoundLabel.PLAY_STATE_MUSIC_2; break;
      case 3 : this.song = SoundLabel.PLAY_STATE_MUSIC_3; break;
      case 4 : this.song = SoundLabel.PLAY_STATE_MUSIC_4; break;
    }

  }

  play(){
    sound.stopAll();
    sound.play(this.song);
  }

  stop(){
    sound.stop(this.song);
  }

}
