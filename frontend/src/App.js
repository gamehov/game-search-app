import React, { useState } from "react";
import SearchBar from "./components/SearchBar";
import GameDetails from "./components/GameDetails";

const App = () => {
  const [selectedGame, setSelectedGame] = useState(null);

  return (
    <div className="app">
      <h1>Game Price Tracker</h1>
      <SearchBar onGameSelect={setSelectedGame} />
      {selectedGame && <GameDetails game={selectedGame} />}
    </div>
  );
};

export default App;
