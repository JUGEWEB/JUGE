import React, { useState } from "react";
import { changeLanguage, getCurrentLanguage } from "../languageSwitcher";
import { parseWithEmoji } from "./twemojiflag";


// Full list of supported languages
const languages = [
  { code: "af", label: "Afrikaans" },
  { code: "am", label: "አማርኛ" },
  { code: "ar", label: "العربية" },
  { code: "az", label: "Azərbaycan dili" },
  { code: "be", label: "Беларуская" },
  { code: "bg", label: "Български" },
  { code: "bn", label: "বাংলা" },
  { code: "bs", label: "Bosanski" },
  { code: "ca", label: "Català" },
  { code: "ceb", label: "Cebuano" },
  { code: "co", label: "Corsu" },
  { code: "cs", label: "Čeština" },
  { code: "cy", label: "Cymraeg" },
  { code: "da", label: "Dansk" },
  { code: "de", label: "Deutsch" },
  { code: "el", label: "Ελληνικά" },
  { code: "en", label: "English" },
  { code: "eo", label: "Esperanto" },
  { code: "es", label: "Español" },
  { code: "et", label: "Eesti" },
  { code: "eu", label: "Euskara" },
  { code: "fa", label: "فارسی" },
  { code: "fi", label: "Suomi" },
  { code: "fr", label: "Français" },
  { code: "fy", label: "Frysk" },
  { code: "ga", label: "Gaeilge" },
  { code: "gd", label: "Gàidhlig" },
  { code: "gl", label: "Galego" },
  { code: "gu", label: "ગુજરાતી" },
  { code: "ha", label: "Hausa" },
  { code: "haw", label: "ʻŌlelo Hawaiʻi" },
  { code: "he", label: "עברית" },
  { code: "hi", label: "हिन्दी" },
  { code: "hmn", label: "Hmoob" },
  { code: "hr", label: "Hrvatski" },
  { code: "ht", label: "Kreyòl ayisyen" },
  { code: "hu", label: "Magyar" },
  { code: "hy", label: "Հայերեն" },
  { code: "id", label: "Bahasa Indonesia" },
  { code: "ig", label: "Igbo" },
  { code: "is", label: "Íslenska" },
  { code: "it", label: "Italiano" },
  { code: "ja", label: "日本語" },
  { code: "jw", label: "Basa Jawa" },
  { code: "ka", label: "ქართული" },
  { code: "kk", label: "Қазақ тілі" },
  { code: "km", label: "ភាសាខ្មែរ" },
  { code: "kn", label: "ಕನ್ನಡ" },
  { code: "ko", label: "한국어" },
  { code: "ku", label: "Kurdî" },
  { code: "ky", label: "Кыргызча" },
  { code: "la", label: "Latina" },
  { code: "lb", label: "Lëtzebuergesch" },
  { code: "lo", label: "ລາວ" },
  { code: "lt", label: "Lietuvių" },
  { code: "lv", label: "Latviešu" },
  { code: "mg", label: "Malagasy" },
  { code: "mi", label: "Māori" },
  { code: "mk", label: "Македонски" },
  { code: "ml", label: "മലയാളം" },
  { code: "mn", label: "Монгол" },
  { code: "mr", label: "मराठी" },
  { code: "ms", label: "Bahasa Melayu" },
  { code: "mt", label: "Malti" },
  { code: "my", label: "မြန်မာ" },
  { code: "ne", label: "नेपाली" },
  { code: "nl", label: "Nederlands" },
  { code: "no", label: "Norsk" },
  { code: "ny", label: "Chichewa" },
  { code: "pa", label: "ਪੰਜਾਬੀ" },
  { code: "pl", label: "Polski" },
  { code: "ps", label: "پښتو" },
  { code: "pt", label: "Português" },
  { code: "ro", label: "Română" },
  { code: "ru", label: "Русский" },
  { code: "rw", label: "Kinyarwanda" },
  { code: "sd", label: "سنڌي" },
  { code: "si", label: "සිංහල" },
  { code: "sk", label: "Slovenčina" },
  { code: "sl", label: "Slovenščina" },
  { code: "sm", label: "Gagana Samoa" },
  { code: "sn", label: "ChiShona" },
  { code: "so", label: "Soomaali" },
  { code: "sq", label: "Shqip" },
  { code: "sr", label: "Српски" },
  { code: "st", label: "Sesotho" },
  { code: "su", label: "Basa Sunda" },
  { code: "sv", label: "Svenska" },
  { code: "sw", label: "Kiswahili" },
  { code: "ta", label: "தமிழ்" },
  { code: "te", label: "తెలుగు" },
  { code: "tg", label: "Тоҷикӣ" },
  { code: "th", label: "ไทย" },
  { code: "tk", label: "Türkmen" },
  { code: "tl", label: "Tagalog" },
  { code: "tr", label: "Türkçe" },
  { code: "tt", label: "Татар" },
  { code: "ug", label: "ئۇيغۇرچە" },
  { code: "uk", label: "Українська" },
  { code: "ur", label: "اردو" },
  { code: "uz", label: "Oʻzbekcha" },
  { code: "vi", label: "Tiếng Việt" },
  { code: "xh", label: "isiXhosa" },
  { code: "yi", label: "ייִדיש" },
  { code: "yo", label: "Yorùbá" },
  { code: "zh", label: "中文" },
  { code: "zu", label: "isiZulu" },

];


