import React, { useState } from 'react';

// This component takes one prop: a function to call when the user clicks "Continue"
function NicknameScreen({ onFindGame }) {
  const [nickname, setNickname] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault(); // Prevents the page from reloading
    if (nickname.trim()) {
      onFindGame(nickname); // Calls the function from App.js
    }
  };

  return (
    <div className="nickname-screen">
      <form onSubmit={handleSubmit}>
        <h2>Who are you?</h2>
        <input
          type="text"
          placeholder="Nickname"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          autoFocus
        />
        <button type="submit">Continue</button>
      </form>
    </div>
  );
}

export default NicknameScreen;