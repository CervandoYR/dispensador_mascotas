"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Clock, Plus, Trash2, RefreshCw, ToggleLeft, ToggleRight } from "lucide-react";
import type { ScheduleEntry } from "@/types";

interface ScheduleCardProps {
  schedules: ScheduleEntry[];
  onUpdate: (schedules: ScheduleEntry[]) => void;
  timeOffsetMinutes: number;
}

const DAYS = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];

export default function ScheduleCard({
  schedules,
  onUpdate,
  timeOffsetMinutes,
}: ScheduleCardProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newTime, setNewTime] = useState("08:00");
  const [newDays, setNewDays] = useState<string[]>(["Lun", "Mar", "Mié", "Jue", "Vie"]);
  const [newPortions, setNewPortions] = useState(1);

  const handleAddSchedule = () => {
    const newEntry: ScheduleEntry = {
      id: Date.now().toString(),
      time: newTime,
      days: newDays,
      enabled: true,
      portions: newPortions,
    };
    onUpdate([...schedules, newEntry]);
    setDialogOpen(false);
    setNewTime("08:00");
    setNewDays(["Lun", "Mar", "Mié", "Jue", "Vie"]);
    setNewPortions(1);
  };

  const handleToggle = (id: string) => {
    onUpdate(schedules.map((s) => (s.id === id ? { ...s, enabled: !s.enabled } : s)));
  };

  const handleDelete = (id: string) => {
    onUpdate(schedules.filter((s) => s.id !== id));
  };

  const toggleDay = (day: string) => {
    setNewDays((prev) => (prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]));
  };

  return (
    <motion.div
      className="glass-card overflow-hidden h-full flex flex-col"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="px-4 pt-3 pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <motion.div className="p-1.5 rounded-lg bg-zinc-200/50 dark:bg-white/[0.06]" whileHover={{ scale: 1.1 }}>
              <Clock className="h-3.5 w-3.5 text-zinc-500 dark:text-white/50" strokeWidth={1.5} />
            </motion.div>
            <span className="text-xs font-medium text-zinc-600 dark:text-white/60">Horarios</span>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger
              render={
                <motion.button
                  className="flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-medium text-emerald-400/70 bg-emerald-500/10 border border-emerald-500/15 hover:bg-emerald-500/15 transition-colors cursor-pointer"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                />
              }
            >
              <Plus className="h-3 w-3" strokeWidth={1.5} />
              Añadir
            </DialogTrigger>
            <DialogContent className="sm:max-w-md bg-[#0a0a0a] border-zinc-200 dark:border-white/10">
              <DialogHeader>
                <DialogTitle className="text-zinc-900 dark:text-white/90">Nueva Programación</DialogTitle>
                <DialogDescription className="text-zinc-400 dark:text-white/40">
                  Configura una hora de alimentación automática.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-5 py-4">
                <div className="space-y-2">
                  <Label htmlFor="schedule-time" className="text-zinc-500 dark:text-white/50 text-xs">Hora</Label>
                  <Input
                    id="schedule-time"
                    type="time"
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    className="text-xl h-12 text-center font-mono rounded-lg bg-zinc-100 dark:bg-white/[0.04] border-zinc-200 dark:border-white/[0.08] text-zinc-900 dark:text-white/90"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-zinc-500 dark:text-white/50 text-xs">Días</Label>
                  <div className="flex gap-1 flex-wrap">
                    {DAYS.map((day) => (
                      <motion.button
                        key={day}
                        type="button"
                        onClick={() => toggleDay(day)}
                        className={`px-2.5 py-1.5 text-[10px] font-medium rounded-md cursor-pointer transition-all duration-200 ${
                          newDays.includes(day)
                            ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                            : "bg-zinc-100 dark:bg-white/[0.04] text-zinc-400 dark:text-white/30 border border-zinc-200 dark:border-white/[0.06] hover:bg-zinc-200/50 dark:bg-white/[0.06]"
                        }`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {day}
                      </motion.button>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-zinc-500 dark:text-white/50 text-xs">Porciones</Label>
                  <div className="flex items-center gap-3">
                    <motion.button
                      type="button"
                      className="h-8 w-8 rounded-md bg-zinc-100 dark:bg-white/[0.04] border border-zinc-200 dark:border-white/[0.08] text-zinc-500 dark:text-white/50 hover:bg-zinc-200 dark:bg-white/[0.08] transition-colors text-sm cursor-pointer"
                      onClick={() => setNewPortions(Math.max(1, newPortions - 1))}
                      whileTap={{ scale: 0.9 }}
                    >
                      -
                    </motion.button>
                    <span className="text-xl font-bold text-zinc-800 dark:text-white/80 w-6 text-center font-mono">
                      {newPortions}
                    </span>
                    <motion.button
                      type="button"
                      className="h-8 w-8 rounded-md bg-zinc-100 dark:bg-white/[0.04] border border-zinc-200 dark:border-white/[0.08] text-zinc-500 dark:text-white/50 hover:bg-zinc-200 dark:bg-white/[0.08] transition-colors text-sm cursor-pointer"
                      onClick={() => setNewPortions(Math.min(5, newPortions + 1))}
                      whileTap={{ scale: 0.9 }}
                    >
                      +
                    </motion.button>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <motion.button
                  onClick={handleAddSchedule}
                  disabled={newDays.length === 0}
                  className="w-full py-2.5 rounded-lg bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-sm font-medium hover:bg-emerald-500/30 transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Guardar Programación
                </motion.button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {timeOffsetMinutes !== 0 && (
          <motion.div
            className="flex items-center gap-1.5 px-2.5 py-1.5 bg-emerald-500/5 border border-emerald-500/10 rounded-md mt-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <RefreshCw
              className="h-2.5 w-2.5 text-emerald-400/50 animate-spin"
              strokeWidth={1.5}
              style={{ animationDuration: "3s" }}
            />
            <span className="text-[10px] font-medium text-emerald-400/50">
              Sincronización Activa
            </span>
            <span className="text-[9px] text-emerald-400/30 font-mono ml-auto">
              {timeOffsetMinutes > 0 ? "+" : ""}{timeOffsetMinutes}min
            </span>
          </motion.div>
        )}
      </div>

      <div className="flex-1 px-4 pb-3 overflow-y-auto">
        {schedules.length === 0 ? (
          <div className="text-center py-6 text-zinc-400/70 dark:text-white/20">
            <Clock className="h-8 w-8 mx-auto mb-2 opacity-30" strokeWidth={1.5} />
            <p className="text-xs">Sin horarios configurados</p>
          </div>
        ) : (
          <div className="space-y-1.5">
            <AnimatePresence>
              {schedules.map((entry, i) => (
                <motion.div
                  key={entry.id}
                  className={`flex items-center justify-between p-2.5 rounded-lg transition-all duration-200 ${
                    entry.enabled
                      ? "bg-white/[0.03] border border-zinc-200 dark:border-white/[0.04]"
                      : "bg-white/[0.01] border border-white/[0.02] opacity-40"
                  }`}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ delay: i * 0.05 }}
                  layout
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`text-lg font-bold font-mono tracking-tight ${
                        entry.enabled ? "text-zinc-800 dark:text-white/80" : "text-zinc-400 dark:text-white/30"
                      }`}
                    >
                      {entry.time}
                    </span>
                    <div>
                      <div className="flex gap-0.5 flex-wrap">
                        {entry.days.map((day) => (
                          <span
                            key={day}
                            className="text-[8px] px-1 py-0.5 rounded bg-zinc-200/50 dark:bg-white/[0.06] text-zinc-400 dark:text-white/30 font-medium"
                          >
                            {day}
                          </span>
                        ))}
                      </div>
                      <p className="text-[10px] text-zinc-400/70 dark:text-white/20 mt-0.5 font-mono">
                        {entry.portions} porción{entry.portions > 1 ? "es" : ""}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <motion.button
                      onClick={() => handleToggle(entry.id)}
                      className="text-zinc-400 dark:text-white/30 hover:text-zinc-600 dark:text-white/60 transition-colors p-1 cursor-pointer"
                      whileTap={{ scale: 0.85 }}
                    >
                      {entry.enabled ? (
                        <ToggleRight className="h-5 w-5 text-emerald-400/60" strokeWidth={1.5} />
                      ) : (
                        <ToggleLeft className="h-5 w-5" strokeWidth={1.5} />
                      )}
                    </motion.button>
                    <motion.button
                      onClick={() => handleDelete(entry.id)}
                      className="text-zinc-350 dark:text-white/15 hover:text-red-400/60 transition-colors p-1 cursor-pointer"
                      whileTap={{ scale: 0.85 }}
                    >
                      <Trash2 className="h-3.5 w-3.5" strokeWidth={1.5} />
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </motion.div>
  );
}
