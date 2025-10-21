import io from "socket.io-client";
import React, { useState, useEffect } from "react";
import Board from "./Board";

// Define where our server is running
const SOCKET_SERVER_URL = "http://localhost:4000";

function App() {
  // Add state to hold the socket object
  const [socket, setSocket] = useState(null);

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

    // Clean up the connection when the component unmounts
    return () => newSocket.close();
  }, []); // The empty array [] means this runs only once

  return (
    <div className="game">
      <h1>Tic-Tac-Toe</h1>
      <div className="game-board">
        <Board />
      </div>
    </div>
  );
}

export default App;
