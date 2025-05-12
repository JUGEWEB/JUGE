import React, { useState, useEffect, useRef } from "react";
import { message, Button } from "antd"; // Ant Design for notifications
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios"
import {ethers} from "ethers"
import { useBalance,  useReadContracts  } from "wagmi";
import { formatUnits, parseAbi } from "viem";
import "./buyNow.css"; // Import styles

const walletLogos = {
  metamask: "https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg",
  walletconnect: "https://seeklogo.com/images/W/walletconnect-logo-EE83B50C97-seeklogo.com.png",
  coinbase: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Coinbase_Navy_Logo.svg/1024px-Coinbase_Navy_Logo.svg.png",
  safe: "https://upload.wikimedia.org/wikipedia/commons/8/80/Gnosis_Safe_Logo.png",
};


// 🏦 ERC-20 Token and Native Token Addresses by Chain ID
const tokenAddresses = {
  1: { // Ethereum Mainnet
    ETH: { address: null, symbol: "ETH" }, // Native ETH (No address needed)
    BNB: { address: "0xB8c77482e45F1F44dE1745F52C74426C631bDD52", symbol: "BNB" },
    USDC: { address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48", symbol: "USDC" },
    USDT: { address: "0xdAC17F958D2ee523a2206206994597C13D831ec7", symbol: "USDT" },
  },
  56: { // Binance Smart Chain
    BNB: { address: null, symbol: "BNB" }, // Native BNB (No address needed)
    ETH: { address: "0x2170Ed0880ac9A755fd29B2688956BD959F933F8", symbol: "ETH" },
    USDT: { address: "0x55d398326f99059fF775485246999027B3197955", symbol: "USDT" },
    BUSD: { address: "0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56", symbol: "BUSD" },
    USDC: { address: "0x8965349fb649A33a30cbFDa057D8eC2C48AbE2A2", symbol: "USDC" },
  },
  97: { // Binance Smart Chain Testnet
    BNB: { address: null, symbol: "BNB" }, // Native BNB
    USDC: { address: "0x64544969ed7EBf5f083679233325356EbE738930", symbol: "USDC" },
    USDT: { address: "0x337610d27c682E347C9cD60BD4b3b107C9d34dDd", symbol: "USDT" },
    BUSD: { address: "0xeD24FC36d5Ee211Ea25A80239Fb8C4Cfd80f12Ee", symbol: "BUSD" },
  },
  137: { // Polygon
    MATIC: { address: null, symbol: "MATIC" }, // Native MATIC (No address needed)
    USDT: { address: "0x3813e82e6f7098b9583FC0F33a962D02018B6803", symbol: "USDT" },
    BNB: { address: "0x3BA4c387f786bFEE076A58914F5Bd38d668B42c3", symbol: "BNB" },
    ETH: { address: "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619", symbol: "ETH" },
  },
};


 // Mapping of symbols to logo URLs
 const logoUrls = {
  ETH: "https://assets.coingecko.com/coins/images/279/large/ethereum.png?1595348880",
  USDC: "https://assets.coingecko.com/coins/images/6319/large/USD_Coin_icon.png?1547042389",
  BUSD: "https://assets.coingecko.com/coins/images/9576/large/BUSD.png?1568947766",
  SOL: "https://assets.coingecko.com/coins/images/4128/large/solana.png?1640133422",
  BNB: "https://assets.coingecko.com/coins/images/825/large/binance-coin-logo.png?1547034615",
  USDT: "https://assets.coingecko.com/coins/images/325/large/Tether-logo.png?1598003707",
};



const BuyNow = ({ basketItems, userAddresses, user, connectors, connect, address, disconnect, isConnected, pendingConnector, allCountries, country, auth, chainId, selectedIndex }) => {
    const [item, setItem] = useState(null);
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [trustInfoVisible, setTrustInfoVisible] = useState(true);
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const initialQuantity = parseInt(queryParams.get("quantity")) || 1;
    const [quantity, setQuantity] = useState(initialQuantity);
    const selectedColor = queryParams.get("selectedColor")
    const selectedSize = queryParams.get("selectedSize")
    const itemId = queryParams.get("itemId"); // Get the item ID
    const basket = queryParams.get("basket"); // Get the item ID
    const erc20Abi = parseAbi(["function balanceOf(address) view returns (uint256)"]);
    const id = itemId
    const [nativeBalance, setNativeBalance] = useState(null);
    const [cryptoPrices, setCryptoPrices] = useState({});
    const [tokenBalances, setTokenBalances] = useState([]);
    const [crypto24hPercentageChanges, setCrypto24hPercentageChanges] = useState({});
    const [estimatedGas, setEstimatedGas] = useState(null);
    const [gasFee, setGasFee] = useState(null);
    const [error, setError] = useState(null);
    const [tokenAmount, setTokenAmount] = useState(Number(queryParams.get("tokenAmount")) || null);
    const [deliveryInformation, setDeliveryInformation] = useState(null)
    const [selectedCurrency, setSelectedCurrency] = useState(null); // or initial selected currency
    const checkoutData = location.state || {}; // Get passed data from AddToBasket
    const [payItem, setPayItem] = useState(null)
    const [color, setColor] = useState(null);
    const [size, setSize] = useState(null);
    const [checkLoading, setCheckLoading] = useState(false)

    const navigate = useNavigate()

    const isCheckoutPage = location.pathname === "/checkout";

    useEffect(() => {
      const fetchCryptoData = async () => {
        try {
          const pricesResponse = await axios.get("https://api.malidag.com/crypto-prices");
    
          setCryptoPrices(pricesResponse.data);
        } catch (error) {
          console.error("Error fetching crypto data:", error);
        }
      };
    
      fetchCryptoData();
      const interval = setInterval(fetchCryptoData, 10000); // Fetch every 10 seconds
    
      return () => clearInterval(interval); // Cleanup on unmount
    }, []);

    useEffect(() => {
      const fetchItem = async () => {
        if (id === "false" && basket === "true") {
          // If there's no ID but a basket exists, set product from basket
          setProduct(checkoutData); // Assuming `checkoutData` contains the basket items
          setPayItem(checkoutData);
          setItem(null); // No single item to set
          setLoading(false);
          return;
        }
    
        if (!id) return; // Stop execution if no id and no basket
    
        // If there's an id and basket is false, proceed to fetch the item from the server
        try {
          // Fetch all items from the server
          const response = await axios.get(`https://api.malidag.com/items`);
    
          // Ensure response contains the 'items' array
          if (response.data && response.data.items) {
            // Find the item with the matching ID
            const foundItem = response.data.items.find(item => String(item.id) === String(id));
    
            if (foundItem) {
              setItem(foundItem.item);
              setProduct(foundItem.item);
              setPayItem(foundItem.itemId)
            } else {
              console.warn("Item not found for ID:", id);
              setItem(null); // Set item to null if not found
            }
          } else {
            console.warn("Response doesn't contain items:", response.data);
            setItem(null); // Handle case when 'items' is missing in the response
          }
        } catch (error) {
          console.error("Error fetching item:", error);
          setItem(null); // Set item to null on error
        } finally {
          setLoading(false); // Stop loading state
        }
      };
    
      fetchItem();
    }, [id, basket, checkoutData]); // Dependency array includes basket & checkoutData
    


// Define native tokens by chain
const nativeTokens = {
  1: "ETH",  // Ethereum Mainnet
  56: "BNB", // Binance Smart Chain
  97: "BNB",
  137: "MATIC", // Polygon
};

console.log("Item ID:", itemId); // Debugging
const tokenDecimals = {
  USDT: chainId === 56 ? 18 : 6,  // 🔥 USDT has 18 decimals on BSC, 6 on ETH
  USDC: 6,  
  BNB: 18,
  ETH: 18,
  BUSD: 18,
};

const fetchNativeBalance = async (address, chainId) => {
  try {
    const response = await fetch(`https://api.malidag.com/balance?address=${address}&chainId=${chainId}`);
    const data = await response.json();
    return data.balance; // Native balance in ether/BNB
  } catch (error) {
    console.error("Error fetching native balance:", error);
    return null;
  }
};

const fetchTokenBalance = async (address, tokenAddress, chainId) => {
  try {
    const response = await fetch(`https://api.malidag.com/token-balance?address=${address}&tokenAddress=${tokenAddress}&chainId=${chainId}`);
    const data = await response.json();
    return data.balance; // Token balance formatted
  } catch (error) {
    console.error("Error fetching token balance:", error);
    return null;
  }
};

 // Fetch native balance (ETH/BNB/MATIC)
 useEffect(() => {
  const fetchBalances = async () => {
    const nativeBal = await fetchNativeBalance(address, chainId);
    setNativeBalance({ formatted: nativeBal, symbol: chainId === nativeTokens[chainId] });
  };

  if (address && chainId) {
    fetchBalances();
  }
}, [address, chainId]);

// Fetch ERC-20 token balances
useEffect(() => {
  const fetchAllTokenBalances = async () => {
    const balances = await Promise.all(
      Object.keys(tokenAddresses[chainId]).map(async (symbol) => {
        const tokenData = tokenAddresses[chainId][symbol];

        // Skip native tokens and handle them separately
        if (tokenData.address === null) {
          return { symbol, balance: nativeBalance ? nativeBalance.formatted : '0' };
        }

        // Fetch ERC-20 token balances using the token address
        const balance = await fetchTokenBalance(address, tokenData.address, chainId);
        return { symbol, balance };
      })
    );
    setTokenBalances(balances);
  };

  if (address && chainId) {
    fetchAllTokenBalances();
  }
}, [address, chainId, tokenAddresses, nativeBalance]);


useEffect(() => {
  const checkUserDeliveryInfo = async (userId) => {
    try {
      const response = await fetch(`https://api.malidag.com/user/delivery-get/${userId}`);
      if (response.ok) {
        const data = await response.json();
        setDeliveryInformation(data.deliveryAddresses);
      } else {
        const errorData = await response.json();
        if (errorData.error === "No delivery information found for this user") {
          alert("No delivery information found. Please add your delivery information.");
        }
      }
    } catch (error) {
      console.error("Error checking user delivery information:", error);
      alert("Failed to check delivery information.");
    }
  };

  const userId = auth.currentUser; // Get the current user from Firebase Authentication

  if (userId) {
    checkUserDeliveryInfo(userId.uid); // Add the actual user ID
  }
}, [user]); // Re-run when user info changes

const convertUsdToCrypto = (usdAmount, cryptoSymbol) => {
  const price = cryptoPrices[cryptoSymbol]; // Get USD price of the crypto
  return price ? (usdAmount / price).toFixed(6) : 0; // Convert USD to crypto amount
};


useEffect(() => {
  if (id === "false" && basket === "true") {
    // Ensure checkoutData and items exist before accessing them
    if (checkoutData?.items?.length > 0) {
      const totalUsdPrice = parseFloat(checkoutData.totalPrice || 0).toFixed(2);

      setSelectedCurrency(checkoutData.currency || "USD"); // Fallback to USD if null
      setTokenAmount(totalUsdPrice); // Set token amount from basket
    }
  } else if (id && basket === "false") {
    // Ensure product exists before accessing usdPrice
    if (product) {
      const tokenAmountRaw = (product.usdPrice || 0) * quantity;
      setSelectedCurrency(product.cryptocurrency || "USD"); // Default to USD
      setTokenAmount(tokenAmountRaw);
    } else {
      console.warn("Product is null or undefined, cannot calculate token amount.");
    }
  }
}, [product, quantity, chainId, cryptoPrices, checkoutData, basket]);

const estimateGas = async () => {
  setError(null);

  try {
    if (!selectedCurrency || !tokenAmount || tokenAmount <= 0) {
      setError("Invalid token or amount.");
      return;
    }

    const txData = {
      chainId: Number(chainId),
      from: address,
      to: "0xC702A2E4848466346c7cA61Ef5CC77C0cCBA2261",
      value: tokenAmount, // ✅ Send only USD value
      currency: selectedCurrency,
    };

    // Fetch gas estimate
    const response = await axios.post("https://api.malidag.com/estimate-gas", txData);

    if (response.data.estimatedGas) {
      const gasLimitWithBuffer = Math.ceil(response.data.estimatedGas * 1.2);
      setEstimatedGas(gasLimitWithBuffer);
      setGasFee(response.data.gasFee);
    } else {
      throw new Error("Gas estimation failed.");
    }
  } catch (err) {
    console.error("❌ Gas Estimation Error:", err);
    setError(err.response?.data?.error || "Error estimating gas.");
  }
};

useEffect(() => {

  if (tokenAmount && selectedCurrency && address) {
    estimateGas();
  }
}, [tokenAmount, selectedCurrency, chainId, address]);


const handleBuyNow = async () => {
  if (!selectedDeliveryInfo || Object.keys(selectedDeliveryInfo).length === 0) {
    message.error("Please fill up your delivery information before purchasing.");
    return;
  }

  if (!isConnected || !address) {
    message.error("Please connect your wallet before purchasing.");
    return;
  }

  if (!payItem) {
    message.error("Invalid product details. Please try again.");
    return;
  }

  const tokenSymbol = selectedCurrency;
  const requiredCryptoAmount = convertUsdToCrypto(tokenAmount, tokenSymbol);

  // 🛍 Build items payload
  let items = [];

  if (basket === "true" && Array.isArray(checkoutData?.items)) {
    items = checkoutData.items.map((item) => ({
      itemId: item.itemId,
      quantity: item.quantity || 1,
      color: item.color || "noColor",
      size: item.size || "nosize"
    }));
  } else {
    // Single item
    const newSize = selectedSize && selectedSize !== "null" ? selectedSize : "nosize";
    const newColor = selectedColor && selectedColor !== "null" ? selectedColor : "noColor";

    items = [
      {
        itemId: payItem,
        quantity: quantity || 1,
        size: newSize,
        color: newColor
      }
    ];
  }

  if (isInsufficientBalance(tokenAmount, tokenSymbol)) {
    message.error(`Insufficient ${tokenSymbol} balance.`);
    return;
  }

  try {
    message.loading("Processing transaction...", 0);

    const response = await axios.post("https://api.malidag.com/api/transaction", {
      chainId,
      recipient: "0x40c61A01639BA0d675509878d58864B9C9F65fbf",
      amount: requiredCryptoAmount,
      fullName: selectedDeliveryInfo.fullName,
      email: selectedDeliveryInfo.email,
      userAddress: address,
      streetAddress: selectedDeliveryInfo.streetName,
      companyName: selectedDeliveryInfo.companyName,
      country: selectedDeliveryInfo.country,
      town: selectedDeliveryInfo.town,
      cryptoSymbol: tokenSymbol,
      tokenAddress: tokenAddresses[chainId]?.[tokenSymbol]?.address || null,
      items // ✅ Now an array of item(s)
    });

    message.destroy();

    if (response.data.success) {
      message.success("Payment successful!");
    } else {
      message.error("Transaction failed. Please try again.");
    }
  } catch (error) {
    console.error("Transaction failed:", error);
    message.error("Transaction failed. Please try again.");
  }
};



   // 🏷 Extract First Name from Firebase
   const getFirstName = () => {
    if (user?.displayName) {
      return user.displayName.split(" ")[0]; // Get first word of displayName
    } else if (user?.email) {
      return user.email.split("@")[0]; // Use email prefix if no displayName
    } else {
      return "there"; // Default fallback
    }
  };

  const firstName = getFirstName();

  const isInsufficientBalance = (usdPrice, selectedCrypto) => {
    const cryptoToCheck = selectedCrypto;

    // Conditionally handle usdPrice when checkoutData exists
    const priceToUse = usdPrice;

    // Ensure we are passing a valid value for conversion
    const requiredCryptoAmount = convertUsdToCrypto(priceToUse, cryptoToCheck);

    const nativeToken = nativeTokens[chainId];
    const margin = 0.00000001; 

    if (cryptoToCheck === nativeToken) {
        return parseFloat(Number(nativeBalance?.formatted || "0").toFixed(8)) + margin < parseFloat(requiredCryptoAmount);
    }
    
    const userToken = tokenBalances.find(token => token.symbol === cryptoToCheck);
    const userBalance = userToken ? parseFloat(Number(userToken.balance).toFixed(6)) : 0;
    return userBalance + margin < parseFloat(requiredCryptoAmount);
};


  

  const handleQuantityChange = (amount) => {
    setQuantity(prev => Math.max(1, prev + amount));
  };

  const getConnectedWallet = () => {
    if (connectors) {
      if (connectors.find(conn => conn.id === "metaMaskSDK")) return { name: "MetaMask", logo: walletLogos.metamask };
      if (connectors.find(conn => conn.id === "walletConnect")) return { name: "WalletConnect", logo: walletLogos.walletconnect };
      if (connectors.find(conn => conn.id === "coinbaseWalletSDK")) return { name: "Coinbase Wallet", logo: walletLogos.coinbase };
      if (connectors.find(conn => conn.id === "safe")) return { name: "Safe", logo: walletLogos.safe };
    }
    return null;
  };

  const connectedWallet = getConnectedWallet();
  
  // Filter or select delivery information based on selectedIndex
  const selectedDeliveryInfo = selectedIndex >= 0 && deliveryInformation?.length > 0 ? deliveryInformation[selectedIndex] : null;
  
  

  const backToProduct = () => {
    navigate(`/product/${id}`)
  }
  
  return (
    <div>
    {selectedDeliveryInfo && (
  <div 
    style={{
      backgroundColor: "#d4edda", 
      color: "#155724", 
      padding: "20px", 
      borderRadius: "8px", 
      fontSize: "16px", 
      fontWeight: "500", 
      maxWidth: "600px", 
      margin: "20px auto", 
      textAlign: "center",
      border: "1px solid #c3e6cb"
    }}
  >
    We will send an email to  
    <span 
      style={{
        fontWeight: "bold", 
        color: "#007bff",
        marginLeft: "5px",
        marginRight: "5px"
      }}
    >
      {selectedDeliveryInfo?.email}
    </span> 
    after a successful transaction. Please check your inbox or your spam after your purchase. Thank you!
  </div>
)}


    <div style={{display: "flex", justifyContent: "space-between"}}>
    <div className="buy-now-container">
      <h2>👋 Hey {firstName}, ready to shop?</h2>
      {/* Delivery Information */}
      <div className="section">
        <h3>📦 Delivery Information</h3>
        {selectedDeliveryInfo ? (
          <div>
  <div>
    <p>{selectedDeliveryInfo.fullName}</p>
    <p>{selectedDeliveryInfo.streetName}</p>
    <p>{selectedDeliveryInfo.companyName}</p>
    <p>{selectedDeliveryInfo.email}</p>
    <p>{selectedDeliveryInfo.town}</p>
    <p>{selectedDeliveryInfo.country}</p>
  </div>
   <Link to="/deliveryInformation">modify your delivery information</Link>
   </div>
          ) : (

          <div>
          <p className="error-text">⚠️ Please fill up your delivery information.</p>
          <Link to="/deliveryInformation">Add your delivery information</Link>
          </div>
        )}
      </div>

      <div className="buy-now-item-information">
  {checkoutData === null || checkoutData === undefined ? (
    <p>Loading item details...</p>
  ) : checkoutData?.isFromBasket ? ( 
    <p>You have {checkoutData.items.length} items in your basket. Proceeding to checkout.</p>
  ) : item ? (
    <div className="ferty">
      <div 
        style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "20px", marginBottom: "20px" }}
      >
        <img src={item?.images?.[0]} alt={item?.name} className="img-ferty" />
        <h3 className="fabrice">
  {item?.name ? item.name.slice(0, 40) + (item.name.length > 40 ? "..." : "") : "No name available"}
</h3>
      </div>
      
      {/* Quantity Control */}
      <div className="coolte">
        <div 
          style={{ marginLeft: "10px", cursor: "pointer" }} 
          onClick={() => handleQuantityChange(-1)}
        >
          -
        </div>
        <span>{quantity}</span>
        <div 
          style={{ marginRight: "10px", cursor: "pointer" }} 
          onClick={() => handleQuantityChange(1)}
        >
          +
        </div>
      </div>

      {/* Price Calculation */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <p className="voyeur">Total Price: ${(tokenAmount).toFixed(2)}</p>
        {"\u2248"}
        <p>{convertUsdToCrypto(tokenAmount, selectedCurrency)} {selectedCurrency}</p>
      </div>
      
      {/* Color & Size Selection */}
      <div style={{ marginTop: "-10px" }}>
        {selectedColor && selectedColor.trim() !== "" && (
          <p className="maybe">Color: {selectedColor}</p>
        )}
        {selectedSize && selectedSize !== "null" && selectedSize.trim() !== "" && (
          <p className="sometime">Size: {selectedSize}</p>
        )}
      </div>
    </div>
  ) : (
    <p>Item not found.</p>
  )}
</div>


      {/* Payment Method */}
      <div className="section">
        <h3>💳 Payment Method</h3>
       {isConnected && connectedWallet ? (
    <p>
       Connected Wallet:
      <img 
        src={connectedWallet.logo} 
        alt={connectedWallet.name} 
        style={{ width: "34px", height: "34px", marginLeft: "8px", verticalAlign: "middle" }} 
      />
       {connectedWallet.name} 
    </p>
  ) : (
    <p>No wallet connected.</p>
  )}

{isConnected && (
          <p>Address: {address}</p>
       )}
      </div>

      {/* Available Balance */}
      <div className="section">
         {/* Native Balance */}
      {nativeBalance ? (
        <p style={{color: "black"}}>
          Native Balance: {nativeBalance.formatted} {nativeBalance.symbol}
        </p>
      ) : (
        <p>Loading native balance...</p>
      )}

      {/* Token Balances */}
      {tokenBalances.length > 0 ? (
        <ul>
          {tokenBalances.map(({ symbol, balance }) => (
            <div key={symbol} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "400px", color: "black" }}>
              <div style={{ display: "flex", alignItems: "center", width: "100px", backgroundColor: "gray", marginBottom: "10px" }}>
                {logoUrls[symbol] && (
                  <img
                    src={logoUrls[symbol]}
                    alt={`${symbol} logo`}
                    style={{ width: "24px", height: "24px", marginRight: "8px" }}
                  />
                )}
                <div style={{ color: "white" }}>{symbol}:</div>
              </div>
              <div style={{ alignItems: "center", justifyContent: "start", width: "150px", display: "flex", backgroundColor: "yellow" }}>
                {balance}
              </div>
            </div>
          ))}
        </ul>
      ) : (
        <p>Loading token balances...</p>
      )}
    </div>
      <div>
    <h3>⛽ Network Gas Fee Estimate</h3>
    {loading ? (
        <p>Estimating gas...</p>
    ) : error ? (
        <p style={{ color: "red" }}>⚠️ {error}</p>
    ) : estimatedGas && gasFee ? (
        <>
            <p>Estimated Gas: {estimatedGas} units</p>
            <p>Gas Fee: {gasFee} {nativeTokens[chainId]}</p>
        </>
    ) : (
        <p>No gas fee data available</p>
    )}
