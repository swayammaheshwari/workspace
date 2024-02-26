import { Router } from "express";
import { User } from "../sequelize/models/user";
import { Image } from "../models/imageModel";
import { upload } from "../middleware/multer";

const router = Router();

async function createUser() {
  try {
    // Create a new user
    await User.create({ username: "john_doe", email: "john@example.com" });
    console.log("User created successfully");
  } catch (error) {
    console.error("Error creating user:", error);
  }
}

router.get("/test", async (req, res) => {
  try {
    // const user = "";
    const user = createUser();
    // const users = await User.findAll();
    res.json(user);
  } catch (error) {
    console.log(error);
    res.json("fatt gya!");
  }
});

router.post(
  "/upload",
  // upload.single('image'),
  async (req: any, res: any) => {
    if (!req.file) return res.status(400).send("No file uploaded.");   
    try {
      console.log(req.file)
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
  }
);

export default router;
