import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useOperatorDashboard } from "../../hooks/useOperatorDashboard";

export function Analytics() {
  const dashboard = useOperatorDashboard();
  const trafficData = dashboard.routes.map((route) => ({
    name: route.name.replace(/\s*\(.+\)$/, ""),
    current: Math.round((route.totalCurrentLoad / route.totalCapacity) * 100),
    predicted: Math.round((route.totalPredictedLoad / route.totalCapacity) * 100),
  }));
  const completed = dashboard.reservations.filter((reservation) => reservation.status === "COMPLETED").length;
  const active = dashboard.reservations.filter((reservation) => reservation.status === "ACTIVE").length;

  return (
    <section>
      <p className="text-sm uppercase tracking-[0.2em] text-volt-400">Module 11 · Analytics</p>
      <h1 className="mt-2 text-4xl font-semibold">Mobility analytics</h1>
      <p className="mt-3 text-slate-400">Operational demo metrics only; no production revenue or utilization claims.</p>
      <div className="mt-7 grid gap-4 sm:grid-cols-3">
        {[["Reservations in process", dashboard.reservations.length], ["Active sessions", active], ["Completed sessions", completed]].map(([label, value]) => <article key={label} className="rounded-2xl border border-white/10 bg-white/5 p-5"><p className="text-sm text-slate-400">{label}</p><p className="mt-2 text-3xl font-semibold">{value}</p><p className="mt-1 text-xs text-violet-200">SIMULATED</p></article>)}
      </div>
      <article className="mt-7 rounded-2xl border border-white/10 bg-white/5 p-5">
        <h2 className="text-lg font-semibold">Current vs predicted route utilization</h2>
        {trafficData.length ? <div className="mt-5 h-80" aria-label="Demo route utilization chart"><ResponsiveContainer width="100%" height="100%"><BarChart data={trafficData}><CartesianGrid strokeDasharray="3 3" stroke="#334155" /><XAxis dataKey="name" stroke="#94a3b8" tick={{ fontSize: 11 }} /><YAxis unit="%" stroke="#94a3b8" /><Tooltip contentStyle={{ background: "#111827", border: "1px solid #334155" }} /><Legend /><Bar dataKey="current" name="Current %" fill="#06b6d4" radius={[4, 4, 0, 0]} /><Bar dataKey="predicted" name="Predicted %" fill="#8b5cf6" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></div> : <p className="mt-4 text-sm text-slate-400">Traffic data is unavailable.</p>}
      </article>
    </section>
  );
}
