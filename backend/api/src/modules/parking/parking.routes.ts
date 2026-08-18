import { Router } from "express";
import { parkingQuerySchema } from "./parking.schemas.js";
import { listParkingBays } from "./parking.service.js";

export const parkingRouter = Router();

parkingRouter.get("/", (request, response) => {
  const query = parkingQuerySchema.parse(request.query);
  response.json(listParkingBays(query.stationId));
});
