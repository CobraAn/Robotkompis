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
		this.load.setPreloadSprite(this.preloadBar, 0);
		this.titleText = this.add.bitmapText(this.world.centerX, this.world.centerY - 200, 'titleFont', 'Robotkompis!', 110);
		this.titleText.anchor.setTo(0.5, 0.5);
        
    
        //Här under laddar man in alla assets som ska användas, som t.ex bakgrundsbilder osv
        
        //Här laddas fonter om det behövs
        this.load.bitmapFont('startFont', '../../fonts/startFont/font.png', '../../fonts/startFont/font.fnt');
        this.load.bitmapFont('titleFont', '../../fonts/titleFont/titlefont.png', '../../fonts/titleFont/titlefont.fnt');
        this.load.bitmapFont('numberFont', '../../fonts/numberFont/font.png', '../../fonts/numberFont/font.fnt');
        
        //Bilder för StartMenu
        this.load.spritesheet('startKnapp', '../../images/Startknapp_Spritesheet.png', 392, 165, 2);
        this.load.image('titleScreen', '../../images/startBG600.png');
        
        //Bilder för MapOverview
        this.load.spritesheet('levelSelect', '../../assets/level_select_buttons/select_level1.png', 100, 100, 3);
        this.load.image('settingsIcon', '../../images/settingIcon.png');
        this.load.spritesheet('menuArrows', '../../assets/level_select_buttons/menypilar.png', 116, 168);
        
        //Preload för allt i madness
        // FIRST: Figure out how to re-size the screen. Also blit it on a bigger format than 800 x 600.

        // Background
        //this.load.image('bg', '../../assets/1024_600_bg.jpg');
        //this.load.image('bg', '../../assets/wires_1050.png');
        //this.load.image('bg', '../../assets/backgrounds/desert.jpg');
        this.load.image('bg', '../../images/startBG600.png');

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
        this.load.image('new', '../../assets/restart_60.png');
        this.load.image('clear_btn', '../../assets/clear_50.png'); // CC0 License
        this.load.image('trash_100', '../../assets/trash_100.png');
        this.load.image('trash_50', '../../assets/trash_50.png'); // CC0 license

        //Command line :D
        this.load.image('com_line', '../../assets/com_line.png');

        this.load.image('right20', '../../assets/right_arrow_20.png');
        this.load.image('left20', '../../assets/left_arrow_20.png');

        // Menu Buttons
        this.load.image('run_btn', '../../assets/run_button.png');
        this.load.image('stop_btn', '../../assets/stop_50.png');
        // this.load.image('restart_btn', '../../assets/restart_50.png'); // Not currently used. Kind-of-ish replaced by clear_btn.
        this.load.image('sound_btn', '../../assets/sound_50.png');
        this.load.image('home_btn', '../../assets/home_50.png');
        this.load.image('help_btn', '../../assets/help_50.png');
        
        // Images for settings-state
        this.load.image('backButton', '../../images/bakpil.png');
        //this.load.image('muteButton', '../../images/mute.png');
        //this.load.image('unMuteButton', '../../images/unmute.png');
        this.load.spritesheet('muteUnMute', '../../images/muteUnMute.png', 82, 75, 2);
        this.load.image('tutBtn', '../../images/tutBtn.png');
        

        // Playable character
        //this.load.spritesheet('switch', '../../assets/Switch1_small.png', 80, 105);

        this.load.spritesheet('else', '../../assets/robotsResized/else1.png', 30, 42);
        this.load.spritesheet('goto', '../../assets/robotsResized/goto1.png', 30, 49);
        this.load.spritesheet('if', '../../assets/robotsResized/if1.png', 30, 59);
        this.load.spritesheet('switch', '../../assets/robotsResized/switch1.png', 30, 37);
        this.load.spritesheet('while', '../../assets/robotsResized/while1.png', 30, 38);
        //spritesheet for switch med animation för att hoppa
        this.load.spritesheet('switchAni', '../../assets/robotsResized/switchSpritesheet.png', 30, 37);

        // Own-defined FUNCTIONS !!!!!!!!!!!!!!!!!!!!!
        this.load.spritesheet('func_button', '../../assets/function/favx.png', 50, 50, 2);
        this.load.image('func_delete', '../../assets/function/TA_BORT1.png');
        this.load.image('func_create', '../../assets/function/TA_SKAPA1.png');
        this.load.image('func_save', '../../assets/function/TA_SPARA1.png');
        //this.load.image('func_new', '../../assets/function/TA_NY_FUNK1.png');
        this.load.image('func_edit', '../../assets/function/TA_ANDRA1.png');
        this.load.image('func_cancel', '../../assets/function/TA_AVBRYT1.png');
        this.load.image('func_make', '../../assets/function/klick_att_skapa.png');        
        this.load.image('f1', '../../assets/function/f1.png');
        this.load.image('f2', '../../assets/function/f2.png');
        this.load.image('f3', '../../assets/function/f3.png');
        this.load.image('f4', '../../assets/function/f4.png');
        this.load.image('f5', '../../assets/function/f5.png');
        this.load.image('f6', '../../assets/function/f6.png');
        this.load.image('cloud','../../assets/function/func_cloud3.png');
        this.load.image('temp1','../../assets/function/TEMP1.png');

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