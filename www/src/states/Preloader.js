RobotKompis.Preloader = function (game) {
    'use strict';
	this.preloadBar = null;
	this.titleText = null;
	this.ready = false;
};

RobotKompis.Preloader.prototype = {
	preload: function () {
        'use strict';
		this.preloadBar = this.add.sprite(this.world.centerX, this.world.centerY, 'preloadBar');
		this.preloadBar.anchor.setTo(0.5, 0.5);
		this.load.setPreloadSprite(this.preloadBar);
		this.titleText = this.add.image(this.world.centerX, this.world.centerY - 220, 'titleimage');
		this.titleText.anchor.setTo(0.5, 0.5);
        
        this.load.image('titleScreen', '../../images/startBG.png');
        this.load.image('cogwheel', '../../images/settingIcon.png');
        this.load.bitmapFont('startFont', '../../fonts/startFont/font.png', '../../fonts/startFont/font.fnt');
	},
	create: function () {
        'use strict';
		this.preloadBar.cropEnabled = false;
	},
	update: function () {
        'use strict';
		this.ready = true;
        this.state.start('StartMenu');
	}
};