RobotKompis.MapOverview = function (game) {
    'use strict';
    this.title = null;
    this.LevelOne = null;
    this.LevelTwo = null;
    this.LevelThree = null;
    this.LevelFour = null;
    this.LevelFive = null;
    this.settingIcon = null;
    
    this.levelButtonGroup;
    this.tilemapKey = null; // The tilemap key from Preloader which matches the given level. 
    this.commandKeys = null; // The commands which are available on a certain level. 
    // this.character = 'switch';
    // this.popup;
    // this.closebutton;
    

};

RobotKompis.MapOverview.prototype = {
    
    create: function () {
        'use strict';

        //Knappar för att starta olika banor

        this.LevelOne = this.add.button(240, 190, 'levelOne', this.startLevelOne, this, 0, 0, 1);
        this.LevelTwo = this.add.button(440, 190, 'levelTwo', this.startLevelTwo, this, 0, 0, 1);
        this.LevelThree = this.add.button(640, 190, 'levelThree', this.startLevelThree, this, 0, 0, 1);
        this.LevelFour = this.add.button(315, 400, 'levelFour', this.startLevelFour, this, 0, 0, 1);
        this.LevelFive = this.add.button(540, 400, 'levelFive', this.startLevelFive, this, 0, 0, 1);

        
        //this.levelButtonGroup = this.add.group();
        //for(var l = 0; l < pages; l++){
		// horizontal offset to have level thumbnails horizontally centered in the page
		//var offsetX = (game.width-levelLength)/2+game.width*l;
		// I am not interested in having level thumbnails vertically centered in the page, but
		// if you are, simple replace my "20" with
		// (game.height-levelHeight)/2
		//var offsetY = 20;
		// looping through each level thumbnails
	    // for(var i = 0; i < thumbRows; i ++){
	   //  	for(var j = 0; j < thumbCols; j ++){  
	   //  		// which level does the thumbnail refer?
		//		var levelNumber = i*thumbCols+j+l*(thumbRows*thumbCols);
		//		// adding the thumbnail, as a button which will call thumbClicked function if clicked   		
		//		// shwoing proper frame
		//		levelThumb.frame=starsArray[levelNumber];
		//		// custom attribute 
		//		levelThumb.levelNumber = levelNumber+1;
		//		levelThumbsGroup.add(levelThumb);
		//		// if the level is playable, also write level number
		//		if(starsArray[levelNumber]<4){
		//			var style = {
		//				font: "18px Arial",
		//				fill: "#ffffff"
		//			};
		//			var levelText = game.add.text(levelThumb.x+5,levelThumb.y+5,levelNumber+1,style);
		//			levelText.setShadow(2, 2, 'rgba(0,0,0,0.5)', 1);
		//			levelThumbsGroup.add(levelText);
		//		}
		//	}
		//}
	
        //Gör om denna till knapp för inställningar
        this.settingsIcon = this.add.button(896, 0, 'settingsIcon', this.startSettings, this, 0, 0, 1);
        
        //titel
        this.title = this.add.bitmapText(180, 40, 'titleFont', 'Robotkompis', 110);
   
    },
    
    
    //Funktioner kopplade till knapparna som ska föra spelet in i ett game-state
    startLevelOne: function () {
        'use strict';
        this.state.states['Level'].tilemapKey = 'tilemap1'; // Start a variable in the 'Level' state, name it tilemapKey and assign it 'tilemap1'.
        this.state.states['Level'].commandKeys = ['walk_right_com', 'walk_left_com', 'up_com'];
        //, 'down_com', 
          //                                      'key_com', 'ladder_com', 'hop_left_com', 'hop_right_com'];
        this.state.start('Level');
    },
    
    startSettings: function () {
        'use strict';
        this.state.start('Settings');
    },
    
    startLevelTwo: function () {
        'use strict';
        alert('LEVEL 2 FINNS EJ ÄN');
    },
    
    startLevelThree: function () {
        'use strict';
        alert('LEVEL 3 FINNS EJ ÄN');
    },
    
    startLevelFour: function () {
        'use strict';
        alert('LEVEL 4 FINNS EJ ÄN');
    },
    
    startLevelFive: function () {
        'use strict';
        alert('LEVEL 5 FINNS EJ ÄN');
        
    }
    
};