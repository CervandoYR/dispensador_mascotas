// ============================================================
// PetFeeder Pro — MQTT Broker Configuration
// ============================================================

export const MQTT_CONFIG = {
  /** HiveMQ public broker WebSocket endpoint */
  brokerUrl: "wss://broker.hivemq.com:8884/mqtt",

  /** MQTT topics for PetFeeder communication */
  topics: {
    /** Topic to subscribe for device state updates */
    state: "utp/petfeeder/estado",
    /** Topic to publish commands to the ESP32 */
    command: "utp/petfeeder/comando",
  },

  /** Connection options */
  options: {
    clean: true,
    reconnectPeriod: 3000,
    connectTimeout: 10000,
    keepalive: 60,
  },

  /** Generate a unique client ID for each session */
  generateClientId: () =>
    `petfeeder-web-${Math.random().toString(16).substring(2, 10)}`,
} as const;
