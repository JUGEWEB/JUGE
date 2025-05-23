import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { useNavigate, useLocation,  Link } from "react-router-dom";
import axios from "axios";
import { message } from "antd"; // For notifications
import Slider from "react-slick";
import Modal from "react-modal";
import { FaStar, FaChevronDown } from "react-icons/fa";
import FetchReviews from "./fetchReview";
import AnalyseReview from "./analyseReview";
import useFinalRating from "./finalRating";
import "./ItemLastPage.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import ItemIdPage from "./itemIdPage";
import ImageZoom from "./imageZoom";
import ImageZoom1 from "./imageZoom1";
import useScreenSize from "./useIsMobile";
import AnalyseReviewSmallWidth from "./analyseReviewSmallwidth";

const BASKET_API = "https://api.malidag.com/add-to-basket"
const BASE_URL = "https://api.malidag.com";
const TRANSACTION_API = "https://api.malidag.com/api/transaction";
const PRICE_API = "https://api.malidag.com/crypto-prices"; // Your crypto price endpoint
const LIKED_API = "https://api.malidag.com"; // Backend URL

const coinImages = {
  ETH: "https://assets.coingecko.com/coins/images/279/large/ethereum.png?1595348880",
  USDC: "https://assets.coingecko.com/coins/images/6319/large/USD_Coin_icon.png?1547042389",
  BUSD: "https://assets.coingecko.com/coins/images/9576/large/BUSD.png?1568947766",
  SOL: "https://assets.coingecko.com/coins/images/4128/large/solana.png?1640133422",
  BNB: "https://assets.coingecko.com/coins/images/825/large/binance-coin-logo.png?1547034615",
  USDT: "https://assets.coingecko.com/coins/images/325/large/Tether-logo.png?1598003707",
};

function ProductDetails({basketItems, country, user, address, auth, chainId}) {
  const { id } = useParams();
  const navigate = useNavigate()
  const location = useLocation();
  const [product, setProduct] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null); // State for size
  const [selectedImage, setSelectedImage] = useState(null);
  const [cryptoPrices, setCryptoPrices] = useState({});
  const [itemsd, setItemId] = useState(null)
  const [selectedRating, setSelectedRating] = useState(null); // Store selected rating
  const [modalOpen, setModalOpen] = useState(false);
  const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 });
  const [zoomType, setZoomType] = useState('zoom1'); // Default zoom type is 'zoom'
  const queryParams = new URLSearchParams(location.search);
  const ratingFromURL = queryParams.get("rating");
  const buttonRef = useRef(null);  // Using useRef to get the button's position
  const modalRef = useRef(null);
  const {finalRating} = useFinalRating(itemsd)
  const detailsRef = useRef(null);
  const [isHoveringThumbnails, setIsHoveringThumbnails] = useState(false);
  const [isHoveringImageCenter, setIsHoveringImageCenter] = useState(false);
  const [detailsSectionAtTop, setDetailsSectionAtTop] = useState(false);
  const [isBasketVisible, setIsBasketVisible] = useState(false);
  const [detailsSectionAtBottom, setDetailsSectionAtBottom] = useState(false);
  const [zoomedPosition, setZoomedPosition] = useState({ x: 0, y: 0 });
  const [isZoomVisible, setIsZoomVisible] = useState(false);
  const [selectedImageNumber, setSelectedImageNumber] = useState(0); // Default to the first image
  const [quantity, setQuantity] = useState(1); // Quantity state
  const [item, setItem] = useState(null);
   const {isMobile, isDesktop, isTablet, isSmallMobile, isVerySmall, isVeryVerySmall} = useScreenSize()
   const [navigateToReview, setNavigateToReview] = useState(false);
