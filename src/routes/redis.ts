import { Router } from "express";

const router = Router();

router.get("/redis", (req, res) => {
  res.send("ddd");
});

export default router;
