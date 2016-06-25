/*

The Level state runs each and every level chosen in MapOverview. 
It thus contains the level in the form of a tilemap (TILED_JSON) from the 3rd party software Tiled, 
uses commands and functions which are all defined in level, and then restricted by a this.commandKeys variable passed on from level. 

Level is started by choosing a level in MapOverview and returns to MapOverview by pressing the home button (the house symbol).
Using the key command on a door will calculate score and switch the player to the WinState. 

*/

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
RobotKompis.Level = function (game) {
    // Tilemap variables. Gotten through phaser.tilemap
    this.map;
    this.layer0;
    this.layer1;
    this.layer2;
    this.layer3;
    this.layer4;
    this.layer5;
    this.layer6;
    
    // Function variables related to graphics objects (arrows, generally)
    this.commandArrow;
    this.functionArrow;
    this.goArrow;
    this.arrowMute;
    this.rowArrow;
    this.homeArrow;
    this.arrows;
    this.moveArrow;
    this.clearArrow;

    // The robot player variables
    this.player; // A sprite built on this.robot. The sprite interacts with the map and commands. 
    this.robot; // A string which defines the key to the selected robot's image

    // Upper-righthand-side menu button variables
    this.runButton;
    this.stopButton;
    this.restartButton;
    this.homeButton;
    this.soundButton;
    this.helpButton;

    // Storage variable
    this.saveDataArgs = {};

    this.functionButton; // Function button ( I <3 f(x) ).
    this.cloud;    // Cloud-window of the function-edit-menu.
    this.funcCreateArray = []; // Array of 8 transparrent "KLICK ATT SKAPA"sprites
    this.funcImageKeyArray = [null,'f1','f2','f3','f4','f5','f6','f7','f8']; // Images served to create function sprites. They are put in array in order to ease indexing and avoid repeated code. 
    this.funcSpriteArray = []; // Array of original function sprites (sometimes needed)
    // this.depthCount = 0; // Counts how deep we are located in the function in the function in the function in the function......
    this.funcLineGroup; // This is the tempopary group where the sequence of command or/and function sprites are stored then tobe saved in a particular place corresponding to a paticular function number in funcTreeGroup.
    this.funcTreeGroup; // In this group the sequences (groups) of sprites are stored under the index corresponding to the particular function number. NB! Groups in Phaser work as "trees". 
    // this.index_tree_array = []; // This array serves as a 2D matrix to follow the the function recursion process. Objects of this array are 2-object-long arrays: 1st object in them is index/number of the function in funcImageKeyArray; 2nd object is index of the place of this function in the current line.  
    this.funcTitle; // Title sprite in the function edit popUp.
    this.funcLine; // This is the sprite for the function group where you put commands. 
    this.commandArray = []; // This is the ultimate array from which robot's movement commands are readed in the update-function.
    this.editPatchArray = []; // This is the patch array that helps to save the data in funcTreeArray properly after cancel the function-edit-menu
    this.functionMask;

    //Check used for animations, e.g 0 means idle animation
    this.animationCheck = 0;

    // Command_line array which contains all the commands.
    this.commandLine; // This is just a graphics object. Kept to render things.
    this.commandGroup; // Keeps all the commands in the command (line) field. 
    this.currentSpriteGroup; // Moving sprites out of commandGroup or funcLineGroup temporarily places them in the this.currentSpriteGroup since this will allow them to be above everything else (highest z-index)
    this.rightArrow20; // Arrow for moving all commands to the right
    this.leftArrow20;  // Arrow for moving all commands to the left
    this.funcRightArrow20; // Arrow for moving all function commands to the right
    this.funcLeftArrow20;  // Arrow for moving all function commands to the left

    // These two variables hold the old X and Y coordinates of a command when it starts being dragged. 
    this.oldPosX; 
    this.oldPosY = 0;

    this.comKey = "nope";  // Changes to represent the command.key for a command which will run. Set as "nope" initially to make sure nothing runs. 
    this.dragOffset = 0; // The offset which has occured by clicking on the arrows and moving the commands around. 

    this.robotSpawnPosX;
    this.robotSpawnPosY;

    // Update variables which control robot movement and command functionality.
    this.finalPosX; 
    this.finalPosY;
    this.runInitiated = false;
    this.comArrIndex = 0;
    this.smallerThan = false;
    this.ladderOverlap = false;
    this.doorOverlap = false;
    this.wrongCommand = false;
    this.onIce = false;
    this.iceStop = false; 
    this.doorX = 0;
    this.doorY = 0;
    this.downActive = false;

    // A variable which stores the sprite next to the refresh button. 
    this.newCommand;

    // Lower-righthand-side menu buttons (with the exception of the function button which is above)
    this.newButton;
    this.clearButton;
    this.trashButton;
    
};
/**
 * Prototype for the level state, used for all levels
 * @type {{init: RobotKompis.Level.init, create: RobotKompis.Level.create, update: RobotKompis.Level.update, seeTut: RobotKompis.Level.seeTut, waterHit: RobotKompis.Level.waterHit, commandDragStart: RobotKompis.Level.commandDragStart, commandDragStop: RobotKompis.Level.commandDragStop, addNew: RobotKompis.Level.addNew, addDuplicate: RobotKompis.Level.addDuplicate, MuteIt: RobotKompis.Level.MuteIt, newCycle: RobotKompis.Level.newCycle, listener: RobotKompis.Level.listener, listenerStop: RobotKompis.Level.listenerStop, commandGroupRender: RobotKompis.Level.commandGroupRender, functionGroupRender: RobotKompis.Level.functionGroupRender, clearCommandLine: RobotKompis.Level.clearCommandLine, favxOnClick: RobotKompis.Level.favxOnClick, createSixTransparrent: RobotKompis.Level.createSixTransparrent, makeNewFuncOnClick: RobotKompis.Level.makeNewFuncOnClick, saveFunctionOnClick: RobotKompis.Level.saveFunctionOnClick, cancelCreateFunctionOnClick: RobotKompis.Level.cancelCreateFunctionOnClick, funcSpriteOnClick: RobotKompis.Level.funcSpriteOnClick, deleteFunctionBlockOnClick: RobotKompis.Level.deleteFunctionBlockOnClick, editFunctionBlockOnClick: RobotKompis.Level.editFunctionBlockOnClick, returnChildIndex: RobotKompis.Level.returnChildIndex, inGroup: RobotKompis.Level.inGroup, inArray: RobotKompis.Level.inArray, homeFunction: RobotKompis.Level.homeFunction, saveAllFunctions: RobotKompis.Level.saveAllFunctions, scoreFunction: RobotKompis.Level.scoreFunction}}
 */
