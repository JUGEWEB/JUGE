import React, { useState, useEffect } from "react";
import useScreenSize from "./useIsMobile";
import './ItemIdPage.css';
import { Carousel } from "antd";


const ItemIdPage = ({ id }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const {isMobile, isDesktop, isTablet, isSmallMobile, isVerySmall, isVeryVerySmall} = useScreenSize()

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`https://api.malidag.com/api/items/items/${id}`);
        if (!response.ok) throw new Error("Item not found or API error");
        const result = await response.json();
        setData(result);
        console.log("result:", result);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) return <div className="text-center py-10 text-lg">Loading...</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;
  if (!data) return <div className="text-center">No data found</div>;

  return (
    <div style={{width: "100%", maxWidth: "100%", overflow: "hidden"}} >
      <h1 className="text-centerSlide">From the brand</h1>

        {data.media.map((item, index) => (
          <div key={index}  style={{width: "100%", maxWidth: "100%"}}>
            {/* Image with Text */}
            {item.type === "image_with_text" && (
              <div className="flex-colSlide" style={{display:(isDesktop || isTablet) ? "grid" : "", alignItems:(isDesktop || isTablet) ? "center" : "start", justifyContent: "end", padding: "10px", gridTemplateColumns: (isDesktop || isTablet) ? "1fr 2fr" : undefined,}}>
                <img
                  src={`https://api.malidag.com${item.filePath}`}
                  alt="With text"
                  className="w-full-slide"
                  style={{maxWidth: (isDesktop || isTablet) ? "500px" : "100%", height: "100%"}}
                />
                <p className="text-l-hgeslid" style={{color: "black", padding: "5px"}}>{item.text}</p>
              </div>
            )}

            {item.type === "image-Left_with_text" && (
              <div className="f-grid-versionHsion" style={{display:(isDesktop || isTablet) ? "flex" : "", alignItems:(isDesktop || isTablet) ? "center" : "start", justifyContent: "end", padding: "20px",  width: "100%", maxWidth: "100%"}}>
                <p className="text-lgGar" style={{color: "black", padding: "20px"}}>{item.text}</p>
                <img
                  src={`https://api.malidag.com${item.filePath}`}
                  alt="With text"
                  className="w-fullAdsfer"
                  style={{maxWidth: (isDesktop || isTablet) ? "500px" : "100%", height: "100%"}}
                />
              
              </div>
            )}

            {/* Video with Text */}
            {item.type === "video_with_text" && (
              <div className="flexfgrts" style={{display:(isDesktop || isTablet) ? "grid" : "", alignItems:(isDesktop || isTablet) ? "center" : "start", justifyContent: "space-between", padding: "10px", gridTemplateColumns: (isDesktop || isTablet) ? "1fr 2fr" : undefined,}}>
                <video
                  src={`https://api.malidag.com${item.filePath}`}
                  controls
                  className="w-fuldfreh"
                  style={{maxWidth: (isDesktop || isTablet) ? "500px" : "100%", height: "100%"}}
                />
                <p className="text-lgrdsea" style={{color: "black", padding: "20px"}}>{item.text}</p>
              </div>
            )}

           {/* Slide Images */}
{item.type === "slide_images" && (
  <div
    className="fderslijd"
    style={{
      display: (isDesktop || isTablet) ? "" : "block",
      alignItems: (isDesktop || isTablet) ? "start" : "start",
      justifyContent: "space-between",
      padding: "10px",
      
    }}
  >
    <h2
      className="fgtbchwid"
      style={{
        color: "black",
        marginBottom: "10px",
        fontSize: "18px",
        fontWeight: "bold",
      }}
    >
      {item.text}
    </h2>

    <div style={{ width: "100%", maxWidth: "100%", margin: "0 auto" }}>
      <Carousel
        showThumbs={false}
        infiniteLoop
        autoPlay
        interval={3000}
        showStatus={false}
        showIndicators={true}
        dynamicHeight={false}
      >
        {Array.isArray(item.filePath) &&
          item.filePath.map((slide, i) => (
            <div key={i}>
              <img
                src={`https://api.malidag.com${slide}`}
                alt={`Slide ${i + 1}`}
                className="rounded-gfrtse"
                style={{
                  
                  width: "100%",
                  height: (isDesktop || isTablet) ? "400px" : "300px",
                  objectFit: "cover",
                  borderRadius: "8px",
                }}
              />
            </div>
          ))}
      </Carousel>
    </div>
  </div>
)}


            {/* Single Image (Full Width) */}
            {item.type === "single_image" && (
              <div className="w-fullDersir" style={{display: "", alignItems:"center" , justifyContent: "space-between", padding: "10px", width: "100%", objectFit: "cover"}}>
                <img
                  src={`https://api.malidag.com${item.filePath}`}
                  alt="Full Image"
                  className="w-fulGdertsion"
                  style={{maxWidth: (isDesktop || isTablet) ? "100%" : "100%", height: "100%"}}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    
  );
};

export default ItemIdPage;