import { lazy, Suspense } from "react";
import { Link } from "react-router-dom";
import { useJourneyStore } from "../../stores/journey.store";
import type { EvaluatedRoute, RouteEvaluation } from "../../types/journey";
import { estimateChargingCost, isReservableRecommendation } from "../../utils/booking";

const RouteAlternativesMap = lazy(() =>
  import("../../components/map/RouteAlternativesMap").then((module) => ({
    default: module.RouteAlternativesMap,
  })),
);

type DiversificationDecision = NonNullable<RouteEvaluation["diversification"]>;

function RouteCard({
  route,
  diversification,
}: {
  route: EvaluatedRoute;
  diversification?: DiversificationDecision;
}) {
  const diversificationCandidate = diversification?.candidates.find(
    (candidate) => candidate.routeId === route.routeId,
  );
  const isRecommended = diversification?.recommendedRouteId === route.routeId;

  return (
    <article
      className={`rounded-2xl border bg-white/5 p-5 ${
        isRecommended ? "border-volt-400/60" : "border-white/10"
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-volt-400">{route.sourceMode}</p>
          <h2 className="mt-1 text-2xl font-semibold">{route.name}</h2>
          {isRecommended ? (
            <p className="mt-2 text-xs font-semibold uppercase tracking-[0.15em] text-volt-400">
              Diversified recommendation
            </p>
          ) : null}
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

      {diversificationCandidate ? (
        <div className="mt-4 border-t border-white/10 pt-4 text-sm">
          {diversificationCandidate.eligible ? (
            <p className="text-slate-400">
              Diversification rank #{diversificationCandidate.rank} · combined score{" "}
              {diversificationCandidate.score?.toFixed(2)} · projected utilization{" "}
              {diversificationCandidate.projectedUtilizationPercent}%.
            </p>
          ) : (
            <p className="text-amber-300">{diversificationCandidate.exclusionReason}</p>
          )}
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

  const recommendation = routeEvaluation.recommendation;
  const estimatedChargingCost = estimateChargingCost(
    routeEvaluation.chargingIntelligence?.energyDeficitKwh ?? 0,
    recommendation?.estimatedPricePerKwh ?? null,
  );

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

      {routeEvaluation.diversification ? (
        <aside className="mt-5 rounded-2xl border border-volt-400/20 bg-volt-400/10 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-volt-400">
            Module 04 · Advisory simulation
          </p>
          <p className="mt-2 text-sm text-slate-200">
            {routeEvaluation.diversification.explanation}
          </p>
          <p className="mt-2 text-xs text-slate-400">
            Capacity threshold {routeEvaluation.diversification.capacityThresholdPercent}% ·
            simulation {routeEvaluation.diversification.simulationId}.
          </p>
        </aside>
      ) : null}

      {routeEvaluation.chargingIntelligence ? (
        <aside className="mt-5 rounded-2xl border border-violet-400/20 bg-violet-400/10 p-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-violet-300">
              Modules 05–06 · Charging intelligence
            </p>
            <span className="rounded-full bg-violet-400/10 px-2.5 py-1 text-xs font-semibold text-violet-200">
              {routeEvaluation.chargingIntelligence.isSimulated ? "SIMULATED" : "LIVE"}
            </span>
          </div>
          {routeEvaluation.chargingIntelligence.required ? (
            routeEvaluation.chargingIntelligence.primary ? (
              <div className="mt-3 text-sm text-slate-200">
                <p>
                  Primary:{" "}
                  <Link
                    className="text-violet-300 underline decoration-dotted"
                    to={`/chargers/${routeEvaluation.chargingIntelligence.primary.chargerId}`}
                  >
                    {routeEvaluation.chargingIntelligence.primary.stationName}
                  </Link>{" "}
                  · {routeEvaluation.chargingIntelligence.primary.connectorType} ·{" "}
                  {routeEvaluation.chargingIntelligence.primary.powerKw} kW · reliability{" "}
                  {routeEvaluation.chargingIntelligence.primary.reliability.score}/100.
                </p>
                {routeEvaluation.chargingIntelligence.backup ? (
                  <p className="mt-2 text-slate-400">
                    Backup:{" "}
                    <Link
                      className="text-violet-300 underline decoration-dotted"
                      to={`/chargers/${routeEvaluation.chargingIntelligence.backup.chargerId}`}
                    >
                      {routeEvaluation.chargingIntelligence.backup.stationName}
                    </Link>{" "}
                    · {routeEvaluation.chargingIntelligence.backup.chargerId} · reliability{" "}
                    {routeEvaluation.chargingIntelligence.backup.reliability.score}/100.
                  </p>
                ) : (
                  <p className="mt-2 text-amber-300">No eligible backup charger is available.</p>
                )}
                <Link className="mt-3 inline-block text-sm text-volt-400" to="/journey/live">
                  Watch this journey live →
                </Link>
              </div>
            ) : (
              <p className="mt-3 text-sm text-amber-300">
                Charging is estimated to be required, but no reachable compatible charger is eligible.
              </p>
            )
          ) : (
            <p className="mt-3 text-sm text-slate-300">
              No charging stop is estimated to be required for the selected route.
            </p>
          )}
          <p className="mt-2 text-xs text-slate-400">
            {routeEvaluation.chargingIntelligence.disclaimer}
          </p>
        </aside>
      ) : null}

      {recommendation ? (
        <aside className="mt-5 rounded-2xl border border-cyan-400/20 bg-cyan-400/10 p-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-cyan-300">
              Module 08 · Unified recommendation
            </p>
            <span className="rounded-full bg-cyan-400/10 px-2.5 py-1 text-xs font-semibold text-cyan-200">
              {recommendation.sourceMode} · {recommendation.status}
            </span>
          </div>
          <p className="mt-3 text-base font-medium text-slate-100">
            Route: {recommendation.recommendedRouteName ?? "No eligible route"}
            {recommendation.recommendedChargerId
              ? ` · Charger: ${recommendation.recommendedChargerId}`
              : " · No charging stop"}
          </p>
          {recommendation.backupChargerId ? (
            <p className="mt-1 text-sm text-slate-300">
              Backup charger: {recommendation.backupChargerId}
            </p>
          ) : null}
          <dl className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {[
              ["Estimated ETA", recommendation.estimatedEtaMinutes === null ? "Not available" : `${recommendation.estimatedEtaMinutes} min`],
              ["Arrival SOC", recommendation.estimatedArrivalSocPercent === null ? "Not available" : `${recommendation.estimatedArrivalSocPercent}%`],
              ["Estimated wait", recommendation.estimatedWaitMinutes === null ? "Not available" : `${recommendation.estimatedWaitMinutes} min`],
              ["Estimated price", recommendation.estimatedPricePerKwh === null ? "Not available" : `₹${recommendation.estimatedPricePerKwh}/kWh`],
              ["Estimated charge cost", estimatedChargingCost === null ? "Not available" : `₹${estimatedChargingCost}`],
            ].map(([label, value]) => (
              <div key={label} className="rounded-xl bg-slate-950/30 p-3">
                <dt className="text-xs text-slate-400">{label}</dt>
                <dd className="mt-1 text-sm font-semibold text-slate-100">{value}</dd>
              </div>
            ))}
          </dl>
          <ul className="mt-3 space-y-1 text-sm text-slate-300">
            {recommendation.reasons.map((reason) => (
              <li key={reason}>• {reason}</li>
            ))}
          </ul>
          {recommendation.warnings.length > 0 ? (
            <ul className="mt-3 space-y-1 text-xs text-amber-200">
              {recommendation.warnings.map((warning) => (
                <li key={warning}>Warning: {warning}</li>
              ))}
            </ul>
          ) : null}
          {isReservableRecommendation(recommendation) ? (
            <Link
              className="mt-5 inline-flex rounded-xl bg-cyan-300 px-4 py-2 text-sm font-semibold text-slate-950 hover:text-slate-950"
              to="/journey/booking"
            >
              Reserve this demo charger
            </Link>
          ) : null}
          <p className="mt-3 text-xs text-slate-400">
            Wait, price, charging cost, range, and availability are simulated estimates—not guarantees.
          </p>
        </aside>
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
          <RouteCard
            key={route.routeId}
            route={route}
            diversification={routeEvaluation.diversification}
          />
        ))}
      </div>

      <Link className="mt-8 inline-block text-volt-400" to="/">
        Evaluate another journey
      </Link>
    </section>
  );
}
