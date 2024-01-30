import React, { useEffect } from 'react'
import {  useParams } from 'react-router-dom';
import '../Styles/wordle.css'


import { defaultBoardState } from '../Data/wordleData'


import { useSocket } from '../SocketContext';

import { ToastContainer, toast ,Zoom} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {  checkWrongPlacement, countLetterOccurrences, generateWordSet } from '../lib/wordleUtils';
import GameWonModal from './Modals/GameWonModal';
import GameLostModal from './Modals/GameLostModal';

const KeyboardButton = ({ value }) => {
    const { letterSetUsed,handleLetterSelectEmit, handleDeleteEmit,handleEnterEmit} = React.useContext(BoardContext);
    
    let state=""
    if(value in letterSetUsed){
        state=letterSetUsed[value]
        
    }
    return (
        <div className={`keyboard-letter ${state}`} onClick={()=>handleLetterSelectEmit(value)}>
        {value}
      </div>
    );
  };
  

const KeyboardGrid = () => {
  const keyboardLetters1 = ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'];
  const keyboardLetters2 = ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'];
  const keyboardLetters3 = ['Z', 'X', 'C', 'V', 'B', 'N', 'M'];

  const { handleLetterSelectEmit,handleDeleteEmit,handleEnterEmit} = React.useContext(BoardContext);


  const handleKeyboardPress=React.useCallback((e)=>{
   
    if(e.key==="Enter"){
        handleEnterEmit()
    }
    else if(e.key==="Backspace"){
        handleDeleteEmit()
    }
    else{
        
        keyboardLetters1.forEach((keyLetter)=>{
            if(keyLetter.toUpperCase()===e.key.toUpperCase()){
                handleLetterSelectEmit(keyLetter)
                return
            }
        })
        keyboardLetters2.forEach((keyLetter)=>{
            if(keyLetter.toUpperCase()===e.key.toUpperCase()){
                handleLetterSelectEmit(keyLetter)
                return
            }
        })
        keyboardLetters3.forEach((keyLetter)=>{
            
            if(keyLetter.toUpperCase()===e.key.toUpperCase()){
                handleLetterSelectEmit(keyLetter)
                return
            }
        })
    }
   
  })
  useEffect(()=>{
    document.addEventListener("keydown",handleKeyboardPress)
    return () => {
        document.removeEventListener("keydown", handleKeyboardPress);
      };
  },[handleKeyboardPress])

  return (
    <div className='keyboard-grid' >
      <div className='keyboard-letters' onKeyDown={handleKeyboardPress}>
        {keyboardLetters1.map((keyLetter, index) => (
          <KeyboardButton key={index} value={keyLetter} handleClick={handleLetterSelectEmit} />
        ))}
      </div>
      <div className='keyboard-letters'>
        {keyboardLetters2.map((keyLetter, index) => (
          <KeyboardButton key={index} value={keyLetter} handleClick={handleLetterSelectEmit} />
        ))}
      </div>
      <div className='keyboard-letters'>
        <div className='keyboard-letter special' onClick={handleEnterEmit}>Enter</div>
        {keyboardLetters3.map((keyLetter, index) => (
          <KeyboardButton key={index} value={keyLetter} handleClick={handleLetterSelectEmit}/>
        ))}
        <div className='keyboard-letter special' onClick={handleDeleteEmit}>Delete</div>
      </div>
    </div>
  );
};



