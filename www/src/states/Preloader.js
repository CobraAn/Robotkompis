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
        this.load.spritesheet('startKnapp', '../../images/Startknapp_Spritesheet.png', 392, 165, 2);
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
        this.load.image('bg', '../../assets/1024_600_bg.jpg');

        //Maps
        //this.load.tilemap('tilemap', 'assets/maps/mu.json', null, Phaser.Tilemap.TILED_JSON);        
        //this.load.image('gameTiles', 'assets/newTiles/kennyspritesheet.png');
        //1.0
        this.load.tilemap('tilemap1', 'assets/maps/1.0.json', null, Phaser.Tilemap.TILED_JSON);
        this.load.image('ground', 'assets/kenney32/spritesheet_ground.png');
        this.load.image('items', 'assets/kenney32/spritesheet_items.png');
        this.load.image('tiles', 'assets/kenney32/spritesheet_tiles.png');
        this.load.image('background', 'assets/backgrounds/newdesert.jpg');

        // Spritesheets
        //this.load.image('gameTiles', '../../assets/newTiles/kennyspritesheet.png');

        // Commands
        this.load.image('up_com', '../../images/actionicons/uparrow_60.png');
        this.load.image('walk_right_com', '../../images/actionicons/Rightarrow_60.png');
        this.load.image('walk_left_com', '../../images/actionicons/leftarrow_60.png');

        this.load.image('down_com', '../../images/actionicons/downarrow_60.png');
        this.load.image('hop_left_com', '../../images/actionicons/hop_left_60.png');
        this.load.image('hop_right_com', '../../images/actionicons/hop_right_60.png');
        this.load.image('ladder_com', '../../images/actionicons/ladder_60.png');
        this.load.image('key_com', '../../images/actionicons/key_60.png');

        // New Command Button
        this.load.image('new', '../../assets/new.png');
        this.load.image('clear_btn', '../../assets/clear_50.png'); // CC0 License
        this.load.image('trash_100', '../../assets/trash_100.png');
        this.load.image('trash_50', '../../assets/trash_50.png'); // CC0 license

        //Command line :D
        this.load.image('com_line', '../../assets/com_line.png');

        // Menu Buttons
        this.load.image('run_btn', '../../assets/run_button.png');
        this.load.image('stop_btn', '../../assets/stop_50.png');
        // this.load.image('restart_btn', '../../assets/restart_50.png'); // Not currently used. Kind-of-ish replaced by clear_btn.
        this.load.image('sound_btn', '../../assets/sound_50.png');
        this.load.image('home_btn', '../../assets/home_50.png');
        this.load.image('help_btn', '../../assets/help_50.png');
        this.load.image('robotBotton', '../../assets/Switch1_small.png');
        
        // Playable character
        this.load.spritesheet('switch', '../../assets/Switch1_small.png', 80, 105);
        this.load.spritesheet('while', '../../assets/while1.png', 30, 64);
        
        //for the robot-choosing-popup-meny
        this.load.image('closeButton', '../../assets/close.png');
        this.load.image('robotChoise', '../../assets/robotchoise.png');

        // Own-defined FUNCTIONS !!!!!!!!!!!!!!!!!!!!!
        this.load.spritesheet('func_button', '../../assets/function/favx.png', 50, 50, 2);
        this.load.spritesheet('func_delete', '../../assets/function/sheet_func_delete.png', 160, 50, 2);
        this.load.spritesheet('func_create', '../../assets/function/sheet_func_create.png', 160, 50, 2);
        this.load.spritesheet('func_new', '../../assets/function/sheet_func_new.png', 160, 50, 2);
        this.load.spritesheet('func_edit', '../../assets/function/sheet_func_change.png', 160, 50, 2);
        this.load.image('f1', '../../assets/function/f1.png');
        this.load.image('f2', '../../assets/function/f2.png');
        this.load.image('f3', '../../assets/function/f3.png');
        this.load.image('f4', '../../assets/function/f4.png');
        this.load.image('f5', '../../assets/function/f5.png');
        this.load.image('f6', '../../assets/function/f6.png');
        this.load.image('cloud','../../assets/function/func_cloud3.png');       
        //this.load.image('cloud','../../assets/favx_cloud1.png');       
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