import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    const el = document.getElementById("scrollable-content");
    if (el?.scrollTo) {
      el.scrollTo({ top: 0, behavior: "auto" });
    }
  }, [pathname]);

  return null;
}
