const express = require('express');
const router = express.Router();
const Player = require('../models/player.model'); // Import our model

router.get('/', async (req, res) => {
  try {
    // Find top 10 players, sorted by score descending
    const topPlayers = await Player.find()
      .sort({ score: -1 })
      .limit(10);

    res.json(topPlayers);
  } catch (err) {
    console.error('Error fetching leaderboard:', err);
    res.status(500).json({ message: 'Error fetching leaderboard' });
  }
});

module.exports = router;