import '@babel/polyfill'
import Vue from 'vue'
import './plugins/vuetify'
import App from './App.vue'
import router from './router'

Vue.config.productionTip = false
import VueSocketio from 'vue-socket.io';
Vue.use(VueSocketio, 'http://localhost:3000');
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
