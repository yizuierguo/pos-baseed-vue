<template>
    <div id="content">
        <header class="header balance-header">
            <mainheader></mainheader>
        </header>
        <content class="container balance-container">
            <div class="payType">
                <ul>
                    <li v-for="payType in payTypes">
                        <router-link :to="payType.link">
                            <i class="icon" :class="payType.icon"></i>
                            {{ payType.type }}
                            <br>
                            <span>{{ payType.keyMap }}</span>
                        </router-link>
                    </li>
                </ul>
            </div>
            <div class="payCentent">
                <router-view class="payMain pay-main"></router-view>
            </div>
        </content>

        <footer class="payFootBar">
            <div>
                <div class="return" @click="linktohome">返回</div>
                <template>
                    <div class="btn" @click="finishpay">{{ btnText }}<span>[enter]</span></div>
                </template>
            </div>
        </footer>
    </div>
</template>
<script>
    import mainheader from "../components/mainheader";
    import Util from '../libs/util';
    import {mapGetters} from 'vuex';
    var keymap = {
            '48': '0',
            '49': '1',
            '50': '2',
            '51': '3',
            '52': '4',
            '53': '5',
            '54': '6',
            '55': '7',
            '56': '8',
            '57': '9',
            '96': '0',
            '97': '1',
            '98': '2',
            '99': '3',
            '100': '4',
            '101': '5',
            '102': '6',
            '103': '7',
            '104': '8',
            '105': '9'
        },
        keydowntimer = null, //定时器
        keyvalue = '',     //累积的输入值
        keydowncount = 0;  //次数
    export default{
        data(){
            return {
                payTypes: [
                    {'type': '现金', 'keyMap': 'F1', 'link': '/balance/cash', 'icon': 'cash'},
                    {'type': '支付宝', 'keyMap': 'F2', 'link': '/balance/alipay', 'icon': 'alipay'},
                    {'type': '微信', 'keyMap': 'F3', 'link': '/balance/weixin', 'icon': 'weixin'},
                    {'type': '储蓄卡', 'keyMap': 'F4', 'link': '/balance/stored_card', 'icon': 'stored_card'},
                    {'type': '银行卡', 'keyMap': 'F5', 'link': '/balance/bank_card', 'icon': 'bank_card'},
                    {'type': '市民卡', 'keyMap': 'F6', 'link': '/balance/citizen_card', 'icon': 'citizen_card'},
                    {'type': '支票', 'keyMap': 'F7', 'link': '/balance/check', 'icon': 'check'},
                ],
                isiWpingZero: false,
                btnText: '完成收款'
            }
        },
        components: {
            mainheader
        },
        created: function () {
            var self = this;
            this.setOrderList();
            this.init();
            /**
             * 快捷键选择支付方式
             * @param event
             */
            window.onkeydown = function (e) {
                console.log(self.$router.options);
                /*************** 判断扫码枪逻辑 *****************/
                if (self.isMachineInput()) {
                    if (keydowntimer) {
                        clearTimeout(keydowntimer);
                    }
                    var v = keymap[e.keyCode] || '';
                    if (v) {
                        keyvalue += v;
                    }
                    if (keyvalue != '') {
                        keydowncount += 1;
                    }
                    keydowntimer = setTimeout(function () {
                        keyvalue = '';
                        keydowncount = 0;
                    }, 100);
                    //只有微信支付和支付宝支付才激活扫码枪 全屏结算功能
                    if (e.keyCode == 13 && keydowncount > 11 && (location.hash.indexOf('alipay') > -1 || location.hash.indexOf('weixin') > -1)) {
                        //扫码完成收款
                        if (Util.isPositiveInteger(keyvalue)) {
                            self.$store.dispatch('setPayCode', keyvalue);
                            self.finishpay();
                            console.log(keyvalue);
                        } else {
                            Util.toast('付款码错误', 'notice', 2000);
                        }
                        keyvalue = '';
                        keydowncount = 0;
                    }
                }
                /********************************/
                if (e && e.keyCode == 112) {
                    self.$router.push({path: 'cash'});
                    console.log('f1');
                }
                else if (e && e.keyCode == 113) {
                    self.$router.push({path: 'alipay'});
                    console.log('f2');
                }
                else if (e && e.keyCode == 114) {
                    self.$router.push({path: 'weixin'});
                    console.log('f3');
                }
                else if (e && e.keyCode == 115) {
                    self.$router.push({path: 'stored_card'});
                    console.log('f4');
                }
                else if (e && e.keyCode == 116) {
                    self.$router.push({path: 'bank_card'});
                    console.log('f5');
                }
                else if (e && e.keyCode == 117) {
                    self.$router.push({path: 'citizen_card'});
                    console.log('f6');
                }
                else if (e && e.keyCode == 118) {
                    self.$router.push({path: 'check'});
                    console.log('f7');
                }
            };
        },
        methods: {
            isMachineInput: function () {
                //如果是支付宝支付
                if(this.$store.getters.getPayType == '2'){
                    if (window.alipayInputType == 'hand') {
                        return false;
                    } else if (window.alipayInputType == 'machine') {
                        return true;
                    }
                }
                //如果是微信支付
                else if(this.$store.getters.getPayType == '3'){
                    if (window.weixinInputType == 'hand') {
                        return false;
                    } else if (window.weixinInputType == 'machine') {
                        return true;
                    }
                }
            },
            init: function () {
                this.$store.dispatch('getPayType', '1');
                this.$store.dispatch('setPayInfo');
            },
            setOrderList(){
                var self = this;
                //设置默认值
                var orderList = (localStorage.getItem('orderList') != undefined) ? JSON.parse(localStorage.getItem('orderList')) : {};
                self.$store.dispatch('setOrderlist', orderList);
            },
            finishpay(){
                var self = this;
                this.$store.dispatch('finishPay', [function () {
                    self.$store.dispatch('clearCartList'); //清空购物车
                    self.$store.dispatch('setPayInfo');
                }, function () {
                    self.$store.dispatch('setVicestatus', 'default');
                    self.$store.dispatch('setPayInfo');
                    self.linktohome();
                }]);
            },
            linktohome(){
                this.$router.push({path: '/home'});
                this.$store.dispatch('getWipingZeroStatus', '0');
            }
        },
        computed: {
            ...mapGetters([
                'getPayType',//抹零状态
            ])
        }
    }
