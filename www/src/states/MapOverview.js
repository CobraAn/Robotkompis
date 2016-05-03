RobotKompis.MapOverview = function (game) {
    'use strict';
    this.title = null;
    this.LevelOne = null;
    this.LevelTwo = null;
    this.LevelThree = null;
    this.LevelFour = null;
    this.LevelFive = null;
    this.settingIcon = null;

    this.tilemapKey = null; // The tilemap key from Preloader which matches the given level. 
    this.commandKeys = null; // The commands which are available on a certain level. 
    this.character = 'switch';
    this.popup;
    this.closebutton;

};

RobotKompis.MapOverview.prototype = {
    
    create: function () {
        'use strict';
        //grupper för levelknappar och popup-menyn.
        this.levelsGroup = this.add.group();
        this.popupGroup = this.add.group();
        //Knappar för att starta olika banor
        
        this.LevelOne = this.make.button(200, 150, 'levelOne', this.startLevelOne, this, 0, 0, 1);
        this.levelsGroup.add(this.LevelOne);
        
        this.LevelTwo = this.make.button(400, 150, 'levelTwo', this.startLevelTwo, this, 0, 0, 1);
        this.levelsGroup.add(this.LevelTwo);

        this.LevelThree = this.make.button(600, 150, 'levelThree', this.startLevelThree, this, 0, 0, 1);
        this.levelsGroup.add(this.LevelThree);
        
        this.LevelFour = this.make.button(275, 360, 'levelFour', this.startLevelFour, this, 0, 0, 1);
        this.levelsGroup.add(this.LevelFour);
        
        this.LevelFive = this.make.button(500, 360, 'levelFive', this.startLevelFive, this, 0, 0, 1);
        this.levelsGroup.add(this.LevelFive);
        
        //Gör om denna till knapp för inställningar
        this.settingsIcon = this.add.image(896, 0, 'settingsIcon');
        
        //for the robot-choosing-popup-meny
        //change this.character to a spritesheet with all the robots so it can change when choosing a robot.
        this.robotchoice = this.add.button(5, 5, this.character, this.popuprobot, this, 0, 0, 1);
        //the background of the popup
        this.popup = this.add.sprite(200, 150, 'robotChoise');

        var pw = (this.popup.width) + 160;
        var ph = (this.popup.height/2) -10 ;
        // click the close button to close it down again
        this.closebutton = this.add.button(pw, ph, 'closeButton', this.closeWindow, this, 0, 0, 1);
        this.while = this.make.button(220, 190, 'while', this.whileButton, this, 0, 0, 1);
        this.switch = this.make.button(410, 190, 'switch', this.switchButton, this, 0, 0, 1);
        //this.else = this.add.button(600, 190, 'else', this.startLevelThree, this, 0, 0, 1);
        //this.goto = this.add.button(275, 360, 'goto', this.startLevelFour, this, 0, 0, 1);
        //this.if = this.add.button(500, 360, 'if', this.startLevelFive, this, 0, 0, 1);   
        
        
        this.popup.addChild(this.closebutton);
        this.popupGroup.add(this.popup);
        this.popupGroup.add(this.closebutton);
        this.popupGroup.add(this.while);

        this.popupGroup.add(this.switch);

        this.popupGroup.visible = false;

                
        //titel
        this.title = this.add.bitmapText(200, 40, 'startFont', 'Robotkompis', 100);
   
    },
    
    
    //Funktioner kopplade till knapparna som ska föra spelet in i ett game-state
    startLevelOne: function () {
        'use strict';
        this.state.states['Level'].tilemapKey = 'tilemap1'; // Start a variable in the 'Level' state, name it tilemapKey and assign it 'tilemap1'.
        this.state.states['Level'].commandKeys = ['walk_right_com', 'walk_left_com', 'up_com', 'down_com', 
                                                'key_com', 'ladder_com', 'hop_left_com', 'hop_right_com'];
        this.state.start('Level', true, false, this.character);
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
        
    },
    popuprobot: function () {
        this.levelsGroup.visible = false;    
        this.popupGroup.visible = true;
        return;

    },
    closeWindow: function() {
        this.popupGroup.visible = false;

        this.levelsGroup.visible = true;
        return;
    },
    whileButton: function () {
        this.character = 'while'; //changes the character
        return;
    },
    switchButton: function () {
        this.character = 'switch';
        return;
        
    }
    
    
};