const LetterCard = ({ attemptNum, letterPosition }) => {
    const {
        boardState,
        correctWord,
        correctWordLetterCount,
        letterSetUsed,
        attemptNumber
    } = React.useContext(BoardContext);

    const [keyState, setKeyState] = React.useState("");

    const letter = boardState[attemptNum][letterPosition];

    React.useEffect(()=>{
        if(keyState){console.log("restarting")
        setKeyState("")}
    },[correctWord])

    React.useEffect(() => {
        
        if (!keyState&&letter && attemptNum < attemptNumber) {
                console.log("computing")
                
                const correct = letter.toUpperCase() === correctWord[letterPosition].toUpperCase();
                const wrongPlace = checkWrongPlacement(correctWordLetterCount, boardState[attemptNum], letter, letterPosition);
                const newState = correct ? "correct" : wrongPlace ? "wrong-place" : "wrong";
                setKeyState(newState);
            } 
        
    }, [letterPosition, boardState, correctWord, attemptNumber]);

    return (
        <div className={`letter-card ${keyState}`}>
            {letter}
        </div>
    );
};
const GameGrid=()=>{
    return (<div className='wordle-grid'>
        <div className='row'>
            <LetterCard attemptNum={0} letterPosition={0}></LetterCard>
            <LetterCard attemptNum={0} letterPosition={1}></LetterCard>
            <LetterCard attemptNum={0} letterPosition={2}></LetterCard>
            <LetterCard attemptNum={0} letterPosition={3}></LetterCard>
            <LetterCard attemptNum={0} letterPosition={4}></LetterCard>
        </div>
        <div className='row'>
            <LetterCard attemptNum={1} letterPosition={0}></LetterCard>
            <LetterCard attemptNum={1} letterPosition={1}></LetterCard>
            <LetterCard attemptNum={1} letterPosition={2}></LetterCard>
            <LetterCard attemptNum={1} letterPosition={3}></LetterCard>
            <LetterCard attemptNum={1} letterPosition={4}></LetterCard>
        </div>
        <div className='row'>

            <LetterCard attemptNum={2} letterPosition={0}></LetterCard>
            <LetterCard attemptNum={2} letterPosition={1}></LetterCard>
            <LetterCard attemptNum={2} letterPosition={2}></LetterCard>
            <LetterCard attemptNum={2} letterPosition={3}></LetterCard>
            <LetterCard attemptNum={2} letterPosition={4}></LetterCard>
            
        </div>
        <div className='row'>
            <LetterCard attemptNum={3} letterPosition={0}></LetterCard>
            <LetterCard attemptNum={3} letterPosition={1}></LetterCard>
            <LetterCard attemptNum={3} letterPosition={2}></LetterCard>
            <LetterCard attemptNum={3} letterPosition={3}></LetterCard>
            <LetterCard attemptNum={3} letterPosition={4}></LetterCard>
            
        </div>
        <div className='row'>
            <LetterCard attemptNum={4} letterPosition={0}></LetterCard>
            <LetterCard attemptNum={4} letterPosition={1}></LetterCard>
            <LetterCard attemptNum={4} letterPosition={2}></LetterCard>
            <LetterCard attemptNum={4} letterPosition={3}></LetterCard>
            <LetterCard attemptNum={4} letterPosition={4}></LetterCard>
            
        </div>
        <div className='row'>
            <LetterCard attemptNum={5} letterPosition={0}></LetterCard>
            <LetterCard attemptNum={5} letterPosition={1}></LetterCard>
            <LetterCard attemptNum={5} letterPosition={2}></LetterCard>
            <LetterCard attemptNum={5} letterPosition={3}></LetterCard>
            <LetterCard attemptNum={5} letterPosition={4}></LetterCard>
            
        </div>

        </div>)
}

export const BoardContext=React.createContext();

