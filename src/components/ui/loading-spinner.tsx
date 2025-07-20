"use client";

import React from "react";
import { motion } from "framer-motion";
import { Heart, Activity, Stethoscope, Plus, Loader2 } from "lucide-react";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  type?: "heart" | "pulse" | "medical" | "spinner";
  message?: string;
}

export function LoadingSpinner({
  size = "md",
  type = "medical",
  message,
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "w-6 h-6",
    md: "w-8 h-8",
    lg: "w-12 h-12",
  };

  if (type === "heart") {
    return (
      <div className="flex flex-col items-center space-y-2">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.7, 1, 0.7],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <Heart className={`${sizeClasses[size]} text-red-500 fill-current`} />
        </motion.div>
        {message && <p className="text-xs text-muted-foreground">{message}</p>}
      </div>
    );
  }

  if (type === "pulse") {
    return (
      <div className="flex flex-col items-center space-y-2">
        <div className="relative">
          <motion.div
            className={`${sizeClasses[size]} border-2 border-green-500 rounded-full`}
            animate={{
              scale: [1, 1.5, 1],
              opacity: [1, 0.5, 1],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            animate={{ rotate: 360 }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            <Activity className="w-4 h-4 text-green-500" />
          </motion.div>
        </div>
        {message && <p className="text-xs text-muted-foreground">{message}</p>}
      </div>
    );
  }

  if (type === "spinner") {
    return (
      <div className="flex flex-col items-center space-y-2">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          <Loader2 className={`${sizeClasses[size]} text-primary`} />
        </motion.div>
        {message && <p className="text-xs text-muted-foreground">{message}</p>}
      </div>
    );
  }

  // Default medical type
  return (
    <div className="flex flex-col items-center space-y-2">
      <div className="relative">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          <Stethoscope className={`${sizeClasses[size]} text-blue-500`} />
        </motion.div>
        <motion.div
          className="absolute -top-1 -right-1"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <Plus className="w-3 h-3 text-red-500" />
        </motion.div>
      </div>
      {message && <p className="text-xs text-muted-foreground">{message}</p>}
    </div>
  );
}
