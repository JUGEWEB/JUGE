import React, { useState, useEffect } from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // Import carousel CSS

const ItemIdPage = ({ id }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`http://192.168.0.210:5000/api/items/items/${id}`);
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
    <div className="p-4" style={{padding: "20px"}}>
      <h1 className="text-2xl font-bold mb-6 text-center" style={{color: "black"}}>From the brand</h1>

      <div className="grid gap-6">
        {data.media.map((item, index) => (
          <div key={index} className="flex flex-col items-center">
            {/* Image with Text */}
            {item.type === "image_with_text" && (
              <div className="flex flex-col md:flex-row items-center gap-6 bg-gray-100 p-4 rounded-lg" style={{display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px"}}>
                <img
                  src={`http://192.168.0.210:5000${item.filePath}`}
                  alt="With text"
                  className="w-full md:w-1/3 h-auto rounded-lg shadow-md"
                  style={{maxWidth: "500px", height: "auto"}}
                />
                <p className="text-lg md:w-2/3" style={{color: "black", padding: "20px"}}>{item.text}</p>
              </div>
            )}

            {item.type === "image-Left_with_text" && (
              <div className="flex flex-col md:flex-row items-center gap-6 bg-gray-100 p-4 rounded-lg" style={{display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px"}}>
                <p className="text-lg md:w-2/3" style={{color: "black", padding: "20px"}}>{item.text}</p>
                <img
                  src={`http://192.168.0.210:5000${item.filePath}`}
                  alt="With text"
                  className="w-full md:w-1/3 h-auto rounded-lg shadow-md"
                  style={{maxWidth: "500px", height: "auto"}}
                />
              
              </div>
            )}

            {/* Video with Text */}
            {item.type === "video_with_text" && (
              <div className="flex flex-col md:flex-row-reverse items-center gap-6 bg-gray-100 p-4 rounded-lg">
                <video
                  src={`http://192.168.0.210:5000${item.filePath}`}
                  controls
                  className="w-full md:w-1/2 h-auto rounded-lg shadow-md"
                />
                <p className="text-lg md:w-1/2">{item.text}</p>
              </div>
            )}

            {/* Slide Images */}
            {item.type === "slide_images" && (
              <div className="w-full max-w-3xl mx-auto">
                <h2 className="text-xl font-semibold text-center mb-4" style={{color: "black"}}>{item.text}</h2>
                <Carousel showThumbs={false} infiniteLoop autoPlay>
                  {Array.isArray(item.filePath) &&
                    item.filePath.map((slide, i) => (
                      <div key={i}>
                        <img
                          src={`http://192.168.0.210:5000${slide}`}
                          alt={`Slide ${i + 1}`}
                          className="rounded-lg shadow-md"
                        />
                      </div>
                    ))}
                </Carousel>
                <p className="text-center mt-2">{item.text}</p>
              </div>
            )}

            {/* Single Image (Full Width) */}
            {item.type === "single_image" && (
              <div className="w-full flex justify-center">
                <img
                  src={`http://192.168.0.210:5000${item.filePath}`}
                  alt="Full Image"
                  className="w-full max-w-[1200px] h-[400px] object-cover rounded-lg shadow-md"
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ItemIdPage;
