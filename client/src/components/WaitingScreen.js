import React from 'react';

function WaitingScreen() {
  return (
    <div className="waiting-screen">
      <h2>Finding a random player...</h2>
      <div className="spinner"></div>
    </div>
  );
}

export default WaitingScreen;