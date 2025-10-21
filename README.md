# Real-Time Multiplayer Tic-Tac-Toe

This is a full-stack, server-authoritative multiplayer Tic-Tac-Toe game built from scratch. It features a real-time matchmaking system, a persistent leaderboard stored in MongoDB, and is fully deployed to the cloud.

---

## 🚀 Live Demo

* **Play the Game (Frontend):** https://maku123-tic-tac-toe-game.netlify.app/
* **View the Leaderboard API (Backend):** `https://[backend_url]/leaderboard`

**Note:** The free-tier backend on Render will "spin down" after 15 minutes of inactivity. The *first* connection (when a player clicks "Find Game") may take 20-30 seconds as the server wakes up.

---

## ✨ Features

* **Full-Stack Architecture:** A decoupled React frontend and Node.js backend in a single monorepo.
* **Real-Time Gameplay:** Uses **Socket.io** for instant, event-based communication between all clients and the server.
* **Server-Authoritative Logic:** All game logic, move validation, and win/draw checking is handled **100% on the server** to prevent any possibility of client-side cheating.
* **Matchmaking:** A simple "waiting room" queue system on the server instantly pairs the first two available players.
* **Multiple Simultaneous Games:** Uses Socket.io **Rooms** to create a unique, private session for each game, allowing for unlimited simultaneous matches without interference.
* **Persistent Leaderboard:** Game results are stored permanently in a **MongoDB Atlas** cloud database.
* **REST API:** The server provides a public `GET /leaderboard` REST endpoint to fetch the top 10 players, sorted by score.
* **Fully Deployed:** The frontend is deployed on **Netlify** and the backend on **Render**, with CI/CD (Continuous Integration/Continuous Deployment) from GitHub.

---

## 🛠 Tech Stack

| Area | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend** | **React** | For building a modern, component-based user interface. |
| | **Socket.io-Client** | To manage the real-time WebSocket connection from the client. |
| **Backend** | **Node.js** | The JavaScript runtime environment for the server. |
| | **Express** | A minimal framework for creating the server and the REST API. |
| | **Socket.io** | For managing real-time connections, matchmaking, and game rooms. |
| | **Mongoose** | To connect to and interact with our MongoDB database. |
| **Database** | **MongoDB Atlas** | A free, cloud-hosted NoSQL database to store leaderboard data. |
| **Deployment** | **Netlify** | For hosting the frontend React app. |
| | **Render** | For hosting the backend Node.js server. |
| | **Git & GitHub** | For version control and to trigger automatic deployments. |

---

## 🏛 Architecture & Design Choices

This project was built with a few key design principles in mind:

1.  **Monorepo:** Both the `/client` and `/server` code are kept in a single GitHub repository. This simplifies development and ensures that the client and server code are always in sync. A change that requires both a frontend and backend update (like a new socket event) can be saved in a single `git commit`.

2.  **Server-Authoritative (The Core Principle):** The client is treated as "dumb." It is only responsible for rendering the UI and sending user inputs (like "I clicked square 5") to the server. The server then:
    * **Validates** the move: "Is it this player's turn? Is that square empty? Is the game over?"
    * **Updates** its own, "true" version of the game state.
    * **Broadcasts** this new, true state to *all* clients in that game room.
    * This is the *only* way to build a cheat-proof multiplayer game.

3.  **Separation of Concerns (Backend):** The server code is not one giant `index.js` file. It is refactored into a professional and scalable structure:
    * `/config`: Handles the database connection logic.
    * `/models`: Defines the Mongoose schemas (e.g., `player.model.js`).
    * `/routes`: Defines the Express REST API routes (e.g., `leaderboard.routes.js`).
    * `/services`: Contains all the real-time Socket.io logic (e.g., `socket.service.js`).
    * `index.js`: A clean startup file that imports and initializes all the services.

4.  **Socket.io vs. Raw WebSockets:** While raw WebSockets are a technology, Socket.io is a library that provides huge benefits for free, which were critical for this project:
    * **Rooms:** The ability to easily group two players into a private `gameId` room (`socket.join(gameId)`) is the foundation of the matchmaking and simultaneous game system.
    * **Reliability:** It automatically handles disconnections and reconnections.
    * **Fallbacks:** It can fall back to other technologies (like HTTP long-polling) if a user's network blocks WebSockets.

5.  **Environment Variables (`.env`):** No secret keys or URLs are hard-coded. The server uses `MONGODB_URI` and `CLIENT_ORIGIN` variables, and the client uses `REACT_APP_SOCKET_SERVER_URL`. This is a security best practice and allows the same code to run locally for development and on the cloud for production.

---

## 📦 How to Run Locally

To run this project on your local machine, you will need **Node.js**, **npm**, and a free **MongoDB Atlas** account.

### 1. Prerequisites

* **Node.js & npm:** [Download and install](https://nodejs.org/)
* **Git:** [Download and install](https://git-scm.com/)
* **MongoDB Atlas:**
    1.  Create a [free M0 cluster](https://www.mongodb.com/cloud/atlas/register).
    2.  In **"Database Access"**, create a user (e.g., `game_user` with a password).
    3.  In **"Network Access"**, add IP Address `0.0.0.0/0` (Allow Access From Anywhere).
    4.  Click **Connect** -> **Connect your application** and copy the **Connection String**.

### 2. Clone the Project

```bash
git clone https://github.com/maku123/tic-tac-toe-game.git
cd tic-tac-toe-game
```

### 3. Set Up & Run the Backend

The server *must* be running for the client to connect.

```bash
# 1. Navigate to the server folder
cd server

# 2. Install all dependencies
npm install

# 3. Create a .env file
# (On Mac/Linux)
touch .env
# (On Windows)
echo. > .env

# 4. Open the new .env file and add your MongoDB connection string
# Make sure to replace <password> with the password you created!
MONGODB_URI=mongodb+srv://<username>:<password>@your-cluster-url...

# 5. Start the server
node index.js
```

✅ Server is now running on http://localhost:4000

### 4. Set Up & Run the Frontend

Open a **new terminal window** for this step.

```bash
# 1. Navigate to the client folder from the root
cd client

# 2. Install all dependencies
npm install

# 3. Create a .env file
# (On Mac/Linux)
touch .env
# (On Windows)
echo. > .env

# 4. Open the new .env file and tell the client where to find the server
REACT_APP_SOCKET_SERVER_URL=http://localhost:4000

# 5. Start the React app
npm start
```

✅ Your browser will open to http://localhost:3000

You can now open a second localhost:3000 tab to simulate a second player and test the full matchmaking flow.

