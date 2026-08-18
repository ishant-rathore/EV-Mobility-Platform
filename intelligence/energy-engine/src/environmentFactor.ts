export const WEATHER_CONDITIONS = ["CLEAR", "RAIN", "HOT", "COLD"] as const;
export type WeatherCondition = (typeof WEATHER_CONDITIONS)[number];

export interface EnvironmentConditions {
  weatherCondition?: WeatherCondition;
  ambientTemperatureC?: number;
  elevationGainM?: number;
  distanceKm?: number;
}

export interface EnvironmentAdjustment {
  weatherFactor: number;
  temperatureFactor: number;
  elevationFactor: number;
  combinedFactor: number;
  sourceMode: "ESTIMATED" | "MANUAL";
}

const WEATHER_FACTORS: Record<WeatherCondition, number> = {
  CLEAR: 1,
  RAIN: 1.08,
  HOT: 1.06,
  COLD: 1.12,
};

function temperatureFactor(temperatureC?: number): number {
  if (temperatureC === undefined || (temperatureC >= 15 && temperatureC <= 30)) {
    return 1;
  }
  const degreesOutsideEfficientBand =
    temperatureC < 15 ? 15 - temperatureC : temperatureC - 30;
  return Math.min(1.15, 1 + degreesOutsideEfficientBand * 0.005);
}

function elevationFactor(elevationGainM = 0, distanceKm = 1): number {
  const gainPerKm = elevationGainM / Math.max(1, distanceKm);
  return Math.min(1.2, 1 + gainPerKm * 0.002);
}

export function calculateEnvironmentAdjustment(
  conditions: EnvironmentConditions = {},
): EnvironmentAdjustment {
  const weatherFactor = WEATHER_FACTORS[conditions.weatherCondition ?? "CLEAR"];
  const thermalFactor = temperatureFactor(conditions.ambientTemperatureC);
  const terrainFactor = elevationFactor(conditions.elevationGainM, conditions.distanceKm);

  return {
    weatherFactor,
    temperatureFactor: Number(thermalFactor.toFixed(3)),
    elevationFactor: Number(terrainFactor.toFixed(3)),
    combinedFactor: Number((weatherFactor * thermalFactor * terrainFactor).toFixed(3)),
    sourceMode: "ESTIMATED",
  };
}
