import { lazy, Suspense } from "react";
import { Link } from "react-router-dom";
import { useJourneyStore } from "../../store/journey.store";
import type { EvaluatedRoute } from "../../types/journey";

const RouteAlternativesMap = lazy(() =>
  import("../../components/journey/RouteAlternativesMap").then((module) => ({
    default: module.RouteAlternativesMap,
  })),
);

function RouteCard({ route }: { route: EvaluatedRoute }) {
  return (
    <article className="rounded-2xl border border-white/10 bg-white/5 p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-volt-400">{route.sourceMode}</p>
          <h2 className="mt-1 text-2xl font-semibold">{route.name}</h2>
        </div>
        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${
            route.chargingRequired
              ? "bg-amber-400/15 text-amber-300"
              : "bg-emerald-400/15 text-emerald-300"
          }`}
        >
          {route.chargingRequired ? "Charging required" : "Reserve protected"}
        </span>
      </div>

      <dl className="mt-6 grid grid-cols-2 gap-4">
        <div>
          <dt className="text-sm text-slate-400">Distance</dt>
          <dd className="mt-1 text-xl font-semibold">{route.distanceKm} km</dd>
        </div>
        <div>
          <dt className="text-sm text-slate-400">Estimated ETA</dt>
          <dd className="mt-1 text-xl font-semibold">{route.estimatedEtaMinutes} min</dd>
        </div>
        <div>
          <dt className="text-sm text-slate-400">Estimated energy</dt>
          <dd className="mt-1 text-xl font-semibold">{route.estimatedEnergyKwh} kWh</dd>
        </div>
        <div>
          <dt className="text-sm text-slate-400">Estimated arrival SOC</dt>
          <dd className="mt-1 text-xl font-semibold">{route.estimatedArrivalSocPercent}%</dd>
        </div>
      </dl>

      <p className="mt-5 text-sm text-slate-400">
        Base ETA {route.baseEtaMinutes} min × traffic factor {route.trafficFactor.toFixed(2)}.
        Environment factor {route.environmentAdjustment.combinedFactor.toFixed(2)}. Energy includes
        traffic, environment, and auxiliary load.
      </p>

      {route.traffic ? (
        <div className="mt-5 rounded-xl border border-sky-400/15 bg-sky-400/5 p-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="text-sm font-medium text-sky-200">
              Traffic twin · {route.traffic.sourceMode}
            </h3>
            <span className="rounded-full bg-sky-400/10 px-2.5 py-1 text-xs font-semibold text-sky-200">
              {route.traffic.predictedLevel}
            </span>
          </div>
          <p className="mt-2 text-sm text-slate-400">
            Current {route.traffic.currentLoad}/{route.traffic.capacity} (
            {route.traffic.currentLevel}) → predicted {route.traffic.predictedLoad}/
            {route.traffic.capacity} ({route.traffic.predictedLevel}).
          </p>
          <p
            className={`mt-2 text-xs ${
              route.traffic.vehicleEligible ? "text-emerald-300" : "text-amber-300"
            }`}
          >
            {route.traffic.vehicleEligible
              ? "Selected vehicle is eligible for this corridor."
              : "Selected vehicle is not eligible for this corridor."}
          </p>
        </div>
      ) : null}

      <div className="mt-5 border-t border-white/10 pt-4">
        <h3 className="text-sm font-medium text-slate-300">Charger candidates</h3>
        {route.recommendedChargingStop ? (
          <p className="mt-2 text-sm font-medium text-volt-400">
            Suggested stop: {route.recommendedChargingStop.name}
          </p>
        ) : null}
        {route.chargerCandidates.length > 0 ? (
          <ul className="mt-2 space-y-2 text-sm text-slate-400">
            {route.chargerCandidates.map((station) => (
              <li key={station.id}>
                {station.name} · {station.powerKw} kW · {station.availableChargers} available
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-2 text-sm text-slate-500">No charger candidates supplied.</p>
        )}
      </div>
    </article>
  );
}

export function JourneyResult() {
  const routeEvaluation = useJourneyStore((state) => state.routeEvaluation);

  if (!routeEvaluation) {
    return (
      <section>
        <h1 className="text-3xl font-semibold">No routes evaluated yet</h1>
        <Link className="mt-4 inline-block text-volt-400" to="/">
          Return to planner
        </Link>
      </section>
    );
  }

  return (
    <section>
      <p className="text-sm uppercase tracking-[0.2em] text-volt-400">
        {routeEvaluation.origin.label} to {routeEvaluation.destination.label}
      </p>
      <div className="mt-2 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-semibold">EV route feasibility</h1>
          <p className="mt-2 text-slate-400">
            All energy, ETA, and arrival SOC values are estimates.
          </p>
        </div>
        <span className="rounded-full border border-white/10 px-3 py-1 text-sm text-slate-300">
          Source: {routeEvaluation.sourceMode}
        </span>
      </div>

      {routeEvaluation.vehicleSnapshot ? (
        <p className="mt-4 text-sm text-slate-400">
          Evaluated for {routeEvaluation.vehicleSnapshot.name} at{" "}
          {routeEvaluation.vehicleSnapshot.currentSocPercent}% SOC with a{" "}
          {routeEvaluation.vehicleSnapshot.reserveSocPercent}% reserve · traffic horizon{" "}
          {routeEvaluation.integration?.trafficHorizon ?? "CURRENT"}.
        </p>
      ) : null}

      {routeEvaluation.fallbackReason ? (
        <p className="mt-5 rounded-xl border border-amber-400/20 bg-amber-400/10 p-3 text-sm text-amber-200">
          Live routing was unavailable; offline demo routes were used.
        </p>
      ) : null}

      <Suspense
        fallback={
          <div className="mt-8 h-[360px] animate-pulse rounded-2xl bg-white/5" aria-label="Loading route map" />
        }
      >
        <RouteAlternativesMap
          routes={routeEvaluation.routes}
          origin={routeEvaluation.origin}
          destination={routeEvaluation.destination}
        />
      </Suspense>

      <div className="mt-8 grid gap-4 xl:grid-cols-3">
        {routeEvaluation.routes.map((route) => (
          <RouteCard key={route.routeId} route={route} />
        ))}
      </div>

      <Link className="mt-8 inline-block text-volt-400" to="/">
        Evaluate another journey
      </Link>
    </section>
  );
}
