import { featureFlags } from "../../config/feature-flags.js";
import { demoVehiclesAsRecords } from "./ev.demo-data.js";
import { MemoryEvRepository } from "./ev.memory.repository.js";
import { PrismaEvRepository, type EvRepository } from "./ev.repository.js";
import { computeBatteryState } from "./ev.service.js";
import type { EvProfileSummary, EvVehicleRecord } from "./ev.types.js";

const memoryRepository = new MemoryEvRepository();
memoryRepository.seed(demoVehiclesAsRecords());

/**
 * The single Module 1 repository used by both the EV API and downstream
 * journey orchestration. Keeping it here prevents routing from reading a
 * different in-memory vehicle set than the EV profile endpoints expose.
 */
export const evRepository: EvRepository = featureFlags.evPersistentStorage
  ? new PrismaEvRepository()
  : memoryRepository;

export function toEvProfileSummary(record: EvVehicleRecord): EvProfileSummary {
  return {
    vehicleId: record.id,
    name: record.name,
    vehicleClass: record.vehicleClass,
    connectorTypes: record.connectorTypes,
    batteryCapacityKwh: record.batteryCapacityKwh,
    batteryHealthPercent: record.batteryHealthPercent,
    efficiencyWhPerKm: record.efficiencyWhPerKm,
    currentSocPercent: record.currentSocPercent,
    reserveSocPercent: record.reserveSocPercent,
    isDefault: record.isDefault,
    sourceMode: record.sourceMode,
    updatedAt: record.updatedAt.toISOString(),
    ...computeBatteryState(record),
  };
}
