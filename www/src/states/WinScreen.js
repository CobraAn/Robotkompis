RobotKompis.WinScreen = function (game) {
    'use strict';
    this.preloadBar = null;
    this.titleText = null;
    this.ready = false;
    this.music;
};

RobotKompis.WinScreen.prototype = {

    create: function () {
        'use strict';
        this.preloadBar.cropEnabled = false;
        this.music = this.add.audio('sound');
        this.music.play();
        this.music.volume = 0.5;
        this.music.loopFull();
        this.ready = true;
   
    },
    update: function () {
        'use strict';
        this.ready = true;
        this.state.start('StartMenu');
    }
};

//390X165