const Player = require("../models/player.model"); // Import Player model

// --- NEW GAME LOGIC ---

// This will store the state of all active games
// We'll use the gameId as the key
const games = {};

// Helper function to calculate the winner
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8], // rows
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8], // columns
    [0, 4, 8],
    [2, 4, 6], // diagonals
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

// -------------------------

// --- NEW MATCHMAKING LOGIC ---

// This variable will hold the socket of a player waiting for an opponent
let waitingPlayer = null;

// ---------------------------------
module.exports = (io) => {
  // Set up the main connection event
  io.on("connection", (socket) => {
    // This code runs whenever a new client connects
    console.log(`A user connected: ${socket.id}`);

    // Listen for 'findGame' event
    socket.on("findGame", (data) => {
      console.log(
        `Player ${data.nickname} (${socket.id}) is looking for a game.`
      );

      if (waitingPlayer) {
        // --- A match is found! ---
        console.log("Match found! Starting game...");

        // Create a unique game ID (room name)
        const gameId = Math.random().toString(36).substring(2, 9);

        // Get the waiting player's info
        const player1 = {
          id: waitingPlayer.socket.id,
          nickname: waitingPlayer.nickname,
          symbol: "X",
        };

        // Get the new player's info
        const player2 = {
          id: socket.id,
          nickname: data.nickname,
          symbol: "O",
        };

        // Create a new game state in our 'games' object
        games[gameId] = {
          gameId: gameId,
          players: [player1, player2],
          board: Array(9).fill(null),
          turn: "X", // X always starts
          winner: null,
        };

        // Have both sockets "join" the same room
        waitingPlayer.socket.join(gameId);
        socket.join(gameId);

        // Emit 'gameStarted' to *both* players in that room
        // We send the full game state
        io.to(gameId).emit("gameStarted", games[gameId]);

        console.log(
          `Game ${gameId} started between ${player1.nickname} and ${player2.nickname}`
        );

        // Clear the waiting player variable
        waitingPlayer = null;
      } else {
        // --- No player is waiting, so this player becomes the waiting player ---
        console.log("No player waiting. This player is now waiting.");
        waitingPlayer = {
          socket: socket,
          nickname: data.nickname,
        };
      }
    });

    // Listen for 'makeMove' event
    socket.on("makeMove", async (data) => {
      const { gameId, squareIndex, playerSymbol } = data;
      const game = games[gameId];

      // --- Validation Checks ---
      if (!game) return; // Game doesn't exist
      if (game.winner) return; // Game is already over
      if (game.turn !== playerSymbol) return; // Not this player's turn
      if (game.board[squareIndex]) return; // Square is already taken

      // --- Move is valid! ---

      // Update the board
      game.board[squareIndex] = playerSymbol;

      // Check for a winner
      const winner = calculateWinner(game.board);
      if (winner) {
        game.winner = winner;

        // LEADERBOARD LOGIC
        try {
          // Find the player in the game object
          const winningPlayer = game.players.find((p) => p.symbol === winner);

          if (winningPlayer) {
            // Find player in DB and increment their score
            // 'upsert: true' creates the player if they don't exist
            await Player.findOneAndUpdate(
              { nickname: winningPlayer.nickname },
              { $inc: { score: 1 } },
              { upsert: true, new: true }
            );
            console.log(`Updated score for ${winningPlayer.nickname}`);
          }
        } catch (err) {
          console.error("Error updating score:", err);
        }
      } else if (game.board.every((square) => square !== null)) {
        // HANDLE DRAW
        // 'every' checks if all squares are filled
        game.winner = "draw";
        console.log(`Game ${gameId} is a draw.`);
      } else {
        // -NO WINNER, NO DRAW - CONTINUE GAME
        // Update the turn
        game.turn = playerSymbol === "X" ? "O" : "X";
      }

      // Broadcast the *new* game state to everyone in the room
      io.to(gameId).emit("updateState", game);
    });

    // This code runs when that client disconnects
    socket.on("disconnect", () => {
      console.log(`A user disconnected: ${socket.id}`);

      // If the disconnecting user was the waiting player, clear the queue
      if (waitingPlayer && waitingPlayer.socket.id === socket.id) {
        console.log("The waiting player disconnected. Clearing queue.");
        waitingPlayer = null;
      }

      // TODO: Handle disconnection during an active game
      // (We'll leave this for now to keep it simple)
    });
  });
};
