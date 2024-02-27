import { Request, Response } from "express";
import { Image } from "../models/imageModel";
import fs from "fs";

export const uploadImage = async (req: Request, res: Response) => {
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
};

export const getAllImages = async (req: Request, res: Response) => {
  try {
    const images = await Image.find().sort("-createdAt");
    res.status(200).json(images);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error retrieving images.");
  }
};

export const updateImage = async (req: Request, res: Response) => {
  return res.send("will be config later");
  //   const imageId = req.params.id;
  //   const updates = req.body;
  //   let image = await Image.findById(imageId);
  //   if (!image) return res.status(404).send("No image with     that ID.");
  //   // Check user owns the image
  //   if (image.user.toString() !== req.userId) {
  //     return res.status(401).json({ notAuthorized: "User not authorized to edit this image."});
  //   }
  //   //new code for owner check
  //   if(!image || !image._id.equals(updates._id)) return res.status(400).send('Invalid request');

  //   //check field being updated
  //   if (updates.field === 'text') {
  //     image = Image.setText(image, updates.value);
  //   } else if (updates.field === 'isPublic') {
  //     image = Image.setPublic(image, updates.value);
  //   } else {
  //     return res.status(400   ).send(`Invalid property ${updates.field}.`);
  //   }
  //   await image.save();
  //   res.status(200).send(image);
};

export const deleteImage = async (req: Request, res: Response) => {
  const image: any = await Image.findByIdAndDelete(req.params.id);
  if (!image) return res.status(404).send("No image with that ID was found.");

  // Delete the physical file from disk as well
  try {
    await fs.promises.unlink(`uploads/${image.filename}`);
  } catch (error) {
    console.log(error);
  }

  res.status(200).send("The image has been deleted.");
};
