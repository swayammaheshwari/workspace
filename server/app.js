import { config } from "dotenv";
config();
import express from "express";
import ejs from "ejs";
import { set, connect } from "mongoose";
//routes
import itemRoutes from "./routes/item.js";
import startRoutes from "./routes/start.js";

const app = express();
app.set("view engine", ejs);
app.use(express.json());
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

set("strictQuery", true);
connect(process.env.MONGOLAB_URI);

app.use(itemRoutes);
app.use(startRoutes);

app.listen(process.env.PORT, () => {
  console.log(`Server started on http://localhost:${process.env.PORT}`);
});
