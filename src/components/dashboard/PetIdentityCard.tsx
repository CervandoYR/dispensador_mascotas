"use client";

import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { Scan, Eye } from "lucide-react";

interface PetDetection {
  id: string;
  name: string;
  rfidTag: string;
  detectedAt: Date;
  sensor: "RFID" | "PIR";
}

function generateDetections(): PetDetection[] {
  const pets = [
    { name: "Max", rfidTag: "0x4A3F8B21" },
    { name: "Luna", rfidTag: "0x7C2E9D15" },
    { name: "Rocky", rfidTag: "0x1B6A4F09" },
  ];

  const now = Date.now();
  return [
    { id: "1", ...pets[0], detectedAt: new Date(now - 3 * 60 * 1000), sensor: "RFID" as const },
    { id: "2", ...pets[1], detectedAt: new Date(now - 27 * 60 * 1000), sensor: "PIR" as const },
    { id: "3", ...pets[2], detectedAt: new Date(now - 142 * 60 * 1000), sensor: "RFID" as const },
  ];
}

function timeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return `${seconds}s`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}min`;
  const hours = Math.floor(minutes / 60);
  return `${hours}h ${minutes % 60}min`;
}

export default function PetIdentityCard() {
  const [detections, setDetections] = useState<PetDetection[]>([]);
  const [, setTick] = useState(0);

  useEffect(() => {
    setDetections(generateDetections());
    const interval = setInterval(() => setTick((t) => t + 1), 30000);
    return () => clearInterval(interval);
  }, []);

  const latest = detections[0];

  if (detections.length === 0) {
    return (
      <div className="glass-card overflow-hidden h-full flex flex-col min-h-[268px] animate-pulse">
        <div className="px-4 pt-3 pb-2 flex items-center justify-between border-b border-white/[0.03]">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded bg-white/5" />
            <div className="h-3 w-28 bg-white/5 rounded" />
          </div>
          <div className="flex gap-1">
            <div className="h-4 w-10 bg-white/5 rounded" />
            <div className="h-4 w-8 bg-white/5 rounded" />
          </div>
        </div>
        <div className="px-4 py-3 flex-1 flex flex-col justify-between">
          <div className="bg-zinc-100/50 dark:bg-white/[0.02] rounded-lg p-3 mb-3 border border-zinc-200 dark:border-white/[0.04] flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-white/5" />
            <div className="space-y-1.5 flex-1">
              <div className="h-3 w-16 bg-white/5 rounded" />
              <div className="h-2 w-24 bg-white/5 rounded" />
            </div>
            <div className="h-4 w-12 bg-white/5 rounded" />
          </div>
          <div className="space-y-2">
            <div className="h-2 w-20 bg-white/5 rounded mb-2" />
            <div className="flex justify-between items-center"><div className="h-4 w-28 bg-white/5 rounded" /><div className="h-3 w-12 bg-white/5 rounded" /></div>
            <div className="flex justify-between items-center"><div className="h-4 w-24 bg-white/5 rounded" /><div className="h-3 w-12 bg-white/5 rounded" /></div>
            <div className="flex justify-between items-center"><div className="h-4 w-26 bg-white/5 rounded" /><div className="h-3 w-12 bg-white/5 rounded" /></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className="glass-card overflow-hidden h-full flex flex-col"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="px-4 pt-3 pb-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <motion.div
            className="p-1.5 rounded-lg bg-zinc-200/50 dark:bg-white/[0.06]"
            whileHover={{ scale: 1.1 }}
          >
            <Scan className="h-3.5 w-3.5 text-zinc-500 dark:text-white/50" strokeWidth={1.5} />
          </motion.div>
          <span className="text-xs font-medium text-zinc-600 dark:text-white/60">
            Identidad y Actividad
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] font-mono text-zinc-400/80 dark:text-white/25 bg-zinc-100 dark:bg-white/[0.04] px-2 py-0.5 rounded">RC522</span>
          <span className="text-[10px] font-mono text-zinc-400/80 dark:text-white/25 bg-zinc-100 dark:bg-white/[0.04] px-2 py-0.5 rounded">PIR</span>
        </div>
      </div>

      <div className="px-4 py-3">
        <motion.div
          className="bg-white/[0.03] rounded-lg p-3 mb-3 border border-zinc-200 dark:border-white/[0.04]"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <motion.div
                className="h-8 w-8 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center"
                animate={{
                  boxShadow: [
                    "0 0 0 0 rgba(16, 185, 129, 0)",
                    "0 0 0 6px rgba(16, 185, 129, 0.1)",
                    "0 0 0 0 rgba(16, 185, 129, 0)",
                  ],
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <span className="text-xs font-bold text-emerald-400">{latest.name[0]}</span>
              </motion.div>
              <div>
                <p className="text-sm font-semibold text-zinc-900 dark:text-white/90">{latest.name}</p>
                <p className="text-[10px] font-mono text-zinc-400/80 dark:text-white/25">{latest.rfidTag}</p>
              </div>
            </div>
            <div className="text-right">
              <motion.span
                className="text-[10px] font-mono text-emerald-400/70 bg-emerald-500/10 px-1.5 py-0.5 rounded"
                animate={{ opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                Activo
              </motion.span>
              <p className="text-[10px] text-zinc-400 dark:text-white/30 mt-1" suppressHydrationWarning>
                hace {timeAgo(latest.detectedAt)}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <Eye className="h-3 w-3 text-zinc-400/70 dark:text-white/20" strokeWidth={1.5} />
            <span className="text-[10px] text-zinc-400/80 dark:text-white/25">
              Detectado por sensor {latest.sensor}
            </span>
          </div>
        </motion.div>

        <div className="space-y-1.5">
          <p className="text-[10px] text-zinc-400 dark:text-white/30 uppercase tracking-wider font-medium mb-2">
            Actividad Reciente
          </p>
          {detections.map((detection, i) => (
            <motion.div
              key={detection.id}
              className="flex items-center justify-between py-1.5 px-2 rounded-md hover:bg-zinc-100/50 dark:bg-white/[0.02] transition-colors"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + i * 0.1 }}
            >
              <div className="flex items-center gap-2.5">
                <div
                  className={`h-5 w-5 rounded-full flex items-center justify-center text-[9px] font-bold ${
                    i === 0
                      ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20"
                      : "bg-zinc-100 dark:bg-white/[0.04] text-zinc-400 dark:text-white/30 border border-zinc-200 dark:border-white/[0.06]"
                  }`}
                >
                  {detection.name[0]}
                </div>
                <div>
                  <span className="text-[11px] font-medium text-zinc-600 dark:text-white/60">{detection.name}</span>
                  <span className="text-[9px] font-mono text-zinc-400/70 dark:text-white/20 ml-2">{detection.rfidTag}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`text-[9px] font-mono px-1.5 py-0.5 rounded ${
                    detection.sensor === "RFID"
                      ? "bg-indigo-500/10 text-indigo-400/60"
                      : "bg-amber-500/10 text-amber-400/60"
                  }`}
                >
                  {detection.sensor}
                </span>
                <span className="text-[10px] font-mono text-zinc-400/80 dark:text-white/25" suppressHydrationWarning>
                  {timeAgo(detection.detectedAt)}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
