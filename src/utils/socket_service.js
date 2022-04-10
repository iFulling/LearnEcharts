export default class SocketService {
  static instance = null;
  static get Instance() {
    if (!this.instance) {
      this.instance = new SocketService();
    }
    return this.instance;
  }
  ws = null;
  callBackMapping = {};
  connected = false;
  sendRetryCount = 0;
  connectRetryCount = 0;
  connect() {
    if (!window.WebSocket) {
      return alert("你的浏览器不支持WebSocket");
    }
    this.ws = new WebSocket("ws://192.168.177.77:5055");
    this.ws.onopen = () => {
      console.log("connect");
      this.connected = true;
      this.connectRetryCount = 0;
    };
    this.ws.onclose = () => {
      console.log("close");
      this.connected = false;
      this.connectRetryCount++;
      setTimeout(() => {
        this.connect();
      }, this.connectRetryCount * 500);
    };
    this.ws.onmessage = (msg) => {
      const recive = JSON.parse(msg.data);
      const socketType = recive.socketType;
      if (this.callBackMapping[socketType]) {
        const action = recive.action;
        if (action === "getData") {
          const realData = JSON.parse(recive.data);
          this.callBackMapping[socketType].call(this, realData);
        } else if (action === "fullScreen") {
          this.callBackMapping[socketType].call(this, recive);
        } else if (action === "themeChange") {
          this.callBackMapping[socketType].call(this, recive);
        }
      }
    };
  }
  registerCallback(socketType, callback) {
    this.callBackMapping[socketType] = callback;
  }
  unRegisterCallback(socketType) {
    this.callBackMapping[socketType] = null;
  }
  send(data) {
    if (this.connected) {
      this.sendRetryCount = 0;
      this.ws.send(JSON.stringify(data));
    } else {
      this.sendRetryCount++;
      setTimeout(() => {
        this.send(data);
      }, this.sendRetryCount * 500);
    }
  }
}
