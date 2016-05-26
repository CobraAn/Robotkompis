/*
 *  Used for awarding a certain amount of stars, based on how many blocks have been used to finish the level.
 *  Also saves the player's progress to localStorage, using the saveData() function in ProgressManager.
 *  @param {int} noBlocks Number of blocks used to finish the level
 *  @param {obj} dataArgs Data required to save the current progress
 */

function saveScore(noBlocks, dataArgs) {

    console.log("saving score");

    // Object to hold comparison values
    var minStarsRq = {};
    minStarsRq.oneStar = 99;
    
    switch (dataArgs.levelName) {
        case "Level1":
            minStarsRq.twoStars = 6;
            minStarsRq.threeStars = 3;
            break;
        case "Level2":
            minStarsRq.twoStars = 10;
            minStarsRq.threeStars = 5;
            break;
        case "Level3":
            minStarsRq.twoStars = 13;
            minStarsRq.threeStars = 5;
            break;
        case "Level4":
            minStarsRq.twoStars = 9;
            minStarsRq.threeStars = 5;
            break;
        case "Level5":
            minStarsRq.twoStars = 12;
            minStarsRq.threeStars = 5;
            break;
        default:
            return;
    }

    if (noBlocks <= minStarsRq.threeStars) {
        dataArgs.levelScore = 3;
    } else if (between(noBlocks, minStarsRq.threeStars, minStarsRq.twoStars)) {
        dataArgs.levelScore = 2;
    } else if (between(noBlocks, minStarsRq.twoStars, minStarsRq.oneStar)) {
        dataArgs.levelScore = 1;
    }

    if (typeof dataArgs.levelScore !== "undefined" && dataArgs.levelScore !== null) {
        saveData(dataArgs);
    }
    
}

/*
 *  Helper function to evaluate whether a number is in between give min and max values
 */

function between(x, min, max) {
    return x >= min && x <= max;
}

