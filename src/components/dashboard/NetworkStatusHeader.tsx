"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Wifi, WifiOff, Radio, Clock, Server } from "lucide-react";

interface NetworkStatusHeaderProps {
  isConnected: boolean;
  deviceOnline: boolean;
}

export default function NetworkStatusHeader({
  isConnected,
  deviceOnline,
}: NetworkStatusHeaderProps) {
  const [currentTime, setCurrentTime] = useState("");
  const [uptime, setUptime] = useState(0);

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString("es-ES", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      );
    };
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!isConnected) return;
    const interval = setInterval(() => {
      setUptime((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isConnected]);

  const formatUptime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  return (
    <motion.div
      className="glass-card px-5 py-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2.5">
          {isConnected ? (
            <motion.div
              className="relative flex items-center justify-center"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div
                className="absolute h-7 w-7 rounded-full bg-emerald-500/20"
                animate={{
                  scale: [1, 1.6, 1],
                  opacity: [0.4, 0, 0.4],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
              <div
                className="h-2.5 w-2.5 rounded-full bg-emerald-400"
                style={{ animation: "neon-pulse 2s ease-in-out infinite" }}
              />
            </motion.div>
          ) : (
            <motion.div
              className="h-2.5 w-2.5 rounded-full bg-red-500/60"
              animate={{ opacity: [1, 0.4, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          )}
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-semibold text-zinc-900 dark:text-white/90">
                {isConnected ? "MQTT WebSocket" : "Desconectado"}
              </span>
              {isConnected && (
                <span className="text-[10px] font-mono text-emerald-400/70 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                  WSS
                </span>
              )}
            </div>
            <span className="text-[10px] text-zinc-400 dark:text-white/30 font-mono">
              broker.hivemq.com:8000
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4 text-[11px] font-mono text-zinc-400 dark:text-white/30">
        <div className="flex items-center gap-1.5">
          <Radio className="h-3 w-3" strokeWidth={1.5} />
          <span className={deviceOnline ? "text-emerald-400/70" : "text-red-400/70"}>
            {deviceOnline ? "ESP32 En Línea" : "ESP32 Desconectado"}
          </span>
        </div>
        <div className="hidden sm:flex items-center gap-1.5">
          <Server className="h-3 w-3" strokeWidth={1.5} />
          <span>Activo {formatUptime(uptime)}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Clock className="h-3 w-3" strokeWidth={1.5} />
          <span suppressHydrationWarning>{currentTime}</span>
        </div>
      </div>
    </motion.div>
  );
}
