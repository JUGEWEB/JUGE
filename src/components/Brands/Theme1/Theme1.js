import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // ✅ Import useNavigate
import { useLocation } from "react-router-dom";
import useFinalRating from "../../finalRating";
import useScreenSize from "../../useIsMobile";
import "./Baasploa.css";

function Theme1() {
    const [departments, setDepartments] = useState([]);
    const [topItems, setTopItems] = useState([]);
    const [bestSeller, setBestSeller] = useState(null);
    const { finalRating, loading, error } = useFinalRating(topItems?.itemId || 0);
    const location = useLocation();
    const brandName = location.state?.brandName || "default-brand"; // fallback
    const [brandDetails, setBrandDetails] = useState({ headerImage: "", logo: "" });
    const {isMobile, isDesktop, isSmallMobile, isTablet, isVerySmall, isVeryVerySmall} = useScreenSize()
    const [expandedDeptIndex, setExpandedDeptIndex] = useState(null);



    console.log("topitems:", topItems)
    


    const navigate = useNavigate(); // ✅ Initialize navigation function

    useEffect(() => {
    const fetchBrandDetails = async () => {
        try {
            const res = await fetch("https://api.malidag.com/api/brands/themes");
            const data = await res.json();

            const brand = data.find(
                b => b.brandName.trim().toLowerCase() === brandName.trim().toLowerCase()
            );

            if (brand) {
                setBrandDetails({
                    headerImage: brand.headerImage,
                    logo: brand.logo,
                });
            }
        } catch (err) {
            console.error("Error fetching brand theme:", err);
        }
    };

    fetchBrandDetails();
}, [brandName]);

    useEffect(() => {
        fetch(`https://api.malidag.com/api/brands/${brandName}`)
            .then((response) => response.json())
            .then((data) => setDepartments(data.departments || []));
    }, []);

    useEffect(() => {
        fetch(`https://api.malidag.com/api/brands/${brandName}/top-items`)
            .then((response) => response.json())
            .then((data) => setTopItems(data))
            .catch((error) => console.error("Error fetching top items:", error));
    }, []);

    useEffect(() => {
        fetch(`https://api.malidag.com/api/brands/${brandName}/best-seller`)
            .then((response) => response.json())
            .then((data) => setBestSeller(data))
            .catch((error) => console.error("Error fetching best seller:", error));
    }, []);

    const handleBrandTypeClick = (department, brandType) => {
        // ✅ Navigate to `BrandDepartment.js` and pass `department` & `brandType`
       navigate(`/theme1department?department=${department}&brandType=${brandType}`, {
        state: { brandName } // ✅ Pass brandName as state
});

    };

    return (
        <div>
            {(isDesktop) && (
           
            <div className="blaasploaContainer">
                {/* Sidebar - Departments List */}
                <div className="blaDepartement">
                    <div className="bladeprt">
                        <div>
                            <img src={brandDetails.logo} alt={`${brandName} Logo`} className="logoImage" />
                            <div className="departementTitle">Departments</div>
                            <div className="departmentCategories">
                                <ul>
                                    {departments.map((department, index) => (
                                        <li key={index}>
                                            <strong>{department.name}</strong>
                                            <ul>
                                                {department.brandTypes.map((brandType, bIndex) => (
                                                    <li 
                                                        key={bIndex} 
                                                        className="clickableBrandType"
                                                        onClick={() => handleBrandTypeClick(department.name, brandType)}
                                                    >
                                                        {brandType}
                                                    </li>
                                                ))}
                                            </ul>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content Section */}
                <div className="blaStyle">
                    <div className="headerImage">
                       <img src={brandDetails.headerImage} alt={`${brandName} Header`} className="headerImgStyle" />
                       <div className="baasploaT">{brandName}</div>
                    </div>

              {/* Top-Selling Items Section */}
<div className="topItemsSection">
    {topItems
        .filter(item => {
            console.log("Checking department:", item.department); // Debugging line
            return (
                item.department?.trim().toLowerCase() === "men-shoes" || 
                item.department?.trim().toLowerCase() === "women-shoes"
            );
        })
        .map((item) => (
            <div key={item.id} className="topItemCard" style={{cursor: "pointer"}} onClick={() => navigate(`/product/${item.id}`)}>
                <div className="topLabel">Top</div>
                <div className="imageContainIm">
                    <img src={item.images?.[0]} alt={item.name} className="topItemImage" />
                </div>
                <div className="topItemDetails">
                    <div className="topItemName">{item.name}</div>
                    <div className="ratingContainer">
                        {loading ? (
                            <span>Loading...</span>
                        ) : error ? (
                            <span>Error loading rating</span>
                        ) : (
                            <span className="stars">⭐ {finalRating || "No Rating"}</span>
                        )}
                    </div>
                </div>
            </div>
        ))
    }
</div>


                    {/* Best Seller Section */}
                    {bestSeller && (
                        <div className="bestSellerSection">
                            {bestSeller.item.videos?.length > 0 ? (
                                <div style={{cursor: "pointer"}} className="videoContainer" onClick={() => navigate(`/product/${bestSeller.id}`)}>
                                    <video autoPlay muted loop playsInline controls>
                                        <source src={bestSeller?.item?.videos[0]} type="video/mp4" />
                                        Your browser does not support the video tag.
                                    </video>
                                </div>
                            ) : (
                                <p>No video available</p>
                            )}

                            <div className="bestSellerContainer" onClick={() => navigate(`/product/${bestSeller.id}`)} style={{cursor: "pointer"}}>
                                <img src={bestSeller.item.images[0]} alt={bestSeller.item.name} className="bestSellerImage" />
                                <div className="bestSellerBadge">Best Seller</div>
                                <div className="bestSellerTitle">{bestSeller.item.name}</div>
                            </div>
                        </div>
                    )}

                         {/* Top-Selling Items Section */}
<div className="topItemsSection">
    {topItems
        .filter(item => {
            console.log("Checking department:", item.department); // Debugging line
            return (
                item.department?.trim().toLowerCase() !== "men-shoes" && 
                item.department?.trim().toLowerCase() !== "women-shoes"
            );
        })
        .map((item) => (
            <div key={item.id} className="topItemCard" style={{cursor: "pointer"}} onClick={() => navigate(`/product/${item.id}`)}>
                <div className="topLabel">Top</div>
                <div className="imageContainIm">
                    <img src={item.images?.[0]} alt={item.name} className="topItemImage" />
                </div>
                <div className="topItemDetails">
                    <div className="topItemName">{item.name}</div>
                    <div className="ratingContainer">
                        {loading ? (
                            <span>Loading...</span>
                        ) : error ? (
                            <span>Error loading rating</span>
                        ) : (
                            <span className="stars">⭐ {finalRating || "No Rating"}</span>
                        )}
                    </div>
                </div>
            </div>
        ))
    }
</div>
                </div>

            </div>

                 
            )}

             {!isDesktop && (
  <div style={{ color: "black", padding: "10px" }}>
    {/* Header Section */}
    <div className="headerImage">
      <img
        src={brandDetails.headerImage}
        alt={`${brandName} Header`}
        className="headerImgStyle"
      />
      <div className="baasploaT">{brandName}</div>
    </div>

    {/* Mobile Department Selection */}
    <div className="blaDepartementforSmall">
      <div className="bladeprtforSmall">
        <img
          src={brandDetails.logo}
          alt={`${brandName} Logo`}
          className="logoImage"
        />

        <div className="departmentCategoriesForSmall">
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              overflowX: "auto",
              gap: "16px",
              padding: "10px 0",
            }}
          >
            {departments.map((department, index) => (
              <div key={index} style={{ minWidth: "120px" }}>
                <div
                  onClick={() =>
                    setExpandedDeptIndex(
                      index === expandedDeptIndex ? null : index
                    )
                  }
                  style={{
                    fontWeight: "bold",
                    cursor: "pointer",
                    color: "#333",
                    padding: "6px 10px",
                    borderRadius: "4px",
                    backgroundColor: "#f0f0f0",
                    textAlign: "center",
                  }}
                >
                  {department.name}
                </div>

                {expandedDeptIndex === index && (
                  <div style={{ paddingTop: "8px" }}>
                    {department.brandTypes.map((brandType, bIndex) => (
                      <div
                        key={bIndex}
                        className="clickableBrandTypeforsmall"
                        onClick={() =>
                          handleBrandTypeClick(department.name, brandType)
                        }
                        style={{
                          marginTop: "4px",
                          cursor: "pointer",
                          backgroundColor: "#fff",
                          border: "1px solid #ddd",
                          padding: "5px",
                          borderRadius: "3px",
                        }}
                      >
                        {brandType}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>

    {/* Best Seller Section */}
    {bestSeller && (
      <div style={{ marginTop: "20px", display: (isTablet) ? "grid" : (isVeryVerySmall) ? "" : "grid", gridTemplateColumns: (isTablet) ? "1fr 2fr" : "1fr 1fr", width: (isTablet) ? "100%" : "", margin: "1rem" }}>
        <div  style={{width:(isTablet) ? "400px" : "100%", height: (isTablet) ? "300px" : "300px", position: "relative"}}>
          {bestSeller.item.videos?.length > 0 ? (
            <div style={{cursor: "pointer"}} onClick={() => navigate(`/product/${bestSeller.id}`)}>
            <video autoPlay muted loop playsInline controls style={{ width: "100%", height: "100%", objectFit: "cover" }}>
              <source
                src={bestSeller.item.videos[0]}
                type="video/mp4"
              />
              Your browser does not support the video tag.
            </video>
            </div>
          ) : (
            <p>No video available</p>
          )}
        </div>

        <div onClick={() => navigate(`/product/${bestSeller.id}`)} style={{ position: "relative", width: "100%", cursor: "pointer" }}>
          <img
            src={bestSeller.item.images[0]}
            alt={bestSeller.item.name}
            style={{
              width: "100%",
              height: isVerySmall ? "230px" : "300px",
              objectFit: "contain",
              marginTop: "10px",
            }}
          />
          <div className="bestSellerBadge">Best Seller</div>
          <div className="bestSellerTitle">{bestSeller.item.name}</div>
        </div>
      </div>
    )}

    {/* Top-Selling Items: Shoes */}
    <div  style={{
    display: "grid",
    gridTemplateColumns:
      isVeryVerySmall ? "repeat(1, 1fr)" : "repeat(2, 1fr)",
    gap: "10px",
    padding: "10px",
  }}>
      {topItems
        .filter(
          (item) =>
            item.department?.toLowerCase() === "men-shoes" ||
            item.department?.toLowerCase() === "women-shoes"
        )
        .map((item) => (
          <div onClick={() => navigate(`/product/${item.id}`)} key={item.id} style={{ position: "relative", width: "100%", marginTop: "10px", cursor: "pointer" }} >
            <div className="topLabel" >Top</div>
            <div >
              <img
                src={item.images?.[0]}
                alt={item.name}
                style={{height: isVerySmall ? "230px" : "300px",  width: "100%",objectFit: "contain",}}
              />
            </div>
            <div >
              <div >{item.name}</div>
              <div >
                {loading ? (
                  <span>Loading...</span>
                ) : error ? (
                  <span>Error loading rating</span>
                ) : (
                  <span className="stars">⭐ {finalRating || "No Rating"}</span>
                )}
              </div>
            </div>
          </div>
        ))}
    </div>

    {/* Top-Selling Items: Other */}
    <div style={{
    display: "grid",
    gridTemplateColumns:
      isVeryVerySmall ? "repeat(1, 1fr)" : "repeat(2, 1fr)",
    gap: "10px",
    padding: "10px",
  }}>
      {topItems
        .filter(
          (item) =>
            item.department?.toLowerCase() !== "men-shoes" &&
            item.department?.toLowerCase() !== "women-shoes"
        )
        .map((item) => (
          <div onClick={() => navigate(`/product/${item.id}`)} key={item.id} style={{ position: "relative", width: "100%", marginTop: "10px", cursor: "pointer" }} >
            <div className="topLabel" >Top</div>
            <div >
              <img
                src={item.images?.[0]}
                alt={item.name}
                style={{height: isVerySmall ? "230px" : "300px",  width: "100%",objectFit: "contain",}}
              />
            </div>
            <div >
              <div >{item.name}</div>
              <div >
                {loading ? (
                  <span>Loading...</span>
                ) : error ? (
                  <span>Error loading rating</span>
                ) : (
                  <span className="stars">⭐ {finalRating || "No Rating"}</span>
                )}
              </div>
            </div>
          </div>
        ))}
    </div>
  </div>
)}



            {/* Footer Video
            <div style={{ width: "100%", height: "auto" }}>
                <img src={logvide} alt="Video" style={{ width: "100%" }} />
            </div>
             */}
        </div>
    );
}

export default Theme1;
