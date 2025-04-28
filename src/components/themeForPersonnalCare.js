import React, { useEffect, useState } from 'react';
import useScreenSize from './useIsMobile';
import personalCareThemes from './personnalCareThemes'; // ✅ Correctly imported theme data

const ThemeForPersonnalCare = () => {
  const { isDesktop, isMobile, isSmallMobile, isTablet, isVerySmall } = useScreenSize();
  const [loadedImages, setLoadedImages] = useState({});

  useEffect(() => {
    personalCareThemes.forEach((theme) => {
      const img = new Image();
      img.src = theme.url;
      img.onload = () => {
        setLoadedImages(prev => ({ ...prev, [theme.id]: true }));
      };
    });
  }, []);

  const brandCount = parseInt(localStorage.getItem('brandCount')) || 0;
  if (isDesktop && brandCount >= 3) return null;

  return (
    <div style={{
      padding: (isSmallMobile || isVerySmall) ? "0.5rem" : "1rem",
      width: (isSmallMobile || isVerySmall) ? "100%" : '270px',
      minHeight:  '250px',
      marginTop: (isSmallMobile || isVerySmall) ? "0rem" : "1rem",
      marginBottom: "1rem",
      boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
      backgroundColor: '#fff'
    }}>
      <div style={{
        fontSize: '1.25rem',
        fontWeight: 'bold',
        color: '#333',
        marginBottom: '1rem',
        textAlign: 'center',
      }}>
        Personal care for you
      </div>

      <div style={{
       display:(isSmallMobile || isVerySmall) ? "grid" : 'flex',
        flexWrap: 'wrap',
        width: "100%",
        gap:(isSmallMobile || isVerySmall) ? "1rem" :  "1rem",
        justifyContent:(isSmallMobile || isVerySmall) ? "space-between" :  'space-between',
        gridTemplateColumns: (isSmallMobile || isVerySmall) ? 'repeat(2, 1fr)' : 'repeat(2, 1fr)', // 👈 Always 2 columns
        alignItems: "center",
      }}>
        {personalCareThemes.map((theme) => (
          <div key={theme.id} style={{
            width:(isSmallMobile || isVerySmall) ? "100%" : '100px',
            textAlign: 'center',
            minHeight: '100%',
          }}>
            <img
              src={theme.url}
              alt={theme.type}
              loading="lazy"
              style={{
                width: (isSmallMobile || isVerySmall) ? "100%" :  '100px',
                height: (isSmallMobile || isVerySmall) ? "185px" :  '100px',
                objectFit: 'cover',
                opacity: loadedImages[theme.id] ? 1 : 1,
                transition: 'opacity 0.3s ease',
                filter: "contrast(1)",
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', // ✅ Add shadow here
               borderRadius: "5px",
                backgroundColor: '#fff'
              }}
            />
            <div style={{
              fontSize: '0.9rem',
              fontWeight: '500',
              color: '#555',
              marginTop: '6px',
            }}>
              {theme.type}
            </div>
          </div>
        ))}
      </div>

      <div style={{
        fontSize: '0.8rem',
        fontWeight: 'bold',
        color: 'blue',
        marginTop: "2rem",
        textAlign: 'start',
        textDecoration: "underline",
        cursor: "pointer"
      }}>
        Discover Now
      </div>
    </div>
  );
};

export default ThemeForPersonnalCare;
