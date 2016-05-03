RobotKompis.Settings = function (game) {
    'use strict';
    this.mute_label = null;
    this.mute_button = null;
    this.back_button = null;
    
};

RobotKompis.Settings.prototype = {
    
    create: function () {
        this.mute_label = this.add.text(0,0, 'Mute', {font: '34px Arial', fill: '#fff'});
        this.mute_label.inputEnabled = true;
        
        this.mute_button = this.add.button(200,0,  'muteButton', this.Mute, this, 0, 0, 1);
        this.back_button = this.add.button(400, 0,  'backButton', this.GoBack, this, 0, 0, 1);
    },
    
    Mute: function(){
        if (this.sound.mute == false) {
            this.sound.mute = true;
            this.mute_label.setText("Unmute"); 
        } else {
            this.sound.mute = false;
            this.mute_label.setText("Mute"); 
        };   
    },
    
    GoBack: function() {
        this.state.start('MapOverview');
    
}
    
}
    