import React from "react";
import { useLocation } from "react-router-dom"; // 👈 Move useLocation here
import Slider from "react-slick";
import { Helmet } from "react-helmet";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import MalidagCategorySmall from "./malidagCategorySmall";
import MalidagCategory from "./malidagCategory";
import ThemeWithText from "./themewithtext";
import useScreenSize from "./useIsMobile";

const slides = [
  { id: 1, url: "https://api.malidag.com/public/header/1/firstbestimage.webp", type: "#689c85" },
  { id: 2, url: "https://api.malidag.com/public/header/2/Screenshorealbbbb.webp", type: "#e87909" },
  { id: 3, url: "https://api.malidag.com/public/header/3/dyctm.webp", type: "#024163" },
];

const MainSlider = ({user}) => {
  const location = useLocation(); // 👈 use it here!
   const {isMobile, isDesktop, isSmallMobile, isTablet, isVerySmall} = useScreenSize()

  const isHome = location.pathname === "/"; // Only show slider on home page

  const settings = {
    dots: false,
    infinite: true,
    speed: 100,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 15000,
  };

  return (
    <div style={{ display: isHome ? "block" : "none" }}>
      {/* 👆 NEVER UNMOUNT slider, just hide it with CSS */}
      <Helmet>
        {slides.map(slide => (
          <link key={slide.id} rel="preload" as="image" href={slide.url} />
        ))}
      </Helmet>
      <div style={{position: "relative"}}>
      <div style={{width: "100%", height: (isDesktop || isTablet || isMobile) ? "750px" : "440px", backgroundColor: "#ddd5"}}>

<Slider {...settings}>
{slides.map((slide) => (
   
   <div
     key={slide.id}
     style={{
       position: "relative",
       width: "100%",
       height: "auto",
       display: "flex",
       justifyContent: "center",
       alignItems: "center",
       backgroundColor: "#ddd5",
     }}
   >
     <div
       style={{
         width: "100%",
         height: (isDesktop || isTablet || isMobile) ? "350px" : "210px",
         position: "relative",
         backgroundColor: slide.type,
       }}
     >
      <picture>
      <source srcSet={slide.url} type="image/webp" />
    {/* 👇 Actual Image */}
    <img
      src={slide.url}
      alt={`Slide ${slide.id}`}
      onClick={() => handleNavigation(slide.id)}
      style={{
        width: "100%",
        height: (isDesktop || isTablet || isMobile) ? "300px" : "200px",
        objectFit: "cover",
        filter: "contrast(1.2) brightness(1.1)", // Add this line to enhance clarity
      }}
    />
    </picture>

       <div
         style={{
           width: "100%",
           height: "50px",
           position: "absolute",
           bottom: (isDesktop || isMobile || isTablet) ? "50px" : "10px",
           background: `linear-gradient(to bottom, transparent, ${slide.type || '#ddd5'})`,
         }}
       ></div>
     </div>

     <div
       style={{
         width: "100%",
         height: (isDesktop || isMobile || isTablet) ? "400px" : "230px",
         top: "0px",
         background: `linear-gradient(to bottom, ${slide.type}, #ddd5)`,
       }}
     ></div>
   </div>
))}
</Slider>
</div>

    <div style={{position: "absolute", top: "170px", width: "100%" }}>

    {(isTablet || isDesktop) && (
<span className="span-warning">
  We are displaying products that ship to your location. You can select a different location in the menu above.  
  <a href="/international-shipping" style={{ color: "blue", marginLeft: "5px", textDecoration: "underline" }}>
    Learn about international shipping here
  </a>
</span>
)}
        <div style={{display: "flex", width: "100%", height: "auto", alignItems: "start", justifyContent: "space-between", overflowX:(isMobile || isTablet || isDesktop) ? "auto" : "auto"}}>
          <MalidagCategorySmall/>
            <MalidagCategory user={user} />
           <div style={{}}>
            <ThemeWithText/>
            </div>
      
            </div>

          </div>
        </div>
    </div>
  );
};

export default MainSlider;
