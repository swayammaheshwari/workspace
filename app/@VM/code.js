module.exports = async function* (variables) {
  //scri08bWfkrN-start
  let start, end;
  let response;
  let steporder = [];
  const context = { res: {} };
  try {
    start = calculateTime();
    yield { event: "STEP_START", stepName: "untitled1", type: "function" };

    response = await untitled1();
    context.res = { ...context.res, ["untitled1"]: response };

    yield {
      event: "STEP_END",
      stepName: "untitled1",
      request: undefined,
      response: response,
      type: "function",
    };
  } catch (err) {
    yield {
      event: "STEP_ERROR",
      stepName: "untitled1",
      request: undefined,
      error: err,
      type: "function",
      creds: err?.creds || {},
    };

    context.res = {
      ...context.res,
      ["untitled1"]: removeNestedObjects(err, 3),
    };
  } finally {
    end = calculateTime();
    yield {
      event: "STEP_TIMELOG",
      stepName: "untitled1",
      timeTaken: calculateTimeDifference(start, end),
      type: "function",
    };
  }
  delete context?.authData;
  yield { event: "SCRIPT_END", type: "response", response: 5 };
  return;

  //scri08bWfkrN-end

  //funcrMDHyG42-start
  async function untitled1() {
    try {
      return 5678;
    } catch (err) {
      console.log("some error occur in untitled1 function", err?.message);
      throw err;
    } finally {
    }
  }
  //funcrMDHyG42-end
};
