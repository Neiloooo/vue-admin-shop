import Vue from 'vue'
import { Button } from 'element-ui'
import {Form, FormItem} from 'element-ui'
import {Input} from 'element-ui'
//导入弹框组件,需要全局挂载才能生效
import{Message} from 'element-ui'

Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
//挂载vue的原型对象,通过$message进行调用
Vue.prototype.$message=Message