import {
  ShieldCheck,
  Wifi,
  Gauge,
  TrendingUp,
  ArrowRight,
  Zap,
  Clock,
  BarChart3,
  PawPrint,
} from "lucide-react";

const features = [
  {
    icon: ShieldCheck,
    title: "Prevención de Atascos",
    description:
      "Sistema inteligente de detección y prevención de atascos con sensores de proximidad.",
    color: "bg-emerald-500",
    lightColor: "bg-emerald-50",
    textColor: "text-emerald-600",
  },
  {
    icon: Wifi,
    title: "Control Remoto MQTT",
    description:
      "Controla el dispensador desde cualquier lugar mediante protocolo MQTT en tiempo real.",
    color: "bg-blue-500",
    lightColor: "bg-blue-50",
    textColor: "text-blue-600",
  },
  {
    icon: Gauge,
    title: "Sensores Ultrasónicos",
    description:
      "Monitoreo preciso del nivel de comida con sensores ultrasónicos de alta precisión.",
    color: "bg-amber-500",
    lightColor: "bg-amber-50",
    textColor: "text-amber-600",
  },
  {
    icon: TrendingUp,
    title: "Analítica Predictiva",
    description:
      "Algoritmos que predicen cuándo se agotará la comida y te alertan con anticipación.",
    color: "bg-purple-500",
    lightColor: "bg-purple-50",
    textColor: "text-purple-600",
  },
];

const steps = [
  {
    number: "01",
    icon: Zap,
    title: "Conecta",
    description: "Vincula tu ESP32 con tu cuenta",
  },
  {
    number: "02",
    icon: Clock,
    title: "Programa",
    description: "Configura horarios y porciones",
  },
  {
    number: "03",
    icon: BarChart3,
    title: "Monitorea",
    description: "Recibe alertas y analíticas en tiempo real",
  },
];

