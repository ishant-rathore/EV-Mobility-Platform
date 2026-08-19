import type { Response, NextFunction } from "express";
import { JourneysService } from "./journeys.service.js";
import { planJourneySchema } from "./journeys.schemas.js";
import { integratedJourneyEvaluationSchema } from "../journey/journey.schemas.js";
import { sendSuccess } from "../../shared/response.js";
import type { AuthRequest } from "../../middleware/auth.middleware.js";

export class JourneysController {
  static async list(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = Math.min(100, parseInt(req.query.limit as string) || 20);
      const isAdmin = req.user!.roleName === "ADMIN";
      const result = await JourneysService.list(req.user!.id, isAdmin, page, limit);
      return sendSuccess(res, result.journeys, 200, result.meta);
    } catch (error) {
      next(error);
    }
  }

  static async getById(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const journey = await JourneysService.getById(req.params.id as string);
      return sendSuccess(res, journey);
    } catch (error) {
      next(error);
    }
  }

  static async plan(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const input = planJourneySchema.parse(req.body);
      const journey = await JourneysService.plan(req.user!.id, input);
      return sendSuccess(res, journey, 201);
    } catch (error) {
      next(error);
    }
  }

  static async cancel(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const journey = await JourneysService.cancel(req.params.id as string);
      return sendSuccess(res, journey);
    } catch (error) {
      next(error);
    }
  }

  static async evaluate(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const input = integratedJourneyEvaluationSchema.parse(req.body);
      const result = await JourneysService.evaluate(req.user!.id, input);
      return sendSuccess(res, result, 201);
    } catch (error) {
      next(error);
    }
  }
}
