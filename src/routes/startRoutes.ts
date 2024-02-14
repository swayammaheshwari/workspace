import { Router } from "express";
import startController from "../controllers/startController";

const router = Router();

router.get("/", startController.getStart);

router.get("/measure", startController.measureStart);

router.post("/", startController.postStart);

export default router;
