import { useEffect, useState } from "react";
import {
  REALTIME_EVENTS,
  type ChargerTelemetry as LiveChargerTelemetry,
} from "@ev-mobility/shared-types";
import { getSocket } from "../services/socket.client";

export interface LiveChargerEvent {
  chargerId: string;
  kind: "telemetry" | "fault";
  telemetry?: LiveChargerTelemetry;
  receivedAt: string;
}

const MAX_EVENTS = 20;

/** Subscribes to Module 07's live telemetry/fault broadcast, optionally filtered to a charger set. */
export function useLiveChargerEvents(chargerIds: readonly string[]) {
  const [events, setEvents] = useState<LiveChargerEvent[]>([]);
  const [connected, setConnected] = useState(false);
  const chargerIdsKey = chargerIds.join(",");

  useEffect(() => {
    const socket = getSocket();
    const watched = chargerIdsKey ? new Set(chargerIdsKey.split(",")) : null;

    function onConnect() {
      setConnected(true);
    }
    function onDisconnect() {
      setConnected(false);
    }
    function onTelemetry(telemetry: LiveChargerTelemetry) {
      if (watched && !watched.has(telemetry.chargerId)) return;
      setEvents((previous) =>
        [
          {
            chargerId: telemetry.chargerId,
            kind: "telemetry" as const,
            telemetry,
            receivedAt: new Date().toISOString(),
          },
          ...previous,
        ].slice(0, MAX_EVENTS),
      );
    }
    function onFault(payload: { chargerId: string }) {
      if (watched && !watched.has(payload.chargerId)) return;
      setEvents((previous) =>
        [
          { chargerId: payload.chargerId, kind: "fault" as const, receivedAt: new Date().toISOString() },
          ...previous,
        ].slice(0, MAX_EVENTS),
      );
    }

    setConnected(socket.connected);
    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on(REALTIME_EVENTS.telemetryUpdated, onTelemetry);
    socket.on(REALTIME_EVENTS.chargerFaulted, onFault);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off(REALTIME_EVENTS.telemetryUpdated, onTelemetry);
      socket.off(REALTIME_EVENTS.chargerFaulted, onFault);
    };
  }, [chargerIdsKey]);

  return { events, connected };
}
