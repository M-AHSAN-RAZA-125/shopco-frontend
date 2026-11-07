import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Jab bhi URL path change hoga, window top par scroll ho jayegi
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

export default ScrollToTop;