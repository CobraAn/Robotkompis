RobotKompis.MapOverview = function (game) {
    'use strict';
    this.title = null;
    this.LevelOne = null;
    this.LevelTwo = null;
    this.LevelThree = null;
    this.LevelFour = null;
    this.LevelFive = null;
    this.LevelSix = null;
    this.settingIcon = null;
    this.cloud;
    this.func_btn;
    this.mute_button;
    this.tut_button;
    
    this.tilemapKey = null; // The tilemap key from Preloader which matches the given level. 
    this.commandKeys = null; // The commands which are available on a certain level. 
    this.character = 'switch';
    this.popup;
    this.closebutton;

    this.playerData = {};
    this.robotFrame = 0;
    this.robotData = {};

    // Vairabel for level select
    this.currentWorld;

    // Number of button rows
    this.buttonRows = 1;

    // Number of button columns
    this.buttonCols = 5;

    // Width of a button, in pixels
    this.buttonWidth = 100;

    // Height of a button, in pixels
    this.buttonHeight = 100;

    // Space among buttons, in pixels
    this.buttonSpacing = 8;

    /* Array with finished levels and stars collected.
     * 0 = zero stars
     * 1 = one star
     * 2 = two stars
     * 3 = three stars
     * 4 = Used for click interaction! don't use this in starsArray!!
     * 5 = Locked level
    */
    this.starsArray = [0, 1, 2, 3, 3, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5];

    // Pages required to show all levels
    this.pages = this.starsArray.length/(this.buttonRows*this.buttonCols);

    // Group where to place all level buttons
    this.levelButtonsGroup;

    // Current page
    this.currentPage = 0;

    // Arrows to navigate through level pages
    this.leftArrow;
    this.rightArrow;
    this.levelText;
    this.style = {
        font: "50px Arial Black",
        fill: "#000000"
    };
};

