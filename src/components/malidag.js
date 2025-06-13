import React, { useState, useEffect } from "react"; 
import "./malidag.css"; // Import the styles
import { useNavigate } from "react-router-dom";
import FashionForAll from "./fashionForAll";
import YouMayLike from "./youMayLike";
import TopTopic from "./topTopic";
import RecommendedItem from "./recomendeItem";
import Electronic from "./electronic";
import TradingView from "./tradingView";
import "./malidagPresentItem.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import useScreenSize from "./useIsMobile";
import MalidagCategories2 from "./malidagCatgories2";
import SearchSuggestions from "./searchSuggestion";
import ThemeForPersonnalCare from "./themeForPersonnalCare";
import 'react-lazy-load-image-component/src/effects/blur.css';
import { Helmet } from "react-helmet";
import ThemeForWomenFashion from "./themeForWomenFashion";
import ThemeForHomeAndKitchen from "./themeForHomeAndKitchen";
import MalidagCategories3 from "./malidagCategory3";
import ThemeForKidsFashion from "./themeForKidFashion";
import ThemeForKidToy from "./themeForKidsToy";

  
const Malidag = ({ user}) => {
 
  const [selectedSymbol, setSelectedSymbol] = useState("BTC");
  const  navigate = useNavigate()
  const {isMobile, isDesktop, isSmallMobile, isTablet, isVerySmall} = useScreenSize()


 const onclickIFP = () => {
  navigate('/IFP')
 }

 const onclickElPage = () => {
  navigate('/ElPage')
 }

 const onclickbrowsing = () => {
  navigate('/browsing')
 }

 const onclicktopitem = () => {
  navigate('/topitem')
 }
  

  return (

    <>

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

                  {(isSmallMobile || isVerySmall) && (
                    <div style={{width: "100%", display: "flex", alignItems: "center", justifyContent: "center", marginTop: "2px"}}>
                      
                    <ThemeForKidsFashion/>
                  
                    </div>
                  )}

                  {(isSmallMobile || isVerySmall) && (
                    <div style={{width: "100%", display: "flex", alignItems: "center", justifyContent: "center", marginTop: "2px"}}>
                      
                    <ThemeForKidToy/>
                  
                    </div>
                  )}
           </div>

                 
          
           
            {(isSmallMobile || isVerySmall)  && (
              <div style={{ marginBottom: "10px", backgroundColor: "white" , width: "100%", height: "auto"}}>
  <SearchSuggestions userId={user?.uid}  />
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
          <div style={{color: "green", fontSize: "14px", fontWeight: "bold", cursor: "pointer", marginLeft: "20px", marginTop: "10px"}} onClick={onclickElPage}>View more</div>
          </div>
          <Electronic />
          </div>
          </div>

{ user && (
<div className="container1">
  <div  style={{display: "flex", alignItems: "center", width: "100%", fontSize: "24px", fontWeight: "bold"}} >Based on your browsing history  <div style={{fontSize: "14px", color: "green", marginLeft: "10px", fontWeight: "bold", marginTop: "10px", cursor: "pointer"}}  onClick={onclickbrowsing} >Explore now</div> </div>
  <div style={{width: "100%"}}>
  <YouMayLike user={user} />
  </div>
</div>
)}

<div className="container2de">
  <h1  style={{display: "flex", alignItems: "center"}}>Top Items  <div style={{fontSize: "14px", color: "green", marginLeft: "10px", fontWeight: "bold", marginTop: "10px", cursor: "pointer"}}  onClick={onclicktopitem} >Explore now</div> </h1>
  <div style={{width: "100%"}}>
  <TopTopic />
  </div>
</div>
       
        <MalidagCategories3/>
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