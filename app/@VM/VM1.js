import { NodeVM } from "vm2";
// const NodeVM = require("vm2");

import scripts from "./script.js";

const vm = new NodeVM({
  require: {
    external: true,
    root: "./",
  },
  module: {
    builtin: ["*"],
    external: true,
    root: process.cwd(),
  },
});

vm.run(scripts.script1, "vm.js");
