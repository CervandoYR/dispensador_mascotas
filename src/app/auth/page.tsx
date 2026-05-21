"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import {
  PawPrint,
  Mail,
  Lock,
  Cpu,
  User,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function AuthPage() {
  const router = useRouter();

  const [isRegister, setIsRegister] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [deviceId, setDeviceId] = useState("");

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    // ---------- validation ----------
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

    // Basic MAC format check
    const macRegex = /^([0-9A-Fa-f]{2}:){5}[0-9A-Fa-f]{2}$/;
    if (!macRegex.test(deviceId.trim())) {
      toast.error("El ID del dispositivo debe tener el formato AA:BB:CC:DD:EE:FF");
      return;
    }

    // ---------- submit ----------
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
    }, 1000);
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-slate-100 to-blue-50 px-4 py-12">
      {/* decorative blurred circles */}
      <div className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-blue-200/40 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-emerald-200/40 blur-3xl" />

      <Card className="relative z-10 w-full max-w-md border border-white/30 bg-white/80 shadow-2xl backdrop-blur-xl rounded-2xl ring-0">
        {/* ───── Header ───── */}
        <CardHeader className="items-center text-center pb-2">
          <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-emerald-500 shadow-lg shadow-blue-500/25">
            <PawPrint className="h-8 w-8 text-white" />
          </div>

          <CardTitle className="text-2xl font-bold tracking-tight text-slate-800">
            PetFeeder Pro
          </CardTitle>

          <CardDescription className="text-slate-500">
            Vincula tu dispositivo para comenzar
          </CardDescription>
        </CardHeader>

        {/* ───── Mode toggle ───── */}
        <CardContent className="pb-0">
          <div className="mb-6 flex rounded-xl bg-slate-100 p-1">
            <button
              type="button"
              onClick={() => setIsRegister(false)}
              className={`flex-1 rounded-lg py-2 text-sm font-medium transition-all duration-200 ${
                !isRegister
                  ? "bg-white text-slate-800 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              Iniciar Sesión
            </button>
            <button
              type="button"
              onClick={() => setIsRegister(true)}
              className={`flex-1 rounded-lg py-2 text-sm font-medium transition-all duration-200 ${
                isRegister
                  ? "bg-white text-slate-800 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              Registrarse
            </button>
          </div>

          {/* ───── Form ───── */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name (register only) */}
            <div
              className={`grid gap-1.5 overflow-hidden transition-all duration-300 ${
                isRegister
                  ? "grid-rows-[1fr] opacity-100"
                  : "grid-rows-[0fr] opacity-0"
              }`}
            >
              <div className="min-h-0">
                <Label htmlFor="name" className="mb-1.5 text-slate-700">
                  <User className="h-3.5 w-3.5 text-slate-400" />
                  Nombre completo
                </Label>
                <Input
                  id="name"
                  placeholder="Ej. Juan Pérez"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="h-10 rounded-xl border-slate-200 bg-white/60 placeholder:text-slate-400 focus-visible:border-blue-400 focus-visible:ring-blue-400/30"
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-slate-700">
                <Mail className="h-3.5 w-3.5 text-slate-400" />
                Correo electrónico
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="tu@correo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-10 rounded-xl border-slate-200 bg-white/60 placeholder:text-slate-400 focus-visible:border-blue-400 focus-visible:ring-blue-400/30"
              />
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-slate-700">
                <Lock className="h-3.5 w-3.5 text-slate-400" />
                Contraseña
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-10 rounded-xl border-slate-200 bg-white/60 placeholder:text-slate-400 focus-visible:border-blue-400 focus-visible:ring-blue-400/30"
              />
            </div>

            {/* Device ID */}
            <div className="space-y-1.5">
              <Label htmlFor="deviceId" className="text-slate-700">
                <Cpu className="h-3.5 w-3.5 text-slate-400" />
                ID del Dispositivo (MAC del ESP32)
              </Label>
              <Input
                id="deviceId"
                placeholder="AA:BB:CC:DD:EE:FF"
                value={deviceId}
                onChange={(e) => setDeviceId(e.target.value)}
                className="h-10 rounded-xl border-slate-200 bg-white/60 font-mono placeholder:text-slate-400 focus-visible:border-blue-400 focus-visible:ring-blue-400/30"
              />
              <p className="text-xs text-slate-400">
                Formato: AA:BB:CC:DD:EE:FF
              </p>
            </div>

            {/* Submit */}
            <Button
              type="submit"
              disabled={isLoading}
              className="h-11 w-full rounded-xl bg-gradient-to-r from-blue-500 to-emerald-500 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 transition-all duration-200 hover:from-blue-600 hover:to-emerald-600 hover:shadow-xl hover:shadow-blue-500/30 active:scale-[0.98] disabled:opacity-70"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Conectando…
                </>
              ) : (
                "Vincular y Entrar"
              )}
            </Button>
          </form>
        </CardContent>

        {/* ───── Footer ───── */}
        <CardFooter className="justify-center border-t-0 bg-transparent pt-4 pb-5">
          <p className="text-xs text-slate-400">
            Al continuar, aceptas nuestros{" "}
            <span className="cursor-pointer text-blue-500 underline underline-offset-2 hover:text-blue-600 transition-colors">
              Términos de Servicio
            </span>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
