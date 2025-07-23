"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  showText?: boolean;
}

export function Logo({ className, size = "md", showText = true }: LogoProps) {
  const router = useRouter();
  const pathname = usePathname();

  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-12 w-12",
  };

  const textSizeClasses = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-2xl",
  };

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();

    // If we're already on the landing page, just scroll to top
    if (pathname === "/") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    // For other pages, navigate to landing page
    // First try to use same tab navigation
    router.push("/");
  };

  return (
    <div
      onClick={handleClick}
      className={cn(
        "flex items-center gap-2 hover:opacity-80 transition-opacity cursor-pointer",
        className
      )}
    >
      <Image
        src="/logo.png"
        alt="MediSync Logo"
        width={40}
        height={40}
        className={cn(sizeClasses[size], "object-contain")}
        priority
      />
      {showText && (
        <span className={cn("font-bold text-primary", textSizeClasses[size])}>
          MediSync
        </span>
      )}
    </div>
  );
}
