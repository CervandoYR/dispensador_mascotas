"use client";

import { useState, useEffect } from "react";
import { useMQTT } from "@/hooks/useMQTT";
import { toast } from "sonner";
import type { ScheduleEntry } from "@/types";

import Navbar from "@/components/layout/Navbar";
import NetworkStatusHeader from "@/components/dashboard/NetworkStatusHeader";
import CamStreamCard from "@/components/dashboard/CamStreamCard";
import SmartDispenseCard from "@/components/dashboard/SmartDispenseCard";
import NutritionAnalyticsCard from "@/components/dashboard/NutritionAnalyticsCard";
import PetIdentityCard from "@/components/dashboard/PetIdentityCard";
import FoodLevelCard from "@/components/dashboard/FoodLevelCard";
import ScheduleCard from "@/components/dashboard/ScheduleCard";
import MascotBuddy from "@/components/dashboard/MascotBuddy";
import SoundboardCard from "@/components/dashboard/SoundboardCard";
import DeviceLocationCard from "@/components/dashboard/DeviceLocationCard";
import HumanMachinePulse from "@/components/dashboard/HumanMachinePulse";
import { MQTT_CONFIG } from "@/lib/mqtt-config";

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
  const {
    isConnected,
    deviceState,
    isDispensing,
    lastMessage,
    dispense,
    publish,
    timeOffsetMinutes,
  } = useMQTT();
  const [modoFiesta, setModoFiesta] = useState(false);
  const [schedules, setSchedules] = useState<ScheduleEntry[]>([]);

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

  useEffect(() => {
    if (!lastMessage) return;

    const isError =
      lastMessage.toLowerCase().includes("alerta") ||
      lastMessage.toLowerCase().includes("error") ||
      lastMessage.toLowerCase().includes("atasco") ||
      lastMessage.toLowerCase().includes("crítica");

    if (isError) {
      toast.error("Alerta del Dispositivo", {
        description: lastMessage,
        duration: 8000,
      });
    } else {
      toast.success("Confirmación del ESP32", {
        description: lastMessage,
        duration: 5000,
      });
    }
  }, [lastMessage]);

  const translateTimeForESP32 = (time: string): string => {
    const [h, m] = time.split(":").map(Number);
    let totalMinutes = h * 60 + m - timeOffsetMinutes;
    if (totalMinutes < 0) totalMinutes += 1440;
    if (totalMinutes >= 1440) totalMinutes -= 1440;
    const newH = Math.floor(totalMinutes / 60);
    const newM = totalMinutes % 60;
    return `${String(newH).padStart(2, "0")}:${String(newM).padStart(2, "0")}`;
  };

  const handleScheduleUpdate = (updated: ScheduleEntry[]) => {
    setSchedules(updated);
    localStorage.setItem("petfeeder_schedules", JSON.stringify(updated));

    const translatedTimes = updated
      .filter((s) => s.enabled)
      .map((s) => translateTimeForESP32(s.time));

    publish("utp/petfeeder/comando", {
      action: "update_schedule",
      schedule: translatedTimes,
    });

    if (timeOffsetMinutes !== 0) {
      toast.success("Programación sincronizada con compensación", {
        description: `Offset aplicado: ${timeOffsetMinutes > 0 ? "+" : ""}${timeOffsetMinutes}min`,
      });
    } else {
      toast.success("Programación actualizada y enviada al dispositivo");
    }
  };

  const handleDispense = () => {
    dispense(modoFiesta);
    toast("Comando enviado al dispensador", {
      description: "Esperando confirmación del hardware",
    });
  };

  const handleToggleModoFiesta = (enabled: boolean) => {
    setModoFiesta(enabled);
    toast(enabled ? "Modo Fiesta activado" : "Modo Fiesta desactivado", {
      description: enabled
        ? "Los bloqueos de tiempo han sido desactivados"
        : "Los bloqueos de tiempo están activos nuevamente",
    });
  };

  const handlePublishSound = (soundName: string) => {
    publish(MQTT_CONFIG.topics.command, {
      action: "play_sound",
      sound: soundName,
    });
  };

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300 relative">
      <div className="absolute inset-0 grid-bg pointer-events-none z-0" />
      <Navbar />

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-8">
        <div className="space-y-4 sm:space-y-5">
          <HumanMachinePulse
            isConnected={isConnected}
            deviceOnline={deviceState.estado === "online"}
            isDispensing={isDispensing}
            lastMessage={lastMessage}
            onPing={() =>
              publish(MQTT_CONFIG.topics.command, { action: "get_status" })
            }
          />

          <NetworkStatusHeader
            isConnected={isConnected}
            deviceOnline={deviceState.estado === "online"}
          />

          <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
            <div className="xl:col-span-5">
              <CamStreamCard />
            </div>
            <div className="xl:col-span-3">
              <SmartDispenseCard
                isDispensing={isDispensing}
                modoFiesta={modoFiesta}
                onDispense={handleDispense}
                onToggleModoFiesta={handleToggleModoFiesta}
              />
            </div>
            <div className="xl:col-span-4">
              <NutritionAnalyticsCard />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-12 gap-4">
            <div className="xl:col-span-3">
              <PetIdentityCard />
            </div>
            <div className="xl:col-span-2">
              <MascotBuddy
                deviceOnline={deviceState.estado === "online"}
                isDispensing={isDispensing}
                hasJam={deviceState.atasco}
              />
            </div>
            <div className="xl:col-span-3">
              <SoundboardCard onPublishSound={handlePublishSound} />
            </div>
            <div className="xl:col-span-4">
              <DeviceLocationCard
                deviceOnline={deviceState.estado === "online"}
                onRefreshLocation={() =>
                  publish(MQTT_CONFIG.topics.command, { action: "get_status" })
                }
              />
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
            <div className="xl:col-span-4">
              <FoodLevelCard
                level={deviceState.nivel_comida}
                lastDispensed={deviceState.ultimo_dispensado}
                hasJam={deviceState.atasco}
              />
            </div>
            <div className="xl:col-span-8">
              <ScheduleCard
                schedules={schedules}
                onUpdate={handleScheduleUpdate}
                timeOffsetMinutes={timeOffsetMinutes}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
