import React, { useEffect } from 'react'
import { useState } from 'react'
import { useParams } from 'react-router-dom';
import { useSocket } from '../SocketContext';
import '../Styles/tictactoe.css'


function Tile({value, onTileClick}){
    return(
        <button className="square" onClick={onTileClick}>{value}</button>
    )
   
}

function calculateWinner(values){
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
      ];
    
    for( let i=0; i<lines.length;i++){

        let [a,b,c]=lines[i]
        

        if (values[a] &&values[a]===values[b] && values[b]===values[c] && values[a]===values[c]){
            return values[a]
        }
        
    }
    return null
}
function TicTacToeBoard(){
    const socket=useSocket()

    const [isNext, setIsNext]=useState("X")

    
    const [socketId,setSocketId]=useState(null);
    const [playerPiece,setPlayerPiece]=useState("")
    
    const [values,setValues]=useState(Array(9).fill(null));
    
    const [showRestart, setShowRestart]=useState(false)
    
    let [status,setStatus]=useState("")
    

    function handleClick(index){

        console.log(isNext,playerPiece )
        
        if(isNext!=playerPiece || values[index]!=null){
            console.log("inside")
            return
        }

        console.log("emitting",playerPiece)
        socket.emit("piece_move",{room,playerPiece,index})
    }
    
    const { room } = useParams();

    
    useEffect(()=>{
        
        socket.on("pieceAssignment",({piece,id})=>{
            setPlayerPiece(piece)
            setSocketId(id)
            console.log("Piece",playerPiece,id)
        })

        socket.on("update_board", handleBoardUpdate)
        socket.on("winner", handleWinner)
        socket.on("draw", handleDraw)
        
        socket.on("restart_game",restartBoard)
        
    },[socket])

    
    function handleBoardUpdate({boardState, turn}){
        console.log(turn)
        setValues(boardState)
        setIsNext(turn)
        setStatus('Next player: '+turn)
    }
    function handleWinner({boardState,winnerName}){
        setValues(boardState)
        setShowRestart(true)
        setStatus("The winner is "+winnerName)
        
    }
    function handleDraw({boardState}){
        setValues(boardState)
        setShowRestart(true)
        setStatus("There is no Winner!Yall are both losers")
    }


    function send_restart(){
        socket.emit("restart_board_click",{room})
    }

    function restartBoard({turn}) {
        setValues(Array(9).fill(null));
        setShowRestart(false)

        setIsNext(turn)
        
        setStatus('Next player: '+turn)
        console.log(turn)
        console.log("isNext",isNext)

    }

    
    return (
        <>
        
           <div>{status}</div>

           <div className='tictactoe_board'>

            <div className="board-row">
            <Tile value={values[0]} onTileClick={() => handleClick(0)} />
            <Tile value={values[1]} onTileClick={() => handleClick(1)} />
            <Tile value={values[2]} onTileClick={() => handleClick(2)} />
            </div>
            <div className="board-row">
            <Tile value={values[3]} onTileClick={() => handleClick(3)} />
            <Tile value={values[4]} onTileClick={() => handleClick(4)} />
            <Tile value={values[5]} onTileClick={() => handleClick(5)} />
            </div>
            <div className="board-row">
            <Tile value={values[6]} onTileClick={() => handleClick(6)} />
            <Tile value={values[7]} onTileClick={() => handleClick(7)} />
            <Tile value={values[8]} onTileClick={() => handleClick(8)} />
            </div>

            </div>
            {(showRestart) &&(
                
                <div>
                    <button onClick={send_restart}>Restart Board</button>
                </div>

                
            )}
            
          
        </>
      );
}

export default TicTacToeBoard