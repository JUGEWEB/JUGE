import React, { useEffect, useState } from 'react';
import useScreenSize from './useIsMobile';
import { useNavigate } from 'react-router-dom';

const ThemeForFashionKick = () => {
  const { isDesktop, isMobile, isTablet, isSmallMobile, isVerySmall } = useScreenSize();
  const navigate = useNavigate();

  const theme = {
    id: 1,
    theme: "Fashion's kick",
    image: "https://api.malidag.com/images/1745586262836-Screenshot_7.webp"
  };

  const brandCount = parseInt(localStorage.getItem('brandCount')) || 0;
  if (isDesktop && brandCount === 2) return null;

  

  const handleDiscoverClick = () => {
    navigate("/faKick");
  };

  return (
    <div style={{
      marginLeft: '1rem',
      overflow: 'hidden',
      width: (isDesktop || isTablet || isMobile) ? '270px' : "150px",
      boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)',
      backgroundColor: '#fdfdfd',
      borderRadius: (isDesktop || isMobile || isTablet) ? "0px" : "0px",
      marginTop: "1rem",
      marginBottom: "1rem"
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
        Fashion Kick
      </div>

      <div style={{ width:(isSmallMobile || isVerySmall) ? "150px" : '100%', height:(isSmallMobile || isVerySmall) ? "170px" : 'auto', backgroundColor: "#ddd5"}}>
          <img
            src={theme.image}
            alt={theme.theme}
            onClick={handleDiscoverClick}
            style={{
              width: '100%',
              height: (isSmallMobile || isVerySmall) ? "100%" : 'auto',
              display: 'block',
              objectFit: 'cover',
              transition: 'opacity 0.3s ease-in-out'
            }}
          />
      </div>

      {(isDesktop || isTablet || isMobile) && (
        <div
          onClick={handleDiscoverClick}
          style={{
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

export default ThemeForFashionKick;
