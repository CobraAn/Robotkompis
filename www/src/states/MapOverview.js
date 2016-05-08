RobotKompis.MapOverview = function (game) {
    'use strict';
    this.title = null;
    this.LevelOne = null;
    this.LevelTwo = null;
    this.LevelThree = null;
    this.LevelFour = null;
    this.LevelFive = null;
    this.settingIcon = null;
    this.cloud;
    this.func_btn;
    
    this.tilemapKey = null; // The tilemap key from Preloader which matches the given level. 
    this.commandKeys = null; // The commands which are available on a certain level. 
    // this.character = 'switch';
    // this.popup;
    // this.closebutton;
    
    //Variabler för level select
    this.currentWorld;
    // number of button rows
    this.buttonRows = 1;
    // number of button columns
    this.buttonCols = 5;
    // width of a button, in pixels
    this.buttonWidth = 100;
    // height of a button, in pixels
    this.buttonHeight = 100;
    // space among buttons, in pixels
    this.buttonSpacing = 8;
    // array with finished levels and stars collected.
    // 0 = playable yet unfinished level
    // 2 = Locked level
    this.starsArray = [0, 0, 0, 0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2];
    // how many pages are needed to show all levels?
    this.pages = this.starsArray.length/(this.buttonRows*this.buttonCols);
    // group where to place all level buttons
    this.levelButtonsGroup;
    // current page
    this.currentPage = 0;
    // arrows to navigate through level pages
    this.leftArrow;
    this.rightArrow;
    this.levelText;
    this.style = {
        font: "50px Arial Black",
        fill: "#000000"
    };
};

