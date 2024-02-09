import { Schema, model, Document } from "mongoose";

interface User extends Document {
  name: string;
  email: string;
}

const UserSchema: Schema<User> = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
});

export const UserModel = model<User>("User", UserSchema);
