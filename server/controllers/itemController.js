import { Router } from "express";
const router = Router();
import ItemController from "../controllers/itemController.js";

router.get("/items/:id", ItemController.getItemById);

router.post("/items/", ItemController.createItem);

router.put("/items/:id", ItemController.updateItem);

router.delete("/items/:id", ItemController.deleteItem);

export default router;
