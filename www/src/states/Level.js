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
    //this.robot; 
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
    this.func_create_array = [];
    this.func_image_array = [null,'f1','f2','f3','f4','f5','f6'];
    this.func_sprite_array = []; // Function sprite array;
    this.functionGroup1;
    this.functionGroup2;
    this.functionLineIndex1;
    this.functionLineIndex2;

    //Oklar
    this.cursors;

    // Tween for animations
    this.tween;

    // HI GUYS! We have two little adoptees from MapOverview.js:
    //this.commandKeys
    //this.tilemapKey

    // Command_line array which contains all the commands.
    //this.command_line = []; // The command line is an empty array.
    this.com_line; // This is just a graphics object. Kept to render things.
    this.commandGroup;
    this.currentSpriteGroup; // BECAUSE YEAH, PHASER WANTS IT THAT WAY *HURR DURR DURR* (it's to be able to place sprites above the commandGroup)
    this.rightArrow20;
    this.leftArrow20;  

    // These two variables hold the original and new X position along with the curren commandLine index of the command being dragged.
    this.oldPosX; // oldPosY doesn't exist because it's always 510.
    this.newPosX;
    this.commandLineIndex;

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
        this.map.addTilesetImage('spritesheet_ground', 'ground');
        this.map.addTilesetImage('spritesheet_items', 'items');
        this.map.addTilesetImage('spritesheet_tiles', 'tiles');
        this.map.addTilesetImage('newdesert', 'background');

        this.layer0 = this.map.createLayer('background');
        this.layer1 = this.map.createLayer('water');
        this.layer2 = this.map.createLayer('blocked');
        this.layer3 = this.map.createLayer('unblocked');
        this.layer4 = this.map.createLayer('ladder');
        this.layer5 = this.map.createLayer('door');
    

        this.map.setCollisionBetween(1, 5000, true, 'blocked');

        this.player = this.add.sprite(185, this.world.height - 280, 'switchAni');
      
        //this.player = this.add.sprite(185, this.world.height - 280, this.robot);

        this.physics.arcade.enable(this.player);
        this.physics.enable( [ this.player ], Phaser.Physics.ARCADE);
        // Does this line below really do that much? I assume it stops the sprite from going outside the window.
        this.player.body.collideWorldBounds = true;
        
        this.player.body.moves = true;
        this.player.body.gravity.y = 1000;
        
        //animation
        this.player.animations.add('jump', [1, 0], 1, false);
        this.player.animations.add('cheer', [2, 3, 4], 3, true);
        this.player.animations.add('climb', [5], 10, true);
        

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

        this.func_btn = this.add.button(30, 450 , 'func_button', this.favxOnClick, this, 2, 1, 0);
        this.cloud = this.add.sprite(71, 107, 'cloud'); 
        this.cloud.visible = false; 
        this.createSixTransparrent();
        this.functionGroup1 = this.add.group();
        this.physics.arcade.enable(this.functionGroup1);
        this.physics.enable( [ this.functionGroup1 ], Phaser.Physics.ARCADE);
        this.functionGroup1.allowGravity = false; 
        this.functionGroup1.immovable = true;
        this.functionGroup2 = this.add.group();
        this.physics.arcade.enable(this.functionGroup2);
        this.physics.enable( [ this.functionGroup2 ], Phaser.Physics.ARCADE);
        this.functionGroup2.allowGravity = false; 
        this.functionGroup2.immovable = true;



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
        var mask = this.game.add.graphics(0, 0);

        //  Shapes drawn to the Graphics object must be filled.
        mask.beginFill(0xffffff);

        //  Here we'll draw a circle
        mask.drawRect(10, 500, 800, 80);
        this.commandGroup.mask = mask; // MASK :D :D :D (This took me half of my saturday to find...)
        //this.functionGroup1.mask=mask;

        this.rightArrow20 = this.add.sprite(13, 500, 'left20');
        this.rightArrow20.inputEnabled = true;
        //this.rightArrow20.events.onInputDown.add(this.moveCommandGroupRight, this);
        this.leftArrow20 = this.add.sprite(805,500, 'right20');
        this.leftArrow20.inputEnabled = true;
        //this.leftArrow20.events.onInputDown.add(this.moveCommandGroupLeft, this); 

        this.addNew(); // Add the newCommand variable sprite. 


        this.run_btn = this.add.sprite(965, this.world.height - 410, 'run_btn');
        this.run_btn.inputEnabled = true;

        this.stop_btn = this.add.sprite(965, this.world.height - 410, 'stop_btn');
        this.stop_btn.inputEnabled = true;
        this.stop_btn.visible = false;

        //this.restart_btn = this.add.sprite(965, this.world.height - 350, 'restart_btn');
        this.home_btn = this.add.button(965, this.world.height - 590, 'home_btn', this.homeFunction, this);
        this.sound_btn = this.add.sprite(965, this.world.height - 530, 'sound_btn');
        this.help_btn = this.add.sprite(965, this.world.height - 470, 'help_btn');

        // Pointer is active by default and does not need to be turned on by game.input :)
        this.cursors = this.input.keyboard.createCursorKeys();

        // Activate event listeners (known as FUNCTIONS) for when run_btn and stop_btn are clicked.
        this.run_btn.events.onInputDown.add(this.listener, this);
        this.stop_btn.events.onInputDown.add(this.listenerStop, this);
        this.currentSpriteGroup = this.add.group(); // ADDED LAST! Over everything!
    },
    
    update: function () {// LET'S UPDATE !
        this.game.physics.arcade.collide(this.player, this.layer2);

        if (this.game.input.activePointer.isDown && this.rightArrow20.input.checkPointerOver(this.game.input.activePointer)) {    
        // pointer is down and is over our sprite, so do something here  
            this.commandGroup.setAll('body.velocity.x', -120);
        } else if (this.game.input.activePointer.isDown && this.leftArrow20.input.checkPointerOver(this.game.input.activePointer)) {
            this.commandGroup.setAll('body.velocity.x', +120);
        } else {
            this.commandGroup.setAll('body.velocity.x', 0);
        }
        // Fix so it can't move beyond its parameters. 
        // When a new command is added to it, it snaps back :(

        // The below code allows the sprite to be moved with the arrow keys. Just a test thing for tilemap, really.
        this.player.body.velocity.x = 0;

        if (this.cursors.left.isDown) { //  Move to the left
            this.player.animations.stop('cheer');
            this.player.body.velocity.x = -150;
        }
        else if (this.cursors.right.isDown) {//  Move to the right
            this.player.animations.stop('cheer');
            this.player.body.velocity.x = 150;

        }
        else if (this.cursors.up.isDown) { //  Allow the player to jump if they are touching the ground.
            this.player.body.velocity.y = -150;
            this.player.animations.stop('jump');
            this.player.animations.play('jump');
        }
        else if (this.cursors.down.isDown) { // Move the player down a bit. We're not using gravity so needed to get it down to earth again.
            this.player.body.velocity.y = 150;
        }
        else { //  Stand still
            this.player.body.velocity.x = 0;
            this.player.body.velocity.y = 0;
            this.player.animations.play('cheer');
            //this.player.frame = 4; // Don't ask me what this does xP
            
        }


    }, // Might be worth using a Phaser group instead of a Javascript Array.

    // Used to save the initial position of commands (sprites) before they are dragged off to neverneverland.
    commandDragStart: function(sprite, pointer) {
        // STOP THE MASKING! FOR THE LOVE OF ALL THAT IS WINE!
        // y is always 510. Both oldPosY and newPosY.
        if (sprite == this.newCommand) { // Checks if they're IDENTICAL. Not to be confused with having the same key. 
            this.oldPosX = 850; // Same dimensions as when newCommand is created.
        }
        else {
            var remainder = sprite.x % 70; // Cleanse the input from faulty values.
            this.commandLineIndex = (sprite.x - remainder) / 70; // check how much of an offset it has from start.
            this.oldPosX = 40 + (this.commandLineIndex * 70); // Set a more exact x-value than sprite.x or sprite.position.x gives (I assume due to the ListenerEvent known as commandDragStart being slightly delayed.)
            this.commandGroup.remove(sprite); // It's no longer allowed to be in this group!
            this.currentSpriteGroup.add(sprite);
        }
    },

    // Hello! Someone has stopped dragging the command around. Try to add it to commandGroup if possible, and always adjust position.
    commandDragStop: function(sprite, pointer) {
        // If the pointer drops it inside of the com_line square IN HEIGHT (relevant for the Library buttons)
        if (pointer.y > 510 && pointer.y < 590 && pointer.x < 820) {
            if (this.oldPosX > 830) { // Was the command in commandGroup before? (commandLine spans 20 - 830) 
                this.addNew();
            }
            var remainder = sprite.x % 70;
            console.log(sprite.x,pointer.y) // Cleanse the (new) input from faulty values. Through semi-holy fire.
            this.commandLineIndex = (sprite.x - remainder) / 70; // Calculate the (new) index with nice even integer numbers (why we need holy cleansing).            
            this.newPosX = 40 + (this.commandLineIndex * 70);
            console.log(this.commandLineIndex)
            console.log(this.newPosX) // Calculate the new position. Needed as a tidy assignment line due to commandLineRender() wanting it.
            sprite.reset(this.newPosX, 510);
            if (this.commandLineIndex <= this.commandGroup.length) {
                this.commandGroup.addAt(sprite, this.commandLineIndex);
            } else {
                this.commandGroup.add(sprite);
            }
            this.currentSpriteGroup.remove(sprite);
            this.commandGroupRender();
        }
            //NIKOLAI
        else if (pointer.y > 80 && pointer.y < 430 && pointer.x > 160 && pointer.x < 515 ) {
            if (this.cloud.visible===true && this.func_save!=null && this.func_save.visible===true){ 
                console.log(pointer.x,pointer.y)

                if (this.oldPosX > 830) { // Was the command in commandGroup before? (commandLine spans 20 - 830) 
                    this.addNew();
                }
                var remainder = sprite.x % 70; // Cleanse the (new) input from faulty values. Through semi-holy fire.
                console.log(sprite.x,remainder) 
                this.functionLineIndex1 = (sprite.x - remainder) / 70; // Calculate the (new) index with nice even integer numbers (why we need holy cleansing).  
                console.log(this.functionLineIndex1)          
                this.newPosX = 40 + (this.functionLineIndex1 * 70); // Calculate the new position. Needed as a tidy assignment line due to commandLineRender() wanting it.
                console.log(this.newPosX)                 
                console.log(sprite) 

                sprite.reset(this.newPosX, 160);
                if (this.functionLineIndex1 <= this.functionGroup1.length) {
                    this.functionGroup1.addAt(sprite, this.functionLineIndex1);
                } else {
                    this.functionGroup1.add(sprite);
                }
                this.currentSpriteGroup.remove(sprite);
                this.functionGroupRender();
            }
        } 
        // If the pointer is within range of trash_100 (occupies 480 - 380 and 915 to end)
        else if (pointer.y > 420 && pointer.y < 480 && pointer.x > 950) {
              //trash_100.visible = true;
              //Some kind of timer. game.time.now
            if (this.oldPosX < 820) { // Was the command in commandLine before? (commandLine spans 20 - 830)
                // It works but there's quite a delay?
                this.commandGroup.remove(sprite, true);// IS the true necessary when we also have to kill it?
                //this.commandGroup.kill(sprite);
                sprite.kill(); // It doesn't update the rendering of the sprite unless it's KILLED!
                this.commandGroupRender();
            } else { // Add it back to new, you pleb!
                this.addNew();
                sprite.kill();
            }
        }
        else { // So it was moved outside of the commandLine area, eh? SNAP IT BACK !
            console.log(sprite.x,pointer.y)
            sprite.reset(this.oldPosX, 510); // oldPosX gotten from savePosition. Commands are ALWAYS at y = 510.
        }
    },

    // I am a functions which re-renders all commands. Worship me, for I am even more beautiful.
    functionGroupRender: function () { // What happens if the commandGroup is empty?
        for (var i = 0; i < this.functionGroup1.length; i++) {
            var comPosX = 40 + (70 * i); // Calculate the position.
            this.functionGroup1.getAt(i).reset(comPosX, 510);
            //this.command_line[i].reset(comPosX, 510); // Reset the commands position to be where it SHOULD be, and not where it currently is.
        }
    },
    
    addNew: function () {
        this.newCommand = this.add.sprite(850, 510, this.commandKeys[0]);
        this.physics.arcade.enable(this.newCommand);
        this.newCommand.body.allowGravity = false; 
        //this.newCommand.immovable = true; // Immovable necessary?        
        this.newCommand.inputEnabled = true;
        this.newCommand.input.enableDrag(true);
        this.newCommand.events.onDragStart.add(this.commandDragStart, this); // this
        this.newCommand.events.onDragStop.add(this.commandDragStop, this);// Not sure if the last add part is needed or not.
        this.newCommand.collideWorldBounds = true;
    },

    newCycle: function(sprite) {
        var newSpriteKey = this.commandKeys.shift();
        this.commandKeys.push(newSpriteKey);
        this.newCommand.kill(); // Kill the old new Command sprite.
        this.addNew();
    },

    //ändrar så att stopp-symbolen syns istället för play knappen, när man tryckt på play.
    listener: function () {
        // Stop the commands from being accessed ! And buttons directly related to commands (clear_btn)
        for (i = 0; i < this.commandGroup.length; i++) {
            this.commandGroup.getAt(i).input.draggable = false;
        }
        this.rightArrow20.input.enabled = false;
        this.leftArrow20.input.enabled = false;
        this.newCommand.input.draggable = false;
        this.new_btn.input.enabled = false; 
        this.clear_btn.input.enabled = false;
        // Start moving the sprite along the commands
        var noWalk = 0;
        var noJump = 0;
        var noLadder; // Might be removed?
        var noKey; // Might be removed?
        console.log(this.commandGroup.length);
        console.log(this.commandGroup.getAt(1));
        this.stop_btn.visible = true;
        this.run_btn.visible = false;
        this.tween = this.add.tween(this.player);
        for (var i = 0; i < this.commandGroup.length; i++) {
            //TODO
            //Change to switch-statement
            if (this.commandGroup.getAt(i).key === 'walk_right_com') {
                console.log('adding tween for walkRight CMD');
                noWalk++;
                this.tween.to({x: this.player.x + (noWalk * 64)}, 500, Phaser.Easing.Linear.None, false);
            }
            else if (this.commandGroup.getAt(i).key === 'up_com') {
                console.log('adding tween for jump cmd');
                noJump++;
                this.tween.to({y: this.player.y - (noJump * 35)}, 500, Phaser.Easing.Linear.None, false);
            }
            else if (this.commandGroup.getAt(i).key === 'walk_left_com') {
                console.log('adding tween for walkLeft cmd');
                noWalk++;
                this.tween.to({x: this.player.x - (noWalk * 64)}, 500, Phaser.Easing.Linear.None, false);
            }
            /*
            else if (this.commandGroup.getAt(i).key === 'down_com') {
                noWalk++;
                this.tween.to({y: this.player.y + ((noWalkUp * 35) - (noWalkDown * 35))}, 500, Phaser.Easing.Linear.None, false);
            }
            else if (this.commandGroup.getAt(i).key === 'hop_left_com') {

            }
            else if (this.commandGroup.getAt(i).key === 'hop_right_com') {

            }
            else if (this.commandGroup.getAt(i).key === 'ladder_com') {

             }
            else if (this.commandGroup.getAt(i).key === 'key_com') {
            }
            */
        }
        this.tween.start();
    },

        //pausar spelet/i nuläget stoppar den run och återställer player/roboten till ursprungsläget.
    listenerStop: function () {
        // Re-activate commands and their input related functionality. 
        for (i = 0; i < this.commandGroup.getAt(i).length; i++) {
            this.commandGroup.getAt(i).input.draggable = true;
        }
        this.rightArrow20.input.enabled = true;
        this.leftArrow20.input.enabled = true;
        this.newCommand.input.draggable = true;
        this.new_btn.input.enabled = true; 
        this.clear_btn.input.enabled = true;


        // Something else
        if (typeof this.tween._manager !== 'undefined') {
            for (var i in this.tween._manager._tweens) {
                this.tween._manager._tweens[i].stop();
            }
        }
        this.stop_btn.visible = false;
        this.run_btn.visible = true;
        this.player.reset(185, 320);
    },

    // I am a functions which re-renders all commands. Worship me, for I am beautiful.
    commandGroupRender: function () { // What happens if the commandGroup is empty?
        for (var i = 0; i < this.commandGroup.length; i++) {
            var comPosX = 40 + (70 * i); // Calculate the position.
            this.commandGroup.getAt(i).reset(comPosX, 510);
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
            // Everything what is supposed to be opened is opened, other stuff is closed
            for (var i = 1; i < 7; i++) {
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
            // Close everything except for the chosen function. 
            for (var i = 1; i < 7; i++) {
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

        var xCoord = 235;
        var yCoord = 160;
        for(var i=1; i<7; i++){
            if(xCoord==535){
                xCoord=235;
                yCoord=260;
            }
            this.func_create_array[i] = this.add.sprite(xCoord, yCoord, 'func_make');        
            this.func_create_array[i].inputEnabled = true;
            this.func_create_array[i].input.useHandCursor = true;
            this.func_create_array[i].alpha = 0.3; // Makes them transparrent
            this.func_create_array[i].visible=false; 
            xCoord+=100;
        }
            // OnClick sends the Index parameter to the Listener makeNewFuncOnClick.
            this.func_create_array[1].events.onInputDown.add(function() {this.makeNewFuncOnClick(this.func_create_array.indexOf(this.func_create_array[1]))}, this);
            this.func_create_array[2].events.onInputDown.add(function() {this.makeNewFuncOnClick(this.func_create_array.indexOf(this.func_create_array[2]))}, this);
            this.func_create_array[3].events.onInputDown.add(function() {this.makeNewFuncOnClick(this.func_create_array.indexOf(this.func_create_array[3]))}, this);
            this.func_create_array[4].events.onInputDown.add(function() {this.makeNewFuncOnClick(this.func_create_array.indexOf(this.func_create_array[4]))}, this);
            this.func_create_array[5].events.onInputDown.add(function() {this.makeNewFuncOnClick(this.func_create_array.indexOf(this.func_create_array[5]))}, this);
            this.func_create_array[6].events.onInputDown.add(function() {this.makeNewFuncOnClick(this.func_create_array.indexOf(this.func_create_array[6]))}, this);
    },

    // OWN FUNCTION: click on a transparrent red Create Function object and appear in the functione making window.
    // Still needs work on it: make OnDrag, find some way to save the chosen sequence of code-blocks.
     makeNewFuncOnClick: function(index) {
        // Closing the transparrent guys and everything...
        for (var i=1; i<7; i++) {
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
        this.func_save = this.add.sprite(200, 400 , 'func_save');
        this.func_save.inputEnabled = true;
        this.func_save.input.useHandCursor = true;
        this.func_save.events.onInputDown.add(function() {this.saveFunctionOnClick(index)}, this);  
        this.func_cancel = this.add.sprite(376, 400, 'func_cancel');
        this.func_cancel.inputEnabled = true;
        this.func_cancel.input.useHandCursor = true;
        this.func_cancel.events.onInputDown.add(this.cancelCreateFunctionOnClick, this);               
    },  

    // OWN FUNCTION: click on "SPARA" and save the function. 
    saveFunctionOnClick: function(index) {
        this.func_save.visible = false;  
        this.func_cancel.visible = false;  
 
        this.func_sprite_array[index] = this.add.sprite(this.func_create_array[index].x, this.func_create_array[index].y, this.func_image_array[index]);
        this.physics.arcade.enable(this.func_sprite_array[index]);
        this.func_sprite_array[index].body.allowGravity = false;        
        //this.this.func_sprite_array[index].immovable = true; // Immovable necessary?         
        this.func_sprite_array[index].inputEnabled = true;
        this.func_sprite_array[index].input.useHandCursor = true;
        this.func_sprite_array[index].input.enableDrag();
        this.func_sprite_array[index].events.onDragStart.add(this.commandDragStart, this); // this
        this.func_sprite_array[index].events.onDragStop.add(this.commandFunctionAdd, this);
        this.func_sprite_array[index].events.onInputUp.add(this.funcSpriteOnClick, this);        


        // Close what to be closed and open what to be opened
        for (var i=1; i<7; i++) {
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
        this.func_save.visible = false;
        this.func_cancel.visible = false;
        // Close what to be closed and open what to be opened
        for (var i=1; i<7; i++) {
            if (this.func_sprite_array[i]!=null){
                this.func_sprite_array[i].visible = true;
                this.func_create_array[i].visible = false;    
            }
            else {
                this.func_create_array[i].visible = true;    
            } 
        }
    },

    // Just stole this beautiful function from its author and modified it... 
    // Adjusts the position of function sprites after drag&dropping it in accordance with the place of dropping. 
    commandFunctionAdd: function(sprite, pointer) {
        var index = this.func_sprite_array.indexOf(sprite);
        // Counting the original position of the function sprite when created. 
        var xCoord = 235;
        var yCoord = 160;
        if(index<4){
            xCoord+=(index%4-1)*100;
        }
        else {
            xCoord+=index%4*100;
            yCoord=260;
        }
        // If the pointer drops it inside of the command_line square IN HEIGHT (relevant for the Library buttons)
        if (pointer.y > 510 && pointer.y < 590 && pointer.x < 820) {
            if (this.oldPosX > 830) { // Was the command in commandGroup before? (commandLine spans 20 - 830) 
                this.addNew();
            }
            var remainder = sprite.x % 70; // Cleanse the (new) input from faulty values. Through semi-holy fire.
            this.commandLineIndex = (sprite.x - remainder) / 70; // Calculate the (new) index with nice even integer numbers (why we need holy cleansing).            this.newPosX = 40 + (this.commandLineIndex * 70); // Calculate the new position. Needed as a tidy assignment line due to commandLineRender() wanting it.
            sprite.reset(this.newPosX, 510);
            if (this.commandLineIndex <= this.commandGroup.length) {
                this.commandGroup.addAt(sprite, this.commandLineIndex);
            } 
            else {
                this.commandGroup.add(sprite);
            }
            this.currentSpriteGroup.remove(sprite);
            this.commandGroupRender();
        }
        // If the pointer is within range of trash_100 (occupies 480 - 380 and 915 to end)
        else if (pointer.y > 420 && pointer.y < 480 && pointer.x > 950) {
            this.func_edit.kill();  
            this.func_delete.kill();
            this.func_create_array[index].visible = true;
            this.func_sprite_array[index].kill();
            this.func_sprite_array[index] = null;
            this.commandGroupRender();
        }
        else { // So it was moved outside of the commandLine area, eh? SNAP IT BACK !  
            sprite.reset(xCoord, yCoord); // oldPosX gotten from savePosition. Commands are ALWAYS at y = 510.
        }
    },

    // The function sprites are dragable and clickable. If you click on it, you get 2 buttons for working with a current function.
    // You may in that case eather edit you or function or delete the sprite.  
    funcSpriteOnClick: function(sprite) {
        // The following two lines saved me!!! Thanx to them! :))
        if(this.cloud.visible===true) {
            if(this.func_edit){this.func_edit.visible = false}
            if(this.func_delete){this.func_delete.visible = false}

            this.func_delete = this.add.sprite(376, 400 , 'func_delete');
            this.func_delete.inputEnabled = true;
            this.func_delete.input.useHandCursor = true;        
            this.func_delete.events.onInputDown.add(function() {this.deleteFunctionBlockOnClick(this.func_sprite_array.indexOf(sprite))}, this);
            this.func_edit = this.add.sprite(200, 400 , 'func_edit');
            this.func_edit.inputEnabled = true;
            this.func_edit.input.useHandCursor = true;        
            this.func_edit.events.onInputDown.add(function() {this.editFunctionBlockOnClick(this.func_sprite_array.indexOf(sprite))}, this);
        }
    },

    // OWN FUNCTION: click on "TA BORT" and delete the current function-sprite.
    deleteFunctionBlockOnClick: function(index) {        
        this.func_sprite_array[index].kill();
        this.func_sprite_array[index] = null;
        this.func_create_array[index].visible = true; 
        this.func_delete.visible = false;
        this.func_edit.visible = false;
    },
    // OWN FUNCTION: click on "ÄNDRA" and edit the current function.
    editFunctionBlockOnClick: function(index) {        
        for (var i=1; i<7; i++) {
            if (this.func_sprite_array[i]!=null){
                this.func_sprite_array[i].visible = true;
                this.func_create_array[i].visible = false;    
            }
            else {
                this.func_create_array[i].visible = true;    
            } 
        }
        this.func_delete.visible = false;
        this.func_edit.visible = false;
    },      
    
    //Home button function
    homeFunction: function() {
        this.state.start('MapOverview');
    }

};
