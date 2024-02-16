import { Router } from "express";
import pool from "../config/pgConnect";
import pgController from "../controllers/pgControlller";

const router = Router();

router.post("/createUserTable", async (req, res) => {
  try {
    // Create user table if it doesn't exist
    await pool.query(`
        CREATE TABLE IF NOT EXISTS users (
          id SERIAL PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          email VARCHAR(255) NOT NULL
        )
      `);

    res.status(200).send("User table created successfully");
  } catch (error) {
    console.error("Error creating user table:", error);
    res.status(500).send("Internal Server Error");
  }
});

router.get("/usersBypg/:id", pgController.getUserById);

router.post("/usersBypg/", pgController.createUser);

router.put("/usersBypg/:id", pgController.updateUser);

router.delete("/usersBypg/:id", pgController.deleteUser);

export default router;
