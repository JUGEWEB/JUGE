import React, { useEffect, useState } from "react";
import axios from "axios";
import "./woFashion.css";
import RecommendedItem from "./personalRecommend";
import { useNavigate } from "react-router-dom"; // Import useNavigate

const BASE_URLs = "http://192.168.0.210:4002"; // Replace with the new API URL for categories (the server you provided)
const BASE_URL = "http://192.168.0.210:3001"; // Replace with your actual API URL
const CRYPTO_URL = "http://192.168.0.210:2000/crypto-prices"; // Your crypto prices endpoint

function WoFashion() {
  const [types, setTypes] = useState({});
  const [mtypes, setMTypes] = useState({})
  const [cryptoPrices, setCryptoPrices] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // Initialize navigate

  useEffect(() => {
    // Fetch types and images for the Beauty category
    const fetchBeautyItems = async () => {
      try {
        const response = await axios.get(`${BASE_URLs}/categories/WomenFashion`);
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

    // Filter items where genre includes "women" and category is not "Beauty"
    const filteredData = data.filter(
        (item) =>
          item.item.genre.includes("women") && item.category !== "Beauty"
      );

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
        USDT: "https://cryptologos.cc/logos/tether-usdt-logo.png",
        ETH: "https://cryptologos.cc/logos/ethereum-eth-logo.png",
        BNB: "https://cryptologos.cc/logos/binance-coin-bnb-logo.png",
        SOL: "https://cryptologos.cc/logos/solana-sol-logo.png",
        BUSD: "https://cryptologos.cc/logos/binance-usd-busd-logo.png",
        USDC: "https://cryptologos.cc/logos/usd-coin-usdc-logo.png", // Updated URL
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
      let formattedCategory = category.toLowerCase().trim(); // Convert to lowercase and trim spaces
  
      // Normalize "shirt and tshirt" to "shirt"
      if (formattedCategory.includes("shirt and")) {
        formattedCategory = "shirt";
      }
  
      navigate(`/itemsOfWomen/${encodeURIComponent(formattedCategory)}`); // Encode URL to handle special characters
    }
  };
  
  

  return (
    <div className="personal-care-container">
      <h2 className="personal-care-title">Women fashion</h2>
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

      {Object.entries(types).map(([type, items]) => (
        <div className="type-secti" key={type}>
          <h3 className="type-tit" style={{display: 'flex', }}>{type} Top topic <div style={{marginLeft: '10px', fontSize: '14px', fontWeight: 'bold', color: 'green', marginTop: '10px', cursor: 'pointer'}} onClick={() => navigate(`/women-top-topic/${type.toLowerCase()}`)}>see more</div></h3>
          <div className="items-contain">
            {items.map(({ id, item }) => (
                <div className="c">
                <div className="ca">
              <div className="item-ca" key={id}>
                <img
                  src={item.images[0]}
                  alt={item.name}
                  className="item-ima"
                  onClick={() => handleItemClick(id)} // Pass the correct id
                />
                  
              </div>
             
              <div   onClick={() => handleItemClick(id)}  className="item-">
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
      < RecommendedItem />
    </div>
  );
}

export default WoFashion;
