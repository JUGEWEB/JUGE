import React, { useState, useEffect } from "react";
import { LeftOutlined, RightOutlined } from "@ant-design/icons"; // Import arrow icons
import "./topTopic.css";
import { useNavigate } from "react-router-dom"; // Import useNavigate

const BASE_URL = "http://192.168.0.210:3001"; // Replace with your actual API URL
const BASE_URLs = "http://192.168.0.210:2000"; // Replace with your actual API URL

function TopTopic() {
  const [topItems, setTopItems] = useState([]);
  const [cryptoPrices, setCryptoPrices] = useState({});
  const [currentSlide, setCurrentSlide] = useState(0);
  const stars = Math.floor(Math.random() * 5) + 1; // Random stars for now
  const navigate = useNavigate(); // Initialize navigate

  const itemsPerSlide = 7; // Number of items to show per slide

  // Fetch cryptocurrency prices from the new endpoint
 const fetchCryptoPrices = async () => {
  try {
    const response = await fetch(`${BASE_URLs}/crypto-prices`);
    const prices = await response.json();
    setCryptoPrices(prices);
  } catch (error) {
    console.error("Error fetching crypto prices:", error);
  }
};

  useEffect(() => {
    const fetchTopItems = async () => {
      try {
        const response = await fetch(`${BASE_URL}/items`);
        const data = await response.json();

        // Sort items by 'sold' in descending order and take the top 100
        const sortedItems = data.items
          .sort((a, b) => parseInt(b.item.sold, 10) - parseInt(a.item.sold, 10))
          .slice(0, 100);

        setTopItems(sortedItems);

        const symbols = [
          ...new Set(
            sortedItems
              .map((item) => item.item.cryptocurrency && `${item.item.cryptocurrency}USDT`)
              .filter(Boolean)
          ),
        ];

        await fetchCryptoPrices(symbols);

      } catch (error) {
        console.error("Error fetching top items:", error);
      }
    };

    fetchTopItems();
  }, []);

  const totalSlides = Math.ceil(topItems.length / itemsPerSlide);

  const handleNextSlide = () => {
    setCurrentSlide((prevSlide) => (prevSlide + 1) % totalSlides);
  };

  const handlePrevSlide = () => {
    setCurrentSlide((prevSlide) =>
      prevSlide === 0 ? totalSlides - 1 : prevSlide - 1
    );
  };

  // Get the items for the current slide
  const startIdx = currentSlide * itemsPerSlide;
  const currentItems = topItems.slice(startIdx, startIdx + itemsPerSlide);

  // Helper function to convert USD price to cryptocurrency price
  const convertToCrypto = (usdPrice, crypto) => {
    if (!cryptoPrices[crypto]) return null; // If the price isn't available
    const cryptoPrice = parseFloat(cryptoPrices[crypto]); // Price in USD per 1 unit of crypto
    return (usdPrice / cryptoPrice).toFixed(2); // USD to crypto conversion
  };

  // Handle item click to navigate to product details page
  const handleItemClick = (id) => {
    if (id) {
      navigate(`/product/${id}`); // Navigate to the product details page
    }
  };

  return (
    <div className="top-topic-carou">
      <div className="carousel-sli">
        {currentItems.map((item, index) => (
          <div>
          <div className="carousel-i" key={item.id}>
            <img
              src={item.item.images[0]} // Assuming the first image is the main image
              alt={item.item.name}
              onClick={() => handleItemClick(item.id)} // Pass the correct id
              className="carousel-im"
              style={{cursor: "pointer"}}
            />
          </div>
          <div className="item-pr">${item.item.usdPrice}</div>
          <div className="recommended-price">
             
                  {item.item.usdPrice && item.item.cryptocurrency
                    ? `${convertToCrypto(Number(item.item.usdPrice), item.item.cryptocurrency)} ${item.item.cryptocurrency}`
                    : "Price in crypto N/A"}
                </div>
          <div className="item-sta">
                  {"★".repeat(stars)}{"☆".repeat(5 - stars)}
                </div>
          <div  onClick={() => handleItemClick(item.id)}  className="item-n">{item.item.name}</div>
          </div>
        ))}
      </div>
      {topItems.length > itemsPerSlide && (
        <div className="carousel-arr">
          <LeftOutlined onClick={handlePrevSlide} className="arrow-but" />
          <RightOutlined onClick={handleNextSlide} className="arrow-but" />
        </div>
      )}
    </div>
  );
}

export default TopTopic;
