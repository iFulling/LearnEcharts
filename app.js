// 创建 koa 对象
const koa = require("koa");
const context = require("koa/lib/context");
const app = new koa();

// 第一层中间件
// context 是一个web容器，传入请求和相应的内容。
// 使用 next 调用下一个中间件，返回一个 promise 对象
app.use(async (context, next) => {
  // 进入中间件时想做的事
  console.log("第一层中间件");
  context.response.body = "hell1112656o";
  const res = await next();
  // 离开中间件之后做的事
  console.log(res);
});

// 第二层中间件
app.use((context, next) => {
  console.log("第二层中间件");
  next();
  return "45454"
});

// 第三层中间件
app.use((context, next) => {
  console.log("第三层中间件");
});

app.listen(5000, (err) => {
  if (!err) return console.log("port 5000 is listening...");
  console.log(err);
});
