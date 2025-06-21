import React, { useEffect, useState } from "react";
import Malidag from "./components/malidag";
import axios from "axios"
import { Route, Routes } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import AuthForm from "./components/AuthForm";
import Profile from "./components/profile";
import { auth } from "./components/firebaseConfig";
import MalidagHeader from "./components/malidagHeader";
import { Modal, Spin, theme } from "antd";
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
import useScreenSize from "./components/useIsMobile";

import { useConnect,  useAccount, useDisconnect } from 'wagmi'
import ProductReview from "./components/productReview";
import { useLocation } from 'react-router-dom';
import './App.css'
import BasketComponent from "./components/basketComponent";
import WomenTopTopic from "./components/womentoptopic";
import ItemOfShoes from "./components/itemsOfShoes";
import ShoesTopTopic from "./components/shoesTopTopic";
import MalidagCategory from "./components/malidagCategory";
import Theme1Department from "./components/Brands/Theme1/Theme1Departement";
import Theme1 from "./components/Brands/Theme1/Theme1";
import InputSearch from "./components/inputSearch";
import Location from "./components/location";
import All from "./components/All";
import Type from "./components/type";
import Coin from "./components/coin";
import ThemeForPersonnalSmall from "./components/themeForPersonnalSmal";
import MainSlider from "./components/MainSlider";
import ItemOfMen from "./components/itemOfMen";
import ItemOfElectronic from "./components/itemOfElectronic";
import ItemOfPetCare from "./components/itemOfPetCare";
import ItemOfKids from "./components/itemOfKids";
import ItemOfHome from "./components/itemOfHome";
import SpanWarnings from "./components/spanWarnings";
import InternationalShipping from "./components/internationnalShipping";
import TheCryptoShop from "./components/theCryptoShop";
import ScrollToTop from "./components/ScrollToTop";
import useScrollResetOnNavigate from "./components/useScrollResetOnNavigate";
import Layout from "./components/layout";



const BASE_URLs = 'https://api.malidag.com';

const App = () => {
   useScrollResetOnNavigate();
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
  const location = useLocation();


 
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
         "https://restcountries.com/v3.1/all?fields=name,cca2,flags"
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
  const forceScroll = () => {
    setTimeout(() => {
      console.log("Hard scroll in App.js");
      window.scrollTo(0, 0);
    }, 200);
  };
  forceScroll();
}, [location.pathname]);


  useEffect(() => {
    const fetchBasketItems = async () => {
      const userId = user?.uid || "guest"; // Use user ID if logged in, otherwise "guest"http://192.168.0.109:3010
      try {
        const response = await axios.get(`https://api.malidag.com/basket/${userId}`);
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

   useEffect(() => {
  const onScroll = () => {
    console.log("Scroll event from:", document.activeElement, "Window scroll:", window.scrollY);
  };

  window.addEventListener("scroll", onScroll);
  return () => window.removeEventListener("scroll", onScroll);
}, []);

  return (
    <>
          <Routes >
            
             <Route element={
    <Layout
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
  }>
            <Route path="/auth" element={<AuthForm auth={auth} user={user} />} />
           <Route path="/" element={<Malidag view="home" user={user} basketItems={basketItems}
       
        connectors={connectors}
        connect={connect}
        address={address}
        disconnect={disconnect}
        isConnected={isConnected}
        pendingConnector={pendingConnector}
        allCountries={allCountries}
        country={country}
        setCountry={setCountry} />} />
            <Route path="/profile" element={<Profile auth={auth} user={user} />} />
            <Route path="/item/:searchTerm" element={<ItemPage />} />
            <Route path="/items" element={<TypePage />} />
            <Route path="/coin/:crypto" element={<CoinPage />} />
            <Route path="/the-crypto-shop" element={<TheCryptoShop />} />
            <Route path="/items/:itemClicked" element={<Item />} />
            <Route path="/itemsOfWomen/:itemClicked" element={<ItemOfWomen />} />
            <Route path="/itemsOfShoes/:itemClicked" element={<ItemOfShoes />} />
            <Route path="/itemsOfMen/:itemClicked" element={<ItemOfMen />} />
            <Route path="/itemsOfElectronic/:itemClicked" element={<ItemOfElectronic />} />
            <Route path="/itemsOfHome/:itemClicked" element={<ItemOfHome />} />
            <Route path="/itemsOfPetCare/:gender/:type" element={<ItemOfPetCare />} />
            <Route path="/itemsOfKids/:gender/:type" element={<ItemOfKids />} />
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
            <Route path="/international-shipping" element={<InternationalShipping />} />
            <Route path="/savebig" element={<SaveBig />} />
            <Route path="/theme1" element={<Theme1 />} />
            <Route path="/theme1Department" element={<Theme1Department/>} />
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
            </Route>
          </Routes>
    </>

    
  );

};



export default App;