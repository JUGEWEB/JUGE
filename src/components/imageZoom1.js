import React, { useState } from 'react';

const ImageZoom1 = ({ selectedImage, onMouseEnter, onMouseLeave, isZoomVisible, zoomedPosition, onMouseMove }) => {


  return (
    <div
      className="image-container"
      style={{ position: 'relative', width: '500px', height: '100%', alignItems: "center", display: "flex", justifyContent: "center" }}
      onMouseMove={onMouseMove} // Use parent function
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <img
        src={selectedImage}
        alt="Zoomable Product"
        style={{ maxWidth: '500px', height: 'auto', maxHeight: "550px", alignItems: "center", justifyContent: "center", display: "flex" }}
      />

 {/* Zoom Highlight (Only visible when parent state allows it) */}
 {isZoomVisible && (
        <div
          className="zoom-highlight"
          style={{
            position: 'absolute',
           width: '125px', // Adjusted to match zoom ratio
            height: '100px', // Adjusted to match proportions
            left: `calc(${zoomedPosition.x}% - 50px)`,
            top: `calc(${zoomedPosition.y}% - 50px)`,
           
            background: ' #04447850',
            pointerEvents: 'none',
            boxShadow: '0 0 10px rgba(255, 255, 255, 0.5)',
          }}
        />
      )}

      

    </div>
  );
};

export default ImageZoom1;
