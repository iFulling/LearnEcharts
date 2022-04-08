import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import axios from "axios";
import SocketService from "@/utils/socket_service";
import "@/assets/css/global.less";
import "@/assets/font/iconfont.css";

SocketService.Instance.connect();
// 请求基准路径
axios.defaults.baseURL = "http://192.168.177.77:5000";

Vue.prototype.$axios = axios;
Vue.prototype.$echarts = window.echarts;
Vue.prototype.$socket = SocketService.Instance
Vue.config.productionTip = false;

const vm = new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");

console.log(vm);