import React, { useEffect, useState } from 'react';
import useScreenSize from './useIsMobile';
import { useNavigate } from 'react-router-dom';

const ThemeForKidsFashion = () => {
  const { isDesktop, isMobile, isTablet, isSmallMobile, isVerySmall } = useScreenSize();
  const navigate = useNavigate();
  const [loadedImages, setLoadedImages] = useState({});

  useEffect(() => {
    const img = new Image();
    img.src = theme.image;
    img.onload = () => {
      setLoadedImages(prev => ({ ...prev, [theme.id]: true }));
    };
  }, []);
  

  const theme = {
    id: 451,
    theme: "Kids fashion",
    image: "https://api.malidag.com/images/1748702209351-ChatGPT%20Image%20May%2031,%202025,%2005_31_17%20PM.webp"
  };

  const brandCount = parseInt(localStorage.getItem('brandCount')) || 0;
  if (isDesktop && brandCount === 2) return null;

  

  const handleDiscoverClick = () => {
    navigate("/kidFashion");
  };

  return (
    <div style={{
     padding: (isSmallMobile || isVerySmall) ? "0.5rem" : "1rem",
      marginLeft: (isSmallMobile || isVerySmall) ? "" : '1rem',
      overflow: 'hidden',
      width: (isDesktop || isTablet || isMobile) ? '270px' : "100%",
      boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)',
      backgroundColor: '#fdfdfd',
      borderRadius: (isDesktop || isMobile || isTablet) ? "0px" : "0px",
      marginTop:(isSmallMobile || isVerySmall) ? "0rem" : "1rem",
      marginBottom:(isSmallMobile || isVerySmall) ? "0rem" : "1rem"
    }}>
      <div style={{
        padding: '1rem',
        fontSize: (isDesktop || isTablet || isMobile) ? '1.5rem' : "1rem",
        fontWeight: 'bold',
        color: '#333',
        backgroundColor: '#fafafa',
        textAlign: 'center',
        borderBottom: '1px solid #eee',
      }}>
        Kids fashion
      </div>

      <div style={{ width:(isSmallMobile || isVerySmall) ? "100%" : '100%', height:(isSmallMobile || isVerySmall) ? "auto" : 'auto', backgroundColor: "#ddd5"}}>
          <img
            src={theme.image}
            alt={theme.theme}
             loading="lazy"
            onClick={handleDiscoverClick}
            style={{
                cursor: "pointer",
              width: '100%',
              height: (isSmallMobile || isVerySmall) ? "auto" : 'auto',
              display: 'block',
              opacity: loadedImages[theme.id] ? 1 : 1,
              objectFit: 'cover',
              transition: 'opacity 0.3s ease-in-out'
            }}
          />
      </div>

      {(isDesktop || isTablet || isMobile) && (
        <div
          onClick={handleDiscoverClick}
          style={{
            cursor: "pointer",
            color: "blue",
            marginTop: "1rem",
            fontSize: "0.8rem",
            textDecoration: "underline",
            marginLeft: "1rem"
          }}
        >
          discover now
        </div>
      )}
    </div>
  );
};

export default ThemeForKidsFashion;
