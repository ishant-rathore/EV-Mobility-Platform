import { Router } from "express";
import { AppError } from "../../shared/errors.js";
import { chargerTelemetrySchema } from "./telemetry.schemas.js";
import {
  getLatestTelemetry,
  listTelemetrySnapshots,
  recordTelemetry,
} from "./telemetry.service.js";
import { authenticate, authorize, type AuthRequest } from "../../middleware/auth.middleware.js";
import { prisma } from "../../lib/prisma.js";

export const telemetryRouter = Router();

telemetryRouter.get("/", (_request, response) => {
  response.json({
    source: "normalized-telemetry",
    disclaimer: "Prototype monitoring data; inspect sourceMode and isSimulated before use.",
    chargers: listTelemetrySnapshots(),
  });
});

telemetryRouter.post("/", (request, response) => {
  response.status(202).json(recordTelemetry(chargerTelemetrySchema.parse(request.body)));
});

telemetryRouter.get("/mine", authenticate, authorize("charger:read"), async (request: AuthRequest, response, next) => {
  try {
    const snapshots = listTelemetrySnapshots();
    if (request.user!.roleName === "ADMIN") {
      return response.json({
        source: "normalized-telemetry",
        disclaimer: "Telemetry is limited to the authenticated operator's assigned chargers.",
        chargers: snapshots,
      });
    }
    const assigned = await prisma.charger.findMany({
      where: { station: { operatorId: request.user!.id } },
      select: { id: true },
    });
    const assignedIds = new Set(assigned.map(({ id }) => id));
    return response.json({
      source: "normalized-telemetry",
      disclaimer: "Telemetry is limited to the authenticated operator's assigned chargers.",
      chargers: snapshots.filter(({ telemetry }) => assignedIds.has(telemetry.chargerId)),
    });
  } catch (error) {
    next(error);
  }
});

telemetryRouter.get("/:chargerId", (request, response) => {
  const telemetry = getLatestTelemetry(request.params.chargerId);
  if (!telemetry) {
    throw new AppError("No telemetry found for charger", 404, "TELEMETRY_NOT_FOUND");
  }
  response.json(telemetry);
});
