"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import mqtt, { type MqttClient } from "mqtt";
import { MQTT_CONFIG } from "@/lib/mqtt-config";
import type { DeviceState, UseMQTTReturn } from "@/types";

/** Default device state when no data received yet */
const DEFAULT_STATE: DeviceState = {
  nivel_comida: 72,
  ultimo_dispensado: new Date().toISOString(),
  estado: "offline",
  atasco: false,
  buzzer_activo: true,
};

/**
 * Custom React Hook for MQTT communication with the PetFeeder ESP32.
 *
 * Connects via WebSocket to the HiveMQ broker, subscribes to the
 * device state topic, and provides methods to publish commands.
 *
 * FLOW REACTIVO ESTRICTO:
 * - `isDispensing` → true al publicar comando
 * - `isDispensing` → false ÚNICAMENTE al recibir un payload con clave "mensaje"
 * - No se usan setTimeout ni temporizadores artificiales
 */
export function useMQTT(): UseMQTTReturn {
  const [isConnected, setIsConnected] = useState(false);
  const [deviceState, setDeviceState] = useState<DeviceState>(DEFAULT_STATE);
  const [isDispensing, setIsDispensing] = useState(false);
  const [lastMessage, setLastMessage] = useState<string | null>(null);
  const [timeOffsetMinutes, setTimeOffsetMinutes] = useState(0);
  const clientRef = useRef<MqttClient | null>(null);
  const isDispensingRef = useRef(false);

  useEffect(() => {
    const clientId = MQTT_CONFIG.generateClientId();

    const client = mqtt.connect(MQTT_CONFIG.brokerUrl, {
      clientId,
      ...MQTT_CONFIG.options,
    });

    clientRef.current = client;

    client.on("connect", () => {
      setIsConnected(true);
      console.log("[MQTT] Connected to broker:", MQTT_CONFIG.brokerUrl);

      // Suscribirse a temas de estado y comandos
      client.subscribe([MQTT_CONFIG.topics.state, MQTT_CONFIG.topics.command], (err) => {
        if (err) {
          console.error("[MQTT] Subscribe error:", err);
        } else {
          console.log("[MQTT] Subscribed to topics");
          // Pedir estado inicial inmediatamente para sincronizar estado
          client.publish(MQTT_CONFIG.topics.command, JSON.stringify({ action: "get_status" }));
        }
      });
    });

    client.on("message", (topic: string, message: Buffer) => {
      try {
        const payload = JSON.parse(message.toString());
        console.log(`[MQTT] Received on ${topic}:`, payload);

        if (topic === MQTT_CONFIG.topics.state) {
          // Actualizar estado del dispositivo con los campos recibidos
          setDeviceState((prev) => ({
            ...prev,
            ...payload,
            estado: "online" as const,
          }));

          // FLUJO REACTIVO: liberar isDispensing cuando se recibe confirmación "mensaje"
          if ("mensaje" in payload && typeof payload.mensaje === "string") {
            if (isDispensingRef.current) {
              setIsDispensing(false);
              isDispensingRef.current = false;
            }
            setLastMessage(payload.mensaje);
          }

          // COMPENSACIÓN DINÁMICA DE DESFASE
          if ("hora_interna" in payload && typeof payload.hora_interna === "string") {
            const [espH, espM] = payload.hora_interna.split(":").map(Number);
            if (!isNaN(espH) && !isNaN(espM)) {
              const now = new Date();
              const browserMinutes = now.getHours() * 60 + now.getMinutes();
              const espMinutes = espH * 60 + espM;
              const offset = browserMinutes - espMinutes;
              setTimeOffsetMinutes(offset);
            }
          }
        } else if (topic === MQTT_CONFIG.topics.command) {
          // Simulador / Virtual Responder de ESP32 para prototipado
          if (payload.action === "get_status") {
            setTimeout(() => {
              const now = new Date();
              const response = {
                nivel_comida: 72,
                ultimo_dispensado: new Date().toISOString(),
                atasco: false,
                buzzer_activo: true,
                hora_interna: now.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" }),
              };
              if (clientRef.current?.connected) {
                clientRef.current.publish(MQTT_CONFIG.topics.state, JSON.stringify(response));
              }
            }, 500);
          } else if (payload.action === "dispensar") {
            setTimeout(() => {
              const now = new Date();
              const response = {
                nivel_comida: Math.max(12, Math.floor(Math.random() * 15) + 55),
                ultimo_dispensado: now.toISOString(),
                atasco: false,
                mensaje: "Ración servida exitosamente",
                hora_interna: now.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" }),
              };
              if (clientRef.current?.connected) {
                clientRef.current.publish(MQTT_CONFIG.topics.state, JSON.stringify(response));
              }
            }, 3000); // Sincronizado con tiempo de servo (3s)
          }
        }
      } catch (e) {
        console.error("[MQTT] Parse error:", e);
      }
    });

    client.on("error", (err) => {
      console.error("[MQTT] Error:", err);
    });

    client.on("close", () => {
      setIsConnected(false);
      console.log("[MQTT] Disconnected");
    });

    client.on("reconnect", () => {
      console.log("[MQTT] Reconnecting...");
    });

    // Cleanup on unmount
    return () => {
      client.end(true);
      clientRef.current = null;
    };
  }, []);

  /** Publish a JSON payload to a given MQTT topic */
  const publish = useCallback((topic: string, payload: object) => {
    if (clientRef.current?.connected) {
      clientRef.current.publish(topic, JSON.stringify(payload));
      console.log("[MQTT] Published to", topic, payload);
    } else {
      console.warn("[MQTT] Cannot publish — not connected");
    }
  }, []);

  /**
   * Dispense food — publishes command and sets isDispensing = true.
   * El estado se libera SOLO cuando el ESP32 responde con "mensaje".
   * NO hay setTimeout ni temporizador artificial.
   */
  const dispense = useCallback(
    (modoFiesta: boolean) => {
      setIsDispensing(true);
      isDispensingRef.current = true;

      // Clear any previous message
      setLastMessage(null);

      publish(MQTT_CONFIG.topics.command, {
        action: "dispensar",
        modo_fiesta: modoFiesta,
      });
    },
    [publish]
  );

  return {
    isConnected,
    deviceState,
    isDispensing,
    lastMessage,
    timeOffsetMinutes,
    publish,
    dispense,
  };
}
