import React from 'react';

// We'll pass in who won, our player symbol, and a function to call
// when "Play Again" is clicked.
function GameOverScreen({ winner, playerSymbol, onPlayAgain }) {
  
  const getWinnerText = () => {
    if (winner === 'draw') {
      return "It's a Draw!";
    }
    if (winner === playerSymbol) {
      return 'You Won! 🎉';
    }
    return 'You Lost 😥';
  };

  return (
    <div className="game-over-screen">
      <h2>{getWinnerText()}</h2>
      <button onClick={onPlayAgain}>Play Again</button>
    </div>
  );
}

export default GameOverScreen;