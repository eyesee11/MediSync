"use client";

import React, { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { FullPageMedicalLoading } from "./medical-loading";

interface PageTransitionProps {
  children: React.ReactNode;
}

export function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(false);
  const [currentPath, setCurrentPath] = useState(pathname);
  const loadingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (pathname !== currentPath) {
      setIsLoading(true);

      // Clear any existing timeout
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
      }

      // Set a minimum loading time but also listen for when the page is actually ready
      const minLoadingTime = 300; // Minimum 300ms for better UX
      const maxLoadingTime = 1500; // Maximum 1.5s timeout
      const startTime = Date.now();

      // Function to end loading
      const endLoading = () => {
        const elapsedTime = Date.now() - startTime;
        const remainingTime = Math.max(0, minLoadingTime - elapsedTime);

        setTimeout(() => {
          setIsLoading(false);
          setCurrentPath(pathname);
        }, remainingTime);
      };

      // Set maximum timeout as fallback
      loadingTimeoutRef.current = setTimeout(endLoading, maxLoadingTime);

      // Listen for when the document is ready (simulating real page load)
      if (document.readyState === "complete") {
        endLoading();
      } else {
        const handleLoad = () => {
          endLoading();
          window.removeEventListener("load", handleLoad);
        };
        window.addEventListener("load", handleLoad);

        // Also listen for DOM content loaded
        const handleDOMContentLoaded = () => {
          // Give a small delay after DOM is loaded to ensure rendering
          setTimeout(endLoading, 100);
          document.removeEventListener(
            "DOMContentLoaded",
            handleDOMContentLoaded
          );
        };

        if (document.readyState === "loading") {
          document.addEventListener("DOMContentLoaded", handleDOMContentLoaded);
        } else {
          handleDOMContentLoaded();
        }
      }

      // Cleanup function
      return () => {
        if (loadingTimeoutRef.current) {
          clearTimeout(loadingTimeoutRef.current);
        }
      };
    }
  }, [pathname, currentPath]);

  const getLoadingMessage = (path: string) => {
    switch (path) {
      case "/dashboard":
        return "Loading your health dashboard...";
      case "/records":
        return "Accessing medical records...";
      case "/search":
        return "Finding healthcare providers...";
      case "/chatbot":
        return "Starting AI health assistant...";
      case "/profile":
        return "Loading your profile...";
      case "/login":
        return "Securing your connection...";
      case "/doctor-onboarding":
        return "Loading registration form...";
      case "/patient-onboarding":
        return "Loading registration form...";
      default:
        return "Loading medical platform...";
    }
  };

  return (
    <AnimatePresence mode="wait">
      {isLoading ? (
        <FullPageMedicalLoading
          key="loading"
          message={getLoadingMessage(pathname)}
        />
      ) : (
        <motion.div
          key={currentPath}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{
            duration: 0.3,
            ease: "easeInOut",
          }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
