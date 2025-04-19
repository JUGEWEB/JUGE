import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Import for navigation
import "./coin.css";
import useScreenSize from "./useIsMobile";

const Coin = () => {
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(true);
  const {isMobile, isDesktop, isSmallMobile, isTablet, isVerySmall} = useScreenSize()
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // React Router navigation function

  const coinImages = {
    ETH: "https://assets.coingecko.com/coins/images/279/large/ethereum.png?1595348880",
    USDC: "https://assets.coingecko.com/coins/images/6319/large/USD_Coin_icon.png?1547042389",
    BUSD: "https://assets.coingecko.com/coins/images/9576/large/BUSD.png?1568947766",
    SOL: "https://assets.coingecko.com/coins/images/4128/large/solana.png?1640133422",
    BNB: "https://assets.coingecko.com/coins/images/825/large/binance-coin-logo.png?1547034615",
    USDT: "https://assets.coingecko.com/coins/images/325/large/Tether-logo.png?1598003707",
    // You can add more if you want
  };
  

  useEffect(() => {
    const fetchCoins = async () => {
      try {
        // Fetch symbols from your server
        const symbolResponse = await axios.get("https://api.malidag.com/items");
        const symbols = symbolResponse.data.items
          .map((item) => item.item.cryptocurrency)
          .filter(Boolean); // Extract and filter valid symbols
  
        // Remove duplicates using Set
        const uniqueSymbols = [...new Set(symbols)];
  
          // Fetch prices from your server
        const response = await axios.get("https://api.malidag.com/crypto-prices");
        const prices = response.data;

        // Map prices to a list of coin objects for rendering
        const coinPrices = Object.keys(prices).map((symbol) => ({
          symbol,
          price: prices[symbol].toFixed(2), // Format to 2 decimal places
        }));

        setCoins(coinPrices);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching coin data:", err);
        setError("Failed to load coin data. Please try again later.");
        setLoading(false);
      }
    };
  
    fetchCoins();
    const intervalId = setInterval(fetchCoins, 1000); // Fetch every 1 second
  
    return () => clearInterval(intervalId); // Clear interval on component unmount
  }, []);
  

  if (loading) return <div>Loading coins...</div>;
  if (error) return <div>{error}</div>;

  const handleCoinClick = (symbol) => {
    navigate(`/coin/${symbol}`); // Navigate to the CoinPage with the selected cryptocurrency
  };

  return (
    <div className="coin-scroll-container" style={{backgroundColor:(isDesktop || isTablet) ? "#333" : "#336" }}>
      <div className="coin-scroll">
        {coins.map((coin) => (
          <div key={coin.symbol} className="coin-item" onClick={() => handleCoinClick(coin?.symbol)} >
             <img
              src={coinImages[coin?.symbol] || "https://via.placeholder.com/40"}
              alt={coin?.symbol}
              className="coin-image"
            />
            <div>{coin?.symbol}</div>
            <div style={{marginLeft: '5px'}}>${coin?.price}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Coin;
