import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import useScreenSize from './useIsMobile';
import './themeSkeleton.css';

const themes = [
  {
    id: 1,
    type: "Perfume",
    url: "https://api.malidag.com/images/1744935328707-1734648207643-transparent-perfume-bottle-flowers-pink-wall-spring-wall-with-aroma-perfume-flat-lay.jpg",
  },
  {
    id: 2,
    type: "Eyebrow",
    url: "https://api.malidag.com/images/1744935570674-1734648857748-comparison-different-types-brush-strokes.jpg",
  },
  {
    id: 3,
    type: "Make-up",
    url: "https://api.malidag.com/images/1744935668110-1734646823425-creative-display-makeup-products-arrangement.jpg",
  },
  {
    id: 4,
    type: "Skincare",
    url: "https://api.malidag.com/images/1744935707885-1734646785153-close-up-body-butter-recipient.jpg",
  },
];

const ThemeForPersonnalSmall = () => {
  const { isMobile, isDesktop, isSmallMobile, isTablet, isVerySmall } = useScreenSize();
  const location = useLocation();
  const [loadedImages, setLoadedImages] = useState({}); // ✅ Keep track of loaded images

  useEffect(() => {
    themes.forEach((theme) => {
      const img = new Image();
      img.src = theme.url;
      img.onload = () => {
        setLoadedImages(prev => ({ ...prev, [theme.id]: true }));
      };
    });
  }, []); // Preload once on mount

  if ((isMobile || isSmallMobile || isVerySmall) && location.pathname !== "/") {
    return null;
  }

  return (
    <div style={{ padding: (isSmallMobile || isVerySmall) ? "0rem" : '0rem' }}>
      <span style={{ marginTop: (isSmallMobile || isVerySmall) ? "0rem" : '', fontWeight: "bold" }}>
        Personal care for you
      </span>

      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        overflowX: "auto",
        gap: "10px",
        marginTop: "10px",
      }}>
        {themes.map((theme) => (
          <div key={theme.id} style={{
            width: '140px',
            textAlign: 'center',
            background: '#fff',
            padding: '0.5rem',
            borderRadius: '8px',
          }}>
            <img
              src={theme.url}
              alt={theme.type}
              style={{
                width: '70px',
                height: '70px',
                borderRadius: '50%',
                objectFit: 'cover',
                marginBottom: '0.5rem',
                opacity: loadedImages[theme.id] ? 1 : 0.6, // ✅ Smooth fade
                transition: 'opacity 0.5s ease-in-out',
                backgroundColor: loadedImages[theme.id] ? 'gray' : '#f0f0f0', // ✅ Light background if not loaded
              }}
            />
            <div style={{
              fontSize: '0.9rem',
              color: '#555',
              fontWeight: '500',
            }}>
              {theme.type}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ThemeForPersonnalSmall;
