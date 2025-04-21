// InputSearch.js
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios"; // Don't forget to import axios
import { FaSearch } from "react-icons/fa"; // ✅ Import the real search icon

function InputSearch({ isBasketVisible, basketItems, user }) {
  const [filteredItems, setFilteredItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [isFocused, setIsFocused] = useState(false);
  const [items, setItems] = useState([]);

  const navigate = useNavigate();
  const location = useLocation();

  const handleSearch = (searchTerm) => {
    const userId = user?.uid || "guest";

    const searchEntry = {
      userId: userId,
      userSearch: searchTerm,
    };

    axios
      .post("https://api.malidag.com/search-item", searchEntry)
      .then(() => console.log("Search saved successfully"))
      .catch((error) => console.error("Error saving search:", error));

    navigate(`/item/${searchTerm}`);
  };

  const fetchItems = async () => {
    try {
      const response = await axios.get("https://api.malidag.com/items");
      setItems(response.data.items || []);
    } catch (error) {
      console.error("Error fetching items:", error);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  useEffect(() => {
    const filtered = items.filter((item) => {
      const matchesCategory = !selectedCategory || item.category === selectedCategory;
      const matchesSearchTerm =
        item.item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.id.toString().includes(searchTerm) ||
        item.category.toLowerCase().includes(searchTerm.toLowerCase());

      return matchesCategory && matchesSearchTerm;
    });
    setFilteredItems(filtered);
  }, [selectedCategory, searchTerm, items]);

  const updateSuggestions = (term) => {
    const lowerTerm = term.toLowerCase();
    let matches = [];

    if (lowerTerm) {
      matches = items.filter((item) => {
        return (
          (item.item.name && item.item.name.toLowerCase().includes(lowerTerm)) ||
          (item.item.type && typeof item.item.type === "string" && item.item.type.toLowerCase().includes(lowerTerm)) ||
          (item.category && typeof item.category === "string" && item.category.toLowerCase().includes(lowerTerm)) ||
          (item.item.theme && typeof item.item.theme === "string" && item.item.theme.toLowerCase().includes(lowerTerm)) ||
          (item.item.productDetail02 && typeof item.item.productDetail02 === "string" && item.item.productDetail02.toLowerCase().includes(lowerTerm))
        );
      });

      const flattenedMatches = matches.flatMap((item) => [
        ...(item.item.name?.toLowerCase().includes(lowerTerm)
          ? [{ value: item.item.name, type: "name" }]
          : []),
        ...(item.item.type?.toLowerCase().includes(lowerTerm)
          ? [{ value: item.item.type, type: "type" }]
          : []),
        ...(item.category?.toLowerCase().includes(lowerTerm)
          ? [{ value: item.category, type: "category" }]
          : []),
        ...(item.item.theme?.toLowerCase().includes(lowerTerm)
          ? [{ value: item.item.theme, type: "theme" }]
          : []),
        ...(item.item.productDetail02?.toLowerCase().includes(lowerTerm)
          ? [{ value: item.item.productDetail02, type: "productDetail02" }]
          : []),
      ]);

      setSuggestions(flattenedMatches.slice(0, 5));
    } else {
      setSuggestions([]);
    }
  };

  useEffect(() => {
    updateSuggestions(searchTerm);
  }, [searchTerm, items]);

  return (
    <div className="input-search-wrapper" style={{ display: "flex", alignItems: "center", position: "relative", marginLeft: "10px", marginRight: "10px"}}>

<div style={{ display: "flex", alignItems: "center", width: "100%", backgroundColor: "white", border: `2px solid ${isFocused ? "#0078ff" : "white"}`,  borderRadius: "0 5px 5px 0", overflow: "hidden" }}>
  
  <input
    type="text"
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
    onFocus={() => setIsFocused(true)}
    onBlur={() => setTimeout(() => setIsFocused(false), 200)}
    placeholder="Search by name, ID, or category"
    style={{
      flex: 1, 
      height: "35px",
      padding: "0 10px",
      border: "none",
      fontSize: "16px",
      outline: "none",
    }}
  />
  
  <div
    onClick={() => {
      if (searchTerm) {
        handleSearch(searchTerm);
      }
      setIsFocused(false);
    }}
    style={{
      height: "35px",
      padding: "0 15px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      cursor: "pointer",
      backgroundColor: "white",
      borderLeft: "1px solid #ddd",
    }}
  >
    <FaSearch style={{ fontSize: "10px", color: "#333" }} />
  </div>

</div>


      {suggestions.length > 0 && isFocused && (
        <div
          style={{
            position: "absolute",
            top: "55px",
            left: "5px",
            width: "calc(100% - 10px)",
            backgroundColor: "#fff",
            border: "1px solid #ccc",
            borderRadius: "5px",
            boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
            color: "black",
            zIndex: 1000,
            maxHeight: "200px",
            overflowY: "auto",
          }}
        >
          {suggestions.map((suggestion, index) => (
            <div
              key={index}
              onClick={() => {
                setSearchTerm(suggestion.value);
                setSuggestions([]);
                setIsFocused(false);
              }}
              style={{
                padding: "10px",
                cursor: "pointer",
                backgroundColor: index % 2 === 0 ? "#f9f9f9" : "#fff",
                borderBottom: "1px solid #eee",
              }}
            >
              <span style={{ marginRight: "8px" }}>🔍</span>
              {suggestion.value}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default InputSearch;
