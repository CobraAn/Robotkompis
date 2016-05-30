RobotKompis.Level = function (game) {
    // Tilemap variables.
    this.map;
    this.layer0;
    this.layer1;
    this.layer2;
    this.layer3;
    this.layer4;
    this.layer5;
    this.layer6;
    
    this.commandopil;
    this.funkpil;
    this.gopil;
    this.pilmute;
    this.radpil;
    this.homepil;
    this.pilar;
    this.movepil;
    this.clearpil;

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
    this.funcCreateArray = []; // Array of 8 transparrent "KLICK ATT SKAPA"sprites
    this.funcImageKeyArray = [null,'f1','f2','f3','f4','f5','f6','f7','f8']; // Images served to create function sprites. They are put in array in order to ease indexing and avoid repeated code. 
    this.funcSpriteArray = []; // Array of original function sprites (sometimes needed)
    // this.depthCount = 0; // Counts how deep we are located in the function in the function in the function in the function......
    this.funcLineGroup; // This is the tempopary group where the sequence of command or/and function sprites are stored then tobe saved in a particular place corresponding to a paticular function number in funcTreeGroup.
    this.funcTreeGroup; // In this group the sequences (groups) of sprites are stored under the index corresponding to the particular function number. NB! Groups in Phaser work as "trees". 
    // this.index_tree_array = []; // This array serves as a 2D matrix to follow the the function recursion process. Objects of this array are 2-object-long arrays: 1st object in them is index/number of the function in funcImageKeyArray; 2nd object is index of the place of this function in the current line.  
    this.func_title; // Title sprite in the function edit popUp.
    this.func_line; // This is the sprite for the function group where you put commands. 
    this.commandArray = []; // This is the ultimate array from which robot's movement commands are readed in the update-function.


    this.a;


    //Check used for animations, e.g 0 means idle animation
    this.animationCheck = 0;

    // Tween for animations
    this.tween;

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
/**
 * Prototype for the level state, used for all levels
 * @type {{init: RobotKompis.Level.init, create: RobotKompis.Level.create, update: RobotKompis.Level.update, seeTut: RobotKompis.Level.seeTut, waterHit: RobotKompis.Level.waterHit, commandDragStart: RobotKompis.Level.commandDragStart, commandDragStop: RobotKompis.Level.commandDragStop, addNew: RobotKompis.Level.addNew, addDuplicate: RobotKompis.Level.addDuplicate, MuteIt: RobotKompis.Level.MuteIt, newCycle: RobotKompis.Level.newCycle, listener: RobotKompis.Level.listener, listenerStop: RobotKompis.Level.listenerStop, commandGroupRender: RobotKompis.Level.commandGroupRender, functionGroupRender: RobotKompis.Level.functionGroupRender, clearCommandLine: RobotKompis.Level.clearCommandLine, favxOnClick: RobotKompis.Level.favxOnClick, createSixTransparrent: RobotKompis.Level.createSixTransparrent, makeNewFuncOnClick: RobotKompis.Level.makeNewFuncOnClick, saveFunctionOnClick: RobotKompis.Level.saveFunctionOnClick, cancelCreateFunctionOnClick: RobotKompis.Level.cancelCreateFunctionOnClick, funcSpriteOnClick: RobotKompis.Level.funcSpriteOnClick, deleteFunctionBlockOnClick: RobotKompis.Level.deleteFunctionBlockOnClick, editFunctionBlockOnClick: RobotKompis.Level.editFunctionBlockOnClick, returnChildIndex: RobotKompis.Level.returnChildIndex, inGroup: RobotKompis.Level.inGroup, inArray: RobotKompis.Level.inArray, homeFunction: RobotKompis.Level.homeFunction, saveAllFunctions: RobotKompis.Level.saveAllFunctions, scoreFunction: RobotKompis.Level.scoreFunction}}
 */
RobotKompis.Level.prototype = {

    /*
     * Initiates variables needed for the level creation and storage
     */
    init: function (character, levelName){
        this.robot = character;
        this.saveDataArgs.robot = character;
        this.saveDataArgs.levelName = levelName;
        // this.saveDataArgs.funcArray = funcArray;
    },

    /*
     * Creates graphics for the level
     */
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
        this.map.addTilesetImage('newdesert', 'newdesert');
        this.map.addTilesetImage('iceland', 'iceland');
        this.map.addTilesetImage('ice32xx', 'ice32xx');
        this.map.addTilesetImage('icetiles32', 'icetiles32');
        this.map.addTilesetImage('icetiles32x', 'icetiles32x');
        // Layers
        this.layer0 = this.map.createLayer('background');
        this.layer1 = this.map.createLayer('water');
        this.layer3 = this.map.createLayer('unblocked');
        
        this.layer6 = this.map.createLayer('ice');
        
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
        this.func_line = this.add.sprite(171, 180,'func_line');
        this.func_line.alpha = 0.6;
        this.func_line.visible = false;
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
        this.commandopil.scale.setTo(0.5,0.5);
        this.commandopil.visible = false;
        
        this.pilmute = this.add.image(820, 70, 'pilmute');
        this.pilmute.scale.setTo(0.5,0.5);
        this.pilmute.visible = false;
        
        this.gopil = this.add.image(820, 250, 'gopil');
        this.gopil.scale.setTo(0.5,0.5);
        this.gopil.visible = false;
        
        
        this.funkpil = this.add.image(820, 190, 'funkpil');
        this.funkpil.scale.setTo(0.5,0.5);
        this.funkpil.visible = false;
        
        this.radpil = this.add.image(810, 420, 'radpil');
        this.radpil.scale.setTo(0.5,0.5);
        this.radpil.visible = false;
        
        this.homepil = this.add.image(820, 10, 'homepil');
        this.homepil.scale.setTo(0.5,0.5);
        this.homepil.visible = false;
        
        this.clearpil = this.add.image(820, 360, 'clearpil');
        this.clearpil.scale.setTo(0.5,0.5);
        this.clearpil.visible = false;
        
        this.movepil = this.add.image(700, 500, 'movepil');
        this.movepil.scale.setTo(0.5,0.5);
        this.movepil.visible = false;

        this.pilar = false;

        // Activate event listeners (known as FUNCTIONS) for when run_btn and stop_btn are clicked.
        this.run_btn.events.onInputDown.add(this.listener, this);
        this.stop_btn.events.onInputDown.add(this.listenerStop, this);
        this.currentSpriteGroup = this.add.group(); // ADDED LAST! Over everything!

        // Function groups are created here
        this.funcLineGroup = this.add.group();
        this.physics.arcade.enable(this.funcLineGroup);
        this.physics.enable( [ this.funcLineGroup ], Phaser.Physics.ARCADE);
        this.funcLineGroup.allowGravity = false; 
        this.funcLineGroup.immovable = true;

        // Function line mask and arrows
        var functionMask = this.game.add.graphics(0, 0);
        functionMask.beginFill(0xffffff);
        functionMask.drawRect(176, 185, 600, 80);
        this.funcLineGroup.mask = functionMask; 
        this.funcRightArrow20 = this.add.sprite(175, 180, 'left20');
        this.funcRightArrow20.inputEnabled = true;
        this.funcRightArrow20.alpha = 0.6;
        this.funcRightArrow20.visible = false;
        this.funcLeftArrow20 = this.add.sprite(755,180, 'right20');
        this.funcLeftArrow20.inputEnabled = true;
        this.funcLeftArrow20.alpha = 0.6;
        this.funcLeftArrow20.visible = false;
        this.funcTreeGroup = this.add.group(); // Create a group tree to store function groups
        for(i=0;i<9;i++){ // Fill the tree with empty groups 
            this.funcTreeGroup.add(this.add.group());
        }
        // 

        var saveFuncArray = this.playerData.funcArray; // Get the functions saved from the previous time from the localStorage.

        console.log("Beginning of level", this.playerData.funcArray)
        if (typeof saveFuncArray !== "undefined" && saveFuncArray !== null) {
            var tempCommand; // A temporary variable to create command sprites from the functions from the previous time.
            for(i=0;i<9;i++){
                if(saveFuncArray.length>1){ // If there's something in the saved funcArray
                    if(saveFuncArray[i]!==null){ //Go through array-elements
                        // Recreate the function sprites remained from previous time.
                        this.funcSpriteArray[i] = this.add.sprite(200+70*(i-1), 190, this.funcImageKeyArray[i]); // Create and upt them at tha corresponding place in the function-cloud.
                        this.funcSpriteArray[i].visible = false; // At this stage they shouldn't be visible
                        this.physics.arcade.enable(this.funcSpriteArray[i]); // It hould be possible to move them
                        this.funcSpriteArray[i].body.allowGravity = false; // But the gravity has no power on them.
                        //this.this.funcSpriteArray[index].immovable = true; // Immovable necessary?
                        this.funcSpriteArray[i].inputEnabled = true; //
                        this.funcSpriteArray[i].input.useHandCursor = true;
                        this.funcSpriteArray[i].input.enableDrag();
                        this.funcSpriteArray[i].events.onDragStart.add(this.commandDragStart, this); // If you start dragging the sprite, the commandDragStart function is launched
                        this.funcSpriteArray[i].events.onDragStop.add(this.commandDragStop, this); // If you drop the sprite, the commandDragStop function is launched
                        this.funcSpriteArray[i].events.onInputDown.add(this.funcSpriteOnClick, this);
                        for(y=0;y<saveFuncArray[i].length;y++){ // Now go 2D
                            tempCommand = this.add.sprite(200+70*(y), 190, saveFuncArray[i][y]); // From every key-string you find in the saveFuncArray, create a command sprite
                            //tempCommand.visible = false;
                            this.physics.arcade.enable(tempCommand);
                            tempCommand.body.allowGravity = false;
                            tempCommand.inputEnabled = true;
                            tempCommand.input.enableDrag(true);
                            tempCommand.events.onDragStart.add(this.commandDragStart, this); // If you start dragging the sprite, the commandDragStart function is launched
                            tempCommand.events.onDragStop.add(this.commandDragStop, this); // If you drop the sprite, the commandDragStop function is launched
                            tempCommand.collideWorldBounds = true;
                            this.funcTreeGroup.children[i].add(tempCommand); // ...and finally put the sprite at the corresponding position in the funcTreeGroup
                        }
                        this.funcTreeGroup.children[i].visible = false; // Let us now make every group of commands invisible then to be able to see them in the edit-menu.
                    }
                }

            }
        }

        this.physics.arcade.enable(this.funcTreeGroup);
        this.physics.enable( [ this.funcTreeGroup ], Phaser.Physics.ARCADE);
        this.funcTreeGroup.allowGravity = false;
        this.funcTreeGroup.immovable = true;


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
            this.funcLineGroup.setAll('body.velocity.x', -120);
        } else if (this.game.input.activePointer.isDown && this.funcLeftArrow20.input.checkPointerOver(this.game.input.activePointer)) {
            this.funcLineGroup.setAll('body.velocity.x', +120);
        } else {
            this.funcLineGroup.setAll('body.velocity.x', 0);
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
                this.player.body.velocity.y = 85;
                this.downActive = false;
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
            if (this.comArrIndex == this.commandArray.length && (this.player.body.velocity.x == 0 && this.player.x >= this.finalPosX)){
                this.animationCheck = 0;
            }
        }

        if (this.runInitiated == true && this.comArrIndex < this.commandArray.length) {
            this.comKey = this.commandArray[this.comArrIndex].key; // Because ain't nobody got time to type that every single time. 
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
                var layer4tiles = this.layer4.getTiles(this.player.x - 10, this.player.y - 20, 10, 10);
                this.ladderOverlap = false;
                // Two checks; one for if there's a ladder and one if there isn't.
                for (i = 0; i < layer4tiles.length; i++) {
                    if (layer4tiles[i].index != (-1)) {
                        this.ladderOverlap = true;
                    }
                    
                }/*
                for (i = 0; i < layer1tiles.length; i++) {
                    if (layer1tiles[i].index != (-1)) {
                        this.waterOverlap = true;
                    }

                }*/
                
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

                // The player has reached the door with a key, save all data
                if (this.doorOverlap) {
                    this.scoreFunction(true);
                    this.funcSpriteArray = [];
                    this.funcTreeGroup.destroy();
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
            this.homepil.visible = true;
            this.clearpil.visible = true;
            this.movepil.visible = true;
        }
        else { //...*** and closes if opened ;)
            this.pilar = false;
            this.pilar = false;
            this.commandopil.visible = false;
            this.gopil.visible = false;
            this.funkpil.visible = false;
            this.radpil.visible = false;
            this.pilmute.visible = false;
            this.homepil.visible = false;
            this.clearpil.visible = false;
            this.movepil.visible = false;
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
        this.commandArray = [];
        this.comKey = "nope";
    },
    
    // This function saves the coordinates of the start position of the sprite you are dragging at the moment and adjusting it according to it's position. 
    commandDragStart: function(sprite, pointer) {
        this.oldPosY = sprite.y;
        var remainder = sprite.x % 70; // Cleanse the input from faulty values.
        this.commandLineIndex = (sprite.x - remainder) / 70; // check how much of an offset it has from start.
        if (sprite == this.newCommand) { // Checks if they're IDENTICAL. Not to be confused with having the same key. 
            this.oldPosX = 850; // Same dimensions as when newCommand is created.
        }
        else {
            if(this.oldPosY > 500 && this.oldPosY < 590){ // If you take a sprite from the command line...
                this.oldPosX = 40 + (this.commandLineIndex * 70); // Set a more exact x-value than sprite.x or sprite.position.x gives (I assume due to the ListenerEvent known as commandDragStart being slightly delayed.)
                this.commandGroup.remove(sprite); // It's no longer allowed to be in this group!                
            }

            else if(this.oldPosY > 100 && this.oldPosY < 350){ // If the original position of the sprite was in the function menu... 
                if(this.func_line.visible===true) { // If the sprite was in the very function editor, i.e. in the function line...
                    this.oldPosX = 200 + (this.commandLineIndex * 70); // Set a more exact x-value than sprite.x or sprite.position.x gives (I assume due to the ListenerEvent known as commandDragStart being slightly delayed.)
                    this.funcLineGroup.remove(sprite); // Now it's no longer allowed to be in this group! 
                }
                else { // Ortherwise i assume that this sprite is a function sprite taken from the function menu...
                    this.oldPosX = 200 + (this.commandLineIndex * 70); // Set a more exact x-value than sprite.x or sprite.position.x gives (I assume due to the ListenerEvent known as commandDragStart being slightly delayed.)                    
                }
            }           
        }
        this.currentSpriteGroup.add(sprite); // Put the sprite in this temporary group. 
    },
    // This function anjusts the sprite, which you're dragging, according to where it was taken from and where you you're going to drop it.
    commandDragStop: function(sprite, pointer) {
        var index = 0; // It the sprite is a function, we might need it's order number. 
        if(this.inArray(sprite.key, this.funcImageKeyArray)===true){ 
            index = this.funcImageKeyArray.indexOf(sprite.key);   
        }
        // If the pointer drops it inside of the com_line square IN HEIGHT (relevant for the Library buttons)
        if (pointer.y > 510 && pointer.y < 590 && pointer.x < 820) {
            if (this.oldPosX > 830) { // Was the command in commandGroup before? (commandLine spans 20 - 830) 
                this.addNew();
            }
            // Calculate the new position
            var remainder = sprite.x % 70; 
            this.commandLineIndex = (sprite.x - remainder) / 70; // Calculate the (new) index
            this.newPosX = 40 + (this.commandLineIndex * 70); // Calculate the new X-coordinate
            this.newPosY = sprite.y; // Calculate the new Y-coordinate
            sprite.reset(this.newPosX, 510); // Sprite is put visually on a proper position in the command line
            // Put it according to the calculated position index
            if (this.commandLineIndex <= this.commandGroup.length) { // If the position index is less than the length of the commandGroup...
                this.commandGroup.addAt(sprite, this.commandLineIndex); // Squeeze the sprite in between the other sprites in the commandGroup according to the index
            } else { // If the position index is bigger...
                this.commandGroup.add(sprite); // Just put the sprite at the end of the commandGroup. 
            }
            this.currentSpriteGroup.remove(sprite); //...and don't forget to remove it from the temporary group.
            this.commandGroupRender(); // ...and a control ajustment won't be excessive... 
            // What if the sprite you have put in the command line is a function...? 
            if(this.inArray(sprite, this.funcSpriteArray)===true){ // ...if it is true...
                this.funcSpriteArray[this.funcSpriteArray.indexOf(sprite)]=null; // Delete it from the function sprite array.
                this.func_edit.visible = false; // Cease the "ÄNDRA" button
                this.func_edit = null; // We have to remove the button because every button is connected to a particular function with it's index as the parameter. 
                this.func_delete.visible = false; // Cease the "TA BORT" button
                this.func_delete = null;
                this.addDuplicate(this.funcImageKeyArray.indexOf(sprite.key)); // Create a function duplicate and put it on the original place of its' tween
            }
        }

        // If the sprite is dropped in the function window
        else if (pointer.y > 100 && pointer.y < 350 && pointer.x > 140 && pointer.x < 800) { // These are the approximate limits of the function window
            if (this.cloud.visible===true && this.func_line.visible===true){ // If you drop it in the function editor...
                if (this.oldPosX > 830) { // If the command was taken from the newly created position..
                    this.addNew();
                }
                // *** FROM HERE
                if(this.inArray(sprite.key,this.funcImageKeyArray)===true) { // If the taken sprite is a function....
                    sprite.reset(this.oldPosX, 510); // Just return it back to the command line.
                    this.commandGroup.addAt(sprite, this.commandLineIndex); // Put it at the corresponding position in the command group. 
                    this.currentSpriteGroup.remove(sprite); 
                    this.commandGroupRender(); // ...and a control ajustment won't be excessive...  
                    }

               
                // }
                else{ // ... then it must be a command...
                    var remainder = sprite.x % 70; // Cleanse the (new) input from faulty values. Through semi-holy fire.
                    this.commandLineIndex = (sprite.x - remainder) / 70; // Calculate the (new) index with nice even integer numbers (why we need holy cleansing).            
                    this.newPosX = 200 + (this.commandLineIndex * 70); // Calculate the new position. Needed as a tidy assignment line due to commandLineRender() wanting it.
                    this.newPosY = sprite.y;
                    sprite.reset(this.newPosX, 190); // Put the sprite on the visually proper place in the function line
                    if (this.commandLineIndex <= this.funcLineGroup.length) { 
                        this.funcLineGroup.addAt(sprite, this.commandLineIndex);
                    } else {
                        this.funcLineGroup.add(sprite);
                    }
                    this.currentSpriteGroup.remove(sprite); 
                    this.functionGroupRender();  // ...and a control ajustment won't be excessive...                 
                }
                // THIS UNCOMMENTED CODE BELOW IS if YOU WANT TO WORK ON RECURSION(FUNCTION IN FUNCTION). JUST REPLACE THE CODE STARTING FROM *** FROM HERE WITH THIS UNCOMMENTED CODE. 
                // var remainder = sprite.x % 70; // Cleanse the (new) input from faulty values. Through semi-holy fire.
                // this.commandLineIndex = (sprite.x - remainder) / 70; // Calculate the (new) index with nice even integer numbers (why we need holy cleansing).            
                // this.newPosX = 200 + (this.commandLineIndex * 70); // Calculate the new position. Needed as a tidy assignment line due to commandLineRender() wanting it.
                // this.newPosY = sprite.y;
                // console.log(this.commandLineIndex)
                // sprite.reset(this.newPosX, 190);
                // if (this.commandLineIndex <= this.funcLineGroup.length) {
                //     this.funcLineGroup.addAt(sprite, this.commandLineIndex);
                // } else {
                //     this.funcLineGroup.add(sprite);
                // }
                // this.currentSpriteGroup.remove(sprite);
                // this.functionGroupRender();
            }
            else if(this.cloud.visible===true && this.func_save.visible===false){

                if(this.inArray(sprite, this.funcSpriteArray)===true){
                    sprite.reset(this.funcCreateArray[index].x, this.funcCreateArray[index].y);  
                }
                else if(this.inArray(sprite.key, this.funcImageKeyArray)===true && this.inArray(sprite, this.funcSpriteArray)===false){
                    sprite.kill();
                }
            }
            else {
                sprite.reset(this.oldPosX, 510); // Just return it back to the command line.
                this.commandGroup.addAt(sprite, this.commandLineIndex); // Put it at the corresponding position in the command group. 
                this.currentSpriteGroup.remove(sprite); 
                this.commandGroupRender(); // ...and a control ajustment won't be excessive...                
            }
        }  
        // If the pointer is within range of trash_100 (occupies 480 - 380 and 915 to end)
        else if (pointer.y > 420 && pointer.y < 480 && pointer.x > 950) {
            if (this.oldPosX < 830 && this.oldPosY > 500) { // Was the command in commandLine before? (commandLine spans 20 - 830) 
                this.commandGroup.remove(sprite, true); // IS the true necessary when we also have to kill it?
                sprite.kill(); // It doesn't update the rendering of the sprite unless it's KILLED!
                this.commandGroupRender();
            }
            else if (this.oldPosY > 100 && this.oldPosY < 350 && this.oldPosX > 140 && this.oldPosX < 800) { // It the sprite was in the function window
                // Temporary solving...
                if(this.inArray(sprite, this.funcSpriteArray)===true){ // If it was in the function menu...
                    this.funcCreateArray[index].visible = true; // Replace the function sprite with the transparent "KLICK ATT SKAPA" sprite. 
                    this.funcSpriteArray[index].kill(); 
                    this.funcSpriteArray[index] = null; // Remove the sprite from the funcSpriteArray
                    this.funcTreeGroup.addAt(this.add.group(), index); // Replace the corresponding place in the funcTreeGroup with an empty group
                    this.func_edit.visible = false; // Close the unnecessary buttons. 
                    this.func_delete.visible = false; // Close the unnecessary buttons. 
                    this.func_edit = null; // And kill 'em all!!! 
                    this.func_delete = null;
                }
                else{ //... then it must have been the function editor...
                    this.funcLineGroup.remove(sprite, true); // So remove the sprite from the function line
                    sprite.kill();
                    this.functionGroupRender();  // ...and a control ajustment won't be excessive...  
                }
            } 
            else { // Add it back to new, you pleb!
                this.addNew();
                sprite.kill();
            }

        }
        else { // So it was moved outside of the commandLine area or function window area, eh? SNAP IT BACK !
            if (this.inArray(sprite, this.funcSpriteArray)===true){ 
                sprite.reset(this.funcCreateArray[index].x, this.funcCreateArray[index].y); 
            }
            else if(this.cloud.visible===true && this.func_line.visible===true && this.oldPosY<500){
                sprite.reset(this.oldPosX, 190); 
                // Put it according to the calculated position index
                if (this.commandLineIndex <= this.funcLineGroup.length) { // If the position index is less than the length of the function line group...
                    this.funcLineGroup.addAt(sprite, this.commandLineIndex); // Squeeze the sprite in between the other sprites in the functionGroup according to the index
                } else { // If the position index is bigger...
                    this.funcLineGroup.add(sprite); // Just put the sprite at the end of the functionGroup.
                }
                this.currentSpriteGroup.remove(sprite); //...and don't forget to remove it from the temporary group.
                this.functionGroupRender();  // ...and a control ajustment won't be excessive... 
            }
            
            else if(this.oldPosX<830 && this.oldPosY>500) {                
                sprite.reset(this.oldPosX, 510);                
                // Put it according to the calculated position index
                if (this.commandLineIndex <= this.commandGroup.length) { // If the position index is less than the length of the commandGroup...
                    this.commandGroup.addAt(sprite, this.commandLineIndex); // Squeeze the sprite in between the other sprites in the commandGroup according to the index
                } else { // If the position index is bigger...
                    this.commandGroup.add(sprite); // Just put the sprite at the end of the commandGroup. 
                }
                this.currentSpriteGroup.remove(sprite); //...and don't forget to remove it from the temporary group.
                this.commandGroupRender(); // ...and a control ajustment won't be excessive...            
            } // oldPosX gotten from savePosition. Commands are ALWAYS at y = 510.
            else {
                sprite.reset(this.oldPosX, 510);
            }
        }
    },

    // Adds new command
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
        if(this.funcSpriteArray[index]===null){ 
            this.funcSpriteArray[index] = this.add.sprite(this.funcCreateArray[index].x, this.funcCreateArray[index].y, this.funcImageKeyArray[index]);
            this.physics.arcade.enable(this.funcSpriteArray[index]);
            this.funcSpriteArray[index].body.allowGravity = false;        
            //this.this.funcSpriteArray[index].immovable = true; // Immovable necessary?         
            this.funcSpriteArray[index].inputEnabled = true;
            this.funcSpriteArray[index].input.useHandCursor = true;
            this.funcSpriteArray[index].input.enableDrag();
            this.funcSpriteArray[index].events.onDragStart.add(this.commandDragStart, this); // this
            this.funcSpriteArray[index].events.onDragStop.add(this.commandDragStop, this);
            this.game.input.onTap.add(function() {this.editFunctionBlockOnClick(unc_sprite_array[index])}, this);
            this.funcSpriteArray[index].events.onInputDown.add(this.funcSpriteOnClick, this); 
        }    
    },

    // Mute sound
    MuteIt: function() {
         if (this.sound.mute == false) {
            this.sound.mute = true; 
            this.sound_btn.frame = 1;
            
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

    // Changes the "Play" button into a "Stop" button and executes all robot commands given by the user
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
            if (this.inArray(spriteInCommand.key,this.funcImageKeyArray)===true){
                for(y=0; y<this.funcTreeGroup.children[this.funcImageKeyArray.indexOf(spriteInCommand.key)].length; y++) {
                        this.commandArray.push(this.funcTreeGroup.children[this.funcImageKeyArray.indexOf(spriteInCommand.key)].getAt(y));               
                }               
            }
            else {
                this.commandArray.push(spriteInCommand);    
            }
        }
        // THIS UNCOMMENTED CODE BELOW IS IF YOU WANT TO WORK ON RECURSION (FUNCTION IN FUNCTION). JUST REPLACE THE CODE STARTING FROM *** FROM HERE WITH THIS UNCOMMENTED CODE. 
        // // Call the function that goes through the objects in commandGroup and and puts them in the commandArray.
        // // The commandArray is the ultimate array from which the the robot's movements are readed in the update-function above. 
        // this.goThroughCommandGroup(this.commandGroup, -1);
        // this.depthCount = 0;

        this.wrongCommand = false;
        this.runInitiated = true;
        this.comArrIndex = 0; // SOMEONE messed it up before we got to this point (no, I don't know who)
    },
    
    // // This function that goes through the objects in commandGroup and and puts them in the commandArray.
    // goThroughCommandGroup: function(commandGroup, currentChildIndex){ 
    //     var spriteInCommand; // Temporary variable where the sprites in from the commandGroup are saved one by one.  
    //     for(i=currentChildIndex+1; i<commandGroup.length; i++){ // Start/continue from the current sprite position in the commandGroup
    //         spriteInCommand = this.commandGroup.getAt(i); // The current sprite is saved. 
    //         if (this.inArray(spriteInCommand.key,this.funcImageKeyArray)===true){ // If the current sprite's key (its' picute) is in the array of function sprite pictures
    //             this.depthCount++; // This variable shows how deep in the recursion we went (how many cycles) (how deep we put functions)
    //             this.index_tree_array[this.depthCount] = [this.funcImageKeyArray.indexOf(spriteInCommand.key), i]; // Put the function number and its' place number in the current line corresponding to the current depth level. 
    //             this.withRec(spriteInCommand, -1); // Go recursive ;) 
    //         }
    //         else { // If the current sprite is not a function it might be a command then 
    //             this.commandArray.push(spriteInCommand); // So put it in the command array
    //         }
    //     }       
    // },
    // // This is a recursive function which goes through all functions put in the commandGroup and functions which are put in those functions and functions which are put in those functions and functions which are put in those functions... i think, you got it :)
    // withRec: function(parentFuncSprite, currentChildIndex) { 
    //     var childrenGroup = this.funcTreeGroup.getAt(this.funcImageKeyArray.indexOf(parentFuncSprite.key)); // Save the group of commands in the parent function (group of commands which are placed under the index corresponding to function number)
    //     console.log("children group length",childrenGroup.length)
    //     for(y=currentChildIndex+1; y<childrenGroup.length; y++) { // Start/continue from the current sprite position in the particular function group. 
    //         if(this.inArray((childrenGroup.getAt(y)).key,this.funcImageKeyArray)===true){ // If the current sprite is a function...
    //             this.depthCount++; // Let us go to the next depth level                
    //             this.index_tree_array[this.depthCount] = [this.funcImageKeyArray.indexOf(childrenGroup.getAt(y).key), y]; // Put the function number and its' place number in the current line corresponding to the current depth level.
    //             this.withRec(childrenGroup.getAt(y), -1); // And now it's time to go recursive again... and then again and again. 
    //         }
    //         else { // If the current sprite is not a function...
    //             this.commandArray.push(childrenGroup.getAt(y)); // There's nothing else than to put in in the commandArray
    //             if(y===childrenGroup.length-1){ // If that was the last sprite in the current function...
    //                 if(this.depthCount===1){ // ...and if now we are located on the 1st function depth level...
    //                     this.goThroughCommandGroup(this.commandGroup, this.index_tree_array[this.depthCount][1]); // ... go back to the commandGroup and continue from the next sprite in it. 
    //                 }
    //                 else{ // ... but if not yet the 1st depth level...
    //                     this.depthCount--; // ... go to the previous depth level with recursive                   
    //                     this.withRec(this.funcSpriteArray[this.index_tree_array[this.depthCount][0]], this.index_tree_array[this.depthCount+1][1]); // Here's the place where we call the saved positions of the parent function numbers and their positions in corresponding lines. 
    //                     // NB! In the withRec function parameters here we call the parent function on the previous depth level and the child's index on which we were interrupted by the recursive function previous time (that's why there's "+1" in the second parameter)
    //                 }
    //             }    
    //         }            
    //     }                              
    // },

    // Stops the game and restores the player/robot
    listenerStop: function () {
        this.animationCheck = 0;
        // Re-activate commands and their input related functionality. 
        for (i = 0; i < this.commandGroup.length; i++) {
            this.commandGroup.getAt(i).input.enabled = true;
        }

        // Re-actives buttons
        this.rightArrow20.input.enabled = true;
        this.leftArrow20.input.enabled = true;
        this.newCommand.input.draggable = true;
        this.new_btn.input.enabled = true; 
        this.clear_btn.input.enabled = true;
        this.stop_btn.visible = false;
        this.run_btn.visible = true;

        // Resets player and commands
        this.player.reset(95, this.world.height - 280);
        this.runInitiated = false; 
        this.comArrIndex = 0;
        this.commandArray = [];
        this.comKey = "nope";
    },

    // Re-reneders all commands
    commandGroupRender: function () { // What happens if the commandGroup is empty?
        for (var i = 0; i < this.commandGroup.length; i++) {
            var comPosX = 40 + (70 * i); // Calculate the position.
            this.commandGroup.getAt(i).reset(comPosX, 510);
        }
    },
    // Renders functions
    functionGroupRender: function () { // What happens if the commandGroup is empty?
        for (var i = 0; i < this.funcLineGroup.length; i++) {
            var comPosX = 200 + (70 * i); // Calculate the position.
            this.funcLineGroup.getAt(i).reset(comPosX, 190);
        }
    },

    // Clears the command line
    clearCommandLine: function() {
        //for (var i = 0; i <= this.commandGroup.length; i++) {
        while (this.commandGroup.length != 0) {
            var sprite = this.commandGroup.getAt(0); // Might be worth checking whether or not there's a speed difference from the end versus beginning. 
            this.commandGroup.remove(sprite, true); // Remove the sprite from the group (it's not klled yet though) 
            sprite.kill(); // Kill the sprite
        }
    },


    // Opens and closes the function making window.
    favxOnClick: function() {         
        if (this.cloud.visible==false) { // The cloud opens if closed...*** 
            this.cloud.visible = true; 
            this.func_title.visible = true;
            // Everything what is supposed to be opened is opened, everything else is closed
            for (var i = 1; i < 9; i++) {
                if (this.funcSpriteArray[i]!=null){
                    this.funcSpriteArray[i].visible = true; 
                    this.funcCreateArray[i].visible = false;   
                }
                else {
                    this.funcCreateArray[i].visible = true;
                }          
            }
        }
        else { //...*** and closes if opened
            this.func_title.visible = false;
            // Close everything except for the chosen function. 
            for (var i = 1; i < 9; i++) {
                this.funcCreateArray[i].visible = false;
  
                if (this.funcSpriteArray[i]!=null){               
                    if(this.funcSpriteArray[i].y>=510 && this.funcSpriteArray[i].y<590){ 
                        this.funcSpriteArray[i].visible = true;  
                    }
                    else{
                        this.funcSpriteArray[i].visible = false; 
                    }                        
                } 

            }
            if(this.funcLineGroup.length>0){ // If user decided to click on function button during editing a function, the funcLineGroup is cleansed.
                this.funcLineGroup.visible = false;
                // this.funcLineGroup = NaN;
                this.funcLineGroup = this.add.group();
                // this.physics.arcade.enable(this.funcLineGroup);
                // this.physics.enable( [ this.funcLineGroup ], Phaser.Physics.ARCADE);
                // this.funcLineGroup.allowGravity = false; 
                // this.funcLineGroup.immovable = true;            
            }
            // To be sure that everything is closed (bugging without the following 4 guys).
            if(this.func_edit){this.func_edit.visible = false}
            if(this.func_save){this.func_save.visible = false}
            if(this.func_delete){this.func_delete.visible = false}
            if(this.func_save){this.func_save.visible = false}
            if(this.func_cancel){this.func_cancel.visible = false}
            if(this.func_line){this.func_line.visible = false}           
            this.cloud.visible = false;
  
         }    
    },

    // Makes 6 half-transparent-red places for making own functions while clicking on the f(x)-button.
    createSixTransparrent: function() {
        var xCoord = 200;
        var yCoord = 190;
        for(var i=1; i<9; i++){

            this.funcCreateArray[i] = this.add.sprite(xCoord, yCoord, 'func_make');        
            this.funcCreateArray[i].inputEnabled = true;
            this.funcCreateArray[i].input.useHandCursor = true;
            this.funcCreateArray[i].alpha = 0.3; // Makes them transparrent
            this.funcCreateArray[i].visible=false; 
            xCoord+=70;
        }
            // OnClick sends the Index parameter to the Listener makeNewFuncOnClick.
            this.funcCreateArray[1].events.onInputDown.add(function() {this.makeNewFuncOnClick(this.funcCreateArray.indexOf(this.funcCreateArray[1]))}, this);
            this.funcCreateArray[2].events.onInputDown.add(function() {this.makeNewFuncOnClick(this.funcCreateArray.indexOf(this.funcCreateArray[2]))}, this);
            this.funcCreateArray[3].events.onInputDown.add(function() {this.makeNewFuncOnClick(this.funcCreateArray.indexOf(this.funcCreateArray[3]))}, this);
            this.funcCreateArray[4].events.onInputDown.add(function() {this.makeNewFuncOnClick(this.funcCreateArray.indexOf(this.funcCreateArray[4]))}, this);
            this.funcCreateArray[5].events.onInputDown.add(function() {this.makeNewFuncOnClick(this.funcCreateArray.indexOf(this.funcCreateArray[5]))}, this);
            this.funcCreateArray[6].events.onInputDown.add(function() {this.makeNewFuncOnClick(this.funcCreateArray.indexOf(this.funcCreateArray[6]))}, this);
            this.funcCreateArray[7].events.onInputDown.add(function() {this.makeNewFuncOnClick(this.funcCreateArray.indexOf(this.funcCreateArray[7]))}, this);
            this.funcCreateArray[8].events.onInputDown.add(function() {this.makeNewFuncOnClick(this.funcCreateArray.indexOf(this.funcCreateArray[8]))}, this);    

    },

    // OWN FUNCTION: click on a transparent red Create Function object and appear in the function making window.
    // Still needs work on it: make OnDrag, find some way to save the chosen sequence of code-blocks.
    makeNewFuncOnClick: function(index) {        
        // Closing the transparent components
        for (var i=1; i<9; i++) {
              this.funcCreateArray[i].visible = false;                   
            if (this.funcSpriteArray[i]!=null){  
                //...except for the chosen functions.              
                if(this.funcSpriteArray[i].y>=510 && this.funcSpriteArray[i].y<590){ 
                    this.funcSpriteArray[i].visible = true;  
                }
                else{
                    this.funcSpriteArray[i].visible = false; 
                }                   
            }
        }
        this.func_line.visible = true; 
        this.funcLineGroup.visible = true;
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
        this.func_cancel.events.onInputDown.add(function() {this.cancelCreateFunctionOnClick(index)}, this);               
    },  

    // OWN FUNCTION: click on "SPARA" and save the function. 
    saveFunctionOnClick: function(index) {
        this.func_line.visible = false; 
        this.func_save.visible = false;  
        this.func_cancel.visible = false;
        this.funcRightArrow20.visible = false;
        this.funcLeftArrow20.visible = false; 
        this.funcTreeGroup.remove(this.funcTreeGroup.getAt(index));
        this.funcTreeGroup.addAt(this.funcLineGroup, index);
        this.funcLineGroup.visible = false;
        this.funcLineGroup = this.add.group();
 
        this.funcSpriteArray[index] = this.add.sprite(this.funcCreateArray[index].x, this.funcCreateArray[index].y, this.funcImageKeyArray[index]);
        this.physics.arcade.enable(this.funcSpriteArray[index]);
        this.funcSpriteArray[index].body.allowGravity = false;        
        //this.this.funcSpriteArray[index].immovable = true; // Immovable necessary?         
        this.funcSpriteArray[index].inputEnabled = true;
        this.funcSpriteArray[index].input.useHandCursor = true;
        this.funcSpriteArray[index].input.enableDrag();
        this.funcSpriteArray[index].events.onDragStart.add(this.commandDragStart, this); // this
        this.funcSpriteArray[index].events.onDragStop.add(this.commandDragStop, this);
        // if (this.funcSpriteArray[index].timeUp - this.funcSpriteArray[index].previousTapTime < this.game.input.doubleTapRate) {
        //     //  Yes, let's dispatch the signal then with the 2nd parameter set to true
        //     this.game.input.onTap.dispatch(this.funcSpriteOnClick, true);
        // }
        this.funcSpriteArray[index].events.onInputDown.add(this.funcSpriteOnClick, this);        

        // Close what to be closed and open what to be opened
        for (var i=1; i<9; i++) {
            if (this.funcSpriteArray[i]!=null){
                this.funcSpriteArray[i].visible = true;
                this.funcCreateArray[i].visible = false;    
            }
            else {
                this.funcCreateArray[i].visible = true;    
            } 
        }      

    },
    // OWN FUNCTION: click on "AVBRYT" and cancel the function creating process. 
    cancelCreateFunctionOnClick: function(index) {

        // Everything what is supposed to be opened is opened, other stuff is closed
        this.func_line.visible = false;
        this.func_save.visible = false;
        this.func_cancel.visible = false;
        //this.funcTreeGroup.addAt(this.add.group(), index);
        console.log("CANCEL TREE BEFORE", this.funcTreeGroup.getAt(index).length)

        this.funcLineGroup.destroy();
        this.funcLineGroup.visible=false;
        this.funcLineGroup = this.add.group(); // Empty the temporary function line group 
        console.log("CANCEL TREE AFTER", this.funcTreeGroup.getAt(index).length)
        this.funcRightArrow20.visible = false;
        this.funcLeftArrow20.visible = false;     
        if(this.func_edit){this.func_edit.visible = false}
        if(this.func_delete){this.func_delete.visible = false}             
        for (var i=1; i<9; i++) {
            if (this.funcSpriteArray[i]!=null){
                this.funcSpriteArray[i].visible = true; 
                this.funcCreateArray[i].visible = false;   
            } 
            else {
                this.funcCreateArray[i].visible = true;
            }          
        }
        //this.funcLineGroup = this.add.group(); // Empty the temporary function line group 

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
        

        if(this.inArray(sprite, this.funcSpriteArray)===true) {
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
            this.func_delete.events.onInputDown.add(function() {this.deleteFunctionBlockOnClick(this.funcSpriteArray.indexOf(sprite))}, this);
            this.func_edit = this.add.sprite(260, 265, 'func_edit');
            this.func_edit.inputEnabled = true;
            this.func_edit.input.useHandCursor = true;  
            this.func_edit.alpha = 0.7;      
            this.func_edit.events.onInputDown.add(function() {this.editFunctionBlockOnClick(this.funcSpriteArray.indexOf(sprite))}, this);
            
        }
    },

    // OWN FUNCTION: click on "TA BORT" and delete the current function-sprite.
    deleteFunctionBlockOnClick: function(index) {     
        this.func_line.visible = false;
        this.funcLineGroup.visible = false;
        this.funcLineGroup = this.add.group(); 
        this.funcCreateArray[index].visible = true;         
        this.funcSpriteArray[index].kill();
        this.funcSpriteArray[index] = null;
        this.funcTreeGroup.addAt(this.add.group(), index);
        this.func_delete.visible = false; // Close unnecessary buttons. 
        this.func_edit.visible = false;
        this.func_edit = null; // And kill 'em all!!! 
        this.func_delete = null;

        for (var i=1; i<9; i++) {
            if (this.funcSpriteArray[i]!=null){
                this.funcSpriteArray[i].visible = true;
                this.funcCreateArray[i].visible = false;    
            }
            else {
                this.funcCreateArray[i].visible = true;    
            } 
        }
    },
    // OWN FUNCTION: click on "ÄNDRA" and edit the current function.
    editFunctionBlockOnClick: function(index) {
        // Close unnecessary things and let the necessary remain. 
        for (var i=1; i<9; i++) {
            this.funcCreateArray[i].visible = false;                   
            if (this.funcSpriteArray[i]!=null){  
                //...except for the chosen functions.              
                if(this.funcSpriteArray[i].y>=510 && this.funcSpriteArray[i].y<590){ 
                    this.funcSpriteArray[i].visible = true;  
                }
                else{
                    this.funcSpriteArray[i].visible = false; 
                }                   
            }
        }
        // Returning back the commando chain corresponding by index to the current function to the funcLineGroup. 
        this.func_line.visible = true; 
        this.funcLineGroup.visible=true;
        this.funcTreeGroup.getAt(index).visible = true;
        console.log("EDIT TREE BEFORE", this.funcTreeGroup.getAt(index).length)
        this.funcLineGroup = this.funcTreeGroup.children[index];
        console.log("EDIT TREE AFTER", this.funcTreeGroup.getAt(index).length)
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
        this.func_cancel.events.onInputDown.add(function() {this.cancelCreateFunctionOnClick(index)}, this); 
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
    
    // Home button function
    homeFunction: function() {

        this.scoreFunction(false);
        this.funcSpriteArray = [];
        this.funcTreeGroup.destroy();
        this.state.start('MapOverview');
    },


    // Save score and display WinScreen if used has completed level
    scoreFunction: function (shouldSaveScore) {

        // Save your result
        var noBlocks = 0;
        if (shouldSaveScore) {
            var funcRepeatArray = [0,0,0,0,0,0,0,0,0]; // Looks if functions repeat themselves in commandGroup (which is good). Otherwise it's pointless to use functions in the game.
            for(i=0;i<this.commandGroup.length;i++){ // Let's go through each sprite in the commandGroup
                if(this.inArray(this.commandGroup.getAt(i).key, this.funcImageKeyArray)===true){ // If the current sprite from the commandLine is a function...
                    if(funcRepeatArray[this.funcImageKeyArray.indexOf(this.commandGroup.getAt(i).key)]===0){ // ... and moreover if this function is not repeated yet...
                        noBlocks+=this.funcTreeGroup.children[this.funcImageKeyArray.indexOf(this.commandGroup.getAt(i).key)].length; // Add the length of the function's commando sequence (integer) to the number of blocks.
                        funcRepeatArray[this.funcImageKeyArray.indexOf(this.commandGroup.getAt(i).key)]++; // Add 1 to funcRepeatArray under the index corresponding to the functions number, which means that the function is now used.
                    }
                    else{ // if now the function repeants itself, which is good...
                        noBlocks++; // ... just add 1 to  the number of blocks.
                        funcRepeatArray[this.funcImageKeyArray.indexOf(this.commandGroup.getAt(i).key)]++; // Add one more 1 to funcRepeatArray under the index corresponding to the functions number, to count how many times the function is used (might be useful in future)
                    }
                }
                else{ // If the block/commando is not a function...
                    noBlocks++; // ... just add 1 to  the number of blocks.
                }
            }
            console.log("Number of blocks", noBlocks)
        } else {
            noBlocks = 9999;
        }

        var saveFuncArray = []; // This is a 2D matrix where the current (existing) funtions' commando sequences are saved as arrays of corresponding to the commandos' sprites key-strings (for example, "hop_right_com") under the index corresponding to the function numbers. 
        for(i=0;i<9;i++){ // Go through all the function groups in the funcTreeGroup
            var commandoSequence = []; // This is a temporary array where the very commando sequences corresponding to a particular function (inder number i) is temporarily saved.
            if(this.funcTreeGroup.getAt(i).length===0){ // If the current function group in the funcTreeGroup is empty (function does not exist or is empty)...
            // if(this.funcSpriteArray[i]===null){
                saveFuncArray[i] = null; // save it as null... or maybe it's better to save it as en empty array? 
            }
            else { // If the current function group is not empty...
                for(y=0;y<this.funcTreeGroup.getAt(i).length;y++){ // Go through it...
                    commandoSequence.push(this.funcTreeGroup.children[i].getAt(y).key); // ... and push the key-string of every sprite in it into the temporary array
                }
                saveFuncArray[i] = commandoSequence; // Then put this temporary array into the less temporary (but still temporary) saveFuncArray under the index (i) corresponding to the current function
            }
        }
        
        this.saveDataArgs.funcArray = saveFuncArray; // Put the fuction array as an argument to the this.saveDataArgs
        saveScore(noBlocks, this.saveDataArgs);

        // Show WinScreen if the level is finished
        console.log("After saveScore in Level",this.saveDataArgs.funcArray)
        if (shouldSaveScore) {
            this.state.start('WinScreen', true, false, noBlocks, this.saveDataArgs);
        }
    }

};
