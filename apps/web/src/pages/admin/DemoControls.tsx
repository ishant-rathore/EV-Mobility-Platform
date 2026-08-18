import { useState } from "react";
import { useDemoControls } from "../../hooks/useDemoControls";
import type { DemoSourceMode } from "../../types/demo-control";

interface ControlButtonProps {
  label: string;
  disabled: boolean;
  onClick: () => void;
  tone?: "default" | "danger";
}

function ControlButton({ label, disabled, onClick, tone = "default" }: ControlButtonProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`rounded-xl border px-4 py-3 text-left text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-40 ${
        tone === "danger"
          ? "border-red-400/30 bg-red-400/10 text-red-200 hover:bg-red-400/15"
          : "border-white/10 bg-white/5 text-slate-100 hover:border-volt-400/40 hover:bg-white/10"
      }`}
    >
      {label}
    </button>
  );
}

const MODES: DemoSourceMode[] = ["REAL", "DEMO", "SIMULATOR"];

export function DemoControls() {
  const { snapshot, action } = useDemoControls();
  const [resetArmed, setResetArmed] = useState(false);
  const data = snapshot.data;
  const frozen = data?.runtime.frozen ?? false;
  const busy = action.isPending;
  const routeA = data?.routes.find((route) => route.routeId === "route-north");
  const routeB = data?.routes.find((route) => route.routeId === "route-central");

  function run(label: string, path: string, body: Record<string, unknown>) {
    setResetArmed(false);
    action.mutate({ label, path, body });
  }

  return (
    <section>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-volt-400">Module 12 · Admin</p>
          <h1 className="mt-2 text-4xl font-semibold">Demo and simulation control</h1>
          <p className="mt-3 max-w-3xl text-slate-400">
            Run repeatable presentation scenarios without controlling public roads, real payments, or high-voltage hardware.
          </p>
        </div>
        <span className={`rounded-full px-3 py-1 text-sm font-semibold ${frozen ? "bg-cyan-400/15 text-cyan-200" : "bg-emerald-400/15 text-emerald-300"}`}>
          {frozen ? "Screenshot freeze" : "Updates active"}
        </span>
      </div>

      {snapshot.isLoading ? <p className="mt-6 text-slate-400">Loading demo runtime…</p> : null}
      {snapshot.error ? <p role="alert" className="mt-6 rounded-xl border border-red-400/20 bg-red-400/10 p-4 text-red-200">{snapshot.error.message}</p> : null}
      {action.error ? <p role="alert" className="mt-6 rounded-xl border border-amber-400/20 bg-amber-400/10 p-4 text-amber-200">{action.error.message}</p> : null}
      {action.isSuccess ? <p role="status" className="mt-6 rounded-xl border border-emerald-400/20 bg-emerald-400/10 p-4 text-emerald-200">Completed: {data?.runtime.lastAction}</p> : null}

      {data ? (
        <>
          <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <article className="rounded-2xl border border-white/10 bg-white/5 p-4"><p className="text-xs text-slate-500">Requested mode</p><p className="mt-2 text-xl font-semibold">{data.runtime.requestedMode}</p></article>
            <article className="rounded-2xl border border-white/10 bg-white/5 p-4"><p className="text-xs text-slate-500">Effective mode</p><p className="mt-2 text-xl font-semibold">{data.runtime.effectiveMode}</p></article>
            <article className="rounded-2xl border border-white/10 bg-white/5 p-4"><p className="text-xs text-slate-500">Telemetry snapshots</p><p className="mt-2 text-xl font-semibold">{data.telemetry.length}</p></article>
            <article className="rounded-2xl border border-white/10 bg-white/5 p-4"><p className="text-xs text-slate-500">Last vehicle batch</p><p className="mt-2 text-xl font-semibold">{data.lastBatch?.requestCount ?? 0}</p></article>
          </div>

          {data.runtime.warnings.map((warning) => <p key={warning} className="mt-4 rounded-xl border border-amber-400/20 bg-amber-400/10 p-4 text-sm text-amber-200">{warning}</p>)}

          <div className="mt-7 grid gap-6 lg:grid-cols-2">
            <article className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <h2 className="text-lg font-semibold">1. Source mode</h2>
              <p className="mt-1 text-sm text-slate-400">REAL safely falls back to DEMO until a verified provider exists.</p>
              <div className="mt-4 grid grid-cols-3 gap-3">
                {MODES.map((mode) => <ControlButton key={mode} label={mode} disabled={busy || data.runtime.requestedMode === mode} onClick={() => run(`Switch to ${mode}`, "/mode", { mode })} />)}
              </div>
            </article>

            <article className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <h2 className="text-lg font-semibold">2. Presentation state</h2>
              <p className="mt-1 text-sm text-slate-400">Freeze suppresses new telemetry and scenario mutations for stable screenshots.</p>
              <div className="mt-4 grid grid-cols-2 gap-3">
                <ControlButton label="Freeze data" disabled={busy || frozen} onClick={() => run("Freeze data", "/freeze", { frozen: true })} />
                <ControlButton label="Resume updates" disabled={busy || !frozen} onClick={() => run("Resume updates", "/freeze", { frozen: false })} />
              </div>
            </article>

            <article className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <h2 className="text-lg font-semibold">3. Traffic scenarios</h2>
              <p className="mt-1 text-sm text-slate-400">Route A: {routeA?.name}. Route B: {routeB?.name}.</p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <ControlButton label="Set Route A traffic HIGH" disabled={busy || frozen} onClick={() => run("Route A HIGH", "/traffic", { routeId: "route-north", level: "HIGH" })} />
                <ControlButton label="Set Route B traffic MEDIUM" disabled={busy || frozen} onClick={() => run("Route B MEDIUM", "/traffic", { routeId: "route-central", level: "MEDIUM" })} />
              </div>
            </article>

            <article className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <h2 className="text-lg font-semibold">4. Charger scenarios</h2>
              <p className="mt-1 text-sm text-slate-400">Target: charger-demo-1-ccs2. Every injected event is labelled SIMULATOR.</p>
              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                <ControlButton label="Start charging" disabled={busy || frozen} onClick={() => run("Charger charging", "/charger", { action: "CHARGING" })} />
                <ControlButton label="Trigger fault" disabled={busy || frozen} tone="danger" onClick={() => run("Charger fault", "/charger", { action: "FAULT" })} />
                <ControlButton label="Restore charger" disabled={busy || frozen} onClick={() => run("Restore charger", "/charger", { action: "RESTORE" })} />
              </div>
            </article>

            <article className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <h2 className="text-lg font-semibold">5. Vehicle-request batch</h2>
              <p className="mt-1 text-sm text-slate-400">Runs 20 advisory requests through the capacity-aware traffic simulation.</p>
              <div className="mt-4"><ControlButton label="Run 20 vehicle requests" disabled={busy || frozen} onClick={() => run("Vehicle request batch", "/vehicle-batch", { requestCount: 20, demandUnitsPerRequest: 20, vehicleClasses: ["CAR", "BIKE", "TRUCK", "COMMERCIAL"] })} /></div>
              {data.lastBatch ? <p className="mt-3 text-sm text-slate-300">Diversified overload: {data.lastBatch.diversified.overloadedRoutes} route(s); maximum utilization {data.lastBatch.diversified.maximumUtilizationPercent}%.</p> : null}
            </article>

            <article className="rounded-2xl border border-red-400/20 bg-red-400/5 p-5">
              <h2 className="text-lg font-semibold">6. Reset all demo state</h2>
              <p className="mt-1 text-sm text-slate-400">Clears process-local scenarios, reservations, simulated payments, telemetry, and access events. PostgreSQL is untouched.</p>
              <div className="mt-4">
                {resetArmed ? (
                  <ControlButton label="Confirm RESET_DEMO" tone="danger" disabled={busy} onClick={() => run("Reset all demo state", "/reset", { confirm: "RESET_DEMO" })} />
                ) : (
                  <ControlButton label="Arm demo reset" tone="danger" disabled={busy} onClick={() => setResetArmed(true)} />
                )}
              </div>
            </article>
          </div>

          <p className="mt-6 text-xs text-slate-500">{data.disclaimer}</p>
          {busy ? <p role="status" className="mt-2 text-sm text-cyan-200">Running: {action.variables?.label}…</p> : null}
        </>
      ) : null}
    </section>
  );
}
