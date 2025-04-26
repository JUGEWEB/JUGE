import React, { useEffect, useState } from 'react';
import axios from 'axios';
import useScreenSize from './useIsMobile';

const ThemeWithText = () => {
  const [theme, setTheme] = useState(null);
  const {isMobile, isDesktop, isSmallMobile, isTablet, isVerySmall} = useScreenSize()
  const [loadedImages, setLoadedImages] = useState({});

  const loadTheme = {
    id: 2,
    theme: "Hot deals",
    image: "https://api.malidag.com/images/1744938620683-1742913356938-steptodown.com510219.webp"
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

        const selected = allThemes.find(t =>
          t.mode === 'text-image' &&
          t.theme.includes('Explore our top brands')
        );

        if (selected) {
          setTheme(selected);
        }
      } catch (error) {
        console.error('Error fetching themes:', error);
      }
    };

    fetchTheme();
  }, []);
  
  

  if (!theme) return null;

  return (
    <div style={{
      overflow: 'hidden',
      width:(isDesktop || isMobile || isTablet) ? '270px' : "150px",
      height: "auto",
      justifyContent: "space-between",
      padding: "1rem"
     
    }}>
      <div style={{
        padding:(isDesktop || isMobile || isTablet) ? '1.5rem' : "1rem",
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize:(isDesktop || isMobile || isTablet) ? '1.5rem' : "0.9rem",
        fontWeight: 'bold',
        color: '#333',
         backgroundColor: '#f9f9f9'
      }}>
        Explore our top brands and shop with brands
      </div>

      <div style={{width: "100%", height: "190px"}}>
      {theme.image && (
        <img
          src={theme.image}
          alt={theme.theme}
          loading="lazy"
          style={{
            maxWidth: '100%',
            height: 'auto',
            objectFit: 'cover',
            opacity: loadedImages[loadTheme.id] ? 1 : 1,
           marginTop: "30px"
          }}
        />
      )}
      </div>
    </div>
  );
};

export default ThemeWithText;
