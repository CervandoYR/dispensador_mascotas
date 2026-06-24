"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldAlert, Heart, Star } from "lucide-react";

interface MascotBuddyProps {
  deviceOnline: boolean;
  isDispensing: boolean;
  hasJam: boolean;
}

export default function MascotBuddy({
  deviceOnline,
  isDispensing,
  hasJam,
}: MascotBuddyProps) {
  const [blink, setBlink] = useState(false);

  // Random blink interval for natural mascot behavior
  useEffect(() => {
    if (!deviceOnline || isDispensing) return;
    const interval = setInterval(() => {
      setBlink(true);
      setTimeout(() => setBlink(false), 150);
    }, Math.random() * 3000 + 2000);
    return () => clearInterval(interval);
  }, [deviceOnline, isDispensing]);

  // Determine current mood/state
  let state: "offline" | "jam" | "dispensing" | "idle" = "offline";
  if (!deviceOnline) {
    state = "offline";
  } else if (hasJam) {
    state = "jam";
  } else if (isDispensing) {
    state = "dispensing";
  } else {
    state = "idle";
  }

  return (
    <motion.div
      className="glass-card p-4 h-full flex flex-col items-center justify-center relative overflow-hidden min-h-[170px]"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Decorative dynamic glows depending on status */}
      <div className="absolute inset-0 pointer-events-none">
        {state === "offline" && (
          <div className="absolute inset-0 bg-blue-500/[0.01] dark:bg-blue-500/[0.005] transition-colors" />
        )}
        {state === "idle" && (
          <div className="absolute inset-0 bg-emerald-500/[0.02] dark:bg-emerald-500/[0.01] transition-colors" />
        )}
        {state === "dispensing" && (
          <motion.div
            className="absolute inset-0 bg-amber-500/[0.06] dark:bg-amber-500/[0.03]"
            animate={{ opacity: [0.4, 0.8, 0.4] }}
            transition={{ duration: 1, repeat: Infinity }}
          />
        )}
        {state === "jam" && (
          <motion.div
            className="absolute inset-0 bg-red-500/[0.06] dark:bg-red-500/[0.03]"
            animate={{ opacity: [0.5, 0.9, 0.5] }}
            transition={{ duration: 0.8, repeat: Infinity }}
          />
        )}
      </div>

      {/* Spawning particle stars/hearts during dispensing */}
      <AnimatePresence>
        {state === "dispensing" && (
          <>
            {[...Array(4)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute z-20 text-amber-400 pointer-events-none"
                initial={{
                  x: (Math.random() - 0.5) * 80,
                  y: 20,
                  scale: 0,
                  opacity: 1,
                  rotate: 0,
                }}
                animate={{
                  y: -50,
                  scale: [1, 1.2, 0.8],
                  opacity: 0,
                  rotate: Math.random() * 360,
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.3,
                  ease: "easeOut",
                }}
              >
                {i % 2 === 0 ? (
                  <Heart className="h-3 w-3 fill-amber-400" />
                ) : (
                  <Star className="h-3.5 w-3.5 fill-amber-400" />
                )}
              </motion.div>
            ))}
          </>
        )}
      </AnimatePresence>

      {/* Floating ZZZ bubbles for offline mascot */}
      <AnimatePresence>
        {state === "offline" && (
          <>
            {[...Array(3)].map((_, i) => (
              <motion.span
                key={i}
                className="absolute text-[10px] font-bold font-mono text-zinc-400/50 dark:text-zinc-600/50 pointer-events-none"
                initial={{ x: 22, y: -5, opacity: 0, scale: 0.7 }}
                animate={{
                  x: [22, 35, 28],
                  y: [-5, -35, -55],
                  opacity: [0, 1, 0],
                  scale: [0.7, 1.1, 0.8],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  delay: i * 1,
                  ease: "easeInOut",
                }}
              >
                z
              </motion.span>
            ))}
          </>
        )}
      </AnimatePresence>

      {/* ──── Animated Mascot Canvas/SVG ──── */}
      <motion.div
        className="relative w-20 h-20 flex items-center justify-center"
        animate={
          state === "dispensing"
            ? { y: [0, -12, 0] }
            : state === "jam"
            ? { x: [0, -2, 2, -2, 2, 0] }
            : {}
        }
        transition={
          state === "dispensing"
            ? { duration: 0.5, repeat: Infinity, ease: "easeInOut" }
            : state === "jam"
            ? { duration: 0.4, repeat: Infinity }
            : {}
        }
      >
        <svg viewBox="0 0 100 100" className="w-full h-full">
          {/* Sombra base */}
          <ellipse cx="50" cy="85" rx="28" ry="4" className="fill-zinc-300/40 dark:fill-black/30" />

          {/* Orejas de Perrito */}
          <motion.path
            d="M26,30 Q16,36 20,54 Q24,62 30,50 Z"
            className="fill-zinc-600 dark:fill-zinc-700 stroke-zinc-700/20 dark:stroke-zinc-800/50"
            strokeWidth="0.5"
            animate={
              state === "dispensing"
                ? { rotate: [-10, 15, -10] }
                : state === "idle"
                ? { rotate: [0, 2, -2, 0] }
                : {}
            }
            transition={{ duration: 1.5, repeat: Infinity }}
            style={{ transformOrigin: "26px 30px" }}
          />
          <motion.path
            d="M74,30 Q84,36 80,54 Q76,62 70,50 Z"
            className="fill-zinc-600 dark:fill-zinc-700 stroke-zinc-700/20 dark:stroke-zinc-800/50"
            strokeWidth="0.5"
            animate={
              state === "dispensing"
                ? { rotate: [10, -15, 10] }
                : state === "idle"
                ? { rotate: [0, -2, 2, 0] }
                : {}
            }
            transition={{ duration: 1.5, repeat: Infinity }}
            style={{ transformOrigin: "74px 30px" }}
          />

          {/* Cuerpo */}
          <motion.ellipse
            cx="50"
            cy="70"
            rx="24"
            ry="18"
            className="fill-zinc-400 dark:fill-zinc-500 stroke-zinc-500/20 dark:stroke-zinc-600/50"
            strokeWidth="0.5"
            animate={
              state === "offline"
                ? { scaleY: [1, 1.03, 1] }
                : {}
            }
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            style={{ transformOrigin: "50px 85px" }}
          />

          {/* Pecho blanco */}
          <ellipse cx="50" cy="74" rx="14" ry="11" className="fill-zinc-100 dark:fill-zinc-300" />

          {/* Cabeza */}
          <motion.circle
            cx="50"
            cy="42"
            r="20"
            className="fill-zinc-400 dark:fill-zinc-500 stroke-zinc-500/20 dark:stroke-zinc-600/50"
            strokeWidth="0.5"
            animate={
              state === "offline"
                ? { y: [0, 1.2, 0] }
                : state === "idle"
                ? { y: [0, -0.6, 0] }
                : {}
            }
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* Ojos */}
          {state === "offline" ? (
            // Durmiendo
            <>
              <path d="M38,42 Q42,46 46,42" fill="none" className="stroke-zinc-600 dark:stroke-zinc-700" strokeWidth="2" strokeLinecap="round" />
              <path d="M54,42 Q58,46 62,42" fill="none" className="stroke-zinc-600 dark:stroke-zinc-700" strokeWidth="2" strokeLinecap="round" />
            </>
          ) : state === "jam" ? (
            // Preocupado / Asustado
            <>
              <ellipse cx="40" cy="41" rx="3.5" ry="3.5" className="fill-zinc-800 dark:fill-zinc-900" />
              <ellipse cx="60" cy="41" rx="3.5" ry="3.5" className="fill-zinc-800 dark:fill-zinc-900" />
              <path d="M36,34 Q40,36 44,34" fill="none" className="stroke-zinc-800 dark:stroke-zinc-950" strokeWidth="1.5" strokeLinecap="round" />
              <path d="M56,34 Q60,36 64,34" fill="none" className="stroke-zinc-800 dark:stroke-zinc-950" strokeWidth="1.5" strokeLinecap="round" />
            </>
          ) : blink ? (
            // Parpadeo
            <>
              <line x1="36" y1="41" x2="44" y2="41" className="stroke-zinc-800 dark:stroke-zinc-950" strokeWidth="2.5" strokeLinecap="round" />
              <line x1="56" y1="41" x2="64" y2="41" className="stroke-zinc-800 dark:stroke-zinc-950" strokeWidth="2.5" strokeLinecap="round" />
            </>
          ) : (
            // Normal o Dispensando
            <>
              <circle cx="40" cy="41" r="3.5" className="fill-zinc-800 dark:fill-zinc-900" />
              <circle cx="60" cy="41" r="3.5" className="fill-zinc-800 dark:fill-zinc-900" />
              {/* Brillo en los ojos */}
              <circle cx="39" cy="39.5" r="1" className="fill-white" />
              <circle cx="59" cy="39.5" r="1" className="fill-white" />
            </>
          )}

          {/* Hocico */}
          <ellipse cx="50" cy="49" rx="7" ry="5" className="fill-zinc-100 dark:fill-zinc-200" />
          
          {/* Nariz */}
          <polygon points="47,46 53,46 50,49" className="fill-zinc-800 dark:fill-zinc-900" />

          {/* Boca */}
          {state === "jam" ? (
            // Línea de preocupación plana
            <line x1="47" y1="52" x2="53" y2="52" className="stroke-zinc-800 dark:stroke-zinc-900" strokeWidth="1.5" strokeLinecap="round" />
          ) : state === "dispensing" ? (
            // Boca abierta feliz
            <path d="M46,50 Q50,56 54,50 Z" className="fill-red-400 dark:fill-red-500" />
          ) : (
            // Sonrisa tímida
            <path d="M46,50 Q50,53 54,50" fill="none" className="stroke-zinc-800 dark:stroke-zinc-900" strokeWidth="1.5" strokeLinecap="round" />
          )}

          {/* Cola de perrito */}
          <motion.path
            d="M72,72 Q86,64 80,50 Q78,56 70,68"
            className="fill-zinc-500 dark:fill-zinc-650"
            animate={
              state === "dispensing"
                ? { rotate: [-15, 30, -15] }
                : state === "idle"
                ? { rotate: [-5, 10, -5] }
                : {}
            }
            transition={{
              duration: state === "dispensing" ? 0.25 : 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            style={{ transformOrigin: "72px 72px" }}
          />

          {/* Patas delanteras */}
          <ellipse cx="42" cy="83" rx="4" ry="3" className="fill-zinc-300 dark:fill-zinc-400" />
          <ellipse cx="58" cy="83" rx="4" ry="3" className="fill-zinc-300 dark:fill-zinc-400" />
        </svg>

        {/* Alerta de atasco flotante en el buddy */}
        {state === "jam" && (
          <motion.div
            className="absolute -top-1 right-1 bg-red-500 text-white rounded-full p-0.5 border border-white dark:border-black shadow-lg"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 0.6, repeat: Infinity }}
          >
            <ShieldAlert className="h-3.5 w-3.5" />
          </motion.div>
        )}
      </motion.div>

      {/* ──── Texto de Estado ──── */}
      <div className="text-center mt-2.5 z-10">
        <p className="text-[11px] font-bold text-zinc-700 dark:text-white/80">
          {state === "offline" && "Feeder Buddy duerme"}
          {state === "idle" && "Feeder Buddy está feliz"}
          {state === "dispensing" && "¡YUM! ¡Sirviendo comida!"}
          {state === "jam" && "¡Oh no! Algo está atascado"}
        </p>
        <p className="text-[9px] text-zinc-400 dark:text-zinc-500 mt-0.5 max-w-[170px]">
          {state === "offline" && "Conecta el hardware para despertarlo"}
          {state === "idle" && "El sistema está funcionando perfectamente"}
          {state === "dispensing" && "¡Mascota contenta al instante!"}
          {state === "jam" && "Revisa la boquilla del dispensador"}
        </p>
      </div>
    </motion.div>
  );
}
