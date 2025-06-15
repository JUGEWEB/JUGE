// InputSearch.js
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios"; // Don't forget to import axios
import { FaSearch } from "react-icons/fa"; // ✅ Import the real search icon
import useScreenSize from "./useIsMobile";

function InputSearch({ isBasketVisible, basketItems, user }) {
  const [filteredItems, setFilteredItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [isFocused, setIsFocused] = useState(false);
  const [items, setItems] = useState([]);
  const {isMobile, isDesktop, isTablet, isSmallMobile, isVerySmall, isVeryVerySmall} = useScreenSize()


  const navigate = useNavigate();
  const location = useLocation();

  const handleSearch = (searchTerm) => {
  const userId = user?.uid || "guest" ; // fallback to 'guest' if user is not logged in

  // 🚫 Skip API call if searchTerm is empty
  if (!searchTerm.trim()) return;

  const searchEntry = {
    userId,
    userSearch: searchTerm,
  };

  console.log("Sending to backend:", searchEntry); // 🔍 debugging

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
      const nameMatch = item.item.name?.toLowerCase().includes(lowerTerm);
      const typeMatch = item.item.type?.toLowerCase().includes(lowerTerm);
      const genderMatch = item.item.gender?.toLowerCase().includes(lowerTerm);
      return nameMatch || typeMatch || genderMatch;
    });

    const validSuggestions = matches.flatMap((item) => {
      const category = item.category?.toLowerCase();
      const type = item.item.type?.trim();
      const gender = item.item.gender?.trim();

      if (!type) return [];

      // For clothing, shoes, bags: gender + type
      if (["clothing", "shoes", "bags"].includes(category)) {
        if (gender) {
          return [{
            value: `${gender} ${type}`,
            type: "combined"
          }];
        }
        return [{
          value: type,
          type: "type"
        }];
      }

      // For electronic, home: just type
      if (["electronic", "home"].includes(category)) {
        return [{
          value: type,
          type: "type"
        }];
      }

      return [];
    });

    // Deduplicate suggestions by value and limit to 5
    const uniqueSuggestions = Array.from(
      new Map(validSuggestions.map((s) => [s.value.toLowerCase(), s])).values()
    );

    setSuggestions(uniqueSuggestions.slice(0, 5));
  } else {
    setSuggestions([]);
  }
};


  useEffect(() => {
    updateSuggestions(searchTerm);
  }, [searchTerm, items]);

  return (
    <div   style={{
    display: "flex",
    alignItems: "center",
    position: "relative",
    width: isVeryVerySmall || isVerySmall ? "95%" : isSmallMobile ? "90%" : isMobile ? "85%" : "100%",
    margin: "0 auto",
    padding: "10px",
    boxSizing: "border-box",
  }}>

<div style={{ display: "flex", alignItems: "center", width: "100%", backgroundColor: "white", border: `2px solid ${isFocused ? "#0078ff" : "white"}`,  borderRadius: "5px 5px 5px 5px", overflow: "hidden" }}>
  
  <input
    type="text"
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
    onFocus={() => setIsFocused(true)}
    onBlur={() => setTimeout(() => setIsFocused(false), 200)}
    placeholder="Search by name, ID, or category"
    onKeyDown={(e) => {
    if (e.key === "Enter" && searchTerm.trim()) {
      handleSearch(searchTerm);
      setIsFocused(false);
    }
  }}
    style={{
      flex: 1, 
      height: "45px",
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
      height: "45px",
      padding: "0 15px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      cursor: "pointer",
      backgroundColor: "orange",
      borderLeft: "1px solid #ddd",
    }}
  >
    <FaSearch style={{ fontSize: "15px", color: "#333" }} />
  </div>

</div>


      {suggestions.length > 0 && isFocused && (
       <div
  style={{
    position: "absolute",
    top: "45px",
    left: 0,
    width: "100%",
    backgroundColor: "#fff",
    border: "1px solid #ccc",
    borderRadius: "5px",
    boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
    color: "black",
    zIndex: 1000,
    maxHeight: "200px",
    overflowY: "auto",
    fontSize: isVeryVerySmall || isVerySmall ? "12px" : "14px",
  }}
>

          {suggestions.map((suggestion, index) => (
            <div
              key={index}
              onClick={() => {
                setSearchTerm(suggestion.value);
                setSuggestions([]);
                setIsFocused(false);
                handleSearch(suggestion.value); // 🔍 Trigger search immediately
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
