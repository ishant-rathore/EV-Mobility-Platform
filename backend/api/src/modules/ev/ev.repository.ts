import type { EVVehicle } from "@prisma/client";
import { prisma } from "../../lib/prisma.js";
import { SourceMode, type ConnectorType, type VehicleClass } from "../../shared/enums.js";
import { DEMO_USER_ID } from "./ev.constants.js";
import type { EvVehicleRecord } from "./ev.types.js";

export interface CreateVehicleRecordInput {
  name: string;
  vehicleClass: VehicleClass;
  connectorTypes: ConnectorType[];
  batteryCapacityKwh: number;
  batteryHealthPercent: number;
  efficiencyWhPerKm: number;
  currentSocPercent: number;
  reserveSocPercent: number;
  isDefault: boolean;
}

/**
 * Persistence contract for EV profiles.
 * Two implementations exist: {@link PrismaEvRepository} for PostgreSQL and
 * {@link MemoryEvRepository} for demo runs without a database — see Demo
 * Rules §16 ("keep a software simulator / no external dependency for judging").
 */
export interface EvRepository {
  list(): Promise<EvVehicleRecord[]>;
  findById(id: string): Promise<EvVehicleRecord | null>;
  create(input: CreateVehicleRecordInput): Promise<EvVehicleRecord>;
  updateSoc(id: string, currentSocPercent: number): Promise<EvVehicleRecord | null>;
}

export class VehicleNotFoundError extends Error {
  constructor(id: string) {
    super(`No EV vehicle found with id "${id}".`);
    this.name = "VehicleNotFoundError";
  }
}

export function toRecord(row: EVVehicle): EvVehicleRecord {
  return {
    id: row.id,
    name: row.name,
    vehicleClass: row.vehicleClass as VehicleClass,
    connectorTypes: row.connectorTypes as ConnectorType[],
    batteryCapacityKwh: row.batteryCapacityKwh,
    batteryHealthPercent: row.batteryHealthPercent,
    efficiencyWhPerKm: row.efficiencyWhPerKm,
    currentSocPercent: row.currentSocPercent,
    reserveSocPercent: row.reserveSocPercent,
    isDefault: row.isDefault,
    // Rows in this table are always persisted, driver-entered vehicle data.
    sourceMode: SourceMode.REAL,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

/** PostgreSQL-backed implementation, used whenever `DATABASE_URL` is reachable. */
export class PrismaEvRepository implements EvRepository {
  async list(): Promise<EvVehicleRecord[]> {
    const rows = await prisma.eVVehicle.findMany({ where: { userId: DEMO_USER_ID } });
    return rows.map(toRecord);
  }

  async findById(id: string): Promise<EvVehicleRecord | null> {
    const row = await prisma.eVVehicle.findUnique({ where: { id } });
    return row ? toRecord(row) : null;
  }

  async create(input: CreateVehicleRecordInput): Promise<EvVehicleRecord> {
    const row = await prisma.eVVehicle.create({
      data: { ...input, userId: DEMO_USER_ID },
    });
    return toRecord(row);
  }

  async updateSoc(id: string, currentSocPercent: number): Promise<EvVehicleRecord | null> {
    try {
      const row = await prisma.eVVehicle.update({ where: { id }, data: { currentSocPercent } });
      return toRecord(row);
    } catch {
      return null;
    }
  }
}
