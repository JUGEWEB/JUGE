import React, { useEffect, useState } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import axios from "axios";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./components/firebaseConfig";
import './App.css';
import './i18n'; // i18n config
import i18n from "i18next";

// Wagmi
import { useConnect, useAccount, useDisconnect } from 'wagmi';

// Components
import Malidag from "./components/malidag";
import AuthForm from "./components/AuthForm";
import Profile from "./components/profile";
import Layout from "./components/layout";
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
import ItemOfShoes from "./components/itemsOfShoes";
import ItemOfMen from "./components/itemOfMen";
import ItemOfElectronic from "./components/itemOfElectronic";
import ItemOfPetCare from "./components/itemOfPetCare";
import ItemOfKids from "./components/itemOfKids";
import ItemOfHome from "./components/itemOfHome";
import ReviewPage from "./components/reviewPage";
import FetchReviews from "./components/fetchReview";
import LikedItems from "./components/likedItem";
import AddToBasket from "./components/saveToBasket";
import DeliveryInfo from "./components/deliveryInfo";
import InternationalShipping from "./components/internationnalShipping";
import TheCryptoShop from "./components/theCryptoShop";
import Theme1 from "./components/Brands/Theme1/Theme1";
import Theme1Department from "./components/Brands/Theme1/Theme1Departement";
import WomenTopTopic from "./components/womentoptopic";
import ShoesTopTopic from "./components/shoesTopTopic";
import SpanWarnings from "./components/spanWarnings";
import useScreenSize from "./components/useIsMobile";
import useScrollResetOnNavigate from "./components/useScrollResetOnNavigate";

const BASE_URLs = 'https://api.malidag.com';

const countryLanguageMap = {
  us: "en",
  gb: "en",
  fr: "fr",
  es: "es",
  de: "de",
  cn: "zh",
  ar: "ar",
  tr: "tr",
  cy: "el", // Cyprus
  gr: "el", // Greece
};

const App = () => {
  useScrollResetOnNavigate();
  const location = useLocation();

  const [user, setUser] = useState(null);
  const [country, setCountry] = useState({ name: "Unknown", flag: "" });
  const [allCountries, setAllCountries] = useState([]);
  const [basketItems, setBasketItems] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(() => {
    const saved = localStorage.getItem("selectedIndex");
    return saved !== null ? Number(saved) : 0;
  });

  const { address, isConnected, chain } = useAccount();
  const { connectors, connect, pendingConnector } = useConnect();
  const { disconnect } = useDisconnect();
  const { isMobile, isTablet } = useScreenSize();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user || null);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchUserIPAndCountry = async () => {
      try {
        const ipRes = await axios.get("https://api.ipify.org?format=json");
        const countryRes = await axios.get(`${BASE_URLs}/api/country/${ipRes.data.ip}`);
        const { countryName, countryCode } = countryRes.data || {};

        if (countryName && countryCode) {
          const code = countryCode.toLowerCase();
          const lang = countryLanguageMap[code] || "en";

          setCountry({ name: countryName, code });

          // ✅ Safe language switch
          try {
            await i18n.changeLanguage(lang);
          } catch (langErr) {
            console.error("Failed to change language:", langErr);
          }
        } else {
          setCountry({ name: "Unknown", flag: "" });
        }
      } catch (error) {
        console.error("Error detecting country:", error);
        setCountry({ name: "Unknown", flag: "" });
      }
    };

    const fetchCountries = async () => {
      try {
        const res = await axios.get("https://restcountries.com/v3.1/all?fields=name,cca2,flags");
        const countries = res.data.map(c => ({
          name: c.name.common,
          code: c.cca2.toLowerCase(),
          flag: c.flags?.png || c.flags?.svg || "",
        }));
        setAllCountries(countries.sort((a, b) => a.name.localeCompare(b.name)));
      } catch (error) {
        console.error("Error fetching country list:", error);
      }
    };

    fetchUserIPAndCountry();
    fetchCountries();
  }, []);

  useEffect(() => {
    const fetchBasketItems = async () => {
      const userId = user?.uid || "guest";
      try {
        const res = await axios.get(`${BASE_URLs}/basket/${userId}`);
        setBasketItems(res.data.basket || []);
      } catch (err) {
        console.error("Error fetching basket:", err);
      }
    };

    fetchBasketItems();
    const interval = setInterval(fetchBasketItems, 1000);
    return () => clearInterval(interval);
  }, [user]);

  useEffect(() => {
    setTimeout(() => window.scrollTo(0, 0), 200);
  }, [location.pathname]);

  return (
    <Routes>
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
        <Route path="/" element={<Malidag view="home" user={user} basketItems={basketItems} allCountries={allCountries} country={country} />} />
        <Route path="/auth" element={<AuthForm auth={auth} user={user} />} />
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
        <Route path="/browsing" element={<Browsing user={user} />} />
        <Route path="/topitem" element={<TopItem user={user} />} />
        <Route path="/50off" element={<PayBBE />} />
        <Route path="/30off" element={<Bnboff />} />
        <Route path="/savebig" element={<SaveBig />} />
        <Route path="/theme1" element={<Theme1 />} />
        <Route path="/theme1Department" element={<Theme1Department />} />
        <Route path="/reviewPage" element={<ReviewPage auth={auth} />} />
        <Route path="/viewreview" element={<FetchReviews />} />
        <Route path="/likeditem" element={<LikedItems auth={auth} />} />
        <Route path="/basket" element={<AddToBasket auth={auth} />} />
        <Route path="/deliveryInformation" element={<DeliveryInfo user={user} auth={auth} selectedIndex={selectedIndex} setSelectedIndex={setSelectedIndex} />} />
        <Route path="/checkout" element={<BuyNow basketItems={basketItems} selectedIndex={selectedIndex} user={user} address={address} auth={auth} chainId={chain?.id || null} />} />
        <Route path="/international-shipping" element={<InternationalShipping />} />
        <Route path="/beauty-top-topic/:type" element={<BeautyTopTopic />} />
        <Route path="/shoes-top-topic/:type" element={<ShoesTopTopic />} />
        <Route path="/women-top-topic/:type" element={<WomenTopTopic />} />
        <Route path="/product/:id" element={<ProductDetails basketItems={basketItems} user={user} address={address} auth={auth} country={country} chainId={chain?.id || null} />} />
      </Route>
    </Routes>
  );
};

export default App;
