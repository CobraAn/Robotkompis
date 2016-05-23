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
        this.da_starr1 = this.add.sprite(140, 100, 'starr');
        this.da_starr2 = this.add.sprite(420, 60, 'starr');
        this.da_starr3 = this.add.sprite(700, 100, 'starr');
        this.you_won = this.add.sprite(220, 280, 'you_won');
        this.continue = this.add.sprite(300,430, 'continue');
        this.continue.inputEnabled = true;
        this.continue.input.useHandCursor = true;
        this.continue.events.onInputDown.add(this.goToMapOverview, this);
    },
    goToMapOverview: function(){
        console.log("Va?")
        this.state.start('MapOverview');
    },
    update: function () {
        'use strict';
    },


};

//390X165