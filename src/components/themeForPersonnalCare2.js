import React, { useEffect, useState } from 'react';
import axios from 'axios';
import useScreenSize from './useIsMobile';

const ThemeForPersonnalCare2 = () => {
  const [themes, setThemes] = useState([]);
  const { isDesktop, isMobile, isTablet } = useScreenSize();

  useEffect(() => {
    const fetchThemes = async () => {
      try {
        const res = await axios.get('https://api.malidag.com/themes/');
        const allThemes = res.data.themes;

        const filtered = allThemes.filter(
          t => t.mode === 'default' && t.theme === 'Personal care for you'
        );

        setThemes(filtered.slice(0, 4)); // limit to 4
      } catch (error) {
        console.error('Error fetching themes:', error);
      }
    };

    fetchThemes();
  }, []);

  const brandCount = parseInt(localStorage.getItem('brandCount')) || 0;

  // ❌ On desktop, hide if brandCount is 3 or more
  if (!(isDesktop && brandCount >= 3)) return null;

  if (themes.length === 0) return null;

  return (
    <div style={{
        padding: "1rem",
      backgroundColor: '#f9f9f9',
      width: '270px',
      height: "auto", 
      marginBottom: "1rem"
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
        height: "auto",
      }}>
        {themes.map((theme) => (
          <div key={theme.id} style={{
            width: '100px',
            textAlign: 'center',
          }}>
            <img
              src={theme.image}
              alt={theme.types?.[0] || 'Type'}
              style={{
                width: '100%',
                height: '100px',
                objectFit: 'cover',
                marginTop: '1rem',
              }}
            />
            <div style={{
              fontSize: '0.9rem',
              fontWeight: '500',
              color: '#555',
            }}>
              {theme.types?.[0] || 'Unknown'}
            </div>
          </div>
        ))}
      </div>
      <div style={{
        fontSize: '0.8rem',
        fontWeight: 'bold',
        color: 'blue',
        marginTop: "5rem",
        textAlign: 'start',
        textDecoration: "underline"
      }}>
        Discover Now
      </div>
    </div>
  );
};

export default ThemeForPersonnalCare2;
