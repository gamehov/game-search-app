import React, { useState, useEffect } from "react";
import axios from "axios";

const SearchBar = ({ onGameSelect }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [error, setError] = useState(null);

  // Get cached results from localStorage
  const getCachedResults = (query) => {
    const cachedData = localStorage.getItem(`search_${query}`);
    return cachedData ? JSON.parse(cachedData) : null;
  };

  // Save results to localStorage
  const saveCachedResults = (query, data) => {
    localStorage.setItem(`search_${query}`, JSON.stringify(data));
  };

  // Debounce the search input
  useEffect(() => {
    if (query.length < 3) {
      setResults([]);
      return;
    }

    // Check cache first
    const cachedResults = getCachedResults(query);
    if (cachedResults) {
      setResults(cachedResults);
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/api/search?query=${query}`
        );
        setResults(response.data);
        setError(null); // Clear any previous errors

        // Save results to cache
        saveCachedResults(query, response.data);
      } catch (error) {
        console.error("Error fetching games:", error);
        if (error.response) {
          // Handle rate limiting
          if (error.response.status === 429 || error.response.data?.error?.includes("rate limiting")) {
            setError("Rate limit exceeded. Please wait a moment and try again.");
          } else {
            setError("Failed to fetch games. Please try again later.");
          }
        } else {
          setError("Network error. Please check your connection.");
        }
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
