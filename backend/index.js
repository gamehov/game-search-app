const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const CHEAPSHARK_API_KEY = "417644db3fmsh63816b90aa904cbp10d6f8jsn7ad9f97e626b";

// In-memory cache
const cache = {};

// Proxy endpoint for searching games
app.get("/api/search", async (req, res) => {
  const { query } = req.query;

  if (!query) {
    return res.status(400).json({ error: "Query parameter is required" });
  }

  // Check cache first
  if (cache[query]) {
    return res.json(cache[query]);
  }

  try {
    const response = await axios.get(
      `https://www.cheapshark.com/api/1.0/games?title=${query}&limit=5`,
      {
        headers: {
          "x-rapidapi-key": CHEAPSHARK_API_KEY,
          "x-rapidapi-host": "cheapshark.p.rapidapi.com",
        },
      }
    );

    // Save results to cache
    cache[query] = response.data;

    res.json(response.data);
  } catch (error) {
    console.error("Error fetching games from CheapShark:", error);
    res.status(500).json({ error: "Failed to fetch games from CheapShark" });
  }
});

// Proxy endpoint for fetching game details
app.get("/api/game/:id", async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: "Game ID is required" });
  }

  try {
    const response = await axios.get(
      `https://www.cheapshark.com/api/1.0/games?id=${id}`,
      {
        headers: {
          "x-rapidapi-key": CHEAPSHARK_API_KEY,
          "x-rapidapi-host": "cheapshark.p.rapidapi.com",
        },
      }
    );
    res.json(response.data);
  } catch (error) {
    console.error("Error fetching game details from CheapShark:", error);
    res.status(500).json({ error: "Failed to fetch game details from CheapShark" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
