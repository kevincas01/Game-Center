import React from 'react'
import '../Styles/checkers.css'


function Tile({rowIndex,colIndex, isHighlighted, onTileClick}){
    return(
        <button className={`checker-square square-${(rowIndex + colIndex) % 2 === 0 ? 'white' : 'black'} ${isHighlighted ? 'highlighted' : ''}`} onClick={onTileClick}>f</button>
    )
   
}
const CheckerBoard = () => {
    const [checkerboard, setCheckerboard] = React.useState(Array(8).fill(Array(8).fill(null)));
    const [highlightedTiles, setHighlightedTiles] = React.useState(Array(8).fill(Array(8).fill(false)));

    checkerboard[3][3]=true

    function handleClick(rowIndex,colIndex){
        console.log(rowIndex,colIndex)

        const updatedHighlightedTiles = highlightedTiles.map((row, i) =>
      row.map((col, j) => Math.abs(i - rowIndex) === Math.abs(j - colIndex))
    );
    setHighlightedTiles(updatedHighlightedTiles);
    }
  return (
    <div>
       
    {checkerboard.map((row, rowIndex) => (
        <div key={rowIndex} className="row" style={{display:"flex",justify:"center",alignItems:"center"}}>
          {row.map((col, colIndex) => (
            <Tile rowIndex={rowIndex} colIndex={colIndex} isHighlighted={highlightedTiles[rowIndex][colIndex]} onTileClick={() => handleClick(rowIndex,colIndex)}></Tile>
          ))}
        </div>
      ))}
    </div>
  )
}

export default CheckerBoard