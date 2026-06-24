"use client";

import { useState, useEffect, useRef, MouseEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, Circle, Power, ScanEye, RefreshCw } from "lucide-react";
import Image from "next/image";

function StaticNoise() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;

    const resize = () => {
      canvas.width = canvas.clientWidth || 320;
      canvas.height = canvas.clientHeight || 240;
    };
    resize();

    const draw = () => {
      const width = canvas.width;
      const height = canvas.height;
      if (width === 0 || height === 0) return;

      const imgData = ctx.createImageData(width, height);
      const data = imgData.data;

      // Draw random black and white pixels for static noise
      for (let i = 0; i < data.length; i += 4) {
        const val = Math.floor(Math.random() * 255);
        data[i] = val;     // R
        data[i + 1] = val; // G
        data[i + 2] = val; // B
        data[i + 3] = 120; // A (semi-transparent for overlay blending)
      }

      ctx.putImageData(imgData, 0, 0);

      // Random glitch horizontal bands
      if (Math.random() > 0.9) {
        ctx.fillStyle = "rgba(16, 185, 129, 0.25)";
        ctx.fillRect(0, Math.random() * height, width, Math.random() * 10 + 2);
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full object-cover opacity-35 z-20 mix-blend-screen pointer-events-none"
    />
  );
}

