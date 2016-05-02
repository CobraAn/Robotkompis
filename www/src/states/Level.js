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

    // Button variables.
    this.run_btn;
    this.stop_btn;
    this.restart_btn;
    this.home_btn;
    this.sound_btn;
    this.help_btn;
    
    //Oklar
    this.cursors;

    // Tween for animations
    this.tween;

    // HI GUYS! We have two little adoptees from MapOverview.js:
    //this.commandKeys
    //this.tilemapKey

    // Command_line array which contains all the commands.
    this.command_line = []; // The command line is an empty array.
    this.com_line; // This is just a graphics object. Kept to render things.  

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
    
    create: function () {

        this.physics.startSystem(Phaser.Physics.ARCADE);
        
        this.add.sprite(0, 0, 'bg'); // Can use the offline prototypes instead of a wallpaper if you'd prefer.
    
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
        this.new_btn = this.add.sprite(920, 500, 'new');
        this.new_btn.inputEnabled = true;
        this.new_btn.events.onInputDown.add(this.newCycle, this);

        this.clear_btn = this.add.sprite(970, 370, 'clear_btn'); // Not entirely square so it has some offset to make it seem like it. 
        this.clear_btn.inputEnabled = true;
        this.clear_btn.events.onInputDown.add(this.clearCommandLine, this);
        
        this.trash_50 = this.add.sprite(965, 430, 'trash_50');
        this.trash_100 = this.add.sprite(915, 380, 'trash_100');
        this.trash_100.visible = false;


        // Command_line dimensions: 820 x 80 px
        this.com_line = this.add.sprite(10, 500, 'com_line');

        this.newCommand = this.add.sprite(850, 510, this.commandKeys[0]);
        this.newCommand.inputEnabled = true;
        this.newCommand.input.enableDrag(true);
        this.newCommand.events.onDragStart.add(this.savePosition, this); // this
        this.newCommand.events.onDragStop.add(this.commandAdd, this);// Not sure if the last add part is needed or not.
        this.newCommand.collideWorldBounds = true;

        this.run_btn = this.add.sprite(965, this.world.height - 410, 'run_btn');
        this.run_btn.inputEnabled = true;

        this.stop_btn = this.add.sprite(965, this.world.height - 410, 'stop_btn');
        this.stop_btn.inputEnabled = true;
        this.stop_btn.visible = false;

        //this.restart_btn = this.add.sprite(965, this.world.height - 350, 'restart_btn');
        this.home_btn = this.add.sprite(965, this.world.height - 590, 'home_btn');
        this.sound_btn = this.add.sprite(965, this.world.height - 530, 'sound_btn');
        this.help_btn = this.add.sprite(965, this.world.height - 470, 'help_btn');

        // Pointer is active by default and does not need to be turned on by game.input :)
        this.cursors = this.input.keyboard.createCursorKeys();

        // Activate event listeners (known as FUNCTIONS) for when run_btn and stop_btn are clicked.
        this.run_btn.events.onInputDown.add(this.listener, this);
        this.stop_btn.events.onInputDown.add(this.listenerStop, this);

    },
    
    update: function () {// LET'S UPDATE !
        this.game.physics.arcade.collide(this.player, this.layer2);

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
    savePosition: function(sprite, pointer) {
        // y is always 510. Both oldPosY and newPosY.
        var remainder = sprite.x % 70; // Cleanse the input from faulty values.
        this.commandLineIndex = (sprite.x - remainder) / 70; // check how much of an offset it has from start.
        this.oldPosX = 20 + (this.commandLineIndex * 70); // Set a more exact x-value than sprite.x or sprite.position.x gives (I assume due to the ListenerEvent known as savePosition being slightly delayed.)
    },

    // Hello! Someone has stopped dragging the command around. Try to add it to command_line if possible, and always adjust position.
    commandAdd: function(sprite, pointer) {
        // If the pointer drops it inside of the command_line square IN HEIGHT (relevant for the Library buttons)
        if (pointer.y > 510 && pointer.y < 590) {
            if (this.oldPosX < 830) { // Was the command in commandLine before? (commandLine spans 20 - 830)
                this.command_line.splice(this.commandLineIndex, 1); // If so, remove it from commandLine. Index decided when position saved in savePosition.
            }
            else {
                this.addNew();
            }
            var remainder = sprite.x % 70; // Cleanse the (new) input from faulty values. Through semi-holy fire.
            this.commandLineIndex = (sprite.x - remainder) / 70; // Calculate the (new) index with nice even integer numbers (why we need holy cleansing).
            this.newPosX = 20 + (this.commandLineIndex * 70); // Calculate the new position. Needed as a tidy assignment line due to commandLineRender() wanting it.
            this.command_line.splice(this.commandLineIndex, 0, sprite); // Add command to commandLine
            this.commandLineRender(); // We've moved lots of stuff around. Re-render ALL the commands (by using sprite.reset, not re-loading them in)
        }
        // If the pointer is within range of trash_100 (occupies 480 - 380 and 915 to end)
        else if (pointer.y > 420 && pointer.y < 480 && pointer.x > 950) {
              //trash_100.visible = true;
              //Some kind of timer. game.time.now
            if (this.oldPosX < 820) { // Was the command in commandLine before? (commandLine spans 20 - 830)
                this.command_line.splice(this.commandLineIndex, 1); // If so, remove it from commandLine. Index decided when position saved in savePosition.
            } else { // Add it back to new, you pleb!
                this.addNew();
            }
            sprite.kill();
            this.commandLineRender();
        }
        else { // So it was moved outside of the commandLine area, eh? SNAP IT BACK !
            sprite.reset(this.oldPosX, 510); // oldPosX gotten from savePosition. Commands are ALWAYS at y = 510.
        }
    },
    
    addNew: function () {
        this.newCommand = this.add.sprite(850, 510, this.commandKeys[0]);
        this.newCommand.inputEnabled = true;
        this.newCommand.input.enableDrag(true);
        this.newCommand.events.onDragStart.add(this.savePosition, this); // this
        this.newCommand.events.onDragStop.add(this.commandAdd, this);// Not sure if the last add part is needed or not.
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
        var noWalk = 0;
        var noJump = 0;
        console.log(this.command_line.length);
        console.log(this.command_line[1]);
        this.stop_btn.visible = true;
        this.run_btn.visible = false;
        this.tween = this.add.tween(this.player);
        for (var i = 0; i < this.command_line.length; i++) {
            if (this.command_line[i].key === 'walk_right_com') {
                console.log('adding tween for walkRight CMD');
                noWalk++;
                this.tween.to({x: this.player.x + (noWalk * 64)}, 500, Phaser.Easing.Linear.None, false);
            }
            else if (this.command_line[i].key === 'up_com') {
                console.log('adding tween for jump cmd');
                noJump++;
                this.tween.to({y: this.player.y - (noJump * 35)}, 500, Phaser.Easing.Linear.None, false);
            }
        }
        this.tween.start();
    },

        //pausar spelet/i nuläget stoppar den run och återställer player/roboten till ursprungsläget.
    listenerStop: function () { // Need to put in something that checks whether or not the tween manager is defined. Seems silly to get an error. 
        for (var i in this.tween._manager._tweens) {
           this.tween._manager._tweens[i].stop();
        }
        this.stop_btn.visible = false;
        this.run_btn.visible = true;
        this.player.reset(185, 320);
    },

    // I am a functions which re-renders all commands. Worship me, for I am beautiful.
    commandLineRender: function () {
        for (i = 0; i < this.command_line.length; i++) {
            var comPosX = 20 + (70 * i); // Calculate the position.
            this.command_line[i].reset(comPosX, 510); // Reset the commands position to be where it SHOULD be, and not where it currently is.
        }
    },

    // What do you think it does?
    clearCommandLine: function() {
        for (i = 0; i < this.command_line.length; i++) {
            console.log('i value');
            console.log(i);
            this.command_line[i].kill(); // Kill the sprite
        }
        this.command_line = []; 
    }
};


          

            