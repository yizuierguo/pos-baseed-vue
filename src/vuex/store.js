/**
 * Created by yizui on 2017/2/23.
 * 作者：李绅
 * 春种一粒粟，秋成万颗子。四海无闲田，农夫犹饿死。
 * 锄禾日当午，汗滴禾下土。谁知盘中餐，粒粒皆辛苦。
 */
import Vue from 'vue'
import Vuex from 'vuex'
import home from './modules/home'
import pay from './modules/pay'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
    modules: {
        home, //如果添加多个页面的vuex管理请在这配置
        pay
    },
    strict: debug //strict: debug
})
