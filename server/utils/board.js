class Board{
    constructor() {
        this.board = new Array(9).fill(null);
        this.winStates =[
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6],
          ];
        
        this.turn = 'X'
        
    }

    move(index, piece){
        if (!this.board[index] ){
            const newState = [...this.board]
            newState.splice(index, 1, piece)
            this.board = newState
        }
    }

    switchTurn(){
        console.log(this.turn=="X"?"O":"X")
        this.turn = this.turn=="X"?"O":"X";

    }


    checkWinner(player){

        for( let i=0; i<this.winStates.length;i++){
            let [a,b,c]=this.winStates[i]
            if (this.board[a] &&this.board[a]===this.board[b] && this.board[b]===this.board[c] && this.board[a]===this.board[c]){
                return this.board[a]
            }
            
        }
        return null

        //return this.winStates.some(state =>(
        // state.every((position => this.game[position] === player))
        //))
    }
    
    checkDraw(){
        return this.board.every(value => value !== null)
    }

    reset(){
        this.board = new Array(9).fill(null)
    }
}

module.exports = Board