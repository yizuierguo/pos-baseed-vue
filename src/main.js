import Vue from 'vue'
import App from './App'
import router from './router'
import store from './vuex/store'

//引入ElementUI
import 'element-ui/lib/theme-default/index.css';
//自定义指令
Vue.directive('focus', {
    // 当绑定元素插入到 DOM 中。
    inserted: function (el, {}, vnode, oldVnode) {
        // 聚焦元素
        el.focus()
    }
});
//初始化
new Vue({
    router,
    el: '#app',
    store,
    template: '<App/>',
    components: {App}
})
