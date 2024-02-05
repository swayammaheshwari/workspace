import { Schema, model } from "mongoose";

const UserSchema = new Schema({
  name: String,
  email: String,
});
export const UserModel = model("User", UserSchema);


