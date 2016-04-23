var RobotKompis = {};

RobotKompis.Boot = function (game) {
    'use strict';
};

RobotKompis.Boot.prototype = {
	preload: function () {
        'use strict';
		this.load.image('preloadBar', '../../images/loader_bar.png');
		this.load.image('titleimage', '../../images/titleImage.png');
	},

	create: function () {
        'use strict';
		this.input.maxPointers = 1;
		this.scale.pageAlignHorizontally = true;
		this.scale.pageAlignVertically = true;
		this.stage.forceLandscape = true;

		this.input.addPointer();
		this.stage.backgroundColor = '#bffeff';

		this.state.start('Preloader');
	}
};