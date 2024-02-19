// src/index.ts
import dotenv from "dotenv";
import express, { Express } from "express";
import ejs from "ejs";
import cors from "cors";
import connectToMongoDB from "./db/mongoConnect";
import connectToRedis from "./db/redisConnect";
import connectToPostgreSQL from "./db/postgressConnect";
//routes
import startRoutes from "./routes/startRoutes";
import UsersRoutes from "./routes/userRoutes";
import redisRoutes from "./routes/redis";
import pgRoutes from "./routes/pgRoutes";

dotenv.config();
const app: Express = express();
app.set("view engine", ejs);
app.use(cors());
app.use(express.json());
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

app.use(startRoutes);
app.use(UsersRoutes);
app.use(redisRoutes);
app.use(pgRoutes);

const start = async () => {
  try {
    // await connectToRedis();
    await connectToMongoDB();
    await connectToPostgreSQL();

    app.listen(process.env.PORT, () => {
      console.log(
        `[server]: Server is running at http://localhost:${process.env.PORT}`
      );
    });
  } catch (error) {
    console.log(error);
  }
};
start();
