RobotKompis.StartMenu = function (game) {
    'use strict';
    this.startBG;
    this.startPrompt;
    this.kalle;
};

RobotKompis.StartMenu.prototype = {
    
    create: function () {
        'use strict';
        this.startBG = this.add.image(0, 0, 'titleScreen');
        this.startBG.inputEnabled = true;
        this.kalle = this.add.image(300,440,'kalleButton')
        
        this.startBG.events.onInputDown.addOnce(this.startGame, this);
        
        this.startPrompt = this.add.bitmapText(this.world.centerX - 190, this.world.centerY + 130, 'startFont','', 50);
    },
    
    startGame: function (pointer) {
        'use strict';
        this.state.start('Game');
    }
};