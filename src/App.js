import React, { useEffect, useState } from "react";
import Malidag from "./components/malidag";
import axios from "axios"
import { HashRouter as Router, Route, Routes } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import AuthForm from "./components/AuthForm";
import Profile from "./components/profile";
import { auth } from "./components/firebaseConfig";
import MalidagHeader from "./components/malidagHeader";
import { Modal, Spin } from "antd";
import ItemPage from "./components/itemPage";
import TypePage from "./components/typePage";
import CoinPage from "./components/coinPage";
import Item from "./components/itemsOfItem";
import PersonalCare from "./components/persCareFY";
import WoFashion from "./components/woFashion";
import FashionKick from "./components/fashionkick";
import MenFashion from "./components/MenFa";
import KidFashion from "./components/kidFashion";
import KidToy from "./components/kidsToy";
import ItemFashionPage from "./components/fashionForAllPage";
import ElectronicPage from "./components/electronicPage";
import ItemHomePage from "./components/homePageKithen";
import Browsing from "./components/basedbrowsing";
import TopItem from "./components/topItem";
import PayBBE from "./components/payBNBBTCETH";
import SaveBig from "./components/saveBig";
import Bnboff from "./components/buyBNB";
import ProductDetails from "./components/itemLastPage";
import BuyNow from "./components/buyNow";
import BeautyTopTopic from "./components/beautyTopTopic";
import ItemOfWomen from "./components/itemOfWomen";
import NavMenu from "./components/navMenu";
import DeliveryInfo from "./components/deliveryInfo";
import AddToBasket from "./components/saveToBasket";
import FetchReviews from "./components/fetchReview";
import ReviewPage from "./components/reviewPage";
import LikedItems from "./components/likedItem";
import MalidagFooter from "./components/malidagFooter";
import Baasploa from "./components/Brands/BaasploaBrand/Baasploa";
import useScreenSize from "./components/useIsMobile";

import { useConnect,  useAccount, useDisconnect } from 'wagmi'
import ProductReview from "./components/productReview";

import './App.css'
import BasketComponent from "./components/basketComponent";
import WomenTopTopic from "./components/womentoptopic";
import ItemOfShoes from "./components/itemsOfShoes";
import ShoesTopTopic from "./components/shoesTopTopic";
import MalidagCategory from "./components/malidagCategory";
import BrandDepartment from "./components/Brands/BaasploaBrand/brandDepartment";
import InputSearch from "./components/inputSearch";
import Location from "./components/location";
import All from "./components/All";
import Type from "./components/type";
import Coin from "./components/coin";
import ThemeForPersonnalSmall from "./components/themeForPersonnalSmal";



const BASE_URLs = 'http://192.168.0.210:3007';

