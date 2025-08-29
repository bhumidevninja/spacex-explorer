"use client";

import { useEffect } from "react";

export function ScrollPositionHandler() {
  useEffect(() => {
    // Get stored scroll position
    const scrollY = sessionStorage.getItem("scrollPosition");

    if (scrollY) {
      // Small delay to ensure content is rendered
      setTimeout(() => {
        window.scrollTo({
          top: parseInt(scrollY),
          behavior: "smooth",
        });

        // Clean up
        sessionStorage.removeItem("scrollPosition");
      }, 100);
    }
  }, []);

  return null; // This component doesn't render anything
}