</div>



{isInsufficientBalance(tokenAmount, selectedCurrency) ? (
  <p className="error-text">
    ⚠️ You do not have enough {selectedCurrency} in your wallet to complete this purchase.
    Please make sure your balance is sufficient to proceed with the payment.
    <br />
    You currently have{" "}
    {selectedCurrency === nativeTokens[chainId] // Check if it's a native token
      ? nativeBalance?.formatted || "0"
      : tokenBalances.find(token => token.symbol === selectedCurrency)?.balance || "0"
    }{" "}
    {selectedCurrency} in your wallet.
    <br />
    The required amount is{" "}
    {convertUsdToCrypto(tokenAmount, selectedCurrency)}{" "}
    {selectedCurrency}.
  </p>
) : (
  <p className="success-text">
    ✅ You have enough {selectedCurrency} in your wallet to complete the purchase.
    <br />
    Your balance:{" "}
    {selectedCurrency === nativeTokens[chainId]
      ? nativeBalance?.formatted || "0"
      : tokenBalances.find(token => token.symbol === selectedCurrency)?.balance || "0"
    }{" "}
    {selectedCurrency}.
    <br />
    Item price:{" "}
    {convertUsdToCrypto(tokenAmount, selectedCurrency)}{" "}
    {selectedCurrency}.
    <br />
    Click "Buy Now" to proceed with the payment.
  </p>
)}



      {/* Buy Now Button */}
      <Button className="buy-now-btn" onClick={handleBuyNow} disabled={isInsufficientBalance(tokenAmount, selectedCurrency)}>Buy Now</Button>

      {/* Trust Information */}
      {trustInfoVisible && (
        <div className="trust-info">
          <h3>🤝 Trust & Security</h3>
          <p>We ensure secure transactions with blockchain verification.</p>
          <p>Your payment is protected, and funds are released upon order confirmation.</p>
        </div>
      )}
    </div>
    <div className="checkout-container">
  {loading ? (
    <p>Loading item details...</p>
  ) : item ? (
    <div
      className="item-deils"
      onClick={backToProduct}
      style={{
        marginRight: isCheckoutPage && basketItems.length > 0 ? "120px" : "0px",
      }}
    >
      <img src={item?.images?.[0]} alt={item?.name} className="item-ige" />
      <h3 className="item-ne">
  {item?.name ? item.name.slice(0, 40) + (item.name.length > 40 ? "..." : "") : "No name available"}
</h3>

    </div>
  ) : (
    <p>Item not found.</p>
  )}
</div>
</div>


    </div>
  );
};

export default BuyNow;
