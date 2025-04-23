import React, { useEffect, useState } from 'react';
import useScreenSize from './useIsMobile';
import { useNavigate } from 'react-router-dom';

const ThemeForFashionKick = () => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const { isDesktop, isMobile, isTablet } = useScreenSize();
  const navigate = useNavigate();

  const theme = {
    id: 1,
    theme: "Fashion's kick",
    image: "https://api.malidag.com/images/1744938259183-1734827472068-1734655782065-Untitled design (3).png"
  };

  const brandCount = parseInt(localStorage.getItem('brandCount')) || 0;
  if (isDesktop && brandCount === 2) return null;

  useEffect(() => {
    const img = new Image();
    img.src = theme.image;
    img.onload = () => setImageLoaded(true);
  }, []);

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
      borderRadius: (isDesktop || isMobile || isTablet) ? "0px" : "20px",
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

      <div style={{ width: '100%', height: 'auto' }}>
        {!imageLoaded ? (
          <div style={{
            width: '100%',
            height: '180px',
            backgroundColor: '#eee',
            animation: 'pulse 2s infinite',
            borderRadius: '4px'
          }}></div>
        ) : (
          <img
            src={theme.image}
            alt={theme.theme}
            onClick={handleDiscoverClick}
            style={{
              width: '100%',
              height: 'auto',
              display: 'block',
              objectFit: 'cover',
              borderRadius: '4px',
              transition: 'opacity 0.3s ease-in-out'
            }}
          />
        )}
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
