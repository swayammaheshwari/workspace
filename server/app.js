import { config } from "dotenv";
config(); // if npm start is used
// config({ path: "../.env" }); // if pm2 is used
import express from "express";
import ejs from "ejs";
import connectToMongoDB from "./db/connect.js";
//routes
import startRoutes from "./routes/startRoutes.js";
import itemRoutes from "./routes/itemRoutes.js";
import UsersRoutes from "./routes/userRoutes.js";

const app = express();
app.set("view engine", ejs);
app.use(express.json());
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

connectToMongoDB();

app.use(startRoutes);
app.use(itemRoutes);
app.use(UsersRoutes);

app.listen(process.env.PORT, () => {
  console.log(`Server started on http://localhost:${process.env.PORT}`);
});
