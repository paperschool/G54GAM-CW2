class LevelManager {

  constructor(){
    this.levels = [];
    this.levelsRequested = 0;
    this.levelsRecieved = 0;
  }

  levelsLoaded(){
    return this.levelsRequested === this.levelsRecieved;
  }

  loadLevel(src,index,callback){

    this.levelsRequested++;

    this.loadJSON(src,(function(level){
      this.levelsRecieved++;
      callback(JSON.parse(level),index);
      console.log("Level Successfully Added: " + src);
    }).bind(this));
  }

  loadJSON(src,callback) {


		var xobj = new XMLHttpRequest();

  	xobj.overrideMimeType("application/json");
		xobj.open('GET', src, true);
		xobj.onreadystatechange = function ()

  	{
			if (xobj.readyState == 4 && xobj.status == "200")
			{
				callback(xobj.responseText);
			}
		}

		xobj.send(null);
	}

}
