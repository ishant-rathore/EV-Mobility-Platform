import { Router } from "express";
import { evProfileSchema } from "./ev.schemas.js";
import { summarizeEvProfile } from "./ev.service.js";

export const evRouter = Router();

evRouter.post("/profiles/preview", (request, response) => {
  response.json(summarizeEvProfile(evProfileSchema.parse(request.body)));
});
