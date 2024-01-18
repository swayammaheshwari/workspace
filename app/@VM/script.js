const script1 = `
import express from "express";

const app = express();
app.use(express.json());
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.listen(3000, function () {
  console.log("Server started on http://localhost:3000");
});

`;

const script2 = `
module.exports = async function* (variables) {
    //scri08bWfkrN-start
    let start, end;
    let response;
    let steporder = [];
    const context = { res: {} }
    try {
    start = calculateTime();
    yield { event: "STEP_START", stepName: "untitled1", type: "function" };

    response = await untitled1();
    context.res = { ...context.res, ['untitled1']: response };

    yield { event: "STEP_END", stepName: "untitled1", request: undefined, response: response, type: "function" };
    } catch (err) {
    yield { event: "STEP_ERROR", stepName: "untitled1", request: undefined, error: err, type: "function", creds: err?.creds || {} };

    context.res = { ...context.res, ['untitled1']: removeNestedObjects(err, 3) };
    } finally {
    end = calculateTime();
    yield { event: "STEP_TIMELOG", stepName: "untitled1", timeTaken: calculateTimeDifference(start, end), type: "function" };
    }
    delete context?.authData; yield { event: "SCRIPT_END", type: "response", response: 5 }
    return;

    //scri08bWfkrN-end

    //funcrMDHyG42-start
    async function untitled1() {
    try {

    return 5678
    } catch (err) {
    console.log("some error occur in untitled1 function", err?.message)
    throw err
    }
    finally {
    console.log("dddd")
    }
    }
    //funcrMDHyG42-end

    }

`;

export default { script1, script2 };