export default function Home() {
  return (
    <div className="flex flex-col min-h-full">
      {/* ───────────────── Hero Section ───────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-500 to-emerald-500 text-white">
        {/* Floating decorative shapes */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
        >
          {/* Large blurred circle top-right */}
          <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-white/10 blur-3xl animate-[pulse_6s_ease-in-out_infinite]" />
          {/* Medium circle bottom-left */}
          <div className="absolute -bottom-16 -left-16 h-72 w-72 rounded-full bg-emerald-400/20 blur-2xl animate-[pulse_8s_ease-in-out_infinite_1s]" />

          {/* Floating dots */}
          <div className="absolute top-[15%] left-[10%] h-3 w-3 rounded-full bg-white/30 animate-[bounce_3s_ease-in-out_infinite]" />
          <div className="absolute top-[25%] right-[15%] h-2 w-2 rounded-full bg-white/25 animate-[bounce_4s_ease-in-out_infinite_0.5s]" />
          <div className="absolute bottom-[30%] left-[25%] h-2.5 w-2.5 rounded-full bg-white/20 animate-[bounce_3.5s_ease-in-out_infinite_1s]" />
          <div className="absolute top-[60%] right-[30%] h-2 w-2 rounded-full bg-emerald-300/30 animate-[bounce_5s_ease-in-out_infinite_0.8s]" />
          <div className="absolute top-[40%] left-[50%] h-1.5 w-1.5 rounded-full bg-white/20 animate-[bounce_4.5s_ease-in-out_infinite_1.5s]" />
          <div className="absolute bottom-[20%] right-[10%] h-3 w-3 rounded-full bg-emerald-200/20 animate-[bounce_3.8s_ease-in-out_infinite_0.3s]" />

          {/* Decorative ring */}
          <div className="absolute top-[20%] right-[20%] h-32 w-32 rounded-full border border-white/10 animate-[spin_25s_linear_infinite]" />
          <div className="absolute bottom-[25%] left-[15%] h-20 w-20 rounded-full border border-white/10 animate-[spin_18s_linear_infinite_reverse]" />
        </div>

        <div className="relative mx-auto max-w-6xl px-6 py-28 sm:py-36 lg:py-44">
          <div className="flex flex-col items-center text-center">
            {/* Branding badge */}
            <div className="mb-8 inline-flex items-center gap-2 rounded-full bg-white/15 px-5 py-2.5 text-sm font-medium backdrop-blur-sm border border-white/20">
              <PawPrint className="h-4 w-4" />
              <span>PetFeeder Pro</span>
            </div>

            {/* Decorative pet bowl SVG */}
            <div className="mb-8">
              <svg
                width="80"
                height="80"
                viewBox="0 0 80 80"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="drop-shadow-lg"
                aria-hidden="true"
              >
                {/* Bowl body */}
                <ellipse cx="40" cy="52" rx="34" ry="14" fill="white" fillOpacity="0.25" />
                <path
                  d="M10 42 C10 42 14 60 40 60 C66 60 70 42 70 42 L68 48 C68 48 62 64 40 64 C18 64 12 48 12 48 Z"
                  fill="white"
                  fillOpacity="0.35"
                />
                <ellipse cx="40" cy="42" rx="30" ry="10" fill="white" fillOpacity="0.5" />
                {/* Kibble pieces */}
                <circle cx="32" cy="40" r="3" fill="white" fillOpacity="0.7" />
                <circle cx="42" cy="38" r="2.5" fill="white" fillOpacity="0.6" />
                <circle cx="50" cy="41" r="2.8" fill="white" fillOpacity="0.65" />
                <circle cx="37" cy="36" r="2" fill="white" fillOpacity="0.55" />
                {/* Paw prints above */}
                <circle cx="24" cy="22" r="2.5" fill="white" fillOpacity="0.3" />
                <circle cx="20" cy="17" r="1.5" fill="white" fillOpacity="0.3" />
                <circle cx="28" cy="17" r="1.5" fill="white" fillOpacity="0.3" />
                <circle cx="22" cy="14" r="1.2" fill="white" fillOpacity="0.3" />
                <circle cx="26" cy="14" r="1.2" fill="white" fillOpacity="0.3" />
                <circle cx="56" cy="24" r="2.5" fill="white" fillOpacity="0.25" />
                <circle cx="52" cy="19" r="1.5" fill="white" fillOpacity="0.25" />
                <circle cx="60" cy="19" r="1.5" fill="white" fillOpacity="0.25" />
                <circle cx="54" cy="16" r="1.2" fill="white" fillOpacity="0.25" />
                <circle cx="58" cy="16" r="1.2" fill="white" fillOpacity="0.25" />
              </svg>
            </div>

            {/* Hero title */}
            <h1 className="max-w-4xl text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              Alimentación inteligente para tu mascota, estés donde estés
            </h1>

            {/* Subtitle */}
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/80 sm:text-xl">
              PetFeeder Pro te permite controlar, programar y monitorear la
              alimentación de tu mascota desde cualquier lugar del mundo.
              Tecnología IoT con ESP32.
            </p>

            {/* CTA */}
            <a
              href="/auth"
              className="group mt-10 inline-flex items-center gap-2.5 rounded-full bg-white px-8 py-4 text-base font-semibold text-blue-600 shadow-lg shadow-black/10 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-black/15 active:scale-[0.98]"
            >
              Comenzar Ahora
              <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
            </a>

            {/* Trust line */}
            <p className="mt-8 text-sm text-white/50">
              Sin tarjeta de crédito · Configuración en 5 minutos
            </p>
          </div>
        </div>

        {/* Bottom wave divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg
            viewBox="0 0 1440 80"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
            className="block h-12 w-full sm:h-16 lg:h-20"
          >
            <path
              d="M0 40 C360 80 720 0 1080 40 C1260 60 1380 50 1440 40 L1440 80 L0 80 Z"
              fill="white"
            />
          </svg>
        </div>
      </section>

      {/* ───────────────── Features Section ───────────────── */}
      <section className="bg-white px-6 py-20 sm:py-28">
        <div className="mx-auto max-w-6xl">
          {/* Section header */}
          <div className="text-center">
            <span className="inline-block rounded-full bg-blue-50 px-4 py-1.5 text-sm font-semibold text-blue-600">
              Características
            </span>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl">
              ¿Por qué PetFeeder Pro?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-zinc-500">
              Tecnología de vanguardia diseñada para el bienestar de tu mascota
              y tu tranquilidad.
            </p>
          </div>

          {/* Feature cards grid */}
          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="group relative rounded-2xl border border-white/20 bg-white/70 p-8 shadow-xl backdrop-blur-xl transition-all duration-300 hover:scale-[1.03] hover:-translate-y-1 hover:shadow-2xl"
                >
                  {/* Subtle gradient overlay on hover */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-transparent to-zinc-50/50 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                  <div className="relative">
                    {/* Icon circle */}
                    <div
                      className={`mb-5 inline-flex h-14 w-14 items-center justify-center rounded-xl ${feature.color} shadow-lg`}
                    >
                      <Icon className="h-7 w-7 text-white" />
                    </div>

                    {/* Title */}
                    <h3 className="mb-2 text-lg font-bold text-zinc-900">
                      {feature.title}
                    </h3>

                    {/* Description */}
                    <p className="text-sm leading-relaxed text-zinc-500">
                      {feature.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ───────────────── How It Works Section ───────────────── */}
      <section className="bg-zinc-50 px-6 py-20 sm:py-28">
        <div className="mx-auto max-w-5xl">
          {/* Section header */}
          <div className="text-center">
            <span className="inline-block rounded-full bg-emerald-50 px-4 py-1.5 text-sm font-semibold text-emerald-600">
              Fácil de usar
            </span>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl">
              ¿Cómo funciona?
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-lg text-zinc-500">
              Tres simples pasos para comenzar a cuidar a tu mascota de forma
              inteligente.
            </p>
          </div>

          {/* Steps */}
          <div className="mt-16 grid gap-8 sm:grid-cols-3">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.title}
                  className="relative text-center"
                >
                  {/* Connector line (hidden on first card & mobile) */}
                  {index < steps.length - 1 && (
                    <div className="absolute top-10 left-[calc(50%+40px)] hidden h-0.5 w-[calc(100%-80px)] bg-gradient-to-r from-emerald-300 to-blue-300 sm:block" />
                  )}

                  {/* Step number circle */}
                  <div className="relative mx-auto mb-6 flex h-20 w-20 items-center justify-center">
                    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-500 to-emerald-500 opacity-10" />
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-lg border border-zinc-100">
                      <Icon className="h-7 w-7 text-blue-600" />
                    </div>
                    {/* Step number badge */}
                    <span className="absolute -top-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-emerald-500 text-xs font-bold text-white shadow-md">
                      {step.number}
                    </span>
                  </div>

                  {/* Step title */}
                  <h3 className="mb-2 text-xl font-bold text-zinc-900">
                    {step.title}
                  </h3>

                  {/* Step description */}
                  <p className="text-sm text-zinc-500 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Secondary CTA */}
          <div className="mt-16 text-center">
            <a
              href="/auth"
              className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-600 to-emerald-500 px-8 py-4 text-base font-semibold text-white shadow-lg shadow-blue-500/25 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-blue-500/30 active:scale-[0.98]"
            >
              Comenzar Gratis
              <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
            </a>
          </div>
        </div>
      </section>

      {/* ───────────────── Footer ───────────────── */}
      <footer className="border-t border-zinc-100 bg-white px-6 py-10">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 sm:flex-row sm:justify-between">
          {/* Brand + copyright */}
          <div className="flex items-center gap-2 text-sm text-zinc-500">
            <PawPrint className="h-4 w-4 text-emerald-500" />
            <span>
              © 2026 PetFeeder Pro. Tecnología IoT para el bienestar animal.
            </span>
          </div>

          {/* Links */}
          <nav className="flex items-center gap-6 text-sm font-medium">
            <a
              href="/dashboard"
              className="text-zinc-500 transition-colors hover:text-blue-600"
            >
              Dashboard
            </a>
            <a
              href="/settings"
              className="text-zinc-500 transition-colors hover:text-blue-600"
            >
              Configuración
            </a>
            <a
              href="/auth"
              className="text-zinc-500 transition-colors hover:text-blue-600"
            >
              Iniciar Sesión
            </a>
          </nav>
        </div>
      </footer>
    </div>
  );
}
