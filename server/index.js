// Load Environment Variables
require('dotenv').config();

// Import Modules
const express = require('express');
const http = require('http');
const { Server } = require("socket.io");
const cors = require('cors');
const connectDB = require('./config/db');
const leaderboardRoutes = require('./routes/leaderboard.routes');
const initializeSocket = require('./services/socket.service');

// Connect to Database
connectDB();

// Initialize Server & Express
const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 4000;

// Configure CORS
const allowedOrigins = [
  "http://localhost:3000",
  process.env.CLIENT_ORIGIN
];

app.use(cors({ 
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('CORS policy violation'));
    }
  }
}));

// Configure Socket.io
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"]
  }
});

// Initialize our socket logic
initializeSocket(io);

// Define API Routes
app.use('/leaderboard', leaderboardRoutes);

// Start the Server
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});