// Tiny local server: serves index.html and runs curl.sh when the button calls POST /run-curl
const http = require("http");
const fs = require("fs");
const path = require("path");
const { execFile } = require("child_process");

const PORT = process.env.PORT || 3000;
const curlScript = path.join(__dirname, "curl.sh");

const server = http.createServer((req, res) => {
  // Allow the page to call this server even when opened from another origin (e.g. Live Server on :5500)
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
  if (req.method === "OPTIONS") {
    res.writeHead(204);
    return res.end();
  }

  if (req.method === "GET" && (req.url === "/" || req.url === "/index.html")) {
    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    return fs.createReadStream(path.join(__dirname, "index.html")).pipe(res);
  }

  if (req.method === "POST" && req.url === "/run-curl") {
    return execFile("bash", [curlScript], { cwd: __dirname, timeout: 60000 }, (err, stdout, stderr) => {
      res.writeHead(err ? 500 : 200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ ok: !err, code: err ? err.code : 0, stdout, stderr }));
    });
  }

  res.writeHead(404);
  res.end("Not found");
});

// Bind to localhost only so nothing else on the network can trigger the script
server.listen(PORT, "127.0.0.1", () => console.log(`http://localhost:${PORT}`));
