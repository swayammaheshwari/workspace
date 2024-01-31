import mongoose from "mongoose";

const itemSchema = new mongoose.Schema({
  name: String,
});

const UserSchema = new mongoose.Schema({
  name: String,
  age: Number,
});

const ItemModel = mongoose.model("Item", itemSchema);
const UserModel = mongoose.model("User", UserSchema);

export { ItemModel, UserModel };
