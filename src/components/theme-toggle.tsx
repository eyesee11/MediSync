"use client";

import * as React from "react";
import { Moon, Sun, Monitor } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  // Avoid hydration mismatch
  React.useEffect(() => {
    setMounted(true);
  }, []);

  const cycleTheme = () => {
    if (theme === "light") {
      setTheme("dark");
    } else if (theme === "dark") {
      setTheme("system");
    } else {
      setTheme("light");
    }
  };

  if (!mounted) {
    return (
      <Button variant="outline" size="icon" disabled>
        <Sun className="h-[1.2rem] w-[1.2rem]" />
        <span className="sr-only">Toggle theme</span>
      </Button>
    );
  }

  const getIcon = () => {
    switch (theme) {
      case "light":
        return (
          <Sun className="h-[1.2rem] w-[1.2rem] transition-all duration-200" />
        );
      case "dark":
        return (
          <Moon className="h-[1.2rem] w-[1.2rem] transition-all duration-200" />
        );
      case "system":
        return (
          <Monitor className="h-[1.2rem] w-[1.2rem] transition-all duration-200" />
        );
      default:
        return (
          <Sun className="h-[1.2rem] w-[1.2rem] transition-all duration-200" />
        );
    }
  };

  const getTooltipText = () => {
    switch (theme) {
      case "light":
        return "Switch to dark mode";
      case "dark":
        return "Switch to system mode";
      case "system":
        return "Switch to light mode";
      default:
        return "Toggle theme";
    }
  };

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={cycleTheme}
      title={getTooltipText()}
      className="transition-all duration-200 hover:scale-105"
    >
      {getIcon()}
      <span className="sr-only">{getTooltipText()}</span>
    </Button>
  );
}
