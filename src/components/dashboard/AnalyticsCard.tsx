"use client";

import { useMemo } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, AlertTriangle, Calendar } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import type { DailyConsumption } from "@/types";

interface AnalyticsCardProps {
  foodLevel: number;
  dailyAvgPortions?: number;
}

/** Generate mock consumption data for the last 7 days */
function generateConsumptionData(): DailyConsumption[] {
  const days = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];
  const today = new Date().getDay(); // 0=Sun
  const adjustedToday = today === 0 ? 6 : today - 1; // 0=Mon

  return days.map((day, i) => ({
    day,
    portions: i <= adjustedToday
      ? Math.floor(Math.random() * 3) + 2
      : 0,
  }));
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CustomTooltip({ active, payload, label }: any) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/90 backdrop-blur-xl border border-slate-200 rounded-xl px-4 py-2.5 shadow-lg">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-bold text-foreground">
          {payload[0].value} porciones
        </p>
      </div>
    );
  }
  return null;
}

export default function AnalyticsCard({
  foodLevel,
  dailyAvgPortions = 3,
}: AnalyticsCardProps) {
  // Se genera UNA sola vez al montar. No cambia con re-renders de MQTT.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const data = useMemo(() => generateConsumptionData(), []);

  // Estimate days until empty (simple linear prediction)
  const daysRemaining = Math.max(
    1,
    Math.round(foodLevel / (dailyAvgPortions * 5))
  );

  const isLow = daysRemaining <= 3;

  return (
    <Card className="glass-card border-0 overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base font-semibold">
            <div className="p-2 bg-purple-100 rounded-xl">
              <TrendingUp className="h-5 w-5 text-purple-600" />
            </div>
            Analítica Predictiva
          </CardTitle>
          <Badge
            variant="outline"
            className="flex items-center gap-1.5 text-xs"
          >
            <Calendar className="h-3 w-3" />
            Últimos 7 días
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pb-6">
        {/* Chart */}
        <div className="h-44 mt-2 mb-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} barCategoryGap="25%">
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#f1f5f9"
              />
              <XAxis
                dataKey="day"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: "#94a3b8" }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: "#94a3b8" }}
                allowDecimals={false}
              />
              <Tooltip content={<CustomTooltip />} cursor={false} />
              <Bar dataKey="portions" radius={[6, 6, 0, 0]}>
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={
                      entry.portions === 0
                        ? "#e2e8f0"
                        : entry.portions >= 4
                        ? "#8b5cf6"
                        : "#3b82f6"
                    }
                    opacity={entry.portions === 0 ? 0.3 : 0.85}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Prediction alert */}
        <div
          className={`flex items-center gap-3 p-4 rounded-2xl transition-all duration-300 ${
            isLow
              ? "bg-red-50 border border-red-200"
              : "bg-emerald-50 border border-emerald-200"
          }`}
        >
          {isLow ? (
            <AlertTriangle className="h-5 w-5 text-red-500 flex-shrink-0" />
          ) : (
            <TrendingUp className="h-5 w-5 text-emerald-500 flex-shrink-0" />
          )}
          <div>
            <p
              className={`text-sm font-semibold ${
                isLow ? "text-red-700" : "text-emerald-700"
              }`}
            >
              Días estimados para vaciarse:{" "}
              <span className="text-lg">{daysRemaining} días</span>
            </p>
            <p
              className={`text-xs mt-0.5 ${
                isLow ? "text-red-500" : "text-emerald-600"
              }`}
            >
              {isLow
                ? "⚠️ Considera recargar pronto el depósito"
                : "✅ Nivel de comida suficiente por ahora"}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
