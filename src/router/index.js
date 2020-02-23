import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
import Welcome from '../components/Welcome.vue'
import Users from '../components/user/Users.vue'

// 使用vueRouter
Vue.use(VueRouter)


const router = new VueRouter({
  routes: [{
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      component: Login
    },
    {
      path: '/home',
      component: Home,
      redirect: '/welcome',
      children: [{
          path: '/welcome',
          component: Welcome
        },
        {
          path: '/users',
          component: Users
        }
      ]
    }
  ]
})

//将路由对象挂载路由导航守卫(接收回调函数)
router.beforeEach((to, from, next) => {
  //to将要访问的路径
  //from代表从哪个路径跳转而来
  //next是一个函数,表示放行
  // next()代表放行    next('/login')代表强制跳转到/login 
  if (to.path === '/login') return next()
  //获取token
  const tokenstr = window.sessionStorage.getItem('token')
  if (!tokenstr) return next('/login') //不存在token返回登录页
  next() //存在直接放行
})


export default router