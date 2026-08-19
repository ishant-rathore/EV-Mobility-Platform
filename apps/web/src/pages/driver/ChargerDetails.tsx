import { Link, useParams } from "react-router-dom";
import { useChargerDetail } from "../../hooks/useChargerDetail";

const STATUS_STYLES: Record<string, string> = {
  AVAILABLE: "bg-emerald-400/15 text-emerald-300",
  CHARGING: "bg-sky-400/15 text-sky-300",
  CONNECTED: "bg-sky-400/15 text-sky-300",
  CONNECTED_NOT_CHARGING: "bg-sky-400/15 text-sky-300",
  OCCUPIED: "bg-amber-400/15 text-amber-300",
  FAULT: "bg-red-400/15 text-red-300",
  FAULTED: "bg-red-400/15 text-red-300",
  OFFLINE: "bg-slate-400/15 text-slate-300",
};

export function ChargerDetails() {
  const { chargerId } = useParams<{ chargerId: string }>();
  const { data: charger, isLoading, isError } = useChargerDetail(chargerId);

  if (isLoading) {
    return <p className="text-slate-400">Loading charger…</p>;
  }

  if (isError || !charger) {
    return (
      <section>
        <h1 className="text-3xl font-semibold">Charger not found</h1>
        <p className="mt-2 text-slate-400">
          {chargerId ? `No charger matches "${chargerId}".` : "No charger was specified."}
        </p>
        <Link className="mt-4 inline-block text-volt-400" to="/">
          Return to planner
        </Link>
      </section>
    );
  }

  const { reliability } = charger;

  return (
    <section>
      <p className="text-sm uppercase tracking-[0.2em] text-volt-400">{charger.stationName}</p>
      <div className="mt-2 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-semibold">{charger.chargerId}</h1>
          <p className="mt-2 text-slate-400">
            {charger.connectorType} · {charger.powerKw} kW · ₹{charger.pricePerKwh}/kWh
          </p>
        </div>
        <span
          className={`rounded-full px-3 py-1 text-sm font-semibold ${
            STATUS_STYLES[charger.status] ?? "bg-slate-400/15 text-slate-300"
          }`}
        >
          {charger.status}
        </span>
      </div>

      <p className="mt-4 text-sm text-slate-400">
        Source: {charger.stationSourceMode}
        {charger.isSimulated ? " · simulated" : ""} · est. wait {charger.estimatedWaitMinutes} min
        {charger.detourKm > 0 ? ` · ${charger.detourKm} km detour` : ""}
      </p>

      <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-6">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-lg font-semibold">Reliability</h2>
          <span className="rounded-full bg-cyan-400/10 px-2.5 py-1 text-xs font-semibold text-cyan-200">
            Grade {reliability.grade} · {reliability.score}/100
          </span>
        </div>
        <p className="mt-2 text-sm text-slate-300">
          {reliability.recommendation} · {reliability.freshness.toLowerCase()} data ·{" "}
          {reliability.confidencePercent}% confidence
        </p>

        {reliability.reasons.length > 0 ? (
          <ul className="mt-3 space-y-1 text-sm text-slate-400">
            {reliability.reasons.map((reason) => (
              <li key={reason}>• {reason}</li>
            ))}
          </ul>
        ) : null}

        {reliability.warnings.length > 0 ? (
          <ul className="mt-3 space-y-1 text-xs text-amber-200">
            {reliability.warnings.map((warning) => (
              <li key={warning}>Warning: {warning}</li>
            ))}
          </ul>
        ) : null}

        {reliability.invalidatedBy.length > 0 ? (
          <p className="mt-3 text-xs text-red-300">
            Invalidated by: {reliability.invalidatedBy.join(", ")}
          </p>
        ) : null}

        <p className="mt-4 text-xs text-slate-500">
          Prototype heuristic — not a certified safety score or availability guarantee.
        </p>
      </div>

      {!charger.eligible && charger.exclusionReasons.length > 0 ? (
        <div className="mt-5 rounded-xl border border-amber-400/20 bg-amber-400/10 p-4 text-sm text-amber-200">
          Not eligible for the current journey: {charger.exclusionReasons.join(", ")}
        </div>
      ) : null}

      <div className="mt-8 flex flex-wrap gap-4">
        <Link className="text-volt-400" to="/journey/live">
          Watch this charger live
        </Link>
        <Link className="text-slate-400" to="/">
          Evaluate another journey
        </Link>
      </div>
    </section>
  );
}
