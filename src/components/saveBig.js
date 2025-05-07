import React, { useEffect, useState } from "react";
import axios from "axios";
import "./woFashion.css";
import { useNavigate } from "react-router-dom"; // Import useNavigate


const BASE_URL = "https://api.malidag.com"; // Items API URL
const CRYPTO_URL = "https://api.malidag.com/crypto-prices"; // Crypto prices API URL

function SaveBig() {
  const [types, setTypes] = useState({});
  const [cryptoPrices, setCryptoPrices] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // Initialize navigate

 

  useEffect(() => {
    const fetchFilteredItems = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/items`);
        const data = response.data.items;

        // Filter items based on conditions
        const filteredData = data.filter((item) => {
          const usdPrice = parseFloat(item.item.usdPrice);
          const originalPrice = parseFloat(item.item.originalPrice);
          const discount = originalPrice > 0 ? (originalPrice - usdPrice) / originalPrice : 0;

          return (
            ["BNB", "BTC", "ETH", "USDC", "USDT", "ADA", "BUSD", "SOL"].includes(item.item.cryptocurrency) &&
            discount <= 2 // At least 50% discount
          );
        });

        // Group filtered items by type
        const groupedData = filteredData.reduce((acc, item) => {
          const type = item.item.type || "Other"; // Use "Other" if type is missing
          if (!acc[type]) acc[type] = [];
          acc[type].push(item);
          return acc;
        }, {});

        setTypes(groupedData);
      } catch (error) {
        console.error("Error fetching items:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchCryptoPrices = async () => {
      try {
        const response = await axios.get(CRYPTO_URL);
        setCryptoPrices(response.data);
      } catch (error) {
        console.error("Error fetching crypto prices:", error);
      }
    };

    fetchFilteredItems();
    fetchCryptoPrices();

    // Refresh crypto prices periodically
    const intervalId = setInterval(fetchCryptoPrices, 5000);
    return () => clearInterval(intervalId);
  }, []);

  const renderStars = (rating) => {
    const stars = Array.from({ length: 5 }, (_, index) => (
      <span
        key={index}
        className={`star ${index < rating ? "filled" : "empty"}`}
      >
        ★
      </span>
    ));
    return <div className="stars-container">{stars}</div>;
  };

  const convertToCrypto = (usdPrice, cryptocurrency) => {
    if (!cryptoPrices[cryptocurrency]) return null;
    return (usdPrice / cryptoPrices[cryptocurrency]).toFixed(2);
  };

  const getCryptoIcon = (cryptocurrency) => {
    const cryptoIcons = {
      USDT: "https://assets.coingecko.com/coins/images/325/large/Tether-logo.png?1598003707",
      ETH: "https://assets.coingecko.com/coins/images/279/large/ethereum.png?1595348880",
      BNB: "https://assets.coingecko.com/coins/images/825/large/binance-coin-logo.png?1547034615",
      BUSD: "https://assets.coingecko.com/coins/images/9576/large/BUSD.png?1568947766",
      USDC: "https://assets.coingecko.com/coins/images/6319/large/USD_Coin_icon.png?1547042389",
    };
    return cryptoIcons[cryptocurrency] || "/crypto-icons/default.png";
  };

  if (loading) return <div className="loading-message">Loading Items...</div>;

   // Handle item click to navigate to product details page
   const handleItemClick = (id) => {
    if (id) {
      navigate(`/product/${id}`); // Navigate to the product details page
    }
  };

  return (
    <div className="personal-care-container">
      <h2 className="personal-care-title">Save big (0% to 200% Off)</h2>

      {Object.entries(types).map(([type, items]) => (
        <div className="type-secti" key={type}>
          <h3 className="type-tit" style={{display: 'flex', }}>{type}<div style={{marginLeft: '10px', fontSize: '14px', fontWeight: 'bold', color: 'green', marginTop: '10px', cursor: 'pointer'}}>see more</div></h3>
          <div className="items-contain">
            {items.map(({ id, item }) => (
                <div className="c">
                <div className="ca">
              <div className="item-ca" key={id}>
                <img
                  src={item.images[0]}
                  alt={item.name}
                  onClick={() => handleItemClick(id)} // Pass the correct id
                  className="item-ima"
                />
                  
              </div>
             
              <div  onClick={() => handleItemClick(id)}  className="item-">
                <div style={{display: 'flex', alignItems: 'center'}}>
              <div className="item-pri">${item.usdPrice}</div>
              <div className="item-crypto-pri">
            
                    {convertToCrypto(item.usdPrice, item.cryptocurrency)
                      ? `${convertToCrypto(item.usdPrice, item.cryptocurrency)} ${item.cryptocurrency}`
                      : "Loading..."}

                    <img
                      src={getCryptoIcon(item.cryptocurrency)}
                      alt={item.cryptocurrency}
                      className="crypto-icon"
                    />
                  </div>
                  </div>
              {item.name.length > 150
                ? `${item.name.substring(0, 150)}...`
                : item.name}
                 <div className="item-rating">
                    {renderStars(item.rating || 0)} {/* Default rating: 0 */}
                  </div>
            </div>
            </div>
           
            </div>
            
            ))}
          </div>
        </div>
       
      ))}
     
    </div>
  );
}

export default SaveBig;
