import { Router } from "express";
import client from "../config/redisConnect";

const router = Router();

router.get("/redis", async (req, res) => {
  try {
    const { name } = req.body;
    if (!name || typeof name !== "string") throw new Error("Invalid input");

    const data = await client.get(name);
    res.send(`data: ${data}`);
  } catch (error) {
    res
      .status(500)
      .send(`Error occurred while saving data to redis : ${error}`);
  }
});

router.post("/redis", async (req, res) => {
  try {
    const { name, email } = req.body;

    // Check if key and value are provided
    if (!name || !email) {
      return res
        .status(400)
        .json({ message: "Both name and email are required." });
    }

    // Set the key-value pair in Redis
    await client.set(name, email);
    res.send("data saved successfully");
  } catch (error) {
    res
      .status(500)
      .send(`Error occurred while saving data to redis : ${error}`);
  }
});

export default router;
