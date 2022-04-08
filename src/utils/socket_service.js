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
  connect() {
    if (!window.WebSocket) {
      return alert("你的浏览器不支持WebSocket");
    }
    this.ws = new WebSocket("ws://192.168.177.77:5055");
    this.ws.onopen = () => {
      console.log("connect");
    };
    this.ws.onclose = () => {
      console.log("close");
    };
    this.ws.onmessage = (msg) => {
      const recive = JSON.parse(msg.data)
      const socketType = recive.socketType
      if(this.callBackMapping[socketType]){
          const action = recive.action
          if (action === "getData"){
            const realData = JSON.parse(recive.data)
            this.callBackMapping[socketType].call(this, realData)
          }else if (action ==="fullScreen"){

          }else if (action === "themeChange"){

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
  send(data){
      this.ws.send(JSON.stringify(data))
  }
}
