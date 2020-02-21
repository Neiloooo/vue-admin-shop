import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
//导入全局样式表
import './assets/css/global.css'
//导入字体图标
import './assets/fonts/iconfont.css'

//导入axios
import axios from 'axios'


//设置axios的根url路径
axios.defaults.baseURL= 'http://127.0.0.1:8888/api/private/v1/'
//设置请求拦截器,挂载回调函数到config上,添加Token头
axios.interceptors.request.use(config=> {
  console.log(config)
  config.headers.Authorization = window.sessionStorage.getItem('token')
  //在最后必须返回config
  return config
})



//将axios挂在到vue根实例上,这样所有组件都可以通过this.$http发起ajax请求
Vue.prototype.$http = axios 

Vue.config.productionTip = false


new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
 