const Wordle = () => {

    const socket=useSocket()

    const [gameStart,setGameStart]=React.useState(false)

    const [numGamesWon,setNumGamesWon]=React.useState(0);
    const [currStreak,setCurrStreak]=React.useState(0);

    const [gameWon,setGameWon]=React.useState(false);
    const [gameOver,setGameOver]=React.useState(false);

    const [gameOverModal,setGameOverModal]=React.useState(false);

    const [boardState,setBoardState]=React.useState(defaultBoardState);
    const [attemptNumber,setAttemptNumber]=React.useState(0);
    const [positionNumber,setPositionNumber]=React.useState(0);

    const [letterSetUsed, setLetterSetUsed] = React.useState({});
    
    const [wordSet, setWordSet] = React.useState(new Set());
    const [wordArray,setWordArray]= React.useState([]);
    const [correctWord, setCorrectWord] = React.useState('');
    const [correctWordLetterCount, setCorrectWordLetterCount] = React.useState({});


    const { room } = useParams();
    
    useEffect(()=>{

        generateWordSet().then((words) => {
            setWordSet(words.wordSet);
            setWordArray(words.wordArr)

            // const length=words.wordArr.length
            // socket.emit("start_wordle_game",{room,length})

          });
        
    
    },[])

    const startWordleGame=()=>{
        
        socket.emit("start_wordle_game",{room,wordArray})


    }

    const handleWordSelect=({word})=>{
        setGameStart(true)


        setCorrectWord(word);
        const letterCounts = countLetterOccurrences(word);
    
        setCorrectWordLetterCount(letterCounts);

    }

   

    useEffect(()=>{
        socket.on("handle_enter",handleEnter)
        
        socket.on("handle_letter_select", handleLetterSelect)
        socket.on("handle_letter_delete",handleLetterDelete)
        socket.on("handle_reset_game",handleReset)
        socket.on("handle_word_select",handleWordSelect)

        socket.on("not_in_word_bank",handleNotInWordBank)

    },[socket])

    const handleNotInWordBank=()=>{
        toast('Not in word bank!', {
            position: "top-center",
            autoClose: 1000,
            hideProgressBar: false,
            closeOnClick: true,
            closeButton:false,
            pauseOnHover: false,
            draggable: false,
            progress: undefined,
            theme: "dark",
            transition:Zoom
        });
        
    }


    const handleLetterSelect= ({board,posNumber}) => {
    
        setBoardState(board);
        setPositionNumber(posNumber);
      
    };

    const handleLetterSelectEmit = (keyVal) => {
        
    if(positionNumber===5 || attemptNumber>5) return

      const tempBoard = [...boardState];

      const letter=keyVal
      const posNumber=positionNumber
      const attNumber =attemptNumber

      socket.emit("letter_select",{room,letter,posNumber,attNumber})
      
    };
    
    const handleDeleteEmit = () => {
        
        if(positionNumber<=0 || attemptNumber>5) return
        const posNumber=positionNumber
        const attNumber=attemptNumber
        socket.emit("letter_delete",{room,posNumber,attNumber})
        
    };

    const handleLetterDelete=({board,posNumber})=>{
        setBoardState(board);
        setPositionNumber(posNumber);
    }

    const handleEnter=({board,attNumber,posNumber,usedSet,gameWon})=>{
        
            setLetterSetUsed(usedSet);
            
            setPositionNumber(posNumber);
            setAttemptNumber(attNumber)
            
        if(gameWon){
            setGameOver(true)
            setGameWon(true)
        }
        
        else if(attNumber>5&&!gameWon){
            setGameOver(true)

        }
        
    }

    const handleEnterEmit=()=>{
        if( attemptNumber>5)return
        if(positionNumber<5) {
            toast('Not enough letters', {
                position: "top-center",
                autoClose: 1000,
                hideProgressBar: false,
                closeOnClick: true,
                closeButton:false,
                pauseOnHover: false,
                draggable: false,
                progress: undefined,
                theme: "dark",
                transition:Zoom
            });
            return
        }
        const attNumber=attemptNumber
        const posNumber=positionNumber
        const usedSet=letterSetUsed
        const corLetterCount=correctWordLetterCount
        socket.emit("wordle_enter",{room, attNumber,posNumber,usedSet,corLetterCount})
        
    }
    const handleReset=({board,word})=>{
        setCorrectWord(word)
        const letterCounts = countLetterOccurrences(word);
        
        setCorrectWordLetterCount(letterCounts);

        setBoardState(board)

        setGameWon(false)
        setGameOver(false)
        setGameOverModal(false)

        setAttemptNumber(0)
        setPositionNumber(0)
        setLetterSetUsed({})
        
        //GOING TO HAVE TO CHANGE THIS LATER 
        // CHANGE THE CORRECT WORD, GRAB FROM THE LIST OF WORDS THAT WE HAVE IN THE DATA FOLDER
        // const [correctWord, setCorrectWord] = React.useState('TAMER');
        // const [correctWordLetterCount, setCorrectWordLetterCount] = React.useState({});

    }
    const handleResetEmit=()=>{
        
        socket.emit("reset_game",{room})

    }

    function createLetterSet(inputString) {
        
        for (let i = 0; i < inputString.length; i++) {
          const currentChar = inputString[i].toUpperCase(); // Convert to uppercase if needed
          if (!letterSetUsed.has(currentChar)) {
            // Check if the character is a letter
            setLetterSetUsed((prevSet) => new Set([...prevSet, currentChar]));
          }
        }
        
    }

    React.useEffect(() => {
        if (!gameOver) {
          return;
        }
        // extra delay for game won to allow confetti to show
        const modalDelay = gameWon ? 2000 : 250;
        const delayModalOpen = window.setTimeout(() => {
            setGameOverModal(true);
          //unmount confetti after modal opens
        //   setShowConfetti(false);

        }, modalDelay);
    
        // if (isGameWon) {
        //   setShowConfetti(true);
        // }
    
        return () => window.clearTimeout(delayModalOpen);
    }, [gameOver]);

    const closeModal=()=>{
        console.log("Closing")
        setGameOverModal(false)
    }
  return (
    <div className='wordle-container'>
        <h1>Wordle</h1>
       

        {/* 
        When the game is over, show either the WonModal or the LostModal
            {isGameOver && isGameWon ? (
          <GameWonModal
            open={isEndGameModalOpen}
            submittedGuesses={submittedGuesses}
          />
        ) : (
          <GameLostModal
            open={isEndGameModalOpen}
            submittedGuesses={submittedGuesses}
          />
        )}
        
        */}


        {
            !gameStart?
            <div className='game_start_container'>
                {/* https://www.nytimes.com/2023/08/01/crosswords/how-to-talk-about-wordle.html */}
                <h2>How to play Wordle</h2>

                <p>Each guess must be a valid five-letter word.<br/>
                The color of a tile will change to show you how close your guess was.<br/>
                If the tile turns green, the letter is in the word, and it is in the correct spot.<br/>
                If the tile turns yellow, the letter is in the word, but it is not in the correct spot.<br/>
                If the tile turns gray, the letter is not in the word.<br/>
                A new puzzle is released each day at midnight. Sign up for our daily reminder email.</p>
                <button onClick={startWordleGame}>Start Wordle Game!</button>
            </div>
        :(<BoardContext.Provider value={{boardState,setBoardState,correctWord, correctWordLetterCount,attemptNumber,setAttemptNumber,positionNumber,setPositionNumber,handleLetterSelectEmit,handleDeleteEmit,handleEnterEmit,letterSetUsed}}>

        {gameOver && gameWon ? (
            <GameWonModal open={gameOverModal} closeModal={closeModal} reset={handleResetEmit}/>
        ) : (
            gameOver && !gameWon ? (
                <GameLostModal  reset={handleResetEmit}/>
            ) : (
                <></>
            )
        )}


        <GameGrid/>

        {gameOver?(
            <button className="view-results" onClick={()=>{setGameOverModal(true)}}>
                View results
            </button>
            ):(
            <></>
        )}
        <KeyboardGrid/>

        </BoardContext.Provider>)

        }

        <ToastContainer />
    </div>
  )
}

export default Wordle
