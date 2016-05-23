RobotKompis.Preloader = function (game) {
    'use strict';
	this.preloadBar = null;
	this.titleText = null;
	this.ready = false;
    this.music;
};

RobotKompis.Preloader.prototype = {
	preload: function () {
        'use strict';
        this.load.audio('sound', ['../../assets/ljud/happy.mp3', '../../assets/ljud/happy.ogg']);
        //Saker som visas medan allt laddas
        //this.load.audio('sound', '../../sound/mainTheme.mp3');
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
        this.load.spritesheet('levelSelect', '../../assets/level_select_buttons/select_levelNY.png', 100, 100, 6);
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
        //1.0x - 1.4x
        this.load.tilemap('tilemap0', '../../assets/maps/0.0x.json', null, Phaser.Tilemap.TILED_JSON);
        this.load.tilemap('tilemap1', '../../assets/maps/1.0x.json', null, Phaser.Tilemap.TILED_JSON);
        this.load.tilemap('tilemap2', '../../assets/maps/1.1x.json', null, Phaser.Tilemap.TILED_JSON);
        this.load.tilemap('tilemap3', '../../assets/maps/1.2x.json', null, Phaser.Tilemap.TILED_JSON);
        this.load.tilemap('tilemap4', '../../assets/maps/1.3x.json', null, Phaser.Tilemap.TILED_JSON);
        this.load.tilemap('tilemap5', '../../assets/maps/1.4x.json', null, Phaser.Tilemap.TILED_JSON);
        this.load.image('ground', '../../assets/kenney32/spritesheet_ground2.png');
        this.load.image('items', '../../assets/kenney32/spritesheet_items.png');
        this.load.image('tiles', '../../assets/kenney32/spritesheet_tiles.png');
        this.load.image('background', '../../assets/backgrounds/newdesert.jpg');

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
        
        this.load.image('commandopil', '../../assets/pilar/commandopil.png');
        this.load.image('funkpil', '../../assets/pilar/funkpil.png');
        this.load.image('gopil', '../../assets/pilar/gopil.png');
        this.load.image('pilmute', '../../assets/pilar/pilmute.png');
        this.load.image('radpil', '../../assets/pilar/radpil.png');
        this.load.image('homepil', '../../assets/pilar/Pilhem.png');
        this.load.image('clearpil', '../../assets/pilar/clearpil.png');
        this.load.image('homepil', '../../assets/pilar/Pilhem.png');
        this.load.image('movepil', '../../assets/pilar/movepil.png');
        
        // Images for settings-state
        this.load.image('backButton', '../../images/bakpil.png');
        //this.load.image('muteButton', '../../images/mute.png');
        //this.load.image('unMuteButton', '../../images/unmute.png');
        this.load.spritesheet('muteUnMute', '../../images/muteUnMute.png', 82, 75, 2);
        this.load.image('tutBtn', '../../images/tutBtn.png');
        //this.load.image('settingsCloud', '../../images/Settingscloud.png');
        this.load.image('settingsCloud', '../../images/SettingscloudSmall.png')
        
        //for the robot-choosing-popup-meny
        this.load.spritesheet('robotButton', '../../assets/robotar/robotar.png', 130, 190);
        this.load.image('closeButton', '../../assets/close.png');
        this.load.image('robotChoiseBackground', '../../assets/robotChoiseBackground.png');
        this.load.image('whileChoise', '../../assets/robotar/while.png');
        this.load.image('gotoChoise', '../../assets/robotar/goto.png');
        this.load.image('ifChoise', '../../assets/robotar/if.png');
        this.load.image('switchChoise', '../../assets/robotar/switch.png');
        this.load.image('elseChoise', '../../assets/robotar/else.png');
        
        
        // Playable character
        //this.load.spritesheet('switch', '../../assets/Switch1_small.png', 80, 105);

        this.load.spritesheet('else', '../../assets/robotsResized/else1Walk.png', 30, 42);
        this.load.spritesheet('goto', '../../assets/robotsResized/goto1Walk.png', 30, 49);
        this.load.spritesheet('if', '../../assets/robotsResized/if1Walk.png', 30, 59);
        //this.load.spritesheet('switch', '../../assets/robotsResized/switch1.png', 30, 37);
        this.load.spritesheet('while', '../../assets/robotsResized/while1Walk.png', 30, 38);
        //spritesheet for switch med animation för att hoppa
        this.load.spritesheet('switchAni', '../../assets/robotsResized/switchSpritesheetWalk.png', 30, 37);

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
        this.load.image('f7', '../../assets/function/f7.png');
        this.load.image('f8', '../../assets/function/f8.png');
        this.load.image('cloud','../../assets/function/the_cloud.png');
        this.load.image('func_title','../../assets/function/func_title.png');
        this.load.image('temp1','../../assets/function/TEMP1.png');

        //this.load.image('cloud','../../assets/favx_cloud1.png');       

    

	},
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