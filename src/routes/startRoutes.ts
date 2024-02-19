import { Router } from "express";
import startController from "../controllers/startController";
import measureResources from "../middleware/measureResources";
import verifyToken from "../middleware/jwtAuth";

const router = Router();

router.get("/", startController.getStart);

router.get("/measure",measureResources, startController.measureStart);

router.post("/", startController.postStart);

router.get("/protected",verifyToken, startController.protectedStart);

export default router;
