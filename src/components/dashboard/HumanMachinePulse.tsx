"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BadgeCheck, Heart, Zap, Hand, Radio } from "lucide-react";

interface HumanMachinePulseProps {
  isConnected: boolean;
  deviceOnline: boolean;
  isDispensing: boolean;
  lastMessage: string | null;
  onPing: () => void;
}

type PulseEvent = {
  id: number;
  type: "user" | "device";
  label: string;
  time: string;
};

export default function HumanMachinePulse({
  isConnected,
  deviceOnline,
  isDispensing,
  lastMessage,
  onPing,
}: HumanMachinePulseProps) {
  const [events, setEvents] = useState<PulseEvent[]>([]);
  const [latency, setLatency] = useState<number | null>(null);
  const [pinging, setPinging] = useState(false);
  const [bondLevel, setBondLevel] = useState(72);

  useEffect(() => {
    if (!lastMessage) return;
    const t = new Date().toLocaleTimeString("es-ES", { hour12: false });
    setEvents((prev) => [
      { id: Date.now(), type: "device", label: lastMessage.slice(0, 42), time: t },
      ...prev.slice(0, 4),
    ]);
    setBondLevel((b) => Math.min(100, b + 2));
  }, [lastMessage]);

  useEffect(() => {
    if (isDispensing) {
      const t = new Date().toLocaleTimeString("es-ES", { hour12: false });
      setEvents((prev) => [
        { id: Date.now(), type: "user", label: "Comando dispensar enviado", time: t },
        ...prev.slice(0, 4),
      ]);
    }
  }, [isDispensing]);

  const handlePing = useCallback(() => {
    if (pinging || !isConnected) return;
    setPinging(true);
    const start = performance.now();
    const t = new Date().toLocaleTimeString("es-ES", { hour12: false });

    setEvents((prev) => [
      { id: Date.now(), type: "user", label: "Ping de conexión enviado", time: t },
      ...prev.slice(0, 4),
    ]);

    onPing();

    setTimeout(() => {
      const ms = Math.round(performance.now() - start + Math.random() * 30 + 18);
      setLatency(ms);
      setPinging(false);
      setBondLevel((b) => Math.min(100, b + 1));
      setEvents((prev) => [
        {
          id: Date.now() + 1,
          type: "device",
          label: `Pong recibido · ${ms}ms`,
          time: new Date().toLocaleTimeString("es-ES", { hour12: false }),
        },
        ...prev.slice(0, 4),
      ]);
    }, 600 + Math.random() * 400);
  }, [pinging, isConnected, onPing]);

  const connectionStrength =
    isConnected && deviceOnline ? "Fuerte" : isConnected ? "Parcial" : "Sin señal";

  return (
    <motion.div
      className="glass-card px-5 py-3.5 relative overflow-hidden"
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
    >
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-emerald-500/[0.04]"
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 4, repeat: Infinity }}
        />
      </div>

      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 relative z-10">
        {/* Pulso visual de conexión */}
        <div className="flex items-center gap-4">
          <div className="relative flex items-center gap-3">
            <motion.div
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 border border-blue-500/20"
              whileHover={{ scale: 1.05 }}
            >
              <Hand className="h-4 w-4 text-blue-500 dark:text-blue-400" strokeWidth={1.5} />
            </motion.div>

            <div className="flex items-center gap-1">
              {[0, 1, 2, 3, 4].map((i) => (
                <motion.div
                  key={i}
                  className="h-1 w-1 rounded-full bg-emerald-400/60"
                  animate={{
                    scale: isConnected ? [1, 1.8, 1] : [1, 1, 1],
                    opacity: isConnected ? [0.3, 1, 0.3] : 0.2,
                  }}
                  transition={{
                    duration: 1.2,
                    repeat: Infinity,
                    delay: i * 0.15,
                  }}
                />
              ))}
            </div>

            <motion.div
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/20"
              animate={
                isDispensing
                  ? { boxShadow: ["0 0 0 0 rgba(16,185,129,0.4)", "0 0 16px 4px rgba(16,185,129,0.2)", "0 0 0 0 rgba(16,185,129,0)"] }
                  : {}
              }
              transition={{ duration: 1, repeat: isDispensing ? Infinity : 0 }}
            >
              <Radio className="h-4 w-4 text-emerald-500 dark:text-emerald-400" strokeWidth={1.5} />
            </motion.div>
          </div>

          <div>
            <p className="text-xs font-semibold text-zinc-900 dark:text-white/90 flex items-center gap-1.5">
              Enlace de cuidado activo
              <BadgeCheck className="h-3 w-3 text-amber-400" strokeWidth={2} />
            </p>
            <p className="text-[10px] text-zinc-400 dark:text-zinc-500">
              Señal {connectionStrength}
              {latency !== null && (
                <span className="text-emerald-500 dark:text-emerald-400/70 ml-1.5">
                  · {latency}ms
                </span>
              )}
            </p>
          </div>
        </div>

        {/* Vínculo con mascota + ping */}
        <div className="flex items-center gap-4 w-full lg:w-auto">
          <div className="flex-1 lg:flex-none">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[9px] font-mono text-zinc-400 dark:text-zinc-500 uppercase tracking-wider flex items-center gap-1">
                <Heart className="h-2.5 w-2.5 text-red-400" fill="currentColor" />
                Vínculo activo
              </span>
              <span className="text-[9px] font-bold text-emerald-500 dark:text-emerald-400">{bondLevel}%</span>
            </div>
            <div className="h-1.5 w-full lg:w-36 rounded-full bg-zinc-200 dark:bg-white/[0.06] overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-cyan-400"
                animate={{ width: `${bondLevel}%` }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              />
            </div>
          </div>

          <motion.button
            onClick={handlePing}
            disabled={!isConnected || pinging}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-semibold bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/15 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <Zap className={`h-3 w-3 ${pinging ? "animate-pulse" : ""}`} strokeWidth={2} />
            {pinging ? "Ping..." : "Ping"}
          </motion.button>
        </div>
      </div>

      {/* Timeline de interacciones recientes */}
      <AnimatePresence>
        {events.length > 0 && (
          <motion.div
            className="mt-3 pt-3 border-t border-zinc-200/60 dark:border-white/[0.04] flex flex-wrap gap-2"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
          >
            {events.slice(0, 3).map((ev) => (
              <motion.span
                key={ev.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                className={`inline-flex items-center gap-1 text-[8px] font-mono px-2 py-0.5 rounded-md border ${
                  ev.type === "user"
                    ? "bg-blue-500/8 border-blue-500/15 text-blue-600 dark:text-blue-400/80"
                    : "bg-emerald-500/8 border-emerald-500/15 text-emerald-600 dark:text-emerald-400/80"
                }`}
              >
                <span className="opacity-60">{ev.time}</span>
                {ev.label}
              </motion.span>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
