import { useDiversificationSimulation } from "../../hooks/useDiversificationSimulation";
import type { SimulationRouteLoad } from "../../types/diversification";

function UtilizationBar({ label, utilization, threshold, overloaded }: { label: string; utilization: number; threshold: number; overloaded: boolean }) {
  return (
    <div>
      <div className="flex justify-between text-xs text-slate-400"><span>{label}</span><span>{utilization}%</span></div>
      <div className="mt-1 h-2 overflow-hidden rounded-full bg-white/10" role="progressbar" aria-label={`${label} utilization`} aria-valuemin={0} aria-valuemax={Math.max(100, threshold)} aria-valuenow={utilization}>
        <div className={`h-full rounded-full ${overloaded ? "bg-amber-400" : "bg-volt-400"}`} style={{ width: `${Math.min(100, utilization)}%` }} />
      </div>
    </div>
  );
}

function RouteLoadComparison({ baseline, diversified, threshold }: { baseline: SimulationRouteLoad; diversified: SimulationRouteLoad; threshold: number }) {
  return (
    <article className="rounded-2xl border border-white/10 bg-white/5 p-5">
      <div className="flex items-start justify-between gap-3">
        <div><h2 className="font-semibold">{baseline.name}</h2><p className="mt-1 text-xs text-slate-500">Predicted {baseline.initialPredictedLoad}/{baseline.capacity}</p></div>
        <span className="rounded-full bg-white/5 px-2.5 py-1 text-xs text-slate-300">{diversified.assignments} assignments</span>
      </div>
      <div className="mt-5 space-y-4">
        <UtilizationBar label={`Baseline · ${baseline.assignments} assignments`} utilization={baseline.finalUtilizationPercent} threshold={threshold} overloaded={baseline.capacityThresholdExceeded} />
        <UtilizationBar label={`Diversified · ${diversified.assignments} assignments`} utilization={diversified.finalUtilizationPercent} threshold={threshold} overloaded={diversified.capacityThresholdExceeded} />
      </div>
    </article>
  );
}

export function DigitalTwin() {
  const simulation = useDiversificationSimulation();
  const result = simulation.data;
  const diversifiedByRoute = new Map(result?.diversified.routes.map((route) => [route.routeId, route]) ?? []);

  return (
    <section>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div><p className="text-sm uppercase tracking-[0.2em] text-volt-400">Module 11 · Advisory simulation</p><h1 className="mt-2 text-4xl font-semibold">Traffic diversification twin</h1><p className="mt-3 text-slate-400">Compare shortest-time routing with capacity-aware assignments.</p></div>
        <button className="rounded-xl border border-white/10 px-4 py-2 text-sm disabled:opacity-50" type="button" disabled={simulation.isFetching} onClick={() => void simulation.refetch()}>{simulation.isFetching ? "Running…" : "Run 20 requests again"}</button>
      </div>
      {simulation.isLoading ? <div className="mt-8 h-48 animate-pulse rounded-3xl bg-white/5" aria-label="Loading traffic simulation" /> : null}
      {simulation.error ? <p role="alert" className="mt-8 rounded-xl border border-red-400/20 bg-red-400/10 p-4 text-red-200">{simulation.error.message}</p> : null}
      {result ? (
        <>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[["Simulated requests", result.requestCount], ["Capacity threshold", `${result.capacityThresholdPercent}%`], ["Baseline overloaded", result.baseline.overloadedRoutes], ["Diversified overloaded", result.diversified.overloadedRoutes]].map(([label, value]) => <article key={label} className="rounded-2xl border border-white/10 bg-white/5 p-5"><p className="text-sm text-slate-400">{label}</p><p className="mt-2 text-3xl font-semibold">{value}</p></article>)}
          </div>
          <aside className="mt-6 rounded-2xl border border-volt-400/20 bg-volt-400/10 p-4"><p className="text-xs font-semibold uppercase tracking-[0.15em] text-volt-400">DEMO · Advisory only</p><p className="mt-2 text-sm text-slate-300">{result.explanation}</p></aside>
          <div className="mt-6 grid gap-4 lg:grid-cols-2">{result.baseline.routes.map((baselineRoute) => { const diversifiedRoute = diversifiedByRoute.get(baselineRoute.routeId); return diversifiedRoute ? <RouteLoadComparison key={baselineRoute.routeId} baseline={baselineRoute} diversified={diversifiedRoute} threshold={result.capacityThresholdPercent} /> : null; })}</div>
        </>
      ) : null}
    </section>
  );
}
