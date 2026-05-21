"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Droplets, AlertTriangle, Clock } from "lucide-react";

interface FoodLevelCardProps {
  level: number;
  lastDispensed: string;
  hasJam: boolean;
}

/**
 * Semicircular gauge showing the food level percentage.
 * Colors: green >50%, amber 20-50%, red <20%.
 */
export default function FoodLevelCard({
  level,
  lastDispensed,
  hasJam,
}: FoodLevelCardProps) {
  // Clamp level between 0-100
  const clampedLevel = Math.max(0, Math.min(100, level));

  // SVG semicircle gauge parameters
  const radius = 80;
  const circumference = Math.PI * radius; // half-circle
  const offset = circumference - (clampedLevel / 100) * circumference;

  // Determine color based on level
  const getColor = (l: number) => {
    if (l > 50) return { stroke: "#10b981", bg: "bg-emerald-50", text: "text-emerald-700", label: "Nivel Óptimo" };
    if (l > 20) return { stroke: "#f59e0b", bg: "bg-amber-50", text: "text-amber-700", label: "Nivel Medio" };
    return { stroke: "#ef4444", bg: "bg-red-50", text: "text-red-700", label: "Nivel Crítico" };
  };

  const color = getColor(clampedLevel);

  // Format last dispensed time
  const formatTime = (iso: string) => {
    try {
      const date = new Date(iso);
      return date.toLocaleTimeString("es-ES", {
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "--:--";
    }
  };

  return (
    <Card className="glass-card border-0 overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-base font-semibold">
          <div className="p-2 bg-blue-100 rounded-xl">
            <Droplets className="h-5 w-5 text-blue-600" />
          </div>
          Nivel de Comida
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center pt-0 pb-6">
        {/* Semicircular Gauge */}
        <div className="relative w-48 h-28 mb-2">
          <svg
            className="w-full h-full"
            viewBox="0 0 200 110"
            fill="none"
          >
            {/* Background arc */}
            <path
              d="M 20 100 A 80 80 0 0 1 180 100"
              stroke="#e5e7eb"
              strokeWidth="16"
              strokeLinecap="round"
              fill="none"
            />
            {/* Filled arc */}
            <path
              d="M 20 100 A 80 80 0 0 1 180 100"
              stroke={color.stroke}
              strokeWidth="16"
              strokeLinecap="round"
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              className="transition-all duration-1000 ease-out"
              style={{ animation: "gauge-fill 1.5s ease-out" }}
            />
          </svg>
          {/* Center text */}
          <div className="absolute inset-0 flex flex-col items-center justify-end pb-1">
            <span className="text-4xl font-bold tracking-tight">{clampedLevel}</span>
            <span className="text-sm text-muted-foreground -mt-1">%</span>
          </div>
        </div>

        {/* Status badge */}
        <div
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${color.bg} ${color.text} mb-4`}
        >
          <span
            className="h-1.5 w-1.5 rounded-full"
            style={{ backgroundColor: color.stroke }}
          />
          {color.label}
        </div>

        {/* Jam alert */}
        {hasJam && (
          <div className="flex items-center gap-2 px-3 py-2 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm mb-3 w-full animate-pulse">
            <AlertTriangle className="h-4 w-4 flex-shrink-0" />
            <span className="font-medium">¡Atasco detectado!</span>
          </div>
        )}

        {/* Last dispensed */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="h-3.5 w-3.5" />
          <span>
            Última ración a las{" "}
            <span className="font-semibold text-foreground" suppressHydrationWarning>
              {formatTime(lastDispensed)}
            </span>
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
