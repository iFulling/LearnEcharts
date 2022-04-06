// 创建 koa 对象
const koa = require("koa");
const context = require("koa/lib/context");
const app = new koa();

// 绑定第一层中间件
const resDurationMiddleware = require("./middleware/koa_response_duration")
app.use(resDurationMiddleware)

// 绑定第二层中间件
const resHeaderMiddleware = require("./middleware/koa_response_header")
app.use(resHeaderMiddleware)

// 绑定第三层中间件
const resDateMiddleware = require("./middleware/koa_response_data")
app.use(resDateMiddleware)

app.listen(5000, (err) => {
  if (!err) return console.log("port 5000 is listening...");
  console.log(err);
});
