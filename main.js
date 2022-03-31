import App from './App'

// #ifndef VUE3
import Vue from 'vue'
Vue.config.productionTip = false
App.mpType = 'app'

// 引入uview组件ui
import uView from '@/uni_modules/uview-ui'
Vue.use(uView)

//引入uview的vuex仓库，进行混入来提供所有组件使用
let vuexStore = require("@/store/$u.mixin.js");
Vue.mixin(vuexStore);

//全局挂载接口
import * as API from '@/config/api.js'
Vue.prototype.$API = API
// 导入store仓库
import store from '@/store';
const app = new Vue({
		store,
    ...App,
})

// 引入请求封装，将app参数传递到配置中
require('config/request.js')(app)
// 将工具库在vue的实例对象上进行安装
import utils from '@/config/utils.js'
Vue.use(utils,app)

app.$mount()
// #endif





// vue3的兼容写法，只会在vue3里面运行
// #ifdef VUE3
import { createSSRApp } from 'vue'

export function createApp() {
  const app = createSSRApp(App)
  return {
    app
  }
}
// #endif