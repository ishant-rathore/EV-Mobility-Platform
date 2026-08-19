import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { TelemetrySnapshotResponse } from "@ev-mobility/shared-types";
import { apiRequest } from "../services/api.client";
import { useLiveChargerEvents } from "./useLiveChargerEvents";

export function useTelemetryMonitor() {
  const queryClient = useQueryClient();
  const query = useQuery({
    queryKey: ["telemetry", "monitor"] as const,
    queryFn: () => apiRequest<TelemetrySnapshotResponse>("/telemetry"),
    refetchInterval: 30_000,
  });
  const live = useLiveChargerEvents([]);
  const newestEventAt = live.events[0]?.receivedAt;

  useEffect(() => {
    if (newestEventAt) {
      void queryClient.invalidateQueries({ queryKey: ["telemetry", "monitor"] });
    }
  }, [newestEventAt, queryClient]);

  return { ...query, ...live };
}
