import React from "react";
import { useLocation } from "react-router-dom";
import useScreenSize from "./useIsMobile";


function SpanWarnings () {
    const {isTablet, isDesktop} = useScreenSize()
    const location = useLocation();

    // Return nothing if not on homepage
  if (location.pathname !== "/") return null;

    return(
        <div>
             {!(isTablet || isDesktop) && (
<span className="span-warningsmall" style={{backgroundColor: "#ddd5", maxWidth: "100%", maxHeight: "100%", margin: "10px" }}>
  We are displaying products that ship to your location. You can select a different location in the menu above.  
  <a href="/international-shipping" style={{ color: "blue", marginLeft: "5px", textDecoration: "underline" }}>
    Learn about international shipping here
  </a>
</span>
)}
        </div>
    )
}

export default SpanWarnings