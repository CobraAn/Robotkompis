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
    this.mute_button;
    this.tut_button;
    
    this.tilemapKey = null; // The tilemap key from Preloader which matches the given level. 
    this.commandKeys = null; // The commands which are available on a certain level. 
    this.character = 'switchAni';
    this.popup;
    this.closebutton;

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
    // 0 = zero stars
    // 1 = one star
    // 2 = two stars
    // 3 = three stars
    // 4 = Used for click interaction! don't use this in starsArray!!
    // 5 = Locked level
    this.starsArray = [0, 1, 2, 3, 3, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5];
    
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
        this.popupGroup = this.add.group();
        
        /*this.func_btn = this.add.button(30, 450 , 'func_button', this.favxOnClick, this, 2, 1, 0);
        this.cloud = this.add.sprite(71, 107, 'cloud'); 
        this.cloud.visible = false;*/ 
        this.cloud = this.add.image(430, 50, 'settingsCloud');
        this.cloud.bringToTop();
        this.cloud.visible = false;

        this.mute_button = this.add.button(500, 65,  'muteUnMute', this.Mute, this);
        this.tut_button = this.add.button(500, 300,  'tutBtn', this.LoadTutorial, this)
        this.mute_button.visible = false;
        this.tut_button.visible = false;

        //for the robot-choosing-popup-menu
        //have to fix that the sprite sheet remembers its last frame so it chows the right chosen robot.
        this.robotchoice = this.add.button(5, 5, 'robotButton' , this.popuprobot, this);
        
        //the background of the popup
        this.popup = this.add.sprite(200, 150, 'robotChoiseBackground');
        //postioner för close knappen.
        var pw = (this.popup.width) + 160;
        var ph = (this.popup.height/2) -10 ;
        // click the close button to close it down again
        this.closebutton = this.add.button(pw, ph, 'closeButton', this.closeWindow, this, 0, 0, 1);
        //alla robotar som knappar
        this.while = this.make.button(220, 190, 'whileChoise', this.whileButton, this, 0, 0, 1);
        this.switch = this.make.button(410, 190, 'switchChoise', this.switchButton, this, 0, 0, 1);
        this.else = this.add.button(600, 190, 'elseChoise', this.elseButton, this, 0, 0, 1);
        this.goto = this.add.button(275, 360, 'gotoChoise', this.gotoButton, this, 0, 0, 1);
        this.if = this.add.button(500, 360, 'ifChoise', this.ifButton, this, 0, 0, 1); 
        
        //lägger allt i en grupp för att enklara kunna stänga ner dem i closeWindow
        this.popup.addChild(this.closebutton);
        this.popupGroup.add(this.popup);
        this.popupGroup.add(this.closebutton);
        this.popupGroup.add(this.while);
        this.popupGroup.add(this.switch);
        this.popupGroup.add(this.else);
        this.popupGroup.add(this.goto);
        this.popupGroup.add(this.if);

        this.popupGroup.visible = false;

       
	
        //Gör om denna till knapp för inställningar
        this.settingsIcon = this.add.button(950, 5, 'settingsIcon', this.startSettings, this, 0, 0, 1);
        
        //titel
        this.title = this.add.bitmapText(180, 40, 'titleFont', 'Robotkompis', 110);
        this.world.sendToBack(this.title);
    },
    startSettings: function () {
        'use strict';
                  
        if (this.cloud.visible==false) { // The cloud opens if closed...*** 
            this.cloud.visible = true; 
            // Everything what is supposed to be opened is opened, other stuff is closed
            //this.tut_button.visible = true;
            this.mute_button.visible = true;
                
                          
            }
        
        else { //...*** and closes if opened ;)
            // Close everything except for the chosen function. 
            this.mute_button.visible = false;
            this.tut_button.visible = false; 
            
            // To be sure that everything is closed (bugging without the following 4 guys).
                  
            this.cloud.visible = false;
  
         }
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
                    if (this.starsArray[levelNumber] == 5) {
                        var levelButton = this.add.button(offsetX+j*(this.buttonWidth+this.buttonSpacing), offsetY+i*(this.buttonHeight+this.buttonSpacing), 'levelSelect', this.buttonClicked, this);
                    }
                    else {
                        //För stjärnor, byt sista 1:an mot en 0:a
                        var levelButton = this.add.button(offsetX+j*(this.buttonWidth+this.buttonSpacing), offsetY+i*(this.buttonHeight+this.buttonSpacing), 'levelSelect', this.buttonClicked, this, null, this.starsArray[levelNumber], 4);
                    }
                    
                    //showing right frame
                    levelButton.frame = this.starsArray[levelNumber];
                    // custom attribute 
				    levelButton.levelNumber = levelNumber+1;
				    // adding the level thumb to the group
				    this.levelButtonsGroup.add(levelButton);
                    if(this.starsArray[levelNumber] < 5 && (levelNumber+1) < 10) {
                        var levelNumberRight = levelNumber + 1;
                        var printedNumber = levelNumberRight.toString();
                        this.levelText = this.add.bitmapText(levelButton.x+35,levelButton.y+20, 'numberFont', printedNumber, 50);
                        this.levelButtonsGroup.add(this.levelText);
                    }
                    else if (this.starsArray[levelNumber] < 5) {
                        var levelNumberRight = levelNumber + 1;
                        var printedNumber = levelNumberRight.toString();
                        this.levelText = this.add.bitmapText(levelButton.x+20,levelButton.y+20, 'numberFont', printedNumber, 50);
                        this.levelButtonsGroup.add(this.levelText);
                    }
                }
            }
        }
    },
     buttonClicked: function (button) {
	   // the level is playable, then play the level!!
        if(button.frame < 5) {
            if (button.levelNumber == 1) {
                this.startLevelOne();
            }
            else if (button.levelNumber == 2) {
                this.startLevelTwo();
            }
            else if (button.levelNumber == 3) {
                this.startLevelThree();
            }
             else if (button.levelNumber == 4) {
                this.startLevelFour();
            }
             else if (button.levelNumber == 5) {
                this.startLevelFive();
            }
            else {
                console.log('Något är fel');
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
        /*
        this.state.states['Tutorial'].tilemapKey = 'tilemap0';
        this.state.states['Tutorial'].commandKeys = ['walk_left_com'];
        this.state.start('Tutorial');
        */
        this.state.states['Level'].tilemapKey = 'tilemap1'; // Start a variable in the 'Level' state, name it tilemapKey and assign it 'tilemap1'.
        this.state.states['Level'].commandKeys = ['walk_right_com', 'walk_left_com', 'ladder_com'];
        //, 'down_com', 
          //                                      'key_com', 'ladder_com', 'hop_left_com', 'hop_right_com'];

        this.state.start('Level', true, false, this.character);

    },
    
    startLevelTwo: function () {
        'use strict';
        this.state.states['Level'].tilemapKey = 'tilemap2'; // Start a variable in the 'Level' state, name it tilemapKey and assign it 'tilemap1'.
        this.state.states['Level'].commandKeys = ['walk_right_com', 'walk_left_com', 'ladder_com', 'hop_right_com']; //, 'down_com', 'key_com', 'ladder_com', 'hop_left_com', 'hop_right_com'
                                                
        this.state.start('Level', true, false, this.character);
    },
    
    startLevelThree: function () {
        'use strict';
        this.state.states['Level'].tilemapKey = 'tilemap3'; // Start a variable in the 'Level' state, name it tilemapKey and assign it 'tilemap1'.
        this.state.states['Level'].commandKeys = ['walk_right_com', 'walk_left_com', 'ladder_com', 'hop_left_com', 'hop_right_com']; // , 'down_com', 'key_com', 'ladder_com', 'hop_left_com', 'hop_right_com'
                                                
        this.state.start('Level', true, false, this.character);
    },
    
    startLevelFour: function () {
        'use strict';
        this.state.states['Level'].tilemapKey = 'tilemap4'; // Start a variable in the 'Level' state, name it tilemapKey and assign it 'tilemap1'.
        this.state.states['Level'].commandKeys = ['walk_right_com', 'walk_left_com', 'ladder_com', 'hop_left_com', 'hop_right_com']; // , 'down_com', 'key_com', 'ladder_com', 'hop_left_com', 'hop_right_com'
                                                
        this.state.start('Level', true, false, this.character);
    },
    
    startLevelFive: function () {
        'use strict';
        this.state.states['Level'].tilemapKey = 'tilemap5'; // Start a variable in the 'Level' state, name it tilemapKey and assign it 'tilemap1'.
        this.state.states['Level'].commandKeys = ['walk_right_com', 'walk_left_com', 'ladder_com', 'hop_left_com', 'hop_right_com', 'down_com']; //, 'down_com', 'key_com', 'ladder_com', 'hop_left_com', 'hop_right_com'
                                                
        this.state.start('Level', true, false, this.character);
    },
    
    popuprobot: function () {
        this.levelButtonsGroup.visible = false;    
        this.popupGroup.visible = true;
        //change to visible but not clickable when time. 
        this.leftArrow.visible = false;
        this.rightArrow.visible = false;
        return;

    },
    
    closeWindow: function() {
        this.popupGroup.visible = false;
        this.levelButtonsGroup.visible = true;
        //change to visible but not clickable when time. 
        this.leftArrow.visible = true;
        this.rightArrow.visible = true;
        return;
    },
        
    whileButton: function () {
        this.character = 'while'; //changes the character
        this.robotchoice.setFrames(1,1,1);
    },
    switchButton: function () {
        this.character = 'switchAni';
        this.robotchoice.setFrames(0,0,0);
    },
    elseButton: function () {
        this.character = 'else';
        this.robotchoice.setFrames(4,4,4);
    },
    gotoButton: function () {
        this.character = 'goto';
        this.robotchoice.setFrames(2,2,2);
    },
    ifButton: function () {
        this.character = 'if';
        this.robotchoice.setFrames(3,3,3);
    },  
    Mute: function(){
        if (this.sound.mute == false) {
            this.sound.mute = true;
           
            this.mute_button.frame = 1;
            //this.mute_button = this.add.button(200,0,  'muteButton', this.Mute, this, 0, 0, 1);
            
        } else {
            this.sound.mute = false;
            
            this.mute_button.frame = 0;
        };   
    },
    LoadTutorial: function() {
        //alert('finns ej');
    }   
    
};