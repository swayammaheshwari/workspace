import { Router } from "express";
import { User } from "../sequelize/models/user";
import routeLogger from "../middleware/logs";
import * as fs from "fs";
import { convertYamlToPostman } from "../services/openapi_to_postman";

const router = Router();

async function createUser() {
  try {
    // Create a new user
    await User.create({ username: "john_doe", email: "john@example.com" });
    console.log("User created successfully");
  } catch (error) {
    console.error("Error creating user:", error);
  }
}

router.post("/test", routeLogger, async (req, res) => {
  try {
    console.log(req.body)
    const result = convertYamlToPostman(req.body);
    res.send(result)
  } catch (error) {
    res.status(500).send("Error in code: " + error);
  }
});

export default router;
