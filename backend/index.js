const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const CHEAPSHARK_API_KEY = "417644db3fmsh63816b90aa904cbp10d6f8jsn7ad9f97e626b";

// Proxy endpoint for searching games
app.get("/api/search", async (req, res) => {
  const { query } = req.query;
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
    res.json(response.data);
  } catch (error) {
    console.error("Error fetching games:", error);
    res.status(500).json({ error: "Failed to fetch games" });
  }
});

// Proxy endpoint for fetching game details
app.get("/api/game/:id", async (req, res) => {
  const { id } = req.params;
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
    console.error("Error fetching game details:", error);
    res.status(500).json({ error: "Failed to fetch game details" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
