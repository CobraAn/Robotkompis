RobotKompis.WinScreen = function (game) {
    'use strict';
    this.da_starr1;
    this.da_starr2;
    this.da_starr3;
    this.you_won;
    this.continue;

};

RobotKompis.WinScreen.prototype = {
    
    create: function () {
        'use strict';
        this.da_starr1 = this.add.sprite(220, 180, 'starr');
        this.da_starr1.anchor.setTo(0.5, 0.5);
        this.da_starr1.angle = 45;
        this.da_starr2 = this.add.sprite(500, 140, 'starr');
        this.da_starr2.anchor.setTo(0.5, 0.5);
        this.da_starr3 = this.add.sprite(780, 180, 'starr');
        this.da_starr3.anchor.setTo(0.5, 0.5);
        this.da_starr3.angle = -45;
        this.you_won = this.add.sprite(220, 280, 'you_won');
        this.continue = this.add.sprite(300,430, 'continue');
        this.continue.inputEnabled = true;
        this.continue.input.useHandCursor = true;
        this.continue.events.onInputDown.add(this.goToMapOverview, this);
    },
    goToMapOverview: function(){
        this.state.start('MapOverview');
    },
    update: function () {
        'use strict';
    },


};