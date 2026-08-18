import { Link } from "react-router-dom";
import { useJourneyStore } from "../../store/journey.store";

export function JourneyResult() {
  const recommendation = useJourneyStore((state) => state.recommendation);

  if (!recommendation) {
    return (
      <section>
        <h1 className="text-3xl font-semibold">No journey calculated yet</h1>
        <Link className="mt-4 inline-block text-volt-400" to="/">
          Return to planner
        </Link>
      </section>
    );
  }

  return (
    <section>
      <p className="text-sm uppercase tracking-[0.2em] text-volt-400">Recommendation ready</p>
      <h1 className="mt-2 text-4xl font-semibold">Your energy-aware journey</h1>
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        <article className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <p className="text-sm text-slate-400">Energy needed</p>
          <p className="mt-2 text-3xl font-semibold">{recommendation.energy.requiredKwh} kWh</p>
        </article>
        <article className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <p className="text-sm text-slate-400">Arrival battery</p>
          <p className="mt-2 text-3xl font-semibold">
            {recommendation.energy.projectedArrivalSocPercent}%
          </p>
        </article>
        <article className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <p className="text-sm text-slate-400">Charging stop</p>
          <p className="mt-2 text-xl font-semibold">
            {recommendation.recommendedStation?.name ?? "Not required"}
          </p>
        </article>
      </div>
      <p className="mt-6 text-slate-300">{recommendation.explanation}</p>
    </section>
  );
}
