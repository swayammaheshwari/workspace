import { Router, Request, Response } from "express";

const router = Router();

router.get("/", async (req: Request, res: Response) => {
  try {
    res.status(201).send("server is live");
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

router.post("/", async (req: Request, res: Response) => {
  try {
    let message: string = "LIST got\n";
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