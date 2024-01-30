import React, { useEffect } from 'react'
import '../Styles/connections.css'

import { ToastContainer, toast ,Zoom} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { CONNECTION_GAMES,DIFFICULTIES } from '../Data/connectionsData.js'
import { checkIfCorrect, checkAlreadySubmitted,  shuffleArray, differenceOfArrays } from '../lib/connectionsUtils'

import {  useParams } from 'react-router-dom';

import { useSocket } from '../SocketContext';

const SolvedCard=({solvedCategory})=>{
    return(
        <div className='solved-category' style={{backgroundColor:DIFFICULTIES[solvedCategory.difficulty]}}>
            
            <p style={{fontSize:"18px",textAlign:"center"}}>
                <span>{solvedCategory.category}</span>
                <br></br>
                {solvedCategory.words.join(', ').toUpperCase()}
                </p>
        </div>
    )

}


const Card=({word,selected, handleClick})=>{
    return (<div className={`card ${selected ? 'selected' : ''}`} style={{fontSize:word.length>6?"12px":"16px"}} onClick={()=>{handleClick()}}>{word}</div>)
}

const Connections = () => {

    const [gameStart,setGameStart]=React.useState(false)

    const [gameOver,setGameOver]=React.useState(false);
    const [gameOverModal,setGameOverModal]=React.useState(false);

    const [gameSolution,setGameSolution]=React.useState([]);
    const [wordsSelected,setWordsSelected]=React.useState([]);

    const [previousSubmissions,setPreviousSubmissions]=React.useState([]);
    const [attemptsLeft,setAttemptsLeft]=React.useState(4);

    const [solvedCategoryAnswers,setSolvedCategoryAnswers]=React.useState([]);
    
    const [gameWords,setGameWords]=React.useState([]);

    const socket=useSocket();

    const { room } = useParams();


    useEffect(()=>{

        socket.on("handle_connections_game_select",handleConnectionsGameSelect)
        socket.on("handle_word_select",handleWordSelect)
        socket.on("handle_shuffle_words",handleShuffleWords)

        socket.on("handle_deselected_words",handleDeselectedWords)

        socket.on("handle_submit_words_already_submitted",handleSubmitWordsAlreadySubmitted)
        socket.on("handle_submit_words_correct",handleSubmitWordsCorrect)
        socket.on("handle_submit_words_one_away",handleSubmitWordsOneAway)
        socket.on("handle_submit_words_wrong",handleSubmitWordsWrong)
    },[socket])


    const startConnectionsGame=()=>{
        
        socket.emit("start_connections_game",{room, CONNECTION_GAMES})
        
    }
    const handleConnectionsGameSelect=({game,shuffledArray})=>{
        setGameStart(true)
        setGameSolution(game)

        // Update the state with the shuffled array
        setGameWords(shuffledArray);

    }

    const handleSubmitEmit=(e)=>{
        e.preventDefault()

        //CHECK IF THE WORDS ARE ALREADY IN THE WORDS SUBMITTED ARRAY
        
       socket.emit("submit_words",{room, wordsSelected, previousSubmissions, solvedCategoryAnswers,attemptsLeft})
    }
    const handleSubmitWords=(e)=>{


        setPreviousSubmissions(prevAttempts=>[...prevAttempts, [...wordsSelected]])
       
        //Check for 1 away and win

        const result=checkIfCorrect(gameSolution,wordsSelected)

        if(result.isCorrect){
            
            for (let i = 0; i < gameSolution.length; i++) {
                if(gameSolution[i].category===result.correctCategory){
                    setSolvedCategoryAnswers((prevSolutions)=>{
                        return [...prevSolutions, gameSolution[i]]})
                        console.log(solvedCategoryAnswers)
                    break
                }
            }
            setGameWords(differenceOfArrays(gameWords,result.correctWords))
            
        }
        else if(result.isGuessOneAway){
            if(attemptsLeft===1){
               
                setSolvedCategoryAnswers(gameSolution)
                setGameWords([])
                return
            }
            setAttemptsLeft(attemptsLeft-1)
            
        }else{
            if(attemptsLeft===1){
                
                setSolvedCategoryAnswers(gameSolution)
                setGameWords([])
                return
            }
            setAttemptsLeft(attemptsLeft-1)
            
        
        }

    }

    const handleSubmitWordsAlreadySubmitted=()=>{
        toast('Already Guessed!', {
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
    const handleSubmitWordsCorrect=({shuffledArray, wordsSelected, solutions,prevAttempts})=>{
        setGameWords(shuffledArray)
        setSolvedCategoryAnswers(solutions)
        setPreviousSubmissions(prevAttempts)
        setWordsSelected([])
    }

    const handleSubmitWordsOneAway=({attemptsLeft, gameSolution,prevAttempts})=>{

        setPreviousSubmissions(prevAttempts)
        if(attemptsLeft===1){
            toast('YOU LOST', {
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
              
       
            setSolvedCategoryAnswers(gameSolution)
            setGameWords([])
              
          }else{
            toast('One Guess away!', {

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
          setAttemptsLeft(attemptsLeft-1)
          
    }
    const handleSubmitWordsWrong=({attemptsLeft, gameSolution,prevAttempts})=>{
        toast('Wrong Answer', {
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
        setPreviousSubmissions(prevAttempts)

        if(attemptsLeft===1){
            toast('YOU LOST', {
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
            
             //TO DO; SET TIMEOUTS SO THE ANSWERS COULD BE SHOWN ONE BY ONE          
            setSolvedCategoryAnswers(gameSolution)
            setGameWords([])
        }
        setAttemptsLeft(attemptsLeft-1)
    }

    const handleShuffleWordsEmit=(e)=>{
        e.preventDefault();
        console.log("shuffling")
        socket.emit("shuffle_words",{room})
    }
    const handleShuffleWords=({shuffledArray})=>{

        console.log(shuffledArray);
        setGameWords(shuffledArray);

    }

    const handleDeselectedWords=()=>{

        setWordsSelected([])
    }

    const handleWordSelectEmit=(word)=>{
        socket.emit("word_select",{room,word})

    }
    const handleWordSelect=({word,currentWordsSelected})=>{
        console.log(word,currentWordsSelected)
        
        setWordsSelected(currentWordsSelected)
    }

  return (

    <div className='game'>

        <div className='connections-container'>
            
            <h1>Connnections</h1>
           
            <p>Create four groups of four!</p>

            {!gameStart?(
            <div className='game_start_container'>
                <h2>How to play Connections</h2>

                <div>
                    <h3>Find groups of four items that share something in common.</h3>
                    <ul>
                        <li>Select four items and tap 'Submit' to check if your guess is correct</li>
                        <li>Find the groups without making 4 mistakes!</li>
                    </ul>
                </div>


                <div>
                    <h3>Category Examples:</h3>
                    <ul>
                        <li>FISH: Bass, Flounder, Salmon, Trout</li>
                        <li>FIRE ___: Ant, Drill, Island, Opal</li>
                    </ul>
                </div>
                <p>Categories will always be more specific than "5-LETTER WORDS," "NAMES," or "VERBS."</p>
                <p>Each puzzle has exactly one solution. Watych out for words that seem to belong to multiple categories!</p>
                <p>Each group is assigned a color, which will be revealed as you solve:</p>
            <button onClick={startConnectionsGame}>Start Connections Game</button>
            </div>
            ):(
                <>
                
                <div className="card-container">
            
            
           {solvedCategoryAnswers.map((solved,index)=>(
            <SolvedCard key={index} solvedCategory={solved}></SolvedCard>
           ))}

            {gameWords.map((word, index) => (
                <Card key={index} word={word} selected={wordsSelected.includes(word)} handleClick={()=>handleWordSelectEmit(word)}></Card>
                ))}

            </div>

            <div className='attempts-remaining' >
                <span id='attempts-remaining-text'>Mistakes remaining:</span>
                <span id="attempts-remaining-bubbles">
                {Array(attemptsLeft).fill().map((_, index) => (
                    <span key={index} className="black-circle"></span>
                ))}
                </span>
            </div>

            {gameOver?(
                <button className="view-results" onClick={()=>{setGameOverModal(true)}}>
                    View results
                </button>

            ):(
                <div className='button-group'>
                    <button className='connections-button' onClick={handleShuffleWordsEmit}>Shuffle</button>
                    <button className='connections-button' onClick={()=>{ socket.emit("deselect_words",{room})}}> Deselect All</button>
                    <button className='connections-button'
                        onClick={handleSubmitEmit}
                        disabled={wordsSelected.length !== 4}
                        style={{ border: wordsSelected.length !== 4 ? '2px solid gray' : '2px solid black' , color:wordsSelected.length !== 4 ?"gray":"white", backgroundColor:wordsSelected.length !== 4 ?"white":"black"}}
                        >
                            Submit
                    </button>
                </div>

            )}
            </>
            )}

        </div>

        <ToastContainer />
    </div>
  )
}

export default Connections