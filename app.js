const koa = require("koa")
const app = new koa()

app.use((context, next)=>{
    context.response.body = 'hell1112656o'
})

// app.use()

app.listen(5000, (err)=>{
    if (!err) console.log("port 5000 is listening...");;
})