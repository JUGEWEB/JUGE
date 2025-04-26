import React, { useEffect, useState } from 'react';
import axios from 'axios';
import useScreenSize from './useIsMobile';
import { useNavigate } from 'react-router-dom';

const ThemeForGamers = () => {
  const [theme, setTheme] = useState(null);
  const { isDesktop, isMobile, isTablet, isSmallMobile, isVerySmall } = useScreenSize();
  const navigate = useNavigate();
   const [loadedImages, setLoadedImages] = useState({});
   
   const loadTheme = {
    id: 2435,
    theme: "Game product",
    image: "https://api.malidag.com/images/1745672632373-game7.webp"
  };
  
   useEffect(() => {
           const img = new Image();
           img.src = loadTheme.image;
           img.onload = () => {
             setLoadedImages(prev => ({ ...prev, [loadTheme.id]: true }));
           };
         }, []);

  useEffect(() => {
    const fetchTheme = async () => {
      try {
        const res = await axios.get('https://api.malidag.com/themes/');
        const allThemes = res.data.themes;

        const selected = allThemes.find(
          t => t.theme === "Products for gamers" && t.mode === 'full'
        );

        if (selected) {
          setTheme(selected);
        }
      } catch (error) {
        console.error('Error fetching theme:', error);
      }
    };

    fetchTheme();
  }, []);

  

  if (!theme) return null;

  const handleDiscoverClick = () => {
    navigate("/themeForGamers");
  };

  return (
    <div style={{
      marginLeft: '1rem',
      padding: (isDesktop) ? "1rem" : "0rem",
      overflow: 'hidden',
      width: (isDesktop || isTablet || isMobile) ? '270px' : "150px",
      borderRadius:(isDesktop || isMobile || isTablet) ? "0px" : "0px",
      boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)',
      backgroundColor: '#fdfdfd',
      marginTop: (isDesktop) ? "0rem" : "1rem",
      marginBottom: "1rem",
      marginRight: (isDesktop) ? "1rem" : "0rem"
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
        Products for gamers
      </div>
      <div style={{ width:(isSmallMobile || isVerySmall) ? "150px" : '100%', height:(isSmallMobile || isVerySmall) ? "170px" : 'auto', backgroundColor: "#ddd5"}}>
      <img
        src={theme.image}
        alt={theme.theme}
        loading="lazy"
        onClick={handleDiscoverClick}
        style={{
          width: '100%',
          height: (isSmallMobile || isVerySmall) ? "100%" : 'auto',
          display: 'block',
          opacity: loadedImages[loadTheme.id] ? 1 : 1,
          objectFit: 'cover',
        }}
      />
      </div>
        {(isDesktop || isMobile || isTablet) && (
   
      <div  onClick={handleDiscoverClick} style={{color: "blue", marginTop: "4rem", fontSize: "0.8rem", textDecoration: "underline", marginLeft: "1rem"}}>discover now</div>
               
    )}
    </div>
  );
};

export default ThemeForGamers;
