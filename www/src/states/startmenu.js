RobotKompis.StartMenu = function (game) {
    'use strict';
    this.startBG;
    this.StartKnapp;
    this.test;
};

RobotKompis.StartMenu.prototype = {
    
    create: function () {
        'use strict';
        this.startBG = this.add.image(0, 0, 'titleScreen');
        this.StartKnapp = this.add.button(this.world.centerX - 210, this.world.centerY + 30, 'startKnapp', this.startGame, this, 0, 0, 1);
    },
    
    startGame: function (pointer) {
        'use strict';
        this.state.start('MapOverview');
    }
};