RobotKompis.MapOverview.prototype = {
    
    create: function () {
        'use strict';
        this.createLevelSelect();

        //Knappar för att starta olika banor

        /*this.LevelOne = this.add.button(240, 190, 'levelOne', this.startLevelOne, this, 0, 0, 1);
        this.LevelTwo = this.add.button(440, 190, 'levelTwo', this.startLevelTwo, this, 0, 0, 1);
        this.LevelThree = this.add.button(640, 190, 'levelThree', this.startLevelThree, this, 0, 0, 1);
        this.LevelFour = this.add.button(315, 400, 'levelFour', this.startLevelFour, this, 0, 0, 1);
        this.LevelFive = this.add.button(540, 400, 'levelFive', this.startLevelFive, this, 0, 0, 1);*/

        
        //Gör om denna till knapp för inställningar
        this.settingsIcon = this.add.button(896, 0, 'settingsIcon', this.startSettings, this, 0, 0, 1);
        
        //titel
        this.title = this.add.bitmapText(180, 40, 'titleFont', 'Robotkompis', 110);
   
    },
    
    createLevelSelect: function() {
        
        this.leftArrow = this.add.button(this.world.centerX - 100, this.world.centerY + 150, 'menuArrows', this.arrowClicked, this, 0, 0, 1);
        this.leftArrow.anchor.setTo(0.5);
        this.leftArrow.frame = 0;
        this.leftArrow.alpha = 0.3;
        this.rightArrow = this.add.button(this.world.centerX + 100, this.world.centerY + 150, 'menuArrows', this.arrowClicked, this, 2, 2, 3);
        this.rightArrow.anchor.setTo(0.5);
        this.rightArrow.frame = 2;
        //Creation of levelButton group
        this.levelButtonsGroup = this.add.group();
        var levelLength = this.buttonWidth*this.buttonCols+this.buttonSpacing*(this.buttonCols - 1);
        var levelHeight = this.buttonWidth*this.buttonRows+this.buttonSpacing*(this.buttonRows - 1);
        //Looping through each page
        for(var l = 0; l < this.pages; l++){
            //position of grid
            var offsetX = (this.world.width - levelLength)/2+this.world.width*l;
            var offsetY = (this.world.height - levelHeight)/2;
            //What world?
            var currentWorld = l + 1;
            var currentWorldString = currentWorld.toString();
            this.currentWorldText = this.add.text(offsetX + 180, 170, 'Värld ' + currentWorldString, this.style);
            this.levelButtonsGroup.add(this.currentWorldText);
            //Looping through each level button
            for(var i = 0; i < this.buttonRows; i++) {
                for(var j = 0; j < this.buttonCols; j++){
                    
                    //which level does the button refer?
                    var levelNumber = i*this.buttonCols+j+l*(this.buttonRows*this.buttonCols);
                    //adding button, calls the buttonClicked function
                    if (this.starsArray[levelNumber] == 2) {
                        var levelButton = this.add.button(offsetX+j*(this.buttonWidth+this.buttonSpacing), offsetY+i*(this.buttonHeight+this.buttonSpacing), 'levelSelect', this.buttonClicked, this);
                        
                    }
                    else {
                        var levelButton = this.add.button(offsetX+j*(this.buttonWidth+this.buttonSpacing), offsetY+i*(this.buttonHeight+this.buttonSpacing), 'levelSelect', this.buttonClicked, this, 0, 0, 1);
                    }
                    
                    //showing right frame
                    levelButton.frame = this.starsArray[levelNumber];
                    // custom attribute 
				    levelButton.levelNumber = levelNumber+1;
				    // adding the level thumb to the group
				    this.levelButtonsGroup.add(levelButton);
                    if(this.starsArray[levelNumber] < 2 && (levelNumber+1) < 10) {
                        var levelNumberRight = levelNumber + 1;
                        var printedNumber = levelNumberRight.toString();
                        this.levelText = this.add.bitmapText(levelButton.x+30,levelButton.y+25, 'numberFont', printedNumber, 70);
                        this.levelButtonsGroup.add(this.levelText);
                    }
                    else if (this.starsArray[levelNumber] < 2){
                        var levelNumberRight = levelNumber + 1;
                        var printedNumber = levelNumberRight.toString();
                        this.levelText = this.add.bitmapText(levelButton.x+10,levelButton.y+25, 'numberFont', printedNumber, 70);
                        this.levelButtonsGroup.add(this.levelText);
                    }
                }
            }
        }
    },
     buttonClicked: function (button) {
	   // the level is playable, then play the level!!
        if(button.frame < 2){
            if (button.levelNumber == 1) {
                this.startLevelOne();
            }
            else if (button.levelNumber == 2) {
                this.startLevelTwo();
            }
            else {
                alert('finns ej');
            }
        }
        // else, let's shake the locked levels
        else{
            var buttonTween = this.add.tween(button)
            buttonTween.to({
                x: button.x+this.buttonWidth/15
            }, 20, Phaser.Easing.Cubic.None);
            buttonTween.to({
                x: button.x-this.buttonWidth/15
            }, 20, Phaser.Easing.Cubic.None);
            buttonTween.to({
                x: button.x+this.buttonWidth/15
            }, 20, Phaser.Easing.Cubic.None);
            buttonTween.to({
                x: button.x-this.buttonWidth/15
            }, 20, Phaser.Easing.Cubic.None);
            buttonTween.to({
                x: button.x
            }, 20, Phaser.Easing.Cubic.None);
            buttonTween.start();
        }
    },
    arrowClicked: function (button) {
        // touching right arrow and still not reached last page
        if(button.frame==3 && this.currentPage < this.pages-1){
            this.leftArrow.alpha = 1;
            this.currentPage++;
            // fade out the button if we reached last page
            if(this.currentPage == this.pages-1){
                button.alpha = 0.3;
            }
            // scrolling level pages
            var buttonsTween = this.add.tween(this.levelButtonsGroup);
            buttonsTween.to({
                x: this.currentPage * this.world.width * -1
            }, 500, Phaser.Easing.Cubic.None);
            buttonsTween.start();
        }
        // touching left arrow and still not reached first page
        if(button.frame==1 && this.currentPage>0){
            this.rightArrow.alpha = 1;
            this.currentPage--;
            // fade out the button if we reached first page
            if(this.currentPage == 0){
                button.alpha = 0.3;
            }
            // scrolling level pages
            var buttonsTween = this.add.tween(this.levelButtonsGroup);
            buttonsTween.to({
                x: this.currentPage * this.world.width * -1
            }, 400, Phaser.Easing.Cubic.None);
            buttonsTween.start();
        }		
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
                  
        if (this.cloud.visible==false) { // The cloud opens if closed...*** 
            this.cloud.visible = true; 
            // Everything what is supposed to be opened is opened, other stuff is closed
            for (var i = 1; i < 7; i++) {
                if (this.func_sprite_array[i]!=null){
                    this.func_sprite_array[i].visible = true; 
                    this.func_create_array[i].visible = false;   
                } 
                else {
                    this.func_create_array[i].visible = true;
                }          
            }
        }
        else { //...*** and closes if opened ;)
            // Close everything except for the chosen function. 
            for (var i = 1; i < 7; i++) {
                this.func_create_array[i].visible = false;
  
                if (this.func_sprite_array[i]!=null){               
                    if(this.func_sprite_array[i].y>=510 && this.func_sprite_array[i].y<590){ 
                        this.func_sprite_array[i].visible = true;  
                    }
                    else{
                        this.func_sprite_array[i].visible = false; 
                    }                        
                } 
            }
            // To be sure that everything is closed (bugging without the following 4 guys).
            if(this.func_edit){this.func_edit.visible = false}
            if(this.func_save){this.func_save.visible = false}
            if(this.func_delete){this.func_delete.visible = false}
            if(this.func_save){this.func_save.visible = false}
            if(this.func_cancel){this.func_cancel.visible = false}          
            this.cloud.visible = false;
  
         }    
    

        
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