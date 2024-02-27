import { Router } from "express";
import { Image } from "../models/imageModel";
import { upload } from "../middleware/multer";

const router = Router();

router.post("/upload", upload.single("image"), async (req, res) => {
  if (!req.file) return res.status(400).send("No file uploaded.");
  try {
    const newImage = new Image({
      data: req.file.buffer,
      contentType: req.file.mimetype,
    });
    await newImage.save();
    res.status(200).send("File uploaded successfully.");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error uploading file.");
  }
});

router.get("/images", async (req, res) => {
  try {
    const images = await Image.find({});
    console.log(images);
    res.status(200).json(images);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error retrieving images.");
  }
});

export default router;
