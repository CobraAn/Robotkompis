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
        this.load.image('titleScreen', '../../images/startBG600.png');
        
        //Bilder för MapOverview
        this.load.spritesheet('levelOne', '../../images/select_levelOne.png', 140, 140, 2);
        this.load.spritesheet('levelTwo', '../../images/select_levelTwo.png', 140, 140, 2);
        this.load.spritesheet('levelThree', '../../images/select_levelThree.png', 140, 140, 2);
        this.load.spritesheet('levelFour', '../../images/select_levelFour.png', 140, 140, 2);
        this.load.spritesheet('levelFive', '../../images/select_levelFive.png', 140, 140, 2);
        this.load.image('settingsIcon', '../../images/settingIcon.png');
        
        //Preload för allt i madness
        // FIRST: Figure out how to re-size the screen. Also blit it on a bigger format than 800 x 600.
        // Background
        this.load.image('bg', 'assets/1024_600_bg.jpg');

        this.load.tilemap('tilemap', 'assets/level0_pt2.json', null, Phaser.Tilemap.TILED_JSON);

        // Tilemap blocks
        this.load.image('ChestBlue', 'assets/ChestBlue.png');
        this.load.image('rocks', 'assets/rocks.png');
        this.load.image('berryBush', 'assets/qubodup-bush_berries_0.png');
        this.load.image('BigTree', 'assets/tree2-final.png');
        this.load.image('signpost-outsidestuff', 'assets/signpost-outsidestuff.png');
        this.load.image('Tile_14', 'assets/PNG/Tile_14.png');
        this.load.image('grassTiles', 'assets/grass_tiles.png');
        this.load.image('Object_1', 'assets/PNG/Object_1.png');

        // Commands
        this.load.image('up_com', 'assets/up_60.png');
        this.load.image('walk_com', 'assets/walk_60.png');
        this.load.image('fly_com', 'assets/fly.png');

        // New Command Button
        this.load.image('new', 'assets/new.png');
        this.load.image('trash_100', 'assets/trash_100.png');
        this.load.image('trash_50', 'assets/trash_50.png');

        //Command line :D
        this.load.image('com_line', 'assets/com_line.png');

        // Menu Buttons
        this.load.image('run_btn', 'assets/run_button.png');
        this.load.image('stop_btn', 'assets/stop_50.png');
        this.load.image('restart_btn', 'assets/restart_50.png');
        this.load.image('sound_btn', 'assets/sound_50.png');
        this.load.image('home_btn', 'assets/home_50.png');
        this.load.image('help_btn', 'assets/help_50.png');

        // Playable character
        this.load.spritesheet('switch', 'assets/Switch1_small.png', 80, 105);
       
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