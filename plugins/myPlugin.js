import Vue from 'vue'
import ElementUI from 'element-ui' //element-ui的全部组件
import 'element-ui/lib/theme-chalk/index.css'//element-ui的css
// import '@/theme/index.css'
Vue.use(ElementUI) //使用elementUI

process.env.Mock = false
console.log(process.env)
process.env.Mock && require('@/mock/mock.js')
import VueQriously from 'vue-qriously'
Vue.use(VueQriously)
