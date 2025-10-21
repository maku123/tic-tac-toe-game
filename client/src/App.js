import React from 'react';
import Board from './Board';

function App() {
  return (
    <div className="game">
      <h1>Tic-Tac-Toe</h1>
      <div className="game-board">
        {/* We will build our Board component here */}
        <Board />
      </div>
    </div>
  );
}

export default App;