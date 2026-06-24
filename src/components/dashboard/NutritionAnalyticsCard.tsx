"use client";

import { useMemo, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Scale, TrendingUp } from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function generateHourlyData() {
  const data = [];
  const now = new Date();
  const currentHour = now.getHours();

  for (let i = 0; i < 24; i++) {
    const hour = String(i).padStart(2, "0") + ":00";
    const isFeeding = [8, 13, 20].includes(i);
    const isPast = i <= currentHour;

    let served = 0;
    let consumed = 0;

    if (isPast && isFeeding) {
      served = 45 + Math.floor(Math.random() * 30);
      consumed = served - Math.floor(Math.random() * 15);
    } else if (isPast && Math.random() > 0.7) {
      served = 10 + Math.floor(Math.random() * 15);
      consumed = served - Math.floor(Math.random() * 5);
    }

    data.push({ hour, served, consumed });
  }
  return data;
}

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number; dataKey: string }>; label?: string }) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#0a0a0a]/95 backdrop-blur-xl border border-zinc-200 dark:border-white/10 rounded-lg px-3 py-2 shadow-xl">
        <p className="text-[10px] text-zinc-400 dark:text-white/40 font-mono mb-1">{label}</p>
        {payload.map((entry) => (
          <p
            key={entry.dataKey}
            className="text-[11px] font-medium"
            style={{
              color: entry.dataKey === "served" ? "#10b981" : "#6366f1",
            }}
          >
            {entry.dataKey === "served" ? "Servido" : "Consumido"}: {entry.value}g
          </p>
        ))}
      </div>
    );
  }
  return null;
}

export default function NutritionAnalyticsCard() {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    setData(generateHourlyData());
  }, []);

  const totalServed = useMemo(() => data.reduce((sum, d) => sum + d.served, 0), [data]);
  const totalConsumed = useMemo(() => data.reduce((sum, d) => sum + d.consumed, 0), [data]);
  const efficiency = useMemo(() => totalServed > 0 ? Math.round((totalConsumed / totalServed) * 100) : 0, [totalServed, totalConsumed]);

  if (data.length === 0) {
    return (
      <div className="glass-card overflow-hidden h-full flex flex-col min-h-[268px] animate-pulse">
        <div className="px-4 pt-3 pb-2 flex items-center justify-between border-b border-white/[0.03]">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded bg-white/5" />
            <div className="h-3 w-32 bg-white/5 rounded" />
          </div>
          <div className="h-4 w-12 bg-white/5 rounded" />
        </div>
        <div className="flex-1 px-4 py-4 flex flex-col justify-between">
          <div className="flex items-end gap-2 h-24 border-b border-white/5 pb-2">
            <div className="bg-white/5 rounded-t w-full h-[30%]" />
            <div className="bg-white/5 rounded-t w-full h-[50%]" />
            <div className="bg-white/5 rounded-t w-full h-[40%]" />
            <div className="bg-white/5 rounded-t w-full h-[70%]" />
            <div className="bg-white/5 rounded-t w-full h-[60%]" />
            <div className="bg-white/5 rounded-t w-full h-[90%]" />
            <div className="bg-white/5 rounded-t w-full h-[75%]" />
          </div>
          <div className="flex gap-3 mt-4">
            <div className="flex-1 h-10 bg-white/5 rounded" />
            <div className="flex-1 h-10 bg-white/5 rounded" />
            <div className="flex-1 h-10 bg-white/5 rounded" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className="glass-card overflow-hidden h-full flex flex-col"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="px-4 pt-3 pb-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <motion.div
            className="p-1.5 rounded-lg bg-zinc-200/50 dark:bg-white/[0.06]"
            whileHover={{ scale: 1.1 }}
          >
            <Scale className="h-3.5 w-3.5 text-zinc-500 dark:text-white/50" strokeWidth={1.5} />
          </motion.div>
          <span className="text-xs font-medium text-zinc-600 dark:text-white/60">
            Analítica Nutricional
          </span>
        </div>
        <span className="text-[10px] font-mono text-zinc-400/80 dark:text-white/25 bg-zinc-100 dark:bg-white/[0.04] px-2 py-0.5 rounded">
          HX711
        </span>
      </div>

      <div className="flex-1 px-2 pb-1">
        <ResponsiveContainer width="100%" height={180}>
          <AreaChart data={data} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="gradServed" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gradConsumed" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#6366f1" stopOpacity={0.2} />
                <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="hour"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 9, fill: "rgba(255,255,255,0.2)" }}
              interval={5}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 9, fill: "rgba(255,255,255,0.15)" }}
              allowDecimals={false}
            />
            <Tooltip content={<CustomTooltip />} cursor={false} />
            <Area
              type="monotone"
              dataKey="served"
              stroke="#10b981"
              strokeWidth={1.5}
              fill="url(#gradServed)"
              dot={false}
              activeDot={{ r: 3, fill: "#10b981", strokeWidth: 0 }}
            />
            <Area
              type="monotone"
              dataKey="consumed"
              stroke="#6366f1"
              strokeWidth={1.5}
              fill="url(#gradConsumed)"
              dot={false}
              activeDot={{ r: 3, fill: "#6366f1", strokeWidth: 0 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="px-4 pb-3 flex items-center gap-3">
        <motion.div
          className="flex-1 bg-white/[0.03] rounded-lg px-3 py-2"
          whileHover={{ backgroundColor: "rgba(255,255,255,0.05)" }}
        >
          <p className="text-[10px] text-zinc-400 dark:text-white/30 mb-0.5 flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 inline-block" />
            Servido
          </p>
          <p className="text-sm font-semibold text-zinc-800 dark:text-white/80">{totalServed}g</p>
        </motion.div>
        <motion.div
          className="flex-1 bg-white/[0.03] rounded-lg px-3 py-2"
          whileHover={{ backgroundColor: "rgba(255,255,255,0.05)" }}
        >
          <p className="text-[10px] text-zinc-400 dark:text-white/30 mb-0.5 flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 inline-block" />
            Consumido
          </p>
          <p className="text-sm font-semibold text-zinc-800 dark:text-white/80">{totalConsumed}g</p>
        </motion.div>
        <motion.div
          className="flex-1 bg-white/[0.03] rounded-lg px-3 py-2"
          whileHover={{ backgroundColor: "rgba(255,255,255,0.05)" }}
        >
          <p className="text-[10px] text-zinc-400 dark:text-white/30 mb-0.5 flex items-center gap-1">
            <TrendingUp className="h-2.5 w-2.5" strokeWidth={1.5} />
            Eficiencia
          </p>
          <p className="text-sm font-semibold neon-text">{efficiency}%</p>
        </motion.div>
      </div>
    </motion.div>
  );
}
