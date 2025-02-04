import React, { useEffect, useState } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

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
        setLoading(false);
      }
    };

    fetchPriceHistory();
  }, [game]);

  if (loading) {
    return <div>Loading...</div>;
  }

  // Format data for the chart
  const chartData = {
    labels: priceHistory.map((deal) => new Date(deal.date * 1000).toLocaleDateString()),
    datasets: [
      {
        label: "Price History",
        data: priceHistory.map((deal) => deal.price),
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        fill: true,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Price History",
      },
    },
  };

  return (
    <div className="game-details">
      <h2>{game.external}</h2>
      <p>ATL: ${Math.min(...priceHistory.map((deal) => parseFloat(deal.price))).toFixed(2)}</p>
      <p>ATH: ${Math.max(...priceHistory.map((deal) => parseFloat(deal.price))).toFixed(2)}</p>
      <div className="chart">
        <Line data={chartData} options={chartOptions} />
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
