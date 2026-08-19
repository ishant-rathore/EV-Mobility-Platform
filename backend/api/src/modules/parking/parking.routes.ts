import { Router } from "express";
import { ParkingController } from "./parking.controller.js";
import { authenticate, authorize } from "../../middleware/auth.middleware.js";
import { checkOwnership } from "../../middleware/ownership.middleware.js";

export const parkingRouter = Router();

parkingRouter.get("/locations", ParkingController.listLocations);
parkingRouter.get("/locations/mine", authenticate, authorize("parking:read"), ParkingController.listMyLocations);
parkingRouter.get("/locations/:id", ParkingController.getLocationById);
parkingRouter.get("/bays", ParkingController.listBays);
parkingRouter.get("/bays/mine", authenticate, authorize("parking:read"), ParkingController.listMyBays);

parkingRouter.post("/locations", authenticate, authorize("parking:create"), ParkingController.createLocation);
parkingRouter.patch("/locations/:id", authenticate, authorize("parking:update"), checkOwnership("parking_location"), ParkingController.updateLocation);
parkingRouter.post("/bays", authenticate, authorize("parking:create"), ParkingController.createBay);
parkingRouter.patch("/bays/:id", authenticate, authorize("parking:update"), ParkingController.updateBay);
