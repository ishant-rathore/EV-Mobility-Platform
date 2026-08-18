import { type FormEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BatteryCard } from "../../components/journey/BatteryCard";
import { VehicleSelector } from "../../components/journey/VehicleSelector";
import { useEvVehicles } from "../../hooks/useEvVehicles";
import { useJourneyPlan } from "../../hooks/useJourneyPlan";
import type { RouteLocation } from "../../types/journey";

const DEMO_LOCATIONS: RouteLocation[] = [
  { label: "Mumbai Central", latitude: 18.969, longitude: 72.8194 },
  { label: "Navi Mumbai", latitude: 19.033, longitude: 73.0297 },
  { label: "Pune", latitude: 18.5204, longitude: 73.8567 },
];

export function JourneyPlanner() {
  const navigate = useNavigate();
  const journey = useJourneyPlan();
  const vehiclesQuery = useEvVehicles();
  const vehicles = vehiclesQuery.data ?? [];
  const [originIndex, setOriginIndex] = useState(0);
  const [destinationIndex, setDestinationIndex] = useState(2);
  const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>(null);
  const [soc, setSoc] = useState(55);
  const [reserveSoc, setReserveSoc] = useState(15);
  const [weatherCondition, setWeatherCondition] = useState<"CLEAR" | "RAIN" | "HOT" | "COLD">(
    "CLEAR",
  );
  const [provider, setProvider] = useState<"DEMO" | "AUTO">("DEMO");
  const [formError, setFormError] = useState<string | null>(null);

  const selectedVehicle =
    vehicles.find((vehicle) => vehicle.vehicleId === selectedVehicleId) ?? vehicles[0] ?? null;

  // Once vehicles load, default to the saved vehicle and seed SOC/reserve from
  // its real battery state instead of the previous hardcoded stub.
  useEffect(() => {
    if (selectedVehicleId || vehicles.length === 0) return;
    const initial = vehicles.find((vehicle) => vehicle.isDefault) ?? vehicles[0];
    if (!initial) return;
    setSelectedVehicleId(initial.vehicleId);
    setSoc(initial.currentSocPercent);
    setReserveSoc(initial.reserveSocPercent);
  }, [selectedVehicleId, vehicles]);

  function selectVehicle(vehicleId: string) {
    setSelectedVehicleId(vehicleId);
    const vehicle = vehicles.find((candidate) => candidate.vehicleId === vehicleId);
    if (vehicle) {
      setSoc(vehicle.currentSocPercent);
      setReserveSoc(vehicle.reserveSocPercent);
    }
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const origin = DEMO_LOCATIONS[originIndex];
    const destination = DEMO_LOCATIONS[destinationIndex];

    if (!origin || !destination || originIndex === destinationIndex) {
      setFormError("Choose two different journey locations.");
      return;
    }

    if (!selectedVehicle) {
      setFormError("Choose a vehicle before planning a journey.");
      return;
    }

    setFormError(null);
    await journey.mutateAsync({
      origin,
      destination,
      vehicleId: selectedVehicle.vehicleId,
      currentSocPercent: soc,
      reserveSocPercent: reserveSoc,
      environment: { weatherCondition, elevationGainM: 0 },
      auxiliaryLoadKwh: 0.4,
      provider,
      trafficHorizon: "PREDICTED",
    });
    navigate("/journey/result");
  }

  return (
    <section className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
      <div>
        <p className="mb-3 text-sm font-medium uppercase tracking-[0.25em] text-volt-400">
          EV routing and energy engine
        </p>
        <h1 className="max-w-3xl text-5xl font-semibold leading-tight">
          Compare the ETA, energy demand, and arrival reserve for every route.
        </h1>
        <p className="mt-5 max-w-2xl text-lg text-slate-400">
          VoltTwin evaluates three route alternatives using vehicle efficiency, current battery,
          traffic load, environment, and auxiliary energy demand.
        </p>
      </div>

      <form onSubmit={submit} className="rounded-3xl border border-white/10 bg-white/5 p-6">
        <VehicleSelector
          vehicles={vehicles}
          selectedVehicleId={selectedVehicle?.vehicleId ?? null}
          onSelect={selectVehicle}
          isLoading={vehiclesQuery.isLoading}
        />

        {selectedVehicle ? (
          <div className="mt-4">
            <BatteryCard vehicle={selectedVehicle} />
          </div>
        ) : null}

        <label className="mt-5 block text-sm text-slate-300">
          Origin
          <select
            className="mt-2 w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3"
            value={originIndex}
            onChange={(event) => setOriginIndex(Number(event.target.value))}
          >
            {DEMO_LOCATIONS.map((location, index) => (
              <option key={location.label} value={index}>
                {location.label}
              </option>
            ))}
          </select>
        </label>

        <label className="mt-5 block text-sm text-slate-300">
          Destination
          <select
            className="mt-2 w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3"
            value={destinationIndex}
            onChange={(event) => setDestinationIndex(Number(event.target.value))}
          >
            {DEMO_LOCATIONS.map((location, index) => (
              <option key={location.label} value={index}>
                {location.label}
              </option>
            ))}
          </select>
        </label>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <label className="block text-sm text-slate-300">
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
          <label className="block text-sm text-slate-300">
            Safety reserve (%)
            <input
              className="mt-2 w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3"
              type="number"
              min="0"
              max="100"
              value={reserveSoc}
              onChange={(event) => setReserveSoc(Number(event.target.value))}
            />
          </label>
        </div>

        <label className="mt-5 block text-sm text-slate-300">
          Weather adjustment
          <select
            className="mt-2 w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3"
            value={weatherCondition}
            onChange={(event) =>
              setWeatherCondition(event.target.value as "CLEAR" | "RAIN" | "HOT" | "COLD")
            }
          >
            <option value="CLEAR">Clear / normal</option>
            <option value="RAIN">Rain</option>
            <option value="HOT">Hot weather</option>
            <option value="COLD">Cold weather</option>
          </select>
        </label>

        <label className="mt-5 block text-sm text-slate-300">
          Route source
          <select
            className="mt-2 w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3"
            value={provider}
            onChange={(event) => setProvider(event.target.value as "DEMO" | "AUTO")}
          >
            <option value="DEMO">Offline demo routes</option>
            <option value="AUTO">Live OSRM with demo fallback</option>
          </select>
        </label>

        <button
          className="mt-6 w-full rounded-xl bg-volt-500 px-4 py-3 font-semibold text-slate-950 disabled:opacity-50"
          disabled={journey.isPending}
          type="submit"
        >
          {journey.isPending ? "Evaluating routes…" : "Evaluate EV routes"}
        </button>
        {formError ? <p className="mt-3 text-sm text-amber-300">{formError}</p> : null}
        {journey.error ? <p className="mt-3 text-sm text-red-300">{journey.error.message}</p> : null}
      </form>
    </section>
  );
}
