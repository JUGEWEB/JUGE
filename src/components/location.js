import React, {useState} from "react";
import useScreenSize from "./useIsMobile";
import { Dropdown, Menu, Button } from "antd";
import { DownOutlined } from "@ant-design/icons";
import { FiMapPin } from "react-icons/fi"; // Feather Icons – clean & minimal


function Location({ country, allCountries, setCountry }) {
     const [isOpen, setIsOpen] = useState(false);
     const {isMobile, isDesktop, isSmallMobile, isTablet, isVerySmall} = useScreenSize()

    const flagUrl = `https://flagcdn.com/w320/${country.code}.png`;
    console.log(country, allCountries);


     // Create the dropdown menu
  const menu = (
    <Menu>
      {allCountries.map((c) => (
        <Menu.Item
          key={c.code}
          onClick={() => setCountry(c)}
          style={{ display: "flex", alignItems: "center" }}
        >
          <img src={c.flag} alt={c.name} style={{ width: 20, marginRight: 10 }} />
          {c.name}
        </Menu.Item>
      ))}
    </Menu>
  );

    const toggleDropdown = () => setIsOpen(!isOpen);

    return (
  <div style={{ margin: "0px", maxWidth: "100%", maxHeight: "100%" }}>
   <Dropdown
  overlay={menu}
  placement="bottomLeft"
  trigger={["click"]}
  getPopupContainer={(triggerNode) => triggerNode.parentNode}
>

      <div
        style={{
          display:  isMobile || isSmallMobile || isVerySmall ? "flex" : "",
          alignItems: "center",
          backgroundColor:
            isMobile || isSmallMobile || isVerySmall ?  "#0d1b2a" : "#333",
          color: "#fff",
          fontSize: "12px",
          width: "100%",
          justifyContent:
            isMobile || isSmallMobile || isVerySmall ? "flex-start" : "center",
        }}
      >
        <span style={{ display: "flex", alignItems: "center" }}>
          {(isMobile || isSmallMobile || isVerySmall) && <span> <FiMapPin style={{ fontSize: "16px", marginRight: "4px" }} /></span>}
          <span
            style={{
              fontSize: "11px",
              marginRight: "5px",
              marginLeft: "5px",
              textAlign: "center",
            }}
          >
            deliver to
          </span>
          {(isTablet || isDesktop) && (
            <>
              <img
                src={flagUrl}
                alt={country.name}
                style={{ width: "20px", marginRight: "10px" }}
              />
              {country.code}
            </>
          )}
          {(isMobile || isSmallMobile || isVerySmall) && (
            <span style={{ fontSize: "12px", fontWeight: "bold" }}>
              {country.name}
            </span>
          )}
        </span>
        <DownOutlined style={{ fontSize: "10px", marginLeft: "6px" }} />
      </div>
    </Dropdown>
  </div>
);
}

export default Location