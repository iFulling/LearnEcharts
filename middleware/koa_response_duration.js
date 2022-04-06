module.exports = async (context, next) => {
  // 记录开始时间
  const start = Date.now();

  // 让内层中间件执行
  await next();

  // 结束时间
  const end = Date.now()

  // 设置响应头 context.set(key, value)
  const duration = end - start
  context.set("X-Response_time", duration + 'ms')
};
