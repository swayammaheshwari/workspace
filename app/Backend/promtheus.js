import express from "express";
import { Histogram, register } from "prom-client";

const app = express();
const port = 3000;

// Register Prometheus metrics
const httpRequestDurationMicroseconds = new Histogram({
  name: "http_request_duration_ms",
  help: "Duration of HTTP requests in milliseconds",
  labelNames: ["method", "route", "code"],
  buckets: [0.1, 5, 15, 50, 100, 500],
});

// Middleware to measure HTTP request duration
app.use((req, res, next) => {
  const start = Date.now();
  res.on("finish", () => {
    const duration = Date.now() - start;
    httpRequestDurationMicroseconds
      .labels(req.method, req.route ? req.route.path : req.path, res.statusCode)
      .observe(duration);
  });
  next();
});

// Your routes go here...

app.get("/", (req, res) => {
  res.send("server is live");
});

// Expose metrics endpoint for Prometheus
app.get("/metrics", async (req, res) => {
  res.set("Content-Type", register.contentType);
  const metrics = await register.metrics();
  return res.end(metrics);
});

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
