
export const differenceOfArrays = (submittedAttempts, currentSubmission) => {
    return [...submittedAttempts].filter((x) => !currentSubmission.includes(x));
  };

export const checkIfCorrect=(gameSolution,currentSubmission)=>{
    let isCorrect = false;
    let correctWords = "";
    let correctCategory = "";
    let isGuessOneAway = false;
    let correctDifficulty = null;
    const differencesOfArrays = [];
    for (let i = 0; i < gameSolution.length; i++) {
        correctWords = gameSolution[i].words;
        correctCategory = gameSolution[i].category;
        correctDifficulty = gameSolution[i].difficulty;

        const length=differenceOfArrays(correctWords,currentSubmission).length
        if(length===0){
            isCorrect = true;
            return {
                isCorrect,
                correctWords,
                correctCategory,
                isGuessOneAway,
                correctDifficulty
            };
        }
        else{
            differencesOfArrays.push(length)
        }

    }

    const minDifference=Math.min(...differencesOfArrays)
    console.log(differencesOfArrays)
    if(minDifference===1){
        isGuessOneAway = true;
      
    }
    return {
        isCorrect,
        correctWords,
        correctCategory,
        isGuessOneAway
      };

}

export const checkAlreadySubmitted=(submittedAttempts, currentSubmission)=>{
    for (let i = 0; i < submittedAttempts.length; i++) {

        if(differenceOfArrays(submittedAttempts,currentSubmission).length===0) return true
        
    }

    return false
}

//https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
export const shuffleArray=(array)=> {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }

    return array
}

export function getEmojiTiles() {
    let tiles = [];
    tiles.push("🟩");
    tiles.push("🟨");
    tiles.push("🟪");
    tiles.push("🟦");
    return tiles;
  }

