import React, { useState } from "react";
import FetchReviews from "./fetchReview";
import LikedItems from "./likedItem";
import { useLocation, useNavigate } from "react-router-dom";
import useFinalRating from "./finalRating";
import useScreenSize from "./useIsMobile";
import './reviewPage.css'


function ReviewPage({auth}) {

    const navigate = useNavigate()
    const location = useLocation();
const { itemData, authState = false, ratingFilter = null } = location.state || {};
const [selectedRating, setSelectedRating] = useState(ratingFilter);
const {isMobile, isTablet, isSmallMobile, isDesktop, isVerySmall} = useScreenSize()

   

     // Get the final rating and rating percentages using the custom hook
  const { finalRating, loading, error, ratingPercentages } = useFinalRating(itemData?.itemId);


    const handleRatingFilter = (rating) => {
        // If the user selects the same rating again, we clear the filter
        setSelectedRating(selectedRating === rating ? null : rating);
      };

      const goToLike = () =>{
        navigate('/likeditem')
      }

      const goToProduct = (id) =>{
        navigate(`/product/${id}`)
      }

      // Function to render filled stars based on the finalRating
  const renderStars = (rating) => {
    const fullStars = Math.floor(rating); // Number of full stars
    const halfStar = rating % 1 >= 0.5 ? 1 : 0; // Half star if remainder >= 0.5
    const emptyStars = 5 - fullStars - halfStar; // Empty stars

    const starArray = [
      ...Array(fullStars).fill("★"),  // Full stars
      ...Array(halfStar).fill("☆"),   // Half star
      ...Array(emptyStars).fill("☆"), // Empty stars
    ];

    return starArray.map((star, index) => (
      <span key={index} style={{ color: star === "★" ? "#ffcc00" : "#ddd" }}>
        {star}
      </span>
    ));
  };


    return (
        <div>
          <div style={{display: "flex", alignItems: "center", justifyContent: "start", overflowX: "auto", width: "100%"}}>
           {(!(isDesktop || isTablet)) && (
               
            <div className="productIDSmall" onClick={() => goToProduct(itemData?.id)} style={{border: "2px solid #222", borderRadius: "5px", marginTop: "20px", alignItems: "center", display: "flex", justifyContent: "center", maxWidth: "100%", marginRight: "20px", cursor: "pointer"}}>
                <img style={{maxWidth: "100px"}} src={itemData?.item?.images[0]} alt={itemData?.item.name}/>
                <div style={{color: "#222",  textOverflow: "ellipsis" , maxWidth: "100%"}}>{itemData?.item?.name}</div>
            </div>
               
                )}
                </div>
            <div style={{display:(isDesktop || isTablet) ? "flex": "", justifyContent: "space-between", width: "95%", padding: "20px", alignItems: "center"}}>
                <div>
                 
                <div style={{ color: "black", marginLeft: "10px", fontWeight: "bold", marginBottom: "10px" }}>
                     Rating: {finalRating} {renderStars(finalRating)}
      </div>
                <div style={{color: "black", marginBottom: "20px", border: "2px solid #222", width: "100px", display: "flex", justifyContent: "center",  padding: "5px 10px",marginLeft: "10px"}}>filter review:</div>
                
                <div style={{ display: "flex", alignItems: "center" }}>
          {[5, 4, 3, 2, 1].map((rating) => (
            <div key={rating}>
                  {/* Rating Percentage */}
                  <div style={{marginLeft: "10px"}}>
                  <div style={{padding: "5px", color: "black" }}>
                  <div style={{ marginRight: "5px" }}>{rating} Stars:</div>
                </div>
                <div style={{ width: "100%", height: "20px", backgroundColor: "#ddd" }}>
                  <div
                    style={{
                      width: `${ratingPercentages[rating - 1]}%`,
                      height: "100%",
                      backgroundColor: "orange",
                      transition: "width 1s ease-in-out",
                     
                    }}
                  />
                </div>
                <div style={{ marginLeft: "5px" }}>
                  {ratingPercentages[rating - 1]}%
                </div>
                </div>
            <button
              key={rating}
              onClick={() => handleRatingFilter(rating)}
              style={{
                marginLeft: "10px",
                backgroundColor: selectedRating === rating ? "#ddd" : "transparent",
                border: "1px solid #ccc",
                padding: "5px 10px",
                cursor: "pointer",
              }}
            >
              {rating} stars⭐
            </button>
            </div>
          ))}
        </div>
                </div>
                {(isDesktop || isTablet) && (
               
            <div className="productID" onClick={() => goToProduct(itemData?.id)} style={{border: "2px solid #222", borderRadius: "5px", marginTop: "20px", alignItems: "center", display: "flex", justifyContent: "center", maxWidth: "30%", marginRight: "20px", cursor: "pointer"}}>
                <img style={{maxWidth: "100px"}} src={itemData?.item?.images[0]} alt={itemData?.item.name}/>
                <div style={{color: "#222"}}>{itemData?.item?.name}</div>
            </div>
               
                )}
            </div>
        <div style={{display:(isDesktop || isTablet) ? "flex" : "",  width: "100%", justifyContent: "space-between"}} >
           {(!(isDesktop || isTablet)) && (
           
            <div style={{height: "100%", width: "100%"}}>
            <LikedItems  auth={auth}/>
                <div onClick={goToLike} style={{color: "blue", textDecoration: "underline", fontSize: "14px", cursor: "pointer", marginLeft: "20px"}}>view more items you liked</div>
            </div>
               
            )}
            <div style={{marginLeft: "10px"}}><FetchReviews productId={itemData?.itemId} selectedRating={selectedRating} onRatingClick={setSelectedRating}/></div>
            {(isDesktop || isTablet) && (
           
            <div style={{height: "100%", width: "100%"}}>
            <LikedItems  auth={auth}/>
                <div onClick={goToLike} style={{color: "blue", textDecoration: "underline", fontSize: "14px", cursor: "pointer", marginLeft: "20px"}}>view more items you liked</div>
            </div>
               
            )}
        </div>
        </div>
    )
}

export default ReviewPage