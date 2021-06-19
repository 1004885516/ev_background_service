import Vue from 'vue'
import App from './App.vue'
import axios from 'axios'

import router from './router'
import Router from 'vue-router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import gd from './utils/GlobalData'
import gt from './utils/GlobalMethod'

import '@/../static/css/custom-style.css'
// import '@/../static/css/custom-app.css'

Vue.use(ElementUI);
// Vue.use(Element, { size: 'small', zIndex: 3000 });

Vue.prototype.gd = gd
Vue.prototype.gt = gt

Vue.prototype.$axios = axios
Vue.config.productionTip = false

Vue.prototype.router = router

const routerPush = Router.prototype.push
Router.prototype.push = function push(location) {
    return routerPush.call(this, location).catch(error=> error)
}

new Vue({
    router,
    render: h => h(App),
}).$mount('#app')
