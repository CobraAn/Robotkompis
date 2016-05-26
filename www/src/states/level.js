RobotKompis.Level = function (game) {
    // Tilemap variables.
    this.map;
    this.layer0;
    this.layer1;
    this.layer2;
    this.layer3;
    this.layer4;
    this.layer5;
    
    this.commandopil;
    this.funkpil;
    this.gopil;
    this.pilmute;
    this.radpil;
    this.pilar;

    // The robot player
    this.player;
    this.robot;

    // Button variables.
    this.run_btn;
    this.stop_btn;
    this.restart_btn;
    this.home_btn;
    this.sound_btn;
    this.help_btn;

    // Storage variable
    this.saveDataArgs = {};

    this.func_btn; // Function button ( I <3 f(x) ).
    this.cloud;    // Cloud-window of the function-edit-menu.
    this.func_create_array = []; // Array of 8 transparrent "KLICK ATT SKAPA"sprites
    this.func_image_array = [null,'f1','f2','f3','f4','f5','f6', 'f7', 'f8']; // Images served to create function sprites. They are put in array in order to ease indexing and avoid repeated code. 
    this.func_sprite_array = []; // Array of original function sprites (sometimes needed)
    this.depthCount = 0; // Counts how deep we are located in the function in the function in the function in the function......
    this.func_line_group; // This is the tempopary group where the sequence of command or/and function sprites are stored then tobe saved in a particular place corresponding to a paticular function number in func_tree_group.
    this.func_tree_group; // In this group the sequences (groups) of sprites are stored under the index corresponding to the particular function number. NB! Groups in Phaser work as "trees". 
    this.index_tree_array = []; // This array serves as a 2D matrix to follow the the function recursion process. Objects of this array are 2-object-long arrays: 1st object in them is index/number of the function in func_image_array; 2nd object is index of the place of this function in the current line.  
    this.func_title; // Title sprite in the function edit popUp. 
    this.command_array = []; // This is the ultimate array from which robot's movement commands are readed in the update-function.

    //Check used for animations, e.g 0 means idle animation
    this.animationCheck = 0;

    // Tween for animations
    this.tween;

    // MAD STUFF BELOW !
    
    // HI GUYS! We have two little adoptees from MapOverview.js:
    //this.commandKeys
    //this.tilemapKey

    // Command_line array which contains all the commands.
    this.com_line; // This is just a graphics object. Kept to render things.
    this.commandGroup;
    this.currentSpriteGroup; // BECAUSE YEAH, PHASER WANTS IT THAT WAY *HURR DURR DURR* (it exists to be able to place sprites above the commandGroup)
    this.rightArrow20;
    this.leftArrow20;  
    this.funcRightArrow20;
    this.funcLeftArrow20; 

    // These two variables hold the original and new X position along with the curren commandLine index of the command being dragged.
    this.oldPosX; // oldPosY doesn't exist because it's always 510.
    this.oldPosY;
    this.newPosX;
    this.newPosY;
    this.commandLineIndex;
    this.comKey = "nope";  

    this.finalPosX; 
    this.finalPosY;
    this.runInitiated = false;
    this.comArrIndex = 0;
    this.smallerThan = false; 
    this.ladderPosX = 0; // NOT NEEDED
    this.ladderOverlap = false;
    this.doorOverlap = false;
    this.wrongCommand = false;
    this.doorX = 0;
    this.doorY = 0;
    this.downActive = false;

    this.newCommand;

    this.new_btn;
    this.clear_btn;
    this.trash_50;
    this.trash_100;
    
};

