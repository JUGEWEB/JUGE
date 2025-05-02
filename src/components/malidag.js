import React, { useState, useEffect } from "react"; 
import "./malidag.css"; // Import the styles
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Modal, Spin } from "antd"; // Import Ant Design components
import MalidagHeader from "./malidagHeader";
import MalidagCategory from "./malidagCategory";
import FashionForAll from "./fashionForAll";
import YouMayLike from "./youMayLike";
import TopTopic from "./topTopic";
import RecommendedItem from "./recomendeItem";
import Electronic from "./electronic";
import Type from "./type";
import TradingView from "./tradingView";
import MalidagFoote from "./malidagFoote";
import Home from "./homeAndKitchen";
import "./malidagPresentItem.css";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import { auth } from "./firebaseConfig";
import useScreenSize from "./useIsMobile";
import ThemeWithText from "./themewithtext";
import MalidagCategories2 from "./malidagCatgories2";
import MalidagCategorySmall from "./malidagCategorySmall";
import SearchSuggestions from "./searchSuggestion";
import ThemeForPersonnalCare from "./themeForPersonnalCare";
import ThemeForMenFashion from "./themeForMenFashion";
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import { useQuery } from '@tanstack/react-query'; // 👈 Import useQuery
import { Helmet } from "react-helmet";
import ThemeForWomenFashion from "./themeForWomenFashion";
import ThemeForHomeAndKitchen from "./themeForHomeAndKitchen";


const ITEMS_PER_SLIDE = 6; // Number of items to display per slide
const MAX_ITEMS = 17; // Maximum items to display in total
const BASE_URL = "https://api.malidag.com"; // Replace with your IP
  
