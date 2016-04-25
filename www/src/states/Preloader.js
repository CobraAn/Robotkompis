RobotKompis.Preloader = function (game) {
    'use strict';
	this.preloadBar = null;
	this.titleText = null;
	this.ready = false;
};

RobotKompis.Preloader.prototype = {
	preload: function () {
        'use strict';
        //Saker som visas medan allt laddas
		this.preloadBar = this.add.sprite(this.world.centerX, this.world.centerY, 'preloadBar');
		this.preloadBar.anchor.setTo(0.5, 0.5);
		this.load.setPreloadSprite(this.preloadBar);
		this.titleText = this.add.image(this.world.centerX, this.world.centerY - 220, 'titleimage');
		this.titleText.anchor.setTo(0.5, 0.5);
        
        
        //Här under laddar man in alla assets som ska användas, som t.ex bakgrundsbilder osv
        
        //Här laddas fonter om det behövs
        this.load.bitmapFont('startFont', '../../fonts/startFont/font.png', '../../fonts/startFont/font.fnt');
        
        //Bilder för StartMenu
        this.load.spritesheet('startKnapp', '../../images/StartKnapp_spritesheet.png', 392, 165, 2);
        this.load.image('titleScreen', '../../images/startBG.png');
        
        //Bilder för MapOverview
        this.load.spritesheet('levelOne', '../../images/select_levelOne.png', 140, 140, 2);
        this.load.spritesheet('levelTwo', '../../images/select_levelTwo.png', 140, 140, 2);
        this.load.spritesheet('levelThree', '../../images/select_levelThree.png', 140, 140, 2);
        this.load.spritesheet('levelFour', '../../images/select_levelFour.png', 140, 140, 2);
        this.load.spritesheet('levelFive', '../../images/select_levelFive.png', 140, 140, 2);
        this.load.image('settingsIcon', '../../images/settingIcon.png');
       
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

//390X165