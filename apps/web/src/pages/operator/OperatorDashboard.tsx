import { lazy, Suspense } from "react";
import { Link } from "react-router-dom";
import { useOperatorDashboard } from "../../hooks/useOperatorDashboard";
import { congestionLevel, deriveOperatorMetrics } from "../../utils/operator.metrics";

const OperatorNetworkMap = lazy(() =>
  import("../../components/map/OperatorNetworkMap").then((module) => ({
    default: module.OperatorNetworkMap,
  })),
);

const LEVEL_STYLE = {
  LOW: "bg-emerald-400/15 text-emerald-300",
  MEDIUM: "bg-cyan-400/15 text-cyan-200",
  HIGH: "bg-amber-400/15 text-amber-200",
  SEVERE: "bg-red-400/15 text-red-200",
} as const;

export function OperatorDashboard() {
  const dashboard = useOperatorDashboard();
  const metrics = deriveOperatorMetrics({
    routes: dashboard.routes,
    stations: dashboard.stations,
    telemetry: dashboard.telemetry,
    reservations: dashboard.reservations,
  });

  return (
    <section>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-volt-400">Module 11 · Operator</p>
          <h1 className="mt-2 text-4xl font-semibold">Mobility operations twin</h1>
          <p className="mt-3 max-w-3xl text-slate-400">
            One demo view for route load, charger state, reliability, heartbeat freshness, sessions and faults.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className={`rounded-full px-3 py-1 text-sm font-semibold ${dashboard.connected ? "bg-emerald-400/15 text-emerald-300" : "bg-slate-400/15 text-slate-300"}`}>
            {dashboard.connected ? "WebSocket live" : "Snapshot / reconnecting"}
          </span>
          <button className="rounded-xl border border-white/10 px-4 py-2 text-sm disabled:opacity-50" type="button" disabled={dashboard.isLoading} onClick={() => void dashboard.refetch()}>
            Refresh
          </button>
        </div>
      </div>

      {dashboard.errors.length > 0 ? (
        <p role="alert" className="mt-6 rounded-xl border border-amber-400/20 bg-amber-400/10 p-4 text-sm text-amber-200">
          Some operator sources are unavailable: {dashboard.errors.map((error) => error.message).join(" · ")}
        </p>
      ) : null}

      <div className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-6">
        {[
          ["Routes monitored", metrics.routeCount],
          ["Over capacity", metrics.overloadedRouteCount],
          ["Chargers tracked", metrics.chargerCount],
          ["Charging now", metrics.chargingChargerCount],
          ["Fault / offline", metrics.faultedChargerCount + metrics.offlineChargerCount],
          ["Active sessions", metrics.activeSessionCount],
        ].map(([label, value]) => (
          <article key={label} className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs text-slate-400">{label}</p>
            <p className="mt-2 text-3xl font-semibold">{value}</p>
          </article>
        ))}
      </div>

      <div className="mt-7 grid gap-6 xl:grid-cols-[1.45fr_0.55fr]">
        <Suspense fallback={<div className="h-[430px] animate-pulse rounded-2xl bg-white/5" aria-label="Loading operator map" />}>
          <OperatorNetworkMap routes={dashboard.routes} stations={dashboard.stations} telemetry={dashboard.telemetry} />
        </Suspense>

        <aside className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <h2 className="text-lg font-semibold">Predicted route load</h2>
          <ul className="mt-4 space-y-4">
            {dashboard.routes.map((route) => {
              const level = congestionLevel(route.totalPredictedLoad, route.totalCapacity);
              const percent = route.totalCapacity > 0 ? Math.round((route.totalPredictedLoad / route.totalCapacity) * 100) : 100;
              return (
                <li key={route.routeId}>
                  <div className="flex items-start justify-between gap-3 text-sm">
                    <span>{route.name}</span>
                    <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${LEVEL_STYLE[level]}`}>{level}</span>
                  </div>
                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/10" role="progressbar" aria-label={`${route.name} predicted utilization`} aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.min(100, percent)}>
                    <div className="h-full rounded-full bg-volt-400" style={{ width: `${Math.min(100, percent)}%` }} />
                  </div>
                  <p className="mt-1 text-xs text-slate-500">{percent}% predicted · DEMO</p>
                </li>
              );
            })}
          </ul>
        </aside>
      </div>

      <div className="mt-7 grid gap-6 lg:grid-cols-3">
        <article className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <h2 className="text-lg font-semibold">Charger health</h2>
          <dl className="mt-4 grid grid-cols-2 gap-4 text-sm">
            <div><dt className="text-slate-500">Available</dt><dd className="mt-1 text-xl text-emerald-300">{metrics.availableChargerCount}</dd></div>
            <div><dt className="text-slate-500">Charging</dt><dd className="mt-1 text-xl text-cyan-300">{metrics.chargingChargerCount}</dd></div>
            <div><dt className="text-slate-500">Fault</dt><dd className="mt-1 text-xl text-red-300">{metrics.faultedChargerCount}</dd></div>
            <div><dt className="text-slate-500">Offline</dt><dd className="mt-1 text-xl text-slate-300">{metrics.offlineChargerCount}</dd></div>
          </dl>
          <Link className="mt-5 inline-block text-sm text-volt-400" to="/operator/chargers">Open live charger monitor →</Link>
        </article>

        <article className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <h2 className="text-lg font-semibold">Reservations and sessions</h2>
          <p className="mt-4 text-3xl font-semibold">{metrics.activeSessionCount}</p>
          <p className="text-sm text-slate-400">active simulated session(s)</p>
          <p className="mt-3 text-sm text-slate-300">{metrics.confirmedReservationCount} confirmed reservation(s) waiting.</p>
          <Link className="mt-5 inline-block text-sm text-volt-400" to="/operator/analytics">Open operational analytics →</Link>
        </article>

        <article className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <h2 className="text-lg font-semibold">Recent realtime events</h2>
          {dashboard.liveEvents.length === 0 ? <p className="mt-3 text-sm text-slate-400">No events received in this browser session.</p> : null}
          <ul className="mt-3 space-y-2 text-sm text-slate-300">
            {dashboard.liveEvents.slice(0, 5).map((event, index) => (
              <li key={`${event.chargerId}-${event.receivedAt}-${index}`}>
                {event.chargerId} · {event.kind === "fault" ? "FAULT/OFFLINE" : event.telemetry?.status}
              </li>
            ))}
          </ul>
          <Link className="mt-5 inline-block text-sm text-volt-400" to="/operator/traffic">Compare diversification →</Link>
        </article>
      </div>

      <p className="mt-5 text-xs text-slate-500">Traffic, availability, session, wait and device values are demo, simulated or estimated unless explicitly labelled LIVE.</p>
    </section>
  );
}
