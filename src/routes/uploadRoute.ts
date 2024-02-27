import { Router } from "express";
import { Image } from "../models/imageModel";
import { upload } from "../middleware/multer";
import {
  deleteImage,
  getAllImages,
  updateImage,
  uploadImage,
} from "../controllers/uploadController";

const router = Router();

router.post("/upload", upload.single("image"), uploadImage);

router.get("/images", getAllImages);

router.put("/image/:id", updateImage); // not working yet

router.delete("/image/:id", deleteImage); // not working yet

export default router;
