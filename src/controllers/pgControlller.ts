import { Request, Response } from "express";
import pool from "../config/pgPool";

const UserController = {
  // GET /users/:id
  getUserById: async (req: Request, res: Response) => {
    try {
      const userId = req.params.id;
      const query = "SELECT * FROM users WHERE id = $1";
      const { rows } = await pool.query(query, [userId]);

      if (rows.length === 0) {
        return res.status(404).json({ error: "User not found" });
      }

      return res.json(rows[0]);
    } catch (error) {
      console.error("Error fetching user:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  },

  // POST /users
  createUser: async (req: Request, res: Response) => {
    try {
      const { name, email } = req.body;
      const query =
        "INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *";
      const { rows } = await pool.query(query, [name, email]);

      return res.status(201).json(rows[0]);
    } catch (error) {
      console.error("Error creating user:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  },

  // PUT /users/:id
  updateUser: async (req: Request, res: Response) => {
    try {
      const userId = req.params.id;
      const { name, email } = req.body;
      const query =
        "UPDATE users SET name = $1, email = $2 WHERE id = $3 RETURNING *";
      const { rows } = await pool.query(query, [name, email, userId]);

      if (rows.length === 0) {
        return res.status(404).json({ error: "User not found" });
      }

      return res.json(rows[0]);
    } catch (error) {
      console.error("Error updating user:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  },

  // DELETE /users/:id
  deleteUser: async (req: Request, res: Response) => {
    try {
      const userId = req.params.id;
      const query = "DELETE FROM users WHERE id = $1 RETURNING *";
      const { rows } = await pool.query(query, [userId]);

      if (rows.length === 0) {
        return res.status(404).json({ error: "User not found" });
      }

      return res.json(rows[0]);
    } catch (error) {
      console.error("Error deleting user:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  },
};

export default UserController;
