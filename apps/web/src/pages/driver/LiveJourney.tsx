import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useJourneyStore } from "../../stores/journey.store";
import { useJourneyPlan } from "../../hooks/useJourneyPlan";
import { useLiveChargerEvents } from "../../hooks/useLiveChargerEvents";

export function LiveJourney() {
  const routeEvaluation = useJourneyStore((state) => state.routeEvaluation);
  const lastRequest = useJourneyStore((state) => state.lastRequest);
  const journeyPlan = useJourneyPlan();

  const primaryChargerId =
    routeEvaluation?.recommendation?.recommendedChargerId ??
    routeEvaluation?.chargingIntelligence?.primary?.chargerId ??
    null;
  const backupChargerId =
    routeEvaluation?.recommendation?.backupChargerId ??
    routeEvaluation?.chargingIntelligence?.backup?.chargerId ??
    null;
  const watchedChargerIds = [primaryChargerId, backupChargerId].filter(
    (id): id is string => id !== null,
  );

  const { events, connected } = useLiveChargerEvents(watchedChargerIds);
  const primaryFaultEvent = events.find(
    (event) => event.kind === "fault" && event.chargerId === primaryChargerId,
  );

  const [promotionNotice, setPromotionNotice] = useState<string | null>(null);
  const handledFaultAt = useRef<string | null>(null);

  useEffect(() => {
    if (!primaryFaultEvent || !lastRequest) return;
    if (handledFaultAt.current === primaryFaultEvent.receivedAt) return;
    handledFaultAt.current = primaryFaultEvent.receivedAt;

    const faultedChargerId = primaryFaultEvent.chargerId;
    journeyPlan.mutate(lastRequest, {
      onSuccess: (updated) => {
        const newPrimaryChargerId =
          updated.recommendation?.recommendedChargerId ??
          updated.chargingIntelligence?.primary?.chargerId ??
          null;
        setPromotionNotice(
          newPrimaryChargerId && newPrimaryChargerId !== faultedChargerId
            ? `Backup charger ${newPrimaryChargerId} was promoted to primary after a fault on ${faultedChargerId}.`
            : `Charger ${faultedChargerId} faulted, but no eligible backup was available — recommendation refreshed.`,
        );
      },
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      onError: () => {},
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [primaryFaultEvent, lastRequest]);

  if (!routeEvaluation) {
    return (
      <section>
        <h1 className="text-3xl font-semibold">No journey in progress</h1>
        <p className="mt-2 text-slate-400">Evaluate a journey first to start live monitoring.</p>
        <Link className="mt-4 inline-block text-volt-400" to="/">
          Plan a journey
        </Link>
      </section>
    );
  }

  return (
    <section>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-semibold">Live journey monitoring</h1>
          <p className="mt-2 text-slate-400">
            {routeEvaluation.origin.label} to {routeEvaluation.destination.label}
          </p>
        </div>
        <span
          className={`rounded-full px-3 py-1 text-sm font-semibold ${
            connected ? "bg-emerald-400/15 text-emerald-300" : "bg-slate-400/15 text-slate-300"
          }`}
        >
          {connected ? "Live" : "Connecting…"}
        </span>
      </div>

      {journeyPlan.isPending ? (
        <p className="mt-5 rounded-xl border border-cyan-400/20 bg-cyan-400/10 p-3 text-sm text-cyan-200">
          A charger fault was detected — recomputing the recommendation (Module 8)…
        </p>
      ) : null}

      {!journeyPlan.isPending && promotionNotice ? (
        <p className="mt-5 rounded-xl border border-volt-400/20 bg-volt-400/10 p-3 text-sm text-volt-200">
          {promotionNotice}
        </p>
      ) : null}

      {watchedChargerIds.length === 0 ? (
        <p className="mt-6 text-sm text-slate-400">
          This journey has no recommended charger to monitor.
        </p>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {primaryChargerId ? (
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <p className="text-xs uppercase tracking-[0.18em] text-volt-400">Primary charger</p>
              <Link
                className="mt-1 block text-lg font-semibold text-slate-100 hover:text-volt-400"
                to={`/chargers/${primaryChargerId}`}
              >
                {primaryChargerId}
              </Link>
              <p className="mt-3 text-sm text-slate-400">No faults reported yet.</p>
            </div>
          ) : null}

          {backupChargerId ? (
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Backup charger</p>
              <Link
                className="mt-1 block text-lg font-semibold text-slate-100 hover:text-volt-400"
                to={`/chargers/${backupChargerId}`}
              >
                {backupChargerId}
              </Link>
              <p className="mt-3 text-sm text-slate-400">On standby.</p>
            </div>
          ) : null}
        </div>
      )}

      <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-5">
        <h2 className="text-lg font-semibold">Live event feed</h2>
        {events.length === 0 ? (
          <p className="mt-2 text-sm text-slate-400">
            Waiting for telemetry — trigger a state change from the demo controls to see updates
            here.
          </p>
        ) : (
          <ul className="mt-3 space-y-2 text-sm">
            {events.map((event, index) => (
              <li
                key={`${event.chargerId}-${event.receivedAt}-${index}`}
                className={event.kind === "fault" ? "text-red-300" : "text-slate-300"}
              >
                {new Date(event.receivedAt).toLocaleTimeString()} · {event.chargerId} ·{" "}
                {event.kind === "fault"
                  ? "Fault reported"
                  : `Status ${event.telemetry?.status} · ${
                      event.telemetry?.temperatureCelsius === undefined
                        ? "temperature not supplied"
                        : `${event.telemetry.temperatureCelsius}°C`
                    }`}
              </li>
            ))}
          </ul>
        )}
      </div>

      <Link className="mt-8 inline-block text-volt-400" to="/journey/result">
        Back to route result
      </Link>
    </section>
  );
}
