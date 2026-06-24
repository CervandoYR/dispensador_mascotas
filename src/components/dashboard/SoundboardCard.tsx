"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Volume2, Play, Mic, Square, Check, Radio, VolumeX } from "lucide-react";
import { toast } from "sonner";

interface SoundboardCardProps {
  onPublishSound: (soundName: string) => void;
}

export default function SoundboardCard({ onPublishSound }: SoundboardCardProps) {
  const [selectedSound, setSelectedSound] = useState("chime");
  const [isRecording, setIsRecording] = useState(false);
  const [recordedClips, setRecordedClips] = useState<string[]>([]);
  const [isTesting, setIsTesting] = useState<string | null>(null);

  // Web Audio synthesizer for real beep/bell sounds when clicked
  const playWebSound = (type: string) => {
    try {
      const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtxClass) return;
      const audioCtx = new AudioCtxClass();
      
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      
      if (type === "bell") {
        osc.type = "sine";
        osc.frequency.setValueAtTime(880, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(150, audioCtx.currentTime + 1.2);
        gain.gain.setValueAtTime(0.25, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 1.2);
        osc.start();
        osc.stop(audioCtx.currentTime + 1.2);
      } else if (type === "chime") {
        osc.type = "sine";
        osc.frequency.setValueAtTime(523.25, audioCtx.currentTime); // C5
        osc.frequency.setValueAtTime(659.25, audioCtx.currentTime + 0.12); // E5
        gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.6);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.6);
      } else if (type === "whistle") {
        osc.type = "triangle";
        osc.frequency.setValueAtTime(1400, audioCtx.currentTime);
        osc.frequency.linearRampToValueAtTime(1500, audioCtx.currentTime + 0.08);
        osc.frequency.linearRampToValueAtTime(1300, audioCtx.currentTime + 0.16);
        gain.gain.setValueAtTime(0.12, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.35);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.35);
      } else if (type === "beep") {
        osc.type = "sine";
        osc.frequency.setValueAtTime(600, audioCtx.currentTime);
        gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.2);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.2);
      }
    } catch (e) {
      console.warn("Web Audio Context blocked or not supported", e);
    }
  };

  const sounds = [
    { id: "chime", label: "Chime Digital", type: "chime", desc: "Tono doble brillante" },
    { id: "bell", label: "Campana Clásica", type: "bell", desc: "Resonancia metálica" },
    { id: "whistle", label: "Silbato Mascota", type: "whistle", desc: "Agudo y llamativo" },
    { id: "beep", label: "Pitido Alerta", type: "beep", desc: "Frecuencia corta" },
  ];

  const handleTest = (id: string) => {
    setIsTesting(id);
    playWebSound(id);
    setTimeout(() => setIsTesting(null), 800);
  };

  const handleSync = (id: string) => {
    setSelectedSound(id);
    onPublishSound(id);
    toast.success("Sonido sincronizado", {
      description: `El ESP32 emitirá el sonido "${id.toUpperCase()}" al dispensar.`,
    });
  };

  const startRecording = () => {
    setIsRecording(true);
    toast.info("Grabando nota de voz para tu mascota...", {
      description: "Habla hacia tu micrófono para registrar el audio.",
    });

    setTimeout(() => {
      setIsRecording(false);
      const newClipName = `Voz: "¡Hora de Comer, ${recordedClips.length === 0 ? "Koko" : "Toby"}!"`;
      setRecordedClips((prev) => [...prev, newClipName]);
      toast.success("Mensaje guardado", {
        description: "Grabación guardada localmente y lista para transmitir.",
      });
    }, 3500);
  };

  return (
    <motion.div
      className="glass-card overflow-hidden h-full flex flex-col relative"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="px-4 pt-3 pb-1 flex items-center justify-between z-10">
        <div className="flex items-center gap-2">
          <motion.div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-500 dark:text-emerald-400" whileHover={{ scale: 1.1 }}>
            <Volume2 className="h-3.5 w-3.5" strokeWidth={1.5} />
          </motion.div>
          <span className="text-xs font-semibold text-zinc-650 dark:text-white/60">
            Mesa de Sonidos
          </span>
        </div>
        <span className="text-[9px] font-mono text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">ESP32 DAC</span>
      </div>

      <div className="flex-1 p-3.5 flex flex-col gap-3.5 z-10 justify-between">
        {/* Lista de sonidos */}
        <div className="space-y-1.5">
          {sounds.map((sound) => {
            const isCurrent = selectedSound === sound.id;
            return (
              <div
                key={sound.id}
                className={`flex items-center justify-between p-2 rounded-xl transition-all duration-200 border ${
                  isCurrent
                    ? "bg-emerald-500/5 dark:bg-emerald-500/[0.03] border-emerald-500/25 dark:border-emerald-500/10"
                    : "bg-zinc-50/50 dark:bg-white/[0.01] border-zinc-150 dark:border-white/[0.02]"
                }`}
              >
                <div>
                  <p className="text-[11px] font-bold text-zinc-700 dark:text-white/80">{sound.label}</p>
                  <p className="text-[9px] text-zinc-400 dark:text-zinc-500 font-mono mt-0.5">{sound.desc}</p>
                </div>

                <div className="flex items-center gap-1.5">
                  <motion.button
                    onClick={() => handleTest(sound.id)}
                    className="p-1.5 rounded-lg bg-zinc-100 dark:bg-white/[0.04] text-zinc-500 hover:text-zinc-800 dark:text-white/40 dark:hover:text-white/80 transition-colors cursor-pointer"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    title="Escuchar en navegador"
                  >
                    {isTesting === sound.id ? (
                      <Radio className="h-3 w-3 text-emerald-500 animate-pulse" />
                    ) : (
                      <Play className="h-3 w-3" strokeWidth={1.5} />
                    )}
                  </motion.button>
                  <motion.button
                    onClick={() => handleSync(sound.id)}
                    className={`px-2 py-1 rounded-lg text-[9px] font-bold uppercase transition-all cursor-pointer ${
                      isCurrent
                        ? "bg-emerald-500 text-white shadow-sm font-semibold"
                        : "bg-zinc-100 dark:bg-white/[0.04] text-zinc-500 hover:text-zinc-800 dark:text-white/45 dark:hover:text-white/70"
                    }`}
                    whileTap={{ scale: 0.96 }}
                  >
                    {isCurrent ? "Activo" : "Usar"}
                  </motion.button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Grabador de voz simulado */}
        <div className="rounded-xl border border-zinc-200 dark:border-white/[0.06] bg-zinc-50/30 dark:bg-white/[0.01] p-2.5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold text-zinc-600 dark:text-white/70">Audio Personalizado</span>
            {isRecording && (
              <span className="flex items-center gap-1 text-[9px] font-mono text-red-500">
                <motion.span
                  className="h-1.5 w-1.5 rounded-full bg-red-500"
                  animate={{ opacity: [1, 0, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                />
                REC (3.5s)
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {isRecording ? (
              // Ondas de audio animadas con Framer Motion
              <div className="flex-1 h-9 bg-zinc-100 dark:bg-white/[0.02] border border-zinc-200 dark:border-white/[0.04] rounded-lg flex items-center justify-center gap-1.5 px-3">
                {[...Array(9)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="w-1 bg-red-400 dark:bg-red-500 rounded-full"
                    style={{ height: 16 }}
                    animate={{
                      height: [6, Math.random() * 22 + 8, 6],
                    }}
                    transition={{
                      duration: 0.6,
                      repeat: Infinity,
                      delay: i * 0.05,
                    }}
                  />
                ))}
              </div>
            ) : (
              <div className="flex-1 text-[10px] text-zinc-400 dark:text-zinc-500 font-mono flex items-center justify-center border border-dashed border-zinc-200 dark:border-white/[0.06] rounded-lg h-9">
                {recordedClips.length === 0
                  ? "Graba llamadas a comer"
                  : `${recordedClips.length} nota(s) grabada(s)`}
              </div>
            )}

            <motion.button
              onClick={isRecording ? undefined : startRecording}
              disabled={isRecording}
              className={`h-9 w-9 rounded-lg flex items-center justify-center cursor-pointer transition-colors ${
                isRecording
                  ? "bg-red-500/10 text-red-400 border border-red-500/20"
                  : "bg-zinc-100 dark:bg-white/[0.04] text-zinc-500 hover:text-zinc-800 dark:text-white/50 dark:hover:text-white/80 border border-zinc-200 dark:border-white/[0.06]"
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isRecording ? <Square className="h-3.5 w-3.5 fill-red-500 text-red-500" /> : <Mic className="h-3.5 w-3.5" />}
            </motion.button>
          </div>

          {/* Lista de notas grabadas */}
          {recordedClips.length > 0 && (
            <div className="mt-2 space-y-1">
              {recordedClips.map((clip, idx) => (
                <div key={idx} className="flex items-center justify-between text-[9px] px-2 py-1 rounded bg-zinc-100 dark:bg-white/[0.04] text-zinc-500 dark:text-zinc-400">
                  <span className="font-medium">{clip}</span>
                  <button
                    onClick={() => {
                      playWebSound("chime");
                      toast.info("Reproduciendo nota en el simulador...");
                    }}
                    className="text-emerald-500 hover:underline cursor-pointer"
                  >
                    Transmitir
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