const Malidag = ({ user, gra, slides }) => {
  const [currentSlide, setCurrentSlide] = useState(0); // Manage slide state
  const [totalSlides, setTotalSlides] = useState(0);
  const [items, setItems] = useState([]); // Hold all items
  const [isHovered, setIsHovered] = useState(false); // State to control hover effect
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalData, setModalData] = useState(null); // Data for the modal
  const [isLoading, setIsLoading] = useState(false); // Loading state for modal content
  const [selectedSymbol, setSelectedSymbol] = useState("BTC");
   const [currentSlideType, setCurrentSlideType] = useState("#689c85");
   const [slideDirection, setSlideDirection] = useState("right");
  const  navigate = useNavigate()
  const {isMobile, isDesktop, isSmallMobile, isTablet, isVerySmall} = useScreenSize()
  const [prevType, setPrevType] = useState(currentSlideType);
  const [animate, setAnimate] = useState(false);
  const brandCount = parseInt(localStorage.getItem('brandCount')) || 0;

  

  useEffect(() => {
    console.log("Slides rendered:", slides);
  }, [slides]);
  

  
    // Slider settings
    const settings = {
      dots: false, // 👈 this disables the three dots
      infinite: true,
      speed: 100,
      slidesToShow: 1,
      slidesToScroll: 1,
      autoplay: true,
      autoplaySpeed: 15000,
      initialSlide: currentSlide, // 👈 Start from saved slide
      beforeChange: (oldIndex, newIndex) => {
        setCurrentSlide(newIndex);
        const newColor = slides[newIndex]?.type || "#689c85";
        setCurrentSlideType(newColor);
      },
    };

  // Get the items for the current slide
  const startIndex = currentSlide * ITEMS_PER_SLIDE;
  const endIndex = startIndex + ITEMS_PER_SLIDE;
  const currentItems = items.slice(startIndex, endIndex);
  
 const onclickKid = () => {
  navigate('/kidFashion')
 }

 const onclickKidToy = () => {
  navigate('/KidToy')
 }

 const onclickIFP = () => {
  navigate('/IFP')
 }

 const onclickElPage = () => {
  navigate('/ElPage')
 }

 const onclickIHP = () => {
  navigate('/IHP')
 }

 const onclickbrowsing = () => {
  navigate('/browsing')
 }

 const onclicktopitem = () => {
  navigate('/topitem')
 }
  

  return (

    <>

     {/* Helmet for Dynamic Preload */}
     <Helmet>
        {slides.map(slide => (
          <link key={slide.id} rel="preload" as="image" href={slide.url} />
        ))}
      </Helmet>

          <div style={{backgroundColor: "#ddd5", position: 'relative',width: "100%", height: "auto"}}>

            <MalidagCategories2/>

            <div style={{paddingLeft: "0rem", paddingRight: "0rem"}}>

            {(isSmallMobile || isVerySmall) && (
            <div style={{width: "100%", display: "flex", alignItems: "center", justifyContent: "center"}}>
              
            <ThemeForPersonnalCare/>
           
            </div>
           )}

        {(isSmallMobile || isVerySmall) && (
                    <div style={{width: "100%", display: "flex", alignItems: "center", justifyContent: "center"}}>
                      
                    <ThemeForWomenFashion/>
                  
                    </div>
                  )}

{(isSmallMobile || isVerySmall) && (
                    <div style={{width: "100%", display: "flex", alignItems: "center", justifyContent: "center", marginTop: "0.2rem"}}>
                      
                    <ThemeForHomeAndKitchen/>
                  
                    </div>
                  )}
           </div>

                  {(isSmallMobile || isVerySmall) && brandCount > 0 && (
          <div style={{ marginBottom: "10px" }}>
            <SearchSuggestions />
          </div>
        )}

          <div className="container">
            <div style={{ backgroundColor: "white", width: "100%", position: "relative", height: "auto", paddingBottom: "10px"}}>
            <div style={{display: "flex", alignItems: "center", justifyContent: "start",}}>
          <h1 style={{marginLeft: "20px"}}>Fashion for All</h1>
          <div style={{color: "green", fontSize: "14px", fontWeight: "bold", cursor: "pointer", marginLeft: "20px", marginTop: "10px"}} onClick={onclickIFP}>View more</div>
          </div>
          <FashionForAll />
          </div>
        </div>
        <div className="containeri">
        <div style={{ backgroundColor: "white", width: "100%", position: "relative", height: "auto", paddingBottom: "20px"}}>
        <div style={{display: "flex", alignItems: "center", justifyContent: "start",}}>
          <h1 style={{marginLeft: "20px", height: "auto"}}>Home & Office Tech</h1>
          <div style={{color: "green", fontSize: "14px", fontWeight: "bold", cursor: "pointer", marginLeft: "20px", marginTop: "10px"}} onClick={onclickIFP}>View more</div>
          </div>
          <Electronic />
          </div>
          </div>

{ user && (
<div className="container1">
  <h1  style={{display: "flex", alignItems: "center", width: "100%"}} >Based on your browsing history  <div style={{fontSize: "14px", color: "green", marginLeft: "10px", fontWeight: "bold", marginTop: "10px", cursor: "pointer"}}  onClick={onclickbrowsing} >Explore now</div> </h1>
  <div style={{width: "100%"}}>
  <YouMayLike user={user} />
  </div>
</div>
)}

<div className="container2de">
  <h1  style={{display: "flex", alignItems: "center"}}>Top 100 Most Sold Items  <div style={{fontSize: "14px", color: "green", marginLeft: "10px", fontWeight: "bold", marginTop: "10px", cursor: "pointer"}}  onClick={onclicktopitem} >Explore now</div> </h1>
  <div style={{width: "100%"}}>
  <TopTopic />
  </div>
</div>
       
        
        <div >
        <RecommendedItem />
        </div>
          {/* TradingView Chart */}
          <div className="tradingview-container">
          <h1>Live Chart for {selectedSymbol}</h1>
          <TradingView symbol={selectedSymbol} />
        </div>
        </div>

        </>
        
  );
};

export default Malidag;