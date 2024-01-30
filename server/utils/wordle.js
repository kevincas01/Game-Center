class Wordle{
    constructor() {
        this.board = [
            ["","","","",""],
            ["","","","",""],
            ["","","","",""],
            ["","","","",""],
            ["","","","",""],
            ["","","","",""]
        ];
        this.correctWord=""
        this.gameWon=false
        this.allWords=[]
        this.allWordsSet=null
        
    }
    setCorrectWord(word){
        this.correctWord=word
    }

    selectLetter(positionNumber, attemptNumber, letter){
        if (!this.board[index] ){
            const newState = [...this.board]
            newState.splice(index, 1, piece)
            this.board = newState
        }
    }

    checkWrongPlacement=(letterCounts, currentWord, letter,position)=>{

        const letterCount=letterCounts[letter]
        let count=0
    
        for (let i = 0; i <= position; i++) {
            
            if(currentWord[i]===letter){
                count+=1
            }
            
        }
    
        return count<=letterCount?true:false;
       
    }

    checkCorrect(word) {
        const wordString = word.join(''); // Convert array of strings into a single string
       
        this.gameWon= wordString.toUpperCase() === this.correctWord.toUpperCase();
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

module.exports = Wordle