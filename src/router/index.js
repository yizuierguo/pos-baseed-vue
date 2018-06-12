import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)

export default new Router({
    mode: 'history',
    routes: [
        {
            path: '/home',
            name: 'home',
            component: require('../views/home') //home
        },
        {
            path: '/lockpos',
            name: 'lockpos',
            component: require('../views/homepages/lockpos') //锁机
        },
        {
            path: '/nextshift',
            name: 'nextshift',
            component: require('../views/homepages/nextshift') //交班
        },
        {
            path: '/holdlist',
            name: 'holdlist',
            component: require('../views/homepages/holdlist') //挂单
        },
        {
            path: '/returngoods',
            name: 'returngoods',
            component: require('../views/homepages/returngoods') //退货

        },
        {
            path: '/vicescreen',
            name: 'vicescreen',
            component: require('../views/homepages/vicescreen') //副屏

        },
        {
            path: '/login',
            name: 'login',
            component: require('../views/homepages/login') //login

        },
        {
            path: '/printtest',
            name: 'printtest',
            component: require('../views/homepages/printtest') //打印测试


        },
        {
            path: '/balance',
            component: require('../views/balance'),
            children: [
                {
                    path: 'cash',
                    // children:[
                    //     {
                    //         path: 'ok',
                    //         component: require('../views/pay/ok')
                    //     }
                    // ],
                    component: require('../views/pay/cash')
                },
                {
                    path: 'alipay',
                    component: require('../views/pay/alipay')
                },
                {
                    path: 'weixin',
                    component: require('../views/pay/weixin')

                },
                {
                    path: 'stored_card',
                    component: require('../views/pay/stored_card')

                },
                {
                    path: 'bank_card',
                    component: require('../views/pay/bank_card')

                },
                {
                    path: 'citizen_card',
                    component: require('../views/pay/citizen_card')

                },
                {
                    path: 'check',
                    component: require('../views/pay/check')

                },
                {
                    path: '*',
                    component: require('../views/pay/cash')
                },
            ]
        },
        {
            path: '*',
            component: require('../views/home')
        }
    ],
    linkActiveClass: 'active'
})
