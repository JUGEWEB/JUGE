import React, {useState} from "react";
import useScreenSize from "./useIsMobile";
import { Dropdown, Menu, Button } from "antd";
import { DownOutlined } from "@ant-design/icons";

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
  <div style={{ margin: "10px", maxWidth: "100%", maxHeight: "100%" }}>
   <Dropdown
  overlay={menu}
  placement="bottomLeft"
  trigger={["click"]}
  getPopupContainer={(triggerNode) => triggerNode.parentNode}
>

      <Button
        style={{
          display: "flex",
          alignItems: "center",
          backgroundColor:
            isMobile || isSmallMobile || isVerySmall ? "rgb(3, 29, 48)" : "#333",
          color: "#fff",
          border: "1px solid #ccc",
          padding: "5px 10px",
          fontSize: "12px",
          width: "100%",
          justifyContent:
            isMobile || isSmallMobile || isVerySmall ? "flex-start" : "center",
        }}
      >
        <span style={{ display: "flex", alignItems: "center" }}>
          {(isMobile || isSmallMobile || isVerySmall) && <span>🏠</span>}
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
      </Button>
    </Dropdown>
  </div>
);
}

export default Location