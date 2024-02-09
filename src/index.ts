// src/index.js
import express, { Express } from "express";
import dotenv from "dotenv";
import ejs from "ejs";
import connectToMongoDB from "./db/mongooseConnect";
//routes
import startRoutes from "./routes/startRoutes";
import UsersRoutes from "./routes/userRoutes";

dotenv.config();
const app: Express = express();
app.set("view engine", ejs);
app.use(express.json());
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

connectToMongoDB();

app.use(startRoutes);
app.use(UsersRoutes);

app.listen(process.env.PORT, () => {
  console.log(
    `[server]: Server is running at http://localhost:${process.env.PORT}`
  );
});
