"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Bell,
  Cpu,
  Info,
  ArrowLeft,
  Loader2,
  Send,
  Volume2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import type { UserProfile, TelegramSettings } from "@/types";

export default function SettingsPage() {
  // ── Telegram state ──────────────────────────────────────────
  const [telegramSettings, setTelegramSettings] = useState<TelegramSettings>({
    botToken: "",
    chatId: "",
    enabled: false,
  });
  const [isSendingTest, setIsSendingTest] = useState(false);

  // ── Hardware state ──────────────────────────────────────────
  const [buzzerEnabled, setBuzzerEnabled] = useState(true);

  // ── Device info state ───────────────────────────────────────
  const [deviceId, setDeviceId] = useState("—");
  const [advancedMode, setAdvancedMode] = useState(false);

  // ── Load saved settings on mount ────────────────────────────
  useEffect(() => {
    try {
      const savedTelegram = localStorage.getItem("petfeeder_telegram");
      if (savedTelegram) {
        const parsed: TelegramSettings = JSON.parse(savedTelegram);
        setTelegramSettings(parsed);
      }

      const savedBuzzer = localStorage.getItem("petfeeder_buzzer");
      if (savedBuzzer !== null) {
        setBuzzerEnabled(JSON.parse(savedBuzzer));
      }

      const savedUser = localStorage.getItem("petfeeder_user");
      if (savedUser) {
        const user: UserProfile = JSON.parse(savedUser);
        setDeviceId(user.deviceId || "—");
      }
    } catch {
      // Gracefully ignore corrupt localStorage data
    }
  }, []);

  // ── Telegram handlers ───────────────────────────────────────
  function handleSaveTelegram() {
    localStorage.setItem(
      "petfeeder_telegram",
      JSON.stringify(telegramSettings)
    );
    toast.success("Configuración de Telegram guardada", {
      description: "Los ajustes se han almacenado correctamente.",
    });
  }

  async function handleTestTelegram() {
    if (!telegramSettings.botToken || !telegramSettings.chatId) {
      toast.error("Campos incompletos", {
        description:
          "Ingresa el Token del Bot y el Chat ID antes de enviar una prueba.",
      });
      return;
    }

    setIsSendingTest(true);

    try {
      const res = await fetch("/api/telegram", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          botToken: telegramSettings.botToken,
          chatId: telegramSettings.chatId,
          message:
            "✅ Conexión exitosa. Las alertas de PetFeeder Pro llegarán aquí.",
        }),
      });

      const data = await res.json();

      if (data.success) {
        toast.success("Mensaje enviado", {
          description: "Revisa tu Telegram para confirmar la recepción.",
        });
      } else {
        toast.error("Error al enviar", {
          description: data.error || "No se pudo enviar el mensaje de prueba.",
        });
      }
    } catch {
      toast.error("Error de conexión", {
        description: "No se pudo contactar al servidor. Intenta más tarde.",
      });
    } finally {
      setIsSendingTest(false);
    }
  }

  // ── Hardware handlers ───────────────────────────────────────
  function handleBuzzerToggle(checked: boolean) {
    setBuzzerEnabled(checked);
    localStorage.setItem("petfeeder_buzzer", JSON.stringify(checked));
    toast.success(checked ? "Buzzer activado" : "Buzzer desactivado", {
      description: checked
        ? "El dispensador emitirá un sonido al dispensar."
        : "El dispensador operará en modo silencioso.",
    });
  }

  // ── Device info items ───────────────────────────────────────
  const deviceInfoItems = advancedMode
    ? [
        { label: "ID del Dispositivo (MAC)", value: deviceId },
        { label: "Versión de Firmware", value: "v2.4.1" },
        { label: "Protocolo de Conexión", value: "MQTT over WebSocket" },
        { label: "Broker MQTT", value: "broker.hivemq.com" },
      ]
    : [
        { label: "Código de Vinculación", value: deviceId },
        { label: "Estado del Sistema", value: "Actualizado" },
        { label: "Conexión", value: "En línea (Segura)" },
      ];

  return (
    <div className="relative min-h-screen bg-background text-foreground transition-colors duration-300 py-8">
      {/* Malla decorativa de fondo */}
      <div className="absolute inset-0 grid-bg pointer-events-none z-0" />

      <div className="relative z-10 mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
        
        {/* ── Header ─────────────────────────────────────────── */}
        <div className="mb-8">
          <Link href="/dashboard" passHref legacyBehavior>
            <motion.a
              className="mb-4 inline-flex items-center gap-2 text-xs font-semibold text-zinc-500 hover:text-zinc-900 dark:text-white/40 dark:hover:text-white/80 transition-colors cursor-pointer"
              whileHover={{ x: -3 }}
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Volver al panel
            </motion.a>
          </Link>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-800 dark:text-white/95">
            Configuración
          </h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
            Ajusta las preferencias de tu dispensador inteligente PetFeeder Pro
          </p>
        </div>

        <div className="space-y-6">
          {/* ── Telegram Notifications Card ───────────────────── */}
          <Card className="glass-card border border-zinc-200 dark:border-white/[0.06] bg-white/70 dark:bg-white/[0.02] backdrop-blur-xl shadow-lg rounded-2xl overflow-hidden relative">
            <CardHeader className="pb-3 pt-5">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 dark:text-emerald-400">
                  <Bell className="h-4.5 w-4.5" strokeWidth={1.5} />
                </div>
                <div>
                  <CardTitle className="text-sm font-bold text-zinc-800 dark:text-white/95">
                    Notificaciones Telegram
                  </CardTitle>
                  <CardDescription className="text-xs text-zinc-500 dark:text-zinc-400">
                    Recibe alertas críticas de alimentación y atascos directamente en tu Telegram
                  </CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Bot Token */}
              <div className="space-y-1.5">
                <Label htmlFor="bot-token" className="text-xs font-medium text-zinc-650 dark:text-zinc-400">
                  Token del Bot
                </Label>
                <Input
                  id="bot-token"
                  type="text"
                  placeholder="123456789:ABCDefGhIJKlmnOPQRstUVWxyz"
                  value={telegramSettings.botToken}
                  onChange={(e) =>
                    setTelegramSettings((prev) => ({
                      ...prev,
                      botToken: e.target.value,
                    }))
                  }
                  className="h-9 rounded-lg border-zinc-200 dark:border-white/[0.06] bg-zinc-50/50 dark:bg-white/[0.02] text-zinc-800 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus-visible:border-emerald-500 focus-visible:ring-emerald-500/20 text-xs"
                />
              </div>

              {/* Chat ID */}
              <div className="space-y-1.5">
                <Label htmlFor="chat-id" className="text-xs font-medium text-zinc-650 dark:text-zinc-400">
                  Chat ID
                </Label>
                <Input
                  id="chat-id"
                  type="text"
                  placeholder="-1001234567890"
                  value={telegramSettings.chatId}
                  onChange={(e) =>
                    setTelegramSettings((prev) => ({
                      ...prev,
                      chatId: e.target.value,
                    }))
                  }
                  className="h-9 rounded-lg border-zinc-200 dark:border-white/[0.06] bg-zinc-50/50 dark:bg-white/[0.02] text-zinc-800 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus-visible:border-emerald-500 focus-visible:ring-emerald-500/20 text-xs"
                />
              </div>

              <Separator className="bg-zinc-200 dark:bg-white/[0.04]" />

              {/* Enable toggle */}
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label
                    htmlFor="telegram-toggle"
                    className="text-xs font-semibold text-zinc-800 dark:text-white/90"
                  >
                    Habilitar notificaciones
                  </Label>
                  <p className="text-[10px] text-zinc-450 dark:text-zinc-500">
                    Activa o desactiva el envío de alertas
                  </p>
                </div>
                <Switch
                  id="telegram-toggle"
                  checked={telegramSettings.enabled}
                  onCheckedChange={(checked) =>
                    setTelegramSettings((prev) => ({
                      ...prev,
                      enabled: checked,
                    }))
                  }
                  className="cursor-pointer"
                />
              </div>

              <Separator className="bg-zinc-200 dark:bg-white/[0.04]" />

              {/* Action buttons */}
              <div className="flex flex-col gap-3 sm:flex-row pt-1">
                <motion.button
                  onClick={handleSaveTelegram}
                  className="flex-1 h-9 rounded-lg bg-emerald-500 text-white dark:bg-emerald-500/10 border border-emerald-500/20 dark:text-emerald-400 font-semibold text-xs flex items-center justify-center gap-1.5 hover:bg-emerald-600 dark:hover:bg-emerald-500/15 cursor-pointer transition-all duration-200 shadow-md shadow-emerald-500/10 dark:shadow-none"
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Guardar configuración
                </motion.button>
                <motion.button
                  onClick={handleTestTelegram}
                  disabled={isSendingTest}
                  className="flex-1 h-9 rounded-lg border border-zinc-200 dark:border-white/[0.06] text-zinc-600 hover:bg-zinc-50 hover:text-zinc-800 dark:text-white/60 dark:hover:bg-white/[0.04] dark:hover:text-white/80 font-semibold text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-all duration-200 disabled:opacity-50"
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {isSendingTest ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Send className="h-3.5 w-3.5" strokeWidth={1.5} />
                  )}
                  {isSendingTest ? "Enviando…" : "Enviar mensaje de prueba"}
                </motion.button>
              </div>
            </CardContent>
          </Card>

          {/* ── Hardware Configuration Card ───────────────────── */}
          <Card className="glass-card border border-zinc-200 dark:border-white/[0.06] bg-white/70 dark:bg-white/[0.02] backdrop-blur-xl shadow-lg rounded-2xl overflow-hidden relative">
            <CardHeader className="pb-3 pt-5">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 dark:text-emerald-400">
                  <Cpu className="h-4.5 w-4.5" strokeWidth={1.5} />
                </div>
                <div>
                  <CardTitle className="text-sm font-bold text-zinc-800 dark:text-white/95">
                    Configuración del Hardware
                  </CardTitle>
                  <CardDescription className="text-xs text-zinc-500 dark:text-zinc-400">
                    Ajustes de alertas de zumbador físico
                  </CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent>
              <div className="flex items-center justify-between rounded-xl border border-zinc-150 dark:border-white/[0.02] bg-zinc-50/50 dark:bg-white/[0.02] p-4 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-500 dark:text-emerald-400">
                    <Volume2 className="h-4.5 w-4.5" strokeWidth={1.5} />
                  </div>
                  <div className="space-y-0.5">
                    <Label
                      htmlFor="buzzer-toggle"
                      className="text-xs font-semibold text-zinc-800 dark:text-white/90 flex items-center"
                    >
                      Habilitar Aviso Sonoro (Buzzer)
                    </Label>
                    <p className="text-[10px] text-zinc-450 dark:text-zinc-500">
                      El dispositivo emitirá un sonido al dispensar comida
                    </p>
                  </div>
                </div>
                <Switch
                  id="buzzer-toggle"
                  checked={buzzerEnabled}
                  onCheckedChange={handleBuzzerToggle}
                  className="cursor-pointer"
                />
              </div>
            </CardContent>
          </Card>

          {/* ── Device Info Card ──────────────────────────────── */}
          <Card className="glass-card border border-zinc-200 dark:border-white/[0.06] bg-white/70 dark:bg-white/[0.02] backdrop-blur-xl shadow-lg rounded-2xl overflow-hidden relative">
            <CardHeader className="pb-3 pt-5">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 dark:text-emerald-400">
                  <Info className="h-4.5 w-4.5" strokeWidth={1.5} />
                </div>
                <div className="flex-1">
                  <CardTitle className="text-sm font-bold text-zinc-800 dark:text-white/95">
                    Información del Dispositivo
                  </CardTitle>
                  <CardDescription className="text-xs text-zinc-500 dark:text-zinc-400">
                    Detalles y estado del sistema
                  </CardDescription>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <Label htmlFor="advanced-mode" className="text-[9px] text-zinc-500 cursor-pointer">Modo Avanzado</Label>
                  <Switch 
                    id="advanced-mode" 
                    checked={advancedMode} 
                    onCheckedChange={setAdvancedMode} 
                    className="scale-75 origin-right cursor-pointer" 
                  />
                </div>
              </div>
            </CardHeader>

            <CardContent>
              <div className="divide-y divide-zinc-200/50 dark:divide-white/[0.04] rounded-xl border border-zinc-200 dark:border-white/[0.06] bg-zinc-50/30 dark:bg-white/[0.01] overflow-hidden">
                {deviceInfoItems.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between px-4 py-2.5 transition-colors"
                  >
                    <span className="text-xs text-zinc-500 dark:text-zinc-500">{item.label}</span>
                    <span className="text-xs font-semibold text-zinc-700 dark:text-white/80 font-mono">
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ── Footer ─────────────────────────────────────────── */}
        <p className="mt-8 text-center text-[10px] text-zinc-400 dark:text-zinc-500 font-mono">
          PetFeeder Pro
        </p>
      </div>
    </div>
  );
}
