import React, { useEffect, useState  } from 'react'

import Tictactoe from "./Components/TicTacToeBoard";


import { useParams } from 'react-router-dom';

import { useSocket } from './SocketContext';
import { useNavigate } from 'react-router-dom';


function Room() {
  const [room, setRoom] = useState("");
  const socket = useSocket();
  
  const [message, setMessage] = useState("");
  const [messageReceived, setMessageReceived] = useState("");
  
  const [name,setName]=useState("")
  const [waiting,setWaiting]=useState(false)
  const [joined,setJoined]=useState(false)
  
  const navigate = useNavigate();
  
  const joinRoom = (event) => {
    event.preventDefault();
    
    if (room !== "" && name!=="") {
      socket.emit("room_join", {room,name});
      navigate(`/gamecenter/${room}`);
      
    }

  };


  return (
  
  <>

    
      <div className='join-room'>
      <h1 className='welcome-text'>Welcome to the game center</h1>

      
      <div> 
        <form onSubmit={joinRoom}>
          <p>Enter your name and room id to join a room and choose a game</p>
            
          <input  required type="text" name='Name' placeholder="Name"onChange={(e)=>{setName(e.target.value)}}></input>
          
          <input required
            placeholder="Room id"
            onChange={(event) => {
              setRoom(event.target.value);
            }}
          />
          
          <button type='submit'> Join Room</button>
          
        </form>
      </div>
      

     
      </div>
    
    
  </>
  );
}



export default Room