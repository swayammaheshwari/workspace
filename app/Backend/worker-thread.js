import { parentPort } from "node:worker_threads";

let j = 0;

for (let i = 0; i < 200400000000; i++) {
  j++;
}

parentPort.postMessage(j);
