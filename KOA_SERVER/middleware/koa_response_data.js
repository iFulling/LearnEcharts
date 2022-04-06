const path = require("path");
const fileUtils = require("../utils/file_utils");

module.exports = async (context, next) => {
  // 根据url访问指定文件
  const url = context.request.url;
  let filePath = "../data" + url + ".json";
  filePath = path.join(__dirname, filePath);

  try {
    // 访问文件内容
    const ret = await fileUtils.getFileJsonData(filePath);
    context.response.body = ret;
  } catch (error) {
    const errMsg = {
      msg: "文件不存在",
      status: 404,
    };
    context.response.body = JSON.stringify(errMsg);
  }

  await next();
};
