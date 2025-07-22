import React, { useState } from "react";
import { useLocation } from "react-router-dom"; // 👈 Move useLocation here
import Slider from "react-slick";
import { Helmet } from "react-helmet";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import MalidagCategorySmall from "./malidagCategorySmall";
import MalidagCategory from "./malidagCategory";
import ThemeWithText from "./themewithtext";
import useScreenSize from "./useIsMobile";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const slides = [
  { id: 1, url: "https://api.malidag.com/public/header/1/firstbestimage.webp", type: "#689c85" },
  { id: 2, url: "https://api.malidag.com/public/header/2/Screenshorealbbbb.webp", type: "#e87909" },
  { id: 3, url: "https://api.malidag.com/public/header/3/dyctm.webp", type: "#024163" },
];
const slidessmall = [
   { id: 1, url: "https://api.malidag.com/public/header/1/firstbestimage.webp", type: "#689c85" },
  { id: 2, url: "https://api.malidag.com/public/header/2/Screenshorealbbbb.webp", type: "#e87909" },
  { id: 3, url: "https://api.malidag.com/public/header/3/dyctm.webp", type: "#024163" },
];

const MainSlider = ({user}) => {
  const [currentSlide, setCurrentSlide] = useState(0)
  const location = useLocation(); // 👈 use it here!
   const {isMobile, isDesktop, isSmallMobile, isTablet, isVerySmall} = useScreenSize()
    const  navigate = useNavigate()

    const isStandardWidth = isDesktop || isTablet || isMobile;
const activeSlides = isStandardWidth ? slides : slidessmall;
const { t } = useTranslation();


  const isHome = location.pathname === "/"; // Only show slider on home page

  const NextArrow = ({ className, style, onClick }) => {
  return (
    <div
      className={className}
      style={{
        ...style,
        display: "block",
        right: "20px",
        marginRight: "20px",
        top: "10%", // 👈 move arrow up (adjust % as needed)
        zIndex: 2,
      }}
      onClick={onClick}
    />
  );
};

const PrevArrow = ({ className, style, onClick }) => {
  return (
    <div
      className={className}
      style={{
        ...style,
        display: "block",
        left: "20px",
        marginLeft: "20px",
        top: "10%", // 👈 move arrow up
        zIndex: 2,
      }}
      onClick={onClick}
    />
  );
};


 const settings = {
  dots: false,
  infinite: true,
  speed: 100,
  slidesToShow: 1,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 150009,
  initialSlide: currentSlide,
  beforeChange: (oldIndex, newIndex) => setCurrentSlide(newIndex),
  arrows: true,
  nextArrow: <NextArrow />,
  prevArrow: <PrevArrow />
};





  // Handle navigation based on ID
  const handleNavigation = (id) => {
    if (!id) return;
    switch (id.toString()) {
      case "1":
        navigate("/50off");
        break;
      case "2":
        navigate("/30off");
        break;
      case "3":
        navigate("/savebig");
        break;
      default:
        console.warn("Unknown id:", id);
        break;
    }
  };

  return (
    <div style={{ display: isHome ? "block" : "none", /* border: "20px solid #666"*/}}>
      {/* 👆 NEVER UNMOUNT slider, just hide it with CSS */}
     <Helmet>
  {activeSlides.map((slide) => (
    <link key={slide.id} rel="preload" as="image" href={slide.url} />
  ))}

</Helmet>

      <div style={{position: "relative"}}>
      <div style={{width: "100%", height: (isDesktop || isTablet || isMobile) ? "auto" : "auto", backgroundColor: "#ddd5"}}>

<Slider {...settings}>
  {activeSlides.map((slide) => (
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
          height: isStandardWidth ? "350px" : "210px",
          position: "relative",
          backgroundColor: slide.type,
        }}
      >
        <picture>
          <source srcSet={slide.url} type="image/webp" />
          <img
            src={slide.url}
            alt={`Slide ${slide.id}`}
            onClick={() => handleNavigation(slide.id)}
            style={{
              width: "100%",
              height: isStandardWidth ? "300px" : "200px",
              objectFit: "cover",
              filter: "contrast(1.2) brightness(1.1)",
            }}
          />
        </picture>
        <div
          style={{
            width: "100%",
            height: "50px",
            position: "absolute",
            bottom: isStandardWidth ? "50px" : "10px",
            background: `linear-gradient(to bottom, transparent, ${slide.type || "#ddd5"})`,
          }}
        ></div>
      </div>

      <div
        style={{
          width: "100%",
          height: isStandardWidth ? "300px" : "230px",
          top: "0px",
          background: `linear-gradient(to bottom, ${slide.type}, #ddd5)`,
        }}
      ></div>
    </div>
  ))}
</Slider>

</div>

    <div style={{position: "absolute", bottom: "0px", width: "100%" }}>

    {(isTablet || isDesktop) && (
<span className="span-warning">
  {t("shipping_notice")}
  <a onClick={() => navigate("/international-shipping")} style={{ color: "blue", marginLeft: "5px", textDecoration: "underline", cursor: "pointer" }}>
    {t("learn_about_shipping")}
  </a>
</span>
)}
        <div style={{width: "100%", height: "auto", margin: "0px" }}>
           {!(isDesktop || isTablet) && (
          <div>
          <MalidagCategorySmall/>
          </div>
           )}

          {(isDesktop || isTablet) && (
          <div>
            <MalidagCategory user={user} />
            </div>
                 
          )}
            </div>

          </div>
        </div>
    </div>
  );
};

export default MainSlider;