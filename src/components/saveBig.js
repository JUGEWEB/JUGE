import React, { useEffect, useState } from "react";
import axios from "axios";
import "./woFashion.css";
import { useNavigate } from "react-router-dom"; // Import useNavigate


const BASE_URL = "http://192.168.0.210:3001"; // Items API URL
const CRYPTO_URL = "http://192.168.0.210:2000/crypto-prices"; // Crypto prices API URL

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
      USDT: "https://cryptologos.cc/logos/tether-usdt-logo.png",
      ETH: "https://cryptologos.cc/logos/ethereum-eth-logo.png",
      BNB: "https://cryptologos.cc/logos/binance-coin-bnb-logo.png",
      BTC: "https://cryptologos.cc/logos/bitcoin-btc-logo.png",
      BUSD: "https://cryptologos.cc/logos/binance-usd-busd-logo.png",
      USDC: "https://cryptologos.cc/logos/usd-coin-usdc-logo.png",
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
