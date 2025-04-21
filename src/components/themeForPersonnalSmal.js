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
    <div style={{ padding:(isSmallMobile || isVerySmall) ? "0rem" :'0rem' }}>
      <span style={{ marginTop:(isSmallMobile || isVerySmall) ? "0rem" :'' , fontWeight: "bold"  }}>Personal care for you</span>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        overflowX: "auto"
      }}>
        {themes.map((theme) => (
          <div key={theme.id} style={{
            width: '140px',
            textAlign: 'center',
            borderRadius: '8px',
            padding: '0.5rem',
            background: '#fff',
          }}>
            <img
              src={theme.image}
              alt={theme.types?.[0] || 'Type'}
              style={{
                width: '70px',
                height: '70px',
                borderRadius: '70px',
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
