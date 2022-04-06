// 创建 koa 对象
const koa = require("koa");
const context = require("koa/lib/context");
const app = new koa();

// 绑定第一层中间件
const resDurationMiddleware = require("./middleware/koa_response_duration")
app.use(resDurationMiddleware)

app.listen(5000, (err) => {
  if (!err) return console.log("port 5000 is listening...");
  console.log(err);
});
