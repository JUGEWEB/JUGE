import React, { useEffect, useState } from 'react';
import axios from 'axios';
import useScreenSize from './useIsMobile';

const ThemeForMenFashion = () => {
  const [theme, setTheme] = useState(null);
  const { isDesktop, isMobile, isTablet } = useScreenSize();

  useEffect(() => {
    const fetchTheme = async () => {
      try {
        const res = await axios.get('http://192.168.0.210:3034/themes');
        const allThemes = res.data.themes;

        const selected = allThemes.find(
          t => t.theme === "Men fashion" && t.mode === 'full'
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

  const brandCount = parseInt(localStorage.getItem('brandCount')) || 0;

  // ❌ On desktop, hide if brandCount is 3 or more
  if (isDesktop && brandCount === 1) return null;

  if (!theme) return null;

  return (
    <div style={{
      marginLeft: '1rem',
      overflow: 'hidden',
      width:(isDesktop || isMobile || isTablet) ? '270px' : "150px",
      borderRadius:(isDesktop || isMobile || isTablet) ? "0px" : "20px",
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
        {theme.theme}
      </div>

      <img
        src={theme.image}
        alt={theme.theme}
        style={{
          width: '100%',
          height: 'auto',
          display: 'block',
          objectFit: 'cover',
        }}
      />
        {(isDesktop || isMobile || isTablet) && (
     
      <div style={{color: "blue", marginTop: "4rem", fontSize: "0.8rem", textDecoration: "underline", marginLeft: "1rem"}}>discover now</div>
             
    )}
    </div>
  );
};

export default ThemeForMenFashion;
