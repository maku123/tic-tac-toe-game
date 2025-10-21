import React from 'react';

// 'value' will be 'X', 'O', or null
// 'onSquareClick' is a function that will be passed down from the Board
function Square({ value, onSquareClick }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

export default Square;