</script>
<style lang="less" rel="stylesheet/less" scoped>
    .balance-header {
        height: 40px;
    }

    .balance-container {
        top: 40px; //90px
        bottom: 86px;
        overflow: hidden;
        z-index: 101;
    }

    div, li, span, i, p, h1, h2, input {
        box-sizing: border-box;
    }

    h1 {
        font-weight: normal;
        font-size: 14px;
        color: #999;
        height: 32px;
        text-align: left;
        position: relative;
    }

    h1:after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 0;
        width: 570px;
        height: 2px;
        background: #E6E6E6;
    }

    h1:before {
        content: '';
        position: absolute;
        bottom: -3px;
        left: 0;
        width: 570px;
        height: 1px;
        background: #E6E6E6;
    }

    .payType {
        width: 100%;
        height: 150px;
        overflow: hidden;
        background: #FFFFFF;
        box-shadow: 0 2px 2px 0 #EBEBEB;
        padding-top: 23px;
        li {
            width: 64px;
            height: auto;
            float: left;
            font-size: 14px;
            /*margin-left:72px;*/
            margin-left: 6%;
            text-align: center;
        }
        span {
            display: block;
            width: 34px;
            height: 16px;
            font-size: 12px;
            color: #fff;
            line-height: 16px;
            margin: 4px auto 0;
            background: #C0D4E5;
            border-radius: 8px;
        }
        .icon {
            display: block;
            width: 64px;
            height: 64px;
            margin: 0 0 10px 0;
            background: url('http://imgsize.52shangou.com/img/n/03/08/1488942630644_5016.png') no-repeat;
        }
        .cash {
            background-position: 0 0;
        }
        a {
            width: 64px;
            color: #666;
            display: block;
            cursor: pointer;
        }
        a:hover .cash {
            background-position: 0 -64px;
        }
        .active .cash, .active:hover .cash {
            background-position: 0 -128px;
        }
        .alipay {
            background-position: -64px 0;
        }
        a:hover .alipay {
            background-position: -64px -64px;
        }
        .active .alipay, .active:hover .alipay {
            background-position: -64px -128px;
        }
        .weixin {
            background-position: -128px 0;
        }
        a:hover .weixin {
            background-position: -128px -64px;
        }
        .active .weixin, .active:hover .weixin {
            background-position: -128px -128px;
        }
        .stored_card {
            background-position: -192px 0;
        }
        a:hover .stored_card {
            background-position: -192px -64px;
        }
        .active .stored_card, .active:hover .stored_card {
            background-position: -192px -128px;
        }
        .bank_card {
            background-position: -256px 0;
        }
        a:hover .bank_card {
            background-position: -256px -64px;
        }
        .active .bank_card, .active:hover .bank_card {
            background-position: -256px -128px;
        }
        .citizen_card {
            background-position: -320px 0;
        }
        a:hover .citizen_card {
            background-position: -320px -64px;
        }
        .active .citizen_card, .active:hover .citizen_card {
            background-position: -320px -128px;
        }
        .check {
            background-position: -384px 0;
        }
        a:hover .check {
            background-position: -384px -64px;
        }
        .active .check, .active:hover .check {
            background-position: -384px -128px;
        }
    }

    .payCentent {
        height: 100%;
        background: #F3F3F3;
        /*overflow: hidden;*/
        .payMain {
            width: 630px;
            padding: 37px 30px 0;
            height: 348px;
            background: #fff;
            position: relative;
            margin: 30px auto;
            border: 1px solid #E6E6E6;
            box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.04);
            border-radius: 2px 2px 2px 0;
        }
        .payMain:after {
            content: '';
            width: 20px;
            height: 20px;
            border-radius: 50%;
            top: 60px;
            left: -10px;
            background: #F3F3F3;
            border: 1px solid #E6E6E6;
            border-left: none;
            border-top: none;
            position: absolute;
            transform: rotate(-50deg);
            z-index: 2;
        }
        .payMain:before {
            content: '';
            width: 20px;
            height: 20px;
            border-radius: 50%;
            top: 60px;
            right: -10px;
            border: 1px solid #E6E6E6;
            border-right: none;
            border-top: none;
            transform: rotate(50deg);
            background: #F3F3F3;
            position: absolute;
        }
    }

    .payFootBar {
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 86px;
        overflow: hidden;
        background: #fff;
        z-index: 1;
        box-shadow: 2px 0 0 0 #3e4452;
    }

    .shade {
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        position: fixed;
        background: rgba(0, 0, 0, .5);
        z-index: 101;
    }

    //footer
    .return {
        float: left;
        width: 64px;
        height: 64px;
        padding-top: 34px;
        background: url('http://imgsize.52shangou.com/img/n/03/08/1488942630644_5016.png') -448px 0 no-repeat;
        text-align: center;
        margin: 10px 20px;
        position: relative;
    }

    .return:hover {
        background-position: -448px -64px;
    }

    .return:active {
        background-position: -448px -128px;
    }

    .return:after {
        content: 'esc';
        position: absolute;
        bottom: -4px;
        left: 50%;
        margin-left: -17px;
        width: 34px;
        height: 16px;
        color: #fff;
        background: #B6CFE3;
        border-radius: 100px;
    }

    .btn {
        float: right;
        width: 200px;
        height: 66px;
        color: #fff;
        font-size: 20px;
        background: #E13D31;
        border: 1px solid rgba(0, 0, 0, 0.15);
        border-radius: 4px;
        margin: 10px 20px;
        cursor: pointer;
        padding-top: 6px;
        text-align: center;
        span {
            display: block;
            font-size: 16px;
        }
    }

    .btn:hover {
        background: #ef463a;
    }

    .btn:active {
        background: #bd291f;
    }

    .notClick, .notClick:hover {
        background: #ff9992;
    }
</style>