"use client";

import { motion } from "framer-motion";
import { Droplets, AlertTriangle, Clock } from "lucide-react";

interface FoodLevelCardProps {
  level: number;
  lastDispensed: string;
  hasJam: boolean;
}

export default function FoodLevelCard({
  level,
  lastDispensed,
  hasJam,
}: FoodLevelCardProps) {
  const clampedLevel = Math.max(0, Math.min(100, level));

  const radius = 80;
  const circumference = Math.PI * radius;
  const offset = circumference - (clampedLevel / 100) * circumference;

  const getColor = (l: number) => {
    if (l > 50)
      return {
        stroke: "#10b981",
        glow: "rgba(16, 185, 129, 0.3)",
        label: "Óptimo",
        labelBg: "bg-emerald-500/10",
        labelText: "text-emerald-400/80",
      };
    if (l > 20)
      return {
        stroke: "#f59e0b",
        glow: "rgba(245, 158, 11, 0.3)",
        label: "Medio",
        labelBg: "bg-amber-500/10",
        labelText: "text-amber-400/80",
      };
    return {
      stroke: "#ef4444",
      glow: "rgba(239, 68, 68, 0.3)",
      label: "Crítico",
      labelBg: "bg-red-500/10",
      labelText: "text-red-400/80",
    };
  };

  const color = getColor(clampedLevel);

  const formatTime = (iso: string) => {
    try {
      const date = new Date(iso);
      return date.toLocaleTimeString("es-ES", {
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "--:--";
    }
  };

  return (
    <motion.div
      className="glass-card overflow-hidden"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="px-4 pt-3 pb-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <motion.div
            className="p-1.5 rounded-lg bg-zinc-200/50 dark:bg-white/[0.06]"
            whileHover={{ scale: 1.1 }}
          >
            <Droplets className="h-3.5 w-3.5 text-zinc-500 dark:text-white/50" strokeWidth={1.5} />
          </motion.div>
          <span className="text-xs font-medium text-zinc-600 dark:text-white/60">
            Nivel de Comida
          </span>
        </div>
        <span className="text-[10px] font-mono text-zinc-400/80 dark:text-white/25 bg-zinc-100 dark:bg-white/[0.04] px-2 py-0.5 rounded">
          HC-SR04
        </span>
      </div>

      <div className="flex flex-col items-center pt-2 pb-4 px-4">
        <div className="relative w-44 h-24 mb-3">
          <svg className="w-full h-full" viewBox="0 0 200 110" fill="none">
            <path
              d="M 20 100 A 80 80 0 0 1 180 100"
              stroke="rgba(255,255,255,0.04)"
              strokeWidth="14"
              strokeLinecap="round"
              fill="none"
            />
            <motion.path
              d="M 20 100 A 80 80 0 0 1 180 100"
              stroke={color.stroke}
              strokeWidth="14"
              strokeLinecap="round"
              fill="none"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset: offset }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              style={{
                filter: `drop-shadow(0 0 6px ${color.glow})`,
              }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-end pb-1">
            <span className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white/90">
              {clampedLevel}
            </span>
            <span className="text-[10px] text-zinc-400 dark:text-white/30 -mt-0.5">%</span>
          </div>
        </div>

        <motion.div
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-medium ${color.labelBg} ${color.labelText} mb-3`}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <motion.span
            className="h-1.5 w-1.5 rounded-full"
            style={{ backgroundColor: color.stroke }}
            animate={{ opacity: [1, 0.4, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          {color.label}
        </motion.div>

        {hasJam && (
          <motion.div
            className="flex items-center gap-2 px-3 py-2 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-[11px] mb-3 w-full"
            animate={{ opacity: [1, 0.6, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0" strokeWidth={1.5} />
            <span className="font-medium">Atasco detectado</span>
          </motion.div>
        )}

        <div className="flex items-center gap-1.5 text-[11px] text-zinc-400 dark:text-white/30">
          <Clock className="h-3 w-3" strokeWidth={1.5} />
          <span>
            Última ración a las{" "}
            <span className="font-mono text-zinc-500 dark:text-white/50" suppressHydrationWarning>
              {formatTime(lastDispensed)}
            </span>
          </span>
        </div>
      </div>
    </motion.div>
  );
}
