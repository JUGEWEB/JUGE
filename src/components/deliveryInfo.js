import React, { useState, useEffect } from "react";
import { notification } from 'antd';

import axios from "axios";
import "./deliveryInfo.css";
import BuyNow from "./buyNow";

const API_BASE_URL = "http://192.168.0.210:5200"; // Change if your backend URL is different

const DeliveryInfo = ({ user, auth, selectedIndex, setSelectedIndex }) => {
  const [deliveryAddresses, setDeliveryAddresses] = useState([]);
  const [iduser, setIdUser] = useState(null);
  const [formData, setFormData] = useState({
    email: "",
    fullName: "",
    streetName: "",
    companyName: "",
    town: "",
    country: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false); // Toggle form visibility

  // Fetch existing delivery addresses
  useEffect(() => {
    const useridi = auth.currentUser; // Get the current user from Firebase Authentication
    if (!useridi) return;

    const fetchAddresses = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/user/delivery/${useridi.uid}`);
        setDeliveryAddresses(response.data.deliveryAddresses || []);
      } catch (err) {
        console.error("Error fetching delivery data:", err);
        setError("Could not load delivery information.");
      }
    };

    setIdUser(useridi.uid);
    fetchAddresses();
    // Check if there is a saved selectedIndex in localStorage
    const savedIndex = localStorage.getItem("selectedIndex");
    if (savedIndex !== null) {
      setSelectedIndex(Number(savedIndex)); // Set the selectedIndex from localStorage
    }
  }, [user]);

  // Handle form input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await axios.post(`${API_BASE_URL}/user/delivery`, {
        userId: iduser,
        ...formData,
      });

      // Ensure all addresses are updated after submission
      setDeliveryAddresses([...deliveryAddresses, response.data.data]);
      setFormData({ email: "", fullName: "", streetName: "", companyName: "", town: "", country: "" });
      setShowForm(false); // Hide form after submission

      // Show success notification
    notification.success({
        message: 'Delivery Address Added Successfully',
        description: 'Your delivery address has been saved.',
      });
  
      // Reload the page after successful form submission
      window.location.reload();

    } catch (err) {
      console.error("Error adding delivery information:", err);
      setError("Failed to save delivery address.");
    } finally {
      setLoading(false);
    }
  };

  // Handle selecting an address
  const handleSelectAddress = (index) => {
    setSelectedIndex(index);
    localStorage.setItem("selectedIndex", index); // Save selected index to localStorage
  };

  // Handle deleting an address
  const handleDeleteAddress = async (index) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/user/delivery/${iduser}/${index}`);
      
      // Remove the address from the state
      const updatedAddresses = deliveryAddresses.filter((_, idx) => idx !== index);
      setDeliveryAddresses(updatedAddresses);

      // If the selected address was deleted, reset the selected index
      if (selectedIndex === index) {
        setSelectedIndex(null);
        localStorage.removeItem("selectedIndex");
      }

      notification.success({
        message: 'Delivery Address removed Successfully',
        description: 'Your delivery address has been removed.',
      });
  
      // Reload the page after successful form submission
      window.location.reload();

    } catch (err) {
      console.error("Error deleting address:", err);
      setError("Failed to delete delivery address.");
    }
  };

  return (
    <div className="delivery-info-container">
      <h2>Delivery Information</h2>

      {/* 📌 Display Existing Addresses or Form for New Address */}
      <div className="saved-addresses" style={{ color: "black", fontStyle: "italic" }}>
        {deliveryAddresses.length > 0 ? (
          <>
            <h3>Saved Addresses</h3>
            {error && <p className="error-message">{error}</p>}
            <ul>
              {deliveryAddresses.map((address, index) => (
                <li key={index} className={selectedIndex === index ? "selected" : ""}>
                  <h4>Address {index + 1}</h4>
                  <p><strong>Name:</strong> {address.fullName}</p>
                  <p><strong>Email:</strong> {address.email}</p>
                  <p><strong>Street:</strong> {address.streetName}</p>
                  <p><strong>Company:</strong> {address.companyName || "N/A"}</p>
                  <p><strong>Town:</strong> {address.town}</p>
                  <p><strong>Country:</strong> {address.country}</p>

                  {/* 📌 Select Address Button */}
                  <button onClick={() => handleSelectAddress(index)} className="select-address-btn">
                    {selectedIndex === index ? "Selected ✅" : "Select"}
                  </button>

                  {/* 📌 Delete Address Button */}
                  <button onClick={() => handleDeleteAddress(index)} className="delete-address-btn">
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          </>
        ) : (
          <div>
            <h3>Please fill in your delivery information:</h3>
            <p>You don't have any saved delivery addresses yet. Please fill out the form below.</p>
          </div>
        )}
      </div>

      {/* 📌 Form for adding new address */}
      {deliveryAddresses.length === 0 || showForm ? (
        <form onSubmit={handleSubmit} className="space-y-3">
          <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" required />
          <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} placeholder="Full Name" required />
          <input type="text" name="streetName" value={formData.streetName} onChange={handleChange} placeholder="Street Name" required />
          <input type="text" name="companyName" value={formData.companyName} onChange={handleChange} placeholder="Company Name (Optional)" />
          <input type="text" name="town" value={formData.town} onChange={handleChange} placeholder="Town" required />
          <input type="text" name="country" value={formData.country} onChange={handleChange} placeholder="Country" required />

          <button type="submit" disabled={loading}>
            {loading ? <div className="loader"></div> : "Save Delivery Address"}
          </button>
        </form>
      ) : (
        <button onClick={() => setShowForm(true)} className="add-new-address-btn">
          Add New Delivery Address
        </button>
      )}

      {/* 📌 Display Selected Address */}
      {selectedIndex !== null && deliveryAddresses[selectedIndex] && (
        <div className="selected-address">
          <h3>Selected Address for Purchase</h3>
          <p><strong>Name:</strong> {deliveryAddresses[selectedIndex].fullName}</p>
          <p><strong>Email:</strong> {deliveryAddresses[selectedIndex].email}</p>
          <p><strong>Street:</strong> {deliveryAddresses[selectedIndex].streetName}</p>
          <p><strong>Company:</strong> {deliveryAddresses[selectedIndex].companyName || "N/A"}</p>
          <p><strong>Town:</strong> {deliveryAddresses[selectedIndex].town}</p>
          <p><strong>Country:</strong> {deliveryAddresses[selectedIndex].country}</p>
        </div>
      )}
    </div>
  );
};

export default DeliveryInfo;
