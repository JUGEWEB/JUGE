import React, { useState, useEffect } from "react";
import axios from "axios";
import "./malidagHeader.css";
import { useConnect } from 'wagmi'; // Import wagmi's useConnect hook
import { useNavigate, useLocation, Link } from "react-router-dom";
import { Dropdown, Button, Menu, Modal } from "antd";
import { DownOutlined } from "@ant-design/icons";
import ProductDetails from "./itemLastPage";
import Location from "./location";
import {Connector} from "wagmi"
import useScreenSize from "./useIsMobile";
import InputSearch from "./inputSearch";





function MalidagHeader({ user, isConnected, connect, address, disconnect, pendingConnector, country, allCountries, basketItems  }) {

  const [isModalVisible, setIsModalVisible] = useState(false); // State for modal visibility
  const navigate = useNavigate();
  const location = useLocation(); // Get the current URL path
  const { isLoading, connectors, } = useConnect(); // Destructure wagmi's useConnect
  const [showDisconnect, setShowDisconnect] = useState(false);
  const [isBasketVisible, setIsBasketVisible] = useState(false);
  const {isSmallMobile , isMobile, isTablet, isVerySmall, isDesktop} = useScreenSize()
 
  console.log('Connectors:', connectors);
  // Determine if we are on the BuyNow (checkout) page
  const isCheckoutPage = location.pathname === "/checkout";

  connectors.map((Connector) => {
    console.log(`${Connector.name} Ready:`, Connector.ready);
  });


  const showModal = () => setIsModalVisible(true); // Function to show the modal
  const handleCancel = () => setIsModalVisible(false); // Function to hide the modal

  const openAuthWindow = () => {
    const authWindow = window.open(
      "/auth",
      "_blank",
      "width=400,height=600,resizable,scrollbars"
    );
    authWindow.document.title = "Login / Sign Up";
  };

   // Using useEffect to track location changes
   useEffect(() => {
    // Check if we're on the product or checkout page
    if (location.pathname.includes('product/')) {
      setIsBasketVisible(true); // Show the basket if on product or checkout page
    } else {
      setIsBasketVisible(false); // Hide the basket otherwise
    }
  }, [location]); // Dependency array to re-run the effect on location change
  

  const home = () => {
    navigate('/JUGE')
  }


    const truncateAddress = (address, startLength = 6, endLength = 4) => {
      if (!address) return '';
      return `${address.slice(0, startLength)}...${address.slice(-endLength)}`;
    };

    const trustMessage = (
      <Menu
        items={[
          {
            key: "1",
            label: (
              <div
                style={{
                  padding: "10px",
                  maxWidth: "250px",
                  textAlign: "center",
                  backgroundColor: "#222",
                  color: "white",
                  borderRadius: "8px",
                  boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.3)",
                }}
              >
                ✅ **We value your trust!** Your payment is **100% secure**, and we guarantee **safe and timely delivery** of your products.
              </div>
            ),
          },
        ]}
      />
    );

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "0px",
        marginLeft: "0px",
        marginTop: "0px",
        backgroundColor: (isTablet || isDesktop) ? "black" : "#333",
        width:"100%",
        marginRight: isBasketVisible && basketItems.length > 0 ? "150px" : "0",
      
      }}
    >
      <div style={{display: "flex", alignItems: "center"}}>
      {/* Logo */}
      <div
        className="logoStyle"
        onClick={home}
        style={{ display: "flex", alignItems: "center", cursor: "pointer", width: "auto" }}
      >
        <div
          style={{
            fontSize: "25px",
            fontWeight: "bold",
            color: "#fff",
            letterSpacing: "3px",
            textShadow: "0px 0px 10px #00ffea",
            position: "relative",
          }}
        >
          <span style={{ color: "white" }}>M</span>
          <span
            style={{
              color: "#fff",
              position: "relative",
              fontSize: "35px",
              fontWeight: "bold",
              textShadow: "0 0 10px #ff005e, 0 0 20px #ff005e",
            }}
          >
            a
          </span>
          lid
          <span
            style={{
              color: "white",
              position: "relative",
              fontSize: "30px",
              fontWeight: "bold",
              textShadow: "0 0 10px #ff005e, 0 0 20px #ff005e",
            }}
          >
            a
          </span>
          g
        </div>
      </div>

      {(isTablet || isDesktop) && (
  <Location country={country} allCountries={allCountries} />
)}

      </div>

      <div style={{width: "100%", marginRight: "5px"}}>

      {(isDesktop) && (
        <InputSearch/>
      )}

      </div>

      {isCheckoutPage ? (
         isConnected ? (
          <div style={{ display: "flex", justifyContent: "center" }}>
            {/* Checkout Header */}
            <div
              style={{
                color: "white",
                fontSize: "22px",
                fontWeight: "bold",
                textAlign: "center",
                flexGrow: 1,
                display: "flex",
               
              }}
            >
              Checkout
              <Dropdown overlay={trustMessage} placement="bottom" trigger={["click"]}>
          <Button
            type="text"
            style={{
              marginLeft: "10px",
              color: "white",
              fontSize: "18px",
            }}
          >
            Trust Info <DownOutlined />
          </Button>
        </Dropdown>
      </div>
      
          </div>
        ) : null

          ) : (

            <>

            <div style={{display: "flex", alignItems: "center"}}>

      {/* User Section */}
      <div>
        {user ? (
          <span
            onClick={() => navigate("/profile")}
            style={{
              cursor: "pointer",
              fontSize: "30px",
              filter: "hue-rotate(100deg) saturate(350%) brightness(1.2)",
            }}
          >
            👤
          </span>
        ) : (
          <div className="buttonlog" onClick={() => navigate("/auth")}>
           <div>Login</div> <div>-</div> <div>&gt;</div> <div style={{ cursor: "pointer",
              fontSize: (isTablet || isDesktop)? "27px" : "20px",
              filter: "hue-rotate(100deg) saturate(350%) brightness(1.2)",}}>👤</div>
          </div>
        )}
      </div>

     {/* Connect Button */}
    
{!isConnected ? (
  <Button type="primary" onClick={showModal} style={{marginRight: "5px", marginLeft: "10px"}}>
    Connect Wallet
  </Button>
) : (
  <div style={{ display: 'flex', alignItems: 'center', height: "auto" }}>
    <p
      style={{
        color: 'black',
        backgroundColor: 'white',
        border: '2px solid black',
        fontSize: '14px',
        borderRadius: '20px',
        padding: '5px',
      }}
    >
      {truncateAddress(address)}
    </p>
    <div style={{ position: 'relative' }}>
      {/* Three dots button */}
      <Button
        type="text"
        style={{
          fontSize: '24px',
          lineHeight: '1',
          background: 'none',
          border: '1px solid blue',
          cursor: 'pointer',
          color: "white",
          marginRight: "10px"
        }}
        onClick={() => setShowDisconnect(!showDisconnect)}
      >
        ⋮
      </Button>
      {/* Disconnect button */}
      {showDisconnect && (
        <Button
          type="primary"
          danger
          onClick={disconnect}
          style={{
            position: 'absolute',
            top: '40px',
            right: '0',
            zIndex: '10',
          }}
        >
          Disconnect
        </Button>
      )}
    </div>
  </div>
)}


{basketItems.length > 0 && (
          <div style={{backgroundColor: "black"}}>
          <Link to="/basket">
        <div
          style={{
            cursor: "pointer",
            position: "relative",
            top: "0px",
            right: "25px",
            fontSize: "34px",
            display: "flex",
            marginLeft: "20px",
            alignItems: "center",
            marginRight: isCheckoutPage ? "150px" : "0px", // Adjust marginRight for checkout page
          }}
        >
          🛒
          <span
            style={{
              position: "absolute",
              marginLeft: "5px",
              backgroundColor: "red",
              color: "white",
              borderRadius: "50%",
              width: "20px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontSize: "14px",
              fontWeight: "bold",
              marginRight: isCheckoutPage ? "150px" : "0px", // Adjust marginRight for checkout page
            }}
          >
            {basketItems.length}
          </span>
        </div>
        </Link>
         </div>
      )}
</div>

{/* Modal */}
<Modal
  title="Connect Wallet"
  open={isModalVisible}
  onCancel={handleCancel}
  footer={null} // No footer buttons
>
  {connectors.map((connector) => (
    <Button
      key={connector.uid}
      connector={connector}
      onClick={() => connect({ connector })}
      style={{ display: 'block', marginBottom: '10px' }}
    >
      {connector.name}
    </Button>
  ))}
</Modal>
    
      </>
          )}

    </div>
  );
}

export default MalidagHeader;
