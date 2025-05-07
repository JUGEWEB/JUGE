import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Popover, Select, Button } from "antd";
import "./saveToBasket.css";
import axios from "axios"

const BASKET_API = "https://api.malidag.com"; // Change this if your backend is running elsewhere
const CRYPTO_API = "https://api.malidag.com/crypto-prices"; // Your Crypto API

const coinImages = {
  ETH: "https://assets.coingecko.com/coins/images/279/large/ethereum.png?1595348880",
  USDC: "https://assets.coingecko.com/coins/images/6319/large/USD_Coin_icon.png?1547042389",
  BUSD: "https://assets.coingecko.com/coins/images/9576/large/BUSD.png?1568947766",
  SOL: "https://assets.coingecko.com/coins/images/4128/large/solana.png?1640133422",
  BNB: "https://assets.coingecko.com/coins/images/825/large/binance-coin-logo.png?1547034615",
  USDT: "https://assets.coingecko.com/coins/images/325/large/Tether-logo.png?1598003707",
  // You can add more if you want
};

const cryptoOptions = [
  { value: "ETH", label: "Ethereum", image: "https://assets.coingecko.com/coins/images/279/large/ethereum.png?1595348880" },
  { value: "BNB", label: "Binance Coin", image: "https://assets.coingecko.com/coins/images/825/large/binance-coin-logo.png?1547034615" },
  { value: "USDT", label: "Tether", image: "https://assets.coingecko.com/coins/images/325/large/Tether-logo.png?1598003707" },
  { value: "SOL", label: "Solana", image: "https://assets.coingecko.com/coins/images/4128/large/solana.png?1640133422" },
  { value: "USDC", label: "USD Coin", image: "https://assets.coingecko.com/coins/images/6319/large/USD_Coin_icon.png?1547042389" },
  { value: "BUSD", label: "Binance USD", image: "https://assets.coingecko.com/coins/images/9576/large/BUSD.png?1568947766" }
];

