import React, { useEffect, useState } from "react";
import axios from "axios";
import "./woFashion.css";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import RecommendedItem from "./personalRecommend";

const BASE_URLs = "https://api.malidag.com"; // Replace with the new API URL for categories (the server you provided)
const BASE_URL = "https://api.malidag.com"; // Replace with your actual API URL
const CRYPTO_URL = "https://api.malidag.com/crypto-prices"; // Your crypto prices endpoint

function FashionKick() {
  const [types, setTypes] = useState({});
  const [mtypes, setMTypes] = useState({})
  const [cryptoPrices, setCryptoPrices] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate()

  useEffect(() => {
    // Fetch types and images for the Beauty category
    const fetchBeautyItems = async () => {
      try {
        const response = await axios.get(`${BASE_URLs}/categories/FashionKick`);
        const data = response.data; // Should return the array of types with images

        setMTypes(data); // Update state with the types and images
      } catch (error) {
        console.error("Error fetching Beauty category items:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBeautyItems();
}, []);

  useEffect(() => {
    const fetchBeautyItems = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/items`);
        const data = response.data.items;

        const filteredData = data.filter(
          (item) =>
            item.category === "Shoes" &&
            item.item.sold >= 100 // ✅ Ensure only items with at least 100 sales are included
        );
        

    const groupedData = filteredData.reduce((acc, item) => {
      const type = item.item.type || "Other"; // Use "Other" if type is missing
      const genre = item.item.genre; // Assuming genre exists
     
      
      if (!acc[type]) acc[type] = {}; // Initialize type grouping
      
      if (!acc[type][genre]) acc[type][genre] = { genre, items: [] }; // Initialize genre grouping within the type
      
      acc[type][genre].items.push(item); // Add item to the correct genre under the type
      return acc;
    }, {});
    
      

      setTypes(groupedData);
    } catch (error) {
      console.error("Error fetching items:", error);
    } finally {
      setLoading(false);
    }
  };

    fetchBeautyItems();

     // Fetch crypto prices
     const fetchCryptoPrices = async () => {
        try {
          const response = await axios.get(CRYPTO_URL);
          setCryptoPrices(response.data);
        } catch (error) {
          console.error("Error fetching crypto prices:", error);
        }
      };
  
      fetchCryptoPrices();
       // Optionally, refresh crypto prices at intervals
    const intervalId = setInterval(fetchCryptoPrices, 5000); // Refresh every 5 seconds
    return () => clearInterval(intervalId); // Cleanup interval on unmount
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
      ETH: "https://assets.coingecko.com/coins/images/279/large/ethereum.png?1595348880",
      USDC: "https://assets.coingecko.com/coins/images/6319/large/USD_Coin_icon.png?1547042389",
      BUSD: "https://assets.coingecko.com/coins/images/9576/large/BUSD.png?1568947766",
      SOL: "https://assets.coingecko.com/coins/images/4128/large/solana.png?1640133422",
      BNB: "https://assets.coingecko.com/coins/images/825/large/binance-coin-logo.png?1547034615",
      USDT: "https://assets.coingecko.com/coins/images/325/large/Tether-logo.png?1598003707",
    };
    return cryptoIcons[cryptocurrency] || "/crypto-icons/default.png";
  };

  if (loading) return <div className="loading-message">Loading Beauty Items...</div>;

   // Handle item click to navigate to product details page
   const handleItemClick = (id) => {
    if (id) {
      navigate(`/product/${id}`); // Navigate to the product details page
    }
  };

  const handleCategoryClick = (category) => {
    if (category) {
      const formattedCategory = category.toLowerCase().replace(/\s+/g, "-"); // Convert spaces to hyphens
      navigate(`/itemsOfShoes/${encodeURIComponent(formattedCategory)}`); // Encode URI to handle special characters
    }
  };
  

  return (
    <div className="personal-care-container">
      <h2 className="personal-care-title">Fashion kick</h2>
      <div>
          {/* Display categories and images */}
      <div className="beauty-category">
        {Object.values(mtypes).length === 0 ? (
          <div>No types found for Beauty category</div>
        ) : (
          Object.values(mtypes).map((typeObj, index) => (
            <div key={index} className="type-section">
             
              <div className="type-image-id">
                <img
                  src={typeObj.image}
                  alt={typeObj.type}
                  className="type-image-imgid"
                  onClick={() => handleCategoryClick(typeObj.type)}
                />
              </div>
              <h3 className="type-title"style={{color: 'green', fontSize: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginLeft: '20px'}}>{typeObj.type}</h3>
            </div>
          ))
        )}
      </div>
      </div>

    {/* Display items grouped by type and genre */}
    {Object.entries(types).map(([type, genres]) => (
        Object.entries(genres).map(([genre, { items }]) => (
          <div className="type-secti" key={`${type}-${genre}`}>
            <h3 className="type-tit" style={{ display: 'flex' }}>
              {genre} {type} Top topic
              <div
                style={{
                  marginLeft: '10px',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  color: 'green',
                  marginTop: '10px',
                  cursor: 'pointer',
                }}
                onClick={() => navigate(`/shoes-top-topic/${type.toLowerCase()}`, { state: { genre } })}
              >
                see more
              </div>
            </h3>
            <div className="items-contain">
              {items.map(({ id, item }) => (
                <div className="c" key={id}>
                  <div className="ca">
                    <div className="item-ca">
                      <img
                        src={item.images[0]}
                        alt={item.name}
                        className="item-ima"
                        onClick={() => handleItemClick(id)}
                      />
                    </div>
                    <div onClick={() => handleItemClick(id)} className="item-">
                      <div style={{ display: 'flex', alignItems: 'center' }}>
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
                        {renderStars(item.rating || 0)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))
      ))}
      < RecommendedItem />
    </div>
  );
}

export default FashionKick;
