import React, { useState, useEffect } from "react";
import "./BrandDepartment.css";
import axios from 'axios'
import { useLocation, useNavigate } from "react-router-dom"; // ✅ Import useLocation & useNavigate
import log from "./images/logo/logo.png";

function BrandDepartment() {
    const location = useLocation(); // ✅ Get current URL location
    const navigate = useNavigate(); // ✅ For navigation

    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [departments, setDepartments] = useState([]);

    // ✅ Extract department & brandType from URL query parameters
    const params = new URLSearchParams(location.search);
    const department = params.get("department");
    const brandType = params.get("brandType");

    console.log("department & brandType:", department, brandType); // Debugging

    useEffect(() => {
        fetch("https://api.malidag.com/api/brands/blaasploa")
            .then((response) => response.json())
            .then((data) => setDepartments(data.departments || []));
    }, []);

    useEffect(() => {
        if (!department || !brandType) return;

        setLoading(true);
        setError(null);

        axios.get("https://api.malidag.com/api/brands/blaasploa/items")
            .then((response) => {
                const allItems = response.data;

                // ✅ Filter items in JavaScript
                const filteredItems = allItems.filter(item =>
                    item.item?.department === department && 
                    item.item?.brandType === brandType
                );

                setItems(filteredItems);
                setLoading(false);
            })
            .catch((err) => {
                setError(err.message);
                setLoading(false);
            });
    }, [department, brandType]);

    return (
        <div className="brandDepartmentContainer">
            {/* Sidebar - Departments List */}
            <div className="blaDepartement" style={{ color: "black" }}>
                <div className="bladeprt">
                    <div>
                        <img src={log} alt="Baasploa Logo" className="logoImage" />
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
                                                    onClick={() => navigate(`/brand-department?department=${dep.name}&brandType=${brand}`)}
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

            {/* Right column: items display */}
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
                                <a href={item.item.link} target="_blank" rel="noopener noreferrer" className="viewItemButton">
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

export default BrandDepartment;
