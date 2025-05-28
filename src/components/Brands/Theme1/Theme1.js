import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // ✅ Import useNavigate
import { useLocation } from "react-router-dom";
import useFinalRating from "../../finalRating";
import "./Baasploa.css";

function Theme1() {
    const [departments, setDepartments] = useState([]);
    const [topItems, setTopItems] = useState([]);
    const [bestSeller, setBestSeller] = useState(null);
    const { finalRating, loading, error } = useFinalRating(topItems?.itemId || 0);
    const location = useLocation();
    const brandName = location.state?.brandName || "default-brand"; // fallback
    const [brandDetails, setBrandDetails] = useState({ headerImage: "", logo: "" });


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
            <div key={item.id} className="topItemCard">
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
                                <div className="videoContainer">
                                    <video autoPlay muted loop playsInline controls>
                                        <source src={bestSeller?.item?.videos[0]} type="video/mp4" />
                                        Your browser does not support the video tag.
                                    </video>
                                </div>
                            ) : (
                                <p>No video available</p>
                            )}

                            <div className="bestSellerContainer">
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
            <div key={item.id} className="topItemCard">
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


            {/* Footer Video
            <div style={{ width: "100%", height: "auto" }}>
                <img src={logvide} alt="Video" style={{ width: "100%" }} />
            </div>
             */}
        </div>
    );
}

export default Theme1;