RobotKompis.Level.prototype = {
    /*
     * Initiates variables needed for the level creation and storage
     */

    init: function (character, levelName){
        this.robot = character;
        this.saveDataArgs.robot = character;
        this.saveDataArgs.levelName = levelName;
    },
    
    create: function () {

        this.physics.startSystem(Phaser.Physics.ARCADE);
        
        this.add.image(0, 0, 'bg');
    
        var graphics = new Phaser.Graphics(this, 0, 0);
        this.cloud = this.add.image(430, 50, 'settingsCloud');
        this.cloud.bringToTop();
        this.cloud.visible = false;

        //  Set the world (global) gravity
        this.physics.arcade.gravity.y = 2500;

        graphics = this.add.graphics(0, 0); // Needed for gravity
        this.map = this.add.tilemap(this.tilemapKey); // Passed on from MapOverview

        // Tilesets
        this.map.addTilesetImage('spritesheet_ground2', 'ground');
        this.map.addTilesetImage('spritesheet_items', 'items');
        this.map.addTilesetImage('spritesheet_tiles', 'tiles');
        this.map.addTilesetImage('newdesert', 'background');

        // Layers
        this.layer0 = this.map.createLayer('background');
        this.layer1 = this.map.createLayer('water');
        this.layer3 = this.map.createLayer('unblocked');
        this.layer2 = this.map.createLayer('blocked');        
        this.layer4 = this.map.createLayer('ladder');
        this.layer5 = this.map.createLayer('door');
    
        // Activate collision tiles from blocked layer
        this.map.setCollisionBetween(1, 5000, true, 'blocked');

        // Create the player
        this.player = this.add.sprite(95, this.world.height - 280, this.robot);
        this.physics.arcade.enable(this.player);
        this.physics.enable( [ this.player ], Phaser.Physics.ARCADE);
        // Centers the player in one 32x32 tile.
        this.player.anchor.setTo(1.0, 1.0);
        this.player.body.collideWorldBounds = true;
        this.player.body.moves = true;
        this.player.body.gravity.y = 1000;
        this.tween = this.add.tween(this.player); // For movement in listener. 
        
        // Animation
        this.player.animations.add('jumpRight', [6], 1, false);
        this.player.animations.add('jumpLeft', [11], 1, false);
        this.player.animations.add('walkRight', [3, 4, 5], 6, false);
        this.player.animations.add('walkLeft', [8, 9, 10], 6, false);
        this.player.animations.add('idle', [0, 1, 2], 4.5, false);
        this.player.animations.add('climb', [7], 1, false);

        // Ladder layer collisions
        this.map.setCollisionBetween(1, 5000, false, 'ladder');
        this.map.setCollisionBetween(1, 5000, true, 'water');
        this.game.physics.arcade.enable(this.layer1); // The water layer
        this.physics.enable( [ this.layer1 ], Phaser.Physics.ARCADE);
        this.game.physics.arcade.collide(this.player, this.layer1, this.waterHit);
        this.game.physics.arcade.enable(this.layer4); // The ladder layer
        this.physics.enable( [ this.layer4 ], Phaser.Physics.ARCADE);
        this.game.physics.arcade.collide(this.player, this.layer4, this.ladderHit);


        // Block Library
        graphics.lineStyle(0);
        graphics.beginFill(0x000000);
        graphics.drawRect(840, 500, 170, 80);
        graphics.endFill();

        // White
        graphics.lineStyle(0);
        graphics.beginFill(0xFFFFFF);
        graphics.drawRect(843, 503, 163, 73);
        graphics.endFill();

        // "New" and trash buttons
        this.new_btn = this.add.sprite(930, 510, 'new');
        this.new_btn.inputEnabled = true;
        this.new_btn.events.onInputDown.add(this.newCycle, this);

        this.clear_btn = this.add.sprite(970, 370, 'clear_btn'); // Not entirely square so it has some offset to make it seem like it. 
        this.clear_btn.inputEnabled = true;
        this.clear_btn.events.onInputDown.add(this.clearCommandLine, this);
        
        this.trash_50 = this.add.sprite(965, 430, 'trash_50');
        this.trash_100 = this.add.sprite(915, 380, 'trash_100');
        this.trash_100.visible = false;


        // Settings for own functions
        this.func_btn = this.add.button(965, this.world.height - 410 , 'func_button', this.favxOnClick, this, 2, 1, 0);
        this.cloud = this.add.sprite(140, 110, 'cloud');
        this.cloud.alpha = 0.6;
        this.cloud.visible = false;
        this.func_title = this.add.sprite(200, 130, 'func_title');
        this.func_title.alpha = 0.6;
        this.func_title.visible = false;     
        this.createSixTransparrent();

        // Com_line dimensions: 820 x 80 px
        this.com_line = this.add.sprite(10, 500, 'com_line');

        this.commandGroup = this.add.group(); // To house all the command children
        this.physics.arcade.enable(this.commandGroup);
        this.physics.enable( [ this.commandGroup ], Phaser.Physics.ARCADE);
        this.commandGroup.allowGravity = false; 
        this.commandGroup.immovable = true;

        //  A mask is a Graphics object
        var commandMask = this.game.add.graphics(0, 0);

        //  Shapes drawn to the Graphics object must be filled.
        commandMask.beginFill(0xffffff);

        //  Circle
        commandMask.drawRect(10, 500, 800, 80);
        this.commandGroup.mask = commandMask;

        // Buttons
        this.rightArrow20 = this.add.sprite(13, 500, 'left20');
        this.rightArrow20.inputEnabled = true;
        this.leftArrow20 = this.add.sprite(805,500, 'right20');
        this.leftArrow20.inputEnabled = true;

        this.addNew(); // Add the newCommand variable sprite. 

        this.run_btn = this.add.sprite(965, this.world.height - 345, 'run_btn');
        this.run_btn.inputEnabled = true;

        this.stop_btn = this.add.sprite(965, this.world.height - 345, 'stop_btn');
        this.stop_btn.inputEnabled = true;
        this.stop_btn.visible = false;

        this.home_btn = this.add.button(965, this.world.height - 590, 'home_btn', this.homeFunction, this);
        this.sound_btn = this.add.button(965, this.world.height - 530, 'muteUnMute', this.MuteIt, this);
        this.sound_btn.scale.setTo(0.7,0.7)
        this.help_btn = this.add.button(965, this.world.height - 470, 'help_btn', this.seeTut, this);
        
        this.commandopil = this.add.image(200, this.world.height - 260, 'commandopil');
        this.commandopil.scale.setTo(0.4,0.4);
        this.commandopil.visible = false;
        
        this.pilmute = this.add.image(850, 70, 'pilmute');
        this.pilmute.scale.setTo(0.4,0.4);
        this.pilmute.visible = false;
        
        this.gopil = this.add.image(850, 250, 'gopil');
        this.gopil.scale.setTo(0.4,0.4);
        this.gopil.visible = false;

        this.funkpil = this.add.image(850, 190, 'funkpil');
        this.funkpil.scale.setTo(0.4,0.4);
        this.funkpil.visible = false;
        
        this.radpil = this.add.image(830, 420, 'radpil');
        this.radpil.scale.setTo(0.4,0.4);
        this.radpil.visible = false;
        this.pilar = false;

        // Activate event listeners (known as FUNCTIONS) for when run_btn and stop_btn are clicked.
        this.run_btn.events.onInputDown.add(this.listener, this);
        this.stop_btn.events.onInputDown.add(this.listenerStop, this);
        this.currentSpriteGroup = this.add.group(); // ADDED LAST! Over everything!

        // Function groups are created here
        this.func_line_group = this.add.group();
        this.physics.arcade.enable(this.func_line_group);
        this.physics.enable( [ this.func_line_group ], Phaser.Physics.ARCADE);
        this.func_line_group.allowGravity = false; 
        this.func_line_group.immovable = true;

        // Function line mask and arrows
        var functionMask = this.game.add.graphics(0, 0);
        functionMask.beginFill(0xffffff);
        functionMask.drawRect(176, 185, 600, 80);
        this.func_line_group.mask = functionMask; 
        this.funcRightArrow20 = this.add.sprite(175, 180, 'left20');
        this.funcRightArrow20.inputEnabled = true;
        this.funcRightArrow20.alpha = 0.6;
        this.funcRightArrow20.visible = false;
        this.funcLeftArrow20 = this.add.sprite(755,180, 'right20');
        this.funcLeftArrow20.inputEnabled = true;
        this.funcLeftArrow20.alpha = 0.6;
        this.funcLeftArrow20.visible = false;
        this.func_tree_group = this.add.group();
        for(i=0;i<9;i++){
            this.func_tree_group.add(this.add.group());
        }
        this.physics.arcade.enable(this.func_tree_group);
        this.physics.enable( [ this.func_tree_group ], Phaser.Physics.ARCADE);
        this.func_tree_group.allowGravity = false;
        this.func_tree_group.immovable = true;


    },
    
    update: function () {
        this.game.physics.arcade.collide(this.player, this.layer1, this.waterHit, null, this);
        this.game.physics.arcade.collide(this.player, this.layer2);
        this.game.physics.arcade.collide(this.player, this.layer4, this.ladderHit);
        this.game.physics.arcade.collide(this.player, this.layer5, this.doorHit);
        
        // Checks what animation to play
        if (this.animationCheck == 1) {
            this.player.animations.play('walkRight');
        } else if (this.animationCheck == 2) {
            this.player.animations.play('walkLeft');
        } else if (this.animationCheck == 3) {
            this.player.animations.play('climb');
        } else if (this.animationCheck == 4) {
            this.player.animations.play('jumpRight');
        } else if (this.animationCheck == 5) {
            this.player.animations.play('jumpLeft');
        } else {
            this.player.animations.play('idle');
        }
        
        
        // Command arrows 
        if (this.game.input.activePointer.isDown && this.rightArrow20.input.checkPointerOver(this.game.input.activePointer)) {
            this.commandGroup.setAll('body.velocity.x', -120);
        } else if (this.game.input.activePointer.isDown && this.leftArrow20.input.checkPointerOver(this.game.input.activePointer)) {
            this.commandGroup.setAll('body.velocity.x', +120);
        } else {
            this.commandGroup.setAll('body.velocity.x', 0);
        }

        // Function arrows
        if (this.game.input.activePointer.isDown && this.funcRightArrow20.input.checkPointerOver(this.game.input.activePointer)) {
            this.func_line_group.setAll('body.velocity.x', -120);
        } else if (this.game.input.activePointer.isDown && this.funcLeftArrow20.input.checkPointerOver(this.game.input.activePointer)) {
            this.func_line_group.setAll('body.velocity.x', +120);
        } else {
            this.func_line_group.setAll('body.velocity.x', 0);
        }



        /* Adoptee keys:
         * this.finalPosX;
         * this.finalPosY;
         * this.runInitiated;
         * this.comArrIndex;
        */

        // Velocity control
        if (this.runInitiated == false && this.comKey != "nope") {

            if ((this.comKey == "walk_right_com" || this.comKey == "hop_right_com") && (this.player.x >= this.finalPosX || this.player.body.velocity.x == 0)) {
                this.player.body.velocity.x = 0; 
                this.player.body.velocity.y = 0;
                this.player.body.allowGravity = true;
                this.comArrIndex = this.comArrIndex + 1; 
                this.runInitiated = true; 
            } else if ((this.comKey == "hop_right_com" || this.comKey == "hop_left_com") && this.player.y <= this.finalPosY && this.downActive == true) {
                this.player.body.velocity.y = 80;
                this.downActive = false;
                this.comArrIndex = this.comArrIndex + 1; 
                this.runInitiated = true; 
            } else if ((this.comKey == "walk_left_com" || this.comKey == "hop_left_com") && (this.player.x <= this.finalPosX || this.player.body.velocity.x == 0)) {
                this.player.body.velocity.x = 0; 
                this.player.body.velocity.y = 0;
                this.player.body.allowGravity = true; 
                this.comArrIndex = this.comArrIndex + 1; 
                this.runInitiated = true;
            } else if (this.comKey == "ladder_com" && (this.player.y <= this.finalPosY || this.player.body.velocity.y == 0)) {
                this.map.setCollisionBetween(1, 5000, true, 'blocked');
                this.player.body.allowGravity = true; 
                this.comArrIndex = this.comArrIndex + 1; 
                this.runInitiated = true;
            } else if (this.comKey == "down_com" && (this.player.y >= this.finalPosY || this.player.body.velocity.y == 0)) {
                this.map.setCollisionBetween(1, 5000, true, 'blocked');
                this.player.body.allowGravity = true; 
                this.comArrIndex = this.comArrIndex + 1; 
                this.runInitiated = true;
            } else if (this.comKey == "wrong") {
                this.comArrIndex = this.comArrIndex + 1; 
                this.runInitiated = true;
            }

            // Robot is idle
            if (this.comArrIndex == this.command_array.length && (this.player.body.velocity.x == 0 && this.player.x >= this.finalPosX)){
                this.animationCheck = 0;
            }
        }

        if (this.runInitiated == true && this.comArrIndex < this.command_array.length) {
            this.comKey = this.command_array[this.comArrIndex].key; // Because ain't nobody got time to type that every single time. 
            if (this.comKey == "walk_right_com") {
                this.animationCheck = 1;
                this.finalPosY = -20;
                this.player.body.velocity.x = 100;
                this.finalPosX = this.player.x + 31;
                this.smallerThan = false;
            } else if (this.comKey == "walk_left_com") {
                this.animationCheck = 2;
                this.finalPosY = -20;
                this.finalPosX = this.player.x - 31;
                this.player.body.velocity.x = -100;
                this.smallerThan = true;
            } else if (this.comKey == "ladder_com") {

                var layer1tiles = this.layer1.getTiles(this.player.x - 10, this.player.y - 20, 20, 20);

                var layer4tiles = this.layer4.getTiles(this.player.x, this.player.y - 20, 20, 20);

                // Two checks; one for if there's a ladder and one if there isn't.
                for (i = 0; i < layer4tiles.length; i++) {
                    if (layer4tiles[i].index != (-1)) {
                        this.ladderOverlap = true;
                    }
                    
                }
                for (i = 0; i < layer1tiles.length; i++) {
                    if (layer1tiles[i].index != (-1)) {
                        this.waterOverlap = true;
                    }
                    
                }
                
                if (this.ladderOverlap) {
                    this.animationCheck = 3;
                    this.finalPosX = -20;
                    this.player.body.allowGravity = false;
                    this.finalPosY = this.player.y - 130;
                    this.player.body.velocity.y = -100;
                    this.ladderOverlap = false;
                    this.map.setCollisionBetween(1, 5000, false, 'blocked');
                } else {
                    this.comKey = "wrong";
                }
                if(this.waterOverlap){
                    console.log("Water overlap");
                }
                this.smallerThan = true; 
            } else if (this.comKey == "down_com") {
                var layer4tiles = this.layer4.getTiles(this.player.x, this.player.y + 64, 20, 20);

                // Ladder overlap check
                for (i = 0; i < layer4tiles.length; i++) {
                    if (layer4tiles[i].index != (-1)) {
                        this.ladderOverlap = true;
                    }
                }
                if (this.ladderOverlap) {
                    this.animationCheck = 3;
                    this.finalPosX = -20;
                    this.player.body.allowGravity = false;
                    this.finalPosY = this.player.y + 120;
                    this.player.body.velocity.y = 100;
                    this.ladderOverlap = false;
                    this.map.setCollisionBetween(1, 5000, false, 'blocked');
                } else {
                    this.comKey = "wrong";
                }
                this.smallerThan = true; 
            } 

            else if (this.comKey == "hop_left_com") {
                this.animationCheck = 5;
                this.finalPosX = this.player.x - 64;
                this.finalPosY = this.player.y - 32;
                this.player.body.allowGravity = false;
                this.player.body.velocity.y = -80;
                this.player.body.velocity.x = -80;
                this.downActive = true;
            }
            else if (this.comKey == "hop_right_com") {
                this.animationCheck = 4;
                this.finalPosX = this.player.x + 64;
                this.finalPosY = this.player.y - 32;
                this.player.body.allowGravity = false;
                this.player.body.velocity.y = -80;
                this.player.body.velocity.x = 80;
                this.downActive = true;
            } else if (this.comKey == "key_com") {
                var layer5tiles = this.layer5.getTiles(this.player.x, this.player.y - 20, 20, 20);

                // Door overlap check
                for (i = 0; i < layer5tiles.length; i++) {
                    if (layer5tiles[i].index != (-1)) {
                        this.doorOverlap = true;
                    }
                }
                if (this.doorOverlap) {
                    this.state.start('WinScreen');
                    this.doorOverlap = false;
                } else {
                    this.comKey = "wrong";
                }
            }
            this.runInitiated = false;
        }

    },


    // Function for displaying the tutorial
    seeTut: function() {
        if (this.pilar ==false) {
            this.pilar = true;
            this.commandopil.visible = true;
            this.gopil.visible = true;
            this.funkpil.visible = true;
            this.radpil.visible = true;
            this.pilmute.visible = true;
        }
        else {
            this.pilar = false;
            this.pilar = false;
            this.commandopil.visible = false;
            this.gopil.visible = false;
            this.funkpil.visible = false;
            this.radpil.visible = false;
            this.pilmute.visible = false;
        }
        
    },


    // Reset the player and inputs
    waterHit: function(){
        this.animationCheck = 0;

        // Re-activate commands and their input related functionality. 
        for (i = 0; i < this.commandGroup.length; i++) {
            this.commandGroup.getAt(i).input.enabled = true;
        }

        this.rightArrow20.input.enabled = true;
        this.leftArrow20.input.enabled = true;
        this.newCommand.input.draggable = true;
        this.new_btn.input.enabled = true; 
        this.clear_btn.input.enabled = true;

        this.stop_btn.visible = false;
        this.run_btn.visible = true;
        this.player.reset(95, this.world.height - 280);
        this.runInitiated = false; 
        this.comArrIndex = 0;
        this.command_array = [];
        this.comKey = "nope";
    },
    
    // Two functions for handling dragging of commands to the command line
    commandDragStart: function(sprite, pointer) {

        // Checks if they're identical. Not to be confused with having the same key
        if (sprite == this.newCommand) {
            this.oldPosX = 850; // Same dimensions as when newCommand is created
        }
        else {
            var remainder = sprite.x % 70; // Cleanse the input from faulty values
            this.commandLineIndex = (sprite.x - remainder) / 70; // Check how much of an offset it has from start
            this.oldPosX = sprite.x;
            this.oldPosY = sprite.y;
            this.commandGroup.remove(sprite);
            this.currentSpriteGroup.add(sprite);
        }
    },

    commandDragStop: function(sprite, pointer) {

        var index = 0;
        if(this.inArray(sprite.key, this.func_image_array)===true){
            index = this.func_image_array.indexOf(sprite.key);   
        }
        // If the pointer drops it inside of the com_line square IN HEIGHT (relevant for the Library buttons)
        if (pointer.y > 510 && pointer.y < 590 && pointer.x < 820) {
            if (this.oldPosX > 830) { // Was the command in commandGroup before? (commandLine spans 20 - 830) 
                this.addNew();
            }
            var remainder = sprite.x % 70;
            this.commandLineIndex = (sprite.x - remainder) / 70; // Calculate the (new) index
            this.newPosX = 40 + (this.commandLineIndex * 70); // Calculate the new position

            // Calculate the new position
            this.newPosY = sprite.y;
            sprite.reset(this.newPosX, 510);
            if (this.commandLineIndex <= this.commandGroup.length) {
                this.commandGroup.addAt(sprite, this.commandLineIndex);
            } else {
                this.commandGroup.add(sprite);
            }
            this.currentSpriteGroup.remove(sprite);
            this.commandGroupRender();


            if(this.inArray(sprite, this.func_sprite_array)===true){  
                this.func_sprite_array[this.func_sprite_array.indexOf(sprite)]=null;

                this.func_edit.visible = false;
                this.func_edit = null;
                this.func_delete.visible = false;
                this.func_delete = null;

                this.addDuplicate(this.func_image_array.indexOf(sprite.key));
            }
        }

        else if (pointer.y > 100 && pointer.y < 350 && pointer.x > 140 && pointer.x < 800) {
            if (this.cloud.visible===true && this.func_save.visible===true){ 

                if (this.oldPosX > 830) { // Was the command in commandGroup before? (commandLine spans 20 - 830) 
                    this.addNew();
                }
                // *** FROM HERE
                if(this.inArray(sprite.key,this.func_image_array)===true) {
                    sprite.reset(this.oldPosX, 510);  
                    this.commandGroup.addAt(sprite, this.commandLineIndex); 
                    this.currentSpriteGroup.remove(sprite);                 
                }
                else{
                    var remainder = sprite.x % 70; // Cleanse the (new) input from faulty values. Through semi-holy fire.
                    this.commandLineIndex = (sprite.x - remainder) / 70; // Calculate the (new) index with nice even integer numbers (why we need holy cleansing).            
                    this.newPosX = 200 + (this.commandLineIndex * 70); // Calculate the new position. Needed as a tidy assignment line due to commandLineRender() wanting it.
                    this.newPosY = sprite.y;
                    sprite.reset(this.newPosX, 190);
                    if (this.commandLineIndex <= this.func_line_group.length) {
                        this.func_line_group.addAt(sprite, this.commandLineIndex);
                    } else {
                        this.func_line_group.add(sprite);
                    }
                    this.currentSpriteGroup.remove(sprite);
                    this.functionGroupRender();                    
                }
                // THIS UNCOMMENTED CODE BELOW IS if YOU WANT TO WORK ON RECURSION(FUNCTION IN FUNCTION). JUST REPLACE THE CODE STARTING FROM *** FROM HERE WITH THIS UNCOMMENTED CODE. 
                // var remainder = sprite.x % 70; // Cleanse the (new) input from faulty values. Through semi-holy fire.
                // this.commandLineIndex = (sprite.x - remainder) / 70; // Calculate the (new) index with nice even integer numbers (why we need holy cleansing).            
                // this.newPosX = 200 + (this.commandLineIndex * 70); // Calculate the new position. Needed as a tidy assignment line due to commandLineRender() wanting it.
                // this.newPosY = sprite.y;
                // console.log(this.commandLineIndex)
                // sprite.reset(this.newPosX, 190);
                // if (this.commandLineIndex <= this.func_line_group.length) {
                //     this.func_line_group.addAt(sprite, this.commandLineIndex);
                // } else {
                //     this.func_line_group.add(sprite);
                // }
                // this.currentSpriteGroup.remove(sprite);
                // this.functionGroupRender();
            }

            else if(this.cloud.visible===true && this.func_save.visible===false){

                if(this.inArray(sprite, this.func_sprite_array)===true){
                    sprite.reset(this.func_create_array[index].x, this.func_create_array[index].y);  
                }
                else if(this.inArray(sprite.key, this.func_image_array)===true && this.inArray(sprite, this.func_sprite_array)===false){
                    sprite.kill();
                }
            }
            else {
                sprite.reset(this.oldPosX, 510);                
            }
        }  
        // If the pointer is within range of trash_100 (occupies 480 - 380 and 915 to end)
        else if (pointer.y > 420 && pointer.y < 480 && pointer.x > 950) {
              //trash_100.visible = true;
              //Some kind of timer. game.time.now
            if (this.oldPosX < 820 && this.oldPosY > 510) { // Was the command in commandLine before? (commandLine spans 20 - 830) 
                // It works but there's quite a delay?
                this.commandGroup.remove(sprite, true); // IS the true necessary when we also have to kill it?
                //this.commandGroup.kill(sprite);
                sprite.kill(); // It doesn't update the rendering of the sprite unless it's KILLED!
                this.commandGroupRender();
            }
            else if (this.oldPosY > 100 && this.oldPosY < 350 && this.oldPosX > 140 && this.oldPosX < 800) {
                // Temporary solving...
                if(this.inArray(sprite, this.func_sprite_array)===true){
                    this.func_create_array[index].visible = true;
                    this.func_sprite_array[index].kill();
                    this.func_sprite_array[index] = null;    
                }
                else{
                    this.func_line_group.remove(sprite, true);
                    sprite.kill();
                    this.functionGroupRender();
                }
            } 
            else { // Add it back to new, you pleb!
                this.addNew();
                sprite.kill();
            }

        }
        else { // So it was moved outside of the commandLine area, eh? SNAP IT BACK !
            if (this.inArray(sprite, this.func_sprite_array)===true){ 
                sprite.reset(this.func_create_array[index].x, this.func_create_array[index].y); 
            }
            else if(this.cloud.visible===true && this.func_save.visible===true && this.oldPosY<510){
                sprite.reset(this.oldPosX, 190); 
                this.functionGroupRender();
            }
            else {                
                sprite.reset(this.oldPosX, 510);                
            } // oldPosX gotten from savePosition. Commands are ALWAYS at y = 510.
        }
    },
    
    addNew: function () {
        this.newCommand = this.add.sprite(850, 510, this.commandKeys[0]);
        this.physics.arcade.enable(this.newCommand);
        this.newCommand.body.allowGravity = false;  
        this.newCommand.inputEnabled = true;
        this.newCommand.input.enableDrag(true);
        this.newCommand.events.onDragStart.add(this.commandDragStart, this); // this
        this.newCommand.events.onDragStop.add(this.commandDragStop, this);// Not sure if the last add part is needed or not.
        this.newCommand.collideWorldBounds = true;
    },
    // If you move a particular function sprite from its place in f(x)-PopUp to the commandGroup, a dublicate of it appears on its old place. 
    addDuplicate: function (index) {
        if(this.func_sprite_array[index]===null){
            this.func_sprite_array[index] = this.add.sprite(this.func_create_array[index].x, this.func_create_array[index].y, this.func_image_array[index]);
            this.physics.arcade.enable(this.func_sprite_array[index]);
            this.func_sprite_array[index].body.allowGravity = false;        
            //this.this.func_sprite_array[index].immovable = true; // Immovable necessary?         
            this.func_sprite_array[index].inputEnabled = true;
            this.func_sprite_array[index].input.useHandCursor = true;
            this.func_sprite_array[index].input.enableDrag();
            this.func_sprite_array[index].events.onDragStart.add(this.commandDragStart, this); // this
            this.func_sprite_array[index].events.onDragStop.add(this.commandDragStop, this);
            this.game.input.onTap.add(function() {this.editFunctionBlockOnClick(unc_sprite_array[index])}, this);
            this.func_sprite_array[index].events.onInputDown.add(this.funcSpriteOnClick, this); 
        }    
    },    
    MuteIt: function() {
         if (this.sound.mute == false) {
            this.sound.mute = true; 
            this.sound_btn.frame = 1;
            //this.mute_button = this.add.button(200,0,  'muteButton', this.Mute, this, 0, 0, 1);
            
        } else {
            this.sound.mute = false;
            this.sound_btn.frame = 0;
        };
    
    },
    newCycle: function(sprite) {
        var newSpriteKey = this.commandKeys.shift();
        this.commandKeys.push(newSpriteKey);
        this.newCommand.kill(); // Kill the old new Command sprite.
        this.addNew();
    },
    //ändrar så att stopp-symbolen syns istället för play knappen, när man tryckt på play.
    // RUN !
    listener: function () {
        if(this.cloud.visible=true){this.favxOnClick();} //minipatch
        // Stop the commands from being accessed ! And buttons directly related to commands (clear_btn)
        for (i = 0; i < this.commandGroup.length; i++) {
            this.commandGroup.getAt(i).input.enabled = false;
        }
        this.funcRightArrow20.visible = false; // Patch
        this.funcLeftArrow20.visible = false; // Patch
        this.rightArrow20.input.enabled = false;
        this.leftArrow20.input.enabled = false;
        this.newCommand.input.draggable = false;
        this.new_btn.input.enabled = false; 
        this.clear_btn.input.enabled = false;
        // Start moving the sprite along the commands
        var noWalkRight = 0;
        var noWalkUp = 0;
        var noWalkLeft = 0;
        var noWalkDown = 0;
        var noJump = 0;
        var noLadder; // Might be removed?
        var noKey; // Might be removed?
        this.stop_btn.visible = true;
        this.run_btn.visible = false;
 
        // *** FROM HERE
        var spriteInCommand;
        for( i = 0; i < this.commandGroup.length; i++){
            spriteInCommand = this.commandGroup.getAt(i);
            //console.log(spriteInCommand.key)
            if (this.inArray(spriteInCommand.key,this.func_image_array)===true){
                for(y=0; y<this.func_tree_group.children[this.func_image_array.indexOf(spriteInCommand.key)].length; y++) {
                        this.command_array.push(this.func_tree_group.children[this.func_image_array.indexOf(spriteInCommand.key)].getAt(y));               
                }               
            }
            else {
                this.command_array.push(spriteInCommand);    
            }
        }
        // THIS UNCOMMENTED CODE BELOW IS IF YOU WANT TO WORK ON RECURSION (FUNCTION IN FUNCTION). JUST REPLACE THE CODE STARTING FROM *** FROM HERE WITH THIS UNCOMMENTED CODE. 
        // // Call the function that goes through the objects in commandGroup and and puts them in the command_array.
        // // The command_array is the ultimate array from which the the robot's movements are readed in the update-function above. 
        // this.goThroughCommandGroup(this.commandGroup, -1);
        // this.depthCount = 0;

        this.wrongCommand = false;
        this.runInitiated = true;
        this.comArrIndex = 0; // SOMEONE messed it up before we got to this point (no, I don't know who)
    },
    
    // // This function that goes through the objects in commandGroup and and puts them in the command_array.
    // goThroughCommandGroup: function(commandGroup, currentChildIndex){ 
    //     var spriteInCommand; // Temporary variable where the sprites in from the commandGroup are saved one by one.  
    //     for(i=currentChildIndex+1; i<commandGroup.length; i++){ // Start/continue from the current sprite position in the commandGroup
    //         spriteInCommand = this.commandGroup.getAt(i); // The current sprite is saved. 
    //         if (this.inArray(spriteInCommand.key,this.func_image_array)===true){ // If the current sprite's key (its' picute) is in the array of function sprite pictures
    //             this.depthCount++; // This variable shows how deep in the recursion we went (how many cycles) (how deep we put functions)
    //             this.index_tree_array[this.depthCount] = [this.func_image_array.indexOf(spriteInCommand.key), i]; // Put the function number and its' place number in the current line corresponding to the current depth level. 
    //             this.withRec(spriteInCommand, -1); // Go recursive ;) 
    //         }
    //         else { // If the current sprite is not a function it might be a command then 
    //             this.command_array.push(spriteInCommand); // So put it in the command array
    //         }
    //     }       
    // },
    // // This is a recursive function which goes through all functions put in the commandGroup and functions which are put in those functions and functions which are put in those functions and functions which are put in those functions... i think, you got it :)
    // withRec: function(parentFuncSprite, currentChildIndex) { 
    //     var childrenGroup = this.func_tree_group.getAt(this.func_image_array.indexOf(parentFuncSprite.key)); // Save the group of commands in the parent function (group of commands which are placed under the index corresponding to function number)
    //     console.log("children group length",childrenGroup.length)
    //     for(y=currentChildIndex+1; y<childrenGroup.length; y++) { // Start/continue from the current sprite position in the particular function group. 
    //         if(this.inArray((childrenGroup.getAt(y)).key,this.func_image_array)===true){ // If the current sprite is a function...
    //             this.depthCount++; // Let us go to the next depth level                
    //             this.index_tree_array[this.depthCount] = [this.func_image_array.indexOf(childrenGroup.getAt(y).key), y]; // Put the function number and its' place number in the current line corresponding to the current depth level.
    //             this.withRec(childrenGroup.getAt(y), -1); // And now it's time to go recursive again... and then again and again. 
    //         }
    //         else { // If the current sprite is not a function...
    //             this.command_array.push(childrenGroup.getAt(y)); // There's nothing else than to put in in the command_array
    //             if(y===childrenGroup.length-1){ // If that was the last sprite in the current function...
    //                 if(this.depthCount===1){ // ...and if now we are located on the 1st function depth level...
    //                     this.goThroughCommandGroup(this.commandGroup, this.index_tree_array[this.depthCount][1]); // ... go back to the commandGroup and continue from the next sprite in it. 
    //                 }
    //                 else{ // ... but if not yet the 1st depth level...
    //                     this.depthCount--; // ... go to the previous depth level with recursive                   
    //                     this.withRec(this.func_sprite_array[this.index_tree_array[this.depthCount][0]], this.index_tree_array[this.depthCount+1][1]); // Here's the place where we call the saved positions of the parent function numbers and their positions in corresponding lines. 
    //                     // NB! In the withRec function parameters here we call the parent function on the previous depth level and the child's index on which we were interrupted by the recursive function previous time (that's why there's "+1" in the second parameter)
    //                 }
    //             }    
    //         }            
    //     }                              
    // },

        //pausar spelet/i nuläget stoppar den run och återställer player/roboten till ursprungsläget.
    listenerStop: function () {
        this.animationCheck = 0;
        // Re-activate commands and their input related functionality. 
        for (i = 0; i < this.commandGroup.length; i++) {
            //console.log("Hippity hoop, I'm in your for loop!");
            this.commandGroup.getAt(i).input.enabled = true;
        }
        this.rightArrow20.input.enabled = true;
        this.leftArrow20.input.enabled = true;
        this.newCommand.input.draggable = true;
        this.new_btn.input.enabled = true; 
        this.clear_btn.input.enabled = true;

        this.stop_btn.visible = false;
        this.run_btn.visible = true;
        //this.player = this.add.sprite(95, this.world.height - 280, 'switchAni');
        this.player.reset(95, this.world.height - 280);
        this.runInitiated = false; 
        this.comArrIndex = 0;
        this.command_array = [];
        this.comKey = "nope";
    },

    // I am a functions which re-renders all commands. Worship me, for I am beautiful.
    commandGroupRender: function () { // What happens if the commandGroup is empty?
        for (var i = 0; i < this.commandGroup.length; i++) {
            var comPosX = 40 + (70 * i); // Calculate the position.
            this.commandGroup.getAt(i).reset(comPosX, 510);
            //this.command_line[i].reset(comPosX, 510); // Reset the commands position to be where it SHOULD be, and not where it currently is.
        }
    },
    // I am-m-m... b-b-bjutiful too... :S 
    functionGroupRender: function () { // What happens if the commandGroup is empty?
        for (var i = 0; i < this.func_line_group.length; i++) {
            var comPosX = 200 + (70 * i); // Calculate the position.
            this.func_line_group.getAt(i).reset(comPosX, 190);
            //this.command_line[i].reset(comPosX, 510); // Reset the commands position to be where it SHOULD be, and not where it currently is.
        }
    },

    // What do you think it does?
    clearCommandLine: function() {
        //for (var i = 0; i <= this.commandGroup.length; i++) {
        while (this.commandGroup.length != 0) {
            var sprite = this.commandGroup.getAt(0); // Might be worth checking whether or not there's a speed difference from the end versus beginning. 
            this.commandGroup.remove(sprite, true); // Remove the sprite from the group (it's not klled yet though) 
            sprite.kill(); // Kill the sprite
        }
    },


    // OWN FUNCTION: click on "I <3 f(x)"-button. Opens and closes the funktion making window.
    favxOnClick: function() {         
        if (this.cloud.visible==false) { // The cloud opens if closed...*** 
            this.cloud.visible = true; 
            this.func_title.visible = true;
            // Everything what is supposed to be opened is opened, other stuff is closed
            for (var i = 1; i < 9; i++) {
                if (this.func_sprite_array[i]!=null){
                    this.func_sprite_array[i].visible = true; 
                    this.func_create_array[i].visible = false;   
                }
                else {
                    this.func_create_array[i].visible = true;
                }          
            }
        }
        else { //...*** and closes if opened ;)
            this.func_title.visible = false;
            // Close everything except for the chosen function. 
            for (var i = 1; i < 9; i++) {
                this.func_create_array[i].visible = false;
  
                if (this.func_sprite_array[i]!=null){               
                    if(this.func_sprite_array[i].y>=510 && this.func_sprite_array[i].y<590){ 
                        this.func_sprite_array[i].visible = true;  
                    }
                    else{
                        this.func_sprite_array[i].visible = false; 
                    }                        
                } 

            }
            if(this.func_line_group.length>0){ // If user decided to click on function button during editing a function, the func_line_group is cleansed.
                this.func_line_group.visible = false;
                // this.func_line_group = NaN;
                this.func_line_group = this.add.group();
                // this.physics.arcade.enable(this.func_line_group);
                // this.physics.enable( [ this.func_line_group ], Phaser.Physics.ARCADE);
                // this.func_line_group.allowGravity = false; 
                // this.func_line_group.immovable = true;            
            }
            // To be sure that everything is closed (bugging without the following 4 guys).
            if(this.func_edit){this.func_edit.visible = false}
            if(this.func_save){this.func_save.visible = false}
            if(this.func_delete){this.func_delete.visible = false}
            if(this.func_save){this.func_save.visible = false}
            if(this.func_cancel){this.func_cancel.visible = false}          
            this.cloud.visible = false;
  
         }    
    },

    // Makes 6 half-transparrent-red places for making own functions while clicking on the f(x)-button. 
    createSixTransparrent: function() {

        var xCoord = 200;
        var yCoord = 190;
        for(var i=1; i<9; i++){

            this.func_create_array[i] = this.add.sprite(xCoord, yCoord, 'func_make');        
            this.func_create_array[i].inputEnabled = true;
            this.func_create_array[i].input.useHandCursor = true;
            this.func_create_array[i].alpha = 0.3; // Makes them transparrent
            this.func_create_array[i].visible=false; 
            xCoord+=70;
        }
            // OnClick sends the Index parameter to the Listener makeNewFuncOnClick.
            this.func_create_array[1].events.onInputDown.add(function() {this.makeNewFuncOnClick(this.func_create_array.indexOf(this.func_create_array[1]))}, this);
            this.func_create_array[2].events.onInputDown.add(function() {this.makeNewFuncOnClick(this.func_create_array.indexOf(this.func_create_array[2]))}, this);
            this.func_create_array[3].events.onInputDown.add(function() {this.makeNewFuncOnClick(this.func_create_array.indexOf(this.func_create_array[3]))}, this);
            this.func_create_array[4].events.onInputDown.add(function() {this.makeNewFuncOnClick(this.func_create_array.indexOf(this.func_create_array[4]))}, this);
            this.func_create_array[5].events.onInputDown.add(function() {this.makeNewFuncOnClick(this.func_create_array.indexOf(this.func_create_array[5]))}, this);
            this.func_create_array[6].events.onInputDown.add(function() {this.makeNewFuncOnClick(this.func_create_array.indexOf(this.func_create_array[6]))}, this);
            this.func_create_array[7].events.onInputDown.add(function() {this.makeNewFuncOnClick(this.func_create_array.indexOf(this.func_create_array[7]))}, this);
            this.func_create_array[8].events.onInputDown.add(function() {this.makeNewFuncOnClick(this.func_create_array.indexOf(this.func_create_array[8]))}, this);    

    },

    // OWN FUNCTION: click on a transparrent red Create Function object and appear in the functione making window.
    // Still needs work on it: make OnDrag, find some way to save the chosen sequence of code-blocks.
    makeNewFuncOnClick: function(index) {        
        // Closing the transparrent guys and everything...
        for (var i=1; i<9; i++) {
              this.func_create_array[i].visible = false;                   
            if (this.func_sprite_array[i]!=null){  
                //...except for the chosen functions.              
                if(this.func_sprite_array[i].y>=510 && this.func_sprite_array[i].y<590){ 
                    this.func_sprite_array[i].visible = true;  
                }
                else{
                    this.func_sprite_array[i].visible = false; 
                }                   
            }
        } 
        this.funcRightArrow20.visible = true;
        this.funcLeftArrow20.visible = true; 
        this.func_save = this.add.sprite(260, 265 , 'func_save');
        this.func_save.inputEnabled = true;
        this.func_save.input.useHandCursor = true;
        this.func_save.alpha = 0.7;
        this.func_save.events.onInputDown.add(function() {this.saveFunctionOnClick(index)}, this);  
        this.func_cancel = this.add.sprite(510, 265, 'func_cancel');
        this.func_cancel.inputEnabled = true;
        this.func_cancel.input.useHandCursor = true;
        this.func_cancel.alpha = 0.7;
        this.func_cancel.events.onInputDown.add(this.cancelCreateFunctionOnClick, this);               
    },  

    // OWN FUNCTION: click on "SPARA" and save the function. 
    saveFunctionOnClick: function(index) {
        this.func_save.visible = false;  
        this.func_cancel.visible = false;
        this.funcRightArrow20.visible = false;
        this.funcLeftArrow20.visible = false; 
        this.func_tree_group.remove(this.func_tree_group.getAt(index));
        this.func_tree_group.addAt(this.func_line_group, index);
        this.func_line_group.visible = false;
        this.func_line_group = this.add.group();
 
        this.func_sprite_array[index] = this.add.sprite(this.func_create_array[index].x, this.func_create_array[index].y, this.func_image_array[index]);
        this.physics.arcade.enable(this.func_sprite_array[index]);
        this.func_sprite_array[index].body.allowGravity = false;        
        //this.this.func_sprite_array[index].immovable = true; // Immovable necessary?         
        this.func_sprite_array[index].inputEnabled = true;
        this.func_sprite_array[index].input.useHandCursor = true;
        this.func_sprite_array[index].input.enableDrag();
        this.func_sprite_array[index].events.onDragStart.add(this.commandDragStart, this); // this
        this.func_sprite_array[index].events.onDragStop.add(this.commandDragStop, this);
        // if (this.func_sprite_array[index].timeUp - this.func_sprite_array[index].previousTapTime < this.game.input.doubleTapRate) {
        //     //  Yes, let's dispatch the signal then with the 2nd parameter set to true
        //     this.game.input.onTap.dispatch(this.funcSpriteOnClick, true);
        // }
        this.func_sprite_array[index].events.onInputDown.add(this.funcSpriteOnClick, this);        

        // Close what to be closed and open what to be opened
        for (var i=1; i<9; i++) {
            if (this.func_sprite_array[i]!=null){
                this.func_sprite_array[i].visible = true;
                this.func_create_array[i].visible = false;    
            }
            else {
                this.func_create_array[i].visible = true;    
            } 
        }      

    },
    // OWN FUNCTION: click on "AVBRYT" and cancel the function creating process. 
    cancelCreateFunctionOnClick: function() {

        // Everything what is supposed to be opened is opened, other stuff is closed
        for (var i=1; i<9; i++) {
            if (this.func_sprite_array[i]!=null){
                this.func_sprite_array[i].visible = true; 
                this.func_create_array[i].visible = false;   
            } 
            else {
                this.func_create_array[i].visible = true;
            }          
        }
        this.funcRightArrow20.visible = false;
        this.funcLeftArrow20.visible = false; 
        this.func_save.visible = false;
        this.func_cancel.visible = false;
        if(this.func_edit){this.func_edit.visible = false}
        if(this.func_delete){this.func_delete.visible = false}
        // Close all unnecessary commands and cleanse the func_line_group
        this.func_line_group.visible = false;
        this.func_line_group = this.add.group(); // Probably can be done with NaN, but seems to work even without it. 
    },

    // The function sprites are dragable and clickable. If you click on it, you get 2 buttons for working with a current function.
    // You may in that case eather edit you or function or delete the sprite.  
    funcSpriteOnClick: function(sprite, pointer) {


        // var mylatesttap; 
        // sprite.events.onInputDown.add(doubleclick,this); 
        // function doubleclick(item,pointer){    
        //     var now = new Date().getTime();   
        //     var timesince = now - mylatesttap;    
        //     if((timesince < 600) && (timesince > 0)){     
        //         console.log("double tap");   
        //     }
        //     else{    console.log("don't");   
        //     }    
        //     mylatesttap = new Date().getTime();
        // }
        

        if(this.inArray(sprite, this.func_sprite_array)===true) {
            console.log("Herre Gud!")
            // Please, desappear, dear EDIT and DELETE. 
            if(this.func_edit){
                this.func_edit.visible = false;
                this.func_edit = null;
            }
            if(this.func_delete){
                this.func_delete.visible = false;
                this.func_delete = null;
            }
            // And appear again connected to the current function. 
            this.func_delete = this.add.sprite(510, 265, 'func_delete');
            this.func_delete.inputEnabled = true;
            this.func_delete.input.useHandCursor = true; 
            this.func_delete.alpha = 0.7;       
            this.func_delete.events.onInputDown.add(function() {this.deleteFunctionBlockOnClick(this.func_sprite_array.indexOf(sprite))}, this);
            this.func_edit = this.add.sprite(260, 265, 'func_edit');
            this.func_edit.inputEnabled = true;
            this.func_edit.input.useHandCursor = true;  
            this.func_edit.alpha = 0.7;      
            this.func_edit.events.onInputDown.add(function() {this.editFunctionBlockOnClick(this.func_sprite_array.indexOf(sprite))}, this);
            
        }
    },

    // OWN FUNCTION: click on "TA BORT" and delete the current function-sprite.
    deleteFunctionBlockOnClick: function(index) {  
        this.func_tree_group.children[index] = this.add.group();

        this.func_line_group.visible = false;
        this.func_line_group=NaN;
        this.func_line_group = this.add.group();
        this.physics.arcade.enable(this.func_line_group);
        this.physics.enable( [ this.func_line_group ], Phaser.Physics.ARCADE);
        this.func_line_group.allowGravity = false; 
        this.func_line_group.immovable = true;        
        this.func_sprite_array[index].kill();
        this.func_sprite_array[index] = null;
        this.func_create_array[index].visible = true; 
        this.func_delete.visible = false;
        this.func_edit.visible = false;

        for (var i=1; i<9; i++) {
            if (this.func_sprite_array[i]!=null){
                this.func_sprite_array[i].visible = true;
                this.func_create_array[i].visible = false;    
            }
            else {
                this.func_create_array[i].visible = true;    
            } 
        }
    },
    // OWN FUNCTION: click on "ÄNDRA" and edit the current function.
    editFunctionBlockOnClick: function(index) {
        // Close unnecessary things and let the necessary remain. 
        for (var i=1; i<9; i++) {
            this.func_create_array[i].visible = false;                   
            if (this.func_sprite_array[i]!=null){  
                //...except for the chosen functions.              
                if(this.func_sprite_array[i].y>=510 && this.func_sprite_array[i].y<590){ 
                    this.func_sprite_array[i].visible = true;  
                }
                else{
                    this.func_sprite_array[i].visible = false; 
                }                   
            }
        } 
        // Returning back the commando chain corresponding by index to the current function to the func_line_group. 
        this.func_line_group = this.func_tree_group.children[index];
        this.func_line_group.visible=true;
        // ...and show the needed buttons! 
        this.funcRightArrow20.visible = true;
        this.funcLeftArrow20.visible = true;                
        this.func_edit.visible = false;
        this.func_edit = null;
        this.func_delete.visible = false;
        this.func_delete = null; 
        this.func_save = this.add.sprite(260, 265, 'func_save');
        this.func_save.inputEnabled = true;
        this.func_save.input.useHandCursor = true;
        this.func_save.alpha = 0.7;
        this.func_save.events.onInputDown.add(function() {this.saveFunctionOnClick(index)}, this);  
        this.func_cancel = this.add.sprite(510, 265, 'func_cancel');
        this.func_cancel.inputEnabled = true;
        this.func_cancel.input.useHandCursor = true;
        this.func_cancel.alpha = 0.7;
        this.func_cancel.events.onInputDown.add(this.cancelCreateFunctionOnClick, this); 
    },

    // Returns Child Index (in the group)
    returnChildIndex: function(needle,haystack) {  
        var count=haystack.length;
        for(var i=0;i<count;i++) {
            if(haystack.getAt(i)===needle){
                return i;}
        }
        return null;
    },
    // Checks if the sprite is in the group
    inGroup: function(needle,haystack) { 
        var count=haystack.length;
        for(var i=0;i<count;i++) {
            if(haystack.getAt(i)===needle){
                return true;}
        }
        return false;
    },
    // Checks if the sprite is in the array
    inArray: function(needle,haystack) { 
        var count=haystack.length;
        for(var i=0;i<count;i++) {
            if(haystack[i]===needle){
                return true;}
        }
        return false;
    },     
    
    //Home button function
    homeFunction: function() {
        this.func_sprite_array = [];
        this.state.start('MapOverview');
    },

    // Save score
    scoreFunction: function () {
        var noBlocks = this.commandGroup.length;
        saveScore(noBlocks, this.saveDataArgs);
    }

};
