import React, {useEffect, useState} from "react";
import { useLocation } from "react-router-dom"; // ✅ Import useLocation
import axios from "axios";
import All from "./All";
import Type from "./type";
import Coin from "./coin";

const BASE_URL = "https://api.malidag.com"; // Your API URL http://192.168.0.109:3010

const NavMenu = ({basketItems}) => {
    const [beautyTypes, setBeautyTypes] = useState(new Set()); // Store Beauty category types
    const [isBasketVisible, setIsBasketVisible] = useState(false);
    const location = useLocation(); // ✅ Get the current URL path

     // Using useEffect to track location changes
   useEffect(() => {
    // Check if we're on the product or checkout page
    if (location.pathname.includes('product/')) {
      setIsBasketVisible(true); // Show the basket if on product or checkout page
    } else {
      setIsBasketVisible(false); // Hide the basket otherwise
    }
  }, [location]); // Dependency array to re-run the effect on location change
  
    useEffect(() => {
      const fetchBeautyTypes = async () => {
        try {
          const response = await axios.get(`${BASE_URL}/items`);
          const items = response.data.items;
  
          const typesSet = new Set();
          items.forEach((item) => {
            if (item.category === "Beauty" && item.item?.type) {
              typesSet.add(item.item.type.toLowerCase()); // ✅ Convert to lowercase
            }
          });
          console.log("Beauty Types:", typesSet); // Debugging log
  
          setBeautyTypes(typesSet); // ✅ Update state correctly
        } catch (error) {
          console.error("Error fetching items:", error);
        }
      };
  
      fetchBeautyTypes();
    }, []);
    console.log("Current Path:", location.pathname);
  const isCheckoutPage = location.pathname === "/checkout"; // ✅ Check if we are on the checkout page
  const isItemsOfWomenPage = location.pathname.includes("itemsOfWomen"); // ✅ Check if we are on 'itemsOfWomen' page
  const pathParts = location.pathname.split("/");
  const isItemTypeRoute = pathParts.length === 3 && pathParts[1] === "items";
  const itemType = pathParts[2];

 // ✅ Hide NavMenu if on checkout page, 'itemsOfWomen' page, or Beauty category
if (isCheckoutPage || isItemsOfWomenPage || (isItemTypeRoute && beautyTypes.has(itemType))) {
  return null;
}
 
  return (
    <div className="headtx" style={{  display: "flex", alignItems: "center", gap: "0px", background: "#333", marginTop: "-5px",  marginRight: isBasketVisible && basketItems.length > 0 ? "150px" : "0", }}>
      <All />
      <Type />
      <Coin />
    </div>
  );
};

export default NavMenu;
