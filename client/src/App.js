import io from "socket.io-client";
import React, { useState, useEffect, useRef } from "react";
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
  const [gameId, setGameId] = useState(null);
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isMyTurn, setIsMyTurn] = useState(false);
  const [winner, setWinner] = useState(null);

  // Create a ref to hold the player's symbol
  const playerSymbolRef = useRef(null);

  // This 'useEffect' hook runs once when the component loads
  useEffect(() => {
    // Create the socket connection
    const newSocket = io(SOCKET_SERVER_URL);

    // Save the socket in our component's state
    setSocket(newSocket);

    // Set up a "connect" event listener
    // We successfully connected
    newSocket.on("connect", () => {
      console.log(`Connected to server! Socket ID: ${newSocket.id}`);
    });

    // Listen for the "gameStarted" event from the server
    // Server told us the game has started
    newSocket.on('gameStarted', (game) => {
      console.log('Game is starting!', game);
      
      setGameId(game.gameId);
      setBoard(game.board);
      
      // Determine if we are player 'X' or 'O'
      const myPlayer = game.players.find(p => p.id === newSocket.id);
      const otherPlayer = game.players.find(p => p.id !== newSocket.id);

      // Store our symbol in the ref
      playerSymbolRef.current = myPlayer.symbol;

      setPlayer(myPlayer);
      setOpponent(otherPlayer);
      setIsMyTurn(game.turn === myPlayer.symbol); // Check if it's our turn
      setGameState('game');
    });

    // Server sent us an updated game state
    newSocket.on('updateState', (game) => {
      setBoard(game.board);
      // Read from the ref, which is always up-to-date
      setIsMyTurn(game.turn === playerSymbolRef.current);
      setWinner(game.winner);
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

  // This function is passed down to Board.js
  const handleSquareClick = (squareIndex) => {
    // Check if it's our turn and the square is not already filled
    if (isMyTurn && !board[squareIndex] && !winner) {
      // Send the move to the server
      socket.emit('makeMove', {
        gameId: gameId,
        squareIndex: squareIndex,
        playerSymbol: player.symbol
      });
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
        return (
          <Board 
            board={board}
            onSquareClick={handleSquareClick}
          />
        );
      default:
        return <NicknameScreen onFindGame={handleFindGame} />;
    }
  };

  // Show game info (who is who, turn, winner)
  const renderGameInfo = () => {
    if (gameState !== 'game') return null;

    if (winner) {
      return (
        <div className="game-info">
          <h2>Winner: {winner}</h2>
        </div>
      );
    }
    
    return (
      <div className="game-info">
        <h3>You are: {player.symbol} ({player.nickname})</h3>
        <h3>Opponent: {opponent.symbol} ({opponent.nickname})</h3>
        <h2>{isMyTurn ? "Your Turn" : `Waiting for ${opponent.symbol}...`}</h2>
      </div>
    );
  };

  return (
    <div className="game">
      <h1>Tic-Tac-Toe</h1>
      {renderGameInfo()}
      <div className="game-container">
        {renderGameScreen()}
      </div>
    </div>
  );
}

export default App;
