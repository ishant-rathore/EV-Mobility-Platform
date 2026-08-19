import { type FormEvent, useState } from "react";
import { Link } from "react-router-dom";
import { useBookingFlow } from "../../hooks/useBookingFlow";
import { useJourneyStore } from "../../stores/journey.store";
import {
  estimateChargingCost,
  isReservableRecommendation,
  toLocalDateTimeInput,
} from "../../utils/booking";

const FIELD_CLASS = "mt-2 w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3";

function ProgressStep({ done, label }: { done: boolean; label: string }) {
  return (
    <li className={`flex items-center gap-2 ${done ? "text-emerald-300" : "text-slate-500"}`}>
      <span aria-hidden="true">{done ? "●" : "○"}</span>
      {label}
    </li>
  );
}

export function BookingFlow() {
  const routeEvaluation = useJourneyStore((state) => state.routeEvaluation);
  const flow = useBookingFlow();
  const [startsAt, setStartsAt] = useState(() =>
    toLocalDateTimeInput(new Date(Date.now() + 10 * 60_000)),
  );
  const [endsAt, setEndsAt] = useState(() =>
    toLocalDateTimeInput(new Date(Date.now() + 70 * 60_000)),
  );
  const [paymentRequired, setPaymentRequired] = useState(true);

  const recommendation = routeEvaluation?.recommendation;
  const reservable = isReservableRecommendation(recommendation);
  const estimatedCost = estimateChargingCost(
    routeEvaluation?.chargingIntelligence?.energyDeficitKwh ?? 0,
    recommendation?.estimatedPricePerKwh ?? null,
  );
  const paymentAmount = Math.max(1, estimatedCost ?? 200);

  function submitReservation(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!recommendation || !routeEvaluation?.vehicleSnapshot || !reservable) return;
    flow.create.mutate({
      recommendationId: recommendation.recommendationId,
      vehicleId: routeEvaluation.vehicleSnapshot.vehicleId,
      startsAt: new Date(startsAt).toISOString(),
      endsAt: new Date(endsAt).toISOString(),
      paymentRequired,
    });
  }

  if (!routeEvaluation || !recommendation || !reservable) {
    return (
      <section>
        <p className="text-sm uppercase tracking-[0.2em] text-volt-400">Module 10</p>
        <h1 className="mt-2 text-4xl font-semibold">No reservable recommendation</h1>
        <p className="mt-3 text-slate-400">Plan a journey with an eligible charger before booking.</p>
        <Link className="mt-5 inline-block text-volt-400" to="/">
          Return to journey planner
        </Link>
      </section>
    );
  }

  const paymentComplete = !flow.reservation?.paymentRequired || flow.payment?.status === "APPROVED";
  const accessReady = Boolean(
    flow.reservation?.parkingBayId
    && (flow.reservation.status === "CONFIRMED" || flow.reservation.status === "ACTIVE"),
  );

  return (
    <section>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-volt-400">Module 10 · Driver flow</p>
          <h1 className="mt-2 text-4xl font-semibold">Reserve, pay and access</h1>
          <p className="mt-3 max-w-3xl text-slate-400">
            Complete the simulated journey handoff without entering card details or controlling live hardware.
          </p>
        </div>
        <span className="rounded-full bg-violet-400/15 px-3 py-1 text-sm font-semibold text-violet-200">
          DEMO · SIMULATED
        </span>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="space-y-6">
          <article className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <h2 className="text-lg font-semibold">Recommended booking</h2>
            <dl className="mt-4 grid gap-4 sm:grid-cols-2">
              <div><dt className="text-xs text-slate-500">Route</dt><dd>{recommendation.recommendedRouteName}</dd></div>
              <div><dt className="text-xs text-slate-500">Charger</dt><dd>{recommendation.recommendedChargerId}</dd></div>
              <div><dt className="text-xs text-slate-500">Estimated wait</dt><dd>{recommendation.estimatedWaitMinutes ?? "—"} min</dd></div>
              <div><dt className="text-xs text-slate-500">Estimated charging cost</dt><dd>₹{paymentAmount}</dd></div>
            </dl>
          </article>

          {!flow.reservation ? (
            <form className="rounded-2xl border border-white/10 bg-white/5 p-5" onSubmit={submitReservation}>
              <h2 className="text-lg font-semibold">Reservation window</h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <label className="text-sm text-slate-300">
                  Starts at
                  <input className={FIELD_CLASS} type="datetime-local" value={startsAt} onChange={(event) => setStartsAt(event.target.value)} required />
                </label>
                <label className="text-sm text-slate-300">
                  Ends at
                  <input className={FIELD_CLASS} type="datetime-local" value={endsAt} onChange={(event) => setEndsAt(event.target.value)} required />
                </label>
              </div>
              <label className="mt-4 flex items-start gap-3 text-sm text-slate-300">
                <input className="mt-1" type="checkbox" checked={paymentRequired} onChange={(event) => setPaymentRequired(event.target.checked)} />
                Include simulated payment. No card or bank information is collected.
              </label>
              <button className="mt-5 rounded-xl bg-volt-500 px-4 py-3 font-semibold text-slate-950 disabled:opacity-50" type="submit" disabled={flow.create.isPending}>
                {flow.create.isPending ? "Creating reservation…" : "Create demo reservation"}
              </button>
            </form>
          ) : (
            <article className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-5">
              <div className="flex flex-wrap justify-between gap-2">
                <h2 className="text-lg font-semibold">Reservation created</h2>
                <span className="text-sm font-semibold text-emerald-300">{flow.reservation.status}</span>
              </div>
              <p className="mt-2 text-sm text-slate-300">Reference: {flow.reservation.id}</p>
              <p className="mt-1 text-sm text-slate-300">Parking bay: {flow.reservation.parkingBayId ?? "Not assigned"}</p>
              {flow.reservation.warnings.map((warning) => <p key={warning} className="mt-2 text-xs text-amber-200">{warning}</p>)}
            </article>
          )}

          {flow.reservation?.paymentRequired && !flow.payment ? (
            <article className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <h2 className="text-lg font-semibold">Simulated payment</h2>
              <p className="mt-2 text-sm text-slate-400">Approve ₹{paymentAmount}. No money moves and no payment credentials are requested.</p>
              <button className="mt-4 rounded-xl bg-cyan-300 px-4 py-2 font-semibold text-slate-950 disabled:opacity-50" type="button" disabled={flow.pay.isPending} onClick={() => flow.pay.mutate({ reservationId: flow.reservation!.id, amount: paymentAmount })}>
                {flow.pay.isPending ? "Approving…" : "Approve simulated payment"}
              </button>
            </article>
          ) : null}

          {flow.reservation && paymentComplete ? (
            <article className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <h2 className="text-lg font-semibold">Parking access and occupancy</h2>
              <p className="mt-2 text-sm text-slate-400">Commands below affect only the low-voltage simulator.</p>
              <div className="mt-4 flex flex-wrap gap-3">
                <button className="rounded-xl border border-white/10 px-4 py-2 text-sm disabled:opacity-40" type="button" disabled={!accessReady || flow.unlock.isPending} onClick={() => flow.unlock.mutate(flow.reservation!.id)}>
                  {flow.unlock.isPending ? "Unlocking…" : "Unlock demo bay"}
                </button>
                <button className="rounded-xl border border-white/10 px-4 py-2 text-sm disabled:opacity-40" type="button" disabled={!accessReady || flow.recordOccupancy.isPending} onClick={() => flow.recordOccupancy.mutate({ reservationId: flow.reservation!.id, occupied: true })}>
                  Mark vehicle arrived
                </button>
                <button className="rounded-xl border border-white/10 px-4 py-2 text-sm disabled:opacity-40" type="button" disabled={flow.reservation.status !== "ACTIVE" || flow.recordOccupancy.isPending} onClick={() => flow.recordOccupancy.mutate({ reservationId: flow.reservation!.id, occupied: false })}>
                  Mark bay clear
                </button>
              </div>
              {flow.access ? <p className="mt-3 text-sm text-emerald-300">Access command acknowledged by {flow.access.deviceId}.</p> : null}
              {flow.occupancy ? <p className="mt-2 text-sm text-cyan-200">Bay occupancy: {flow.occupancy.occupied ? "OCCUPIED" : "CLEAR"} · SIMULATED{flow.occupancy.occupied ? "" : " · session completion is future scope"}</p> : null}
            </article>
          ) : null}

          {flow.error ? <p role="alert" className="rounded-xl border border-red-400/20 bg-red-400/10 p-4 text-sm text-red-200">{flow.error.message}</p> : null}
        </div>

        <aside className="space-y-6">
          <article className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <h2 className="text-lg font-semibold">Journey progress</h2>
            <ol className="mt-4 space-y-3 text-sm">
              <ProgressStep done label="Recommendation ready" />
              <ProgressStep done={Boolean(flow.reservation)} label="Reservation created" />
              <ProgressStep done={Boolean(flow.reservation && paymentComplete)} label="Payment complete or not required" />
              <ProgressStep done={Boolean(flow.access)} label="Demo parking access acknowledged" />
              <ProgressStep done={flow.occupancy?.occupied === true} label="Vehicle arrival recorded" />
            </ol>
          </article>

          <article className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <h2 className="text-lg font-semibold">Recent demo reservations</h2>
            {flow.historyLoading ? <p className="mt-3 text-sm text-slate-400">Loading history…</p> : null}
            {flow.history.length === 0 && !flow.historyLoading ? <p className="mt-3 text-sm text-slate-400">No previous reservations in this API process.</p> : null}
            <ul className="mt-3 space-y-3">
              {flow.history.slice(0, 5).map((item) => (
                <li key={item.id} className="rounded-xl bg-slate-950/30 p-3 text-sm">
                  <p className="font-medium">{item.chargerId}</p>
                  <p className="mt-1 text-xs text-slate-400">{item.status} · {new Date(item.startsAt).toLocaleString()}</p>
                </li>
              ))}
            </ul>
          </article>
        </aside>
      </div>

      <div className="mt-8 flex gap-5 text-sm">
        <Link className="text-volt-400" to="/journey/live">Open live journey</Link>
        <Link className="text-slate-400" to="/journey/result">Back to recommendation</Link>
      </div>
    </section>
  );
}
