import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./malidagCategory.css";
import SearchSuggestions from "./searchSuggestion";
import ThemeForPersonnalCare from "./themeForPersonnalCare";
import useScreenSize from "./useIsMobile";
import ThemeForFashionKick from "./themeForFasionKick";
import ThemeForMenFashion from "./themeForMenFashion";
import ThemeForGamers from "./themeForGamers";

const BASE_URL = "http://192.168.0.210:3034";
const BASE_URLs = "http://192.168.0.210:3001";

function MalidagCategory({ user, auth }) {
  const [categories, setCategories] = useState([]);
  const [searchedItems, setSearchedItems] = useState([]);
  const navigate = useNavigate();
  const {isMobile, isDesktop, isSmallMobile, isTablet, isVerySmall} = useScreenSize()

  const userId = user?.uid;

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${BASE_URL}/themes`);
        const data = await response.json();

        const groupedCategories = data.themes.reduce((acc, item) => {
          const theme = item.theme;
          if (!acc[theme]) {
            acc[theme] = { mode: item.mode || "default", theme, items: [] };
          }
          acc[theme].items.push(item);
          return acc;
        }, {});

        const processedCategories = Object.entries(groupedCategories).map(
          ([themeName, { mode, theme, items }]) => ({
            name: themeName,
            mode,
            theme,
            items: items.slice(0, mode === "full" ? 1 : 4),
          })
        );

        setCategories(processedCategories);
      } catch (error) {
        console.error("Error fetching items:", error);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    if (!userId) return;

    const fetchSearchedItems = async () => {
      try {
        const response = await fetch(`${BASE_URLs}/search-items?userId=${userId}`);
        const data = await response.json();

        if (data?.userSearches) {
          const allSearchedItems = [];
          for (let search of data.userSearches) {
            const searchTerm = search.search;
            const itemsResponse = await fetch(`${BASE_URLs}/items/${searchTerm}`);
            const itemsData = await itemsResponse.json();
            if (itemsData?.items) {
              allSearchedItems.push(...itemsData.items);
            }
          }
          setSearchedItems(allSearchedItems.slice(0, 4));
        } else {
          setSearchedItems([]);
        }
      } catch (error) {
        console.error("Error fetching searched items:", error);
      }
    };

    fetchSearchedItems();
  }, [userId]);

  const handleDiscoverNowClick = (theme) => {
    switch (theme.toLowerCase()) {
      case "personal care for you":
        navigate("/personal");
        break;
      case "women fashion":
        navigate("/woFashion");
        break;
      case "fashion's kick":
        navigate("/faKick");
        break;
      default:
        console.warn(`Unknown theme: ${theme}`);
    }
  };

  return (
    <div className="categories-container">
       {(isTablet || isDesktop || isMobile) && (
      <SearchSuggestions/>
       )}
      {(isTablet || isDesktop) && (
       <ThemeForPersonnalCare />
    )}
     {(isTablet || isDesktop || isMobile) && (
      <ThemeForFashionKick/>
    )}
      {(isTablet || isDesktop || isMobile) && (
      <ThemeForMenFashion/>
    )}
      {(isTablet || isMobile) && (
      <ThemeForGamers/>
    )}
     
    </div>
  );
}

export default MalidagCategory;
