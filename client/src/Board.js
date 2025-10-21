import React from 'react';
import Square from './Square';

// This is now a "dumb" component.
// It just receives the board state and a click handler from App.js
function Board({ board, onSquareClick }) {

  return (
    <>
      
      <div className="board-row">
        <Square value={board[0]} onSquareClick={() => onSquareClick(0)} />
        <Square value={board[1]} onSquareClick={() => onSquareClick(1)} />
        <Square value={board[2]} onSquareClick={() => onSquareClick(2)} />
      </div>
      <div className="board-row">
        <Square value={board[3]} onSquareClick={() => onSquareClick(3)} />
        <Square value={board[4]} onSquareClick={() => onSquareClick(4)} />
        <Square value={board[5]} onSquareClick={() => onSquareClick(5)} />
      </div>
      <div className="board-row">
        <Square value={board[6]} onSquareClick={() => onSquareClick(6)} />
        <Square value={board[7]} onSquareClick={() => onSquareClick(7)} />
        <Square value={board[8]} onSquareClick={() => onSquareClick(8)} />
      </div>
    </>
  );
}

export default Board;