import dotenv from 'dotenv';
dotenv.config();

export const config = {
  // Server
  port: parseInt(process.env.PORT || '4000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',

  // Database
  databaseUrl: process.env.DATABASE_URL || '',

  // JWT
  jwt: {
    secret: process.env.JWT_SECRET || 'dev-secret-change-me',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'dev-refresh-secret-change-me',
    expiresIn: process.env.JWT_EXPIRES_IN || '15m',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  },

  // MQTT
  mqtt: {
    brokerUrl: process.env.MQTT_BROKER_URL || 'mqtt://localhost:1883',
    username: process.env.MQTT_USERNAME || '',
    password: process.env.MQTT_PASSWORD || '',
    topicPrefix: 'paypark',
  },

  // Razorpay
  razorpay: {
    keyId: process.env.RAZORPAY_KEY_ID || '',
    keySecret: process.env.RAZORPAY_KEY_SECRET || '',
  },

  // Google Maps
  googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY || '',

  // Energy model defaults
  energy: {
    safetyReservePercent: 10,
    defaultEfficiencyWhPerKm: 150,
    rollingResistanceCoeff: 0.01,
    airDensity: 1.225,
    dragCoefficient: 0.3,
    frontalArea: 2.5,
    auxiliaryLoadW: 500,
    regenEfficiency: 0.6,
  },

  // Station ranking weights
  ranking: {
    availabilityWeight: 0.25,
    costWeight: 0.20,
    waitWeight: 0.20,
    detourWeight: 0.20,
    powerWeight: 0.15,
  },
} as const;
