import React from "react";
import useScreenSize from "./useIsMobile";
import { Helmet } from "react-helmet";
import { parseWithEmoji } from "./twemojiflag";
import { useTranslation } from "react-i18next";
import i18n from "i18next";


const InternationalShipping = () => {
  const { isMobile, isTablet, isSmallMobile, isVerySmall } = useScreenSize();
  const { t } = useTranslation();
  const currentLang = i18n.language; // 👈 this gives the current active language

  return (
    <div style={{ padding: "20px", backgroundColor: "#fefefe", color: "#222" }}>
      <Helmet>
        <title>International Shipping | Malidag</title>
        <meta name="description" content="Learn how Malidag delivers products internationally. Shipping times, regions, and fees explained." />
      </Helmet>

      <style>
    {`.emoji {
      height: 1em;
      width: 1em;
      margin: 0 2px;
      vertical-align: -0.2em;
    }`}
  </style>

      <h1 style={{ fontSize: "24px", marginBottom: "10px", color: "#111" }}>
        🌍 {t("international_shipping_policy_title")}
      </h1>

      <p style={{ fontSize: "16px", lineHeight: "1.6" }}>
       {t("international_shipping_policy")}
      </p>

     <h2>🛫 {t("shipping_regions_country_title")}</h2>
<ul style={{ paddingLeft: "20px", lineHeight: "1.8", fontFamily: '"Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", "Twemoji Mozilla", sans-serif' }}>
  <li
    dangerouslySetInnerHTML={{
      __html: parseWithEmoji(`<strong>${t("americas")}:</strong><br />${t("americas_list")}`)
    }}
    style={{ lineHeight: "1.8", fontSize: "16px" }}
  />
  <li
    dangerouslySetInnerHTML={{
      __html: parseWithEmoji(`<strong>${t("europe")}:</strong><br />${t("europe_list")}`)
    }}
    style={{ lineHeight: "1.8", fontSize: "16px" }}
  />
  <li
    dangerouslySetInnerHTML={{
      __html: parseWithEmoji(`<strong>${t("middle_east_africa")}:</strong><br />${t("middle_east_africa_list")}`)
    }}
    style={{ lineHeight: "1.8", fontSize: "16px" }}
  />
  <li
    dangerouslySetInnerHTML={{
      __html: parseWithEmoji(`<strong>${t("asia_pacific")}:</strong><br />${t("asia_pacific_list")}`)
    }}
    style={{ lineHeight: "1.8", fontSize: "16px" }}
  />
</ul>



      <h2 style={{ marginTop: "20px", fontSize: "18px", color: "#333" }}>
  ⏱️ {t("Estimate_delivery_time_title")}
</h2>
<p style={{ lineHeight: "1.6", fontSize: "16px" }}>
 {t("Estimate_delivery_time_paragraph1")}
</p>

<p style={{ lineHeight: "1.6", fontSize: "16px" }}>
 {t("Estimate_delivery_time_paragraph2")}
</p>

<ul style={{ paddingLeft: "20px", fontSize: "16px", lineHeight: "1.6" }}>
  <li
    dangerouslySetInnerHTML={{
      __html: t("standard")
    }}
  />
  <li
    dangerouslySetInnerHTML={{
      __html: t("express")
    }}
  />
</ul>


<p style={{ lineHeight: "1.6", fontSize: "16px" }}>
 {t("Estimate_delivery_time_paragraph3")}
</p>

<p style={{ lineHeight: "1.6", fontSize: "16px" }}>
  {t("Estimate_delivery_time_paragraph4")}
</p>


      <h2 style={{ marginTop: "20px", fontSize: "18px", color: "#333" }}>
  💰 {t("Shipping_Fees_title")}
</h2>

<p style={{ fontSize: "16px", lineHeight: "1.6" }}>
 {t("Shipping_Fees_paragraph1")}
</p>

<p style={{ fontSize: "16px", lineHeight: "1.6" }}>
 {t("Shipping_Fees_paragraph2")}
</p>

<p style={{ fontSize: "16px", lineHeight: "1.6" }}>
  {t("Shipping_Fees_paragraph3")}
</p>

<p style={{ fontSize: "16px", lineHeight: "1.6" }}>
  {t("Shipping_Fees_paragraph4")}
</p>


     <h2 style={{ marginTop: "20px", fontSize: "18px", color: "#333" }}>
  📦 {t("Customs_Duties_Taxes_title")}
</h2>

<p style={{ fontSize: "16px", lineHeight: "1.6" }}>
 {t("Customs_Duties_Taxes_paragraph1")}
</p>

<p style={{ fontSize: "16px", lineHeight: "1.6" }}>
{t("Customs_Duties_Taxes_paragraph2")}
</p>

<p style={{ fontSize: "16px", lineHeight: "1.6" }}>
  {t("Customs_Duties_Taxes_paragraph3")}
</p>

<p style={{ fontSize: "16px", lineHeight: "1.6" }}>
 {t("Customs_Duties_Taxes_paragraph4")}
</p>


      <h2 style={{ marginTop: "20px", fontSize: "18px", color: "#333" }}>
        📧 {t("Need_Help_title")}
      </h2>
      <p>
        {t("Need_Help_part1")} <a href="mailto:support@malidag.com">support@malidag.com</a>  {t("Need_Help_part2")}
      </p>
    </div>
  );
};

export default InternationalShipping;
