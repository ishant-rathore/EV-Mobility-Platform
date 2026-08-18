import type { EvProfileSummary } from "../../types/ev";

interface VehicleSelectorProps {
  vehicles: EvProfileSummary[];
  selectedVehicleId: string | null;
  onSelect: (vehicleId: string) => void;
  isLoading?: boolean;
}

const CLASS_LABEL: Record<EvProfileSummary["vehicleClass"], string> = {
  CAR: "Car",
  BIKE: "Bike",
  TRUCK: "Truck",
  COMMERCIAL: "Commercial",
};

/** Lets the driver pick which saved EV the journey should be planned for. */
export function VehicleSelector({
  vehicles,
  selectedVehicleId,
  onSelect,
  isLoading,
}: VehicleSelectorProps) {
  if (isLoading) {
    return <p className="text-sm text-slate-400">Loading vehicles…</p>;
  }

  if (vehicles.length === 0) {
    return <p className="text-sm text-slate-400">No saved vehicles yet.</p>;
  }

  return (
    <label className="block text-sm text-slate-300">
      Vehicle
      <select
        className="mt-2 w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3"
        value={selectedVehicleId ?? ""}
        onChange={(event) => onSelect(event.target.value)}
      >
        {vehicles.map((vehicle) => (
          <option key={vehicle.vehicleId} value={vehicle.vehicleId}>
            {vehicle.name} — {CLASS_LABEL[vehicle.vehicleClass]} · {vehicle.connectorTypes.join("/")}
          </option>
        ))}
      </select>
    </label>
  );
}
