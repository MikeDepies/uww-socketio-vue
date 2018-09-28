import Vue from 'vue'
import Router from 'vue-router'
import Messages from './views/MessagesView.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Messages
    }
    
  ]
})
