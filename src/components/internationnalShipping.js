import React from "react";
import useScreenSize from "./useIsMobile";
import { Helmet } from "react-helmet";

const InternationalShipping = () => {
  const { isMobile, isTablet, isSmallMobile, isVerySmall } = useScreenSize();

  return (
    <div style={{ padding: "20px", backgroundColor: "#fefefe", color: "#222" }}>
      <Helmet>
        <title>International Shipping | Malidag</title>
        <meta name="description" content="Learn how Malidag delivers products internationally. Shipping times, regions, and fees explained." />
      </Helmet>

      <h1 style={{ fontSize: "24px", marginBottom: "10px", color: "#111" }}>
        🌍 International Shipping Policy
      </h1>

      <p style={{ fontSize: "16px", lineHeight: "1.6" }}>
        Malidag is proud to offer international shipping to customers worldwide.
        Whether you’re shopping from Europe, Africa, Asia, or the Americas — we deliver!
      </p>

      <h2 style={{ marginTop: "20px", fontSize: "18px", color: "#333" }}>
        🛫 Shipping Regions
      </h2>
      <ul style={{ paddingLeft: "20px" }}>
        <li>🇺🇸 North & South America</li>
        <li>🇪🇺 Europe (all major countries)</li>
        <li>🌍 Middle East & Africa</li>
        <li>🇨🇳 Asia & Pacific regions</li>
      </ul>

      <h2 style={{ marginTop: "20px", fontSize: "18px", color: "#333" }}>
        ⏱️ Estimated Delivery Times
      </h2>
      <p>
        Delivery times may vary depending on the shipping provider and customs processes:
      </p>
      <ul style={{ paddingLeft: "20px" }}>
        <li>Standard Shipping: 7–21 business days</li>
        <li>Express Shipping: 3–7 business days</li>
      </ul>

      <h2 style={{ marginTop: "20px", fontSize: "18px", color: "#333" }}>
        💰 Shipping Fees
      </h2>
      <p>
        Shipping cost is calculated at checkout based on your location and the items in your cart.
        Orders over a certain threshold may qualify for free shipping.
      </p>

      <h2 style={{ marginTop: "20px", fontSize: "18px", color: "#333" }}>
        📦 Customs, Duties & Taxes
      </h2>
      <p>
        Customers are responsible for any applicable customs fees or import duties imposed by their country.
        Malidag is not liable for delays or charges due to customs processes.
      </p>

      <h2 style={{ marginTop: "20px", fontSize: "18px", color: "#333" }}>
        📧 Need Help?
      </h2>
      <p>
        Contact our support team at <a href="mailto:support@malidag.com">support@malidag.com</a> for any shipping questions.
      </p>
    </div>
  );
};

export default InternationalShipping;
