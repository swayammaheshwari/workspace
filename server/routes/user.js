import { Router } from "express";
import { UserModel } from "../db/models.js";

const router = Router();

router.get("/get-users", async (req, res) => {
  try {
    res.status(201).send("server is live");
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

router.post("/create-user", async (req, res) => {
  try {
    const { name, age } = req.body;
    const newUser = new UserModel({
      name: name,
      age: age,
    });

    await newUser.save();
    res.status(201).send("user saved succesfully");
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

export default router;
