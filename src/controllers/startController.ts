import { Request, Response } from "express";
import measureResources from "../middleware/measureResources";

const startController = {
  getStart: async (req: Request, res: Response) => {
    try {
      res.status(201).send("server is live");
    } catch (err) {
      console.error(err);
      res.status(500).send("Internal Server Error");
    }
  },

  postStart: async (req: Request, res: Response) => {
    try {
      let message: string = "LIST got\n";
      for (const key in req.body) {
        message += `${key}: ${req.body[key]}\n`;
      }
      res.status(201).send(message);
    } catch (err) {
      console.error(err);
      res.status(500).send("Internal Server Error");
    }
  },
  measureStart: async (req: Request, res: Response) => {
    try {
      res.status(201).send(`memory state`);
    } catch (err) {
      console.error(err);
      res.status(500).send("Internal Server Error");
    }
  },

  protectedStart: async (req: Request, res: Response, next: Function) => {
    res.status(201).json({ message: "This is a protected route." });
  },
};

export default startController;
