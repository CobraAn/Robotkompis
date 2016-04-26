RobotKompis.MapOverview = function (game) {
    'use strict';
    this.title = null;
    this.LevelOne = null;
    this.LevelTwo = null;
    this.LevelThree = null;
    this.LevelFour = null;
    this.LevelFive = null;
    this.settingIcon = null;

};

RobotKompis.MapOverview.prototype = {
    
    create: function () {
        'use strict';
        
        //Knappar för att starta olika banor
        this.LevelOne = this.add.button(200, 150, 'levelOne', this.startLevelOne, this, 0, 0, 1);
        this.LevelTwo = this.add.button(400, 150, 'levelTwo', this.startLevelTwo, this, 0, 0, 1);
        this.LevelThree = this.add.button(600, 150, 'levelThree', this.startLevelThree, this, 0, 0, 1);
        this.LevelFour = this.add.button(275, 360, 'levelFour', this.startLevelFour, this, 0, 0, 1);
        this.LevelFive = this.add.button(500, 360, 'levelFive', this.startLevelFive, this, 0, 0, 1);
        
        //Gör om denna till knapp för inställningar
        this.settingsIcon = this.add.image(896, 0, 'settingsIcon');
        
        //titel
        this.title = this.add.bitmapText(200, 40, 'startFont', 'Robotkompis', 100);
   
    },
    
    
    //Funktioner kopplade till knapparna som ska föra spelet in i ett game-state
    startLevelOne: function () {
        'use strict';
        this.state.start('Bana1');
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