import { Schema, model } from "mongoose";

const itemSchema = new Schema({
  name: String,
});

export const ItemModel = model("Item", itemSchema);

