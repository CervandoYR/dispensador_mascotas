"use client";

import { useState, useEffect } from "react";
import { Type } from "lucide-react";
import { motion } from "framer-motion";

export default function AccessibilityToggle() {
  const [mounted, setMounted] = useState(false);
  const [isLargeText, setIsLargeText] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("petfeeder_accessibility_font");
    if (saved === "large") {
      setIsLargeText(true);
      document.documentElement.style.fontSize = "112.5%"; // 18px base instead of 16px
    }
  }, []);

  const toggleFontSize = () => {
    if (isLargeText) {
      document.documentElement.style.fontSize = "100%";
      localStorage.setItem("petfeeder_accessibility_font", "normal");
      setIsLargeText(false);
    } else {
      document.documentElement.style.fontSize = "112.5%";
      localStorage.setItem("petfeeder_accessibility_font", "large");
      setIsLargeText(true);
    }
  };

  if (!mounted) {
    return <div className="w-8 h-8 rounded-lg bg-white/[0.02] border border-white/[0.06]" />;
  }

  return (
    <motion.button
      onClick={toggleFontSize}
      className={`p-2 rounded-lg border flex items-center justify-center w-8 h-8 transition-all cursor-pointer ${
        isLargeText 
          ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500 dark:text-emerald-400" 
          : "bg-zinc-100 hover:bg-zinc-200 dark:bg-white/[0.03] dark:hover:bg-white/[0.06] border-zinc-200 dark:border-white/[0.06] text-zinc-600 hover:text-zinc-950 dark:text-white/50 dark:hover:text-white/80"
      }`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      title={isLargeText ? "Restaurar tamaño normal" : "Aumentar tamaño general para accesibilidad visual"}
    >
      <Type className="h-4 w-4" strokeWidth={isLargeText ? 2.5 : 1.5} />
    </motion.button>
  );
}
