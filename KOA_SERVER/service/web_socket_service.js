const path = require("path");
const fileUtils = require("../utils/file_utils");
const WebSocket = require("ws");
// 创建websocket服务端的对象，绑定的端口号是5055
const wss = new WebSocket.Server({
  port: 5055,
}); 

module.exports.listen = () => {
  // 对客户端的连接事件进行监听
  // client 代表的是客户端的连接socket对象
  wss.on("connection", (client) => {
    // 对客户端的连接对象进行 message 事件监听
    // msg 由客户端发给服务端的数据
    client.on("message", async (msg) => {
      let payload = JSON.parse(msg);
      const action = payload.action
      if (action === "getData") {
        let filePath = "../data/" + payload.chartName + ".json";
        filePath = path.join(__dirname, filePath);
        const ret = await fileUtils.getFileJsonData(filePath);
        payload.data = ret;
        client.send(JSON.stringify(payload));
      } else {
        wss.clients.forEach((client) => {
          client.send(msg.toString());
        });
      }
      // 服务端往客户端发送数据
      //   client.send("hello socket from backend");
    });
  });
};

