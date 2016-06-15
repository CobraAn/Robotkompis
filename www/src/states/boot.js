var RobotKompis = {};

RobotKompis.Boot = function (game) {
    'use strict';
};

RobotKompis.Boot.prototype = {
    /**
     * Loads necessary graphics
     */
	preload: function () {
        'use strict';
		this.load.image('preloadBar', '../../assets/startmenu/loader_bar.png');
        this.load.bitmapFont('titleFont', '../../fonts/titleFont/titleFont.png', '../../fonts/titleFont/titleFont.fnt');
	},

    /**
     * Creates the game interface
     */
	create: function () {
        'use strict';
		this.input.maxPointers = 1;
        this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.scale.minWidth = 1024;
        this.scale.minHeight = 600;
        this.scale.maxWidth = 1024;
        this.scale.maxHeight = 600;
        this.scale.forceLandscape = true;
        this.scale.pageAlignHorizontally = true;
        this.scale.updateLayout (true);

		this.input.addPointer();
		this.stage.backgroundColor = '#bffeff';

		this.state.start('Preloader');
	}
};