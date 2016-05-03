var RobotKompis = {};

RobotKompis.Boot = function (game) {
    'use strict';
};

RobotKompis.Boot.prototype = {
	preload: function () {
        'use strict';
		this.load.image('preloadBar', '../../images/loader_bar.png');
        this.load.bitmapFont('titleFont', '../../fonts/titleFont/titlefont.png', '../../fonts/titleFont/titlefont.fnt');
	},

	create: function () {
        'use strict';
		this.input.maxPointers = 1;
		//this.scale.pageAlignHorizontally = true;
		//this.scale.pageAlignVertically = true;
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
        //#cb3535
		this.state.start('Preloader');
	}
};