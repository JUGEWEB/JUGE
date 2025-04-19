import React, { useEffect, useState } from 'react';
import axios from 'axios';
import useScreenSize from './useIsMobile';

const SearchSuggestions = ({ userId }) => {
  const [searches, setSearches] = useState([]);
  const [suggestions, setSuggestions] = useState([]); // { brand, items: [] }
  const {isMobile, isDesktop, isSmallMobile, isTablet, isVerySmall} = useScreenSize()

  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        const res = await axios.get('https://api.malidag.com/search-items', {
          params: { userId },
        });

        const allSearches = userId ? res.data.userSearches : res.data.flatMap(u => u.userSearches);
        const sorted = allSearches
          .map(entry => ({
            search: entry.search,
            timestamp: new Date(entry.timestamp),
          }))
          .sort((a, b) => b.timestamp - a.timestamp);

        const uniqueSearches = [];
        const seen = new Set();
        for (const item of sorted) {
          const lower = item.search.toLowerCase();
          if (!seen.has(lower)) {
            seen.add(lower);
            uniqueSearches.push(item);
          }
          if (uniqueSearches.length === 10) break;
        }

        setSearches(uniqueSearches);

        const matchedBrands = new Set();

        // Get brand suggestions
        await Promise.all(
          uniqueSearches.map(async ({ search }) => {
            const response = await axios.get('https://api.malidag.com/api/brand-suggestions', {
              params: { searchTerm: search },
            });
            response.data.forEach(brand => matchedBrands.add(brand));
          })
        );

        // Get items per brand
        const suggestionData = await Promise.all(
          [...matchedBrands].map(async (brand) => {
            const res = await axios.get(`https://api.malidag.com/api/brands/${encodeURIComponent(brand)}/items`);
            return {
              brand,
              items: res.data.slice(0, 4),
            };
          })
        );

        setSuggestions(suggestionData.filter(s => s.items.length));

        localStorage.setItem('brandCount', suggestionData.filter(s => s.items.length).length);

      } catch (err) {
        console.error('Error fetching suggestions:', err);
      }
    };

    fetchSuggestions();
  }, [userId]);

  return (
    <div style={{ padding:(isDesktop || isMobile || isTablet) ? '1rem' : ""}}>
      <div style={{ display:(isDesktop || isMobile || isTablet) ? 'flex' : "", flexWrap:(isDesktop || isMobile || isTablet) ? 'wrap' : "none", gap: '1.5rem' }}>
        {suggestions.length > 0 ? (
          suggestions.map(({ brand, items }) => (
            <div key={brand} style={{
              border: '1px solid #ddd',
              borderRadius: '0px',
              padding: '1rem',
              color: "black",
              width:(isDesktop || isMobile || isTablet) ? '270px' : "100%",
              flex: '1 1 300px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
              backgroundColor: '#fff'
            }}>
                <h3>Suggested Brands Inspired by Your Searches</h3>
              <div style={{ display: 'flex', gap: '1rem', flexWrap:(isDesktop || isMobile || isTablet) ? 'wrap' : "none", overflowX: (isDesktop || isMobile || isTablet) ? 'none' : "auto", }}>
                {items.map(item => (
                  <div key={item.itemId} style={{
                    borderRadius: '0px',
                    padding:(isDesktop || isMobile || isTablet) ? '0.5rem' : "0rem",
                    width: '100px',
                    textAlign: 'center',
                    backgroundColor: 'white'
                  }}>
                    <img
                      src={item?.item?.images?.[0] || 'https://via.placeholder.com/150'}
                      alt={item?.item?.name || 'Product'}
                      style={{ width: '100%', height: '100px', objectFit: 'contain', marginBottom:(isDesktop || isMobile || isTablet) ? '0.5rem' : "0rem" }}
                    />
                    <div style={{
                      fontWeight: 'bold',
                      fontSize: '0.9rem',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      color: "black"
                    }} title={item.item.name}>
                      {item.item.name}
                    </div>
                  </div>
                ))}
              </div>
              <h4 style={{ marginBottom: '1rem', color: "blue", textDecoration: "underline" , cursor: "pointer"}}> visite {brand}</h4>
            </div>
          ))
        ) : (
          <p>No suggestions available.</p>
        )}
      </div>
    </div>
  );
};

export default SearchSuggestions;
