// 引入express
const express = require("express")
// 引入connect-history-api-fallback
const history = require("connect-history-api-fallback")

// 创建app
const app = express()
// 必须在指定资源之前使用
app.use(history())
// 指定静态资源
app.use(express.static(__dirname + '/static'))

// 端口监听
app.listen(5000, (err) => {
    if (!err) console.log("5000端口正在监听...");
})