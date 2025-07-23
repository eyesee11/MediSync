"use client";

import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "./loading-spinner";

interface LoadingButtonProps {
  isLoading: boolean;
  children: React.ReactNode;
  loadingText?: string;
  loadingType?: "heart" | "pulse" | "medical" | "spinner";
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
  size?: "default" | "sm" | "lg" | "icon";
  type?: "button" | "submit" | "reset";
}

export function LoadingButton({
  isLoading,
  children,
  loadingText,
  loadingType = "pulse",
  disabled,
  onClick,
  className,
  variant = "default",
  size = "default",
  type = "button",
}: LoadingButtonProps) {
  return (
    <Button
      type={type}
      variant={variant}
      size={size}
      disabled={isLoading || disabled}
      onClick={onClick}
      className={`${className} transition-all duration-300 focus:ring-2 focus:ring-offset-2 focus:ring-primary`}
      aria-busy={isLoading}
      aria-describedby={isLoading ? "loading-status" : undefined}
    >
      <motion.div
        className="flex items-center justify-center space-x-2"
        animate={isLoading ? { opacity: 0.8 } : { opacity: 1 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        {isLoading && (
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 180 }}
            transition={{ duration: 0.4, ease: "backOut" }}
            aria-hidden="true"
          >
            <LoadingSpinner size="sm" type={loadingType} />
          </motion.div>
        )}
        <motion.span
          animate={isLoading ? { x: 5 } : { x: 0 }}
          transition={{ duration: 0.3 }}
        >
          {isLoading && loadingText ? loadingText : children}
        </motion.span>
      </motion.div>
      {isLoading && (
        <span id="loading-status" className="sr-only">
          {loadingText || "Loading, please wait"}
        </span>
      )}
    </Button>
  );
}
