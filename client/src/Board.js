import React, { useState } from "react";
import Square from "./Square";

function Board() {
  // true = X's turn, false = O's turn
  const [xIsNext, setXIsNext] = useState(true);

  // Create an array of 9 elements, all set to null.
  // This is our board's state.
  const [squares, setSquares] = useState(Array(9).fill(null));

  function handleClick(i) {
    // 'i' is the index (0-8) of the square that was clicked

    // Check if the square is already filled OR if a winner has been declared.
    // If either is true, do nothing (return early).
    if (squares[i] || calculateWinner(squares)) {
      return;
    }

    // Create a copy of the squares array
    const nextSquares = squares.slice();

    // Check whose turn it is and place 'X' or 'O'
    if (xIsNext) {
      nextSquares[i] = "X";
    } else {
      nextSquares[i] = "O";
    }

    // Update the component's state
    setSquares(nextSquares);

    // Flip the turn
    setXIsNext(!xIsNext);
  }

  // Check for a winner
  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = "Winner: " + winner;
  } else {
    status = "Next player: " + (xIsNext ? "X" : "O");
  }

  return (
    <>
      {/* Display the game status */}
      <div className="status">{status}</div>

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

// This is a helper function to check for a winner
function calculateWinner(squares) {
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
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

export default Board;
