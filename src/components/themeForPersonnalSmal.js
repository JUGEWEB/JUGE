import React, { useEffect, useState } from 'react';
import axios from 'axios';
import useScreenSize from './useIsMobile';
import { useLocation } from 'react-router-dom';

const ThemeForPersonnalSmall = () => {
  const [themes, setThemes] = useState([]);
  const {isMobile, isDesktop, isSmallMobile, isTablet, isVerySmall} = useScreenSize()
  const location = useLocation()

  useEffect(() => {
    const fetchThemes = async () => {
      try {
        const res = await axios.get('https://api.malidag.com/themes/');
        const allThemes = res.data.themes;

        const filtered = allThemes.filter(
          t => t.mode === 'default' && t.theme === 'Personal care for you'
        );

        setThemes(filtered.slice(0, 4)); // only take 4
      } catch (error) {
        console.error('Error fetching themes:', error);
      }
    };

    fetchThemes();
  }, []);

   // ✅ Hide if mobile/small/verySmall and route is not home
 if (
  (isMobile || isSmallMobile || isVerySmall) &&
  location.pathname !== "/"
) {
  return null;
}

  if (themes.length === 0) return null;

  return (
    <div style={{ padding:(isSmallMobile || isVerySmall) ? "0rem" :'1rem' }}>
      <h3 style={{ marginBottom: '1rem', marginTop:(isSmallMobile || isVerySmall) ? "0.3rem" :''   }}>Personal care for you</h3>
      <div style={{
        display: 'flex',
        gap: '1rem',
        justifyContent: 'space-between',
        overflowX: "auto"
      }}>
        {themes.map((theme) => (
          <div key={theme.id} style={{
            width: '140px',
            textAlign: 'center',
            border: '1px solid #eee',
            borderRadius: '8px',
            padding: '0.5rem',
            background: '#fff',
          }}>
            <img
              src={theme.image}
              alt={theme.types?.[0] || 'Type'}
              style={{
                width: '100%',
                height: 'auto',
                borderRadius: '6px',
                objectFit: 'cover',
                marginBottom: '0.5rem',
              }}
            />
            <div style={{
              fontSize: '0.9rem',
              color: '#555',
              fontWeight: '500'
            }}>
              {theme.types?.[0] || 'Unknown'}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ThemeForPersonnalSmall;
