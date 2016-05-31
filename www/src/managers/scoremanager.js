/*
 *  Saves the player's progress to localStorage, using the saveData() function in ProgressManager.
 *  @param {int} noBlocks Number of blocks used to finish the level
 *  @param {obj} dataArgs Data required to save the current progress
 */

function saveScore(noBlocks, dataArgs) {

    console.log("saving score")
    console.log("FuncArray in saveScore", dataArgs.funcArray)

    dataArgs.levelScore = calculateScore(noBlocks, dataArgs.levelName);

    if (typeof dataArgs.levelScore !== "undefined" && dataArgs.levelScore !== null) {
        saveData(dataArgs);
    }
}

/*
 * Calculates amount of stars to be awarded, based on how many blocks have been used to finish the level.
 */

function calculateScore(noBlocks, levelName) {

    // Object to hold comparison values
    var minStarsRq = {};
    minStarsRq.oneStar = 99;

    // HARDCODED requirement values for how many stars the player should receive, based on the number of used blocks
    switch (levelName) {
        case "Level1":
            minStarsRq.twoStars = 15;
            minStarsRq.threeStars = 8;
            break;
        case "Level2":
            minStarsRq.twoStars = 15;
            minStarsRq.threeStars = 10;
            break;
        case "Level3":
            minStarsRq.twoStars = 15;
            minStarsRq.threeStars = 10;
            break;
        case "Level4":
            minStarsRq.twoStars = 15;
            minStarsRq.threeStars = 10;
            break;
        case "Level5":
            minStarsRq.twoStars = 15;
            minStarsRq.threeStars = 10;
            break;
        default:
            return;
    }

    if (noBlocks != 9999) {
        if (noBlocks <= minStarsRq.threeStars) {
            return 3;
        } else if (between(noBlocks, minStarsRq.threeStars, minStarsRq.twoStars)) {
            return 2;
        } else if (between(noBlocks, minStarsRq.twoStars, minStarsRq.oneStar)) {
            return 1;
        }
    }

}

/*
 *  Helper function to evaluate whether a number is in between give min and max values
 */

function between(x, min, max) {
    return x >= min && x <= max;
}