const LanguageSelector = () => {
  const current = getCurrentLanguage().split("-")[0];
  const [isOpen, setIsOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const selectedLang = languages.find((l) => l.code === current);

  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      <div
        style={{
          borderRadius: "0px",
          padding: "6px 10px",
          minWidth: "auto",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
        onClick={() => setIsOpen(!isOpen)}
      >
         <img
        src="https://flagcdn.com/gb.svg"
        alt="UK Flag"
        style={{ width: "24px", height: "16px", objectFit: "cover", marginRight: "5px" }}
      />
       <span>{selectedLang?.code.charAt(0).toUpperCase() + selectedLang?.code.slice(1)}</span>
        <span style={{ marginLeft: "10px" }}>▼</span>
      </div>

      {isOpen && (
      <ul
  style={{
    position: "absolute",
    top: "100%",
    right: 0,
    zIndex: 10,
    background: "#fff",
    border: "1px solid #ccc",
    borderRadius: "4px",
    listStyle: "none",
    color: "black",
    padding: 0,
    margin: "5px 0 0 0",
    minWidth: "180px",          // ✅ Ensures it’s wider
    maxWidth: "300px",          // Optional cap
    maxHeight: "400px",
    overflowY: "auto",
    fontSize: "16px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
  }}
>
   <li
  onClick={() => {
    setShowModal(true);
    setIsOpen(false);
  }}
  style={{
    padding: "10px 14px",
    textAlign: "center",
    backgroundColor: "#f9f9f9",
    fontStyle: "italic",
    cursor: "pointer",
    color: "#0078ff",
    fontSize: "11px",
    borderTop: "1px solid #ddd",
  }}
>
  ℹ️ What happens when you change the language?
</li>

  {languages.map((lang) => (
<div style={{color: "black"}}>

    <li
      key={lang.code}
      style={{
        padding: "12px 14px",
        cursor: "pointer",
        backgroundColor: lang.code === current ? "#f0f0f0" : "#fff",
        borderBottom: "1px solid #eee",
        whiteSpace: "nowrap",     // prevent wrapping
      }}
      onClick={() => {
        changeLanguage(lang.code);
        setIsOpen(false);
      }}
    >

      {`${lang.label} - ${lang.code}`}
    </li>
    </div>
  ))}
</ul>
      )}

      {showModal && (
  <div style={{
    position: "fixed",
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: "rgba(0,0,0,0.4)",
    display: "flex",
    alignItems: "center",
    color: "black",
    justifyContent: "center",
    zIndex: 9999
  }}>
    <div style={{
      backgroundColor: "#fff",
      padding: "24px",
      borderRadius: "8px",
      maxWidth: "400px",
      textAlign: "center",
      boxShadow: "0 2px 8px rgba(0,0,0,0.2)"
    }}>
      <h3 style={{ marginBottom: "12px" }}>Language Change</h3>
      <p style={{ fontSize: "14px", lineHeight: "1.5" }}>
        By changing the language, all parts of the app including product names, reviews, and content will be shown in the selected language.
        <br /><br />
        The native language of this app is <strong>English</strong>.
      </p>
      <button
        onClick={() => setShowModal(false)}
        style={{
          marginTop: "20px",
          padding: "8px 16px",
          backgroundColor: "#0078ff",
          color: "#fff",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer"
        }}
      >
        Got it
      </button>
    </div>
  </div>
)}

    </div>
  );
};

export default LanguageSelector;