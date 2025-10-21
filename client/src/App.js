import io from "socket.io-client";
import React, { useState, useEffect } from "react";
import Board from "./Board";
import NicknameScreen from './NicknameScreen';
import WaitingScreen from './WaitingScreen';

// Define where our server is running
const SOCKET_SERVER_URL = "http://localhost:4000";

function App() {
  // 'gameState' will be 'nickname', 'waiting', or 'game'
  const [gameState, setGameState] = useState('nickname');

  // Add state to hold the socket object
  const [socket, setSocket] = useState(null);

  // State to store player info
  const [player, setPlayer] = useState(null); // Will be { symbol: 'X', nickname: '...' }
  const [opponent, setOpponent] = useState(null); // Will be { symbol: 'O', nickname: '...' }

  // This 'useEffect' hook runs once when the component loads
  useEffect(() => {
    // Create the socket connection
    const newSocket = io(SOCKET_SERVER_URL);

    // Save the socket in our component's state
    setSocket(newSocket);

    // Set up a "connect" event listener
    newSocket.on("connect", () => {
      console.log(`Connected to server! Socket ID: ${newSocket.id}`);
    });

    // Listen for the "gameStarted" event from the server
    newSocket.on('gameStarted', (data) => {
      console.log('Game is starting!', data);
      
      // We are player 1 ('X')
      if (data.player1.id === newSocket.id) {
        setPlayer({ symbol: 'X', nickname: data.player1.nickname });
        setOpponent({ symbol: 'O', nickname: data.player2.nickname });
      } 
      // We are player 2 ('O')
      else {
        setPlayer({ symbol: 'O', nickname: data.player2.nickname });
        setOpponent({ symbol: 'X', nickname: data.player1.nickname });
      }
      
      // Switch to the game screen
      setGameState('game');
    });

    // Clean up the connection when the component unmounts
    return () => newSocket.close();
  }, []); // The empty array [] means this runs only once

  // This function is passed down to NicknameScreen
  const handleFindGame = (nickname) => {
    if (socket) {
      // Send a 'findGame' event to the server with the nickname
      socket.emit('findGame', { nickname });
      
      // Go to the waiting screen
      setGameState('waiting');
    }
  };

  // This function decides which screen to show
  const renderGameScreen = () => {
    switch (gameState) {
      case 'nickname':
        return <NicknameScreen onFindGame={handleFindGame} />;
      case 'waiting':
        return <WaitingScreen />;
      case 'game':
        // We'll pass all the info down to the Board soon
        return <Board />; 
      default:
        return <NicknameScreen onFindGame={handleFindGame} />;
    }
  };

  return (
    <div className="game">
      {/* We'll remove this title soon, but it's fine for now */}
      <h1>Tic-Tac-Toe</h1>
      <div className="game-container">
        {renderGameScreen()}
      </div>
    </div>
  );
}

export default App;
