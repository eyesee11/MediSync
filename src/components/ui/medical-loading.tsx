"use client";

import React from "react";
import { motion } from "framer-motion";
import { Heart, Activity, Stethoscope, Plus } from "lucide-react";

interface MedicalLoadingProps {
  message?: string;
  size?: "sm" | "md" | "lg";
  variant?: "heart" | "circle";
}

export function MedicalLoading({
  message = "Loading...",
  size = "md",
  variant = "heart",
}: MedicalLoadingProps) {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16",
  };

  const containerSize = {
    sm: "w-16 h-16",
    md: "w-24 h-24",
    lg: "w-32 h-32",
  };

  const dotSizes = {
    sm: "w-2 h-2",
    md: "w-3 h-3",
    lg: "w-4 h-4",
  };

  if (variant === "circle") {
    return (
      <div className="flex flex-col items-center justify-center space-y-4">
        {/* Dotted Whirling Circle */}
        <div
          className={`relative ${containerSize[size]} flex items-center justify-center`}
        >
          <motion.div
            className="relative"
            animate={{
              rotate: 360,
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            {/* Create 8 dots around a circle */}
            {Array.from({ length: 8 }).map((_, i) => {
              const angle = (i * 360) / 8;
              const radius = size === "sm" ? 20 : size === "md" ? 30 : 40;
              const x = Math.cos((angle * Math.PI) / 180) * radius;
              const y = Math.sin((angle * Math.PI) / 180) * radius;

              return (
                <motion.div
                  key={i}
                  className={`absolute ${dotSizes[size]} bg-blue-500 rounded-full`}
                  style={{
                    left: `calc(50% + ${x}px)`,
                    top: `calc(50% + ${y}px)`,
                    transform: "translate(-50%, -50%)",
                  }}
                  animate={{
                    opacity: [0.3, 1, 0.3],
                    scale: [0.8, 1.2, 0.8],
                  }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    delay: i * 0.125, // Stagger the animation
                    ease: "easeInOut",
                  }}
                />
              );
            })}
          </motion.div>
        </div>

        {/* Loading text */}
        <motion.p
          className="text-muted-foreground text-sm text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {message}
        </motion.p>
      </div>
    );
  }

  // Original heart animation for backward compatibility
  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      {/* Heartbeat Animation */}
      <div
        className={`relative ${containerSize[size]} flex items-center justify-center`}
      >
        <motion.div
          className="absolute"
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

        {/* Pulse rings */}
        <motion.div
          className={`absolute ${sizeClasses[size]} border-2 border-red-500 rounded-full`}
          animate={{
            scale: [1, 2],
            opacity: [1, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeOut",
          }}
        />
        <motion.div
          className={`absolute ${sizeClasses[size]} border-2 border-red-500 rounded-full`}
          animate={{
            scale: [1, 2],
            opacity: [1, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeOut",
            delay: 0.5,
          }}
        />
      </div>

      {/* Loading text with typing animation */}
      <motion.p
        className="text-muted-foreground text-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        {message}
      </motion.p>

      {/* Medical icons floating */}
      <div className="flex space-x-4">
        <motion.div
          animate={{
            y: [-5, 5, -5],
            rotate: [-5, 5, -5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <Stethoscope className="w-4 h-4 text-blue-500" />
        </motion.div>
        <motion.div
          animate={{
            y: [5, -5, 5],
            rotate: [5, -5, 5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.3,
          }}
        >
          <Activity className="w-4 h-4 text-green-500" />
        </motion.div>
        <motion.div
          animate={{
            y: [-3, 3, -3],
            rotate: [-3, 3, -3],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.6,
          }}
        >
          <Plus className="w-4 h-4 text-red-500" />
        </motion.div>
      </div>
    </div>
  );
}

export function FullPageMedicalLoading({ message }: { message?: string }) {
  return (
    <motion.div
      className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <motion.div
        className="bg-card rounded-lg shadow-lg p-8 max-w-sm w-full mx-4"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        <MedicalLoading message={message} size="lg" variant="circle" />
      </motion.div>
    </motion.div>
  );
}
