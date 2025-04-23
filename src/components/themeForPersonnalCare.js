import React, { useEffect, useState } from 'react';
import useScreenSize from './useIsMobile';
import personalCareThemes from './personnalCareThemes'; // ✅ Correctly imported theme data

const ThemeForPersonnalCare = () => {
  const { isDesktop } = useScreenSize();
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
      padding: "1rem",
      width: '270px',
      minHeight: '250px',
      marginTop: "1rem",
      marginBottom: "1rem",
      boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
      borderRadius: '10px',
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
        display: 'flex',
        flexWrap: 'wrap',
        gap: "1rem",
        justifyContent: 'space-between',
      }}>
        {personalCareThemes.map((theme) => (
          <div key={theme.id} style={{
            width: '100px',
            textAlign: 'center',
            minHeight: '130px',
          }}>
            <img
              src={theme.url}
              alt={theme.type}
              loading="lazy"
              style={{
                width: '100px',
                height: '100px',
                objectFit: 'cover',
                borderRadius: '8px',
                opacity: loadedImages[theme.id] ? 1 : 0.5,
                transition: 'opacity 0.3s ease',
                backgroundColor: '#eee'
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
