import React, { useState, useEffect } from 'react';

// We get the server URL and a function to go back
function LeaderboardScreen({ serverUrl, onBack }) {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch the leaderboard data from our server
    fetch(`${serverUrl}/leaderboard`)
      .then(res => res.json())
      .then(data => {
        setLeaderboard(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching leaderboard:', err);
        setLoading(false);
      });
  }, [serverUrl]); // Re-run if serverUrl changes (it won't, but it's good practice)

  return (
    <div className="leaderboard-screen">
      <h2>Top 10 Players</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ol>
          {leaderboard.map((player) => (
            <li key={player.nickname}>
              <span>{player.nickname}</span>
              <span>{player.score}</span>
            </li>
          ))}
        </ol>
      )}
      <button onClick={onBack}>Back to Home</button>
    </div>
  );
}

export default LeaderboardScreen;