// ============================================================
// PetFeeder Pro — Shared TypeScript Types
// ============================================================

/** MQTT device state received from ESP32 */
export interface DeviceState {
  nivel_comida: number;
  ultimo_dispensado: string;
  estado: "online" | "offline";
  atasco: boolean;
  buzzer_activo: boolean;
  /** Message from ESP32 confirming action completion */
  mensaje?: string;
  /** ESP32 internal clock time (format "HH:mm") — may drift from real time */
  hora_interna?: string;
}

/** MQTT command sent to ESP32 */
export interface DeviceCommand {
  action: "dispensar" | "config";
  modo_fiesta?: boolean;
  buzzer?: boolean;
}

/** Scheduled feeding entry */
export interface ScheduleEntry {
  id: string;
  time: string; // HH:mm
  days: string[]; // ["Lun", "Mar", ...]
  enabled: boolean;
  portions: number;
}

/** User profile (stored in localStorage) */
export interface UserProfile {
  email: string;
  deviceId: string; // MAC address
  name: string;
}

/** Telegram notification settings */
export interface TelegramSettings {
  chatId: string;
  botToken: string;
  enabled: boolean;
}

/** Telegram API request body */
export interface TelegramAlertRequest {
  chatId: string;
  botToken: string;
  message: string;
}

/** Daily consumption data for analytics chart */
export interface DailyConsumption {
  day: string;
  portions: number;
}

/** MQTT hook return type */
export interface UseMQTTReturn {
  isConnected: boolean;
  deviceState: DeviceState;
  isDispensing: boolean;
  /** Last "mensaje" received from ESP32 (set on dispense confirmation) */
  lastMessage: string | null;
  /** Drift in minutes between browser clock and ESP32 hora_interna */
  timeOffsetMinutes: number;
  publish: (topic: string, payload: object) => void;
  dispense: (modoFiesta: boolean) => void;
}
