require("dotenv").config();
const express = require("express");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();
app.set("view engine", "ejs");
app.use(express.json());
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

mongoose.set("strictQuery", true);
mongoose.connect(process.env.MONGOLAB_URI);

app.get("/", (req, res) => {
  console.log("get called");
  res.send("Hello World");
});

app.post("/", (req, res) => {
  const name = req.body.name;
  console.log("post called");
  return res.status(400).send(`Name is ${name}`);
});

app.listen(process.env.PORT, function () {
  console.log(`Server started on http://localhost:${process.env.PORT}`);
});
