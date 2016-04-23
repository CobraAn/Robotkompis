(function () {
    angular.module('Robotkompis').service('storageService', function() {
        this.save = function(arg) {
            if (typeof arg != 'undefined' && arg) {
                console.log(arg);
                var jsonArg = JSON.stringify(arg);
                localStorage.setItem('playerData', jsonArg);
                console.log(jsonArg);
            } else {
                console.log("Couldn't save playerData");
            }
        }

        this.load = function() {
            var playerOjbect = null;
            var playerData = localStorage.getItem('playerData');
            if (playerData != 'undefined') {
                playerOjbect = JSON.parse(playerData);
                console.log(playerOjbect);
                if (typeof playerOjbect != 'undefined' && playerOjbect) {
                    return playerOjbect;
                } else {
                    console.log("Couldn't load playerData");
                    return null;
                }
            }
        }
    });
})();