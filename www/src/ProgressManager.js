var data = "DATA";

function saveData(args) {

    var saveObject = {};
    var storageObject = JSON.parse(localStorage.getItem(data));

    if (typeof args !== "undefined" && args !== null) {

        saveObject.robot = args.robot;

        if (typeof storageObject !== "undefined" && storageObject !== null) {
            storageObject.levels.push({key: args.levelName, value: args.levelScore});
            saveObject.totalStars += args.levelScore;
            saveObject.levels = storageObject.levels;
            console.log("Had levels");
            console.log(saveObject);
        } else {
            saveObject.totalStars += args.levelScore;
            saveObject.levels = [];
            saveObject.levels.push({key: args.levelName, value: args.levelScore});
            console.log("New level data");
            console.log(saveObject);
        }

        localStorage.setItem(data, JSON.stringify(saveObject));

    } else {
        console.log("No data received");
    }

}

function loadData() {

    var storageObject = JSON.parse(localStorage.getItem(data));

    if (typeof storageObject !== "undefined" && storageObject !== null) {
        return storageObject;
    } else {
        console.log("No data");
        return {};
    }
}
