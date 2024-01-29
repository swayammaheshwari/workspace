import { Router } from "express";

const router = Router();

router.get("/", async (req, res) => {
  try {
    res.status(201).send("server is live");
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

router.post("/", async (req, res) => {
  try {
    let message = "LIST got\n";
    for (const key in req.body) {
      message += `${key}: ${req.body[key]}\n`;
    }
    res.status(201).send(message);
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

export default router;
