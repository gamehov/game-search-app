import React, { useState, useEffect } from "react";
import axios from "axios";

const SearchBar = ({ onGameSelect }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [error, setError] = useState(null);

  // Debounce the search input
  useEffect(() => {
    if (query.length < 3) {
      setResults([]);
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/api/search?query=${query}`
        );
        setResults(response.data);
        setError(null); // Clear any previous errors
      } catch (error) {
        console.error("Error fetching games:", error);
        setError("Failed to fetch games. Please try again later.");
        setResults([]); // Clear results on error
      }
    }, 300); // 300ms delay

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  return (
    <div className="search-bar">
      <input
        type="text"
        placeholder="Search for a game..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      {error && <div className="error-message">{error}</div>}
      {results.length > 0 && (
        <ul className="search-results">
          {results.map((game) => (
            <li key={game.gameID} onClick={() => onGameSelect(game)}>
              <img
                src={game.thumb}
                alt={game.external}
                className="game-thumbnail"
              />
              <span>{game.external}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchBar;
