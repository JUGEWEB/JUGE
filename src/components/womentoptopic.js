import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import "./beautyTopTopic.css";
import AnalyseReview from "./analyseReview"; // Import your AnalyseReview component

const BASE_URL = "http://192.168.0.210:3001";


const WomenTopTopic = () => {
  const { type } = useParams(); // Get the type from the URL
  const [topBeautyItems, setTopBeautyItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null); // Store the selected item (instead of just itemId)
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [selectedItemProductId, setSelectedItemProductId] = useState(null); // Store `itemId` for AnalyseReview
  const [modalOpen, setModalOpen] = useState(false);
  const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 });
 
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTopBeautyItems = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/items`);
        const data = response.data.items;


        // Filter items by type and where sold >= 100
        const filteredItems = data.filter(
          (item) => item.category !== "Beauty" && item.item.genre === "women" && item.item.type.toLowerCase() === type.toLowerCase() && item.item.sold >= 100
        );
        setTopBeautyItems(filteredItems);
      } catch (error) {
        console.error("Error fetching top beauty items:", error);
      } finally {
        setLoading(false);
      }
    };

   

    if (type) {
      fetchTopBeautyItems();
      
    }
  }, [type]);

  const openModal = (item, event) => {
    setSelectedItem(item); // Store the entire item object
    setSelectedItemId(item.id); // Store only the ID for navigation
    setSelectedItemProductId(item.itemId); // Store `itemId` for AnalyseReview

    // Get button position relative to the page
    const rect = event.target.getBoundingClientRect();
    setModalPosition({
      top: rect.top + window.scrollY + 30, 
      left: rect.left + window.scrollX + 10,
    });

    setModalOpen(true);
};


const closeModal = () => {
    setSelectedItemId(null);
    setSelectedItemProductId(null);
    setModalOpen(false);
  };

  const handleRatingClick = (rating) => {
    console.log(`User selected ${rating} stars for product ID: ${selectedItemId}`);
    if (selectedItemId) {
      navigate(`/product/${selectedItemId}`);
    } else {
      console.error("Error: Product ID is undefined");
    }
  };


  if (loading) return <div className="loading-message">Loading {type} Top Items...</div>;

  return (
    <div className="beauty-top-container">
    <h2 className="beauty-top-title">{type.replace("-", " ")} - Top Items</h2>
    <div className="ms-grid">
      {topBeautyItems.length === 0 ? (
        <p>No top-selling items found for {type}.</p>
      ) : (
        topBeautyItems.map(({itemId, id, item }) => (
           
          <div
            key={id}
            className="m-card"
           
          >
            {/* Image on the left */}
            <img
              src={item.images[0]}
              alt={item.name}
              className="m-image"
              onClick={() => navigate(`/product/${id}`)}
            />

            {/* Details on the right */}
            <div className="m-details">
            <button className="view-details-btn" onClick={(e) => openModal({ id, itemId, item }, e)}>
                 View Details & Reviews
            </button>
              <h3 className="m-name"  onClick={() => navigate(`/product/${id}`)} >{item.name}</h3>
              <p className="m-sold">Sold: {item.sold} items</p>
             
            </div>
           
          </div>
        ))
      )}
    </div>
     {/* Modal (Always Appears Next to Clicked Button) */}
     {modalOpen && selectedItemProductId && (
        <div
          className="modal-content"
          style={{
            position: "absolute",
            top: `${modalPosition.top}px`,
            left: `${modalPosition.left}px`,
            background: "white",
            padding: "10px",
            borderRadius: "8px",
            boxShadow: "0px 4px 8px rgba(0,0,0,0.2)",
            zIndex: 1000,
            color: "black"
          }}
        >
          <span className="close-btn" onClick={closeModal}>&times;</span>
          <AnalyseReview productId={selectedItemProductId} id={selectedItemId} onRatingClick={handleRatingClick} />
        </div>
      )}
  </div>
);
};


export default WomenTopTopic;
