import React, { useEffect, useState } from 'react';
import axios from 'axios';
import useScreenSize from './useIsMobile';
import { useNavigate } from 'react-router-dom';

const ThemeForMenFashion = () => {
 
  const { isDesktop, isMobile, isTablet, isSmallMobile, isVerySmall } = useScreenSize();
   const navigate = useNavigate();

   const theme = {
    id: 2,
    theme: "Men fashion",
    image: "https://api.malidag.com/images/1745544015775-fashionkick-Picsart-AiImageEnhancer.webp"
  };

  const brandCount = parseInt(localStorage.getItem('brandCount')) || 0;

  // ❌ On desktop, hide if brandCount is 3 or more
  if (isDesktop && brandCount === 1) return null;

  if (!theme) return null;

  const handleDiscoverClick = () => {
    navigate("/menfa");
  };

  return (
    <div style={{
      marginLeft: '1rem',
      overflow: 'hidden',
      width:(isDesktop || isMobile || isTablet) ? '270px' : "150px",
      borderRadius:(isDesktop || isMobile || isTablet) ? "0px" : "0px",
      boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)',
      backgroundColor: '#fdfdfd',
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
        Men fashion
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
        }}
      />
      </div>
        {(isDesktop || isMobile || isTablet) && (
     
      <div onClick={handleDiscoverClick} style={{color: "blue", marginTop: "4rem", fontSize: "0.8rem", textDecoration: "underline", marginLeft: "1rem"}}>discover now</div>
             
    )}
    </div>
  );
};

export default ThemeForMenFashion;
