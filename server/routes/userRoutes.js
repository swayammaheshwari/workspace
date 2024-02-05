import { Router } from "express";
const router = Router();
import UserController from "../controllers/userController.js";

router.get("/users/:id", UserController.getUserById);

router.post("/users/", UserController.createUser);

router.put("/users/:id", UserController.updateUser);

router.delete("/users/:id", UserController.deleteUser);

export default router;