const AddToBasket = ({auth}) => {
  const [basket, setBasket] = useState([]);
  const [cryptoPrices, setCryptoPrices] = useState({});
  const [loading, setLoading] = useState(false); // For handling API loading states
  const navigate = useNavigate();
  const [selectedCrypto, setSelectedCrypto] = useState(cryptoOptions[2]); // Default: USDT
  const user = auth.currentUser;
 


  // Fetch user's basket when component mounts
  useEffect(() => {
    if (user) {
      fetchBasket();
    }
    fetchCryptoPrices();
  }, [user]);

  const fetchBasket = async () => {
    try {
      const response = await axios.get(`${BASKET_API}/basket/${user.uid}`);
      if (response.data.basket) {
        setBasket(response.data.basket);
      }
    } catch (error) {
      console.error("Error fetching basket:", error);
    }
  };

  // Remove item from basket using API
  const removeFromBasket = async (id) => {
    try {
      const response = await axios.delete(`${BASKET_API}/remove-from-basket/${user.uid}/${id}`);

      if (response.status === 200) {
        setBasket((prevBasket) => prevBasket.filter((item) => item.id !== id));
      }
    } catch (error) {
      console.error("Error removing item from basket:", error);
    }
  };

   // Update item quantity in the basket
   const updateQuantity = async (id, newQuantity) => {
    if (!user || newQuantity < 1) return; // Prevent quantity from being less than 1
    try {
      setLoading(true);
      const response = await axios.put(`${BASKET_API}/update-quantity/${user.uid}/${id}`, {
        quantity: newQuantity,
      });

      if (response.status === 200) {
        setBasket((prevBasket) =>
          prevBasket.map((item) =>
            item.id === id ? { ...item, quantity: newQuantity } : item
          )
        );
      }
    } catch (error) {
      console.error("Error updating quantity:", error);
    } finally {
      setLoading(false);
    }
  };

  const totalPrice = basket.reduce((sum, item) => sum + item.price * item.quantity, 0);
   // Fetch real-time crypto prices
   const fetchCryptoPrices = async () => {
    try {
      const response = await axios.get(CRYPTO_API);
      setCryptoPrices(response.data);
    } catch (error) {
      console.error("Error fetching crypto prices:", error);
    }
  };

   // Convert total price to selected cryptocurrency
   const selectedCryptoPrice = cryptoPrices[selectedCrypto.value] || 1; // Default 1 for USDT
   const totalPriceCrypto = totalPrice / selectedCryptoPrice;

    // Proceed to Checkout
  const handleCheckout = () => {
    const checkoutData = {
      isFromBasket: true, // New flag to indicate basket checkout
      items: basket.map(item => ({ id: item.id, quantity: item.quantity, itemId: item.itemId , color: item.color, size: item.size })),
      currency: selectedCrypto.value,
      totalPrice: totalPrice
    };

    navigate(`/checkout?itemId=false&basket=true`, { state: checkoutData });
  };

  return (
    <div className="basket-container" style={{display: "flex", justifyContent: "space-between", padding: "20px"}}>
      <div>
      <h2>🛒 Your Basket</h2>
      {basket.length === 0 ? (
        <p>Your basket is empty.</p>
      ) : (
        basket.map((item, index) => {
          if (!item) return null; // Ensure item exists

          const { id, name, price, image, quantity, color, size } = item;
          const slicedName = name.length > 20 ? name.slice(0, 20) + "..." : name;
          const imageUrl = image || "placeholder.jpg";

          return (
            <div key={index} className="basket-item">
              <div>
              {/* Item Image */}
              <div style={{display: "flex", alignItems: "center", justifyContent: "start"}}>
              <img src={imageUrl} alt={name} className="basket-item-image" />

              {/* Clickable Name */}
              <p
                className="basket-item-name"
                title={name}
                onClick={() => navigate(`/product/${id}`)}
              >
                {slicedName} - <div className="basket-Price" style={{color: "black", fontWeight: "bold", backgroundColor: "orange", width: "80px", borderRadius: "50px", display: "flex", justifyContent: "center", marginTop: "10px"}}>${price * quantity}</div>
              </p>
              <div>
              <Popover content="Delete Item" trigger="hover">
              <button className="remove-btn" onClick={() => removeFromBasket(id)}>🗑️</button>
              </Popover>
              </div>
              </div>
              {color !== null && (
              <p style={{color: "black", fontStyle: "italic"}}>Color: {color}</p>
            )}
            {size !== null && (
              <p style={{color: "black", fontStyle: "italic"}}>Size: {size} </p>
            )}
              </div>
               {/* Quantity Controls */}
               <div
                style={{
                  color: "black",
                  display: "flex",
                  width: "100%",
                  alignItems: "center",
                  justifyContent: "center",
                  marginTop: "10px",
                 
                }}
              >
                <div style={{ border: "2px solid #222",
                  borderRadius: "20px", display: "flex", alignItems: "center", justifyContent: "space-between", width: "100px", height: "30px"}}>
                <div
                  className="quantity-btn"
                  onClick={() => updateQuantity(id, quantity - 1)}
                  disabled={quantity <= 1 || loading}
                >
                  -
                </div>
                <span style={{ margin: "0 10px", fontSize: "18px" , fontWeight: "bold"}}>{quantity}</span>
                <div
                  className="quantity-btn"
                  onClick={() => updateQuantity(id, quantity + 1)}
                  disabled={loading}
                >
                  +
                </div>
                </div>
              </div>
             
            
            </div>
          );
        })
      )}
      </div>
      <div>
        <div>
      <h3 style={{color: "#222"}}>💳 Choose Payment Method</h3>
      <Select
        value={selectedCrypto.value}
        onChange={(value) => {
          const newSelection = cryptoOptions.find((crypto) => crypto.value === value);
          setSelectedCrypto(newSelection);
        }}
        style={{ width: 220 }}
        optionLabelProp="label"
        dropdownRender={(menu) => (
          <div>
            {menu}
          </div>
        )}
      >
        {cryptoOptions.map((crypto) => (
          <Select.Option key={crypto.value} value={crypto.value} label={crypto.label}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <img src={crypto.image} alt={crypto.label} style={{ width: 20, height: 20, marginRight: 8 }} />
              {crypto.label}
            </div>
          </Select.Option>
        ))}
      </Select>

      {/* Display selected option with image */}
      <div style={{ marginTop: "10px", display: "flex", alignItems: "center", fontSize: "16px", color: "#222" }}>
        <img src={selectedCrypto.image} alt={selectedCrypto.label} style={{ width: 25, height: 25, marginRight: 10 }} />
        <strong>{selectedCrypto.label}</strong>
      </div>
    </div>
    <div style={{ marginTop: "20px", fontSize: "18px", fontWeight: "bold", color: "#222" }}>
  🛍️ Total Price: <span style={{ color: "green" }}>${totalPrice.toFixed(2)}</span>
</div>

 {/* Converted Price in Selected Crypto */}
 <div style={{ marginTop: "10px", fontSize: "16px", color: "#444" }}>
          ≈ {totalPriceCrypto.toFixed(6)} {selectedCrypto.value}
        </div>
        <Button type="primary" onClick={handleCheckout} style={{ marginTop: "20px" }}>
        Proceed to Checkout
      </Button>
    </div>
    </div>
  );
};

export default AddToBasket;