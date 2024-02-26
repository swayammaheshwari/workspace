import { Schema, model } from "mongoose";


const imageSchema = new Schema({
    data: Buffer,
    contentType: String
});

export const Image = model('Image', imageSchema);
