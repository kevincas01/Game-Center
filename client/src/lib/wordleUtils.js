import wordBank from '../Data/wordle-bank.txt'
export const checkWrongPlacement=(letterCounts, currentWord, letter,position)=>{

    const letterCount=letterCounts[letter]
    let count=0

    for (let i = 0; i <= position; i++) {
        
        if(currentWord[i]===letter){
            count+=1
        }
        
    }
    //Check TO SEE IF ANY OF THEM ARE CORRECT, BECUASE IF THEY ARE THEN 
    return count<=letterCount?true:false;
   
}

export const generateWordSet = async () => {
    let wordSet;
    let currWord;
    let wordArr;
    await fetch(wordBank)
      .then((response) => response.text())
      .then((result) => {
        wordArr = result.split("\n");
        currWord = wordArr[Math.floor(Math.random() * wordArr.length)];
        wordSet = new Set(wordArr);
      });
    return { wordArr,wordSet, currWord };
  };

export const countLetterOccurrences = (word) => {
    const letterCounts = {};
    for (const letter of word) {
        const upperLetter=letter.toUpperCase()
        letterCounts[upperLetter] = (letterCounts[upperLetter] || 0) + 1;
    }
    return letterCounts;
};

