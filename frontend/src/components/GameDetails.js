import React, { useEffect, useState } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";

const GameDetails = ({ game }) => {
  const [priceHistory, setPriceHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPriceHistory = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/api/game/${game.gameID}`
        );
        setPriceHistory(response.data.deals);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching price history:", error);
      }
    };

    fetchPriceHistory();
  }, [game]);

  if (loading) {
    return <div>Loading...</div>;
  }

  const chartData = {
    labels: priceHistory.map((deal) => deal.date),
    datasets: [
      {
        label: "Price History",
        data: priceHistory.map((deal) => deal.price),
        borderColor: "rgba(75, 192, 192, 1)",
        fill: false,
      },
    ],
  };

  return (
    <div className="game-details">
      <h2>{game.external}</h2>
      <p>ATL: ${Math.min(...priceHistory.map((deal) => deal.price))}</p>
      <p>ATH: ${Math.max(...priceHistory.map((deal) => deal.price))}</p>
      <div className="chart">
        <Line data={chartData} />
      </div>
      <a
        href={`https://www.cheapshark.com/redirect?dealID=${game.cheapestDealID}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        View Deal
      </a>
    </div>
  );
};

export default GameDetails;
