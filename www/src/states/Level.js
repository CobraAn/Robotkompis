RobotKompis.Level = function (game) {
    // Tilemap variables.
    this.map;
    this.layer0;
    this.layer1;
    this.layer2;
    this.layer3;
    this.layer4;
    this.layer5;

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
    


     // Making own functions
    this.func_btn; // Function button
    this.cloud;    // Cloud-window
    this.func_create_array = []; // Array of 8 transparrent "KLICK ATT SKAPA"sprites
    this.func_image_array = [null,'f1','f2','f3','f4','f5','f6', 'f7', 'f8'];
    this.func_sprite_array = []; // Array of original function sprites (sometimes needed)
    this.command_array = [];
    this.func_line_group;
    this.func_tree_group;
    this.newFunc;
    this.func_title;


    //Oklar
    this.cursors;

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
    init: function (character){
        this.robot = character;
    },
    
    create: function () {

        this.physics.startSystem(Phaser.Physics.ARCADE);
        
        this.add.image(0, 0, 'bg'); // Can use the offline prototypes instead of a wallpaper if you'd prefer.
    
        var graphics = new Phaser.Graphics(this, 0, 0);

        //  Set the world (global) gravity
        this.physics.arcade.gravity.y = 2500;

        // ADD COMMAND LINE AND RUN LINE !

        graphics = this.add.graphics(0, 0); // Needed for fun stuff like having a sprite with gravity.
        this.map = this.add.tilemap(this.tilemapKey); // Passed on from MapOverview

        // Tilesets
        this.map.addTilesetImage('spritesheet_ground2', 'ground');
        this.map.addTilesetImage('spritesheet_items', 'items');
        this.map.addTilesetImage('spritesheet_tiles', 'tiles');
        this.map.addTilesetImage('newdesert', 'background');

        this.layer0 = this.map.createLayer('background');
        this.layer1 = this.map.createLayer('water');
        this.layer2 = this.map.createLayer('blocked');
        this.layer3 = this.map.createLayer('unblocked');
        this.layer4 = this.map.createLayer('ladder');
        this.layer5 = this.map.createLayer('door');
    
        //Activate collision tiles from blocked layer
        this.map.setCollisionBetween(1, 5000, true, 'blocked');

        this.player = this.add.sprite(95, this.world.height - 280, this.robot);
      
        this.physics.arcade.enable(this.player);
        this.physics.enable( [ this.player ], Phaser.Physics.ARCADE);
        // Does this line below really do that much? I assume it stops the sprite from going outside the window.
        this.player.body.collideWorldBounds = true;
        
        this.player.body.moves = true;
        this.player.body.gravity.y = 1000;
        this.tween = this.add.tween(this.player); // For movement in listener. 
        
        //animation
        //this.player.animations.add('jump', [1, 0], 1, false);
        this.player.animations.add('cheer', [0, 1, 2], 4.5, true);
        //this.player.animations.add('climb', [5], 10, true);

        // LADDER LAYER COLLISION STUFFS
        this.map.setCollisionBetween(1, 5000, false, 'ladder'); // CANNOT BE found when third parameter isn't true... FOR REASONS!

        this.game.physics.arcade.enable(this.layer4); // The ladder layer
        this.physics.enable( [ this.layer4 ], Phaser.Physics.ARCADE);
        this.game.physics.arcade.collide(this.player, this.layer4, this.ladderHit);


        // DOOR LAYER COLLISION STUFFS
        //this.map.setCollisionBetween(1, 5000, true, 'door');

        //this.game.physics.arcade.enable(this.layer5); // The ladder layer
        //this.physics.enable( [ this.layer5 ], Phaser.Physics.ARCADE);
        //this.game.physics.arcade.collide(this.player, this.layer5, this.doorHit);
        var layer5tiles = this.layer5.getTiles(this.player.x - 10, this.player.y - 20, 20, 20);
        for (i = 0; i < layer5tiles.length; i++) {
            if (layer5tiles[i].index != (-1)) {
                this.doorX = layer5tiles.x;
                this.doorY = layer5tiles.y;
            }
        }

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

        // New and trash. 
        this.new_btn = this.add.sprite(930, 510, 'new');
        this.new_btn.inputEnabled = true;
        this.new_btn.events.onInputDown.add(this.newCycle, this);

        this.clear_btn = this.add.sprite(970, 370, 'clear_btn'); // Not entirely square so it has some offset to make it seem like it. 
        this.clear_btn.inputEnabled = true;
        this.clear_btn.events.onInputDown.add(this.clearCommandLine, this);
        
        this.trash_50 = this.add.sprite(965, 430, 'trash_50');
        this.trash_100 = this.add.sprite(915, 380, 'trash_100');
        this.trash_100.visible = false;


        // OWN FUNCTION DEFINING STUFF

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

        this.commandGroup = this.add.group(); // To house all the command children. And eventually hit (test) them. And kill them. 
        this.physics.arcade.enable(this.commandGroup);
        this.physics.enable( [ this.commandGroup ], Phaser.Physics.ARCADE);
        //this.game.physics.arcade.enableBody(this);
        this.commandGroup.allowGravity = false; 
        this.commandGroup.immovable = true;
        //this.body.allowGravity = false;
        //this.body.immovable = true;
        //  A mask is a Graphics object
        
        var commandMask = this.game.add.graphics(0, 0);

        //  Shapes drawn to the Graphics object must be filled.
        commandMask.beginFill(0xffffff);

        //  Here we'll draw a circle
        commandMask.drawRect(10, 500, 800, 80);
        this.commandGroup.mask = commandMask; // MASK :D :D :D (This took me half of my saturday to find...)
        //this.functionGroup1.mask=mask;

        this.rightArrow20 = this.add.sprite(13, 500, 'left20');
        this.rightArrow20.inputEnabled = true;
        //this.rightArrow20.events.onInputDown.add(this.moveCommandGroupRight, this);
        this.leftArrow20 = this.add.sprite(805,500, 'right20');
        this.leftArrow20.inputEnabled = true;
        //this.leftArrow20.events.onInputDown.add(this.moveCommandGroupLeft, this); 

        this.addNew(); // Add the newCommand variable sprite. 


        this.run_btn = this.add.sprite(965, this.world.height - 345, 'run_btn');
        this.run_btn.inputEnabled = true;

        this.stop_btn = this.add.sprite(965, this.world.height - 345, 'stop_btn');
        this.stop_btn.inputEnabled = true;
        this.stop_btn.visible = false;

        //this.restart_btn = this.add.sprite(965, this.world.height - 350, 'restart_btn');
        this.home_btn = this.add.button(965, this.world.height - 590, 'home_btn', this.homeFunction, this);
        this.sound_btn = this.add.button(965, this.world.height - 530, 'muteUnMute', this.MuteIt, this);
        this.sound_btn.scale.setTo(0.7,0.7)
        //this.sound_btn = this.add.button(200,0,  'muteUnMute', this.Mute, this);
        this.help_btn = this.add.sprite(965, this.world.height - 470, 'help_btn');

        // Pointer is active by default and does not need to be turned on by game.input :)
        this.cursors = this.input.keyboard.createCursorKeys();

        // Activate event listeners (known as FUNCTIONS) for when run_btn and stop_btn are clicked.
        this.run_btn.events.onInputDown.add(this.listener, this);
        this.stop_btn.events.onInputDown.add(this.listenerStop, this);
        this.currentSpriteGroup = this.add.group(); // ADDED LAST! Over everything!

        // FUNCTION GROUPS ARE CREATED HERE

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
        //this.rightArrow20.events.onInputDown.add(this.moveCommandGroupRight, this);
        this.funcLeftArrow20 = this.add.sprite(755,180, 'right20');
        this.funcLeftArrow20.inputEnabled = true;
        this.funcLeftArrow20.alpha = 0.6;
        this.funcLeftArrow20.visible = false;
        //this.leftArrow20.events.onInputDown.add(this.moveCommandGroupLeft, this); 

        this.func_tree_group = this.add.group();
        for(i=0;i<9;i++){
            this.func_tree_group.add(this.add.group());
        }
        this.physics.arcade.enable(this.func_tree_group);
        this.physics.enable( [ this.func_tree_group ], Phaser.Physics.ARCADE);
        this.func_tree_group.allowGravity = false;
        this.func_tree_group.immovable = true;


    },
    
    update: function () {// LET'S UPDATE !
        this.game.physics.arcade.collide(this.player, this.layer2);
        this.game.physics.arcade.collide(this.player, this.layer4, this.ladderHit);
        this.game.physics.arcade.collide(this.player, this.layer5, this.doorHit);

        this.player.animations.play('cheer');
        // Command arrows 
        if (this.game.input.activePointer.isDown && this.rightArrow20.input.checkPointerOver(this.game.input.activePointer)) {    
        // pointer is down and is over our sprite, so do something here  
            this.commandGroup.setAll('body.velocity.x', -120);
        } else if (this.game.input.activePointer.isDown && this.leftArrow20.input.checkPointerOver(this.game.input.activePointer)) {
            this.commandGroup.setAll('body.velocity.x', +120);
        } else {
            this.commandGroup.setAll('body.velocity.x', 0);
        }
        // Function arrows
        if (this.game.input.activePointer.isDown && this.funcRightArrow20.input.checkPointerOver(this.game.input.activePointer)) {    
        // pointer is down and is over our sprite, so do something here  
            this.func_line_group.setAll('body.velocity.x', -120);
        } else if (this.game.input.activePointer.isDown && this.funcLeftArrow20.input.checkPointerOver(this.game.input.activePointer)) {
            this.func_line_group.setAll('body.velocity.x', +120);
        } else {
            this.func_line_group.setAll('body.velocity.x', 0);
        }


/* Adoptee keys: 
    this.finalPosX; 
    this.finalPosY;
    this.runInitiated;
    this.comArrIndex;
    */
    // this.smallerThan = true

        // HI THERE ! VELOCITY MOVERS BELOW!
        if (this.runInitiated == false && this.comKey != "nope") {
            console.log("comKey?");
            console.log(this.comKey);
            if ((this.comKey == "walk_right_com" || this.comKey == "hop_right_com") && (this.player.x >= this.finalPosX || this.player.body.velocity.x == 0)) {
                console.log("walk right stop");
                this.player.body.velocity.x = 0; 
                this.player.body.velocity.y = 0;
                this.comArrIndex = this.comArrIndex + 1; 
                this.runInitiated = true;
                this.player.body.allowGravity = true; 
            } else if ((this.comKey == "hop_right_com" || this.comKey == "hop_left_com") && this.player.y <= this.finalPosY && this.downActive == true) {
                console.log("downwards we go");
                this.player.body.velocity.y = 80; // Downwards descent.
                this.downActive = false;
            }else if ((this.comKey == "walk_left_com" || this.comKey == "hop_left_com") && (this.player.x <= this.finalPosX || this.player.body.velocity.x == 0)) {
                console.log("walk left stop");
                this.player.body.velocity.x = 0; 
                this.player.body.velocity.y = 0;
                this.comArrIndex = this.comArrIndex + 1; 
                this.runInitiated = true;
                this.player.body.allowGravity = true; 
            } 
            else if (this.comKey == "ladder_com" && (this.player.y <= this.finalPosY || this.player.body.velocity.y == 0)) {
                //console.log("ladder here. Gravity value:");
                this.map.setCollisionBetween(1, 5000, true, 'blocked'); // So I've temporarily cheated. SO WHAT?! 
                this.comArrIndex = this.comArrIndex + 1; 
                this.runInitiated = true;
                this.player.body.allowGravity = true; 
            } else if (this.comKey == "wrong") { // WHAT ABOUT THE QUESTION MARK?!
                console.log("Hi, I'm wrong");
                this.comArrIndex = this.comArrIndex + 1; 
                this.runInitiated = true;
            }
        }

        if (this.doorX != 0 && (this.player.x > (this.doorX-5) && this.player.x < (this.doorX+37) && (this.player.y < (this.doorY-32) && this.player.y > (this.doorY + 37)))) {
            this.state.start('Map Overview');
        }
        
        // HEY HO !

        if (this.runInitiated == true && this.comArrIndex < this.command_array.length) {
            this.comKey = this.command_array[this.comArrIndex].key; // Because ain't nobody got time to type that every single time. 
            console.log("We can run...");
            console.log(this.comKey);
            console.log("with comArrIndex...");
            console.log(this.comArrIndex);
            if (this.comKey == "walk_right_com") {
                //console.log("walk to the right");
                this.finalPosY = -20;
                this.player.body.velocity.x = 100;
                this.finalPosX = this.player.x + 31;
                this.smallerThan = false;
            } else if (this.comKey == "walk_left_com") {
                //console.log("walk to the left");
                this.finalPosY = -20;
                this.finalPosX = this.player.x - 31;
                this.player.body.velocity.x = -100;
                this.smallerThan = true;
            } else if (this.comKey == "ladder_com") { // I'm going to need two checks here. One for if there's a ladder (overlap!) and one if there isn't.
                var layer4tiles = this.layer4.getTiles(this.player.x - 10, this.player.y - 20, 20, 20);
                for (i = 0; i < layer4tiles.length; i++) {
                    if (layer4tiles[i].index != (-1)) {
                        this.ladderOverlap = true;
                    }
                }
                if (this.ladderOverlap) {
                    console.log("Ladder overlap !");
                    this.finalPosX = -20;
                    this.finalPosY = this.player.y - 130;
                    this.player.body.allowGravity = false;
                    this.player.body.velocity.y = -100;
                    this.ladderOverlap = false;
                    this.map.setCollisionBetween(1, 5000, false, 'blocked'); // Yes, I'm cheating. Resetting it to true when guy reaches finalPosY
                } else {
                    this.comKey = "wrong"
                    //console.log("Make a question mark appear!");
                }
                this.smallerThan = true; 
            } else if (this.comKey == "hop_left_com") {
                this.finalPosX = this.player.x - 64;
                this.finalPosY = this.player.y - 32;
                this.player.body.allowGravity = false;
                this.player.body.velocity.y = -80;
                this.player.body.velocity.x = -80;
                this.downActive = true;
            }
            else if (this.comKey == "hop_right_com") {
                this.finalPosX = this.player.x + 64;
                this.finalPosY = this.player.y - 32;
                this.player.body.allowGravity = false;
                this.player.body.velocity.y = -80;
                this.player.body.velocity.x = 80;
                this.downActive = true;
            } else if (this.comKey == "down_com") {
                this.finalPosX = -20;
                this.finalPosY = this.player.y - 128;
                this.player.body.allowGravity = false;
                this.player.body.velocity.y = -100;
                this.smallerThan = true; 
            }
            this.runInitiated = false; 
        } 
        
        // Fix so it can't move beyond its parameters. 
        // When a new command is added to it, it snaps back :(

    }, // Might be worth using a Phaser group instead of a Javascript Array.
    // Used to save the initial position of commands (sprites) before they are dragged off to neverneverland.
    commandDragStart: function(sprite, pointer) {
        // STOP THE MASKING! FOR THE LOVE OF ALL THAT IS WINE!
        // y is always 510. Both oldPosY and newPosY.
        if (sprite == this.newCommand) { // Checks if they're IDENTICAL. Not to be confused with having the same key. 
            this.oldPosX = 850; // Same dimensions as when newCommand is created.
        }
        else {
            // var remainder = sprite.x % 70; // Cleanse the input from faulty values.
            // this.commandLineIndex = (sprite.x - remainder) / 70; // check how much of an offset it has from start.
            // this.oldPosX = 40 + (this.commandLineIndex * 70); // Set a more exact x-value than sprite.x or sprite.position.x gives (I assume due to the ListenerEvent known as commandDragStart being slightly delayed.)
            this.oldPosX = sprite.x; // Seems to be easier to write so in DragStart because all the sprites start from fixed modified positions. 
            this.oldPosY = sprite.y;
            this.commandGroup.remove(sprite); // It's no longer allowed to be in this group!
            // this.currentSpriteGroup.visible=true;
            this.currentSpriteGroup.add(sprite);
        }
    },

    // Hello! Someone has stopped dragging the command around. Try to add it to commandGroup if possible, and always adjust position.

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
            var remainder = sprite.x % 70; // Cleanse the (new) input from faulty values. Through semi-holy fire.
            this.commandLineIndex = (sprite.x - remainder) / 70; // Calculate the (new) index with nice even integer numbers (why we need holy cleansing).            
            this.newPosX = 40 + (this.commandLineIndex * 70);
            // Calculate the new position. Needed as a tidy assignment line due to commandLineRender() wanting it.
            this.newPosY = sprite.y;
            sprite.reset(this.newPosX, 510);
            if (this.commandLineIndex <= this.commandGroup.length) {
                this.commandGroup.addAt(sprite, this.commandLineIndex);
            } else {
                this.commandGroup.add(sprite);
            }
            this.currentSpriteGroup.remove(sprite);
            this.commandGroupRender();
            // TEST
            if(this.inArray(sprite, this.func_sprite_array)===true){  
                this.func_sprite_array[this.func_sprite_array.indexOf(sprite)]=null;
                this.addDuplicate(this.func_image_array.indexOf(sprite.key));
            }
        }
            //NIKO
        else if (pointer.y > 100 && pointer.y < 350 && pointer.x > 140 && pointer.x < 800) {
            if (this.cloud.visible===true && this.func_save.visible===true){ 

                if (this.oldPosX > 830) { // Was the command in commandGroup before? (commandLine spans 20 - 830) 
                    this.addNew();
                }
                var remainder = sprite.x % 70; // Cleanse the (new) input from faulty values. Through semi-holy fire.
                this.commandLineIndex = (sprite.x - remainder) / 70; // Calculate the (new) index with nice even integer numbers (why we need holy cleansing).            
                this.newPosX = 200 + (this.commandLineIndex * 70); // Calculate the new position. Needed as a tidy assignment line due to commandLineRender() wanting it.
                this.newPosY = sprite.y;
                console.log(this.commandLineIndex)
                sprite.reset(this.newPosX, 190);
                if (this.commandLineIndex <= this.func_line_group.length) {
                    this.func_line_group.addAt(sprite, this.commandLineIndex);
                } else {
                    this.func_line_group.add(sprite);
                }
                this.currentSpriteGroup.remove(sprite);
                this.functionGroupRender();
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
        // Stop the commands from being accessed ! And buttons directly related to commands (clear_btn)
        for (i = 0; i < this.commandGroup.length; i++) {
            this.commandGroup.getAt(i).input.enabled = false;
        }
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
        var spriteInCommand;
        for( i = 0; i < this.commandGroup.length; i++){
            spriteInCommand = this.commandGroup.getAt(i);
            //console.log(spriteInCommand.key)
            if (this.inArray(spriteInCommand.key,this.func_image_array)===true){
                this.withRecursive(spriteInCommand);
            }
            else {
                this.command_array.push(spriteInCommand);    
            }
        }
        this.wrongCommand = false;
        this.runInitiated = true;
        this.comArrIndex = 0; // SOMEONE messed it up before we got to this point (no, I don't know who)
    },

    withRecursive: function(functionSprite) {
        
        for(y=0; y<this.func_tree_group.children[this.func_image_array.indexOf(functionSprite.key)].length; y++) {
            if(this.inArray((this.func_tree_group.children[this.func_image_array.indexOf(functionSprite.key)].getAt(y)).key,this.func_image_array)===true){
                this.withRecursive(this.func_tree_group.children[this.func_image_array.indexOf(functionSprite.key)].getAt(y));
            }
            else {
                this.command_array.push(this.func_tree_group.children[this.func_image_array.indexOf(functionSprite.key)].getAt(y));    
            }            
        }                    
    },


        //pausar spelet/i nuläget stoppar den run och återställer player/roboten till ursprungsläget.
    listenerStop: function () {
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
            //this.newFunc.visible=false;
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
            this.func_delete.events.onInputUp.add(function() {this.deleteFunctionBlockOnClick(this.func_sprite_array.indexOf(sprite))}, this);
            this.func_edit = this.add.sprite(260, 265, 'func_edit');
            this.func_edit.inputEnabled = true;
            this.func_edit.input.useHandCursor = true;  
            this.func_edit.alpha = 0.7;      
            this.func_edit.events.onInputUp.add(function() {this.editFunctionBlockOnClick(this.func_sprite_array.indexOf(sprite))}, this);
            
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
    // :D :D :D 

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
        this.state.start('MapOverview');
    }

};
