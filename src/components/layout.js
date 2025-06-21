// components/Layout.js
import React from "react";
import { Outlet } from "react-router-dom";
import AppHeader from "./appHeader";
import MalidagFooter from "./malidagFooter";

const Layout = ({ basketItems,
      user,
      connectors,
      connect,
      address,
      disconnect,
      isConnected,
      pendingConnector,
      allCountries,
      country,
      setCountry,}) => {
  return (
    <>
     <AppHeader 
  basketItems={basketItems}
  user={user}
  connectors={connectors}
  connect={connect}
  address={address}
  disconnect={disconnect}
  isConnected={isConnected}
  pendingConnector={pendingConnector}
  allCountries={allCountries}
  country={country}
  setCountry={setCountry}
/>

      <div style={{ paddingTop: "0px" }}>
        <Outlet />
      </div>
      <MalidagFooter />
    </>
  );
};

export default Layout;
