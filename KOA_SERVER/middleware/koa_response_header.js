module.exports = async (context, next)=>{
    const contentType = 'application/json; charset=utf-8'
    context.set("content-Type", contentType)
    await next()
}