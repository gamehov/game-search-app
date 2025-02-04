import React, { useState } from "react";
import axios from "axios";

const SearchBar = ({ onGameSelect }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  const handleSearch = async (e) => {
    const searchQuery = e.target.value;
    setQuery(searchQuery);

    if (searchQuery.length > 2) {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/api/search?query=${searchQuery}`
        );
        setResults(response.data);
      } catch (error) {
        console.error("Error fetching games:", error);
      }
    } else {
      setResults([]);
    }
  };

  return (
    <div className="search-bar">
      <input
        type="text"
        placeholder="Search for a game..."
        value={query}
        onChange={handleSearch}
      />
      {results.length > 0 && (
        <ul className="search-results">
          {results.map((game) => (
            <li key={game.gameID} onClick={() => onGameSelect(game)}>
              {game.external}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchBar;
