"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Clock, Plus, Trash2, RefreshCw } from "lucide-react";
import type { ScheduleEntry } from "@/types";

interface ScheduleCardProps {
  schedules: ScheduleEntry[];
  onUpdate: (schedules: ScheduleEntry[]) => void;
  /** Drift in minutes between browser and ESP32 clock */
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
    onUpdate(
      schedules.map((s) =>
        s.id === id ? { ...s, enabled: !s.enabled } : s
      )
    );
  };

  const handleDelete = (id: string) => {
    onUpdate(schedules.filter((s) => s.id !== id));
  };

  const toggleDay = (day: string) => {
    setNewDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  return (
    <Card className="glass-card border-0 overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base font-semibold">
            <div className="p-2 bg-amber-100 rounded-xl">
              <Clock className="h-5 w-5 text-amber-600" />
            </div>
            Programación Horaria
          </CardTitle>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger
              render={
                <Button
                  size="sm"
                  variant="outline"
                  className="rounded-xl border-dashed border-blue-300 text-blue-600 hover:bg-blue-50"
                />
              }
            >
              <Plus className="h-4 w-4 mr-1" />
              Añadir
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Nueva Programación</DialogTitle>
                <DialogDescription>
                  Configura una nueva hora de alimentación automática.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-6 py-4">
                {/* Time Picker */}
                <div className="space-y-2">
                  <Label htmlFor="schedule-time">Hora</Label>
                  <Input
                    id="schedule-time"
                    type="time"
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    className="text-2xl h-14 text-center font-mono rounded-xl"
                  />
                </div>

                {/* Day Selector */}
                <div className="space-y-2">
                  <Label>Días</Label>
                  <div className="flex gap-1.5 flex-wrap">
                    {DAYS.map((day) => (
                      <button
                        key={day}
                        type="button"
                        onClick={() => toggleDay(day)}
                        className={`px-3 py-2 text-xs font-medium rounded-xl transition-all duration-200 ${
                          newDays.includes(day)
                            ? "bg-blue-500 text-white shadow-md"
                            : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                        }`}
                      >
                        {day}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Portions */}
                <div className="space-y-2">
                  <Label htmlFor="portions">Porciones</Label>
                  <div className="flex items-center gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="rounded-xl"
                      onClick={() => setNewPortions(Math.max(1, newPortions - 1))}
                    >
                      −
                    </Button>
                    <span className="text-2xl font-bold w-8 text-center">
                      {newPortions}
                    </span>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="rounded-xl"
                      onClick={() => setNewPortions(Math.min(5, newPortions + 1))}
                    >
                      +
                    </Button>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button
                  onClick={handleAddSchedule}
                  disabled={newDays.length === 0}
                  className="w-full rounded-xl bg-gradient-to-r from-blue-500 to-emerald-500 hover:from-blue-600 hover:to-emerald-600"
                >
                  Guardar Programación
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Badge de sincronización inteligente */}
        {timeOffsetMinutes !== 0 && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 border border-emerald-200 rounded-xl mt-2">
            <RefreshCw className="h-3 w-3 text-emerald-600 animate-spin" style={{ animationDuration: '3s' }} />
            <span className="text-[11px] font-medium text-emerald-700">
              Sincronización Inteligente de Hardware Activa
            </span>
            <span className="text-[10px] text-emerald-500 ml-auto">
              Δ {timeOffsetMinutes > 0 ? "+" : ""}{timeOffsetMinutes}min
            </span>
          </div>
        )}
      </CardHeader>
      <CardContent className="pb-6">
        {schedules.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Clock className="h-10 w-10 mx-auto mb-3 opacity-30" />
            <p className="text-sm">No hay horarios programados</p>
            <p className="text-xs mt-1">
              Pulsa &quot;Añadir&quot; para crear uno
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {schedules.map((entry) => (
              <div
                key={entry.id}
                className={`flex items-center justify-between p-4 rounded-2xl transition-all duration-300 ${
                  entry.enabled
                    ? "bg-white/80 shadow-sm border border-slate-100"
                    : "bg-slate-50/50 opacity-60"
                }`}
              >
                <div className="flex items-center gap-4">
                  <span
                    className={`text-2xl font-bold font-mono tracking-tight ${
                      entry.enabled ? "text-foreground" : "text-muted-foreground"
                    }`}
                  >
                    {entry.time}
                  </span>
                  <div>
                    <div className="flex gap-1 flex-wrap">
                      {entry.days.map((day) => (
                        <span
                          key={day}
                          className="text-[10px] px-1.5 py-0.5 rounded-md bg-blue-100 text-blue-600 font-medium"
                        >
                          {day}
                        </span>
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {entry.portions} porción{entry.portions > 1 ? "es" : ""}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={entry.enabled}
                    onCheckedChange={() => handleToggle(entry.id)}
                    className="data-[state=checked]:bg-emerald-500"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(entry.id)}
                    className="h-8 w-8 p-0 text-muted-foreground hover:text-red-500 hover:bg-red-50 rounded-xl"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
