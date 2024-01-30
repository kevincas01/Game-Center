class Connections{
    constructor() {
        
        this.gameWon=false

        this.shuffledArray=[]
        this.solvedCategories=[]

        this.wordsSelected=[]

        
        this.selectedGame=[]

        
    }
    shuffleArray(array){

        for (var i = array.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
    
        return array
    }

    checkAlreadySubmitted=(submittedAttempts, currentSubmission)=>{
        for (let i = 0; i < submittedAttempts.length; i++) {
    
            if(this.differenceOfArrays(submittedAttempts,currentSubmission).length===0) return true
            
        }
    
        return false
    }
    

    differenceOfArrays = (submittedAttempts, currentSubmission) => {
        return [...submittedAttempts].filter((x) => !currentSubmission.includes(x));
      };

    checkIfCorrect=(currentSubmission)=>{
        let isCorrect = false;
        let correctWords = "";
        let correctCategory = "";
        let isGuessOneAway = false;
        let correctDifficulty = null;
        const differencesOfArrays = [];
        for (let i = 0; i < this.selectedGame.length; i++) {
            correctWords = this.selectedGame[i].words;
            correctCategory = this.selectedGame[i].category;
            correctDifficulty = this.selectedGame[i].difficulty;
    
            const length=this.differenceOfArrays(correctWords,currentSubmission).length
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




    reset(newWord){
        this.board = [
            ["","","","",""],
            ["","","","",""],
            ["","","","",""],
            ["","","","",""],
            ["","","","",""],
            ["","","","",""]
        ];
        const index=Math.floor(Math.random() * this.allWords.length)
        const word=this.allWords[index]
        this.correctWord=word
        this.gameWon=false
        return this.correctWord
    }
}

module.exports = Connections