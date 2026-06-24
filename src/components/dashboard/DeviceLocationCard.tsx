"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  MapPin,
  Navigation,
  Satellite,
  RefreshCw,
  Shield,
  ExternalLink,
} from "lucide-react";
import { toast } from "sonner";

interface DeviceLocation {
  lat: number;
  lng: number;
  address: string;
  label: string;
  lastSync: string;
  accuracy: number;
}

const DEFAULT_LOCATION: DeviceLocation = {
  lat: -12.0464,
  lng: -77.0428,
  address: "Av. Arequipa 1234, Miraflores",
  label: "Casa — Sala de estar",
  lastSync: new Date().toISOString(),
  accuracy: 8,
};

const STORAGE_KEY = "petfeeder_location";

export default function DeviceLocationCard({
  deviceOnline,
  onRefreshLocation,
}: {
  deviceOnline: boolean;
  onRefreshLocation?: () => void;
}) {
  const [location, setLocation] = useState<DeviceLocation>(DEFAULT_LOCATION);
  const [syncing, setSyncing] = useState(false);
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setLocation(JSON.parse(stored));
      } catch {
        /* keep default */
      }
    }
  }, []);

  const handleSync = useCallback(() => {
    if (syncing) return;
    setSyncing(true);
    setPulse(true);

    setTimeout(() => {
      const updated: DeviceLocation = {
        ...location,
        lastSync: new Date().toISOString(),
        accuracy: Math.floor(Math.random() * 5) + 5,
      };
      setLocation(updated);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      setSyncing(false);
      setTimeout(() => setPulse(false), 800);
      onRefreshLocation?.();
      toast.success("Ubicación sincronizada", {
        description: `GPS ±${updated.accuracy}m — señal ${deviceOnline ? "activa" : "en caché"}`,
      });
    }, 1400);
  }, [syncing, location, deviceOnline, onRefreshLocation]);

  const mapsUrl = `https://www.google.com/maps?q=${location.lat},${location.lng}`;

  const syncAgo = () => {
    const diff = Math.floor((Date.now() - new Date(location.lastSync).getTime()) / 60000);
    if (diff < 1) return "hace un momento";
    if (diff < 60) return `hace ${diff} min`;
    return `hace ${Math.floor(diff / 60)} h`;
  };

  return (
    <motion.div
      className="glass-card p-4 h-full flex flex-col relative overflow-hidden min-h-[170px]"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-blue-500/10 border border-blue-500/20">
            <Satellite className="h-3.5 w-3.5 text-blue-500 dark:text-blue-400" strokeWidth={1.5} />
          </div>
          <div>
            <p className="text-[11px] font-bold text-zinc-800 dark:text-white/90">
              Ubicación GPS
            </p>
            <p className="text-[9px] text-zinc-400 dark:text-zinc-500 font-mono">
              Módulo NEO-6M · ESP32
            </p>
          </div>
        </div>
        <button
          onClick={handleSync}
          disabled={syncing}
          className="p-1.5 rounded-lg bg-zinc-100 dark:bg-white/[0.04] border border-zinc-200 dark:border-white/[0.06] text-zinc-500 dark:text-white/40 hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors cursor-pointer disabled:opacity-50"
          title="Sincronizar GPS"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${syncing ? "animate-spin" : ""}`} strokeWidth={1.5} />
        </button>
      </div>

      {/* Mini mapa estilizado */}
      <div className="relative flex-1 rounded-xl overflow-hidden border border-zinc-200/80 dark:border-white/[0.06] bg-zinc-100 dark:bg-zinc-900/60 min-h-[90px]">
        <div
          className="absolute inset-0 opacity-30 dark:opacity-20"
          style={{
            backgroundImage: `
              linear-gradient(var(--border) 1px, transparent 1px),
              linear-gradient(90deg, var(--border) 1px, transparent 1px)
            `,
            backgroundSize: "20px 20px",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/[0.06] via-transparent to-blue-500/[0.04]" />

        {/* Geofence ring */}
        <motion.div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-emerald-500/30"
          style={{ width: 72, height: 72 }}
          animate={pulse ? { scale: [1, 1.15, 1], opacity: [0.5, 0.8, 0.5] } : { opacity: 0.4 }}
          transition={{ duration: 0.8 }}
        />
        <motion.div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-emerald-500/15"
          style={{ width: 48, height: 48 }}
          animate={pulse ? { scale: [1, 1.2, 1] } : {}}
          transition={{ duration: 0.8, delay: 0.1 }}
        />

        {/* Pin del dispensador */}
        <motion.div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-full z-10"
          animate={{ y: [0, -3, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="relative">
            <MapPin className="h-7 w-7 text-emerald-500 drop-shadow-[0_2px_8px_rgba(16,185,129,0.4)]" fill="currentColor" strokeWidth={1} />
            <motion.div
              className="absolute -bottom-1 left-1/2 -translate-x-1/2 h-1.5 w-1.5 rounded-full bg-emerald-400"
              animate={{ scale: [1, 1.8, 1], opacity: [0.8, 0.2, 0.8] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
        </motion.div>

        <div className="absolute bottom-1.5 left-2 flex items-center gap-1 bg-white/80 dark:bg-black/60 backdrop-blur-sm rounded-md px-1.5 py-0.5 border border-zinc-200/60 dark:border-white/[0.06]">
          <Shield className="h-2.5 w-2.5 text-emerald-500" strokeWidth={2} />
          <span className="text-[8px] font-mono text-zinc-600 dark:text-white/50">Geocerca activa</span>
        </div>
      </div>

      <div className="mt-2.5 space-y-1">
        <div className="flex items-start gap-1.5">
          <Navigation className="h-3 w-3 text-emerald-500 mt-0.5 shrink-0" strokeWidth={2} />
          <div className="min-w-0">
            <p className="text-[10px] font-semibold text-zinc-700 dark:text-white/75 truncate">
              {location.label}
            </p>
            <p className="text-[9px] text-zinc-400 dark:text-zinc-500 truncate">
              {location.address}
            </p>
          </div>
        </div>
        <div className="flex items-center justify-between text-[8px] font-mono text-zinc-400 dark:text-zinc-500">
          <span>
            {location.lat.toFixed(4)}°, {location.lng.toFixed(4)}° · ±{location.accuracy}m
          </span>
          <span>{syncAgo()}</span>
        </div>
        <a
          href={mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-[9px] text-emerald-600 dark:text-emerald-400/80 hover:text-emerald-500 transition-colors mt-0.5"
        >
          Abrir en Maps
          <ExternalLink className="h-2.5 w-2.5" strokeWidth={2} />
        </a>
      </div>
    </motion.div>
  );
}
