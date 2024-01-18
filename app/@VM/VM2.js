// const { NodeVM } = require("vm2");
import { NodeVM } from "vm2";

const vm = new NodeVM({
  console: "redirect",
  allowAsync: true,
  sandbox: {},
});

let code = `
console.log("fffd")
return "fff"
`;
vm.on("console.log", (...args) => {
  debugger;
  let myStr = "";
  args.forEach((element) => {
    if (typeof element === "object") element = JSON.stringify(element);
    myStr = `${myStr} ${element}`;
  });
  //   logs.push(myStr);
});
const functionInSandbox = await vm.run(code);

console.log(functionInSandbox);

const answer = functionInSandbox();
console.log(answer);
var next;

while (!(next = await answer.next()).done) {
  var job = next.value;
  if (job.type === "api" && job.event === EXECUTION_EVENT.STEP_ERROR) {
    job.error.response = JSON.parse(
      JSON.stringify(job.error.response || "", getCircularReplacer())
    );
    channel.postMessage(
      JSON.parse(JSON.stringify(job || "", getCircularReplacer()))
    );
  } else
    channel.postMessage(
      JSON.parse(JSON.stringify(job || "", getCircularReplacer()))
    );
}
