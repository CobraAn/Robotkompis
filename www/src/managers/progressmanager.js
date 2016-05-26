// Variable used as a key for localStorage
var data = "DATA";

/*
 *  Takes an object args and saves the data contained to localStorage
 */
function saveData(args) {

    var saveObject = {};
    var storageObject = JSON.parse(localStorage.getItem(data));

    if (typeof args !== "undefined" && args !== null) {

        saveObject.robot = args.robot;

        if (typeof storageObject !== "undefined" && storageObject !== null) {
            saveObject.levels = storageObject.levels;
            saveObject.totalStars = storageObject.totalStars + args.levelScore;
            saveObject.levels[args.levelName] = args.levelScore;
        } else {
            saveObject.totalStars = args.levelScore;
            saveObject.levels = {};
            saveObject.levels[args.levelName] = args.levelScore;
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
        return {};
    }
}