const [ratingToPass, setRatingToPass] = useState(null);
const [openModalSmall, setOpenModalSmall] = useState(false);
const [pendingRating, setPendingRating] = useState(null); // stores the rating only temporarily


  

 

 


  const validVideos = Array.isArray(product?.videos)
  ? product?.videos.filter((v) => typeof v === "string" && v.trim().toLowerCase().endsWith(".mp4"))
  : [];




  

  const handleMouseEnterThumbnails = () => setIsHoveringThumbnails(true);
  const handleMouseLeaveThumbnails = () => setIsHoveringThumbnails(false);
  
  const handleMouseEnterImageCenter = () => setIsHoveringImageCenter(true);
  const handleMouseLeaveImageCenter = () => setIsHoveringImageCenter(false);

  const fetchZoomSetting = async (itemId, color, imageNumber) => {
    try {
      if (!itemId || !color) {
       
        return;
      }
      const response = await fetch(`https://api.malidag.com/api/zoom-setting?itemId=${itemId}&color=${color}&imageNumber=${imageNumber}`);
      const result = await response.json();
     
      if (response.ok) {
        setZoomType(result.zoomType); // Set the zoom type from the API response
      } else {
        setZoomType('zoom1')
      }
    } catch (error) {
      console.error('Failed to fetch zoom setting:', error);
    }
  };

  useEffect(() => {
    fetchZoomSetting(itemsd, selectedColor, selectedImageNumber); // Trigger the zoom setting fetch
   
  }, [itemsd, selectedColor, selectedImageNumber]);

  const checkDetailsSectionPosition = () => {
    if (detailsRef.current) {
        const rect = detailsRef.current.getBoundingClientRect();
        setDetailsSectionAtTop(rect.top <= 0);
       setDetailsSectionAtBottom(rect.bottom >=  window.innerHeight);
    }
};

  useEffect(() => {
    checkDetailsSectionPosition(); // Initial check on load
  
    // Recheck on scroll
    const handleScroll = () => {
      checkDetailsSectionPosition();
    };
  
    window.addEventListener('scroll', handleScroll);
  
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    const handleWheel = (event) => {
        if (!detailsRef.current) return;

        const details = detailsRef.current;
        const delta = event.deltaY;

        const atTop = details.scrollTop === 0;
        const atBottom = details.scrollTop + details.clientHeight >= details.scrollHeight - 1;

        setDetailsSectionAtTop(atTop);
        setDetailsSectionAtBottom(atBottom);

        // If the user is hovering over images
        if (isHoveringThumbnails || isHoveringImageCenter) {
            if (
                (delta > 0 && atBottom) ||  // Allow scroll if at bottom and scrolling down
                (delta < 0 && atTop)        // Allow scroll if at top and scrolling up
            ) {
                return; // Let the page scroll normally
            } else {
                event.preventDefault(); // Prevent page scroll
                details.scrollTop += delta; // Scroll the details section instead
            }
        }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
        window.removeEventListener('wheel', handleWheel);
    };
}, [isHoveringThumbnails, isHoveringImageCenter]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setModalOpen(false);
      }
    };

    if (modalOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [modalOpen]);

   
  useEffect(() => {
    const updateModalPosition = () => {
      if (buttonRef.current) {
        const buttonRect = buttonRef.current.getBoundingClientRect();
        setModalPosition({
          top: buttonRect.top + window.scrollY + buttonRect.height + 10, // Adjust for offset and height of button
          left: buttonRect.left + window.scrollX,
        });
      }
    };

    // Add event listeners
    window.addEventListener("scroll", updateModalPosition);
    updateModalPosition(); // Set initial position

    // Cleanup on component unmount
    return () => {
      window.removeEventListener("scroll", updateModalPosition);
    };
  }, [buttonRef]);

  useEffect(() => {
    if (ratingFromURL) {
      setSelectedRating(parseFloat(ratingFromURL));
    }
  }, [ratingFromURL]);

   // Using useEffect to track location changes
   useEffect(() => {
    // Check if we're on the product or checkout page
    if (location.pathname.includes('product/')) {
      setIsBasketVisible(true); // Show the basket if on product or checkout page
    } else {
      setIsBasketVisible(false); // Hide the basket otherwise
    }
  }, [location]); // Dependency array to re-run the effect on location change

 // Fetch all products function
 const fetchAllProducts = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/items`); // Fetch all products
    const items = response.data.items;

    // Find the product by its ID
    const foundProduct = items.find((item) => item.id === id);
    setItem(foundProduct)
    if (foundProduct?.item) {
      const initialColor = Object.keys(foundProduct.item.imagesVariants)[0];
      setItemId(foundProduct.itemId);
      setProduct(foundProduct.item);
      setSelectedColor(initialColor);
      setSelectedImage(foundProduct.item.imagesVariants[initialColor][0]);

      // Parse and set the initial size
      const sizesString = foundProduct.item.size?.[initialColor]?.[0] || "";
      const sizesArray = sizesString.split(", ").map((size) => size.trim());
      const initialSize = sizesArray[0] || null;
      setSelectedSize(initialSize);
    }
  } catch (error) {
    console.error("Error fetching product details:", error);
  }
};

useEffect(() => {
  // If the `reload` flag is passed in the state, re-fetch all products
  if (location.state?.reload) {
   
    fetchAllProducts();  // Trigger the re-fetching of all products
  } else {
    // Initial fetch for the product details
    fetchAllProducts();
  }
}, [id, location.state]);  // Run the effect when the `id` or `location.state` changes

   // Fetch crypto prices when the component mounts
   useEffect(() => {
    const fetchCryptoPrices = async () => {
      try {
        const response = await axios.get(PRICE_API);
        setCryptoPrices(response.data);
      } catch (error) {
        console.error("Error fetching crypto prices:", error);
      }
    };

    fetchCryptoPrices();

    // Refresh crypto prices every 5 seconds
    const interval = setInterval(fetchCryptoPrices, 5000);
    return () => clearInterval(interval);
  }, []);

useEffect(() => {
  if (navigateToReview && ratingToPass !== null) {
    navigate("/reviewPage", {
      state: {
        itemData: { id, itemId: itemsd, item: product },
        authState: true,
        ratingFilter: ratingToPass,
      },
    });

    // Reset state after navigating
    setNavigateToReview(false);
    setRatingToPass(null);
  }
}, [navigateToReview, ratingToPass, id, itemsd, product, navigate]);




 

   // Convert USD price to the product's cryptocurrency
   const convertToCrypto = (usdAmount, cryptoType) => {
    if (cryptoPrices[cryptoType]) {
      return (usdAmount / cryptoPrices[cryptoType]).toFixed(6); // Show up to 6 decimals
    }
    return "Loading...";
  };

  const handleColorChange = (color) => {
    setSelectedColor(color);
    setSelectedImage(product.imagesVariants[color][0]);
    const sizesString = product.size?.[color]?.[0] || "";
    const sizesArray = sizesString.split(", ").map((size) => size.trim());
    setSelectedSize(sizesArray[0] || "No Size Available");
  };

  const handleImageChange = (image, index) => {
    setSelectedImage(image);
    setSelectedImageNumber(index)
  };

  // Add a handler to update the selected size
const handleSizeChange = (size) => {
    setSelectedSize(size);
  };

  if (!product || !selectedColor) {
    return <p>Loading product details...</p>;
  }

  // Slick slider settings for videos
  const videoSliderSettings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
  };
  
  const toggleModal = () => {
    if (modalOpen) {
      setModalOpen(false);
    } else {
      if (buttonRef.current) {
        const rect = buttonRef.current.getBoundingClientRect();
        setModalPosition({
          top: rect.top + window.scrollY + 30, // Adjusted position
          left: rect.left + window.scrollX,
        });
      }
      setModalOpen(true);
    }
  };

  const handleAddToBasket = async (product) => {
    const currentUser = auth.currentUser; // Get the authenticated user
    if (!currentUser) {
        alert("Please log in to add items to your basket.");
       
        return;
    }

    try {
        const basketItem = {
            userId:  currentUser.uid,  // Get Firebase Auth userId (UID)
            item: {
                id: id,  // Ensure this matches backend expectations
                itemId: itemsd,
                name: product.name,
                price: product.usdPrice,
                color: selectedColor,
                size: selectedSize,
                image: selectedImage,
                brand: product.brand,
                brandPrice: product.brandPrice,
                quantity: 1, // Default quantity
            }
        };

        // Send the basket item to the backend
        const response = await axios.post(BASKET_API, basketItem);

        if (response.status === 200 || response.status === 201) {
            alert(`${product.name} added to your basket successfully!`);
        } else {
            alert("Failed to add item to the basket. Please try again.");
        }
    } catch (error) {
        console.error("Error adding item to basket:", error);
        alert("An error occurred while adding the item to your basket.");
    }
};

const handleLikeItem = async (product) => {
  const currentUser = auth.currentUser
  if (!currentUser) {
    alert("Please log in to like items.");
    return;
  }

  try {
    const likedItem = {
      userId: currentUser.uid,
      id: id,
      name: product.name,
      price: product.usdPrice,
      image: product.images[0],
    };

    const response = await axios.post(`${LIKED_API}/like-item`, likedItem);

    if (response.status === 200 || response.status === 201) {
      alert(`${product.name} added to your liked items!`);
    } else {
      alert("Failed to like item.");
    }
  } catch (error) {
    console.error("Error liking item:", error);
  }
};


const handleMouseMove = (e) => {
  const image = e.target;
  const { left, top, width, height } = image.getBoundingClientRect();
  const x = e.clientX - left;
  const y = e.clientY - top;

  // Convert to percentage relative to image size
  const xPercent = (x / width) * 100;
  const yPercent = (y / height) * 100;

  setZoomedPosition({ x: xPercent, y: yPercent });
};
const handleMouseEnterImage = () => {
  if (isDesktop) {
    setIsZoomVisible(true);
  }
};

const handleMouseLeaveImage = () => {
  if (isDesktop) {
    setIsZoomVisible(false);
  }
};

const closeModal = () => {
  setModalOpen(false)
}

const renderImageZoom = () => {

   if (isTablet) {
    // On tablets, show a static image only
    return (
      <img
        src={selectedImage}
        alt="Selected product"
        style={{
          width: "300px",
          height: "400px",
          objectFit: "contain",
        }}
      />
    );
  }

  if (zoomType === "nozoom") {
    return (
      <img
        src={selectedImage}
        alt="Selected product"
        style={{  width:(isTablet) ? "300px" : isDesktop ? "400px" : isDesktop && basketItems.length>0 ? "300px" : "", height:(isTablet) ? "400px" : "500px" , objectFit: "contain"}}
      />
    );
  }

  if (zoomType === "zoom") {
    console.log(selectedImage);
    return (

      <ImageZoom
        selectedImage={selectedImage}
        basketItems={basketItems}
        alt="Selected product"
        style={{
          height: "auto",
          maxWidth: "500px",
          maxHeight: "550px",
          cursor: "zoom-in",
        }}
      />
    );
  }

  if (zoomType === "zoom1") {
    return (
      <ImageZoom1
        isZoomVisible={isZoomVisible}
        selectedImage={selectedImage}
        onMouseMove={handleMouseMove}
        zoomedPosition={zoomedPosition}
        style={{ height: "auto", maxWidth:  "500px", maxHeight: "550px" }}
        onMouseEnter={handleMouseEnterImage}
        onMouseLeave={handleMouseLeaveImage}
        basketItems={basketItems}
      />
    );
  }
};



const networkLogos = {
  1: "https://assets.coingecko.com/coins/images/279/large/ethereum.png?1595348880",
  56: "https://assets.coingecko.com/coins/images/825/large/binance-coin-logo.png?1547034615",
  97: "https://assets.coingecko.com/coins/images/825/large/binance-coin-logo.png?1547034615", // BSC Testnet uses the same logo as BSC
  137: "https://assets.coingecko.com/coins/images/4713/large/matic-token-icon.png?1624446912",
  // Add more networks as needed
};

const getNetworkName = (chainId) => {
  if (!chainId) {
    return (
      <div style={{ color: "red" }}>
        🚫 You are not connected. Make sure to connect to a supported network.
        <br />
        <a href="/supported-networks" style={{ color: "blue", textDecoration: "underline" }}>
          Learn about our supported networks.
        </a>
      </div>
    );
  }

  const networkName = {
    1: "Ethereum Mainnet",
    56: "Binance Smart Chain",
    97: "BSC Testnet",
    137: "Polygon",
    // Add other networks as needed
  }[chainId];

  if (!networkName) {
    return (
      <div style={{ color: "red" }}>
        ❌ Unknown Network. You are connected to an unsupported network.
        <br />
        <a href="/supported-networks" style={{ color: "blue", textDecoration: "underline" }}>
          Learn about our supported networks.
        </a>
      </div>
    );
  }

  return (
    <div style={{ color: "green", display: "flex", alignItems: "center" }}>
      ✅ You are connected to {networkName}
      {networkLogos[chainId] && (
        <img
          src={networkLogos[chainId]}
          alt={networkName}
          style={{ width: "20px", height: "20px", marginLeft: "8px" }}
        />
      )}
    </div>
  );
};

if (!product || !selectedColor) {
  return <p>Loading product details...</p>; // ✅ GOOD for loading
}


// Function to handle Buy Now click
const handleBuyNowClick = (itemId) => {
  if (!chainId) {
    message.warning("⚠️ Your wallet is not connected. Please connect your wallet first.");
    return; // Prevent navigation
  }

  // Navigate to checkout with the item ID
  navigate(`/checkout?itemId=${itemId}&quantity=${quantity}&selectedColor=${selectedColor}&selectedSize=${selectedSize}&tokenAmount=${product.usdPrice * quantity}&basket=${false}`);
};

const handleQuantityChange = (amount) => {
  setQuantity((prev) => Math.max(1, prev + amount)); // Ensure it stays at least 1
};




  return (
    <div className="product-details"  >
      <div className="product-layout"  style={{
    marginRight: isBasketVisible && isDesktop && basketItems.length > 0 ? "0px" : "0px",
    display: isDesktop || isTablet ? "grid" : "block",
    gridTemplateColumns: isDesktop || isTablet ? "1fr 1fr 2fr" : undefined,
    alignItems: "start",
    gap: "20px",
  }}>
  
{/* Mobile: image slider */}
{!isDesktop && !isTablet && (
  <>
    <div className="mobile-slider-wrapper" style={{ width: "100%", padding: "10px" }}>
      <Slider dots={true} infinite={false} speed={500} slidesToShow={1} slidesToScroll={1}>
        {product.imagesVariants[selectedColor].map((image, index) => (
          <div key={index}>
            <img
              src={image}
              alt={`Slide ${index}`}
              style={{
                width: "100%",
                height: "400px",
                objectFit: "contain"
              }}
              onClick={() => handleImageChange(image, index)}
            />
          </div>
        ))}
      </Slider>
    </div>
   {!isDesktop && !isTablet && product?.imagesVariants && Object.keys(product?.imagesVariants).length > 0 && (
  <div
    className=" mobile-color-thumbnails"
    style={{
      display: "flex",
      justifyContent: "center",
      flexWrap: "wrap",
      marginTop: "10px",
      gap: "10px",
      height: "auto"
    }}
  >
    {Object.keys(product?.imagesVariants).map((color) => (
      <img
        key={color}
        src={product?.imagesVariants[color][0]}
        alt={`${color} option`}
        className={`color-thumbnail ${color === selectedColor ? "selected" : ""}`}
        onClick={() => handleColorChange(color)}
        style={{
          width: "50px",
          height: "50px",
          objectFit: "cover",
          borderRadius: "50%",
        }}
      />
    ))}
  </div>
)}
  </>
)}

{(!(isDesktop || isTablet)) && (
  <div style={{maxHeight: "auto", maxWidth: "100%", position: "relative"}}>
     <h1 style={{color: "black"}}>{product.name}</h1>

      {product.brand && product.brand.trim() !== "" && (
        <Link to={`/${product.brand}Brand`} > visit the {product.brand} brand</Link>
      )}

       <p style={{color: "black"}}> <div className="rating-dropdown" style={{ display: "flex", alignItems: "center" }}>
        <span style={{marginRight: "10px", fontWeight: "bold", fontStyle: "italic"}} className="text-lg font-semibold">{finalRating || 0}</span>
                  {[...Array(5)].map((_, index) => {
            const starValue = index + 1;
            return (
              <FaStar
                key={index}
                color={
                  starValue <= Math.floor(finalRating)
                    ? "gold"
                    : starValue - 0.5 <= finalRating
                    ? "goldenrod"
                    : "gray"
                }
              />
            );
          })}
          
          <span ref={buttonRef}>
  <FaChevronDown onClick={() => setOpenModalSmall(true)} style={{ cursor: "pointer", fontSize: "20px", marginLeft: "10px", marginTop: "5px" }} />
</span>

              
          </div></p>

           <div style={{position: "relative"}}> 
       {openModalSmall && itemsd && (
  <div
    className="modal-content"
    style={{
      position: "absolute",
      top: `-20px`,
      right: `40px`,
      background: "white",
      padding: "10px",
      borderRadius: "8px",
      boxShadow: "0px 4px 8px rgba(0,0,0,0.2)",
      zIndex: 9999,
      width: "300px",
      transition: "top 0.1s ease-out, left 0.1s ease-out",
    }}
  >
    <span className="close-btn" onClick={() => setOpenModalSmall(false)}>&times;</span>

    <AnalyseReviewSmallWidth
      productId={itemsd}
      id={id}
      item={product}
      onTriggerReviewNavigation={(rating) => {
        setOpenModalSmall(false);       // use openModalSmall for consistency
        setRatingToPass(rating);
        setNavigateToReview(true);
      }}
    />
  </div>
)}

<div style={{ display: "flex", alignItems: "center" }}>
  <span role="img" aria-label="network">🌐</span> {/* Keep the globe emoji for better UX */}
  <span style={{ marginLeft: "5px", fontWeight: "bold", color: "black" }}>
    {getNetworkName(chainId)}
  </span>
</div>

 <h1 style={{color: "black", fontSize: "14px", marginTop: "10px"}}> Size Name:{selectedSize}</h1>

        {product.size?.[selectedColor] && (
          <div>
            <label htmlFor="size-select" style={{ color: "black" }}>
              Select Size:
            </label>
            <select
              id="size-select"
              value={selectedSize}
              onChange={(e) => handleSizeChange(e.target.value)}
              style={{ margin: "0px", padding: "5px" }}
            >
              {product.size[selectedColor][0]
                .split(", ") // Split sizes into an array
                .map((size, index) => (
                  <option key={index} value={size.trim()}>
                    {size.trim()}
                  </option>
                ))}
            </select>
          </div>
        )}

            <div style={{display: "flex", justifyContent: "start", alignItems: "center"}}>
            
          <h2 style={{color: "black", fontStyle: "italic"}}>${product.usdPrice * quantity}</h2>

            <h4 style={{color: "black", fontStyle: "italic", paddingLeft: "20px", paddingRight: "20px"}}> ≈ </h4>

           {/* Show Converted Crypto Price */}
      {product.usdPrice && cryptoPrices[product.cryptocurrency] ? (
        <h3 style={{ color: "black" }}>
          {convertToCrypto(product.usdPrice * quantity, product.cryptocurrency)}  {coinImages[product.cryptocurrency] && (
            <img
              src={coinImages[product.cryptocurrency]}
              alt={product.cryptocurrency}
              style={{
                width: "24px",
                height: "24px",
                marginLeft: "8px",
              }}
            />
          )} {product.cryptocurrency}
        </h3>
      ) : (
        <h3 style={{ color: "gray" }}>Fetching crypto price...</h3>
      )}
      </div>
       {/* Quantity Selector */}
       <div style={{display: "flex", alignItems: "center", maxWidth: "200px", top: "0", marginBottom: "10px"}}>
        <span style={{marginBottom: "5px", fontStyle: "italic"}}>Quantity</span>
    <div style={{ display: "flex", alignItems: "center", border: "1px solid gray", borderRadius: "100px", marginLeft: "20px" }}>
     
      <div
        onClick={() => handleQuantityChange(-1)}
        style={{ padding: "5px 10px", marginRight: "5px", cursor: "pointer" }}
      >
        -
      </div>
      <span style={{ fontSize: "18px", fontWeight: "bold", color: "black" }}>
        {quantity}
      </span>
      <div
        onClick={() => handleQuantityChange(1)}
        style={{ padding: "5px 10px", marginLeft: "5px", cursor: "pointer" }}
      >
        +
      </div>
      </div>
    </div>
        <div style={{display: "flex", alignItems: "center", justifyContent: "start", padding: "5px"}}>
        
        <button className="buy-now-button" onClick={() => handleBuyNowClick(id)}>
          Buy Now
        </button>
     
        <button className="add-to-basket" onClick={() => handleAddToBasket(product)}>Add to Basket</button>
        <button className="like-botton" onClick={() => handleLikeItem(product)}>❤️ Like</button>
        </div>
        <p style={{color: "red", fontSize: "15px"}}>{product.sold} Items already sold 🔥</p>
        </div>

         {/* Video Slider */}
         <div>
{validVideos?.length > 0 && (
  <div className="product-videos" >
    <h2 style={{ color: "black" }}>Product Videos</h2>

    {validVideos?.length === 1 ? (
      <div>
        <video
          src={validVideos[0]}
          controls
          style={{ width: "100%", maxWidth: "600px", height: "400px" }}
        />
      </div>
    ) : (
      <Slider {...videoSliderSettings}>
        {validVideos.map((videoUrl, index) => (
          <div key={index}>
            <video
              src={videoUrl}
              controls
              style={{ width: "100%", maxWidth: "600px", height: "400px" }}
            />
          </div>
        ))}
      </Slider>
    )}
  </div>
)}
</div>


  <div>
     <p style={{color: "black",  display: "flex"}}> <strong style={{marginRight: "20px"}}>product detail:</strong> {product.text}</p>
        <p style={{color: "black",  display: "flex"}}> <strong style={{marginRight: "20px"}}>About this item:</strong> {product.productDetail01}</p>
         <h1 style={{color: "black", fontSize: "14px"}}> ID: {itemsd}</h1>
  </div>

   {/* Modal for Transaction Form */}
      <div  style={{width: "100%"}}>
      <ItemIdPage id={itemsd}/>
      </div>
     
      <FetchReviews  productId={itemsd} selectedRating={selectedRating} />
      
      
      {/* ✅ Show "See All Reviews" only if reviewCount > 11 */}
    {parseInt(localStorage.getItem("reviewCount") || "0", 10) > 11 && (
      <div
        onClick={() => navigate("/reviewPage", {
          state: {
            itemData: {
              id: itemsd,
              itemId: itemsd,
              item: product
            },
            authState: true,
            ratingFilter: selectedRating
          }
        })}
        style={{
          cursor: "pointer",
          color: "blue",
          textDecoration: "underline",
          marginLeft: "20px",
          marginTop: "10px",
          fontSize: "14px",
           marginBottom: "20px"
        }}
      >
        See all reviews →
      </div>
    )}
  

  </div>
)}


<div>
      {(isDesktop || isTablet) && (
  <div>
    <div
     {...(isDesktop && {
        onMouseEnter: handleMouseEnterThumbnails,
        onMouseLeave: handleMouseLeaveThumbnails,
      })}
      className="left-thumbnails"
      style={{
        width: isBasketVisible && basketItems.length > 0 ? "90%" : "100%",
        height: (isTablet) ? "400px" : "600px"
      }}
    >
      {product.imagesVariants[selectedColor].map((image, index) => (
        
        <img
          key={index}
          src={image}
          alt={`${selectedColor} variant`}
          className={`thumbnail ${selectedImage === image ? "active" : ""}`}
          onClick={() => handleImageChange(image, index)}
        />
        
      ))}
    </div>
    </div>
    )}
    </div>

<div>
     {(isDesktop || isTablet) && (
   
    <div
  
  {...(isDesktop && {
        onMouseEnter: handleMouseEnterThumbnails,
        onMouseLeave: handleMouseLeaveThumbnails,
      })}
      style={{
        width: isTablet ? "300px" : isDesktop && basketItems.length>0 ? "400px" : "500px",
        height: isTablet ? "400px" : "600px",
        filter: "brightness(0.9)",
        padding: "0px",
        background: "white",
        alignItems: "center",
        display: "flex",
        justifyContent: "center",
        objectFit: "contain"
      }}
    >
      {renderImageZoom()}
    </div>
     )}
     </div>
 

       <div>
        {(isDesktop || isTablet) && (

        <div
        
       className={`details-section ${detailsSectionAtTop ? "at-top" : ""} ${detailsSectionAtBottom ? "at-bottom" : ""}`} style={{display: (isDesktop || isTablet) ? "block" : "none" , maxWidth: isBasketVisible && isDesktop && basketItems.length > 0 ? "65%" : isBasketVisible && isTablet && basketItems.length > 0 ? "100%" : "auto", padding: "20px", maxHeight: "600px", overflowY: "auto"}}  ref={detailsRef}
         >
        <div>
           {/* Conditionally render Zoomed Portion only when the cursor is inside the image */}
           {isZoomVisible && zoomType === 'zoom1'&& isDesktop && (
        <div
          className="zoomed-view"
          style={{
            position: 'fixed',
            bottom: "0",
            right: "0px",
            width: '400px',
            height: '500px',
            overflow: 'hidden',
            border: '2px solid #ddd',
            backgroundColor: '#fff',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
            zIndex: "1200",
          }}
        >
          <img
            src={selectedImage}
            alt="Zoomed"
            style={{
              position: 'absolute',
              width: '1500px', // Large zoomed version
              height: '1600px',
              transform: `translate(-${(zoomedPosition.x / 100) * (1500 - 400)}px, 
                          -${(zoomedPosition.y / 100) * (1600 - 500)}px)`, // Correct scaling
              transition: 'transform 0.1s ease-out',
            
              filter: "brightness(0.9)"
            }}
          />
        </div>
      )}
        <h1 style={{color: "black"}}>{product.name}</h1>
        {/* Check if the product brand exists and is not empty */}
      {product.brand && product.brand.trim() !== "" && (
        <Link to={`/${product.brand}Brand`} > visit the {product.brand} brand</Link>
      )}
        <div className="product-info">
        <p style={{color: "black"}}> <div className="rating-dropdown" style={{ display: "flex", alignItems: "center" }}>
        <span style={{marginRight: "10px", fontWeight: "bold", fontStyle: "italic"}} className="text-lg font-semibold">{finalRating || 0}</span>
                  {[...Array(5)].map((_, index) => {
            const starValue = index + 1;
            return (
              <FaStar
                key={index}
                color={
                  starValue <= Math.floor(finalRating)
                    ? "gold"
                    : starValue - 0.5 <= finalRating
                    ? "goldenrod"
                    : "gray"
                }
              />
            );
          })}
          
          <span ref={buttonRef}>
  <FaChevronDown  onClick={toggleModal} style={{ cursor: "pointer", fontSize: "20px", marginLeft: "10px", marginTop: "5px" }} />
</span>

              
          </div></p>
          <div style={{position: "relative"}}> 
          {modalOpen && itemsd && (
        <div
        className="modal-content"
        ref={modalRef}
        style={{
          position: "absolute",
          top: `-20px`,
          right: `40px`,
          background: "white",
          padding: "10px",
          borderRadius: "8px",
          boxShadow: "0px 4px 8px rgba(0,0,0,0.2)",
         zIndex: 1000,
          width: "300px", // Adjust width as needed
          transition: "top 0.1s ease-out, left 0.1s ease-out", // Smooth position updates
        }}
        >
        <span className="close-btn" onClick={closeModal}>&times;</span>
    <AnalyseReview productId={itemsd} id={id} onRatingClick={setSelectedRating}   />
  </div>
            )}

            {/* Display the network name dynamically */}
<div style={{ display: "flex", alignItems: "center" }}>
  <span role="img" aria-label="network">🌐</span> {/* Keep the globe emoji for better UX */}
  <span style={{ marginLeft: "5px", fontWeight: "bold", color: "black" }}>
    {getNetworkName(chainId)}
  </span>
</div>

            <div style={{display: "flex", justifyContent: "start", alignItems: "center"}}>
            
          <h2 style={{color: "black", fontStyle: "italic"}}>${product.usdPrice * quantity}</h2>

            <h4 style={{color: "black", fontStyle: "italic", paddingLeft: "20px", paddingRight: "20px"}}> ≈ </h4>

           {/* Show Converted Crypto Price */}
      {product.usdPrice && cryptoPrices[product.cryptocurrency] ? (
        <h3 style={{ color: "black" }}>
          {convertToCrypto(product.usdPrice * quantity, product.cryptocurrency)}  {coinImages[product.cryptocurrency] && (
            <img
              src={coinImages[product.cryptocurrency]}
              alt={product.cryptocurrency}
              style={{
                width: "24px",
                height: "24px",
                marginLeft: "8px",
              }}
            />
          )} {product.cryptocurrency}
        </h3>
      ) : (
        <h3 style={{ color: "gray" }}>Fetching crypto price...</h3>
      )}
      </div>
       {/* Quantity Selector */}
       <div style={{display: "flex", alignItems: "center", maxWidth: "200px", top: "0", marginBottom: "10px"}}>
        <span style={{marginBottom: "5px", fontStyle: "italic"}}>Quantity</span>
    <div style={{ display: "flex", alignItems: "center", border: "1px solid gray", borderRadius: "100px", marginLeft: "20px" }}>
     
      <div
        onClick={() => handleQuantityChange(-1)}
        style={{ padding: "5px 10px", marginRight: "5px", cursor: "pointer" }}
      >
        -
      </div>
      <span style={{ fontSize: "18px", fontWeight: "bold", color: "black" }}>
        {quantity}
      </span>
      <div
        onClick={() => handleQuantityChange(1)}
        style={{ padding: "5px 10px", marginLeft: "5px", cursor: "pointer" }}
      >
        +
      </div>
      </div>
    </div>
        <div style={{display: "flex", alignItems: "center", justifyContent: "start", padding: "5px"}}>
        
        <button className="buy-now-button" onClick={() => handleBuyNowClick(id)}>
          Buy Now
        </button>
     
        <button className="add-to-basket" onClick={() => handleAddToBasket(product)}>Add to Basket</button>
        <button className="like-botton" onClick={() => handleLikeItem(product)}>❤️ Like</button>
        </div>
        <p style={{color: "red", fontSize: "15px"}}>{product.sold} Items already sold 🔥</p>
        </div>
        <h1 style={{color: "black", fontSize: "14px"}}> color Name: {selectedColor}</h1>
        </div>
       
        </div>
        
         {/* ✅ For desktop layout — place elsewhere in the layout */}
{(isDesktop || isTablet) && (
  <div className="right-colors desktop-color-thumbnails">
    {Object.keys(product.imagesVariants).map((color) => (
      <img
        key={color}
        src={product.imagesVariants[color][0]}
        alt={`${color} option`}
        className={`color-thumbnail ${color === selectedColor ? "selected" : ""}`}
        onClick={() => handleColorChange(color)}
      />
    ))}
  </div>
)}
        
        <h1 style={{color: "black", fontSize: "14px"}}> Size Name:{selectedSize}</h1>

        {product.size?.[selectedColor] && (
          <div>
            <label htmlFor="size-select" style={{ color: "black" }}>
              Select Size:
            </label>
            <select
              id="size-select"
              value={selectedSize}
              onChange={(e) => handleSizeChange(e.target.value)}
              style={{ margin: "10px", padding: "5px" }}
            >
              {product.size[selectedColor][0]
                .split(", ") // Split sizes into an array
                .map((size, index) => (
                  <option key={index} value={size.trim()}>
                    {size.trim()}
                  </option>
                ))}
            </select>
          </div>
        )}
      
        <p style={{color: "black",  display: "flex"}}> <strong style={{marginRight: "20px"}}>product detail:</strong> {product.text}</p>
        <p style={{color: "black",  display: "flex"}}> <strong style={{marginRight: "20px"}}>About this item:</strong> {product.productDetail01}</p>
        <h1 style={{color: "black", fontSize: "14px"}}> ID: {itemsd}</h1>


        </div>

         )}

         </div>




      </div>

      
      {(isDesktop || isTablet) && (
        <div>
{validVideos?.length > 0 && (
  <div className="product-videos" >
    <h2 style={{ color: "black" }}>Product Videos</h2>

    {validVideos?.length === 1 ? (
      <div>
        <video
          src={validVideos[0]}
          controls
          style={{ width: "100%", maxWidth: "600px", height: "400px" }}
        />
      </div>
    ) : (
      <Slider {...videoSliderSettings}>
        {validVideos.map((videoUrl, index) => (
          <div key={index}>
            <video
              src={videoUrl}
              controls
              style={{ width: "100%", maxWidth: "600px", height: "400px" }}
            />
          </div>
        ))}
      </Slider>
    )}
  </div>
)}
</div>
 )}


       {/* Modal for Transaction Form */}
       {(isDesktop || isTablet) && (
        <div>
      <div style={{marginRight: isBasketVisible && basketItems.length > 0 ? "150px" : "0" }}>
      <ItemIdPage id={itemsd}/>
      </div>
     
      <FetchReviews  productId={itemsd} selectedRating={selectedRating} />
     

       {/* ✅ Show "See All Reviews" only if reviewCount > 11 */}
    {parseInt(localStorage.getItem("reviewCount") || "0", 10) > 11 && (
      <div
        onClick={() => navigate("/reviewPage", {
          state: {
            itemData: {
              id: itemsd,
              itemId: itemsd,
              item: product
            },
            authState: true,
            ratingFilter: selectedRating
          }
        })}
        style={{
          cursor: "pointer",
          color: "blue",
          textDecoration: "underline",
          marginLeft: "20px",
          marginTop: "10px",
          fontSize: "14px",
          marginBottom: "20px"
        }}
      >
        See all reviews →
      </div>
    )}
      </div>
       )}
     
      
    </div>
     
  );
}

export default ProductDetails;