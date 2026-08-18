import { SourceMode } from "../../shared/enums.js";
import type { CreateVehicleRecordInput } from "./ev.repository.js";
import type { EvVehicleRecord } from "./ev.types.js";

/**
 * The four demo vehicles, one per {@link VehicleClass}. Shared by the Prisma
 * seed script and the in-memory repository's default seed so both backends
 * show identical data. `nexon-demo` is the vehicle used in every doc example
 * and Postman fixture — keep its numbers in sync with docs/06-api/VEHICLE_API.md.
 */
export const DEMO_VEHICLES: Array<CreateVehicleRecordInput & { id: string }> = [
  {
    id: "vehicle-nexon-demo",
    name: "Tata Nexon EV Max",
    vehicleClass: "CAR",
    connectorTypes: ["CCS2"],
    batteryCapacityKwh: 40.5,
    batteryHealthPercent: 100,
    efficiencyWhPerKm: 150,
    currentSocPercent: 38,
    reserveSocPercent: 10,
    isDefault: true,
  },
  {
    id: "vehicle-ather-demo",
    name: "Ather 450X",
    vehicleClass: "BIKE",
    connectorTypes: ["LEV_AC"],
    batteryCapacityKwh: 3.7,
    batteryHealthPercent: 96,
    efficiencyWhPerKm: 28,
    currentSocPercent: 62,
    reserveSocPercent: 10,
    isDefault: false,
  },
  {
    id: "vehicle-etruck-demo",
    name: "Tata Ace EV Cargo",
    vehicleClass: "TRUCK",
    connectorTypes: ["CCS2", "BHARAT_DC_001"],
    batteryCapacityKwh: 55,
    batteryHealthPercent: 91,
    efficiencyWhPerKm: 320,
    currentSocPercent: 70,
    reserveSocPercent: 15,
    isDefault: false,
  },
  {
    id: "vehicle-fleet-van-demo",
    name: "BYD e6 Fleet Van",
    vehicleClass: "COMMERCIAL",
    connectorTypes: ["CCS2", "TYPE2"],
    batteryCapacityKwh: 71.7,
    batteryHealthPercent: 98,
    efficiencyWhPerKm: 205,
    currentSocPercent: 45,
    reserveSocPercent: 12,
    isDefault: false,
  },
];

/** {@link DEMO_VEHICLES} shaped for {@link MemoryEvRepository.seed}. */
export function demoVehiclesAsRecords(): EvVehicleRecord[] {
  const now = new Date();
  return DEMO_VEHICLES.map(({ id, ...input }) => ({
    ...input,
    id,
    sourceMode: SourceMode.DEMO,
    createdAt: now,
    updatedAt: now,
  }));
}
