// hooks/useScreenSize.js
import { useState, useEffect } from "react";

function getScreenSize() {
  const width = window.innerWidth;
  return {
    isVeryVerySmall: width<345,
    isVerySmall: width>=345 && width<= 480,
    isSmallMobile: width > 480 && width <= 600,
    isMobile: width > 600 && width < 768,
    isTablet: width >= 768 && width < 1024,
    isDesktop: width >= 1024
  };
}

export default function useScreenSize() {
  const [screenSize, setScreenSize] = useState(getScreenSize());

  useEffect(() => {
    const handleResize = () => setScreenSize(getScreenSize());
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return screenSize;
}