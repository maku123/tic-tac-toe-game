// Import required modules
const express = require('express');
const http = require('http');
const { Server } = require("socket.io");

// Set up the Express app and HTTP server
const app = express();
const server = http.createServer(app);

// Configure CORS
// This is necessary to allow our React app (running on localhost:3000)
// to communicate with our server (running on localhost:4000)
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", // Allow our React client
    methods: ["GET", "POST"]
  }
});

// Define the port
const PORT = 4000;

// Set up the main connection event
io.on('connection', (socket) => {
  // This code runs whenever a new client connects
  console.log(`A user connected: ${socket.id}`);

  // This code runs when that client disconnects
  socket.on('disconnect', () => {
    console.log(`A user disconnected: ${socket.id}`);
  });
});

// Start the server
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});