RobotKompis.Level.prototype = {

    /*
     * Initiates variables needed for the level creation and storage
     */
    init: function (character, robotFrame, levelName, robotX, robotY){
        this.robot = character;
        this.saveDataArgs.robot = character;
        this.saveDataArgs.robotFrame = robotFrame; 
        this.saveDataArgs.levelName = levelName;
        this.robotSpawnPosX = robotX;
        this.robotSpawnPosY = robotY;
    },

    /*
     * Creates graphics for the level
     */
    create: function () {
        // Start the phaser physics system Arcade. 
        this.physics.startSystem(Phaser.Physics.ARCADE); 
        
        // Add the background image (simple blue)
        this.add.image(0, 0, 'bg');

        // Create phaser graphics. "this" refers to the game as a while. 
        var graphics = new Phaser.Graphics(this, 0, 0); 

        // Create the visual components of the settings button.
        this.cloud = this.add.image(430, 50, 'settingsCloud');
        this.cloud.bringToTop();
        this.cloud.visible = false;

        //  Set the world (global) gravity
        //this.physics.arcade.gravity.y = 2500;

        graphics = this.add.graphics(0, 0); // Needed for gravity.
        this.map = this.add.tilemap(this.tilemapKey); // Initialize a tilemap from tilemapKey (Passed on from MapOverview)

        // Tilesets. 
        // Here we connect the name of the tileset in Tiled Map Editor with the name of the image which we preloaded.
        this.map.addTilesetImage('spritesheet_items', 'items');        
        this.map.addTilesetImage('spritesheet_ground2', 'ground');
        this.map.addTilesetImage('spritesheet_tiles', 'tiles');
        this.map.addTilesetImage('ice32xx', 'ice32xx');
        this.map.addTilesetImage('icetiles32x', 'icetiles32x');
        //Backgrounds
        this.map.addTilesetImage('newdesert', 'newdesert');
        this.map.addTilesetImage('iceland', 'iceland');

        // Layers
        // Here we create the layers from our tiled maps.
        this.layer0 = this.map.createLayer('background');
        this.layer1 = this.map.createLayer('water');
        this.layer3 = this.map.createLayer('unblocked');
        
        this.layer6 = this.map.createLayer('ice');
        
        this.layer2 = this.map.createLayer('blocked');        
        this.layer4 = this.map.createLayer('ladder');
        this.layer5 = this.map.createLayer('door');
    
        // Layer collisions. this.map.setCollisionBetween(startTileIndex, endTileIndex, collision, layerKey)
        this.map.setCollisionBetween(1, 3000, true, 'blocked');
        this.map.setCollisionBetween(1, 3000, true, 'water');
        this.map.setCollisionBetween(1, 3000, true, 'ice');

        // Create the playern and enable physics on it
        this.player = this.add.sprite(this.robotSpawnPosX, this.robotSpawnPosY, this.robot);
        this.physics.arcade.enable(this.player);
        this.physics.enable( [ this.player ], Phaser.Physics.ARCADE);

        // Centers the player in one 32x32 tile. Also defines interaction with world
        this.player.anchor.setTo(1.0, 1.0);
        this.player.body.collideWorldBounds = true; 
        this.player.body.moves = true;
        this.player.body.gravity.y = 1000; 
        
        // Animation
        this.player.animations.add('jumpRight', [6], 1, false);
        this.player.animations.add('jumpLeft', [11], 1, false);
        this.player.animations.add('walkRight', [3, 4, 5], 6, false);
        this.player.animations.add('walkLeft', [8, 9, 10], 6, false);
        this.player.animations.add('idle', [0, 1, 2], 4.5, false);
        this.player.animations.add('climb', [7], 1, false);

        // The water layer. Enables physics
        this.game.physics.arcade.enable(this.layer1); 
        this.physics.enable( [ this.layer1 ], Phaser.Physics.ARCADE);
        this.game.physics.arcade.collide(this.player, this.layer1, this.waterHit); // If the player collides with the water layer, call this.waterHit()

        // The ice layer        
        this.game.physics.arcade.enable(this.layer6);        
        this.physics.enable( [ this.layer6 ], Phaser.Physics.ARCADE);        
        this.game.physics.arcade.collide(this.player, this.layer6, this.iceHit);

        // Outer Block Library. Black
        graphics.lineStyle(0);
        graphics.beginFill(0x000000);
        graphics.drawRect(840, 500, 170, 80);
        graphics.endFill();

        // Inner Block Library. White
        graphics.lineStyle(0);
        graphics.beginFill(0xFFFFFF);
        graphics.drawRect(843, 503, 163, 73);
        graphics.endFill();

        // New, clear and trash buttons
        this.newButton = this.add.sprite(930, 510, 'new');
        this.newButton.inputEnabled = true;
        this.newButton.events.onInputDown.add(this.newCycle, this); // If the button is pressed, call this.newCycle()

        this.clearButton = this.add.sprite(970, 370, 'clearButton'); // Not entirely square so it has some offset to make it seem like it. 
        this.clearButton.inputEnabled = true;
        this.clearButton.events.onInputDown.add(this.clearCommandLine, this);
        
        // Trash icon By Andy (Open Clip Art Library image's page) [CC0], via Wikimedia Commons
        this.trashButton = this.add.sprite(965, 430, 'trashButton'); // It's activated in update, by dropping commands in its field of area.

        // Settings for own (user-defined) functions
        this.functionButton = this.add.button(965, this.world.height - 410 , 'func_button', this.favxOnClick, this, 2, 1, 0);
        this.cloud = this.add.sprite(140, 110, 'cloud');
        this.cloud.alpha = 0.6;
        this.cloud.visible = false;
        this.funcLine = this.add.sprite(171, 180,'funcLine');
        this.funcLine.alpha = 0.6;
        this.funcLine.visible = false;
        this.funcTitle = this.add.sprite(200, 130, 'funcTitle');
        this.funcTitle.alpha = 0.6;
        this.funcTitle.visible = false;     
        this.createSixTransparrent();

        // commandLine dimensions: 820 x 80 px
        this.commandLine = this.add.sprite(10, 500, 'commandLine');

        // To house all the commands which live in the command line field. 
        this.commandGroup = this.game.add.physicsGroup(Phaser.Physics.ARCADE);

        //  A mask is a Graphics object
        var commandMask = this.game.add.graphics(0, 0);

        //  Shapes drawn to the Graphics object must be filled.
        commandMask.beginFill(0xffffff);

        //  Draw the mask and apply
        commandMask.drawRect(10, 500, 800, 80);
        this.commandGroup.mask = commandMask; // Helps make the commandGroup more beautiful, even without cucumber !

        // Buttons. Command line buttons. For moving the whole commandGroup left or right. 
        this.rightArrow20 = this.add.sprite(800, 500, 'left20');
        this.rightArrow20.inputEnabled = true;
        this.leftArrow20 = this.add.sprite(18,500, 'right20');
        this.leftArrow20.inputEnabled = true;

        this.addNew(); // Add the newCommand variable sprite. 

        // Create the run and stop buttons
        this.runButton = this.add.sprite(965, this.world.height - 345, 'runButton');
        this.runButton.inputEnabled = true;
        this.stopButton = this.add.sprite(965, this.world.height - 345, 'stopButton');
        this.stopButton.inputEnabled = true;
        this.stopButton.visible = false;

        // Activate event listeners (known as FUNCTIONS) for when runButton and stopButton are clicked.
        this.runButton.events.onInputDown.add(this.listener, this);
        this.stopButton.events.onInputDown.add(this.listenerStop, this);

        // Create additional menu buttons, like home and sound
        this.homeButton = this.add.button(965, this.world.height - 590, 'homeButton', this.homeFunction, this);
        this.soundButton = this.add.button(965, this.world.height - 530, 'muteUnMute', this.MuteIt, this);
        this.soundButton.scale.setTo(0.7,0.7) // Re-scale to fit.
        this.helpButton = this.add.button(965, this.world.height - 470, 'helpButton', this.seeTut, this);
        
        // Function arrows below:
        this.commandArrow = this.add.image(200, this.world.height - 260, 'commandArrow');
        this.commandArrow.scale.setTo(0.5,0.5);
        this.commandArrow.visible = false;
        
        this.arrowMute = this.add.image(820, 70, 'arrowMute');
        this.arrowMute.scale.setTo(0.5,0.5);
        this.arrowMute.visible = false;
        
        this.goArrow = this.add.image(820, 250, 'goArrow');
        this.goArrow.scale.setTo(0.5,0.5);
        this.goArrow.visible = false;
        
        
        this.functionArrow = this.add.image(820, 190, 'functionArrow');
        this.functionArrow.scale.setTo(0.5,0.5);
        this.functionArrow.visible = false;
        
        this.rowArrow = this.add.image(810, 420, 'rowArrow');
        this.rowArrow.scale.setTo(0.5,0.5);
        this.rowArrow.visible = false;
        
        this.homeArrow = this.add.image(820, 10, 'homeArrow');
        this.homeArrow.scale.setTo(0.5,0.5);
        this.homeArrow.visible = false;
        
        this.clearArrow = this.add.image(820, 360, 'clearArrow');
        this.clearArrow.scale.setTo(0.5,0.5);
        this.clearArrow.visible = false;
        
        this.moveArrow = this.add.image(700, 500, 'moveArrow');
        this.moveArrow.scale.setTo(0.5,0.5);
        this.moveArrow.visible = false;

        this.arrows = false;

        // Function groups are created here
        this.funcLineGroup = this.game.add.physicsGroup(Phaser.Physics.ARCADE);

        // Function line mask and arrows
        this.functionMask = this.game.add.graphics(0, 0);
        this.functionMask.beginFill(0xffffff);
        this.functionMask.drawRect(176, 185, 600, 80);
        this.funcLineGroup.mask = this.functionMask; 

        this.funcRightArrow20 = this.add.sprite(752, 180, 'left20');
        this.funcRightArrow20.inputEnabled = true;
        this.funcRightArrow20.alpha = 0.6;
        this.funcRightArrow20.visible = false;
        
        this.funcLeftArrow20 = this.add.sprite(180,180, 'right20');
        this.funcLeftArrow20.inputEnabled = true;
        this.funcLeftArrow20.alpha = 0.6;
        this.funcLeftArrow20.visible = false;
        
        this.funcTreeGroup = this.game.add.physicsGroup(Phaser.Physics.ARCADE); // Create a group tree to store function groups
        
        for(i=0;i<9;i++){ // Fill the tree with empty groups 
            var treeChild = this.game.add.physicsGroup(Phaser.Physics.ARCADE);
            treeChild.visible = false;
            treeChild.mask = this.functionMask;
            this.funcTreeGroup.add(treeChild);
        }
        // 

        var saveFuncArray = this.playerData.funcArray; // Get the functions saved from the previous time from the localStorage.

        //console.log("Beginning of level", this.playerData.funcArray)
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

        // The currentSpriteGroup contains whichever command or function which has started to be dragged. It exist to make sure the sprite being dragged is over everything else.
        this.currentSpriteGroup = this.add.group(); // ADDED LAST! Over everything!


    },
    // Update is called continuously. It can be considered a kind of mainloop() and is an event listener.
    update: function () {
        // Set the layers to collide with the player. Set in update so it is kept in action. 
        this.game.physics.arcade.collide(this.player, this.layer1, this.waterHit, null, this);
        this.game.physics.arcade.collide(this.player, this.layer6, this.iceHit, null, this);
        this.game.physics.arcade.collide(this.player, this.layer2);
        this.game.physics.arcade.collide(this.player, this.layer4, this.ladderHit);
        this.game.physics.arcade.collide(this.player, this.layer5, this.doorHit);
        
        // Checks what animation to play and play them
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
        
        
        // Command arrows. If the mouse button is down and over the arrow, move it in the relevant direction. 
        if (this.game.input.activePointer.isDown && this.rightArrow20.input.checkPointerOver(this.game.input.activePointer)) {
            this.commandGroup.setAll('body.velocity.x', -120);
        } else if (this.game.input.activePointer.isDown && this.leftArrow20.input.checkPointerOver(this.game.input.activePointer)) {
            this.commandGroup.setAll('body.velocity.x', +120);
        } else {
            this.commandGroup.setAll('body.velocity.x', 0); // Stop movement if none of the arrows is being pushed. 
        }

        // Function arrows similar to the command arrows above. 
        if (this.game.input.activePointer.isDown && this.funcRightArrow20.input.checkPointerOver(this.game.input.activePointer)) {
            this.funcLineGroup.setAll('body.velocity.x', -120);
        } else if (this.game.input.activePointer.isDown && this.funcLeftArrow20.input.checkPointerOver(this.game.input.activePointer)) {
            this.funcLineGroup.setAll('body.velocity.x', +120);
        } else {
            this.funcLineGroup.setAll('body.velocity.x', 0);
        }

        /* Adoptee keys:  Defined before create. 
         * this.finalPosX;
         * this.finalPosY;
         * this.runInitiated;
         * this.comArrIndex;
        */

        // Velocity control and command movement. Activates constantly but only if a command is currently in play (comKey != "nope")
        if (this.runInitiated == false && this.comKey != "nope") {
            // If the command is walk_right or hop_right, and they have reached or passed finalPosX, and are still moving (velocity != 0)
            if (this.onIce) {
                // First get the blocked tiles which are in the area of the player. 
                var layer2tiles = this.layer2.getTiles(this.player.x-10, this.player.y, 10, 30);
                var iceEnd = false // Set iceEnd to be false until proven otherwise
                // Check each tile for if it has a valid block (invalid blocks are -1). All valid blocks in this layer count as ice blocks
                for (i = 0; i < layer2tiles.length; i++) {
                    if (layer2tiles[i].index != (-1)) {
                        iceEnd = true; // A dirt/snow block has been found. 
                    }
                }
                // We've found a snow or dirt block. Stop sliding.
                if (iceEnd) {
                    this.iceStop = true;
                } 
            }
            if ((this.comKey == "walk_right_com" || this.comKey == "hop_right_com") && (this.player.x >= this.finalPosX || this.player.body.velocity.x == 0)) {
                this.player.body.velocity.x = 0; // Stop all movement
                this.player.body.velocity.y = 0;
                this.player.body.allowGravity = true; // Activate gravity
                // comArrIndex++ tells update to check the next command and runInitiated = True tells it to check current command for comArrIndex and set movement accordingly
                this.comArrIndex = this.comArrIndex + 1; 
                this.runInitiated = true; 
            // If the command is hop_right_com or hop_left_com and they've reached or pased finalPosY and this.downActive is true (downActive means they have to go down soon)
            // This movement activates half-way through a jump and starts bringing the player down again. 
            } else if ((this.comKey == "hop_right_com" || this.comKey == "hop_left_com") && this.player.y <= this.finalPosY && this.downActive == true) {
                this.player.body.velocity.y = 85;
                this.downActive = false; // downActive has activated downwards motion and is thus turned off.
            // If the command is walk_left or hop_left and the robot is still moving, but has reached or passed finalPosX
            } else if ((this.comKey == "walk_left_com" || this.comKey == "hop_left_com") && (this.player.x <= this.finalPosX || this.player.body.velocity.x == 0)) {
                this.player.body.velocity.x = 0; // Stop all movement
                this.player.body.velocity.y = 0;
                this.player.body.allowGravity = true; 
                this.comArrIndex = this.comArrIndex + 1; // Check the next command ... 
                this.runInitiated = true; // ... and start its movement. 
            // If the command is ladder, and the player has either reached finalPosY (top of ladder) or the speed is 0 (collision has occured, by say a platform)
            } else if (this.comKey == "ladder_com" && (this.player.y <= this.finalPosY || this.player.body.velocity.y == 0)) {
                // Set collision again for the blocked layer we just moved through
                this.map.setCollisionBetween(1, 5000, true, 'blocked');
                this.player.body.allowGravity = true; 
                this.comArrIndex = this.comArrIndex + 1; // Initiate the next command.
                this.runInitiated = true;
            // If the command is down and the player has reached or surpassed finalPosY, or stopped moving due to collision. 
            } else if (this.comKey == "down_com" && (this.player.y >= this.finalPosY || this.player.body.velocity.y == 0)) {
                // Set collision again for the blocked layer we just moved through. 
                this.map.setCollisionBetween(1, 5000, true, 'blocked');
                this.player.body.allowGravity = true; 
                this.comArrIndex = this.comArrIndex + 1; // Initiate the next command
                this.runInitiated = true;
            // So the command was wrong. Do nothing and check the next one. 
            } else if (this.comKey == "wrong") {
                this.comArrIndex = this.comArrIndex + 1; 
                this.runInitiated = true;
            }

            // Robot is idle
            if (this.comArrIndex == this.commandArray.length && (this.player.body.velocity.x == 0 && this.player.x >= this.finalPosX)){
                this.animationCheck = 0;
            }
        }
        // runInitiated = True has been set by the play button, and we'll run through as long as we have commands to work through
        if (this.runInitiated == true && this.comArrIndex < this.commandArray.length) {
            // Get the command's image key from the command array.
            this.comKey = this.commandArray[this.comArrIndex].key; // Because ain't nobody got time to type that every single time.
            this.onIce = false; 
            this.iceStop = false; 
            if (this.comKey == "walk_right_com") {
                this.animationCheck = 1; // Set the animation to be walking right
                this.player.body.velocity.x = 100; // Set the player velocity to be 100
                this.finalPosX = this.player.x + 31; // Set the final position to be almost 32 px away from current position.
            } else if (this.comKey == "walk_left_com") {
                this.animationCheck = 2;
                this.finalPosX = this.player.x - 31;
                this.player.body.velocity.x = -100;
            } else if (this.comKey == "ladder_com") {
                // First get the tiles which are in the area of the player. 
                var layer4tiles = this.layer4.getTiles(this.player.x - 10, this.player.y - 20, 10, 10);
                this.ladderOverlap = false; // Set ladderOverlap to be false until proven otherwise
                // Check each tile for if it has a valid block (invalid blocks are -1). All valid blocks in this layer count as ladders
                for (i = 0; i < layer4tiles.length; i++) {
                    if (layer4tiles[i].index != (-1)) {
                        this.ladderOverlap = true; // A ladder has been found. Set ladderOverlap to be true. 
                    }
                }
                
                // We've found a ladder, activate movement. 
                if (this.ladderOverlap) {
                    this.animationCheck = 3;
                    this.player.body.allowGravity = false;
                    this.finalPosY = this.player.y - 130; // Ladders are approximately 120 px long.. 
                    this.player.body.velocity.y = -100; // Go upwards. 
                    // Remove collision for the blocked ladder for the moment being. We're going to be moving through it. 
                    this.map.setCollisionBetween(1, 5000, false, 'blocked');
                } else { // No ladder found. Do nothing. 
                    this.comKey = "wrong";
                }
            // We're headed down. 
            } else if (this.comKey == "down_com") {
                // Check if there's a ladder BELOW the player.
                var layer4tiles = this.layer4.getTiles(this.player.x, this.player.y + 64, 20, 20);
                // Ladder overlap check
                this.ladderOverlap = false;
                for (i = 0; i < layer4tiles.length; i++) {
                    if (layer4tiles[i].index != (-1)) {
                        this.ladderOverlap = true;
                    }
                }
                if (this.ladderOverlap) {
                    this.animationCheck = 3;
                    this.player.body.allowGravity = false;
                    this.finalPosY = this.player.y + 120;
                    this.player.body.velocity.y = 100; // Go downwards.
                    // Remove collision for the blocked ladder for the moment being. We're going to be moving through it. 
                    this.map.setCollisionBetween(1, 5000, false, 'blocked');
                } else { // No ladder found. Do nothing.
                    this.comKey = "wrong";
                }
            } 
            // Hop left. 
            else if (this.comKey == "hop_left_com") {
                this.animationCheck = 5;
                this.finalPosX = this.player.x - 64; // Set finalPosX to be 2 blocks away.
                this.finalPosY = this.player.y - 30; // Set a half-way point before the robot starts heading down. 
                this.player.body.allowGravity = false;
                this.player.body.velocity.y = -80; // Move upwards
                this.player.body.velocity.x = -80; // Move to the left
                this.downActive = true; // downActive = true: We're waiting for finalPosY to be reached before heading down. 
            }
            // Very similar to hop_left_com, but with a different animation and different direction.
            else if (this.comKey == "hop_right_com") {
                this.animationCheck = 4;
                this.finalPosX = this.player.x + 64;
                this.finalPosY = this.player.y - 30; 
                this.player.body.allowGravity = false;
                this.player.body.velocity.y = -80;
                this.player.body.velocity.x = 80;
                this.downActive = true;
            // The command is a key. Used to open doors, if any doors are nearby
            } else if (this.comKey == "key_com") {
                // Check the door layer (layer5) for any doors that the player might be standing in front of. 
                var layer5tiles = this.layer5.getTiles(this.player.x, this.player.y - 20, 20, 20);

                // Door overlap check
                for (i = 0; i < layer5tiles.length; i++) {
                    if (layer5tiles[i].index != (-1)) {
                        this.doorOverlap = true;
                    }
                }

                // The player has reached the door with a key, save all data
                if (this.doorOverlap) {
                    this.animationCheck = 0;
                    this.scoreFunction(true);
                    this.funcSpriteArray = [];
                    this.funcTreeGroup.destroy();
                    this.doorOverlap = false;
                // There was no door. Do nothing. 
                } else {
                    this.comKey = "wrong";
                }
            }
            // We're going to have to finish moving the command before we can loop through again. set runInitiated to false. 
            this.runInitiated = false;
        }

    },


    // Function for displaying the tutorial
    seeTut: function() {
        if (this.arrows ==false) {
            this.arrows = true;
            this.commandArrow.visible = true;
            this.goArrow.visible = true;
            this.functionArrow.visible = true;
            this.rowArrow.visible = true;
            this.arrowMute.visible = true;
            this.homeArrow.visible = true;
            this.clearArrow.visible = true;
            this.moveArrow.visible = true;
        }
        else { //...*** and closes if opened ;)
            this.arrows = false;
            this.commandArrow.visible = false;
            this.goArrow.visible = false;
            this.functionArrow.visible = false;
            this.rowArrow.visible = false;
            this.arrowMute.visible = false;
            this.homeArrow.visible = false;
            this.clearArrow.visible = false;
            this.moveArrow.visible = false;
        }
        
    },
    // Reset the player and inputs
    iceHit: function(){
        // Make the robot slide in a cool way
        this.animationCheck = 0;
        // IF the robot is moving horizontally, is planning to move more (at least one block) and we're checking commands (this.runInitiated == false)
        if (this.runInitiated == false && this.player.body.velocity.x != 0 && !this.iceStop) {
            // this.player.x <= this.finalPosX
            // IF: this is the first block of ice. Only move as intended (1 block)
            if (((this.player.x) > this.finalPosX) && this.player.body.velocity.x > 0) {
                // Keep moving in the direction you're headed. 
                this.onIce = true; 
                this.finalPosX += 32;
            } else if (((this.player.x) < this.finalPosX) && this.player.body.velocity.x < 0) {
                this.onIce = true; 
                this.finalPosX -= 32;
            }
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
        this.newButton.input.enabled = true; 
        this.clearButton.input.enabled = true;

        this.stopButton.visible = false;
        this.runButton.visible = true;
        this.player.reset(this.robotSpawnPosX, this.robotSpawnPosY);
        this.runInitiated = false; 
        this.comArrIndex = 0;
        this.commandArray = [];
        this.comKey = "nope";
    },
    
    // This function saves the coordinates of the start position of the sprite you are dragging at the moment and adjusting it according to it's position. 
    commandDragStart: function(sprite, pointer) {
        this.oldPosY = sprite.y; // To be checked for if it originated from the functions line. 
        if (sprite == this.newCommand) { // Checks if they're IDENTICAL. Not to be confused with having the same key. 
            this.oldPosX = 850; // Same dimensions as when newCommand is created.
        }
        else if (this.commandGroup.getIndex(sprite) != -1) { // The sprite belongs to the commandGroup. Only outsiders get -1. 
            this.oldPosX = sprite.x; // Set the oldPosX to be the sprite's position before dragged away to neverneverland
            this.commandGroup.remove(sprite); 
            // For each object in commandGroup, reposition it so that it'll cover the area the sprite was in.
            for (i = 0; i < this.commandGroup.length; i++) {
                var otherSprite = this.commandGroup.getAt(i);
                if (otherSprite.x < sprite.x) { // Move all sprites before dragged sprite forward by 40
                    otherSprite.x = otherSprite.x + 40;
                } else { 
                    otherSprite.x = otherSprite.x - 30; // Move all sprites after dragged sprite back by 30
                } 
                otherSprite.reset(otherSprite.x, 510); // reset needed to snap them back into position quickly and nicely.
            }
            
        } else if (this.funcLineGroup.getIndex(sprite) != -1) { // The sprite belongs to the commandGroup. Only outsiders get -1. 
            this.oldPosX = sprite.x; // Set the oldPosX to be the sprite's position before dragged away to neverneverland
            this.funcLineGroup.remove(sprite);
            for (i = 0; i < this.funcLineGroup.length; i++) {
                var otherSprite = this.funcLineGroup.getAt(i);
                if (otherSprite.x < sprite.x) {
                    otherSprite.x = otherSprite.x + 40;
                } else {
                    otherSprite.x = otherSprite.x - 30;
                }
                otherSprite.reset(otherSprite.x, 190); // Height of the function command bar
            }
        } else { // Most probably this else concerns the functions on their original place. 
            this.oldPosX = sprite.x;
        }

        this.currentSpriteGroup.add(sprite); // Put the sprite in this temporary group. 
    },

    // This function anjusts the sprite, which you're dragging, according to where it was taken from and where you you're going to drop it.
    commandDragStop: function(sprite, pointer) {

        var index = 0; // It the sprite is a function, we might need it's order number. 
        if(this.inArray(sprite.key, this.funcImageKeyArray)===true){ 
            index = this.funcImageKeyArray.indexOf(sprite.key);   
        }

        // Dropped in command line !
        if (pointer.y > 510 && pointer.y < 590 && pointer.x < 820) {
            if (this.oldPosX > 830) { // If the command was taken from the newly created position..
                this.addNew();
            }

            // Call scrollableField in order to make the right visual adjustments. 
            this.scrollableField(sprite, this.commandGroup, 510);

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

        // If the sprite is dropped in the ACTIVE function window area. x: 140 - 800, y: 350 - 100
        // The function cloud has the dimensions 820 x 230 and starts at (140, 110) [x,y]
        else if (pointer.y >= 110 && pointer.y < 250 && pointer.x > 140 && pointer.x < 800 && this.cloud.visible == true && this.funcLine.visible == true) { // These are the approximate limits of the function window
            // IF: Dropped in function editor while being able to create a new function. 
            if (this.oldPosX > 830) { // If the command was taken from the newly created position..
                this.addNew();
            }
            // IF the sprite is a function ELSE it must be a command
            if (this.inArray(sprite.key,this.funcImageKeyArray)===true) { // If the taken sprite is a function... Just return it back to the command line.
                sprite.x = this.oldPosX; // Change the position back. 
                this.scrollableField(sprite, this.commandGroup, 510); // And re-instate it to the group institution. 
            } else { // The sprite is a command (blue). Allow it to live in funcLineGroup.     
                this.scrollableField(sprite, this.funcLineGroup, 190);
            }
        }  
        // If the pointer is within range of trash (occupies 480 - 380 and 915 to end)
        else if (pointer.y > 420 && pointer.y < 480 && pointer.x > 950) {
            // this.oldPosX < 830 && this.oldPosY > 500  
            if (this.commandGroup.getIndex(sprite) != -1) { // Was the command in commandLine before? (commandLine spans 20 - 830) 
                this.commandGroup.remove(sprite, true); // IS the true necessary when we also have to kill it?
                sprite.destroy(); // It doesn't update the rendering of the sprite unless it's DESTROYED!
            }
            // Can be replaced with this.funcLineGroup.getIndex(child)? 
            else if (this.oldPosY > 100 && this.oldPosY < 350 && this.oldPosX > 140 && this.oldPosX < 800) { // If the sprite was in the function window 
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
                    sprite.destroy();
                }
            } 
            else { // Add it back to new, you pleb! 
                this.addNew();
                sprite.destroy();
            }

        }
        else { // So it was moved outside of the commandLine area or (active) function window area (and trash), eh? SNAP IT BACK !
            // IF: It is a function
            if (this.inArray(sprite, this.funcSpriteArray)===true){  // It came from a function... 
                sprite.reset(this.funcCreateArray[index].x, this.funcCreateArray[index].y); 
            }
            // ELSE IF: It came from the function field (which is visible)
            else if(this.cloud.visible===true && this.funcLine.visible===true && this.oldPosY >= 110 && this.oldPosY <= 350){  
                sprite.x = this.oldPosX; // Snap it back.
                this.scrollableField(sprite, this.funcLineGroup, 190);
            }
            // ELSE IF: It came from the command field. 
            else if (this.oldPosX < 830) { 
                sprite.x = this.oldPosX;  // Snap it back.
                this.scrollableField(sprite, this.commandGroup, 510);
            } 
            // ELSE: I am this.newCommand  
            else {
                sprite.reset(this.oldPosX, 510);
            }
        }
    },
    // scrollable field controls the movement of anything which is dropped into commandGroup or functionGroup
    scrollableField: function(sprite, group, resetHeight) {
        this.currentSpriteGroup.remove(sprite); //...and don't forget to remove it from the temporary group.
        var groupRect = group.getLocalBounds(); // get the dimensions of the whole group

        // IF: In front of the groupRect
        if (sprite.x < groupRect.x) { 
            sprite.x = groupRect.x - 70;
        // ELSE IF: Behind the groupRext
        } else if (sprite.x >= (groupRect.x + groupRect.width)) { 
            // IF: No sprites in the group, which is commandGroup
            if (groupRect.x == 0 && resetHeight == 510) { 
                sprite.x = groupRect.x + groupRect.width + 40; 
            // ELSE IF: No sprites in the group, which is functionGroup
            } else if (resetHeight == 190 && groupRect.x == 0) { 
                sprite.x = groupRect.x + groupRect.width + 200;
            // ELSE: Behind, but there's sprites in front. Add after with an offset of 10 px.
            } else {
                sprite.x = groupRect.x + groupRect.width + 10;
            }
        // ELSE: Inbetween two sprites in the group
        } else {
            // Loop through the whole group and change every sprite's position.
            for (i = 0; i < group.length; i++) {
                var otherSprite = group.getAt(i); 
                // If the otherSprite is behind sprite or right below sprite
                if (sprite.overlap(otherSprite) && otherSprite.x <= sprite.x) { // Does not work for dropped from afar ones. 
                    sprite.x = otherSprite.x + 30;
                // ELSE IF: The otherSprite is behind sprite and does not overlap but is within its right anyway
                } else if (otherSprite.x <= sprite.x && (otherSprite.x + 70) >= sprite.x) { // Dropped from afar. 
                    sprite.x = otherSprite.x + 30;
                }
                // IF: otherSprite is behind sprite. Sprite takes up a total of 70 px. 60 px for itself and 10 for offset.
                if (otherSprite.x <= sprite.x) {
                    otherSprite.x = otherSprite.x - 40;
                // ELSE: otherSprite is in front of sprite.
                } else {
                    otherSprite.x = otherSprite.x + 30;
                }
                // Reset the position just in case. 
                otherSprite.reset(otherSprite.x, otherSprite.y);
            }
        }
        // Reset the sprite's position to be "spot on"
        sprite.reset(sprite.x, resetHeight);
        group.add(sprite); // Add it to whatever group it should belong to (which is a parameter sent when scrollableField is called)
    },

    // Adds new command
    addNew: function () {
        // Loops through the commandKeys from MapOverview to get a perfect circle of command generated. 
        this.newCommand = this.add.sprite(850, 510, this.commandKeys[0]);
        //this.newCommand.physics.enabled = true;
        //this.newCommand.allowGravity = false;
        this.newCommand.inputEnabled = true;
        this.newCommand.input.enableDrag(true);
        this.newCommand.events.onDragStart.add(this.commandDragStart, this); // If its dragged, call commandDragStart
        this.newCommand.events.onDragStop.add(this.commandDragStop, this);// If its dragged, call commandDragStop
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
            this.soundButton.frame = 1;
            
        } else {
            this.sound.mute = false;
            this.soundButton.frame = 0;
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
        // Stop the commands from being accessed ! And buttons directly related to commands (clearButton)
        for (i = 0; i < this.commandGroup.length; i++) {
            this.commandGroup.getAt(i).input.enabled = false;
        }
        this.funcRightArrow20.visible = false; // Patch
        this.funcLeftArrow20.visible = false; // Patch
        this.rightArrow20.input.enabled = false;
        this.leftArrow20.input.enabled = false;
        this.newCommand.input.draggable = false;
        this.newButton.input.enabled = false; 
        this.clearButton.input.enabled = false;


        this.stopButton.visible = true;
        this.runButton.visible = false;
        this.onIce = false; // just in case

        this.commandGroup.sort("x");
        this.funcLineGroup.sort("x");
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

        this.runInitiated = true;
        this.comArrIndex = 0; // SOMEONE messed it up before we got to this point (no, I don't know who)
    },

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
        this.newButton.input.enabled = true; 
        this.clearButton.input.enabled = true;
        this.stopButton.visible = false;
        this.runButton.visible = true;

        // Resets player and commands
	    this.player.body.allowGravity = true;
        this.map.setCollisionBetween(1, 5000, true, 'blocked');
        this.player.reset(this.robotSpawnPosX, this.robotSpawnPosY);
        this.runInitiated = false; 
        this.onIce = false; 
        this.comArrIndex = 0;
        this.commandArray = [];
        this.comKey = "nope";
    },

    // Clears the command line
    clearCommandLine: function() {
        this.commandGroup.removeAll(true); // Remove all the children and destroy them 
    },

    // Clears the funcLineGroup
    clearFuncLineGroup: function() {
        this.funcLineGroup.removeAll(true);
    },

    // Opens and closes the function making window.
    favxOnClick: function() {         
        if (this.cloud.visible==false) { // The cloud opens if closed...*** 
            this.cloud.visible = true; 
            this.funcTitle.visible = true;
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
            this.funcTitle.visible = false;
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
                this.clearFuncLineGroup();  
                this.funcLineGroup.visible = false;
            }
            // To be sure that everything is closed.
            if(this.func_edit){this.func_edit.visible = false}
            if(this.func_save){this.func_save.visible = false}
            if(this.func_delete){this.func_delete.visible = false}
            if(this.func_save){this.func_save.visible = false}
            if(this.func_cancel){this.func_cancel.visible = false}
            if(this.funcLine){this.funcLine.visible = false} 
            if(this.funcRightArrow20.visible===true){this.funcRightArrow20.visible = false}
            if(this.funcLeftArrow20.visible===true){this.funcLeftArrow20.visible = false}           
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
        if(this.func_edit){this.func_edit.visible = false}
        if(this.func_delete){this.func_delete.visible = false}
        this.funcLine.visible = true; 
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
        this.funcLine.visible = false; 
        this.func_save.visible = false;  
        this.func_cancel.visible = false;
        this.funcRightArrow20.visible = false;
        this.funcLeftArrow20.visible = false; 
        this.funcLineGroup.sort('x'); // Sort on x so the function is saved correctly (possibly redundant). 
        var treeChild = this.funcTreeGroup.getAt(index)
        treeChild.visible = false;
        this.funcLineGroup.moveAll(treeChild); // Move all of funcLineGroup to treeChild (in funcTreeGroup)

        this.clearFuncLineGroup();   
        this.funcLineGroup.visible = false;
 
        this.funcSpriteArray[index] = this.add.sprite(this.funcCreateArray[index].x, this.funcCreateArray[index].y, this.funcImageKeyArray[index]);
        this.physics.arcade.enable(this.funcSpriteArray[index]);
        this.funcSpriteArray[index].body.allowGravity = false;            
        this.funcSpriteArray[index].inputEnabled = true;
        this.funcSpriteArray[index].input.useHandCursor = true;
        this.funcSpriteArray[index].input.enableDrag();
        this.funcSpriteArray[index].events.onDragStart.add(this.commandDragStart, this); // this
        this.funcSpriteArray[index].events.onDragStop.add(this.commandDragStop, this);
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
        this.funcLine.visible = false;
        this.func_save.visible = false;
        this.func_cancel.visible = false;
        //this.funcTreeGroup.addAt(this.add.group(), index);
        this.clearFuncLineGroup();   
        this.funcLineGroup.visible=false;
        var tempCommand;
        for(i=0;i<this.editPatchArray.length;i++){
            tempCommand = this.add.sprite(200+70*(i), 190, this.editPatchArray[i]); // From every key-string you find in the saveFuncArray, create a command sprite
            //tempCommand.visible = false;
            this.physics.arcade.enable(tempCommand);
            tempCommand.body.allowGravity = false;
            tempCommand.inputEnabled = true;
            tempCommand.input.enableDrag(true);
            tempCommand.events.onDragStart.add(this.commandDragStart, this); // If you start dragging the sprite, the commandDragStart function is launched
            tempCommand.events.onDragStop.add(this.commandDragStop, this); // If you drop the sprite, the commandDragStop function is launched
            tempCommand.collideWorldBounds = true;
            this.funcTreeGroup.children[index].add(tempCommand); // ...and finally put the sprite at the corresponding position in the funcTreeGroup

        }
        this.funcTreeGroup.children[index].visible = false;
        this.editPatchArray = [];

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

    },

    // The function sprites are dragable and clickable. If you click on it, you get 2 buttons for working with a current function.
    // You may in that case eather edit you or function or delete the sprite.  
    funcSpriteOnClick: function(sprite, pointer) {
        
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
        this.funcLine.visible = false;
        this.funcLineGroup.visible = false;
        this.funcLineGroup = this.game.add.physicsGroup(Phaser.Physics.ARCADE);
        this.funcLineGroup.mask = this.functionMask; 
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
        this.funcLine.visible = true; 
        this.funcLineGroup.visible=true;
        this.funcTreeGroup.getAt(index).visible = true; 
        for(i=0;i<this.funcTreeGroup.children[index].length;i++){ // This for-loop saves the functions content into the editPatchArray in the form of commando keys
            this.editPatchArray.push(this.funcTreeGroup.children[index].getAt(i).key);
        }
        this.clearFuncLineGroup(); // Clear the funcLineGroup, just in case. 
        var treeChild = this.funcTreeGroup.getAt(index)
        treeChild.moveAll(this.funcLineGroup);
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
                        noBlocks++;
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
        console.log("Number of blocks", noBlocks)
        // Show WinScreen if the level is finished
        if (shouldSaveScore) {
            this.state.start('WinScreen', true, false, noBlocks, this.saveDataArgs);
        }
    }

};
