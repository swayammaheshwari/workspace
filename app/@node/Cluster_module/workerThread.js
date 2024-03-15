// const { MessageChannel } = require("node:worker_threads");
import { MessageChannel } from "node:worker_threads";

const { port1, port2 } = new MessageChannel();
port1.on("message", (message) => console.log("received", message));
port2.postMessage({ foo: "bar" });
// Prints: received { foo: 'bar' } from the `port1.on('message')` listener
