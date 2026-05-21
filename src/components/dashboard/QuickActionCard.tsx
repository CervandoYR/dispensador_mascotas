"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { UtensilsCrossed, Loader2, PartyPopper } from "lucide-react";

interface QuickActionCardProps {
  isDispensing: boolean;
  modoFiesta: boolean;
  onDispense: () => void;
  onToggleModoFiesta: (enabled: boolean) => void;
}

export default function QuickActionCard({
  isDispensing,
  modoFiesta,
  onDispense,
  onToggleModoFiesta,
}: QuickActionCardProps) {
  return (
    <Card className="glass-card border-0 overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-base font-semibold">
          <div className="p-2 bg-emerald-100 rounded-xl">
            <UtensilsCrossed className="h-5 w-5 text-emerald-600" />
          </div>
          Acción Rápida
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-5 pb-6">
        {/* Dispense Button */}
        <Button
          id="btn-dispense"
          size="lg"
          disabled={isDispensing}
          onClick={onDispense}
          className={`
            w-full h-16 text-lg font-semibold rounded-2xl 
            transition-all duration-300 shadow-lg
            ${
              isDispensing
                ? "bg-amber-500 hover:bg-amber-500 shadow-amber-200"
                : "bg-gradient-to-r from-blue-500 to-emerald-500 hover:from-blue-600 hover:to-emerald-600 shadow-blue-200 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
            }
          `}
        >
          {isDispensing ? (
            <>
              <Loader2 className="h-6 w-6 animate-spin mr-2" />
              Dispensando...
            </>
          ) : (
            <>
              <span className="text-xl mr-2">🍽️</span>
              Servir Ración Ahora
            </>
          )}
        </Button>

        {/* Dispensing progress bar */}
        {isDispensing && (
          <div className="w-full bg-amber-100 rounded-full h-2 overflow-hidden">
            <div
              className="bg-amber-500 h-2 rounded-full animate-pulse"
              style={{ width: "60%" }}
            />
          </div>
        )}

        {/* Modo Fiesta Toggle */}
        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl border border-purple-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-xl">
              <PartyPopper className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <Label
                htmlFor="modo-fiesta"
                className="text-sm font-semibold cursor-pointer"
              >
                Modo Fiesta
              </Label>
              <p className="text-xs text-muted-foreground mt-0.5">
                Desactiva bloqueos de tiempo
              </p>
            </div>
          </div>
          <Switch
            id="modo-fiesta"
            checked={modoFiesta}
            onCheckedChange={onToggleModoFiesta}
            className="data-[state=checked]:bg-purple-500"
          />
        </div>
      </CardContent>
    </Card>
  );
}
