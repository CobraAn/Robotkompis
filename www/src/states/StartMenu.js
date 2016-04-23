RobotKompis.StartMenu = function (game) {
    'use strict';
    this.startBG;
    this.startPrompt;
};

RobotKompis.StartMenu.prototype = {
    
    create: function () {
        'use strict';
        this.startBG = this.add.image(0, 0, 'titleScreen');
        this.startBG = this.add.image(885, 10, 'cogwheel');
        this.startBG.inputEnabled = true;
        this.startBG.events.onInputDown.addOnce(this.startGame, this);
        
        this.startPrompt = this.add.bitmapText(this.world.centerX - 190, this.world.centerY + 130, 'startFont', 'Touch to Start!', 50);
    },
    
    startGame: function (pointer) {
        'use strict';
        this.state.start('Game');
    }
};