const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");


const Board = require('./utils/board')
const Wordle = require('./utils/wordle')
const Connections = require('./utils/connections')
app.use(cors());


const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

const rooms=new Map()

//Room: roomid players 
class Player {
  constructor(name, room, id, piece='') {
      this.name = name
      this.room = room
      this.id = id
      //this.piece = piece
  }
}

const joined={}
io.on("connection", (socket) => {
    
   
  
//   JOIN ROOM
    socket.on("room_join", ({room,name}) => {
      
      //Check if room exists
      if(!rooms.has(room)){
        rooms.set(room, {roomId: room, players:[], board:null})
      }

      //New player onto room
      socket.join(room);

      const id=socket.id

      // const newPlayer=new Player(name,room, id)

      currentRoom=rooms.get(room)
      updatedPlayerList = currentRoom.players.push(name)
      console.log("players",currentRoom.players)
      io.to(room).emit("new_player_join",{allPlayers:currentRoom.players})
      // Check the number of clients in the room
      const roomLength = io.sockets.adapter.rooms.get(room).size;
      console.log(name, room)
      // If there is more than one client in the room, emit a notification to the first client
      
    });




//   CHOOSE GAME
    socket.on("choose_game",({room,game})=>{

      
      currentPlayers=rooms.get(room).players
      
      if (currentPlayers.length<2 && game==="TicTacToe"){
        console.log("notenoguhh",game)
        io.to(room).emit("not_enough_players", {})
        return
      }
      io.to(room).emit("show_game", game)
      for (const player of currentPlayers){
        io.to(player.id).emit('pieceAssignment', {piece: player.piece, id: player.id})
      }
      io.to(room).emit("playerObjects",currentPlayers)
    })

    socket.on("send_message", ({data}) => {
      socket.to(data.room).emit("receive_message", data.message);
    });


//  TICTACTOE GAME



socket.on("start_tictactoe_game",({room,CONNECTION_GAMES})=>{
  currentRoom = rooms.get(room)

  const roomLength = io.sockets.adapter.rooms.get(room).size;
      console.log(name, room)
      // If there is more than one client in the room, emit a notification to the first client
      
      if (roomLength && roomLength == 2 ) {
        
        currentRoom = rooms.get(room)
        currentRoom.players[0].piece = "X"
        currentRoom.players[1].piece = "O"

        currentPlayers=currentRoom.players

        for (const player of currentPlayers){
          io.to(player.id).emit('pieceAssignment', {piece: player.piece, id: player.id})
      }

      currentRoom = rooms.get(room)
      const board = new Board()
      currentRoom.board = board
        
        // Emit a notification to the first client
        io.to(room).emit("handle_tictactoe_select", {board:currentRoom.board,turn:currentBoard.turn})

      }
      io.to(room).emit("not_enough_players", {})

    
})

    socket.on("piece_move",({room,playerPiece,index})=>{

      console.log("piece",playerPiece)
      currentRoom=rooms.get(room)

      currentBoard=currentRoom.board
      currentBoard.move(index, playerPiece)
      currentBoard.switchTurn()
      //Check for win, draw or just update of move
      if (currentBoard.checkWinner(playerPiece)){
        
        currentPlayers=currentRoom.players
        const winner = currentPlayers.find(player => player.piece === playerPiece);
        
        io.to(room).emit('winner', {boardState:currentBoard.board,winnerName:winner.name})
      }else if(currentBoard.checkDraw()){
        
          io.to(room).emit('draw', {boardState:currentBoard.board})
      }else{
          
          io.to(room).emit('update_board', {boardState:currentBoard.board,turn:currentBoard.turn})
      }
      console.log(currentBoard.board)

    })

    socket.on("restart_board_click",({room})=>{
      
      currentRoom = rooms.get(room)
      currentBoard=currentRoom.board
      currentRoom.board.reset()
      console.log("turn",currentBoard.turn)
      
      io.to(room).emit("restart_game", {turn:currentBoard.turn})
    })
    //  WORDLE GAME

    socket.on("need_index",({room,length})=>{
      
      const index=Math.floor(Math.random() * length)
      console.log(index)

      io.to(room).emit("handle_index_select", {index})

    })

    socket.on("start_wordle_game",({room,wordArray})=>{
      currentRoom = rooms.get(room)

      const wordle = new Wordle()
      currentRoom.wordle = wordle
      currentRoom.wordle.allWordsSet=new Set(wordArray);
      currentRoom.wordle.allWords=wordArray
      const index=Math.floor(Math.random() * wordArray.length)
      const word=wordArray[index]
      currentRoom.wordle.correctWord=word

      io.to(room).emit("handle_word_select", {word})

    })

    socket.on("letter_select",({room, letter,posNumber,attNumber})=>{
      
      currentRoom = rooms.get(room)
      currentWordle=currentRoom.wordle

      currentWordle.board[attNumber][posNumber] = letter;
    
      io.to(room).emit("handle_letter_select", {board: currentWordle.board,posNumber:posNumber+1})
    })

    socket.on("letter_delete",({room,posNumber,attNumber})=>{
      currentRoom = rooms.get(room)
      currentWordle=currentRoom.wordle
      
      currentWordle.board[attNumber][posNumber-1] = "";
      
      io.to(room).emit("handle_letter_delete", {board: currentWordle.board,posNumber:posNumber-1})
    
    })

    socket.on("wordle_enter",({room, attNumber,posNumber,usedSet,corLetterCount})=>{

      currentRoom = rooms.get(room)
      currentWordle=currentRoom.wordle

      

      newSet = { ...usedSet }; // Create a copy of letterSetUsed
      word= currentWordle.board[attNumber];
 
      if (!(currentWordle.allWordsSet.has(word.join("").toLowerCase()))) {
        console.log("Word not found in bank:", word);
        io.to(room).emit("not_in_word_bank", {});
        return;
    }


      for (let i = 0; i < word.length; i++) {
          
        let state = "";
        if (word[i] in newSet) {
            
            if(newSet[word[i]] === "wrong-place"){
                state = word[i].toUpperCase() === currentWordle.correctWord[i].toUpperCase()?"correct":"wrong-place";
                newSet[word[i]] = state;
            }
            continue
        }
        correct = word[i].toUpperCase() === currentWordle.correctWord[i].toUpperCase();

        wrongPlace = currentWordle.checkWrongPlacement(corLetterCount, word, word[i], i);

        state = correct ? "correct" : wrongPlace ? "wrong-place" : "wrong";

        newSet[word[i]] = state; // Update the state for the current letter
              
      }

      console.log(currentWordle.correctWord,word)
      currentWordle.checkCorrect(word)
      console.log(currentWordle.gameWon)

      io.to(room).emit("handle_enter", {board:currentWordle.board,attNumber:attNumber+1,posNumber:0,usedSet:newSet,gameWon:currentWordle.gameWon})
    
    })

    socket.on("reset_game",({room})=>{
      currentRoom = rooms.get(room)
      currentWordle=currentRoom.wordle
      currentWordle.reset()

      io.to(room).emit("handle_reset_game",{board:currentWordle.board,word:currentWordle.correctWord})

    })


//  CONNECTIONS GAME
    socket.on("start_connections_game",({room,CONNECTION_GAMES})=>{
      currentRoom = rooms.get(room)

      const connGame = new Connections()

      if (!currentRoom.connections) {
        currentRoom.connections = connGame;
    }

      const index=Math.floor(Math.random() * CONNECTION_GAMES.length)
      const selectedGame=CONNECTION_GAMES[index]
      currentRoom.connections.selectedGame=selectedGame

      let updatedWords = [];

      for (let i = 0; i < selectedGame.length; i++) {
        updatedWords = [...updatedWords, ...selectedGame[i].words];
      }
      const shuffledWords = currentRoom.connections.shuffleArray(updatedWords);
      
      currentRoom.connections.shuffledArray=shuffledWords
      console.log(currentRoom.connections.shuffledArray)
    
      io.to(room).emit("handle_connections_game_select", {game:selectedGame,shuffledArray:shuffledWords})

    })
    socket.on("word_select",({room, word})=>{
  
      currentRoom = rooms.get(room)
      currentConnections=currentRoom.connections

      let currentWordsSelected;
      if(currentConnections.wordsSelected.includes(word)){
        currentWordsSelected=currentConnections.wordsSelected.filter((w)=>word!==w)
        currentConnections.wordsSelected=currentWordsSelected
        console.log(currentWordsSelected,currentConnections.wordsSelected)
        io.to(room).emit("handle_word_select",{word,currentWordsSelected})
        return
      }

      if(currentConnections.wordsSelected.length===4)return;

      currentWordsSelected=[...currentConnections.wordsSelected, word]
      
      currentConnections.wordsSelected=currentWordsSelected

      io.to(room).emit("handle_word_select",{word,currentWordsSelected})
    })
    socket.on("shuffle_words",({room})=>{
      currentRoom = rooms.get(room)
      currentConnections=currentRoom.connections
      
      const shuffledArray=currentConnections.shuffleArray(currentConnections.shuffledArray)

      console.log("Shuffled",shuffledArray)

      io.to(room).emit("handle_shuffle_words",{shuffledArray})
    })
    socket.on("deselect_words",({room})=>{

      currentRoom = rooms.get(room)
      currentConnections=currentRoom.connections

      currentConnections.wordsSelected=[]
      io.to(room).emit("handle_deselected_words",{})
    })

    socket.on("submit_words",({room,wordsSelected, previousSubmissions, solvedCategoryAnswers,attemptsLeft})=>{

      currentRoom = rooms.get(room)
      currentConnections=currentRoom.connections

      if(currentConnections.checkAlreadySubmitted(previousSubmissions, wordsSelected)) {
        io.to(room).emit("handle_submit_words_already_submitted",{})
        return
      }

      const prevAttempts= [...previousSubmissions, [...wordsSelected]]
       
      const result=currentConnections.checkIfCorrect(wordsSelected)

      let solutions;
    
      let gameSolution=currentConnections.selectedGame
      let shuffledArray;

      if(result.isCorrect){
          
          for (let i = 0; i < gameSolution.length; i++) {
              if(gameSolution[i].category===result.correctCategory){

                solutions=[...solvedCategoryAnswers, gameSolution[i]]

                break
              }
          }
          shuffledArray=currentConnections.differenceOfArrays(gameWords,result.correctWords)
          currentConnections.shuffledArray=shuffledArray

          let wordsSelected=[]
          currentConnections.wordsSelected=wordsSelected

          io.to(room).emit("handle_submit_words_correct",{shuffledArray, wordsSelected, solutions,prevAttempts})
          
      }
      else if(result.isGuessOneAway){
          
          
          const gameSolution=currentConnections.selectedGame
          io.to(room).emit("handle_submit_words_one_away",{attemptsLeft, gameSolution,prevAttempts})
          return
          
          
      }else{
          
          const gameSolution=currentConnections.selectedGame
          io.to(room).emit("handle_submit_words_wrong",{attemptsLeft, gameSolution,prevAttempts})
          
      }


    })
    
  });

  server.listen(3001, () => {
    console.log("SERVER IS RUNNING");
    
});