RobotKompis.MapOverview.prototype = {

    init: function () {

        /*
         * Loads data from localStorage and sets the saved robot as the current one, if data exists
         */
        
        this.playerData = loadData();
        if (typeof this.playerData !== "undefined" && jQuery.isEmptyObject(this.playerData) !== true && this.playerData.robot !== undefined) {
            this.character = this.playerData.robot;
            this.robotFrame = this.playerData.robotFrame;
        }
        
    },
    
    create: function () {
        'use strict';
        this.createLevelSelect();
        this.popupGroup = this.add.group();

        this.cloud = this.add.image(430, 50, 'settingsCloud');
        this.cloud.bringToTop();
        this.cloud.visible = false;

        // Mute and Tutorial button initiation
        this.mute_button = this.add.button(500, 65,  'muteUnMute', this.Mute, this);
        this.tut_button = this.add.button(500, 300,  'tutBtn', this.LoadTutorial, this)
        this.mute_button.visible = false;
        this.tut_button.visible = false;

        // TODO
        // Have to fix that the sprite sheet remembers its last frame so it chows the right chosen robot.

        // Robot menu
        this.robotchoice = this.add.button(5, 5, 'robotButton' , this.popuprobot, this);
        this.robotchoice.frame = this.robotFrame;
        
        // The background of the popup
        this.popup = this.add.sprite(200, 150, 'robotChoiseBackground');

        // Positions for the "Close" button
        var pw = (this.popup.width) + 160;
        var ph = (this.popup.height/2) -10 ;
        this.closebutton = this.add.button(pw, ph, 'closeButton', this.closeWindow, this, 0, 0, 1);

        // Robots as buttons
        this.while = this.make.button(220, 190, 'whileChoise', this.whileButton, this, 0, 0, 1);
        this.switch = this.make.button(410, 190, 'switchChoise', this.switchButton, this, 0, 0, 1);
        this.else = this.add.button(600, 190, 'elseChoise', this.elseButton, this, 0, 0, 1);
        this.goto = this.add.button(275, 360, 'gotoChoise', this.gotoButton, this, 0, 0, 1);
        this.if = this.add.button(500, 360, 'ifChoise', this.ifButton, this, 0, 0, 1); 
        
        // Add to group for easier control
        this.popup.addChild(this.closebutton);
        this.popupGroup.add(this.popup);
        this.popupGroup.add(this.closebutton);
        this.popupGroup.add(this.while);
        this.popupGroup.add(this.switch);
        this.popupGroup.add(this.else);
        this.popupGroup.add(this.goto);
        this.popupGroup.add(this.if);

        this.popupGroup.visible = false;

        this.settingsIcon = this.add.button(950, 5, 'settingsIcon', this.startSettings, this, 0, 0, 1);
        
        // Title
        this.title = this.add.bitmapText(180, 40, 'titleFont', 'Robotkompis', 110);
        this.world.sendToBack(this.title);
        
    },
    startSettings: function () {
        'use strict';
        
        if (this.cloud.visible==false) {
            this.cloud.visible = true;
            this.mute_button.visible = true;
        }
        
        else {
            this.mute_button.visible = false;
            this.tut_button.visible = false;
            this.cloud.visible = false;
  
         }
    },
    
    createLevelSelect: function() {

        // Create left and right arrows
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
            // Position of grid
            var offsetX = (this.world.width - levelLength)/2+this.world.width*l;
            var offsetY = (this.world.height - levelHeight)/2;

            // Current world
            var currentWorld = l + 1;
            var currentWorldString = currentWorld.toString();
            this.currentWorldText = this.add.text(offsetX + 180, 170, 'Värld ' + currentWorldString, this.style);
            this.levelButtonsGroup.add(this.currentWorldText);

            // Looping through each level button
            for(var i = 0; i < this.buttonRows; i++) {
                for(var j = 0; j < this.buttonCols; j++){

                    // Check which level and load previously earned stars if they exist
                    var levelNumber = i*this.buttonCols+j+l*(this.buttonRows*this.buttonCols);
                    var dictKey = "Level" + (levelNumber+1).toString();
                    var levelStars = 0;
                    if (typeof this.playerData.levels !== "undefined" && this.playerData.levels !== null) {
                        if (typeof this.playerData.levels[dictKey] !== "undefined" && this.playerData.levels[dictKey] !== null) {
                            levelStars = this.playerData.levels[dictKey];
                        }
                    }

                    // Adding button based on amount of stars, calls the buttonClicked function
                    if (this.starsArray[levelNumber] == 5) {
                        var levelButton = this.add.button(offsetX+j*(this.buttonWidth+this.buttonSpacing),
                            offsetY+i*(this.buttonHeight+this.buttonSpacing), '' +
                            'levelSelect', this.buttonClicked, this);
                        levelButton.frame = this.starsArray[levelNumber];
                    }
                    else {
                        if (levelStars !== 0) {
                            var levelButton = this.add.button(offsetX+j*(this.buttonWidth+this.buttonSpacing),
                                offsetY+i*(this.buttonHeight+this.buttonSpacing),
                                'levelSelect', this.buttonClicked, this, null,
                                this.playerData.levels[dictKey] , 4);
                            levelButton.frame = levelStars;
                        } else {
                            var levelButton = this.add.button(offsetX+j*(this.buttonWidth+this.buttonSpacing),
                                offsetY+i*(this.buttonHeight+this.buttonSpacing),
                                'levelSelect', this.buttonClicked, this, null, 0, 4);
                            levelButton.frame = 0;
                        }
                    }

                    // Custom attribute
				    levelButton.levelNumber = levelNumber+1;

				    // Adding the level button to the group
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
     buttonClicked: function (button, pointer) {

         // Start correct level
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
            else if (button.levelNumber == 6) {
                this.startLevelSix();
            }
            else {
                console.log('Something went wrong');
            }
        }
        // Else, shake the locked levels
        else {
            //Can't click more often than every 0.5 secs
            if (pointer.msSinceLastClick > 500) {
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
        }
    },
    arrowClicked: function (button) {
        // Touching right arrow and still not reached last page
        if(button.frame==3 && this.currentPage < this.pages-1){
            this.leftArrow.alpha = 1;
            this.currentPage++;

            // Fade out the button if we reached last page
            if(this.currentPage == this.pages-1){
                button.alpha = 0.3;
            }
            // Scrolling level pages
            var buttonsTween = this.add.tween(this.levelButtonsGroup);
            buttonsTween.to({
                x: this.currentPage * this.world.width * -1
            }, 500, Phaser.Easing.Cubic.None);
            buttonsTween.start();
        }
        // Touching left arrow and still not reached first page
        if(button.frame==1 && this.currentPage>0){
            this.rightArrow.alpha = 1;
            this.currentPage--;
            // Fade out the button if we reached first page
            if(this.currentPage == 0){
                button.alpha = 0.3;
            }
            // Scrolling level pages
            var buttonsTween = this.add.tween(this.levelButtonsGroup);
            buttonsTween.to({
                x: this.currentPage * this.world.width * -1
            }, 400, Phaser.Easing.Cubic.None);
            buttonsTween.start();
        }		

   
     },
    // Functions connected to the level buttons for loading correct game states
    startLevelOne: function () {
        'use strict';

        this.state.states['Level'].tilemapKey = 'tilemap1'; // Start a variable in the 'Level' state, name it tilemapKey and assign it 'tilemap1'.
        this.state.states['Level'].commandKeys = ['walk_right_com', 'walk_left_com', 'ladder_com', 'key_com'];
        this.state.start('Level', true, false, this.character, "Level1");

    },
    
    startLevelTwo: function () {
        'use strict';
        this.state.states['Level'].tilemapKey = 'tilemap2'; // Start a variable in the 'Level' state, name it tilemapKey and assign it 'tilemap2'.
        this.state.states['Level'].commandKeys = ['walk_right_com', 'walk_left_com', 'ladder_com', 'hop_right_com', 'key_com']; //, 'down_com', 'key_com', 'ladder_com', 'hop_left_com', 'hop_right_com'
                                                
        this.state.start('Level', true, false, this.character, "Level2");
    },
    
    startLevelThree: function () {
        'use strict';
        this.state.states['Level'].tilemapKey = 'tilemap3'; // Start a variable in the 'Level' state, name it tilemapKey and assign it 'tilemap3'.
        this.state.states['Level'].commandKeys = ['walk_right_com', 'walk_left_com', 'ladder_com', 'hop_left_com', 'hop_right_com', 'key_com']; // , 'down_com', 'key_com', 'ladder_com', 'hop_left_com', 'hop_right_com'
                                                
        this.state.start('Level', true, false, this.character, "Level3");
    },
    
    startLevelFour: function () {
        'use strict';
        this.state.states['Level'].tilemapKey = 'tilemap4'; // Start a variable in the 'Level' state, name it tilemapKey and assign it 'tilemap4'.
        this.state.states['Level'].commandKeys = ['walk_right_com', 'walk_left_com', 'ladder_com', 'hop_left_com', 'hop_right_com', 'key_com']; // , 'down_com', 'key_com', 'ladder_com', 'hop_left_com', 'hop_right_com'
                                                
        this.state.start('Level', true, false, this.character, "Level4");
    },
    
    startLevelFive: function () {
        'use strict';
        this.state.states['Level'].tilemapKey = 'tilemap5'; // Start a variable in the 'Level' state, name it tilemapKey and assign it 'tilemap5'.
        this.state.states['Level'].commandKeys = ['walk_right_com', 'walk_left_com', 'ladder_com', 'hop_left_com', 'hop_right_com', 'down_com', 'key_com']; //, 'down_com', 'key_com', 'ladder_com', 'hop_left_com', 'hop_right_com'
                                                
        this.state.start('Level', true, false, this.character, "Level5");
    },
    startLevelSix: function () {
        'use strict';
        this.state.states['Level'].tilemapKey = 'tilemap6'; // Start a variable in the 'Level' state, name it tilemapKey and assign it 'tilemap6'.
        this.state.states['Level'].commandKeys = ['walk_right_com', 'walk_left_com', 'ladder_com', 'hop_left_com', 'hop_right_com', 'down_com', 'key_com']; //, 'down_com', 'key_com', 'ladder_com', 'hop_left_com', 'hop_right_com'
                                                
        this.state.start('Level', true, false, this.character, "Level6");
    },
    popuprobot: function () {
        this.levelButtonsGroup.visible = false;    
        this.popupGroup.visible = true;
        this.leftArrow.visible = false;
        this.rightArrow.visible = false;
        return;

    },
    
    closeWindow: function() {
        this.popupGroup.visible = false;
        this.levelButtonsGroup.visible = true;
        this.leftArrow.visible = true;
        this.rightArrow.visible = true;
        return;
    },

    // Buttons for the robots
    whileButton: function () {
        this.character = 'while'; //changes the character
        this.robotchoice.frame = 1;
        this.robotData.robot = this.character;
        this.robotData.robotFrame = 1;
        saveRobot(this.robotData);
    },
    switchButton: function () {
        this.character = 'switch';
        this.robotchoice.frame = 0;
        this.robotData.robot = this.character;
        this.robotData.robotFrame = 0;
        saveRobot(this.robotData);    },
    elseButton: function () {
        this.character = 'else';
        this.robotchoice.frame = 4;
        this.robotData.robot = this.character;
        this.robotData.robotFrame = 4;
        saveRobot(this.robotData);
    },
    gotoButton: function () {
        this.character = 'goto';
        this.robotchoice.frame = 2;
        this.robotData.robot = this.character;
        this.robotData.robotFrame = 2;
        saveRobot(this.robotData);
        this.robotchoice.setFrames(2,2,2);
    },
    ifButton: function () {
        this.character = 'if';
        this.robotchoice.frame = 3;
        this.robotData.robot = this.character;
        this.robotData.robotFrame = 3;
        saveRobot(this.robotData);
    },  
    Mute: function(){
        if (this.sound.mute == false) {
            this.sound.mute = true;
            this.mute_button.frame = 1;
        } else {
            this.sound.mute = false;
            
            this.mute_button.frame = 0;
        };   
    },

    // Unused for now
    LoadTutorial: function() {}
    
};