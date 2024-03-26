import express from "express";
import { Worker } from "node:worker_threads";

const app = express();

app.use(express.json());
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  console.log("get called");
  res.send("Hello World");
});

app.get("/ss", (req, res) => {
  const worker = new Worker("./app/ExpressMonitor/worker-thread.js");
  worker.on("message", (j) => {
    res.send(`Second page ${j}`);
  });
  console.log("second page");
});

app.post("/", (req, res) => {
  const name = req.body.name;
  console.log("post called");
  return res.status(400).send(`Name is ${name}`);
});

app.listen(3000, function () {
  console.log(`Server started on http://localhost:${3000}`);
});

// const worker = new Worker(__dirname + "/workers/screenshotWorker.js");
//   // When the worker sends a message back to us, send it on as the response
//   worker.on("message", data => {
//     console.log(`Received ${data} from worker`);
//     res.type('png');
//     res.end(data);
//     });
