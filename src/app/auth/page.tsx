"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  Lock,
  Cpu,
  User,
  Loader2,
  BadgeCheck,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import Image from "next/image";

export default function AuthPage() {
  const router = useRouter();

  const [isRegister, setIsRegister] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [deviceId, setDeviceId] = useState("");

  // Controla qué campo de formulario tiene el foco para animar la mascota interactiva
  const [focusedField, setFocusedField] = useState<"name" | "email" | "password" | "deviceId" | null>(null);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (isRegister && !name.trim()) {
      toast.error("Por favor ingresa tu nombre completo.");
      return;
    }
    if (!email.trim()) {
      toast.error("Por favor ingresa tu correo electrónico.");
      return;
    }
    if (!password.trim()) {
      toast.error("Por favor ingresa tu contraseña.");
      return;
    }
    if (!deviceId.trim()) {
      toast.error("Por favor ingresa el ID del dispositivo.");
      return;
    }

    const macRegex = /^([0-9A-Fa-f]{2}:){5}[0-9A-Fa-f]{2}$/;
    if (!macRegex.test(deviceId.trim()) && deviceId.trim() !== "PetFeeder-78A2") {
      toast.error("El ID del dispositivo debe ser PetFeeder-78A2 o tener formato MAC (AA:BB:CC:DD:EE:FF)");
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      const profile = {
        email: email.trim(),
        deviceId: deviceId.trim().toUpperCase(),
        name: isRegister ? name.trim() : email.trim().split("@")[0],
      };

      localStorage.setItem("petfeeder_user", JSON.stringify(profile));
      toast.success("¡Dispositivo vinculado exitosamente!");
      router.push("/dashboard");
    }, 1500);
  }

  // Posiciones de los ojos según el campo enfocado
  const getPupilShift = () => {
    switch (focusedField) {
      case "name":
        return { x: -1, y: 2.5 };
      case "email":
        return { x: -2.5, y: 2 };
      case "deviceId":
        return { x: 2.5, y: 2.5 };
      default:
        return { x: 0, y: 0 };
    }
  };

  const pupilShift = getPupilShift();

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background text-foreground transition-colors duration-300">
      {/* Malla de color decorativo en el fondo */}
      <div className="absolute inset-0 grid-bg pointer-events-none z-0" />

      {/* Panel principal de dos columnas estilo Awwwards */}
      <div className="relative z-10 w-full max-w-5xl min-h-[580px] grid grid-cols-1 lg:grid-cols-12 gap-0 overflow-hidden lg:rounded-3xl border border-zinc-200 dark:border-white/[0.06] bg-white/40 dark:bg-black/40 backdrop-blur-xl shadow-2xl m-0 sm:m-4">
        
        {/* ──── COLUMNA IZQUIERDA: Inmersión visual del producto ──── */}
        <div className="hidden lg:flex lg:col-span-6 relative overflow-hidden bg-[#0c0c0c] flex-col justify-between p-10 select-none">
          {/* Overlay de gradiente */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/55 to-black/10 z-10 pointer-events-none" />
          
          <Image
            src="/auth_showcase_pet.png"
            alt="PetFeeder Smart Device"
            fill
            className="object-cover opacity-85 transition-transform duration-700 hover:scale-105"
            priority
          />

          <div className="relative z-20">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-3.5 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-400">
              <BadgeCheck className="h-3 w-3" />
              Nutrición de Vanguardia
            </span>
          </div>

          <div className="relative z-20 space-y-4">
            <motion.div 
              className="p-5 rounded-2xl border border-white/15 bg-black/60 backdrop-blur-xl max-w-sm shadow-2xl shadow-black/40 ring-1 ring-white/10"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <p className="text-xs italic text-white/70 leading-relaxed">
                &ldquo;El monitoreo en tiempo real RFID y las alarmas preventivas de atasco cuidan a mis mascotas como si yo estuviera en casa.&rdquo;
              </p>
              <div className="mt-3 flex items-center justify-between border-t border-white/5 pt-2.5">
                <span className="text-[10px] font-bold text-white/90">Dra. Natalia Ruiz</span>
                <span className="text-[9px] text-white/40">Médica Veterinaria</span>
              </div>
            </motion.div>

            <div>
              <h2 className="text-xl font-bold tracking-tight text-white">PetFeeder Pro</h2>
              <p className="text-xs text-white/40 mt-1">
                La plataforma inteligente preferida por dueños tecnológicos.
              </p>
            </div>
          </div>
        </div>

        {/* ──── COLUMNA DERECHA: Formulario de inicio / registro ──── */}
        <div className="col-span-1 lg:col-span-6 flex flex-col justify-center p-6 sm:p-10 relative">
          
          {/* Mascota interactiva animada en la parte superior */}
          <div className="flex justify-center mb-1">
            <motion.div
              className="w-24 h-24 relative"
              animate={
                isLoading
                  ? { rotate: [-4, 4, -4, 4, 0], y: [0, -4, 0] }
                  : {}
              }
              transition={isLoading ? { duration: 0.6, repeat: Infinity } : {}}
            >
              <svg viewBox="0 0 100 100" className="w-full h-full">
                {/* Orejas de perrito */}
                <motion.path
                  d="M26,30 Q16,36 20,54 Q24,62 30,50 Z"
                  className="fill-zinc-400 dark:fill-zinc-650"
                  animate={focusedField === "password" ? { rotate: -15 } : { rotate: 0 }}
                />
                <motion.path
                  d="M74,30 Q84,36 80,54 Q76,62 70,50 Z"
                  className="fill-zinc-400 dark:fill-zinc-650"
                  animate={focusedField === "password" ? { rotate: 15 } : { rotate: 0 }}
                />

                {/* Cabeza del perro */}
                <circle cx="50" cy="45" r="21" className="fill-zinc-300 dark:fill-zinc-500" />
                <ellipse cx="50" cy="51" rx="8.5" ry="6" className="fill-white dark:fill-zinc-200" />
                
                {/* Nariz */}
                <polygon points="47,48 53,48 50,51.5" className="fill-zinc-800 dark:fill-zinc-950" />

                {/* Lengua asomada en carga */}
                {isLoading && (
                  <motion.path
                    d="M48,53 Q50,60 52,53 Z"
                    className="fill-red-400"
                    animate={{ scaleY: [1, 1.3, 1] }}
                    transition={{ duration: 0.4, repeat: Infinity }}
                  />
                )}

                {/* Ojos */}
                <circle cx="38" cy="41" r="3.5" className="fill-zinc-800 dark:fill-zinc-950" />
                <circle cx="58" cy="41" r="3.5" className="fill-zinc-800 dark:fill-zinc-950" />

                {/* Pupilas interactivas (siguen al ratón / campo enfocado) */}
                <motion.circle
                  cx={38}
                  cy={41}
                  r={1}
                  className="fill-white"
                  animate={{ x: pupilShift.x, y: pupilShift.y }}
                  transition={{ type: "spring", stiffness: 150 }}
                />
                <motion.circle
                  cx={58}
                  cy={41}
                  r={1}
                  className="fill-white"
                  animate={{ x: pupilShift.x, y: pupilShift.y }}
                  transition={{ type: "spring", stiffness: 150 }}
                />

                {/* Cejas */}
                <path d="M34,35 Q38,34 42,36" fill="none" className="stroke-zinc-800 dark:stroke-zinc-900" strokeWidth="1" />
                <path d="M58,36 Q62,34 66,35" fill="none" className="stroke-zinc-800 dark:stroke-zinc-900" strokeWidth="1" />

                {/* Patas que se tapan los ojos en Password (UX Divertidísima) */}
                <motion.path
                  d="M24,75 Q32,55 38,42 Q40,40 38,38 Q36,36 34,38 Q28,50 20,70 Z"
                  className="fill-zinc-300 dark:fill-zinc-500"
                  initial={{ y: 25, opacity: 0 }}
                  animate={focusedField === "password" ? { y: 0, opacity: 1 } : { y: 25, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 200, damping: 18 }}
                  style={{ transformOrigin: "24px 75px" }}
                />
                <motion.path
                  d="M76,75 Q68,55 62,42 Q60,40 62,38 Q64,36 66,38 Q72,50 80,70 Z"
                  className="fill-zinc-300 dark:fill-zinc-500"
                  initial={{ y: 25, opacity: 0 }}
                  animate={focusedField === "password" ? { y: 0, opacity: 1 } : { y: 25, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 200, damping: 18 }}
                  style={{ transformOrigin: "76px 75px" }}
                />
              </svg>
            </motion.div>
          </div>

          <div className="text-center mb-6">
            <h1 className="text-xl font-bold tracking-tight text-zinc-800 dark:text-white/95">
              ¡Hola, Dog lover!
            </h1>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
              Ingresa los datos para sincronizar tu PetFeeder Pro
            </p>
          </div>

          {/* Selector de modo */}
          <div className="mb-5 flex rounded-xl bg-zinc-100 dark:bg-white/[0.04] border border-zinc-200/50 dark:border-white/[0.02] p-1">
            <button
              type="button"
              onClick={() => {
                setIsRegister(false);
                setFocusedField(null);
              }}
              className={`flex-1 rounded-lg py-1.5 text-xs font-semibold tracking-wide transition-all duration-200 cursor-pointer ${
                !isRegister
                  ? "bg-white dark:bg-white/[0.08] text-zinc-900 dark:text-white shadow-sm"
                  : "text-zinc-500 hover:text-zinc-800 dark:text-white/40 dark:hover:text-white/70"
              }`}
            >
              Iniciar Sesión
            </button>
            <button
              type="button"
              onClick={() => {
                setIsRegister(true);
                setFocusedField(null);
              }}
              className={`flex-1 rounded-lg py-1.5 text-xs font-semibold tracking-wide transition-all duration-200 cursor-pointer ${
                isRegister
                  ? "bg-white dark:bg-white/[0.08] text-zinc-900 dark:text-white shadow-sm"
                  : "text-zinc-500 hover:text-zinc-800 dark:text-white/40 dark:hover:text-white/70"
              }`}
            >
              Registrarse
            </button>
          </div>

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <AnimatePresence initial={false} mode="popLayout">
              {isRegister && (
                <motion.div
                  key="name-field"
                  initial={{ opacity: 0, height: 0, y: -10 }}
                  animate={{ opacity: 1, height: "auto", y: 0 }}
                  exit={{ opacity: 0, height: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-1.5"
                >
                  <Label htmlFor="name" className="text-zinc-650 dark:text-zinc-400 text-xs font-semibold flex items-center gap-1.5">
                    <User className="h-3.5 w-3.5" strokeWidth={1.5} />
                    Nombre completo
                  </Label>
                  <Input
                    id="name"
                    placeholder="Ej. Carlos Mendoza"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onFocus={() => setFocusedField("name")}
                    onBlur={() => setFocusedField(null)}
                    className="h-10 rounded-xl border-zinc-200 dark:border-white/[0.06] bg-zinc-50/50 dark:bg-white/[0.02] text-zinc-800 dark:text-white focus-visible:border-emerald-500 focus-visible:ring-emerald-500/20 text-xs transition-all"
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Email */}
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-zinc-650 dark:text-zinc-400 text-xs font-semibold flex items-center gap-1.5">
                <Mail className="h-3.5 w-3.5" strokeWidth={1.5} />
                Correo electrónico
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="usuario@correo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => setFocusedField("email")}
                onBlur={() => setFocusedField(null)}
                className="h-10 rounded-xl border-zinc-200 dark:border-white/[0.06] bg-zinc-50/50 dark:bg-white/[0.02] text-zinc-800 dark:text-white focus-visible:border-emerald-500 focus-visible:ring-emerald-500/20 text-xs transition-all"
              />
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-zinc-650 dark:text-zinc-400 text-xs font-semibold flex items-center gap-1.5">
                <Lock className="h-3.5 w-3.5" strokeWidth={1.5} />
                Contraseña
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setFocusedField("password")}
                onBlur={() => setFocusedField(null)}
                className="h-10 rounded-xl border-zinc-200 dark:border-white/[0.06] bg-zinc-50/50 dark:bg-white/[0.02] text-zinc-800 dark:text-white focus-visible:border-emerald-500 focus-visible:ring-emerald-500/20 text-xs transition-all"
              />
            </div>

            {/* Device ID */}
            <div className="space-y-1.5">
              <Label htmlFor="deviceId" className="text-zinc-650 dark:text-zinc-400 text-xs font-semibold flex items-center gap-1.5">
                <Cpu className="h-3.5 w-3.5" strokeWidth={1.5} />
                ID del Dispositivo
              </Label>
              <Input
                id="deviceId"
                placeholder="AA:BB:CC:DD:EE:FF"
                value={deviceId}
                onChange={(e) => setDeviceId(e.target.value)}
                onFocus={() => setFocusedField("deviceId")}
                onBlur={() => setFocusedField(null)}
                className="h-10 rounded-xl border-zinc-200 dark:border-white/[0.06] bg-zinc-50/50 dark:bg-white/[0.02] text-zinc-800 dark:text-white font-mono focus-visible:border-emerald-500 focus-visible:ring-emerald-500/20 text-xs transition-all"
              />
              <p className="text-[10px] text-zinc-400 dark:text-zinc-500">
                Formato MAC (e.g. PetFeeder-78A2 en simulador)
              </p>
            </div>

            {/* Botón enviar */}
            <motion.button
              type="submit"
              disabled={isLoading}
              className="h-10 w-full mt-3 rounded-xl bg-emerald-500 text-white dark:bg-emerald-500/10 border border-emerald-500/20 dark:text-emerald-400 font-semibold tracking-wide text-xs flex items-center justify-center gap-2 hover:bg-emerald-600 dark:hover:bg-emerald-500/15 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-emerald-500/10 dark:shadow-none"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  Vinculando...
                </>
              ) : (
                "Vincular y Entrar"
              )}
            </motion.button>
          </form>

          {/* Footer */}
          <div className="mt-6 border-t border-zinc-150 dark:border-white/[0.04] pt-4 text-center">
            <p className="text-[10px] text-zinc-400 dark:text-zinc-500">
              Al continuar, aceptas nuestros{" "}
              <span className="cursor-pointer text-emerald-600 dark:text-emerald-400/80 underline underline-offset-2 hover:text-emerald-500 transition-colors">
                Términos de Servicio
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
