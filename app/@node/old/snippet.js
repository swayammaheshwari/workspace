const codeSnippetController = {
  // 获取所有代码片段列表
  getCodeList: async (ctx, next) => {
    let result = await ctx.service.codeSnippet.getAll();
    if (result.status === "success") {
      ctx.response.status = 200;
      ctx.body = result;
    } else {
      ctx.throw("500", "服务器内部错误");
    }
  },
  // 添加一个新的代码片段
  addNewCode: async (ctx, next) => {
    console.log("进入addNewCode");
    let params = ctx.request.body;
    let result = await ctx.service.codeSnippet.saveOne(params);
    if (result.status === "success") {
      ctx.response.status = 201;
      ctx.body = {
        status: "success",
        message: "创建成功",
      };
    } else {
      ctx.throw("403", "创建失败，请检查参数是否正确");
    }
  },
};
