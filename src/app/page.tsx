"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform, useInView } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ThemeToggle from "@/components/layout/ThemeToggle";
import AccessibilityToggle from "@/components/layout/AccessibilityToggle";
import BrandLogo from "@/components/layout/BrandLogo";
import {
  ShieldCheck,
  Wifi,
  Gauge,
  TrendingUp,
  ArrowRight,
  Zap,
  Clock,
  BarChart3,
  Cpu,
  Check,
  X,
  BadgeCheck,
  ChevronLeft,
  ChevronRight,
  Star,
  Users,
  Activity,
  Globe,
  Camera,
  Scan,
  Scale,
  Quote,
  Terminal,
  Play,
  Loader2,
  Lock,
  Building2,
  Info,
  MapPin,
  Hand,
  Heart
} from "lucide-react";

// Counter component for stats to prevent layout shifts and animate on entry
function AnimatedCounter({ target, suffix = "", prefix = "" }: { target: number; suffix?: string; prefix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const duration = 2000;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [isInView, target]);

  return (
    <span ref={ref}>
      {prefix}{count.toLocaleString()}{suffix}
    </span>
  );
}

// Stagger anim definitions
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: (i: number) => ({
    opacity: 1,
    scale: 1,
    transition: { delay: i * 0.12, duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

const heroParticles = [
  { top: 18, left: 12, duration: 4.6, delay: 0.2 },
  { top: 24, left: 78, duration: 6.2, delay: 1.1 },
  { top: 36, left: 52, duration: 5.4, delay: 0.7 },
  { top: 44, left: 18, duration: 7.1, delay: 2.2 },
  { top: 54, left: 88, duration: 4.9, delay: 1.7 },
  { top: 66, left: 34, duration: 6.8, delay: 0.4 },
  { top: 72, left: 68, duration: 5.7, delay: 2.8 },
  { top: 82, left: 46, duration: 7.4, delay: 1.4 },
  { top: 14, left: 42, duration: 5.2, delay: 3.1 },
  { top: 30, left: 8, duration: 6.5, delay: 2.5 },
  { top: 58, left: 6, duration: 4.8, delay: 0.9 },
  { top: 76, left: 92, duration: 6.9, delay: 3.4 },
];

const features = [
  {
    icon: ShieldCheck,
    title: "Prevención de Atascos",
    description: "Sistema inteligente de detección y reversión con sensores ópticos de proximidad y alertas directas al móvil.",
    accent: "from-emerald-500/20 to-emerald-500/0",
    iconColor: "text-emerald-400",
    iconBg: "bg-emerald-500/10 border-emerald-500/20",
    stat: "99.98%",
    statLabel: "sin atascos",
  },
  {
    icon: Wifi,
    title: "Control en Tiempo Real",
    description: "Comunicación ultrarrápida para que cada ajuste que hagas desde tu celular se refleje de manera instantánea en el dispensador.",
    accent: "from-blue-500/20 to-blue-500/0",
    iconColor: "text-blue-400",
    iconBg: "bg-blue-500/10 border-blue-500/20",
    stat: "Al Instante",
    statLabel: "sin retrasos",
  },
  {
    icon: Gauge,
    title: "Nivel de Comida Exacto",
    description: "Sensores de alta fiabilidad miden constantemente el volumen del depósito para que siempre sepas cuánta comida queda.",
    accent: "from-amber-500/20 to-amber-500/0",
    iconColor: "text-amber-400",
    iconBg: "bg-amber-500/10 border-amber-500/20",
    stat: "Alta",
    statLabel: "precisión",
  },
  {
    icon: TrendingUp,
    title: "Analítica Predictiva",
    description: "Visualiza curvas de consumo real de alimento y estima de forma inteligente cuándo necesitarás recargar el depósito.",
    accent: "from-purple-500/20 to-purple-500/0",
    iconColor: "text-purple-400",
    iconBg: "bg-purple-500/10 border-purple-500/20",
    stat: "3 días",
    statLabel: "de preaviso",
  },
  {
    icon: MapPin,
    title: "Seguimiento GPS",
    description: "Localiza tu dispensador en tiempo real con geocerca inteligente y alertas inmediatas si el equipo se mueve de zona.",
    accent: "from-cyan-500/20 to-cyan-500/0",
    iconColor: "text-cyan-400",
    iconBg: "bg-cyan-500/10 border-cyan-500/20",
    stat: "±8m",
    statLabel: "precisión GPS",
  },
];

const techStack = [
  { icon: Cpu, label: "Procesador Inteligente", desc: "Núcleo del Sistema" },
  { icon: Camera, label: "Cámara Integrada", desc: "Monitoreo por Video" },
  { icon: Scale, label: "Sensor de Peso", desc: "Báscula de Precisión" },
  { icon: Scan, label: "Reconocimiento", desc: "Identificación de Mascotas" },
  { icon: Wifi, label: "Conexión Constante", desc: "Respuesta Inmediata" },
  { icon: Activity, label: "Sensor de Presencia", desc: "Detecta Actividad" },
  { icon: MapPin, label: "Ubicación GPS", desc: "Seguimiento Continuo" },
];

const steps = [
  { number: "01", icon: Zap, title: "Conecta tu Feeder", description: "Enlaza el dispositivo a tu red local en menos de un minuto." },
  { number: "02", icon: Clock, title: "Programa Horarios", description: "Configura raciones y horarios de comida personalizados." },
  { number: "03", icon: BarChart3, title: "Monitorea Salud", description: "Visualiza ingestas, video en vivo y recibe avisos al instante." },
];

const testimonials = [
  {
    name: "Dueños que trabajan tarde",
    role: "Automatización de Rutinas",
    text: "Mantén el horario de comida de tu mascota sin importar si te quedas horas extra en la oficina. El dispensador sirve las raciones programadas de manera autónoma.",
    rating: 5,
    gradient: "from-teal-500 to-emerald-500"
  },
  {
    name: "Mascotas con dietas estrictas",
    role: "Control de Porciones",
    text: "Controla los gramos exactos que consume tu mascota. El sensor de peso de alta precisión asegura que la dosis exacta se libere en cada toma.",
    rating: 5,
    gradient: "from-blue-500 to-indigo-500"
  },
  {
    name: "Viajes cortos de fin de semana",
    role: "Monitoreo Remoto",
    text: "Monitorea a través del Dashboard en vivo que tu mascota esté comiendo bien mientras estás fuera. Recibe alertas instantáneas en tu celular si ocurre un atasco.",
    rating: 5,
    gradient: "from-purple-500 to-pink-500"
  }
];

const stats = [
  { value: 14500, suffix: "+", label: "Feeders Activos", icon: Cpu },
  { value: 99, suffix: ".99%", label: "Uptime MQTT", icon: Activity },
  { value: 52, suffix: "+", label: "Países Conectados", icon: Globe },
  { value: 4800, suffix: "+", label: "Mascotas Cuidadas", icon: Users },
];

const plans = [
  {
    name: "Starter",
    price: "0",
    period: "gratis para siempre",
    description: "Ideal para monitorear una sola mascota de forma básica.",
    features: [
      { name: "1 dispositivo conectado", included: true },
      { name: "Historial de 7 días", included: true },
      { name: "Alertas Telegram básicas", included: true },
      { name: "Soporte comunitario", included: true },
      { name: "Acceso API REST", included: false },
      { name: "Stream HD ESP32-CAM", included: false },
      { name: "Analítica predictiva", included: false },
    ],
  },
  {
    name: "Pro",
    price: "9.99",
    period: "/mes",
    description: "Perfecto para dueños que buscan control avanzado y analíticas.",
    featured: true,
    features: [
      { name: "Hasta 3 dispositivos", included: true },
      { name: "Historial de 90 días", included: true },
      { name: "Alertas prioritarias + Telegram", included: true },
      { name: "Soporte por email 24/7", included: true },
      { name: "Acceso completo API REST", included: true },
      { name: "Stream HD ESP32-CAM", included: true },
      { name: "Analítica predictiva básica", included: true },
    ],
  },
  {
    name: "Enterprise",
    price: "29.99",
    period: "/mes",
    description: "Diseñado para veterinarias, criaderos y pet hotels.",
    features: [
      { name: "Dispositivos ilimitados", included: true },
      { name: "Historial completo de 1 año", included: true },
      { name: "Notificaciones y Webhooks inmediatos", included: true },
      { name: "Soporte dedicado 1-a-1", included: true },
      { name: "Acceso API + Webhooks ilimitados", included: true },
      { name: "Stream HD + Grabación en Nube", included: true },
      { name: "Analítica predictiva avanzada", included: true },
    ],
  },
];

export default function Home() {
  const router = useRouter();
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const featuresRef = useRef(null);
  const stepsRef = useRef(null);
  const statsRef = useRef(null);
  const previewRef = useRef(null);
  const pricingRef = useRef(null);

  // States
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [isAnnual, setIsAnnual] = useState(false);
  const [showDemoModal, setShowDemoModal] = useState(false);
  const [demoEmail, setDemoEmail] = useState("");
  const [demoName, setDemoName] = useState("");
  const [demoSuccess, setDemoSuccess] = useState(false);

  // Sandbox simulation states
  const [sandboxDispensing, setSandboxDispensing] = useState(false);
  const [sandboxLogs, setSandboxLogs] = useState<string[]>(["[SISTEMA] Listo. Esperando comando MQTT..."]);
  const [sandboxWeight, setSandboxWeight] = useState(40);
  const [sandboxJam, setSandboxJam] = useState(false);
  const [sandboxPortion, setSandboxPortion] = useState(20);
  const sandboxCanvasRef = useRef<HTMLCanvasElement>(null);

  // Auto-rotating testimonials
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextTestimonial = () => setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  const prevTestimonial = () => setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);

  const handleSandboxDispense = () => {
    if (sandboxDispensing) return;
    setSandboxDispensing(true);
    setSandboxLogs([]);
    const t0 = new Date().toLocaleTimeString("es-ES", { hour12: false });
    setSandboxLogs([`[${t0}] CLIENTE: Publicando comando MQTT a 'utp/petfeeder/comando'...`]);

    setTimeout(() => {
      const t = new Date().toLocaleTimeString("es-ES", { hour12: false });
      setSandboxLogs((prev) => [...prev, `[${t}] BROKER: Mensaje retransmitido a cliente ESP32-S3`]);
    }, 400);

    setTimeout(() => {
      const t = new Date().toLocaleTimeString("es-ES", { hour12: false });
      setSandboxLogs((prev) => [...prev, `[${t}] ESP32: Comando recibido`]);
    }, 800);

    setTimeout(() => {
      const t = new Date().toLocaleTimeString("es-ES", { hour12: false });
      if (sandboxJam) {
        setSandboxLogs((prev) => [
          ...prev,
          `[${t}] ESP32: ALERTA - ¡Atasco de comida detectado en la boquilla!`
        ]);
        setSandboxDispensing(false);
      } else {
        setSandboxLogs((prev) => [...prev, `[${t}] ESP32: Tono de alerta (2.4kHz) por 1.5s`]);
      }
    }, 1300);

    if (!sandboxJam) {
      setTimeout(() => {
        const t = new Date().toLocaleTimeString("es-ES", { hour12: false });
        setSandboxLogs((prev) => [...prev, `[${t}] ESP32: Servo rotando 180° - liberando ración`]);
        startSandboxParticles();
      }, 2000);

      setTimeout(() => {
        const t = new Date().toLocaleTimeString("es-ES", { hour12: false });
        const newWeight = sandboxWeight + sandboxPortion;
        setSandboxWeight(newWeight);
        setSandboxLogs((prev) => [
          ...prev,
          `[${t}] HX711: Peso plato: +${sandboxPortion}g (Total: ${newWeight}g)`
        ]);
      }, 3300);

      setTimeout(() => {
        const t = new Date().toLocaleTimeString("es-ES", { hour12: false });
        setSandboxLogs((prev) => [...prev, `[${t}] ESP32: Servido completo, enviando confirmación`]);
      }, 4000);

      setTimeout(() => {
        const t = new Date().toLocaleTimeString("es-ES", { hour12: false });
        setSandboxLogs((prev) => [...prev, `[${t}] CLIENTE: Confirmación recibida: "Ración servida exitosamente"`]);
        setSandboxDispensing(false);
      }, 4500);
    }
  };

  const startSandboxParticles = () => {
    const canvas = sandboxCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;

    interface Particle {
      x: number;
      y: number;
      radius: number;
      color: string;
      vx: number;
      vy: number;
      rotation: number;
      vRotation: number;
    }

    const particles: Particle[] = [];
    const colors = ["#8B4513", "#CD853F", "#A0522D", "#D2691E", "#5C2E0B"];
    let frameId: number;
    let frames = 0;

    const tick = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (frames < 50 && frames % 2 === 0) {
        particles.push({
          x: canvas.width / 2 + (Math.random() - 0.5) * 16,
          y: 40,
          radius: Math.random() * 2.5 + 2,
          color: colors[Math.floor(Math.random() * colors.length)],
          vx: (Math.random() - 0.5) * 2,
          vy: Math.random() * 2 + 1,
          rotation: Math.random() * Math.PI * 2,
          vRotation: (Math.random() - 0.5) * 0.1,
        });
      }
      frames++;

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.vy += 0.18;
        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.vRotation;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.beginPath();
        ctx.ellipse(0, 0, p.radius * 1.3, p.radius * 0.8, 0, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
        ctx.restore();

        const bowlBottom = canvas.height - 35;
        if (p.y > bowlBottom) {
          p.y = bowlBottom;
          p.vy = -p.vy * 0.22;
          p.vx *= 0.5;
        }

        if (p.y > canvas.height) {
          particles.splice(i, 1);
        }
      }

      if (particles.length > 0 || frames < 80) {
        frameId = requestAnimationFrame(tick);
      }
    };

    tick();
  };

  const handleDemoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!demoEmail || !demoName) return;
    setDemoSuccess(true);
    setTimeout(() => {
      setShowDemoModal(false);
      setDemoSuccess(false);
      setDemoEmail("");
      setDemoName("");
    }, 3000);
  };

  return (
    <div className="flex flex-col min-h-full overflow-x-hidden relative bg-background text-foreground transition-colors duration-300">
      <div className="absolute inset-0 grid-bg pointer-events-none z-0" />
      {/* ──── Floating Background Glowing Blobs (Awwwards Style) ──── */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <motion.div
          className="absolute top-[8%] left-[5%] w-[450px] h-[450px] rounded-full bg-emerald-500/[0.03] blur-[130px]"
          animate={{
            x: [0, 60, 0],
            y: [0, -40, 0],
            scale: [1, 1.15, 1],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-[35%] right-[5%] w-[500px] h-[500px] rounded-full bg-indigo-500/[0.025] blur-[150px]"
          animate={{
            x: [0, -50, 0],
            y: [0, 70, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />
        <motion.div
          className="absolute bottom-[20%] left-[8%] w-[550px] h-[550px] rounded-full bg-emerald-500/[0.025] blur-[140px]"
          animate={{
            x: [0, 50, 0],
            y: [0, -50, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        />
      </div>

      {/* ──── Fixed Navbar ──── */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-zinc-200 dark:border-white/[0.04] bg-white/80 dark:bg-background/80 backdrop-blur-2xl transition-colors duration-300">
        <div className="max-w-6xl mx-auto px-6 flex h-14 items-center justify-between">
          <BrandLogo href="/" />
          <div className="flex items-center gap-4 sm:gap-5">
            <a href="#funciones" className="text-[11px] text-zinc-500 hover:text-zinc-900 dark:text-zinc-500 dark:text-white/35 dark:hover:text-zinc-800 dark:text-white/70 transition-colors hidden sm:block">Funciones</a>
            <a href="#tecnologia" className="text-[11px] text-zinc-500 hover:text-zinc-900 dark:text-zinc-500 dark:text-white/35 dark:hover:text-zinc-800 dark:text-white/70 transition-colors hidden sm:block">Tecnología</a>
            <a href="#simulador" className="text-[11px] text-zinc-500 hover:text-zinc-900 dark:text-zinc-500 dark:text-white/35 dark:hover:text-zinc-800 dark:text-white/70 transition-colors hidden sm:block">Simulador</a>
            <a href="#precios" className="text-[11px] text-zinc-500 hover:text-zinc-900 dark:text-zinc-500 dark:text-white/35 dark:hover:text-zinc-800 dark:text-white/70 transition-colors hidden sm:block">Precios</a>
            
            <ThemeToggle />
            <AccessibilityToggle />
            
            <Link
              href="/auth"
              className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400/80 hover:text-emerald-500 dark:hover:text-emerald-400 transition-all px-3.5 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/15 hover:bg-emerald-500/15 cursor-pointer"
            >
              Iniciar Sesión
            </Link>
          </div>
        </div>
      </nav>

      {/* ──── Hero Section ──── */}
      <section ref={heroRef} className="relative min-h-screen flex items-center bg-background/90 dark:bg-background/90 pt-14 overflow-hidden z-10">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <motion.div
            className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[900px] rounded-full"
            style={{ background: "radial-gradient(ellipse, rgba(16,185,129,0.07) 0%, transparent 70%)" }}
            animate={{ scale: [1, 1.15, 1], opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
          {heroParticles.map((particle, i) => (
            <motion.div
              key={i}
              className="absolute h-px w-px rounded-full bg-white/20"
              style={{
                top: `${particle.top}%`,
                left: `${particle.left}%`,
              }}
              animate={{
                opacity: [0, 0.5, 0],
                scale: [0, 1.5, 0],
              }}
              transition={{
                duration: particle.duration,
                repeat: Infinity,
                delay: particle.delay,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>

        <div className="relative mx-auto max-w-6xl px-6 w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <motion.div
              className="mb-5 inline-flex items-center gap-2 rounded-full bg-zinc-100 dark:bg-white/[0.03] px-4 py-1.5 text-[11px] font-medium text-zinc-600 dark:text-white/50 border border-zinc-200 dark:border-white/[0.06]"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <motion.div
                className="h-1.5 w-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400"
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <span>Plataforma IoT de Grado Industrial</span>
              <span className="hidden sm:inline text-zinc-400 dark:text-white/25">·</span>
              <span className="hidden sm:inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400/70">
                <Hand className="h-3 w-3" strokeWidth={2} />
                Haz clic para soltar croquetas
              </span>
            </motion.div>

            <motion.h1
              className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.1] tracking-tight text-foreground"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.15 }}
            >
              Nutrición inteligente
              <br />
              <span className="gradient-text">para tu mascota</span>
            </motion.h1>

            <motion.p
              className="mt-5 max-w-lg text-sm leading-relaxed text-zinc-500 dark:text-white/35 sm:text-base"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              Alimentación automatizada de alta precisión. Conectividad ininterrumpida para control en tiempo real, monitoreo en vivo por cámara integrada y análisis inteligente de hábitos de consumo.
            </motion.p>

            <motion.div
              className="mt-8 flex flex-col sm:flex-row items-start gap-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.45 }}
            >
              <Link
                href="/auth"
                className="group inline-flex items-center gap-2.5 rounded-xl bg-emerald-500/15 px-7 py-3.5 text-sm font-semibold text-emerald-400 border border-emerald-500/25 transition-all duration-300 hover:bg-emerald-500/25 hover:shadow-[0_0_30px_rgba(16,185,129,0.15)]"
              >
                Comenzar Gratis
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" strokeWidth={1.5} />
              </Link>
              <a
                href="#precios"
                className="inline-flex items-center gap-2 rounded-xl px-7 py-3.5 text-sm font-medium text-zinc-500 dark:text-white/35 border border-zinc-200 dark:border-white/[0.06] transition-all hover:text-zinc-700 dark:text-white/60 hover:border-white/[0.1]"
              >
                Ver Planes
              </a>
            </motion.div>

            <motion.div
              className="mt-8 flex items-center gap-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <div className="flex -space-x-2">
                {["V", "D", "C", "A"].map((letter, i) => (
                  <div
                    key={i}
                    className="h-8 w-8 rounded-full bg-gradient-to-br from-white/10 to-white/5 border-2 border-[#050505] flex items-center justify-center text-[10px] font-bold text-zinc-500 dark:text-white/40"
                  >
                    {letter}
                  </div>
                ))}
              </div>
              <div>
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-3 w-3 text-amber-400 fill-amber-400" strokeWidth={1.5} />
                  ))}
                </div>
                <p className="text-[10px] text-zinc-400 dark:text-white/25 mt-0.5">+4,800 mascotas cuidadas con éxito</p>
              </div>
            </motion.div>
          </div>

          <motion.div
            className="relative hidden lg:block"
            initial={{ opacity: 0, x: 40, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] as const }}
          >
            <div className="relative">
              <motion.div
                className="absolute -inset-4 rounded-3xl"
                style={{ background: "radial-gradient(ellipse at center, rgba(16,185,129,0.08) 0%, transparent 70%)" }}
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 4, repeat: Infinity }}
              />
              <Image
                src="/hero-device.png"
                alt="Smart Feeder Device Showcase"
                width={600}
                height={500}
                className="relative z-10 rounded-2xl"
                priority
              />
              <motion.div
                className="absolute -bottom-4 -right-4 bg-[#0a0a0a]/90 backdrop-blur-xl border border-zinc-200 dark:border-white/[0.08] rounded-xl px-4 py-3 z-20"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
              >
                <div className="flex items-center gap-2">
                  <motion.div
                    className="h-2.5 w-2.5 rounded-full bg-emerald-400"
                    animate={{ opacity: [1, 0.3, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                  <span className="text-[10px] font-mono text-emerald-400/70">MQTT WS Conectado</span>
                </div>
                <p className="text-[9px] text-zinc-400 dark:text-white/20 mt-0.5 font-mono">Ping: 22ms</p>
              </motion.div>
              <motion.div
                className="absolute -top-3 -left-3 bg-[#0a0a0a]/90 backdrop-blur-xl border border-zinc-200 dark:border-white/[0.08] rounded-xl px-3 py-2 z-20"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 }}
              >
                <p className="text-[9px] text-zinc-500 dark:text-white/30 font-mono">Nivel de Depósito</p>
                <p className="text-sm font-bold neon-text">72%</p>
              </motion.div>
            </div>
          </motion.div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="flex flex-col items-center gap-1"
          >
            <span className="text-[9px] text-zinc-600 dark:text-zinc-400 font-bold uppercase tracking-widest">Deslizar</span>
            <div className="h-6 w-3.5 rounded-full border border-zinc-400 dark:border-white/20 flex items-start justify-center p-1">
              <motion.div
                className="h-1.5 w-1.5 rounded-full bg-zinc-500 dark:bg-white/50"
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* ──── Tech Stack Grid ──── */}
      <section id="tecnologia" className="relative bg-background/90 dark:bg-background/90 px-6 py-16 border-t border-zinc-200 dark:border-white/[0.03] z-10">
        <div className="mx-auto max-w-5xl">
          <motion.p
            className="text-center text-[11px] font-bold text-zinc-600 dark:text-zinc-400 uppercase tracking-[0.2em] mb-8"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            Módulos Hardware & Conectividad
          </motion.p>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
            {techStack.map((tech, i) => (
              <motion.div
                key={tech.label}
                className="glass-card-hover flex flex-col items-center gap-2 py-4 px-3 text-center group cursor-default"
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={scaleIn}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
              >
                <tech.icon className="h-5 w-5 text-zinc-400 dark:text-white/25 group-hover:text-emerald-400/60 transition-colors duration-300" strokeWidth={1.5} />
                <span className="text-[11px] font-semibold text-zinc-600 dark:text-white/50 group-hover:text-zinc-900 dark:text-white/80 transition-colors">{tech.label}</span>
                <span className="text-[9px] text-zinc-400 dark:text-white/20">{tech.desc}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ──── Features Section ──── */}
      <section id="funciones" className="relative bg-background/90 dark:bg-background/90 px-6 py-20 sm:py-28 border-t border-zinc-200 dark:border-white/[0.03] z-10">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-14">
            <span className="inline-block rounded-lg bg-zinc-100 dark:bg-white/[0.03] px-3 py-1 text-[11px] font-medium text-zinc-500 dark:text-white/40 border border-zinc-200 dark:border-white/[0.06]">
              Características
            </span>
            <h2 className="mt-4 text-2xl font-bold tracking-tight text-zinc-900 dark:text-white/90 sm:text-3xl lg:text-4xl">
              ¿Por qué elegir <span className="gradient-text">PetFeeder Pro</span>?
            </h2>
            <p className="mx-auto mt-3 max-w-lg text-sm text-zinc-500 dark:text-white/30">
              Desarrollado con componentes robustos para garantizar el bienestar de tu mascota.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {features.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  className="group glass-card-hover p-5 relative overflow-hidden cursor-default"
                  custom={i}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeUp}
                  whileHover={{ y: -6, transition: { duration: 0.25 } }}
                >
                  <div className={`absolute inset-0 bg-gradient-to-b ${feature.accent} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

                  <div className="relative">
                    <div className={`mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl border ${feature.iconBg} transition-all duration-300 group-hover:scale-110`}>
                      <Icon className={`h-5 w-5 ${feature.iconColor}`} strokeWidth={1.5} />
                    </div>
                    <h3 className="mb-1.5 text-sm font-semibold text-zinc-900 dark:text-white/80">
                      {feature.title}
                    </h3>
                    <p className="text-[11px] leading-relaxed text-zinc-500 dark:text-white/30 mb-4">
                      {feature.description}
                    </p>
                    <div className="pt-3 border-t border-zinc-200 dark:border-white/[0.04]">
                      <span className="text-lg font-bold neon-text">{feature.stat}</span>
                      <span className="text-[10px] text-zinc-400 dark:text-white/25 ml-1.5">{feature.statLabel}</span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ──── Experiencia de cuidado conectada ──── */}
      <section className="relative bg-background/90 dark:bg-background/90 px-6 py-20 sm:py-24 border-t border-zinc-200 dark:border-white/[0.03] z-10">
        <div className="mx-auto max-w-5xl">
          <div className="text-center mb-12">
            <span className="inline-block rounded-lg bg-blue-500/10 px-3 py-1 text-[11px] font-medium text-blue-500 dark:text-blue-400/70 border border-blue-500/15">
              Cuidado en Vivo
            </span>
            <h2 className="mt-4 text-2xl font-bold tracking-tight text-zinc-900 dark:text-white/90 sm:text-3xl">
              Conecta con tu mascota <span className="gradient-text">desde cualquier lugar</span>
            </h2>
            <p className="mx-auto mt-3 max-w-lg text-sm text-zinc-500 dark:text-white/30">
              Cada acción tiene una respuesta clara: señales visuales, confirmaciones rápidas y datos útiles para cuidar su rutina sin sentir el panel frío o distante.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {[
              {
                icon: Hand,
                title: "Presencia visible",
                desc: "Huellas suaves y microrespuestas que hacen sentir que el sistema reacciona contigo, no solo recibe órdenes.",
                iconClass: "text-blue-500 dark:text-blue-400",
                bgClass: "bg-blue-500/10 border-blue-500/20",
              },
              {
                icon: Heart,
                title: "Rutina con confianza",
                desc: "Indicadores de estado, alimento y respuesta para decidir rápido sin revisar datos dispersos.",
                iconClass: "text-emerald-500 dark:text-emerald-400",
                bgClass: "bg-emerald-500/10 border-emerald-500/20",
              },
              {
                icon: MapPin,
                title: "GPS + Geocerca",
                desc: "Ubicación clara del feeder, alertas de zona y acceso directo al mapa cuando necesitas verificarlo.",
                iconClass: "text-cyan-500 dark:text-cyan-400",
                bgClass: "bg-cyan-500/10 border-cyan-500/20",
              },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
              <motion.div
                key={item.title}
                className="glass-card-hover p-5 text-center group cursor-default"
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                whileHover={{ y: -4 }}
              >
                <div className={`mx-auto mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl border group-hover:scale-110 transition-transform ${item.bgClass}`}>
                  <Icon className={`h-5 w-5 ${item.iconClass}`} strokeWidth={1.5} />
                </div>
                <h3 className="text-sm font-semibold text-zinc-900 dark:text-white/80 mb-1.5">{item.title}</h3>
                <p className="text-[11px] text-zinc-500 dark:text-white/30 leading-relaxed">{item.desc}</p>
              </motion.div>
            );})}
          </div>
        </div>
      </section>

      {/* ──── How It Works ──── */}
      <section ref={stepsRef} className="relative bg-background/90 dark:bg-background/90 px-6 py-20 sm:py-28 border-t border-zinc-200 dark:border-white/[0.03] z-10">
        <div className="mx-auto max-w-4xl">
          <div className="text-center mb-14">
            <span className="inline-block rounded-lg bg-zinc-100 dark:bg-white/[0.03] px-3 py-1 text-[11px] font-medium text-zinc-500 dark:text-white/40 border border-zinc-200 dark:border-white/[0.06]">
              Cómo Funciona
            </span>
            <h2 className="mt-4 text-2xl font-bold tracking-tight text-zinc-900 dark:text-white/90 sm:text-3xl">
              Configuración en tres pasos
            </h2>
            <p className="mx-auto mt-3 max-w-md text-sm text-zinc-500 dark:text-white/30">
              Del desempaque al primer dosificado en menos de cinco minutos.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-3">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.title}
                  className="relative text-center"
                  custom={index}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeUp}
                >
                  {index < steps.length - 1 && (
                    <motion.div
                      className="absolute top-8 left-[calc(50%+32px)] hidden h-px w-[calc(100%-64px)] sm:block"
                      style={{ background: "linear-gradient(90deg, rgba(16,185,129,0.15), transparent)" }}
                      initial={{ scaleX: 0 }}
                      whileInView={{ scaleX: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.4 + index * 0.2, duration: 0.8 }}
                    />
                  )}

                  <motion.div
                    className="relative mx-auto mb-5 flex h-16 w-16 items-center justify-center"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div className="absolute inset-0 rounded-full bg-zinc-100 dark:bg-white/[0.03] border border-zinc-200 dark:border-white/[0.06]" />
                    <Icon className="h-6 w-6 text-zinc-500 dark:text-white/40 relative z-10" strokeWidth={1.5} />
                    <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/15 border border-emerald-500/25 text-[9px] font-bold text-emerald-400 z-20">
                      {step.number}
                    </span>
                  </motion.div>

                  <h3 className="mb-1 text-sm font-semibold text-zinc-900 dark:text-white/80">{step.title}</h3>
                  <p className="text-[12px] text-zinc-500 dark:text-white/30 leading-relaxed">{step.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ──── Live Dashboard Preview ──── */}
      <section ref={previewRef} className="relative bg-background/90 dark:bg-background/90 px-6 py-20 sm:py-28 border-t border-zinc-200 dark:border-white/[0.03] z-10">
        <div className="mx-auto max-w-5xl">
          <div className="text-center mb-12">
            <span className="inline-block rounded-lg bg-emerald-500/10 px-3 py-1 text-[11px] font-medium text-emerald-400/70 border border-emerald-500/15">
              Dashboard de Gestión
            </span>
            <h2 className="mt-4 text-2xl font-bold tracking-tight text-zinc-900 dark:text-white/90 sm:text-3xl">
              Control centralizado en un Bento Grid
            </h2>
          </div>

          <motion.div
            className="relative rounded-2xl overflow-hidden border border-zinc-200 dark:border-white/[0.06] bg-zinc-50 dark:bg-[#0c0c0c]"
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] as const }}
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/10 via-transparent to-indigo-500/10 rounded-2xl blur-xl pointer-events-none" />
            <Image
              src="/dashboard-preview.png"
              alt="PetFeeder Pro Live Dashboard Preview"
              width={1200}
              height={700}
              className="relative z-10 w-full"
            />
            <div className="absolute inset-0 z-20 bg-gradient-to-t from-background via-transparent to-transparent pointer-events-none" />
          </motion.div>
        </div>
      </section>

      {/* ──── IoT Interactive Sandbox ──── */}
      <section id="simulador" className="relative bg-background/90 dark:bg-background/90 px-6 py-20 sm:py-28 border-t border-zinc-200 dark:border-white/[0.03] overflow-hidden z-10">
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 rounded-full bg-emerald-500/[0.02] blur-[120px] pointer-events-none" />
        <div className="absolute bottom-10 right-1/4 w-80 h-80 rounded-full bg-indigo-500/[0.02] blur-[100px] pointer-events-none" />

        <div className="mx-auto max-w-5xl relative z-10">
          <div className="text-center mb-12">
            <span className="inline-block rounded-lg bg-emerald-500/10 px-3 py-1 text-[11px] font-medium text-emerald-400/70 border border-emerald-500/15">
              Simulador Interactivo
            </span>
            <h2 className="mt-4 text-2xl font-bold tracking-tight text-zinc-900 dark:text-white/90 sm:text-3xl">
              Prueba la tecnología <span className="gradient-text">en tiempo real</span>
            </h2>
            <p className="mx-auto mt-3 max-w-md text-sm text-zinc-500 dark:text-white/30">
              Interactúa con el alimentador IoT y observa el flujo de comunicación MQTT de grado industrial.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
            {/* Mock Feeder Panel */}
            <div className="lg:col-span-7 glass-card p-6 flex flex-col justify-between min-h-[420px] relative overflow-hidden">
              <div className="absolute inset-0 noise-bg pointer-events-none opacity-20" />
              
              <div className="flex items-center justify-between mb-4 relative z-10">
                <div className="flex items-center gap-2">
                  <span className={`h-2.5 w-2.5 rounded-full transition-all duration-300 ${
                    sandboxDispensing 
                      ? "bg-amber-400 shadow-[0_0_12px_#f59e0b]" 
                      : sandboxJam 
                        ? "bg-red-500 shadow-[0_0_12px_#ef4444] animate-pulse" 
                        : "bg-emerald-400 shadow-[0_0_12px_#10b981]"
                  }`} />
                  <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-600 dark:text-white/50">
                    {sandboxDispensing ? "Sirviendo..." : sandboxJam ? "Error de Atasco" : "Dispositivo Listo"}
                  </span>
                </div>
                <span className="text-[9px] font-mono text-zinc-400 dark:text-white/25 bg-zinc-100 dark:bg-white/[0.03] px-2 py-0.5 rounded">
                  ID: PetFeeder-78A2
                </span>
              </div>

              {/* Feeder representation */}
              <div className="flex-1 flex gap-8 items-center justify-center py-4 relative z-10">
                <div className="relative w-28 h-48 bg-gradient-to-b from-white/[0.04] to-transparent border border-white/5 rounded-2xl p-2 flex flex-col justify-between items-center shadow-inner">
                  <div className="w-full bg-white/[0.02] border border-white/5 rounded-lg h-24 relative overflow-hidden">
                    <motion.div 
                      className="absolute bottom-0 left-0 right-0 bg-emerald-500/10 border-t border-emerald-500/30"
                      style={{ height: "72%" }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-[10px] font-mono text-zinc-400 dark:text-white/20 font-bold">Tolva: 72%</span>
                    </div>
                  </div>

                  <div className="relative w-8 h-8 bg-zinc-200 dark:bg-white/[0.06] border border-white/10 rounded flex items-center justify-center">
                    <Cpu className={`h-4 w-4 ${sandboxDispensing ? "text-amber-400 animate-pulse" : "text-zinc-400 dark:text-white/20"}`} />
                  </div>
                </div>

                {/* Particle canvas bowl area */}
                <div className="relative w-36 h-48 bg-white/[0.01] border border-dashed border-white/10 rounded-2xl flex flex-col justify-between p-3">
                  <div className="absolute inset-0 z-10 pointer-events-none">
                    <canvas ref={sandboxCanvasRef} className="w-full h-full" />
                  </div>

                  <span className="text-[9px] font-mono text-zinc-400 dark:text-white/20 text-center uppercase tracking-wider">
                    Báscula (HX711)
                  </span>

                  <div className="mt-auto relative z-20 bg-black/60 border border-white/5 rounded-lg py-2.5 px-3 text-center">
                    <p className="text-[9px] text-zinc-400 dark:text-white/25 font-mono uppercase tracking-widest">Peso Plato</p>
                    <motion.p 
                      className="text-lg font-bold text-emerald-400 tracking-tight font-mono mt-0.5"
                      animate={sandboxDispensing ? { scale: [1, 1.05, 1] } : {}}
                      transition={{ duration: 0.5, repeat: sandboxDispensing ? Infinity : 0 }}
                    >
                      {sandboxWeight}g
                    </motion.p>
                  </div>
                </div>
              </div>

              {/* Controls */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-zinc-200 dark:border-white/[0.04] relative z-10">
                <div className="flex flex-col gap-1.5 justify-center">
                  <div className="flex items-center justify-between text-[10px] text-zinc-500 dark:text-white/40 font-mono">
                    <span>Tamaño de Ración</span>
                    <span className="text-emerald-400 font-bold">{sandboxPortion}g</span>
                  </div>
                  <input 
                    type="range" 
                    min="10" 
                    max="50" 
                    step="10"
                    value={sandboxPortion} 
                    onChange={(e) => setSandboxPortion(Number(e.target.value))}
                    disabled={sandboxDispensing}
                    className="h-1.5 w-full bg-white/5 accent-emerald-400 rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between gap-3 bg-white/[0.02] border border-white/5 rounded-lg px-3 py-1.5">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-semibold text-zinc-700 dark:text-white/60">Simular Atasco</span>
                    <span className="text-[8px] text-zinc-400 dark:text-white/20">Falla de motor servo</span>
                  </div>
                  <button
                    onClick={() => setSandboxJam(!sandboxJam)}
                    disabled={sandboxDispensing}
                    className={`relative w-8 h-4.5 rounded-full p-0.5 transition-colors cursor-pointer ${
                      sandboxJam ? "bg-red-500/20 border border-red-500/30" : "bg-white/5 border border-white/10"
                    }`}
                  >
                    <motion.div 
                      className={`w-3.5 h-3.5 rounded-full ${sandboxJam ? "bg-red-500" : "bg-white/30"}`}
                      layout
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      style={{ marginLeft: sandboxJam ? "12px" : "0px" }}
                    />
                  </button>
                </div>
              </div>
            </div>

            {/* Terminal Console Panel */}
            <div className="lg:col-span-5 bg-[#030303]/95 border border-white/[0.05] rounded-2xl p-5 flex flex-col justify-between font-mono text-[11px] min-h-[420px]">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-zinc-200 dark:border-white/[0.04] mb-3">
                  <div className="flex items-center gap-2">
                    <Terminal className="h-3.5 w-3.5 text-emerald-400" />
                    <span className="text-[10px] text-zinc-700 dark:text-white/60 font-semibold tracking-wider font-mono">Consola MQTT</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-[9px] text-emerald-400/85 font-mono font-bold">HiveMQ Broker</span>
                  </div>
                </div>

                <div className="space-y-2 h-[260px] overflow-y-auto pr-1">
                  {sandboxLogs.map((log, index) => {
                    let color = "text-zinc-700 dark:text-white/60";
                    if (log.includes("CLIENTE")) color = "text-cyan-400";
                    else if (log.includes("ESP32")) color = "text-emerald-400";
                    else if (log.includes("BROKER")) color = "text-amber-400/80";
                    else if (log.includes("ALERTA")) color = "text-red-400 font-semibold";
                    
                    return (
                      <div key={index} className={`leading-relaxed border-b border-white/[0.02] pb-1.5 ${color}`}>
                        {log}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="pt-3 border-t border-zinc-200 dark:border-white/[0.04] flex items-center justify-between">
                <button
                  onClick={handleSandboxDispense}
                  disabled={sandboxDispensing}
                  className={`py-2 px-4 rounded-lg font-semibold tracking-wider uppercase flex items-center gap-2 border text-[10px] transition-all duration-300 w-full justify-center cursor-pointer ${
                    sandboxDispensing
                      ? "bg-white/5 border-white/10 text-zinc-500 dark:text-white/30 cursor-not-allowed"
                      : "bg-emerald-500/10 border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/15 hover:shadow-[0_0_15px_rgba(16,185,129,0.1)]"
                  }`}
                >
                  {sandboxDispensing ? (
                    <>
                      <Loader2 className="h-3 w-3 animate-spin" />
                      Procesando...
                    </>
                  ) : (
                    <>
                      <Play className="h-3 w-3 fill-emerald-400/20" />
                      Dispensar Ración (MQTT)
                    </>
                  )}
                </button>
                {sandboxWeight > 0 && !sandboxDispensing && (
                  <button 
                    onClick={() => {
                      setSandboxWeight(0);
                      const t = new Date().toLocaleTimeString("es-ES", { hour12: false });
                      setSandboxLogs((prev) => [...prev, `[${t}] HX711: Plato vaciado (Peso: 0g)`]);
                    }}
                    className="ml-2 text-[9px] text-zinc-400 dark:text-white/20 hover:text-zinc-500 dark:text-white/40 border border-white/5 hover:border-white/10 px-2.5 py-2 rounded-lg transition-colors cursor-pointer"
                    title="Vaciar Plato"
                  >
                    Vaciar
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ──── Estadísticas ──── */}
      <section ref={statsRef} className="relative bg-background/90 dark:bg-background/90 px-6 py-16 border-t border-zinc-200 dark:border-white/[0.03] z-10">
        <div className="mx-auto max-w-5xl">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                className="glass-card text-center py-6 px-4"
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={scaleIn}
              >
                <stat.icon className="h-5 w-5 text-emerald-400/40 mx-auto mb-3" strokeWidth={1.5} />
                <p className="text-2xl sm:text-3xl font-bold neon-text tracking-tight">
                  <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                </p>
                <p className="text-[10px] text-zinc-400 dark:text-white/25 mt-1 uppercase tracking-wider">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ──── Casos de Uso Carrusel ──── */}
      <section className="relative bg-background/90 dark:bg-background/90 px-6 py-20 sm:py-28 border-t border-zinc-200 dark:border-white/[0.03] z-10">
        <div className="mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <span className="inline-block rounded-lg bg-zinc-100 dark:bg-white/[0.03] px-3 py-1 text-[11px] font-medium text-zinc-500 dark:text-white/40 border border-zinc-200 dark:border-white/[0.06]">
              Casos de Uso
            </span>
            <h2 className="mt-4 text-2xl font-bold tracking-tight text-zinc-900 dark:text-white/90 sm:text-3xl">
              Diseñado para la <span className="gradient-text">vida real</span>
            </h2>
          </div>

          <div className="relative">
            <div className="overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentTestimonial}
                  initial={{ opacity: 0, x: 60 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -60 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] as const }}
                  className="glass-card p-8 sm:p-10 relative overflow-hidden"
                >
                  <Quote className="h-8 w-8 text-emerald-400/15 mb-4" strokeWidth={1.5} />
                  <p className="text-base sm:text-lg leading-relaxed text-zinc-700 dark:text-white/60 mb-6 italic">
                    &ldquo;{testimonials[currentTestimonial].text}&rdquo;
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`h-9 w-9 rounded-full bg-gradient-to-br ${testimonials[currentTestimonial].gradient} flex items-center justify-center text-[11px] font-bold text-white shadow-md`}>
                        {testimonials[currentTestimonial].name.split(' ').pop()?.[0] || 'U'}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-zinc-900 dark:text-white/80">
                          {testimonials[currentTestimonial].name}
                        </p>
                        <p className="text-[11px] text-zinc-500 dark:text-white/30">
                          {testimonials[currentTestimonial].role}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-0.5">
                      {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                        <Star key={i} className="h-3.5 w-3.5 text-amber-400 fill-amber-400" strokeWidth={1.5} />
                      ))}
                    </div>
                  </div>

                  {/* Horizontal timeline progress bar */}
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/[0.02]">
                    <motion.div
                      key={currentTestimonial}
                      className="h-full bg-emerald-400/50"
                      initial={{ width: "0%" }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 5, ease: "linear" }}
                    />
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="flex items-center justify-center gap-3 mt-6">
              <button
                onClick={prevTestimonial}
                className="p-2 rounded-lg bg-zinc-100 dark:bg-white/[0.03] border border-zinc-200 dark:border-white/[0.06] text-zinc-500 dark:text-white/30 hover:text-zinc-700 dark:text-white/60 hover:bg-zinc-200 dark:bg-white/[0.06] transition-all cursor-pointer"
              >
                <ChevronLeft className="h-4 w-4" strokeWidth={1.5} />
              </button>
              <div className="flex gap-1.5">
                {testimonials.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentTestimonial(i)}
                    className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                      i === currentTestimonial
                        ? "w-6 bg-emerald-400/60"
                        : "w-1.5 bg-white/10 hover:bg-white/20"
                    }`}
                  />
                ))}
              </div>
              <button
                onClick={nextTestimonial}
                className="p-2 rounded-lg bg-zinc-100 dark:bg-white/[0.03] border border-zinc-200 dark:border-white/[0.06] text-zinc-500 dark:text-white/30 hover:text-zinc-700 dark:text-white/60 hover:bg-zinc-200 dark:bg-white/[0.06] transition-all cursor-pointer"
              >
                <ChevronRight className="h-4 w-4" strokeWidth={1.5} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ──── Precios ──── */}
      <section id="precios" ref={pricingRef} className="relative bg-background/90 dark:bg-background/90 px-6 py-20 sm:py-28 border-t border-zinc-200 dark:border-white/[0.03] z-10">
        <div className="mx-auto max-w-5xl">
          <div className="text-center mb-10">
            <span className="inline-block rounded-lg bg-emerald-500/10 px-3 py-1 text-[11px] font-medium text-emerald-400/70 border border-emerald-500/15">
              Planes y Precios
            </span>
            <h2 className="mt-4 text-2xl font-bold tracking-tight text-zinc-900 dark:text-white/90 sm:text-3xl lg:text-4xl">
              Elige tu plan <span className="gradient-text">ideal</span>
            </h2>
            <p className="mx-auto mt-3 max-w-md text-sm text-zinc-500 dark:text-white/30">
              Comienza gratis. Escala a medida que crecen tus necesidades.
            </p>
          </div>

          {/* Billing switch toggle */}
          <div className="flex items-center justify-center gap-3 mb-10 relative z-10">
            <span className={`text-[11px] font-semibold uppercase tracking-wider transition-colors duration-200 ${!isAnnual ? "text-emerald-400" : "text-zinc-500 dark:text-white/30"}`}>
              Mensual
            </span>
            <button
              onClick={() => setIsAnnual(!isAnnual)}
              className="relative w-11 h-6 rounded-full bg-white/5 border border-white/10 p-0.5 flex items-center cursor-pointer transition-colors"
              aria-label="Alternar ciclo de facturación"
            >
              <motion.div
                className="w-4.5 h-4.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.3)]"
                layout
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                style={{ marginLeft: isAnnual ? "20px" : "0px" }}
              />
            </button>
            <span className={`text-[11px] font-semibold uppercase tracking-wider transition-colors duration-200 ${isAnnual ? "text-emerald-400" : "text-zinc-500 dark:text-white/30"} flex items-center gap-2`}>
              Anual
              <span className="text-[8px] font-bold px-1.5 py-0.5 bg-emerald-500/15 border border-emerald-500/25 text-emerald-400 rounded-full font-mono">
                -20%
              </span>
            </span>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {plans.map((plan, i) => {
              const displayPrice = plan.name === "Starter" 
                ? "0" 
                : plan.name === "Pro" 
                  ? (isAnnual ? "7.99" : "9.99") 
                  : (isAnnual ? "23.99" : "29.99");
              
              const displayPeriod = plan.name === "Starter" 
                ? "gratis para siempre" 
                : (isAnnual ? "/mes" : "/mes");

              const isFree = plan.price === "0";

              return (
                <motion.div
                  key={plan.name}
                  className={`relative flex flex-col ${
                    plan.featured ? "glass-pricing-featured" : "glass-pricing"
                  } p-6 sm:p-7 transition-all duration-300`}
                  custom={i}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeUp}
                  whileHover={{ y: -8, transition: { duration: 0.3 } }}
                >
                  {plan.featured && (
                    <motion.div
                      className="absolute -top-3 left-1/2 -translate-x-1/2"
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.4, type: "spring" }}
                    >
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-3.5 py-1 text-[10px] font-semibold text-emerald-400 border border-emerald-500/25">
                        <BadgeCheck className="h-3 w-3" strokeWidth={1.8} />
                        Más Popular
                      </span>
                    </motion.div>
                  )}

                  <div className="mb-5">
                    <h3 className="text-base font-semibold text-zinc-900 dark:text-white/80">{plan.name}</h3>
                    <p className="text-[11px] text-zinc-400 dark:text-white/25 mt-0.5">{plan.description}</p>
                  </div>

                  <div className="mb-6">
                    <div className="flex items-baseline gap-1 h-10">
                      <span className="text-[11px] text-zinc-500 dark:text-white/30 align-super">$</span>
                      <motion.span 
                        key={`${plan.name}-${isAnnual}`}
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2 }}
                        className={`text-4xl font-bold tracking-tight ${plan.featured ? "gradient-text-pricing" : "text-zinc-900 dark:text-white/80"}`}
                      >
                        {displayPrice}
                      </motion.span>
                      <span className="text-[10px] text-zinc-400 dark:text-white/25 ml-1">{displayPeriod}</span>
                    </div>
                    {isAnnual && !isFree && (
                      <p className="text-[8px] text-emerald-400/50 mt-1 font-mono uppercase tracking-wider">
                        Facturado anualmente
                      </p>
                    )}
                  </div>

                  <div className="flex-1 space-y-3 mb-6">
                    {plan.features.map((feature, fi) => (
                      <motion.div
                        key={feature.name}
                        className="flex items-center gap-2.5"
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 + fi * 0.05 }}
                      >
                        {feature.included ? (
                          <div className="h-4 w-4 rounded-full bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                            <Check className="h-2.5 w-2.5 text-emerald-400" strokeWidth={2.5} />
                          </div>
                        ) : (
                          <div className="h-4 w-4 rounded-full bg-zinc-100 dark:bg-white/[0.03] flex items-center justify-center flex-shrink-0">
                            <X className="h-2.5 w-2.5 text-zinc-400/40 dark:text-white/15" strokeWidth={2} />
                          </div>
                        )}
                        <span className={`text-[12px] ${feature.included ? "text-zinc-600 dark:text-white/50" : "text-zinc-400 dark:text-white/20"}`}>
                          {feature.name}
                        </span>
                      </motion.div>
                    ))}
                  </div>

                  <motion.button
                    onClick={(e) => {
                      if (plan.name === "Enterprise") {
                        e.preventDefault();
                        setShowDemoModal(true);
                      } else {
                        router.push("/auth");
                      }
                    }}
                    className={`block w-full text-center py-3 rounded-xl text-xs font-semibold transition-all duration-300 cursor-pointer ${
                      plan.featured
                        ? "bg-emerald-500/15 border border-emerald-500/25 text-emerald-400 hover:bg-emerald-500/25 hover:shadow-[0_0_25px_rgba(16,185,129,0.12)]"
                        : "bg-zinc-100 dark:bg-white/[0.04] border border-zinc-200 dark:border-white/[0.08] text-zinc-600 dark:text-white/50 hover:bg-white/[0.08] hover:text-zinc-800 dark:text-white/70"
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {plan.name === "Enterprise" ? "Contactar Ventas" : plan.price === "0" ? "Comenzar Gratis" : `Obtener ${plan.name}`}
                  </motion.button>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ──── Final CTA ──── */}
      <section className="relative bg-background/90 dark:bg-background/90 px-6 py-20 sm:py-28 border-t border-zinc-200 dark:border-white/[0.03] overflow-hidden z-10">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[400px] w-[600px] rounded-full"
            style={{ background: "radial-gradient(ellipse, rgba(16,185,129,0.06) 0%, transparent 70%)" }}
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 6, repeat: Infinity }}
          />
        </div>
        <div className="relative mx-auto max-w-2xl text-center">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-zinc-900 dark:text-white/90">
            Empieza a cuidar a tu mascota
            <br />
            <span className="gradient-text">de forma inteligente</span>
          </h2>
          <p className="mt-4 text-sm text-zinc-500 dark:text-white/30 max-w-md mx-auto">
            Únete a miles de usuarios que ya confían en PetFeeder Pro para automatizar la nutrición de sus mascotas.
          </p>
          <motion.button
            type="button"
            onClick={() => router.push("/auth")}
            className="group mt-8 inline-flex items-center gap-2.5 rounded-xl bg-emerald-500/15 px-8 py-4 text-sm font-semibold text-emerald-400 border border-emerald-500/25 transition-all duration-300 hover:bg-emerald-500/25 hover:shadow-[0_0_40px_rgba(16,185,129,0.15)]"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            Crear Cuenta Gratis
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" strokeWidth={1.5} />
          </motion.button>
          <p className="mt-4 text-[10px] text-zinc-400/40 dark:text-white/15">
            Sin tarjeta de crédito · Configuración en 5 minutos · Cancela en cualquier momento
          </p>
        </div>
      </section>

      {/* ──── Footer ──── */}
      <footer className="relative border-t border-zinc-200 dark:border-white/[0.04] bg-background px-6 py-10 z-10">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-8 mb-8">
            <div className="sm:col-span-2">
              <BrandLogo href="/" className="mb-3" />
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400 max-w-xs leading-relaxed">
                Plataforma IoT de grado industrial para la nutrición automatizada de mascotas. Desarrollado sobre microcontroladores ESP32 y protocolo MQTT.
              </p>
            </div>
            <div>
              <p className="text-[10px] text-zinc-500 dark:text-white/30 uppercase tracking-wider font-semibold mb-3">Producto</p>
              <div className="space-y-2">
                <Link href="/dashboard" className="block text-[11px] text-zinc-400 dark:text-white/20 hover:text-zinc-600 dark:text-white/50 transition-colors">Dashboard</Link>
                <a href="#precios" className="block text-[11px] text-zinc-400 dark:text-white/20 hover:text-zinc-600 dark:text-white/50 transition-colors">Precios</a>
                <a href="#funciones" className="block text-[11px] text-zinc-400 dark:text-white/20 hover:text-zinc-600 dark:text-white/50 transition-colors">Funciones</a>
              </div>
            </div>
            <div>
              <p className="text-[10px] text-zinc-500 dark:text-white/30 uppercase tracking-wider font-semibold mb-3">Cuenta</p>
              <div className="space-y-2">
                <Link href="/auth" className="block text-[11px] text-zinc-400 dark:text-white/20 hover:text-zinc-600 dark:text-white/50 transition-colors">Iniciar Sesión</Link>
                <Link href="/settings" className="block text-[11px] text-zinc-400 dark:text-white/20 hover:text-zinc-600 dark:text-white/50 transition-colors">Configuración</Link>
              </div>
            </div>
          </div>
          <div className="pt-6 border-t border-zinc-200 dark:border-white/[0.04] flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-[10px] text-zinc-400/40 dark:text-white/15">
              © 2026 PetFeeder Pro. Tecnología IoT para el bienestar animal.
            </p>
            <p className="text-[10px] text-white/10">
              Hecho con tecnología ESP32 + Next.js
            </p>
          </div>
        </div>
      </footer>

      {/* ──── Enterprise Demo Request Modal (Framer Motion AnimatePresence) ──── */}
      <AnimatePresence>
        {showDemoModal && (
          <div className="fixed inset-0 z-55 flex items-center justify-center px-4">
            {/* Dark blur backdrop */}
            <motion.div 
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowDemoModal(false)}
            />

            {/* Modal Body */}
            <motion.div 
              className="relative w-full max-w-md bg-[#0a0a0a] border border-white/10 rounded-2xl p-6 sm:p-8 shadow-2xl z-10 overflow-hidden"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", duration: 0.5 }}
            >
              <div className="absolute top-4 right-4">
                <button 
                  onClick={() => setShowDemoModal(false)}
                  className="p-1 rounded-md text-zinc-500 dark:text-white/30 hover:text-zinc-700 dark:text-white/60 hover:bg-white/5 transition-all cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                  <Building2 className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Solicitar Demo Corporativa</h3>
                  <p className="text-[10px] text-zinc-500 dark:text-white/40">Planes a gran escala para veterinarias y pet hotels</p>
                </div>
              </div>

              <AnimatePresence mode="wait">
                {demoSuccess ? (
                  <motion.div 
                    key="success"
                    className="text-center py-6 flex flex-col items-center justify-center"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <motion.div
                      className="w-12 h-12 rounded-full bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center text-emerald-400 mb-4"
                      animate={{ scale: [1, 1.15, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <Check className="h-6 w-6" strokeWidth={2.5} />
                    </motion.div>
                    <h4 className="text-sm font-bold text-white">¡Solicitud Enviada!</h4>
                    <p className="text-[11px] text-zinc-500 dark:text-white/40 mt-2 max-w-[240px] mx-auto">
                      Un asesor de Enterprise se pondrá en contacto a la dirección de correo proporcionada.
                    </p>
                  </motion.div>
                ) : (
                  <motion.form 
                    key="form"
                    onSubmit={handleDemoSubmit}
                    className="space-y-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500 dark:text-white/40 font-mono">Nombre</label>
                      <input 
                        type="text" 
                        required
                        placeholder="Ej. Juan Pérez"
                        value={demoName}
                        onChange={(e) => setDemoName(e.target.value)}
                        className="w-full bg-white/[0.02] border border-white/10 rounded-lg px-3.5 py-2 text-xs text-white placeholder-white/20 focus:outline-none focus:border-emerald-500/50 transition-colors"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500 dark:text-white/40 font-mono">Email Corporativo</label>
                      <input 
                        type="email" 
                        required
                        placeholder="ejemplo@empresa.com"
                        value={demoEmail}
                        onChange={(e) => setDemoEmail(e.target.value)}
                        className="w-full bg-white/[0.02] border border-white/10 rounded-lg px-3.5 py-2 text-xs text-white placeholder-white/20 focus:outline-none focus:border-emerald-500/50 transition-colors"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500 dark:text-white/40 font-mono">Tamaño de Operación</label>
                      <select 
                        className="w-full bg-white/[0.02] border border-white/10 rounded-lg px-3.5 py-2 text-xs text-zinc-700 dark:text-white/60 focus:outline-none focus:border-emerald-500/50 transition-colors"
                        defaultValue="1-5"
                      >
                        <option value="1-5" className="bg-[#0a0a0a]">1 - 5 dispositivos</option>
                        <option value="5-20" className="bg-[#0a0a0a]">5 - 20 dispositivos</option>
                        <option value="20+" className="bg-[#0a0a0a]">Más de 20 dispositivos</option>
                      </select>
                    </div>

                    <div className="pt-2">
                      <button 
                        type="submit"
                        className="w-full bg-emerald-500/10 border border-emerald-500/25 hover:bg-emerald-500/20 text-emerald-400 text-xs font-semibold py-3 rounded-lg transition-all duration-300 hover:shadow-[0_0_15px_rgba(16,185,129,0.1)] cursor-pointer"
                      >
                        Enviar Solicitud
                      </button>
                    </div>

                    <div className="flex items-center gap-1.5 text-[9px] text-zinc-400 dark:text-white/20 pt-1">
                      <Lock className="h-3 w-3" />
                      <span>Tus datos corporativos están cifrados y protegidos.</span>
                    </div>
                  </motion.form>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
