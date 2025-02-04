import React, { useEffect, useState } from "react";
import axios from "axios";

const GameDetails = ({ game }) => {
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDeals = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/api/game/${game.gameID}`
        );
        console.log("API Response:", response.data); // Debugging log
        setDeals(response.data.deals);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching deals:", error);
        setLoading(false);
      }
    };

    fetchDeals();
  }, [game]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="game-details">
      <h2>{game.external}</h2>
      <p>ATL: ${Math.min(...deals.map((deal) => parseFloat(deal.price))).toFixed(2)}</p>
      <p>ATH: ${Math.max(...deals.map((deal) => parseFloat(deal.price))).toFixed(2)}</p>

      <h3>Current Deals</h3>
      <table>
        <thead>
          <tr>
            <th>Store</th>
            <th>Price</th>
            <th>Retail Price</th>
            <th>Savings</th>
            <th>Link</th>
          </tr>
        </thead>
        <tbody>
          {deals.map((deal) => (
            <tr key={deal.dealID}>
              <td>Store {deal.storeID}</td>
              <td>${deal.price}</td>
              <td>${deal.retailPrice}</td>
              <td>{parseFloat(deal.savings).toFixed(2)}%</td>
              <td>
                <a
                  href={`https://www.cheapshark.com/redirect?dealID=${deal.dealID}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View Deal
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default GameDetails;
