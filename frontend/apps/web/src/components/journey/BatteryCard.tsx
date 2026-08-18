import type { EvProfileSummary } from "../../types/ev";

interface BatteryCardProps {
  vehicle: EvProfileSummary;
}

/**
 * Always shows SOC and the reserve band distinctly (UI Rules §15.2/§15.9) —
 * the reserve segment is rendered as its own bar section, not a tooltip.
 */
export function BatteryCard({ vehicle }: BatteryCardProps) {
  const socWidth = Math.min(100, Math.max(0, vehicle.currentSocPercent));
  const reserveWidth = Math.min(100, Math.max(0, vehicle.reserveSocPercent));

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
      <div className="flex items-baseline justify-between">
        <p className="text-sm text-slate-400">Battery</p>
        <p className="text-2xl font-semibold">{vehicle.currentSocPercent}%</p>
      </div>

      <div className="relative mt-3 h-3 w-full overflow-hidden rounded-full bg-slate-800">
        <div className="absolute inset-y-0 left-0 bg-volt-500" style={{ width: `${socWidth}%` }} />
        <div
          className="absolute inset-y-0 left-0 border-r-2 border-amber-400"
          style={{ width: `${reserveWidth}%` }}
          title={`Safety reserve: ${vehicle.reserveSocPercent}%`}
        />
      </div>
      <p className="mt-1 text-xs text-slate-500">Amber line marks the {vehicle.reserveSocPercent}% safety reserve</p>

      <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
        <div>
          <dt className="text-slate-400">Available energy</dt>
          <dd className="font-medium">{vehicle.availableEnergyKwh.toFixed(1)} kWh</dd>
        </div>
        <div>
          <dt className="text-slate-400">Above reserve</dt>
          <dd className="font-medium">{vehicle.usableAboveReserveKwh.toFixed(1)} kWh</dd>
        </div>
        <div>
          <dt className="text-slate-400">Estimated range</dt>
          <dd className="font-medium">{vehicle.estimatedRangeKm} km</dd>
        </div>
        <div>
          <dt className="text-slate-400">Estimated range to reserve</dt>
          <dd className="font-medium">{vehicle.rangeToReserveKm} km</dd>
        </div>
      </dl>

      {vehicle.sourceMode === "DEMO" ? (
        <p className="mt-3 text-xs uppercase tracking-wide text-slate-500">Demo data</p>
      ) : null}
    </div>
  );
}
