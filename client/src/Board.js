import React, { useState } from 'react';
import Square from './Square';

function Board() {
  // Create an array of 9 elements, all set to null.
  // This is our board's state.
  const [squares, setSquares] = useState(Array(9).fill(null));

  function handleClick(i) {
    // 'i' is the index (0-8) of the square that was clicked

    // Create a copy of the squares array
    const nextSquares = squares.slice();

    // Set the square to 'X'
    nextSquares[i] = 'X';
    
    // Update the component's state
    setSquares(nextSquares);
  }

  return (
    <>
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
      </div>
    </>
  );
}

export default Board;