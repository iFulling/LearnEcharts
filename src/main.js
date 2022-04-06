import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
import "@/assets/css/global.less"

// 请求基准路径
axios.defaults.baseURL = "http://192.168.177.77:5000"

Vue.prototype.$axios = axios
Vue.prototype.$echarts = window.echarts
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')