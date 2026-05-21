"use client";

import { useState, useEffect } from "react";
import { useMQTT } from "@/hooks/useMQTT";
import { toast } from "sonner";
import type { ScheduleEntry } from "@/types";

import Navbar from "@/components/layout/Navbar";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import FoodLevelCard from "@/components/dashboard/FoodLevelCard";
import QuickActionCard from "@/components/dashboard/QuickActionCard";
import ScheduleCard from "@/components/dashboard/ScheduleCard";
import AnalyticsCard from "@/components/dashboard/AnalyticsCard";

/** Default schedules for first-time users */
const DEFAULT_SCHEDULES: ScheduleEntry[] = [
  {
    id: "1",
    time: "08:00",
    days: ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"],
    enabled: true,
    portions: 2,
  },
  {
    id: "2",
    time: "13:00",
    days: ["Lun", "Mar", "Mié", "Jue", "Vie"],
    enabled: true,
    portions: 1,
  },
  {
    id: "3",
    time: "20:00",
    days: ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"],
    enabled: true,
    portions: 2,
  },
];

export default function DashboardPage() {
  const { isConnected, deviceState, isDispensing, lastMessage, dispense, publish, timeOffsetMinutes } = useMQTT();
  const [modoFiesta, setModoFiesta] = useState(false);
  const [schedules, setSchedules] = useState<ScheduleEntry[]>([]);

  // Load schedules from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("petfeeder_schedules");
    if (stored) {
      try {
        setSchedules(JSON.parse(stored));
      } catch {
        setSchedules(DEFAULT_SCHEDULES);
      }
    } else {
      setSchedules(DEFAULT_SCHEDULES);
    }
  }, []);

  // ──────────────────────────────────────────────────────
  // FLUJO REACTIVO: mostrar toast SOLO cuando el ESP32
  // envía un payload con "mensaje" — esto confirma que
  // la acción mecánica finalizó en el hardware.
  // ──────────────────────────────────────────────────────
  useEffect(() => {
    if (!lastMessage) return;

    const isError =
      lastMessage.toLowerCase().includes("alerta") ||
      lastMessage.toLowerCase().includes("error") ||
      lastMessage.toLowerCase().includes("atasco") ||
      lastMessage.toLowerCase().includes("crítica");

    if (isError) {
      toast.error("⚠️ Alerta del Dispositivo", {
        description: lastMessage,
        duration: 8000,
      });
    } else {
      toast.success("✅ Confirmación del ESP32", {
        description: lastMessage,
        duration: 5000,
      });
    }
  }, [lastMessage]);

  // ──────────────────────────────────────────────────────
  // COMPENSACIÓN DINÁMICA: traduce hora real de la UI a
  // la línea temporal del ESP32 restando el offset.
  // Soporta wrap-around de 24h (ej. 00:10 - 15min = 23:55)
  // ──────────────────────────────────────────────────────
  const translateTimeForESP32 = (time: string): string => {
    const [h, m] = time.split(":").map(Number);
    let totalMinutes = h * 60 + m - timeOffsetMinutes;

    // Wrap-around: manejar cruces de medianoche
    if (totalMinutes < 0) totalMinutes += 1440; // 24 * 60
    if (totalMinutes >= 1440) totalMinutes -= 1440;

    const newH = Math.floor(totalMinutes / 60);
    const newM = totalMinutes % 60;
    return `${String(newH).padStart(2, "0")}:${String(newM).padStart(2, "0")}`;
  };

  // ──────────────────────────────────────────────────────
  // SINCRONIZACIÓN: Al modificar horarios, se guarda en
  // localStorage Y se publica por MQTT al ESP32 con las
  // horas TRADUCIDAS al reloj interno del hardware.
  // ──────────────────────────────────────────────────────
  const handleScheduleUpdate = (updated: ScheduleEntry[]) => {
    setSchedules(updated);
    localStorage.setItem("petfeeder_schedules", JSON.stringify(updated));

    // Extraer horas habilitadas y traducirlas al reloj del ESP32
    const translatedTimes = updated
      .filter((s) => s.enabled)
      .map((s) => translateTimeForESP32(s.time));

    // Publicar al ESP32 con horas compensadas
    publish("utp/petfeeder/comando", {
      action: "update_schedule",
      schedule: translatedTimes,
    });

    if (timeOffsetMinutes !== 0) {
      toast.success("Programación enviada con compensación de desfase", {
        description: `Offset aplicado: ${timeOffsetMinutes > 0 ? "+" : ""}${timeOffsetMinutes} min`,
      });
    } else {
      toast.success("Programación actualizada y enviada al dispositivo");
    }
  };

  // Handle dispense action — solo publica el comando
  // La confirmación llega por MQTT vía lastMessage
  const handleDispense = () => {
    dispense(modoFiesta);
    toast("🍽️ Comando enviado al dispensador...", {
      description: "Esperando confirmación del hardware",
    });
  };

  // Handle modo fiesta toggle
  const handleToggleModoFiesta = (enabled: boolean) => {
    setModoFiesta(enabled);
    toast(
      enabled ? "🎉 Modo Fiesta activado" : "Modo Fiesta desactivado",
      {
        description: enabled
          ? "Los bloqueos de tiempo han sido desactivados"
          : "Los bloqueos de tiempo están activos nuevamente",
      }
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-emerald-50/20">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* Row 1: Full-width header */}
          <div className="col-span-1 md:col-span-2 lg:col-span-3">
            <DashboardHeader
              isConnected={isConnected}
              deviceOnline={deviceState.estado === "online"}
            />
          </div>

          {/* Row 2: Food Level + Quick Action */}
          <FoodLevelCard
            level={deviceState.nivel_comida}
            lastDispensed={deviceState.ultimo_dispensado}
            hasJam={deviceState.atasco}
          />
          <QuickActionCard
            isDispensing={isDispensing}
            modoFiesta={modoFiesta}
            onDispense={handleDispense}
            onToggleModoFiesta={handleToggleModoFiesta}
          />

          {/* Row 2 continued / Row 3: Schedule */}
          <ScheduleCard
            schedules={schedules}
            onUpdate={handleScheduleUpdate}
            timeOffsetMinutes={timeOffsetMinutes}
          />

          {/* Row 3: Analytics — spans 2 columns on larger screens */}
          <div className="md:col-span-2 lg:col-span-3">
            <AnalyticsCard
              foodLevel={deviceState.nivel_comida}
              dailyAvgPortions={3}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
