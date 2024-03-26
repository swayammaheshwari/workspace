import express from "express";

const app = express();
// app.set("view engine", "ejs");
app.use(express.json());
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  console.log("/ get called");
  res.send("Hello World");
});

app.get("/lazy", (req, res) => {
  let j = 0;

  for (let i = 0; i < 200004000; i++) {
    j++;
  }

  res.send(`send data ${j}`);
});

app.post("/", (req, res) => {
  const name = req.body.name;
  console.log("post called");
  return res.status(201).send(`Name is ${name}`);
});

app.listen(5000, function () {
  console.log(`Server started on http://localhost:${5000}`);
});