export default function CamStreamCard() {
  const [isLive, setIsLive] = useState(false);
  const [isGlitching, setIsGlitching] = useState(false);
  const [timestamp, setTimestamp] = useState("");
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      setTimestamp(
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

  const handleToggleStream = () => {
    setIsGlitching(true);
    setTimeout(() => {
      setIsGlitching(false);
      setIsLive((prev) => !prev);
    }, 450000 / 1000); // 450ms glitch effect
  };

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current || !isLive) return;
    const rect = containerRef.current.getBoundingClientRect();
    // Normalize coordinates from -1 to 1
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const y = ((e.clientY - rect.top) / rect.height) * 2 - 1;
    setMousePos({ x, y });
  };

  const handleMouseLeave = () => {
    setMousePos({ x: 0, y: 0 });
  };

  return (
    <motion.div
      className="glass-card overflow-hidden h-full flex flex-col justify-between"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="px-4 pt-3 pb-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <motion.div
            className="p-1.5 rounded-lg bg-zinc-200/50 dark:bg-white/[0.06]"
            whileHover={{ scale: 1.1 }}
          >
            <Camera className="h-3.5 w-3.5 text-zinc-500 dark:text-white/50" strokeWidth={1.5} />
          </motion.div>
          <span className="text-xs font-medium text-zinc-600 dark:text-white/60">Monitoreo ESP32-CAM</span>
        </div>
        <span className="text-[10px] font-mono text-zinc-400/80 dark:text-white/25 bg-zinc-100 dark:bg-white/[0.04] px-2 py-0.5 rounded flex items-center gap-1.5">
          <span className={`h-1.5 w-1.5 rounded-full ${isLive ? "bg-emerald-400 animate-pulse" : "bg-white/20"}`} />
          192.168.1.42
        </span>
      </div>

      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={handleToggleStream}
        className="relative aspect-[4/3] mx-3 mb-2 rounded-lg overflow-hidden bg-[#0c0c0c] border border-zinc-200 dark:border-white/[0.04] group cursor-pointer"
      >
        {/* Scanline pattern overlay */}
        <div className="absolute inset-0 scanlines z-25 pointer-events-none opacity-40" />

        {/* TV Static Noise Overlay (active when glitching or when stream is offline) */}
        {(isGlitching || !isLive) && <StaticNoise />}

        <AnimatePresence mode="wait">
          {isLive && !isGlitching ? (
            <motion.div
              key="live-feed"
              className="absolute inset-0 w-full h-full"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {/* Panning surveillance camera view */}
              <motion.div
                className="relative w-full h-full filter brightness-[0.85] contrast-[1.1] saturate-[0.8] sepia-[0.1] hue-rotate-[10deg]"
                animate={{
                  scale: 1.1,
                  x: mousePos.x * -8,
                  y: mousePos.y * -8,
                }}
                transition={{ type: "spring", stiffness: 60, damping: 20 }}
              >
                <Image
                  src="/pet_feeder_cam.png"
                  alt="Pet Feeder Live Stream"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 400px"
                  priority
                />
              </motion.div>

              {/* Dynamic Target Corner Highlights */}
              <div className="absolute inset-4 border border-emerald-500/10 pointer-events-none z-30">
                {/* Corners */}
                <div className="absolute -top-1 -left-1 w-3 h-3 border-t-2 border-l-2 border-emerald-400/60" />
                <div className="absolute -top-1 -right-1 w-3 h-3 border-t-2 border-r-2 border-emerald-400/60" />
                <div className="absolute -bottom-1 -left-1 w-3 h-3 border-b-2 border-l-2 border-emerald-400/60" />
                <div className="absolute -bottom-1 -right-1 w-3 h-3 border-b-2 border-r-2 border-emerald-400/60" />
              </div>

              {/* Center Targeting Reticle (follows mouse) */}
              <motion.div
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-30 flex items-center justify-center"
                animate={{
                  x: mousePos.x * 20,
                  y: mousePos.y * 20,
                }}
                transition={{ type: "spring", stiffness: 100, damping: 25 }}
              >
                <div className="w-10 h-10 border border-emerald-400/20 rounded-full flex items-center justify-center">
                  <div className="w-1.5 h-1.5 bg-emerald-400/60 rounded-full" />
                </div>
                <span className="absolute top-6 text-[8px] font-mono text-emerald-400/40 tracking-widest uppercase">
                  AUTO_FOCUS
                </span>
              </motion.div>

              {/* HUD labels */}
              <div className="absolute top-3 left-3 z-30 flex items-center gap-1.5">
                <div className="flex items-center gap-1.5 bg-black/60 border border-emerald-500/20 backdrop-blur-sm px-2 py-0.5 rounded">
                  <motion.div
                    className="h-1.5 w-1.5 rounded-full bg-emerald-400"
                    animate={{ opacity: [1, 0.4, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  />
                  <span className="text-[8px] font-semibold text-emerald-400 tracking-wider uppercase font-mono">
                    LIVE
                  </span>
                </div>
              </div>

              <div className="absolute top-3 right-3 z-30">
                <span className="text-[8px] font-mono text-emerald-400/70 bg-black/60 border border-emerald-500/20 backdrop-blur-sm px-2 py-0.5 rounded">
                  ISO_800 · AUTO
                </span>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="offline-feed"
              className="absolute inset-0 flex items-center justify-center z-25"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div className="text-center px-4 relative z-30">
                <motion.div
                  className="w-12 h-12 mx-auto mb-2.5 rounded-full bg-zinc-100/50 dark:bg-white/[0.02] border border-white/5 flex items-center justify-center text-zinc-400/70 dark:text-white/20 group-hover:text-emerald-400/40 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <ScanEye className="h-5 w-5" strokeWidth={1.5} />
                </motion.div>
                <p className="text-[10px] text-zinc-400 dark:text-white/40 font-mono tracking-wider uppercase">
                  Feed en Espera
                </p>
                <p className="text-[8px] text-zinc-400/70 dark:text-white/20 mt-1 max-w-[160px] mx-auto">
                  Haz clic en la pantalla para activar el monitoreo en vivo
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Live counter overlay */}
        <div className="absolute bottom-3 right-3 z-30" suppressHydrationWarning>
          <span className="text-[9px] font-mono text-zinc-400 dark:text-white/40 bg-black/50 backdrop-blur-sm px-2 py-0.5 rounded">
            {timestamp || "00:00:00"}
          </span>
        </div>

        <div className="absolute bottom-3 left-3 z-30 flex gap-1.5">
          <span className="text-[8px] font-mono text-zinc-400 dark:text-white/30 bg-black/50 backdrop-blur-sm px-1.5 py-0.5 rounded">
            {isLive && !isGlitching ? "640x480 · 24FPS" : "STANDBY"}
          </span>
          <span className="text-[8px] font-mono text-zinc-400 dark:text-white/30 bg-black/50 backdrop-blur-sm px-1.5 py-0.5 rounded">
            ESP32-S3-CAM
          </span>
        </div>

        {/* Shimmer/Glitch overlay effect on toggle */}
        {isGlitching && (
          <div className="absolute inset-0 bg-emerald-500/10 z-40 pointer-events-none flex items-center justify-center">
            <RefreshCw className="h-6 w-6 text-emerald-400 animate-spin" />
          </div>
        )}
      </div>

      <div className="px-3 pb-3">
        <motion.button
          onClick={handleToggleStream}
          disabled={isGlitching}
          className={`w-full py-2 px-3 rounded-lg text-[10px] font-semibold tracking-wider uppercase flex items-center justify-center gap-1.5 border transition-all duration-300 cursor-pointer ${
            isLive
              ? "bg-red-500/10 border-red-500/20 text-red-400 hover:bg-red-500/15"
              : "bg-emerald-500/10 border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/15 hover:shadow-[0_0_15px_rgba(16,185,129,0.08)]"
          }`}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Power className="h-3 w-3" strokeWidth={2} />
          {isLive ? "Desactivar Stream" : "Activar Feed en Vivo"}
        </motion.button>
      </div>
    </motion.div>
  );
}
