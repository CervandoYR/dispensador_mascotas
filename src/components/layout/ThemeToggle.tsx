"use client";

import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
import { Sun, Moon } from "lucide-react";
import { motion } from "framer-motion";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="w-8 h-8 rounded-lg bg-white/[0.02] border border-white/[0.06]" />;
  }

  const isDark = theme === "dark";

  return (
    <motion.button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="p-2 rounded-lg bg-zinc-100 hover:bg-zinc-200 dark:bg-white/[0.03] dark:hover:bg-white/[0.06] border border-zinc-200 dark:border-white/[0.06] text-zinc-600 hover:text-zinc-950 dark:text-white/50 dark:hover:text-white/80 transition-all cursor-pointer flex items-center justify-center w-8 h-8"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      title="Cambiar tema"
    >
      <motion.div
        key={theme}
        initial={{ rotate: -45, opacity: 0, scale: 0.8 }}
        animate={{ rotate: 0, opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
      >
        {isDark ? (
          <Sun className="h-4 w-4 text-emerald-400 animate-[spin_20s_linear_infinite]" strokeWidth={1.5} />
        ) : (
          <Moon className="h-4 w-4 text-indigo-500" strokeWidth={1.5} />
        )}
      </motion.div>
    </motion.button>
  );
}
