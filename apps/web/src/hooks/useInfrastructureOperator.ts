import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { apiDataRequest, apiRequest } from "../services/api.client";
import type { Booking, Charger, ChargingSession, IoTDevice, OperatorAnalytics, OperatorNotification, OperatorProfile, ParkingBay, ParkingLocation, Station, TelemetryResponse } from "../types/infrastructure-operator";

function usePaged<T>(key: string, path: string, page: number, limit: number, refetchInterval?: number) {
  return useQuery({
    queryKey: ["infrastructure-operator", key, page, limit],
    queryFn: () => apiDataRequest<T[]>(`${path}${path.includes("?") ? "&" : "?"}page=${page}&limit=${limit}`),
    placeholderData: keepPreviousData,
    refetchInterval,
  });
}

export const useStations = (page = 1, limit = 20) => usePaged<Station>("stations", "/stations/mine", page, limit);
export const useChargers = (page = 1, limit = 20) => usePaged<Charger>("chargers", "/chargers/mine", page, limit, 30_000);
export const useParkingLocations = (page = 1, limit = 20) => usePaged<ParkingLocation>("parking-locations", "/parking/locations/mine", page, limit);
export const useParkingBays = (page = 1, limit = 50) => usePaged<ParkingBay>("parking-bays", "/parking/bays/mine", page, limit, 30_000);
export const useBookings = (page = 1, limit = 20) => usePaged<Booking>("bookings", "/reservations", page, limit, 30_000);
export const useChargingSessions = (page = 1, limit = 20) => usePaged<ChargingSession>("charging-sessions", "/sessions", page, limit, 30_000);
export const useDevices = (page = 1, limit = 50) => usePaged<IoTDevice>("devices", "/iot/devices", page, limit, 30_000);

export const useChargerTelemetry = () => useQuery({
  queryKey: ["infrastructure-operator", "telemetry"],
  queryFn: () => apiRequest<TelemetryResponse>("/telemetry/mine"),
  refetchInterval: 15_000,
});

export const useOperatorAnalytics = () => useQuery({
  queryKey: ["infrastructure-operator", "analytics"],
  queryFn: async () => (await apiDataRequest<OperatorAnalytics>("/analytics")).data,
  refetchInterval: 60_000,
});

export const useOperatorAlerts = () => useQuery({
  queryKey: ["infrastructure-operator", "alerts"],
  queryFn: async () => (await apiDataRequest<OperatorNotification[]>("/notifications")).data,
  refetchInterval: 30_000,
});

export const useOperatorProfile = () => useQuery({
  queryKey: ["infrastructure-operator", "profile"],
  queryFn: async () => (await apiDataRequest<OperatorProfile>("/users/me")).data,
});
