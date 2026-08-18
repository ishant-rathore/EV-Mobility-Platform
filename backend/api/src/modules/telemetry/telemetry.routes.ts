import { Router } from "express";
import { AppError } from "../../shared/errors.js";
import { chargerTelemetrySchema } from "./telemetry.schemas.js";
import {
  getLatestTelemetry,
  listTelemetrySnapshots,
  recordTelemetry,
} from "./telemetry.service.js";

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

telemetryRouter.get("/:chargerId", (request, response) => {
  const telemetry = getLatestTelemetry(request.params.chargerId);
  if (!telemetry) {
    throw new AppError("No telemetry found for charger", 404, "TELEMETRY_NOT_FOUND");
  }
  response.json(telemetry);
});
