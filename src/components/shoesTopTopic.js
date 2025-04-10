import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams, useLocation } from "react-router-dom"; // Import useLocation
import "./beautyTopTopic.css";
import AnalyseReview from "./analyseReview"; // Import AnalyseReview component

const BASE_URL = "http://192.168.0.210:3001";

const ShoesTopTopic = () => {
  const { type } = useParams(); // Get the type from URL
  const location = useLocation();
  const genre = location.state?.genre || ""; // Retrieve genre from useLocation

  const [topShoesItems, setTopShoesItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [selectedItemProductId, setSelectedItemProductId] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 });

  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTopShoesItems = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/items`);
        const data = response.data.items;

        // ✅ Filter items by `type`, `genre`, and `sold >= 100`
        const filteredItems = data.filter(
          (item) =>
            item.category.toLowerCase() === "shoes" &&
            item.item.type.toLowerCase() === type.toLowerCase() &&
            item.item.genre.toLowerCase() === genre.toLowerCase() && // ✅ Filter by genre
            item.item.sold >= 100
        );

        setTopShoesItems(filteredItems);
      } catch (error) {
        console.error("Error fetching top shoes items:", error);
      } finally {
        setLoading(false);
      }
    };

    if (type && genre) {
      fetchTopShoesItems();
    }
  }, [type, genre]);

  const openModal = (item, event) => {
    setSelectedItem(item);
    setSelectedItemId(item.id);
    setSelectedItemProductId(item.itemId);

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

  if (loading) return <div className="loading-message">Loading {genre} {type} Top Items...</div>;

  return (
    <div className="beauty-top-container">
      <h2 className="beauty-top-title">{genre} {type.replace("-", " ")} - Top Items</h2>
      <div className="ms-grid">
        {topShoesItems.length === 0 ? (
          <p>No top-selling items found for {genre} {type}.</p>
        ) : (
          topShoesItems.map(({ itemId, id, item }) => (
            <div key={id} className="m-card">
              <img
                src={item.images[0]}
                alt={item.name}
                className="m-image"
                onClick={() => navigate(`/product/${id}`)}
              />

              <div className="m-details">
                <button className="view-details-btn" onClick={(e) => openModal({ id, itemId, item }, e)}>
                  View Details & Reviews
                </button>
                <h3 className="m-name" onClick={() => navigate(`/product/${id}`)}>{item.name}</h3>
                <p className="m-sold">Sold: {item.sold} items</p>
              </div>
            </div>
          ))
        )}
      </div>

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
            color: "black",
          }}
        >
          <span className="close-btn" onClick={closeModal}>&times;</span>
          <AnalyseReview productId={selectedItemProductId} id={selectedItemId} onRatingClick={handleRatingClick} />
        </div>
      )}
    </div>
  );
};

export default ShoesTopTopic;
