import { useTelemetryMonitor } from "../../hooks/useTelemetryMonitor";

const STATUS_STYLES: Record<string, string> = {
  AVAILABLE: "bg-emerald-400/15 text-emerald-300",
  CONNECTED_NOT_CHARGING: "bg-sky-400/15 text-sky-300",
  CHARGING: "bg-cyan-400/15 text-cyan-300",
  FAULT: "bg-red-400/15 text-red-300",
  OFFLINE: "bg-slate-400/15 text-slate-300",
};

function provenanceLabel(sourceMode: string) {
  if (sourceMode === "LIVE_IOT") return "LIVE";
  if (sourceMode === "LIMITED_IOT") return "LIMITED";
  if (sourceMode === "OCPP") return "PROVIDER";
  return "SIMULATED";
}

export function ChargerMonitor() {
  const { data, events, connected, isLoading, isError } = useTelemetryMonitor();
  return (
    <section>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div><p className="text-sm uppercase tracking-[0.2em] text-volt-400">Module 11 · Device health</p><h1 className="mt-1 text-4xl font-semibold">Charger monitor</h1><p className="mt-2 text-slate-400">Normalized telemetry, heartbeat freshness and explainable reliability.</p></div>
        <span className={`rounded-full px-3 py-1 text-sm font-semibold ${connected ? "bg-emerald-400/15 text-emerald-300" : "bg-slate-400/15 text-slate-300"}`}>{connected ? "WebSocket live" : "Snapshot / reconnecting"}</span>
      </div>
      {isLoading ? <p className="mt-6 text-slate-400">Loading telemetry snapshots…</p> : null}
      {isError ? <p role="alert" className="mt-6 rounded-xl border border-amber-400/20 bg-amber-400/10 p-4 text-amber-200">Initial snapshot is unavailable. Live events can still appear.</p> : null}
      {data?.chargers.length ? <div className="mt-6 grid gap-4 lg:grid-cols-2 xl:grid-cols-3">{data.chargers.map(({ telemetry, reliability, receivedAt }) => <article key={telemetry.chargerId} className="rounded-2xl border border-white/10 bg-white/5 p-5"><div className="flex items-start justify-between gap-3"><div><h2 className="font-semibold">{telemetry.chargerId}</h2><p className="mt-1 text-xs text-slate-400">{telemetry.sourceMode} · {provenanceLabel(telemetry.sourceMode)}</p></div><span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${STATUS_STYLES[reliability.status] ?? STATUS_STYLES.OFFLINE}`}>{reliability.status}</span></div><dl className="mt-4 grid grid-cols-2 gap-3 text-sm"><div><dt className="text-slate-500">Power</dt><dd>{telemetry.powerKw === undefined ? "Not supplied" : `${telemetry.powerKw} kW`}</dd></div><div><dt className="text-slate-500">Temperature</dt><dd>{telemetry.temperatureCelsius === undefined ? "Not supplied" : `${telemetry.temperatureCelsius}°C`}</dd></div><div><dt className="text-slate-500">Reliability</dt><dd>{reliability.score}/100 · {reliability.grade}</dd></div><div><dt className="text-slate-500">Heartbeat</dt><dd>{reliability.freshness}</dd></div></dl><p className="mt-4 text-xs text-slate-500">Received {new Date(receivedAt).toLocaleTimeString()}</p></article>)}</div> : !isLoading ? <p className="mt-6 text-sm text-slate-400">No telemetry has been ingested in this API process.</p> : null}
      <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-5"><h2 className="text-lg font-semibold">Realtime events</h2>{events.length === 0 ? <p className="mt-2 text-sm text-slate-400">Waiting for a state or heartbeat update.</p> : <ul className="mt-3 space-y-2 text-sm text-slate-300">{events.slice(0, 10).map((event, index) => <li key={`${event.chargerId}-${event.receivedAt}-${index}`}>{new Date(event.receivedAt).toLocaleTimeString()} · {event.chargerId} · {event.kind === "fault" ? "FAULT/OFFLINE" : event.telemetry?.status}</li>)}</ul>}</div>
      <p className="mt-4 text-xs text-slate-500">{data?.disclaimer ?? "Measurements and availability are not guarantees."}</p>
    </section>
  );
}
