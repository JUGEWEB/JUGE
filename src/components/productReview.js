import React from "react";
import { useParams } from "react-router-dom";
import AnalyseReview from "./analyseReview";

const ProductReview = () => {
  const { productId } = useParams();

  return (
    <div>
      <h1>Review analyser</h1>
      {/* Other product details can go here */}

      {/* 🔹 Integrate Review Analysis */}
      <AnalyseReview productId={productId} onRatingClick={(rating) => console.log("Clicked rating:", rating)} />
    </div>
  );
};

export default ProductReview;
