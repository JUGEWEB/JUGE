import React from "react";
import { useLocation } from "react-router-dom";
import useScreenSize from "./useIsMobile";
import { useNavigate } from "react-router-dom";



function SpanWarnings () {
    const {isTablet, isDesktop} = useScreenSize()
    const location = useLocation();
     const navigate = useNavigate();

    // Return nothing if not on homepage
  if (location.pathname !== "/") return null;

    return(
        <div style={{backgroundColor: "#ddd5", width: "100%", height: "100%"}}>
             {!(isTablet || isDesktop) && (
<span className="span-warningsmall" style={{backgroundColor: "#ddd5", maxWidth: "100%", maxHeight: "100%", margin: "0px" }}>
  We are displaying products that ship to your location. You can select a different location in the menu above.  
  <span
            onClick={() => navigate("/international-shipping")}
            style={{
              color: "blue",
              marginLeft: "5px",
              textDecoration: "underline",
              cursor: "pointer"
            }}
          >
            Learn about international shipping here
          </span>
</span>
)}
        </div>
    )
}

export default SpanWarnings