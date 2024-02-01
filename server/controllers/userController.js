// controllers/UserController.js

// Import any necessary modules or dependencies
import {
  getUserById as _getUserById,
  createUser as _createUser,
  updateUser as _updateUser,
  deleteUser as _deleteUser,
} from "../services/userService.js";

// Controller functions
const UserController = {
  // GET /users/:id
  getUserById: async (req, res) => {
    try {
      const userId = req.params.id;
      const user = await _getUserById(userId);
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
  createUser: async (req, res) => {
    try {
      const userData = req.body;
      const newUser = await _createUser(userData);
      return res.status(201).json(newUser);
    } catch (error) {
      console.error("Error creating user:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  },

  // PUT /users/:id
  updateUser: async (req, res) => {
    try {
      const userId = req.params.id;
      const userData = req.body;
      const updatedUser = await _updateUser(userId, userData);
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
  deleteUser: async (req, res) => {
    try {
      const userId = req.params.id;
      const deletedUser = await _deleteUser(userId);
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
