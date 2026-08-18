import { DemoStationProvider } from "../../integrations/charging-providers/demo-station.provider.js";
import { rankStations } from "./station-ranking.service.js";

const provider = new DemoStationProvider();

export async function findChargingStations(options: {
  minimumPowerKw?: number;
  onlyAvailable?: boolean;
}) {
  const stations = await provider.listStations();
  return rankStations(
    stations.filter(
      (station) =>
        (!options.minimumPowerKw || station.powerKw >= options.minimumPowerKw) &&
        (!options.onlyAvailable || station.availableChargers > 0),
    ),
  );
}
