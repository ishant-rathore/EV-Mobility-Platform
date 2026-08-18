const metrics = [
  ["Active chargers", "42"],
  ["Available connectors", "28"],
  ["Network reliability", "93%"],
  ["Traffic alerts", "3"],
];

export function DigitalTwin() {
  return (
    <section>
      <p className="text-sm uppercase tracking-[0.2em] text-volt-400">Operator view</p>
      <h1 className="mt-2 text-4xl font-semibold">Mobility digital twin</h1>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map(([label, value]) => (
          <article key={label} className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <p className="text-sm text-slate-400">{label}</p>
            <p className="mt-2 text-3xl font-semibold">{value}</p>
          </article>
        ))}
      </div>
      <div className="mt-6 min-h-80 rounded-3xl border border-dashed border-white/15 bg-gradient-to-br from-volt-900/40 to-slate-900 p-6 text-slate-400">
        Live traffic, station, and journey map surface
      </div>
    </section>
  );
}
