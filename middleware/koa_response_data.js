const path = require("path");
const fileUtils = require("../utils/file_utils")

module.exports = async (context, next) => {
    // 根据url访问指定文件
    const url = context.request.url
    let filePath = "../data" + url + ".json"
    filePath = path.join(__dirname, filePath)

    // 访问文件内容
    const ret = fileUtils.getFileJsonData(filePath)
    context.response.body = ret
    
    await next()
};
