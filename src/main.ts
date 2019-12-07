import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import '@/styles/common.scss'
import './registerServiceWorker'
import VueSocketIO from 'vue-socket.io';

Vue.config.productionTip = false

Vue.use(new VueSocketIO({
  debug: true,
  // 服务器端地址
  connection: 'http://117.48.206.189/'
}))

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
