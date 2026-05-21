"use client";

// ============================================================
// PetFeeder Pro — Settings Page
// ============================================================

import { useState, useEffect } from "react";
import Link from "next/link";
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
  const deviceInfoItems = [
    { label: "ID del Dispositivo", value: deviceId },
    { label: "Versión de Firmware", value: "v2.4.1" },
    { label: "Protocolo de Conexión", value: "MQTT over WebSocket" },
    { label: "Broker", value: "broker.hivemq.com" },
  ];

  // ── Render ──────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
        {/* ── Header ─────────────────────────────────────────── */}
        <div className="mb-8">
          <Link
            href="/dashboard"
            className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition-colors hover:text-slate-800"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver al panel
          </Link>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Configuración
          </h1>
          <p className="mt-1 text-slate-500">
            Ajusta las preferencias de tu dispensador inteligente
          </p>
        </div>

        <div className="space-y-6">
          {/* ── Telegram Notifications Card ───────────────────── */}
          <Card className="border-white/60 bg-white/70 shadow-lg backdrop-blur-xl">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                  <Bell className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle className="text-lg">
                    Notificaciones Telegram
                  </CardTitle>
                  <CardDescription>
                    Recibe alertas críticas directamente en tu Telegram
                  </CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-5">
              {/* Bot Token */}
              <div className="space-y-2">
                <Label htmlFor="bot-token" className="text-sm font-medium">
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
                  className="border-slate-200 bg-white/80 transition-shadow focus:shadow-md"
                />
              </div>

              {/* Chat ID */}
              <div className="space-y-2">
                <Label htmlFor="chat-id" className="text-sm font-medium">
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
                  className="border-slate-200 bg-white/80 transition-shadow focus:shadow-md"
                />
              </div>

              <Separator />

              {/* Enable toggle */}
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label
                    htmlFor="telegram-toggle"
                    className="text-sm font-medium"
                  >
                    Habilitar notificaciones
                  </Label>
                  <p className="text-xs text-slate-500">
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
                />
              </div>

              <Separator />

              {/* Action buttons */}
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button
                  onClick={handleSaveTelegram}
                  className="flex-1 bg-blue-600 text-white shadow-md transition-all hover:bg-blue-700 hover:shadow-lg"
                >
                  Guardar configuración
                </Button>
                <Button
                  variant="outline"
                  onClick={handleTestTelegram}
                  disabled={isSendingTest}
                  className="flex-1 border-blue-200 text-blue-700 transition-all hover:bg-blue-50"
                >
                  {isSendingTest ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="mr-2 h-4 w-4" />
                  )}
                  {isSendingTest
                    ? "Enviando…"
                    : "Enviar mensaje de prueba"}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* ── Hardware Configuration Card ───────────────────── */}
          <Card className="border-white/60 bg-white/70 shadow-lg backdrop-blur-xl">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-600">
                  <Cpu className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle className="text-lg">
                    Configuración del Hardware
                  </CardTitle>
                  <CardDescription>
                    Ajustes del dispensador ESP32
                  </CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent>
              <div className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/60 p-4 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-50 text-amber-500">
                    <Volume2 className="h-4 w-4" />
                  </div>
                  <div className="space-y-0.5">
                    <Label
                      htmlFor="buzzer-toggle"
                      className="text-sm font-medium"
                    >
                      Habilitar Aviso Sonoro (Buzzer)
                    </Label>
                    <p className="text-xs text-slate-500">
                      El dispositivo emitirá un sonido al dispensar comida
                    </p>
                  </div>
                </div>
                <Switch
                  id="buzzer-toggle"
                  checked={buzzerEnabled}
                  onCheckedChange={handleBuzzerToggle}
                />
              </div>
            </CardContent>
          </Card>

          {/* ── Device Info Card ──────────────────────────────── */}
          <Card className="border-white/60 bg-white/70 shadow-lg backdrop-blur-xl">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
                  <Info className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle className="text-lg">
                    Información del Dispositivo
                  </CardTitle>
                  <CardDescription>
                    Detalles técnicos y estado del sistema
                  </CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent>
              <div className="divide-y divide-slate-100 rounded-xl border border-slate-100 bg-slate-50/60">
                {deviceInfoItems.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between px-4 py-3"
                  >
                    <span className="text-sm text-slate-500">{item.label}</span>
                    <span className="text-sm font-medium text-slate-800">
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ── Footer ─────────────────────────────────────────── */}
        <p className="mt-8 text-center text-xs text-slate-400">
          PetFeeder Pro v2.4.1 · Hecho con 🐾 para tu mascota
        </p>
      </div>
    </div>
  );
}
