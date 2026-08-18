import { Router } from "express";
import { AppError } from "../../shared/errors.js";
import { reliabilityAssessmentRequestSchema } from "./reliability.schemas.js";
import {
  assessChargerReliability,
  getChargerReliability,
  listChargerReliability,
} from "./reliability.service.js";

export const reliabilityRouter = Router();

reliabilityRouter.get("/", (_request, response) => {
  response.json({
    source: "operational-assessment",
    disclaimer: "Prototype heuristic; not a certified safety score or availability guarantee.",
    chargers: listChargerReliability(),
  });
});

reliabilityRouter.post("/assess", (request, response) => {
  const input = reliabilityAssessmentRequestSchema.parse(request.body);
  response.status(200).json(assessChargerReliability(input));
});

reliabilityRouter.get("/:chargerId", (request, response) => {
  const assessment = getChargerReliability(request.params.chargerId);
  if (!assessment) {
    throw new AppError("No reliability data found for charger", 404, "RELIABILITY_NOT_FOUND");
  }
  response.json(assessment);
});
