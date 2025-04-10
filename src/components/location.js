import React, {useState} from "react";
import useScreenSize from "./useIsMobile";

function Location({ country, allCountries,}) {
     const [isOpen, setIsOpen] = useState(false);
     const {isMobile, isDesktop, isSmallMobile, isTablet, isVerySmall} = useScreenSize()

    const flagUrl = `https://flagcdn.com/w320/${country.code}.png`;

    const toggleDropdown = () => setIsOpen(!isOpen);

    return(
       
        <div style={{position: "relative", alignItems: "center", width: "auto", marginRight: "30px"}}>
        <div
          onClick={toggleDropdown}
          style={{
            border: (isMobile || isSmallMobile || isVerySmall) ? "0" : "1px solid #ccc",
            padding:(isMobile || isSmallMobile || isVerySmall) ? "5px" : "10px",
            borderRadius:(isMobile || isSmallMobile || isVerySmall) ? "0" : "2px",
            cursor: "pointer",
            width: "100%",
            display: "flex",
            alignItems: "center",
            height: (isMobile || isSmallMobile || isVerySmall) ? "auto" : "20px",
            marginTop: (isMobile || isSmallMobile || isVerySmall) ? "0px" : "10px",
            backgroundColor: (isMobile || isSmallMobile || isVerySmall) ? " rgb(3, 29, 48)" : "#333",
            justifyContent: (isMobile || isSmallMobile || isVerySmall) ? "start" : "center",
             marginBottom: (isMobile || isSmallMobile || isVerySmall) ? "0px" : "5px",
             marginRight: "5px",
             marginLeft: "5px"
          }}
        >
          <span style={{display: (isMobile || isSmallMobile || isVerySmall) ? "flex" : "",}}>
            {(isMobile || isSmallMobile || isVerySmall) && (
                <div>🏠</div>
            )}
            <div style={{ textAlign: "center", fontSize: "11px", marginTop: (isMobile || isSmallMobile || isVerySmall) ? "5px" : "0px", marginRight: (isMobile || isSmallMobile || isVerySmall) ? "5px" : "0px", }}>
              deliver to{" "}
            </div>
            {(isTablet || isDesktop) && (
            <img
              src={flagUrl}
              alt={country.name}
              style={{ width: "20px", marginRight: "10px", textAlign: "center" }}
            />
        )}
        {(isDesktop || isTablet) && (
            country.code
        )}
            {(isMobile || isSmallMobile || isVerySmall ) && (
                <div style={{marginTop: "5px", fontSize: "12px", fontWeight: "bold"}}>
                {country.name}
                </div>
            )}
          </span>
          <span style={{ marginLeft: "5px" }}>▼</span>
        </div>

        {isOpen && (
          <div
            style={{
              position: "absolute",
              backgroundColor: "#fff",
              border: "1px solid #ccc",
              maxHeight: "300px",
              overflowY: "scroll",
              zIndex: 1000,
              marginTop: "5px",
            }}
          >
            {allCountries.map((c) => (
              <div
                key={c.name}
                onClick={() => {
                  setCountry(c);
                  setIsOpen(false);
                }}
                style={{
                  color: "black",
                  padding: "10px",
                  display: "flex",
                  alignItems: "center",
                  cursor: "pointer",
                }}
              >
                <img
                  src={c.flag}
                  alt={c.name}
                  style={{ width: "20px", marginRight: "10px" }}
                />
                <span>{c.name}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    )
}

export default Location