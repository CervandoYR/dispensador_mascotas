"use client";

import { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Loader2, Zap, PartyPopper } from "lucide-react";

interface SmartDispenseCardProps {
  isDispensing: boolean;
  modoFiesta: boolean;
  onDispense: () => void;
  onToggleModoFiesta: (enabled: boolean) => void;
}

export default function SmartDispenseCard({
  isDispensing,
  modoFiesta,
  onDispense,
  onToggleModoFiesta,
}: SmartDispenseCardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDispensingRef = useRef(isDispensing);
  const startLoopRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    isDispensingRef.current = isDispensing;
    if (isDispensing && startLoopRef.current) {
      startLoopRef.current();
    }
  }, [isDispensing]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let isRunning = false;

    const resize = () => {
      if (!canvas) return;
      canvas.width = canvas.clientWidth || 200;
      canvas.height = canvas.clientHeight || 200;
    };
    resize();

    interface Kibble {
      x: number;
      y: number;
      radius: number;
      color: string;
      vx: number;
      vy: number;
      rotation: number;
      vRotation: number;
    }

    const particles: Kibble[] = [];
    const maxParticles = 40;
    // Tonos tierra premium para croquetas
    const colors = ["#8B4513", "#CD853F", "#A0522D", "#D2691E", "#5C2E0B"];

    const spawnKibble = () => {
      if (!canvas) return;
      particles.push({
        x: canvas.width / 2 + (Math.random() - 0.5) * 40,
        y: canvas.height / 2 - 20 + (Math.random() - 0.5) * 15,
        radius: Math.random() * 3 + 2.5,
        color: colors[Math.floor(Math.random() * colors.length)],
        vx: (Math.random() - 0.5) * 4,
        vy: Math.random() * -3 - 2, // Empuje inicial ascendente/diagonal
        rotation: Math.random() * Math.PI * 2,
        vRotation: (Math.random() - 0.5) * 0.15,
      });
    };

    let frames = 0;
    const draw = () => {
      if (!canvas || !ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const isDispensingActive = isDispensingRef.current;

      // Spawnear croquetas
      if (isDispensingActive && frames % 3 === 0 && particles.length < maxParticles) {
        spawnKibble();
      }
      frames++;

      // Dibujar y actualizar partículas
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.vy += 0.22; // Gravedad
        p.vx *= 0.99; // Resistencia del aire
        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.vRotation;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);

        // Capa externa
        ctx.beginPath();
        ctx.ellipse(0, 0, p.radius * 1.3, p.radius * 0.8, 0, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();

        // Resalte 3D interno
        ctx.beginPath();
        ctx.ellipse(-p.radius * 0.3, -p.radius * 0.2, p.radius * 0.6, p.radius * 0.4, 0, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255, 255, 255, 0.12)";
        ctx.fill();

        ctx.restore();

        // Remover si sale de pantalla
        if (p.y > canvas.height + 15 || p.x < -15 || p.x > canvas.width + 15) {
          particles.splice(i, 1);
        }
      }

      // Continuar loop si sigue dispensando o quedan partículas en pantalla
      if (isDispensingActive || particles.length > 0) {
        animationFrameId = requestAnimationFrame(draw);
      } else {
        isRunning = false;
      }
    };

    const startLoop = () => {
      if (!isRunning) {
        isRunning = true;
        draw();
      }
    };

    startLoopRef.current = startLoop;

    if (isDispensingRef.current) {
      startLoop();
    }

    window.addEventListener("resize", resize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <motion.div
      className="glass-card overflow-hidden h-full flex flex-col relative"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Physics Particle Overlay for Kibbles */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none z-0"
      />

      <div className="px-4 pt-3 pb-2 flex items-center justify-between relative z-10">
        <div className="flex items-center gap-2">
          <motion.div
            className="p-1.5 rounded-lg bg-zinc-200/50 dark:bg-white/[0.06]"
            whileHover={{ scale: 1.1 }}
          >
            <Zap className="h-3.5 w-3.5 text-zinc-500 dark:text-white/50" strokeWidth={1.5} />
          </motion.div>
          <span className="text-xs font-medium text-zinc-600 dark:text-white/60">
            Smart Dispense
          </span>
        </div>
        <motion.span
          className={`text-[10px] font-mono px-2 py-0.5 rounded ${
            isDispensing
              ? "text-amber-400/80 bg-amber-500/10 border border-amber-500/20"
              : "text-emerald-400/60 bg-emerald-500/10 border border-emerald-500/20"
          }`}
          animate={isDispensing ? { opacity: [1, 0.5, 1] } : {}}
          transition={{ duration: 1, repeat: Infinity }}
        >
          {isDispensing ? "Dispensando" : "Listo"}
        </motion.span>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-4 pb-4 gap-4 relative z-10">
        <div className="relative flex items-center justify-center w-28 h-28">
          
          {/* Concentric Energy Pulse Rings when dispensing */}
          {isDispensing && (
            <>
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute rounded-full border border-amber-500/30 bg-amber-500/[0.02] pointer-events-none"
                  style={{ width: 80, height: 80 }}
                  initial={{ scale: 1, opacity: 0.6 }}
                  animate={{ scale: 2.2, opacity: 0 }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: i * 0.6,
                    ease: "easeOut"
                  }}
                />
              ))}
            </>
          )}

          {/* Orbit spinner */}
          {isDispensing && (
            <div className="absolute inset-0">
              <svg width="100%" height="100%" viewBox="0 0 100 100" className="absolute inset-0">
                <circle cx="50" cy="50" r="44" fill="none" stroke="rgba(245, 158, 11, 0.1)" strokeWidth="1.5" />
                <circle
                  cx="50"
                  cy="50"
                  r="44"
                  fill="none"
                  stroke="#f59e0b"
                  strokeWidth="2.5"
                  strokeDasharray="30 250"
                  strokeLinecap="round"
                  style={{ animation: "orbital-spin 1.2s linear infinite" }}
                />
              </svg>
            </div>
          )}

          <motion.button
            id="btn-dispense"
            onClick={onDispense}
            disabled={isDispensing}
            className={`relative z-10 w-20 h-20 rounded-full flex items-center justify-center font-semibold transition-all duration-300 ${
              isDispensing
                ? "bg-amber-500/10 border border-amber-500/20 cursor-not-allowed text-amber-400"
                : "bg-emerald-500/10 border border-emerald-500/20 hover:bg-emerald-500/20 cursor-pointer text-emerald-400 hover:border-emerald-500/30"
            }`}
            whileHover={isDispensing ? {} : { scale: 1.08 }}
            whileTap={isDispensing ? {} : { scale: 0.92 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            {isDispensing ? (
              <Loader2 className="h-7 w-7 animate-spin" strokeWidth={1.5} />
            ) : (
              <motion.div
                animate={{ rotate: [0, -8, 8, 0] }}
                transition={{ duration: 3, repeat: Infinity, repeatDelay: 2.5 }}
              >
                <Zap className="h-7 w-7" strokeWidth={1.5} />
              </motion.div>
            )}
          </motion.button>
        </div>

        <div className="text-center">
          <p className="text-xs font-semibold text-zinc-800 dark:text-white/80">
            {isDispensing ? "Sirviendo Ración..." : "Dispensación Manual"}
          </p>
          <p className="text-[10px] text-zinc-400 dark:text-white/35 mt-0.5 max-w-[170px]">
            {isDispensing
              ? "El servo del hardware está activo"
              : "Haz clic para verter comida al instante"}
          </p>
        </div>

        <motion.button
          onClick={() => onToggleModoFiesta(!modoFiesta)}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px] font-semibold tracking-wider uppercase transition-all duration-300 ${
            modoFiesta
              ? "bg-purple-500/15 border border-purple-500/25 text-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.06)]"
              : "bg-zinc-100 dark:bg-white/[0.04] border border-zinc-200 dark:border-white/[0.06] text-zinc-400 dark:text-white/40 hover:text-zinc-700 dark:text-white/70 hover:bg-zinc-200/50 dark:bg-white/[0.06]"
          }`}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
        >
          <PartyPopper className="h-3 w-3" strokeWidth={1.5} />
          {modoFiesta ? "Fiesta ON" : "Modo Fiesta"}
        </motion.button>
      </div>
    </motion.div>
  );
}
