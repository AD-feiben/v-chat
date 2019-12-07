import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '@/store'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import(/* webpackChunkName: "home" */ '@/views/Home.vue'),
    meta: {
      loginRequire: true
    }
  },
  {
    path: '/login',
    name: 'login',
    component: () => import(/* webpackChunkName: "login" */ '@/views/Login.vue')
  }
  // {
  //   path: '/about',
  //   name: 'about',
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  // }
];

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  if (to.name === 'login' && store.getters.isLogin) {
    return next({ name: 'home' });
  }
  if (to.meta.loginRequire === true && !store.getters.isLogin) {
    return next({ name: 'login' });
  }
  next();
})

export default router
