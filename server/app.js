import { config } from "dotenv";
import express, { json, urlencoded } from "express";
import ejs from "ejs";
import { set, connect } from "mongoose";

config();
const app = express();
app.set("view engine", "ejs");
app.use(json());
app.use(express.static("public"));
app.use(urlencoded({ extended: true }));

set("strictQuery", true);
connect(process.env.MONGOLAB_URI);

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.post("/", (req, res) => {
  let message = "LIST got\n";
  for (const key in req.body) {
    message += `${key}: ${req.body[key]}\n`;
  }
  return res.send(message);
});

app.get("/items", (req, res) => {
  Item.find()
    .sort([["createdAt", "descending"]])
    .exec((err, items) => {
      if (err) {
        return console.error(err);
      } else {
        res.render("list", { list: items });
      }
    });
});

app.listen(process.env.PORT, function () {
  console.log(`Server started on http://localhost:${process.env.PORT}`);
});
