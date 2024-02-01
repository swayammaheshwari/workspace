// routes/userRoutes.js

import { Router } from "express";
const router = Router();
import {
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} from "../controllers/userController.js";

// GET /users/:id
router.get("/:id", getUserById);

// POST /users
router.post("/", createUser);

// PUT /users/:id
router.put("/:id", updateUser);

// DELETE /users/:id
router.delete("/:id", deleteUser);

export default router;
