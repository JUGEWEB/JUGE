import React, { useEffect, useState } from 'react';
import axios from 'axios';
import useScreenSize from './useIsMobile';

const ThemeWithText = () => {
  const [theme, setTheme] = useState(null);
  const {isMobile, isDesktop, isSmallMobile, isTablet, isVerySmall} = useScreenSize()

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
        {theme.theme.replace(/"/g, '')}
      </div>
      {theme.image && (
        <img
          src={theme.image}
          alt={theme.theme}
          style={{
            maxWidth: '100%',
            height: 'auto',
            objectFit: 'cover',
           marginTop: "30px"
          }}
        />
      )}
    </div>
  );
};

export default ThemeWithText;
