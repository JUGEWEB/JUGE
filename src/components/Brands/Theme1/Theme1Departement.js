import React, { useState, useEffect } from "react";
import "./BrandDepartment.css";
import axios from 'axios';
import { useLocation, useNavigate } from "react-router-dom";

function Theme1Department() {
    const location = useLocation();
    const navigate = useNavigate();

    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [departments, setDepartments] = useState([]);
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

                <div className="itemsGrid">
                    {items.map((item) => (
                        <div key={item.id} className="itemCard">
                            <img src={item.item.images[0]} alt={item.item.name} className="itemImage" />
                            <div className="itemDetails">
                                <h3 className="itemTitle">{item.item.name}</h3>
                                <p className="itemPrice">Price: ${item.item.usdPrice}</p>
                                <a
                                    href={item.item.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="viewItemButton"
                                >
                                    View Item
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Theme1Department;
