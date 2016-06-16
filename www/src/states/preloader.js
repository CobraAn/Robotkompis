/* Attribution Section: 

Tilemap components, with the exception of the robots, are originally made by : Kenney @ http://opengameart.org/users/kenney [CC0 license]
The 5 playable robots are property of Kodcentrum and are originally made by Ellinor Hägg. More info @: http://www.kodboken.se/start/lana-bild-ljud/kodcentrums-robotar
The trash can icon is originally made by Andy (Open Clip Art Library image's page) [CC0], via Wikimedia Commons
Home icon is originally made by: Timothy Miller [CC BY-SA 3.0 (http://creativecommons.org/licenses/by-sa/3.0)], via Wikimedia Commons
The help icon has no known person to attribute but is under a MIT License and available at https://www.iconfinder.com/icons/211674/circled_help_icon#size=128
The play button is made by Hopstarter and is under a CC Attribution-Noncommercial-No Derivate 4.0 license [http://creativecommons.org/licenses/by-nc-nd/4.0/]. Hopstarter can be found at http://www.iconarchive.com/artist/hopstarter.html and http://hopstarter.deviantart.com/
The stop button is made By JustinForce (Own work inspired by Stop hand.svg:) [CC BY-SA 3.0 (http://creativecommons.org/licenses/by-sa/3.0) or GFDL (http://www.gnu.org/copyleft/fdl.html)], via Wikimedia Commons
The new page icon (used for the clear function) is under a CC0 license and can be found at https://pixabay.com/sv/dokument-papper-nya-registrera-dig-97577/
The refresh icon (used for generating a new newCommand) is made by Everaldo @ http://www.iconarchive.com/artist/everaldo.html, and is under a GNU Lesser General Public License (https://en.wikipedia.org/wiki/GNU_Lesser_General_Public_License)
The right and left arrow for the scrolling the command area are made By Kildor (Own work) [Public domain], via Wikimedia Commons @ (https://commons.wikimedia.org/wiki/File:ArrowRight.svg and https://commons.wikimedia.org/wiki/File:TriangleArrow-Left.svg)
The left and right arrows were modified by decreasing their width but not their height. 
In regards to all the menu icons, only the overall size was changed, and the width of the trash can and the arrow icons.  


*/
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
        //to change the sound in the game place another soundtrack in the sound file and change the name below to the new soundname. 
        //the ogg file is for firefox, because firefox can´t handle mp3 
        this.load.audio('sound', ['../../sound/DarkMatterInProgress_loop.mp3', '../../sound/DarkMatterInProgress_loop.ogg']);
        /*musik: Gustav Wall*/


        // Initiate loading screen
		this.preloadBar = this.add.sprite(this.world.centerX, this.world.centerY, 'preloadBar');
		this.preloadBar.anchor.setTo(0.5, 0.5);
		this.load.setPreloadSprite(this.preloadBar, 0);
		this.titleText = this.add.bitmapText(this.world.centerX, this.world.centerY - 200, 'titleFont', 'Robotkompis!', 110);
		this.titleText.anchor.setTo(0.5, 0.5);
        
        // Load all necessary assets
        
        // Footer
        this.load.bitmapFont('startFont', '../../fonts/startFont/font.png', '../../fonts/startFont/font.fnt');
        this.load.bitmapFont('titleFont', '../../fonts/titleFont/titleFont.png', '../../fonts/titleFont/titleFont.fnt');
        
        
        // Start menu
        this.load.spritesheet('startKnapp', '../../assets/startmenu/Startknapp_Spritesheet.png', 392, 165, 2);
        this.load.image('titleScreen', '../../assets/startmenu/startBG600.png');
        
        // Map overview
        this.load.spritesheet('levelSelect', '../../assets/mapoverview/select_levelNy.png', 100, 100);
        this.load.image('settingsIcon', '../../assets/mapoverview/settingIcon.png');
        this.load.spritesheet('menuArrows', '../../assets/mapoverview/menypilar.png', 116, 168);

        // TODO
        // FIRST: Figure out how to re-size the screen. Also blit it on a bigger format than 800 x 600.
        this.load.image('bg', '../../assets/startmenu/startBG600.png');

        // Maps
        //Could be used as an intro map: this.load.tilemap('tilemap0', '../../assets/maps/0.0x.json', null, Phaser.Tilemap.TILED_JSON);
        // World 1        
        this.load.tilemap('tilemap1', '../../assets/maps/1.0.json', null, Phaser.Tilemap.TILED_JSON);
        this.load.tilemap('tilemap2', '../../assets/maps/1.1.json', null, Phaser.Tilemap.TILED_JSON);
        this.load.tilemap('tilemap3', '../../assets/maps/1.2.json', null, Phaser.Tilemap.TILED_JSON);
        this.load.tilemap('tilemap4', '../../assets/maps/1.3.json', null, Phaser.Tilemap.TILED_JSON);
        this.load.tilemap('tilemap5', '../../assets/maps/1.4.json', null, Phaser.Tilemap.TILED_JSON);
        //World 2
        
        this.load.tilemap('tilemap6', '../../assets/maps/2.0x.json', null, Phaser.Tilemap.TILED_JSON);
        this.load.tilemap('tilemap7', '../../assets/maps/2.1x.json', null, Phaser.Tilemap.TILED_JSON);
        this.load.tilemap('tilemap8', '../../assets/maps/2.2x.json', null, Phaser.Tilemap.TILED_JSON);
        this.load.tilemap('tilemap9', '../../assets/maps/2.3x.json', null, Phaser.Tilemap.TILED_JSON);
        this.load.tilemap('tilemap10', '../../assets/maps/2.4x.json', null, Phaser.Tilemap.TILED_JSON);
        
        // Spritesheets        
        this.load.image('ground', '../../assets/spritesheets/spritesheet_ground2.png');
        this.load.image('items', '../../assets/spritesheets/spritesheet_items.png');        
        this.load.image('tiles', '../../assets/spritesheets/spritesheet_tiles.png');
        this.load.image('newdesert', '../../assets/backgrounds/newdesert.jpg');
        this.load.image('iceland', '../../assets/backgrounds/iceland.png');
        this.load.image('ice32xx', '../../assets/spritesheets/ice32xx.png');        
        this.load.image('icetiles32x', '../../assets/spritesheets/icetiles32x.png');

        // Commands
        this.load.image('up_com', '../../assets/actionicons/uparrow_60.png');
        this.load.image('walk_right_com', '../../assets/actionicons/Rightarrow_60.png');
        this.load.image('walk_left_com', '../../assets/actionicons/leftarrow_60.png');

        this.load.image('down_com', '../../assets/actionicons/downarrow_60.png');
        this.load.image('hop_left_com', '../../assets/actionicons/hop_left_60.png');
        this.load.image('hop_right_com', '../../assets/actionicons/hop_right_60.png');
        this.load.image('ladder_com', '../../assets/actionicons/ladder_60.png');
        this.load.image('key_com', '../../assets/actionicons/key_60.png');

        // New Command Button
        this.load.image('new', '../../assets/commandstuff/restart_60.png');
        this.load.image('clearButton', '../../assets/commandstuff/clear_50.png'); // CC0 License
        // Trash icon By Andy (Open Clip Art Library image's page) [CC0], via Wikimedia Commons
        this.load.image('trashButton', '../../assets/commandstuff/trash_50.png'); 
        // Command line
        this.load.image('commandLine', '../../assets/commandstuff/com_line.png');

        this.load.image('right20', '../../assets/commandstuff/right_arrow_20.png');
        this.load.image('left20', '../../assets/commandstuff/left_arrow_20.png');

        // Menu Buttons
        this.load.image('runButton', '../../assets/menubuttons/run_button.png');
        this.load.image('stopButton', '../../assets/menubuttons/stop_50.png');
        this.load.image('soundButton', '../../assets/menubuttons/sound_50.png');
        this.load.image('homeButton', '../../assets/menubuttons/home_50.png');
        this.load.image('helpButton', '../../assets/menubuttons/help_50.png');
        
        this.load.image('commandArrow', '../../assets/pilar/commandopil.png');
        this.load.image('functionArrow', '../../assets/pilar/funkpil.png');
        this.load.image('goArrow', '../../assets/pilar/gopil.png');
        this.load.image('arrowMute', '../../assets/pilar/pilmute.png');
        this.load.image('rowArrow', '../../assets/pilar/radpil.png');
        this.load.image('homeArrow', '../../assets/pilar/Pilhem.png');
        this.load.image('clearArrow', '../../assets/pilar/clearpil.png');
        this.load.image('homeArrow', '../../assets/pilar/Pilhem.png');
        this.load.image('moveArrow', '../../assets/pilar/movepil.png');
        
        
        // Images for settings-state
        this.load.image('backButton', '../../assets/settings/bakpil.png');
        this.load.spritesheet('muteUnMute', '../../assets/settings/muteUnMute.png', 82, 75, 2);
        this.load.image('tutBtn', '../../assets/settings/tutBtn.png');
        this.load.image('settingsCloud', '../../assets/settings/SettingscloudSmall.png')
        
        // For the robot-choosing-popup-meny
        this.load.spritesheet('robotButton', '../../assets/robotar/robotar.png', 130, 190);
        this.load.image('closeButton', '../../assets/robotar/close.png');
        this.load.image('robotChoiseBackground', '../../assets/robotar/robotChoiseBackground.png');
        //big robotar for buttons in the robot-choosing meny.
        this.load.image('whileChoise', '../../assets/robotar/while.png');
        this.load.image('gotoChoise', '../../assets/robotar/Goto.png');
        this.load.image('ifChoise', '../../assets/robotar/if.png');
        this.load.image('switchChoise', '../../assets/robotar/switch.png');
        this.load.image('elseChoise', '../../assets/robotar/Else.png');
        
        
        // Playable characters
        // Spritesheets containing assets for jump, walk, climb and idle animations
        this.load.spritesheet('else', '../../assets/robotsResized/Else1Walk.png', 30, 42);
        this.load.spritesheet('goto', '../../assets/robotsResized/goto1Walk.png', 30, 49);
        this.load.spritesheet('if', '../../assets/robotsResized/if1Walk.png', 30, 59);
        this.load.spritesheet('while', '../../assets/robotsResized/while1Walk.png', 30, 38);
        this.load.spritesheet('switch', '../../assets/robotsResized/switchSpritesheetWalk.png', 30, 37);

        // Own-defined functions
        this.load.spritesheet('func_button', '../../assets/function/favx.png', 50, 50, 2);
        this.load.image('func_delete', '../../assets/function/TA_BORT1.png');
        this.load.image('func_create', '../../assets/function/TA_SKAPA1.png');
        this.load.image('func_save', '../../assets/function/TA_SPARA1.png');
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
        this.load.image('funcTitle','../../assets/function/func_title.png');
        this.load.image('funcLine','../../assets/function/func_line.png');
        this.load.image('temp1','../../assets/function/TEMP1.png');


        // Win Screen
        this.load.image('starr','../../assets/winscreen/da_star.png');       
        this.load.image('you_won','../../assets/winscreen/you_won.png');  
        this.load.image('continue','../../assets/winscreen/continue.png');      

	},
	create: function () {
        'use strict';
        //for the music to start and loop.
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