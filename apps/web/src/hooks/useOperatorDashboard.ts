import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "../services/api.client";
import type {
  OperatorStationResponse,
  OperatorTrafficRoute,
  ReservationListResponse,
} from "../types/operator";
import { useTelemetryMonitor } from "./useTelemetryMonitor";

export function useOperatorDashboard() {
  const traffic = useQuery({
    queryKey: ["operator", "traffic-routes"] as const,
    queryFn: () => apiRequest<OperatorTrafficRoute[]>("/traffic/routes"),
  });
  const stations = useQuery({
    queryKey: ["operator", "stations"] as const,
    queryFn: () => apiRequest<OperatorStationResponse>("/chargers"),
  });
  const reservations = useQuery({
    queryKey: ["operator", "reservations"] as const,
    queryFn: () => apiRequest<ReservationListResponse>("/reservations"),
    refetchInterval: 30_000,
  });
  const telemetry = useTelemetryMonitor();

  return {
    routes: traffic.data ?? [],
    stations: stations.data?.stations ?? [],
    reservations: reservations.data?.reservations ?? [],
    telemetry: telemetry.data?.chargers ?? [],
    liveEvents: telemetry.events,
    connected: telemetry.connected,
    isLoading: traffic.isLoading || stations.isLoading || reservations.isLoading || telemetry.isLoading,
    errors: [traffic.error, stations.error, reservations.error, telemetry.error].filter(
      (error): error is Error => error instanceof Error,
    ),
    refetch: async () => {
      await Promise.all([
        traffic.refetch(),
        stations.refetch(),
        reservations.refetch(),
        telemetry.refetch(),
      ]);
    },
  };
}
