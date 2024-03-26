// src/index.ts
import dotenv from "dotenv";
import express, { Express } from "express";
import ejs from "ejs";
import cors from "cors";
import connectToMongoDB from "./db/mongoConnect";
import connectToRedis from "./db/redisConnect";
import connectToPostgreSQL from "./db/postgressConnect";
import debugMiddleware from "./middleware/debug";
import { corsOptions } from "./services/cors";
//routes
import startRoutes from "./routes/startRoutes";
import UsersRoutes from "./routes/userRoutes";
import redisRoutes from "./routes/redis";
import pgRoutes from "./routes/pgRoutes";
import uploadRoutes from "./routes/uploadRoute";
import testRoute from "./routes/test.route"; //test route

dotenv.config();
const app: Express = express();
app.set("view engine", ejs);
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV !== "production") {
  console.log("Debugging is enabled!");
  app.use(debugMiddleware);
}

app.use(startRoutes);
app.use(UsersRoutes);
app.use(redisRoutes);
app.use(pgRoutes);
app.use(uploadRoutes);

//test routes
app.use(testRoute);

const start = async () => {
  try {
    // await connectToRedis();
    // await connectToMongoDB();
    // await connectToPostgreSQL();

    app.listen(process.env.PORT, () => {
      console.log(
        `[server]: Server is running at ${process.env.HOST}${process.env.PORT}`
      );
    });
  } catch (error) {
    console.log(error);
  }
};
start();
