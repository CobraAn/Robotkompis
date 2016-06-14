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
            minStarsRq.twoStars = 11; // Minimum stars required for two stars in the level 1
            minStarsRq.threeStars = 9; // Minimum stars required for three stars in the level 1
            break;
        case "Level2":
            minStarsRq.twoStars = 16; // And so on... 
            minStarsRq.threeStars = 15;
            break;
        case "Level3":
            minStarsRq.twoStars = 25;
            minStarsRq.threeStars = 23;
            break;
        case "Level4":
            minStarsRq.twoStars = 17;
            minStarsRq.threeStars = 16;
            break;
        case "Level5":
            minStarsRq.twoStars = 25;
            minStarsRq.threeStars = 23;
            break;
        case "Level6":
            minStarsRq.twoStars = 15;
            minStarsRq.threeStars = 8;
            break;
        case "Level7":
            minStarsRq.twoStars = 15;
            minStarsRq.threeStars = 10;
            break;
        case "Level8":
            minStarsRq.twoStars = 15;
            minStarsRq.threeStars = 10;
            break;
        case "Level9":
            minStarsRq.twoStars = 15;
            minStarsRq.threeStars = 10;
            break;
        case "Level10":
            minStarsRq.twoStars = 15;
            minStarsRq.threeStars = 10;
            break;
        default:
            return;
    }
    // Returns the corresponding score (number of stars) the player earned
    if (noBlocks != 9999) { // Say, if you won a level...
        if (noBlocks <= minStarsRq.threeStars) {
            return 3;
        } else if (between(noBlocks, minStarsRq.threeStars, minStarsRq.twoStars)) {
            return 2;
        } else if (between(noBlocks, minStarsRq.twoStars, minStarsRq.oneStar)) {
            return 1;
        }
    }
    else { // If you pushed the Home-button 
        return 0;
    }
}

/*
 *  Helper function to evaluate whether a number is in between give min and max values
 */

function between(x, min, max) {
    return x >= min && x <= max;
}

