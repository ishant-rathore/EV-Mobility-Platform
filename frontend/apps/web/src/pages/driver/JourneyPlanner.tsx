import { type FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useJourneyPlan } from "../../hooks/useJourneyPlan";

export function JourneyPlanner() {
  const navigate = useNavigate();
  const journey = useJourneyPlan();
  const [distanceKm, setDistanceKm] = useState(120);
  const [soc, setSoc] = useState(55);

  async function submit(event: FormEvent) {
    event.preventDefault();
    await journey.mutateAsync({
      distanceKm,
      batteryCapacityKwh: 45,
      efficiencyWhPerKm: 170,
      currentSocPercent: soc,
      reserveSocPercent: 15,
    });
    navigate("/journey/result");
  }

  return (
    <section className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
      <div>
        <p className="mb-3 text-sm font-medium uppercase tracking-[0.25em] text-volt-400">
          EV mobility intelligence
        </p>
        <h1 className="max-w-3xl text-5xl font-semibold leading-tight">
          Plan the route, charging stop, and energy reserve together.
        </h1>
        <p className="mt-5 max-w-2xl text-lg text-slate-400">
          VoltTwin combines battery state, traffic conditions, charger reliability, and live
          telemetry in one recommendation.
        </p>
      </div>

      <form onSubmit={submit} className="rounded-3xl border border-white/10 bg-white/5 p-6">
        <label className="block text-sm text-slate-300">
          Journey distance (km)
          <input
            className="mt-2 w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3"
            type="number"
            min="1"
            value={distanceKm}
            onChange={(event) => setDistanceKm(Number(event.target.value))}
          />
        </label>
        <label className="mt-5 block text-sm text-slate-300">
          Current battery (%)
          <input
            className="mt-2 w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3"
            type="number"
            min="0"
            max="100"
            value={soc}
            onChange={(event) => setSoc(Number(event.target.value))}
          />
        </label>
        <button
          className="mt-6 w-full rounded-xl bg-volt-500 px-4 py-3 font-semibold text-slate-950 disabled:opacity-50"
          disabled={journey.isPending}
        >
          {journey.isPending ? "Calculating…" : "Build smart journey"}
        </button>
        {journey.error && <p className="mt-3 text-sm text-red-300">{journey.error.message}</p>}
      </form>
    </section>
  );
}
