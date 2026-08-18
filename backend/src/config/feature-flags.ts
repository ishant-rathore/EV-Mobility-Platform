export const featureFlags = {
  mqttIngestion: process.env.ENABLE_MQTT !== "false",
  demoProviders: process.env.ENABLE_DEMO_PROVIDERS !== "false",
  aiService: process.env.ENABLE_AI_SERVICE === "true",
} as const;
