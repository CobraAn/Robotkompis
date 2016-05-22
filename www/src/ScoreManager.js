function saveScore(noBlocks, dataArgs) {

    console.log("saving score");
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

    console.log("minstarsRq: " + minStarsRq);

    if (noBlocks <= minStarsRq.threeStars) {
        dataArgs.levelScore = 3;
    } else if (between(noBlocks, minStarsRq.threeStars, minStarsRq.twoStars)) {
        dataArgs.levelScore = 2;
    } else if (between(noBlocks, minStarsRq.twoStars, minStarsRq.oneStar)) {
        dataArgs.levelScore = 1;
    }

    console.log("levelScore: " + dataArgs.levelScore);

    if (typeof dataArgs.levelScore !== "undefined" && dataArgs.levelScore !== null) {
        saveData(dataArgs);
    }
    
}

function between(x, min, max) {
    return x >= min && x <= max;
}

