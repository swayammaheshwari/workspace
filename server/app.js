import { config } from "dotenv";
config();
import express from "express";
import ejs from "ejs";
import connectToMongoDB from "./db/connect.js";
//routes
import startRoutes from "./routes/start.js";
import itemRoutes from "./routes/item.js";
import userRoutes from "./routes/user.js";
// import newUsersRoutes from "./routes/userRoutes.js";

const app = express();
app.set("view engine", ejs);
app.use(express.json());
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

connectToMongoDB();

app.use(startRoutes);
app.use(itemRoutes);
app.use(userRoutes);
// app.use(newUsersRoutes);

app.listen(process.env.PORT, () => {
  console.log(`Server started on http://localhost:${process.env.PORT}`);
});
