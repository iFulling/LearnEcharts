module.exports = async (context, next) => {
  const contentType = "application/json; charset=utf-8";
  context.set("content-Type", contentType);
  // 允许跨域
  context.set("access-control-allow-origin", "*");
  context.set("access-control-allow-methods", "options,get,put,post,delete");
  await next();
};
