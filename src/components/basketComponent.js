import React, {useEffect, useState} from 'react';
import { useLocation, Link } from 'react-router-dom';
import useScreenSize from "./useIsMobile";

const BasketComponent = ({ basketItems }) => {
    const [isBasketVisible, setIsBasketVisible] = useState(false);
    const {isMobile, isDesktop, isSmallMobile, isTablet, isVerySmall} = useScreenSize()
  // Use location to get current path
  const location = useLocation();

  // Using useEffect to track location changes
  useEffect(() => {
    // Check if we're on the product or checkout page
    if ((location.pathname.includes('product/') || location.pathname === '/checkout')) {
      setIsBasketVisible(true); // Show the basket if on product or checkout page
    } else {
      setIsBasketVisible(false); // Hide the basket otherwise
    }
  }, [location]); // Dependency array to re-run the effect on location change
  

  if (!isBasketVisible || basketItems.length === 0) {
    return null; // Don't render the basket if it's not visible or there are no items
  }

   if (!isDesktop) {
    return null; // Don't render the basket if it's not visible or there are no items
  }



  return (
    <div
      style={{
        position: 'fixed',
        top: '0',
        right: '0',
        width: '150px',
        height: '100vh',
        backgroundColor: 'white',
        color: '#222',
        padding: '10px',
        overflowY: 'auto',
        borderLeft: '2px solid #555',
        zIndex: 1050,
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)', // Improves visibility
      }}
    >
      <h3 style={{ fontSize: '14px', textAlign: 'center' }}>Basket</h3>
      <ul style={{ listStyle: 'none', padding: '0', fontSize: '12px' }}>
        {basketItems.map((item) => (
          <Link to={`/product/${item.id}`} state={{ reload: true }} key={item.id}>
            <li className="basketsect" style={{ marginBottom: '20px', textAlign: 'center' }}>
              <img
                src={item.image}
                alt={item.name}
                style={{ maxHeight: '100px', maxWidth: '100%' }}
              />

              {item.size && (
                <div className="basketsect" style={{ fontStyle: 'italic' }}>
                  Size: {item.size}
                </div>
              )}
              {item.color && (
                <div className="basketsect" style={{ fontStyle: 'italic' }}>
                  Color: {item.color}
                </div>
              )}
              <div className="basketsect" style={{ fontStyle: 'italic' }}>
                Quantity: {item.quantity || 1}
              </div>
            </li>
          </Link>
        ))}
      </ul>
    </div>
  );
};

export default BasketComponent;
