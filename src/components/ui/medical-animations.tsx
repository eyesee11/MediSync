"use client";

import React from "react";
import { motion } from "framer-motion";
import { Heart, Activity, Stethoscope, Plus, Zap, Shield } from "lucide-react";

export function FloatingMedicalIcons() {
  const icons = [
    { Icon: Heart, color: "text-red-500", delay: 0 },
    { Icon: Activity, color: "text-green-500", delay: 0.5 },
    { Icon: Stethoscope, color: "text-blue-500", delay: 1 },
    { Icon: Plus, color: "text-red-600", delay: 1.5 },
    { Icon: Zap, color: "text-yellow-500", delay: 2 },
    { Icon: Shield, color: "text-purple-500", delay: 2.5 },
  ];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {icons.map(({ Icon, color, delay }, index) => (
        <motion.div
          key={index}
          className={`absolute ${color} opacity-20`}
          initial={{
            x: Math.random() * 1000,
            y: Math.random() * 800,
            scale: 0.5,
            opacity: 0,
          }}
          animate={{
            x: Math.random() * 1000,
            y: Math.random() * 800,
            scale: [0.5, 1, 0.5],
            opacity: [0, 0.3, 0],
            rotate: [0, 360, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            delay: delay,
            ease: "linear",
          }}
        >
          <Icon className="w-8 h-8" />
        </motion.div>
      ))}
    </div>
  );
}

export function PulsingHeartbeat() {
  return (
    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
      <motion.div
        className="relative"
        animate={{
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <Heart className="w-32 h-32 text-red-500/10 fill-current" />

        {/* EKG Line */}
        <motion.div
          className="absolute top-1/2 left-0 w-full h-0.5 bg-red-500/20"
          animate={{
            scaleX: [0, 1, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </motion.div>
    </div>
  );
}
