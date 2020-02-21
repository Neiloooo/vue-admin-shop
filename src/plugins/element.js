import Vue from 'vue'
import { Button } from 'element-ui'
import {Form, FormItem,Container,Header,Aside,Main,
Menu,
Submenu,
MenuItemGroup,
MenuItem
} from 'element-ui'
import {Input} from 'element-ui'
//导入弹框组件,需要全局挂载才能生效
import{Message} from 'element-ui'

Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItemGroup)
Vue.use(MenuItem)
//挂载vue的原型对象,通过$message进行调用
Vue.prototype.$message=Message