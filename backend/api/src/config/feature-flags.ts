export const featureFlags = {
  mqttIngestion: process.env.ENABLE_MQTT !== "false",
  demoProviders: process.env.ENABLE_DEMO_PROVIDERS !== "false",
  aiService: process.env.ENABLE_AI_SERVICE === "true",
  /** When false, EV vehicles live in-memory so the demo needs no database. */
  evPersistentStorage: process.env.EV_USE_DATABASE === "true",
} as const;