const App = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [user, setUser] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalData, setModalData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { connectors, connect , pendingConnector } = useConnect()
  const { address, isConnected } = useAccount()
  const [country, setCountry] = useState("");
  const [allCountries, setAllCountries] = useState([]); // List of countries for dropdown
  const { disconnect } = useDisconnect()
  const {isMobile, isDesktop, isSmallMobile, isTablet, isVerySmall} = useScreenSize();
  const {chain} = useAccount()
  const [basketItems, setBasketItems] = useState([]); // Store basket items
  const [selectedIndex, setSelectedIndex] = useState(() => {
    const savedIndex = localStorage.getItem("selectedIndex");
    return savedIndex !== null ? Number(savedIndex) : 0  
  });
 
  console.log("contry:", country)
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user || null);
    });
    return () => unsubscribe();
  }, []);

  const openModal = async () => {
    setIsModalVisible(true);
    setIsLoading(true);
    try {
      const response = await axios.get("https://api.malidag.com/items");
      setModalData(organizeData(response.data.items));
    } catch (error) {
      console.error("Error fetching modal data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const closeModal = () => setIsModalVisible(false);

  useEffect(() => {
    const fetchUserIPAndCountry = async () => {
      try {
        const ipResponse = await axios.get("https://api.ipify.org?format=json");
        const countryResponse = await axios.get(
          `${BASE_URLs}/api/country/${ipResponse.data.ip}`
        );
        if (countryResponse.data && countryResponse.data.countryName) {
          setCountry({
            name: countryResponse.data.countryName,
            code: countryResponse.data.countryCode.toLowerCase(),
          });
         
        } else {
          setCountry({ name: "Unknown", flag: "" });
        }
      } catch (error) {
        console.error("Error fetching IP or country:", error);
        setCountry({ name: "Unknown", flag: "" });
      }
    };

    const fetchCountries = async () => {
      try {
        const countriesResponse = await axios.get(
          "https://restcountries.com/v3.1/all"
        );
        const countryList = countriesResponse.data
          .map((c) => ({
            name: c.name.common,
            code: c.cca2.toLowerCase(),
            flag: c.flags.png || c.flags.svg,
          }))
          .sort((a, b) => a.name.localeCompare(b.name));
        setAllCountries(countryList);
      } catch (error) {
        console.error("Error fetching countries:", error);
      }
    };

    fetchUserIPAndCountry();
    fetchCountries();
  }, []);

  useEffect(() => {
    const fetchBasketItems = async () => {
      const userId = user?.uid || "guest"; // Use user ID if logged in, otherwise "guest"http://192.168.0.109:3010
      try {
        const response = await axios.get(`http://192.168.0.210:3017/basket/${userId}`);
        setBasketItems(response.data.basket || []); // Update state with items
      } catch (error) {
        console.error("Error fetching basket:", error);
      }
    };

    fetchBasketItems();
    // Set up the interval to fetch basket items every 1 second
    const intervalId = setInterval(fetchBasketItems, 1000);

    // Cleanup the interval when the component is unmounted or user changes
    return () => clearInterval(intervalId);
  }, [user]); // Fetch basket when userId changes

  return (
    <div>
      
   
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", background: "White" }}>
      <Router>
        
        {/* Header */}
        <div style={{backgroundColor: "#333"}}>
       <div className="header-container" style={{backgroundColor: (isDesktop || isTablet) ? "" : "#333"}} >
       
        <MalidagHeader  className="malidag-header"  basketItems={basketItems} user={user}  connectors={connectors} connect={connect} address={address} disconnect={disconnect} isConnected={isConnected}  pendingConnector={pendingConnector} allCountries={allCountries} country={country}  />
        
         <BasketComponent basketItems={basketItems}/>
        </div>
        {(isMobile || isSmallMobile || isVerySmall || isTablet) && (
          <div style={{width: "100%", marginLeft: "0px", marginRight: "0px", backgroundColor: "#333", marginTop: "2px"}}>
    <InputSearch user={user} basketItems={basketItems} isBasketVisible={true} />
    </div>
  )}
   {/* ✅ Navigation Menu */}
   {(isMobile || isSmallMobile || isVerySmall) && (
    <div style={{display: "flex", backgroundColor: "#333", padding: "5px"}}>
      <Type basketItems={basketItems} />
      </div>
        )}

        {(isMobile || isSmallMobile || isVerySmall) && (
        <div style={{backgroundColor: "#336"}}>
      <Coin  basketItems={basketItems}/>
      </div> 
        )}

{(isMobile || isSmallMobile || isVerySmall) && (
  <div style={{color: "white", backgroundColor: " rgb(3, 29, 48)", padding: "10px"}}>
    <Location country={country} allCountries={allCountries}/>
    </div>
  )}
  {(isMobile || isSmallMobile || isVerySmall) && (
  <div style={{color: "black", backgroundColor: " white", padding:(isSmallMobile || isVerySmall) ? "2px" : "10px", maxHeight: "150px"}}>
    <ThemeForPersonnalSmall/>
    </div>
  )}

        </div>
       
       
        {/* ✅ Navigation Menu */}
        {(isTablet || isDesktop) && (
      <NavMenu  basketItems={basketItems} /> 
        )}
     
         

        {/* Main Content */}
        <div style={{ flex: 1 }}>
          <Routes>
            <Route path="/auth" element={<AuthForm auth={auth} user={user} />} />
            <Route path="/" element={<Malidag auth={auth} user={user} />} />
            <Route path="/profile" element={<Profile auth={auth} user={user} />} />
            <Route path="/item/:searchTerm" element={<ItemPage />} />
            <Route path="/items" element={<TypePage />} />
            <Route path="/coin/:crypto" element={<CoinPage />} />
            <Route path="/items/:itemClicked" element={<Item />} />
            <Route path="/itemsOfWomen/:itemClicked" element={<ItemOfWomen />} />
            <Route path="/itemsOfShoes/:itemClicked" element={<ItemOfShoes />} />
            <Route path="/personal" element={<PersonalCare />} />
            <Route path="/woFashion" element={<WoFashion />} />
            <Route path="/faKick" element={<FashionKick />} />
            <Route path="/menfa" element={<MenFashion />} />
            <Route path="/kidFashion" element={<KidFashion />} />
            <Route path="/KidToy" element={<KidToy />} />
            <Route path="/IFP" element={<ItemFashionPage />} />
            <Route path="/ElPage" element={<ElectronicPage />} />
            <Route path="/IHP" element={<ItemHomePage />} />
            <Route path="/reviewPage" element={<ReviewPage  auth={auth} />} />
            <Route path="/browsing" element={<Browsing user={user} />} />
            <Route path="/topitem" element={<TopItem user={user} />} />
            <Route path="/50off" element={<PayBBE />} />
            <Route path="/savebig" element={<SaveBig />} />
            <Route path="/blaasploaBrand" element={<Baasploa />} />
            <Route path="/brand-department" element={<BrandDepartment />} />
            <Route path="/viewreview" element={<FetchReviews />} />
            <Route path="/30off" element={<Bnboff />} />
            <Route path="/likeditem" element={<LikedItems auth={auth} />} />
            <Route path="/basket" element={<AddToBasket auth={auth} />} />
            <Route path="/deliveryInformation" element={<DeliveryInfo user={user} auth={auth} selectedIndex={selectedIndex} setSelectedIndex={setSelectedIndex}/>} />
            <Route path="/checkout" element={<BuyNow basketItems={basketItems} selectedIndex={selectedIndex} user={user}  connectors={connectors} connect={connect} address={address} disconnect={disconnect} isConnected={isConnected}  pendingConnector={pendingConnector} allCountries={allCountries} country={country}  auth={auth} chainId={isConnected && chain ? chain.id : null}  />} />
            <Route path="/beauty-top-topic/:type" element={<BeautyTopTopic />} /> {/* Dynamic route */}
            <Route path="/shoes-top-topic/:type" element={<ShoesTopTopic />} /> {/* Dynamic route */}
            <Route path="/women-top-topic/:type" element={<WomenTopTopic />} /> {/* Dynamic route */}
            <Route path="/product/:id" element={<ProductDetails basketItems={basketItems}  country={country} user={user} address={address} auth={auth} chainId={isConnected && chain ? chain.id : null}/>} />
          </Routes>
        </div>

        <MalidagFooter/>
      </Router>
    </div>
    </div>
    
  );
};

export default App;