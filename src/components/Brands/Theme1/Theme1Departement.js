import React, { useState, useEffect } from "react";
import "./BrandDepartment.css";
import axios from 'axios';
import { useLocation, useNavigate } from "react-router-dom";
import useScreenSize from "../../useIsMobile";


function Theme1Department() {
    const location = useLocation();
    const navigate = useNavigate();

    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [departments, setDepartments] = useState([]);
    const { isDesktop, isMobile, isVerySmall, isSmallMobile, isTablet, isVeryVerySmall } = useScreenSize();
    const [expandedDeptIndex, setExpandedDeptIndex] = useState(null);

    const [brandDetails, setBrandDetails] = useState({ logo: "", headerImage: "" });

    const params = new URLSearchParams(location.search);
    const department = params.get("department");
    const brandType = params.get("brandType");

    const brandName = location.state?.brandName || "default-brand";

    useEffect(() => {
    const fetchBrandTheme = async () => {
        try {
            const res = await fetch("https://api.malidag.com/api/brands/themes");
            const data = await res.json();
            const brand = data.find(
                b => b.brandName.trim().toLowerCase() === brandName.trim().toLowerCase()
            );
            if (brand) {
                setBrandDetails({
                    logo: brand.logo,
                    headerImage: brand.headerImage,
                    theme: brand.theme // ✅ Add this
                });
            }
        } catch (err) {
            console.error("Theme fetch error:", err);
        }
    };

    fetchBrandTheme();
}, [brandName]);


    useEffect(() => {
        // Fetch department structure
        fetch(`https://api.malidag.com/api/brands/${brandName}`)
            .then((res) => res.json())
            .then((data) => setDepartments(data.departments || []))
            .catch((err) => console.error("Department fetch error:", err));
    }, [brandName]);

    useEffect(() => {
        if (!department || !brandType) return;

        setLoading(true);
        setError(null);

        axios.get(`https://api.malidag.com/api/brands/${brandName}/items`)
            .then((res) => {
                const filtered = res.data.filter(item =>
                    item.item?.department === department &&
                    item.item?.brandType === brandType
                );
                setItems(filtered);
                setLoading(false);
            })
            .catch((err) => {
                setError(err.message);
                setLoading(false);
            });
    }, [department, brandType, brandName]);

    return (
        <div>
             {isDesktop && (
        <div className="brandDepartmentContainer">
            <div className="blaDepartement" style={{ color: "black" }}>
                <div className="bladeprt">
                    <div>
                        <img src={brandDetails.logo} alt={`${brandName} Logo`} className="logoImage" />
                        <div className="departementTitle">Departments</div>
                        <div className="departmentCategories">
                            <ul>
                                {departments.map((dep, index) => (
                                    <li key={index}>
                                        <strong>{dep.name}</strong>
                                        <ul>
                                            {dep.brandTypes.map((brand, bIndex) => (
                                                <li
                                                    key={bIndex}
                                                    className={`clickableBrandType ${brand === brandType && dep.name === department ? "selectedBrandType" : ""}`}
                                                    onClick={() =>
              navigate(`/${brandDetails.theme?.toLowerCase()}department?department=${dep.name}&brandType=${brand}`, {
                state: { brandName }
              })
            }
                                                >
                                                    {brand}
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

            <div className="rightColumn">
                {loading && <p className="loadingMessage">Loading items...</p>}
                {error && <p className="errorMessage">Error: {error}</p>}

                <div  style={{
  display: "grid",
  gap: "5px",
 
  padding: "5px",
  gridTemplateColumns: "repeat(3, 1fr)",
}}>
                    {items.map((item) => (
                        <div key={item.id} >
                            <div style={{filter: "brightness(0.9) contrast(1.2)", cursor: "pointer"}} onClick={() => navigate(`/product/${item.id}`, { state: { brandName } })}>
                            <img src={item.item.images[0]} alt={item.item.name} style={{ width: "100%", height: "250px", backgroundColor: "white", objectFit: "contain"}} />
                            </div>
                            <div className="itemDetails"  onClick={() => navigate(`/product/${item.id}`, { state: { brandName } })}
  style={{ cursor: "pointer" }}>
                                <h3 className="itemTitle" style={{color: "black"}}>{item.item.name}</h3>
                                <p className="itemPrice">Price: ${item.item.usdPrice}</p>
                               <div
  onClick={() => navigate(`/product/${item.id}`, { state: { brandName } })}
  style={{
    color: "#007bff",
    textDecoration: "underline",
    cursor: "pointer",
    marginTop: "5px"
  }}
>
  View
</div>

                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
        )}

        {!isDesktop && (
  <div style={{ padding: "10px", maxWidth: "100%", overflow: "hidden" }}>
    {/* Department List */}
    <div style={{position: "relative"}}>
      <img src={brandDetails.logo} alt={`${brandName} Logo`} style={{ width: "150px" }} />
      {/* Department Scroll Row */}
   <div style={{ position: "relative" }}>
  {/* This container floats above the rest */}
  <div
    style={{
      position: "absolute",
      top: 0,
      width: "100%",
      zIndex: 1000,
      padding: "10px",
     
    }}
  >
    <div
      style={{
        display: "flex",
        overflowX: "auto",
        gap: "16px",
        color: "black",
      }}
    >
      {departments.map((dep, index) => (
        <div
          key={index}
          style={{
            minWidth: "140px",
            position: "relative", // required for dropdown inside
            flexShrink: 0,
          }}
        >
          <div
            onClick={() =>
              setExpandedDeptIndex(expandedDeptIndex === index ? null : index)
            }
            style={{
              fontWeight: "bold",
              cursor: "pointer",
              textAlign: "center",
              border: "1px solid #222",
              borderRadius: "4px",
              padding: "8px",
             
            }}
          >
            {dep.name}
          </div>

          {/* Dropdown appears on top of lower content */}
          {expandedDeptIndex === index && (
            <div
              style={{
               
                top: "100%",
                left: 0,
                width: "100%",
                background: "white",
                border: "1px solid #ccc",
                boxShadow: "0px 4px 8px rgba(0,0,0,0.1)",
                maxHeight: "300px",
                overflowY: "auto",
              
              }}
            >
              {dep.brandTypes.map((brand, bIndex) => (
                <div
                  key={bIndex}
                  onClick={() =>
                    navigate(
                      `/${brandDetails.theme?.toLowerCase()}department?department=${dep.name}&brandType=${brand}`,
                      { state: { brandName } }
                    )
                  }
                  style={{
                    padding: "8px",
                    borderBottom: "1px solid #eee",
                    textAlign: "center",
                    cursor: "pointer",
                  }}
                >
                  {brand}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  </div>
</div>



    {/* Item Grid */}
    <div style={{position: "relative", marginTop: "50px"}}>
    <div
     style={{
  display: "grid",
  gap: "5px",
 
  padding: "5px",
  gridTemplateColumns:
    isVerySmall
      ? "repeat(2, 1fr)"
      : isVeryVerySmall
      ? "repeat(1, 1fr)"
      : isSmallMobile
      ? "repeat(2, 1fr)"
      : isMobile
      ? "repeat(3, 1fr)"
      : isTablet
      ? "repeat(4, 1fr)"
      : "repeat(5, 1fr)",
}}
    >
      {items.map((item) => (
        <div key={item.id} style={{ padding: "10px" }}>
            <div style={{cursor: "pointer", filter: "brightness(0.880000000) contrast(1.2)", width: "100%", height:(isVerySmall) ? "230px" :  "250px", backgroundColor: "white"}}  onClick={() => navigate(`/product/${item.id}`, { state: { brandName } })}>
          <img
            src={item.item.images[0]}
            alt={item.item.name}
            style={{ width: "100%", height:(isVerySmall) ? "230px" :  "250px", objectFit: "contain" }}
          />
          </div>
          <div style={{ marginTop: "10px", color: "black" }} onClick={() => navigate(`/product/${item.id}`, { state: { brandName } })}>
            <div style={{cursor: "pointer"}}  >{item.item.name}</div>
            <div style={{ fontWeight: "bold" }}>${item.item.usdPrice}</div>
            <a  target="_blank" rel="noopener noreferrer">
              View
            </a>
          </div>
        </div>
      ))}
      </div>
      </div>
    </div>
  </div>
)}

        </div>
    );
}

export default Theme1Department;
