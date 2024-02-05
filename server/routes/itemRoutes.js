import { Router } from "express";
import { ItemModel } from "../models/Item.js";

const router = Router();

router.get("/items", async (req, res) => {
  try {
    const items = await ItemModel.find().sort({ createdAt: -1 }).exec();
    res.send({ items });
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

router.get("/additems", async (req, res) => {
  try {
    const item1 = new ItemModel({
      name: "hey swayam here",
    });
    await item1.save();
    res.status(201).send("Item added successfully");
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

export default router;
