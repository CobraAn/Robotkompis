// Variable used as a key for localStorage
var data = "DATA";
/*
 *  Takes an object args and saves the data contained to localStorage
 */
function saveData(args) {
    console.log("FuncArray in saveData", args.funcArray)
    var saveObject = {};
    var storageObject = JSON.parse(localStorage.getItem(data));

    if (typeof args !== "undefined" && args !== null) {

        saveObject.robot = args.robot;
        saveObject.robotFrame = args.robotFrame;
        
        // Controls for setting correct values to the saveObject to be stored in localStorage
        if (typeof storageObject !== "undefined" && storageObject !== null) {
            saveObject.levels = storageObject.levels;
            if (saveObject.levels[args.levelName]) {
                if (args.levelScore >= saveObject.levels[args.levelName]) {
                    saveObject.levels[args.levelName] = args.levelScore;
                    console.log("saveObject.levels[args.levelName]", saveObject.levels[args.levelName]);
                }
            } else {
                saveObject.levels[args.levelName] = args.levelScore;
            }
            saveObject.funcArray = args.funcArray;

            console.log("FuncArray in saveData", saveObject.funcArray)

        } else {
            saveObject.levels = {};
            saveObject.levels[args.levelName] = args.levelScore;
            saveObject.funcArray = args.funcArray;
            console.log("FuncArray in saveData", saveObject.funcArray)
        }

        // Sets the correct number of totalStars, based on every level value in saveObject.levels dictionary

        var keys = Object.keys(saveObject.levels);
        saveObject.totalStars = 0;
        for (var i = 0; i < keys.length; i++) {
            saveObject.totalStars = saveObject.totalStars + saveObject.levels[keys[i]];
        }

        localStorage.setItem(data, JSON.stringify(saveObject));

    } else {
        console.log("Empty args");
    }

}

/*
 *  Function to save only the robot to localStorage. Used in MapOverview
 */

function saveRobot(args) {
    var storageObject = loadData();
    if (typeof args !== "undefined" && args !== null) {
        storageObject.robot = args.robot;
        storageObject.robotFrame = args.robotFrame;
        localStorage.setItem(data, JSON.stringify(storageObject));
    }
}

/*
 *  Tries to load data from localStorage, otherwise returns an empty object
 */

function loadData() {

    var storageObject = JSON.parse(localStorage.getItem(data));

    if (typeof storageObject !== "undefined" && storageObject !== null) {
        return storageObject;
    } else {
        var returnObject = {};
        returnObject.levels = {};
        returnObject.funcArray = [];
        returnObject.robot = "";
        returnObject.robotFrame = 0;
        returnObject.totalStars = 0;

        return returnObject;
    }
}
