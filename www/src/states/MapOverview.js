RobotKompis.MapOverview = function (game) {
    'use strict';
    this.LevelOne;
    this.LevelTwo;
    this.LevelThree;
    this.LevelFour;
    this.LevelFive;
    this.settingIcon;

};

RobotKompis.MapOverview.prototype = {
    
    create: function () {
        'use strict';
        
        //Knappar för att starta olika banor
        this.LevelOne = this.add.button(200, 190, 'levelOne', this.startLevelOne, this, 0, 0, 1);
        this.LevelTwo = this.add.button(450, 190, 'levelTwo', this.startLevelTwo, this, 0, 0, 1);
        this.LevelThree = this.add.button(700, 190, 'levelThree', this.startLevelThree, this, 0, 0, 1);
        this.LevelFour = this.add.button(325, 400, 'levelFour', this.startLevelFour, this, 0, 0, 1);
        this.LevelFive = this.add.button(585, 400, 'levelFive', this.startLevelFive, this, 0, 0, 1);
        
        //Gör om till knapp för inställningar
        this.settingsIcon = this.add.image(896, 0, 'settingsIcon');
    },
    
    
    //Funktioner kopplade till knapparna som ska föra spelet in i ett game-state
    startLevelOne: function () {
        'use strict';
        alert('LEVEL 1 FINNS EJ ÄN');
        //this.state.start('Bana1'); <-- Byter till det state med referens "Bana1"
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