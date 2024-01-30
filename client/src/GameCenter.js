import React, { useEffect, useState } from 'react'
import TicTacToeBoard from './Components/TicTacToeBoard';
import { useSocket } from './SocketContext';

import { ToastContainer, toast ,Zoom} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { useParams } from 'react-router-dom';
import CheckerBoard from './Components/CheckerBoard';
import Connections from './Components/Connections';
import Wordle from './Components/Wordle';


function GameCenter() {
    const [gameChosen,setGameChosen]= useState("Connections")

    
    const [roomPlayers,setRoomPlayers]=useState([]);

    const [socketId,setSocketId]=useState(null);
    const [playerPiece,setPlayerPiece]=useState("");

    const socket=useSocket()
    const games={
      "TicTacToe":<TicTacToeBoard />,
      "Wordle":<Wordle/>,
      "Connections":<Connections/>
      //"Checkers":<CheckerBoard player={playerPiece}/>
    }

    
    const { room } = useParams();

      
    useEffect(() => {
      // Event handler for 'receive_message'
      
      const handleNewPlayerJoin=({allPlayers})=>{
        console.log(allPlayers)
        setRoomPlayers(allPlayers)

      }
  
      // Register the 'receive_message' event handler
      socket.on("new_player_join", handleNewPlayerJoin);
  

      // Event handler for 'show_game'
      const handleShowGame = (data) => {
        setGameChosen(data);
        console.log("Gameee", data);
      };
  
      // Register the 'show_game' event handler
      socket.on("show_game", handleShowGame);


      socket.on("not_enough_players",()=>{

        toast('Not enough players!', {
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
      })


      // Clean up the event handlers when the component unmounts
      return () => {
        socket.off("show_game", handleShowGame);
      };
    }, [socket]);
    console.log(roomPlayers)
    
    function chooseGame(game){
        socket.emit("choose_game",{game,room})
        
      }

      
    return (

    <>


      <div className='gamecenter_container'>
       
          <h2>Players in {room}:</h2>
          <div className='gamecenter_players'>

            {roomPlayers.map((player,index)=>(

              <div key={index}className='player_card'>{player}</div>
            ))}
          </div>

          <div className='choose_games_container'>
            <button onClick={()=>{chooseGame("TicTacToe")}}>TicTacToe</button>
            <button onClick={()=>{chooseGame("Wordle")}}>Wordle</button>
            <button onClick={()=>{chooseGame("Connections")}}>Connections</button>
          </div>


          <hr/>

          <div className='game_chosen'>
              {games[gameChosen]}

          </div>

        
        
        </div>
    </>

  )
} 

export default GameCenter