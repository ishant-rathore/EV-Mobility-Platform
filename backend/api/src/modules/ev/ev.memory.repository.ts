import { SourceMode } from "../../shared/enums.js";
import type { CreateVehicleRecordInput, EvRepository } from "./ev.repository.js";
import type { EvVehicleRecord } from "./ev.types.js";

let nextId = 1;

/**
 * In-process fallback with no external dependency, so the driver flow keeps
 * working if PostgreSQL is unavailable during judging (Demo Rules §16).
 * State resets whenever the process restarts.
 */
export class MemoryEvRepository implements EvRepository {
  private readonly vehicles = new Map<string, EvVehicleRecord>();

  seed(vehicles: EvVehicleRecord[]): void {
    for (const vehicle of vehicles) {
      this.vehicles.set(vehicle.id, vehicle);
    }
  }

  async list(): Promise<EvVehicleRecord[]> {
    return [...this.vehicles.values()];
  }

  async findById(id: string): Promise<EvVehicleRecord | null> {
    return this.vehicles.get(id) ?? null;
  }

  async create(input: CreateVehicleRecordInput): Promise<EvVehicleRecord> {
    const now = new Date();
    const record: EvVehicleRecord = {
      ...input,
      id: `vehicle-memory-${nextId++}`,
      sourceMode: SourceMode.DEMO,
      createdAt: now,
      updatedAt: now,
    };
    this.vehicles.set(record.id, record);
    return record;
  }

  async updateSoc(id: string, currentSocPercent: number): Promise<EvVehicleRecord | null> {
    const existing = this.vehicles.get(id);
    if (!existing) return null;

    const updated: EvVehicleRecord = { ...existing, currentSocPercent, updatedAt: new Date() };
    this.vehicles.set(id, updated);
    return updated;
  }
}
