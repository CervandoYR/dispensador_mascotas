"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import type { UserProfile } from "@/types";
import { PawPrint, Wifi, WifiOff } from "lucide-react";

interface DashboardHeaderProps {
  isConnected: boolean;
  deviceOnline: boolean;
}

export default function DashboardHeader({
  isConnected,
  deviceOnline,
}: DashboardHeaderProps) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [greeting, setGreeting] = useState("Buenos días");

  useEffect(() => {
    // Load user from localStorage
    const stored = localStorage.getItem("petfeeder_user");
    if (stored) {
      setUser(JSON.parse(stored));
    }

    // Set greeting based on time of day
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Buenos días");
    else if (hour < 18) setGreeting("Buenas tardes");
    else setGreeting("Buenas noches");
  }, []);

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "PF";

  return (
    <Card className="col-span-full glass-card border-0 overflow-hidden">
      <CardContent className="p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          {/* Left: Avatar + Greeting */}
          <div className="flex items-center gap-4">
            <Avatar className="h-14 w-14 border-2 border-emerald-200 shadow-lg">
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-emerald-500 text-white text-lg font-bold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm text-muted-foreground">{greeting} 👋</p>
              <h1 className="text-2xl font-bold tracking-tight">
                {user?.name || "Usuario"}
              </h1>
              <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                <PawPrint className="h-3 w-3" />
                {user?.deviceId || "Sin dispositivo vinculado"}
              </p>
            </div>
          </div>

          {/* Right: Status badges */}
          <div className="flex items-center gap-3">
            <Badge
              variant={isConnected ? "default" : "destructive"}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-all duration-500 ${
                isConnected
                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100"
                  : "bg-red-50 text-red-700 border border-red-200 hover:bg-red-100"
              }`}
            >
              {isConnected ? (
                <>
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
                  </span>
                  MQTT Conectado
                </>
              ) : (
                <>
                  <WifiOff className="h-3.5 w-3.5" />
                  Desconectado
                </>
              )}
            </Badge>
            <Badge
              variant="outline"
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-all duration-500 ${
                deviceOnline
                  ? "bg-blue-50 text-blue-700 border-blue-200"
                  : "bg-amber-50 text-amber-700 border-amber-200"
              }`}
            >
              {deviceOnline ? (
                <Wifi className="h-3.5 w-3.5" />
              ) : (
                <WifiOff className="h-3.5 w-3.5" />
              )}
              {deviceOnline ? "Dispositivo Online" : "Dispositivo Offline"}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
