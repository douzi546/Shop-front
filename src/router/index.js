import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/login/Login'
import Home from '@/components/home/Home'
import User from '@/components/user/User'
import Right from '@/components/right/Right'
import Roles from '@/components/roles/Role'

Vue.use(Router)

const router = new Router({
  routes: [
    { path: '/', redirect: '/home' },
    {
      path: '/login', component: Login
    },
    {
      path: '/home',
      component: Home,
      children: [
        {
          path: 'user',
          component: User
        },
        {
          path: 'right',
          component: Right
        },
        {
          path: 'role',
          component: Roles
        }
      ]
    }
  ]
})
router.beforeEach((to, from, next) => {
  if (to.path === '/login') {
    next()
  } else {
    if (localStorage.getItem('token')) {
      next()
    } else {
      next('/login')
    }
  }
})
export default router
