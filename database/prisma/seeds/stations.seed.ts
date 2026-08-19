import type { PrismaClient } from "@prisma/client";

/**
 * Real ChargingStation/Charger rows using the SAME ids as the legacy demo
 * routing/recommendation engine's hardcoded station catalogue
 * (backend/api/src/integrations/charging-providers/demo-station.provider.ts).
 * Keeping the ids identical lets a `/journeys/evaluate` recommendation
 * (which always reasons over that hardcoded catalogue) resolve to a real,
 * reservable DB station/charger instead of a dangling id.
 */
const STATIONS = [
  {
    id: "station-demo-1",
    name: "VoltTwin Central Hub",
    latitude: 19.076,
    longitude: 72.8777,
    address: "Mumbai demo corridor",
    chargers: [
      { id: "charger-demo-1-ccs2", connectorType: "CCS2", maximumPowerKw: 60, status: "AVAILABLE" },
      { id: "charger-demo-1-type2", connectorType: "TYPE2", maximumPowerKw: 22, status: "OCCUPIED" },
      { id: "charger-demo-1-lev", connectorType: "LEV_AC", maximumPowerKw: 7.2, status: "AVAILABLE" },
    ],
  },
  {
    id: "station-demo-2",
    name: "GreenRoute Charging Point",
    latitude: 19.1136,
    longitude: 72.8697,
    address: "Mumbai demo corridor north",
    chargers: [
      { id: "charger-demo-2-ccs2", connectorType: "CCS2", maximumPowerKw: 30, status: "AVAILABLE" },
      { id: "charger-demo-2-bharat", connectorType: "BHARAT_DC_001", maximumPowerKw: 25, status: "AVAILABLE" },
      { id: "charger-demo-2-lev", connectorType: "LEV_AC", maximumPowerKw: 7.2, status: "AVAILABLE" },
    ],
  },
] as const;

/** One parking location + one EV-enabled, IoT-equipped bay per charger, next to each station. */
const PARKING_LOCATIONS = [
  {
    id: "parking-demo-1",
    name: "VoltTwin Central Hub Parking",
    latitude: 19.0762,
    longitude: 72.8778,
    slots: [
      { id: "slot-demo-1-a1", label: "A1", deviceExternalId: "iot-demo-1-a1" },
      { id: "slot-demo-1-a2", label: "A2", deviceExternalId: "iot-demo-1-a2" },
      { id: "slot-demo-1-a3", label: "A3", deviceExternalId: "iot-demo-1-a3" },
    ],
  },
  {
    id: "parking-demo-2",
    name: "GreenRoute Charging Point Parking",
    latitude: 19.1137,
    longitude: 72.8698,
    slots: [
      { id: "slot-demo-2-b1", label: "B1", deviceExternalId: "iot-demo-2-b1" },
      { id: "slot-demo-2-b2", label: "B2", deviceExternalId: "iot-demo-2-b2" },
      { id: "slot-demo-2-b3", label: "B3", deviceExternalId: "iot-demo-2-b3" },
    ],
  },
] as const;

/** Idempotent — safe to run against an already-seeded database. */
export async function seedStations(prisma: PrismaClient): Promise<void> {
  for (const station of STATIONS) {
    await prisma.chargingStation.upsert({
      where: { id: station.id },
      update: {},
      create: {
        id: station.id,
        name: station.name,
        latitude: station.latitude,
        longitude: station.longitude,
        address: station.address,
      },
    });
    for (const charger of station.chargers) {
      await prisma.charger.upsert({
        where: { id: charger.id },
        update: {},
        create: {
          id: charger.id,
          stationId: station.id,
          connectorType: charger.connectorType,
          maximumPowerKw: charger.maximumPowerKw,
          status: charger.status,
        },
      });
    }
  }

  for (const location of PARKING_LOCATIONS) {
    await prisma.parkingLocation.upsert({
      where: { id: location.id },
      update: {},
      create: {
        id: location.id,
        name: location.name,
        latitude: location.latitude,
        longitude: location.longitude,
      },
    });
    for (const slot of location.slots) {
      await prisma.parkingSlot.upsert({
        where: { id: slot.id },
        update: {},
        create: {
          id: slot.id,
          locationId: location.id,
          label: slot.label,
          isEvEnabled: true,
        },
      });
      await prisma.ioTDevice.upsert({
        where: { id: `${slot.id}-device` },
        update: {},
        create: {
          id: `${slot.id}-device`,
          parkingSlotId: slot.id,
          externalId: slot.deviceExternalId,
          lastSeenAt: new Date(),
        },
      });
    }
  }
}
