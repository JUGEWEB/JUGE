// src/hooks/useScrollResetOnNavigate.js
import { useLocation } from "react-router-dom";
import { useEffect } from "react";

export default function useScrollResetOnNavigate() {
  const location = useLocation();

  useEffect(() => {
    // Always reset scroll on route change
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [location.key]); // key ensures rerender on every route change
}
