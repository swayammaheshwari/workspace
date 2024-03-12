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

// Save the data in Redis Cache using POST method
router.post("/saveRedisData/:key", async (req, res) => {
  const key = `user_${req.params.key}`;
  const value = JSON.stringify(req.body);
  console.log(value);

  try {
    let result = await client.set(key, value);

    if (!result) {
      return res.json({ message: "Failed to set user information." });
    } else {
      return res.json({
        message: "User Information has been saved successfully.",
      });
    }
  } catch (err) {
    console.log("Err", err);
    return res.status(400).json({ message: "Bad request!" });
  }
});
// Get the data from Redis Cache using GET Method by Key
router.get("/getRedisDataByKey/:id", async (req, res) => {
  const id = req.params.id;
  const key = `user_${id}`;
  const data = await client.get(key);
  if (!data) {
    return res
      .status(404)
      .json({ Message: `No Data found for the given User ID : ${id} ` });
  } else {
    var parsedData = JSON.parse(data);
    return res.status(200).json(parsedData);
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
