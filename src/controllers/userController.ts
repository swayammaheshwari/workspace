import { UserModel } from "../models/userModel";
import { Request, Response } from "express";

const UserController = {
  // GET /users/:id
  getUserById: async (req: Request, res: Response) => {
    try {
      const userId = req.params.id;
      const user = await UserModel.findById(userId);

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      return res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  },

  // POST /users
  createUser: async (req: Request, res: Response) => {
    try {
      const userData = req.body;
      const userExist = await UserModel.findOne({ email: req.body.email });
      if (userExist) {
        return res
          .status(409)
          .json({ msg: "El correo electronico ya se encuentra registrado" });
      }

      const newUser = new UserModel({
        name: userData.name,
        email: userData.email,
      });

      // Save the new user to the database
      await newUser.save();

      return res.status(201).json(newUser);
    } catch (error) {
      console.error("Error creating user:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  },

  // PUT /users/:id
  updateUser: async (req: Request, res: Response) => {
    try {
      const userId = req.params.id;
      const userData = req.body;

      const updatedUser = await UserModel.findByIdAndUpdate(userId, userData, {
        new: true,
      });

      if (!updatedUser) {
        return res.status(404).json({ error: "User not found" });
      }
      return res.json(updatedUser);
    } catch (error) {
      console.error("Error updating user:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  },

  // DELETE /users/:id
  deleteUser: async (req: Request, res: Response) => {
    try {
      const userId = req.params.id;
      const deletedUser = await UserModel.findByIdAndDelete(userId);
      if (!deletedUser) {
        return res.status(404).json({ error: "User not found" });
      }
      return res.json(deletedUser);
    } catch (error) {
      console.error("Error deleting user:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  },
};

export default UserController;
