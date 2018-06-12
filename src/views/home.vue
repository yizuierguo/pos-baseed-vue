<template>
    <div id="content">
        <header class="header">
            <mainheader v-once></mainheader>
            <ul class="nav">
                <li><a class="current" href="">POS收银[ctrl＋1]</a></li>
                <li><a href="http://daily.52shangou.com/poscrm/sdgOrder/orderList?from=newPos">闪电购订单[ctrl＋2]</a></li>
                <li><a href="http://daily.52shangou.com/poscrm/item/goodsControl?from=newPos">商品管理[ctrl＋3]</a></li>
                <li><a href="http://daily.52shangou.com/poscrm/member/memberRecharge?from=newPos">会员管理[ctrl＋4]</a></li>
                <li><a href="http://daily.52shangou.com/poscrm/report/reportpage?from=newPos">后台[ctrl＋5]</a></li>
            </ul>
            <LazyRender :time="10">
                <topsearch v-once v-on:fromtopsearch="searchitem"></topsearch>
            </LazyRender>
            <div class="fixed-btns">
               <span class="key-btn">
                    <i class="icon icon-money"></i>
                    <span class="text">钱箱[空格]</span>
               </span>
                <span class="key-btn" @click="earningdilog = true">
                    <i class="icon icon-revenue"></i>
                    <span class="text">营收[Y]</span>
               </span>
            </div>
        </header>
        <div class="container scrollbar">
            <div class="content">
                <LazyRender :time="10">
                    <cartlist v-once></cartlist>
                </LazyRender>
            </div>
        </div>
        <footer class="footer">
            <div class="vip-info clearfix">
                <span class="vip" v-if="vipInfo.name && hasSearched">
                    <span class="label">会员：<span>{{vipInfo.name}}</span></span>
                    <span class="label">余额：<span>{{vipInfo.balance | formatPrice(2)}}</span></span>
                    <span class="label">尊享：<span>{{vipInfo.discount}} 折</span></span>
                </span>
                <span class="cart">
                    <template v-if="cartList.length == 0">
                        上笔已付 {{ lastorder.totalPrice | formatPrice(1) }}  找零 {{lastorder.toZero | formatPrice(1)}}
                    </template>
                    <template v-else="">
                        <template v-if="balanceInfo.num">
                        共 {{ balanceInfo.num}} 件  合计 {{ balanceInfo.showTotalPriceNoMember | formatPrice(2)}};  <span
                                v-if="balanceInfo.vipSave"> 会员优惠 {{ balanceInfo.vipSave | formatPrice(2)}}</span>
                        </template>
                        <template v-else="">
                            共 0 件  合计 0 ;  会员优惠 0
                        </template>
                    </template>
                </span>
            </div>
            <div class="key-area">
                <ul class="tool-list">
                    <li><span class="tool-btn" @click="clearCartList"><i class="icon icon-cancel"
                                                                         :class="{'icon-cancel-active':cartList.length > 0}"></i><span
                            class="text">取消订单</span><span
                            class="key">ESC</span></span></li>
                    <li>
                        <template v-if="cartList.length > 0">
                            <span class="tool-btn" @click="isshowholdlistdialog = true"><i
                                    class="icon icon-hold icon-hold-active"></i><span class="text">挂单</span><span
                                    class="key">Q</span></span>
                        </template>
                        <template v-else="">
                            <span class="tool-btn no-cursor"><i class="icon icon-hold"></i><span
                                    class="text">挂单</span><span class="key">Q</span></span>
                        </template>
                    </li>
                    <li>
                        <span class="tool-btn hold-btn" :class="{'hold-btn-disabled':holdlistlength() == 0}"
                              @click="gotoholdlist"><i
                                class="num">{{ holdlistlength() }}</i><span class="text">已挂单</span><span
                                class="key">W</span></span>
                    </li>
                    <li><span class="tool-btn" @click="gotoreturngoods"><i class="icon icon-goods"></i><span
                            class="text">退货</span><span
                            class="key">Z</span></span></li>
                    <li><span class="tool-btn" @click="reprintorder"><i class="icon icon-reprint"
                                                                        :class="{'icon-reprint-active':lastorder.hasLastOrder}"></i><span
                            class="text">重印</span><span
                            class="key">C</span></span></li>
                    <li>
                        <template v-if="vipInfo.name && hasSearched">
                             <span class="tool-btn" @click="isshowcancelvipdialog = true"><i
                                     class="icon icon-vip"></i><span
                                     class="text">取消会员</span>
                                 <span class="key">V</span></span>
                        </template>
                        <template v-else="">
                            <span class="tool-btn" @click="isshowvipdialog = true"><i class="icon icon-vip"></i><span
                                    class="text">会员</span>
                        <span class="key">V</span></span>
                        </template>
                    </li>
                </ul>
                <span class="balance-btn" @click.prevent="tobuildpayorder">
                    <p class="num">
                        <template v-if="balanceInfo.salesTotalPrice">
                            结算  {{balanceInfo.salesTotalPrice | formatPrice(1)}}
                        </template>
                        <template v-else="">
                            结算 0.00
                        </template>
                    </p>
                    <p class="key">[enter]</p>
                </span>
            </div>
        </footer>
        <!-- 今日营收 -->
        <el-dialog title="今日营收" v-if="earningdilog" v-model="earningdilog" :show-close="false" custom-class="ele-modal"
                   top="30%">
            <div class="cus-cont">
                <p class="summary">已营收 {{report.totalOrderAmount}} 笔</p>
                <h4 class="sum">{{report.totalPrice | formatPrice(1)}}</h4>
            </div>
            <span slot="footer" class="dialog-footer">
                    <el-button type="print" @click="printdayreport">打印营收小票[C]</el-button>
                    <el-button type="cancel" @click="earningdilog = false">取消[ESC]</el-button>
                  </span>
        </el-dialog>
        <!-- 会员 -->
        <el-dialog title="" v-if="isshowvipdialog" v-model="isshowvipdialog" :show-close="false"
                   custom-class="ele-modal" top="30%">
            <div class="cus-cont no-top-border">
                <div class="search-panel">
                    <input class="code-input" v-focus type="text" v-model="mobile" placeholder="输入会员手机号或储值卡号"
                           @keydown.enter="getvipinfo($event)">
                    <span class="code-btn" :class="{'code-btn-active':isBtn}" @click="getvipinfo($event)">
                            <p class="icon icon-search"></p>
                            <p class="key">搜索[enter]</p>
                        </span>
                </div>
                <template v-if="vipInfo.name">
                    <div class="search-result">
                        <span class="label">会员：{{vipInfo.name}}</span>
                        <span class="line"></span>
                        <span class="label">余额：{{vipInfo.balance | formatPrice(2)}}</span>
                        <span class="line"></span>
                        <span class="label">{{vipInfo.discount}}折</span>
                    </div>
                </template>
                <template v-else-if="vipInfo && hasSearched">
                    <div class="no-result">
                        <p class="tips">无此会员</p>
                        <a class="link" href="#" target="_self">注册会员[ctrl+V]</a>
                    </div>
                </template>
            </div>
            <span slot="footer" class="dialog-footer">
                    <el-button type="print" @click="confirmvip">确定[enter]</el-button>
                    <el-button type="cancel" @click="cancelvip">取消[ESC]</el-button>
                  </span>
        </el-dialog>
        <!-- 取消会员 -->
        <el-dialog title="" v-if="isshowcancelvipdialog" v-model="isshowcancelvipdialog" :show-close="false"
                   custom-class="ele-modal" top="30%">
            <div class="cus-cont height-mini no-top-border">
                你确定要取消会员吗？
            </div>
            <span slot="footer" class="dialog-footer">
                    <el-button type="print" @click="confrimCancelVip">确定[enter]</el-button>
                    <el-button type="cancel" @click="isshowcancelvipdialog = false">取消[ESC]</el-button>
                  </span>
        </el-dialog>
        <!-- 取消订单 -->
        <el-dialog v-if="isshowcancelcartdialog" v-model="isshowcancelcartdialog" :show-close="false"
                   custom-class="ele-modal" top="30%">
            <div class="cus-cont height-mini no-top-border">
                你确定要取消订单吗？
            </div>
            <span slot="footer" class="dialog-footer">
                    <el-button type="print" @click="isshowcancelcartdialog = false">确定[enter]</el-button>
                    <el-button type="cancel" @click="isshowcancelcartdialog = false">取消[ESC]</el-button>
                  </span>
        </el-dialog>
        <!-- 挂单 -->
        <el-dialog v-if="isshowholdlistdialog" v-model="isshowholdlistdialog" :show-close="false"
                   custom-class="ele-modal" top="30%">
            <div class="no-top-border">
                <p class="confrim-title">你确定将此单挂起吗？</p>
                <textarea class="textarea" v-model="remark" rows="5" placeholder="挂单备注"></textarea>
            </div>
            <span slot="footer" class="dialog-footer">
                    <el-button type="print" @click="confirmholdlist">确定[enter]</el-button>
                    <el-button type="cancel" @click="cancelholdlist">取消[ESC]</el-button>
                  </span>
        </el-dialog>
        <!-- 绑定支付宝相关 -->
        <el-dialog v-if="notBindAlipay" v-model="notBindAlipay" :show-close="true" custom-class="ele-modal" top="30%">
            <div class="bind-panel">
                <p class="bind-title">您的支付宝尚未绑定，将不能使用支付宝付款</p>
                <a href="#" class="link" @click="linktobindalipay">立即绑定</a>
            </div>
        </el-dialog>
        <LazyRender :time="300">
            <bindalipay class="h-bind-alipay" v-once></bindalipay>
        </LazyRender>
    </div>
</template>
<script>
    import Vue from 'vue';

    import {mapGetters} from 'vuex';
    import LazyRender from '../components/lazy.vue';
    import mainheader from '../components/mainheader';
    import topsearch from '../components/topsearch';
    import cartlist from '../components/cartlist';
    import bindalipay from '../components/bindalipay';
    import Util from '../libs/util';
    import Win from '../libs/win';
    import Winprint from '../libs/winprint';

    import {Button, Dialog} from 'element-ui';
    Vue.use(Button);
    Vue.use(Dialog);

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
    //键盘匹配表(大小键盘)
    export default{
        data(){
            return {
                mobile: '',            //会员搜索手机号会员卡号
                hasSearched: false,    //是否已经搜索过会员了
                earningdilog: false,
                isshowvipdialog: false,
                isshowcancelvipdialog: false,
                isshowcancelcartdialog: false,
                isshowholdlistdialog: false,
                ishasvip: true,
                isshowtoast: true,
                remark: '', //挂单备注
                notBindAlipay: false,
                /* 调试相关 发布前去掉 */
                debugdialog: false,
                method: '',
                param: ''
            }
        },
        mounted: function () {
            var self = this;
            document.onkeydown = function (e) {
                if (self.isMachineInput()) {
                    //判断扫码枪逻辑
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
                    if (e.keyCode == 13 && keydowncount > 11) {
                        console.log(keyvalue);
                        self.searchitem(e, keyvalue);
                        keyvalue = '';
                        keydowncount = 0;
                    }
                }
                //键盘事件
                switch (e.keyCode) {
                    case 80:
                        self.$store.dispatch('setItemEditType', 'amount');
                        break;
                    case 79:
                        self.$store.dispatch('setItemEditType', 'price');
                        break;
                    case 27:
                        self.clearCartList();
                        break;
                    case 40:
                        e.preventDefault();
                        self.toggleItemCurrent('down');
                        break;
                    case 38:
                        e.preventDefault();
                        self.toggleItemCurrent('up');
                        break;
                    case 46:
                        //非编辑模式下 非弹层模式下 才能快捷键删除
                        if (!self.isshowholdlistdialog && !self.$store.state.home.editType && !self.isshowvipdialog) {
                            self.$store.dispatch('delCartItemFromList', ['', 'cartList']);
                            self.$store.dispatch('setBalanceInfo');
                        }
                        break;
                    case 81:
                        if (self.$store.getters.cartList.length > 0) {
                            self.isshowholdlistdialog = true;
                            break;
                        }
                    case 68:
                        self.debugdialog = true;
                        break;
                    default:
                }
            }

            self.$store.dispatch('setBalanceInfo');
            //从挂单中提取的数据
            self.renderDistillholdlist();
            //支付宝绑定相关
            this.initAliPayBindStatus();
            this.storageCheckAliPayBindStatus();
        },
        computed: {
            ...mapGetters(['vipInfo', 'balanceInfo', 'cartList']),
            isBtn(){
                return this.mobile ? true : false;
            },
            //获取营收信息
            report(){
                var res = Win.getReportInfo();
                debugger
                var report = {};
                if (res.status && res.entry) {
                    report.totalOrderAmount = res.entry.totalOrderAmount;
                    report.totalPrice = res.entry.totalPrice;
                }
                return report;
            },
            //有没有上一笔订单
            lastorder(){
                var param = {
                        status: "2",
                        orderByDesc: true,
                        orderByColumn: "bizOrderId",
                        pageSize: 1
                    },
                    buildParam = JSON.stringify(param);
                var res = Win.getOrderByRuler(buildParam);
                var obj = {};
                if (res.status && res.entry && res.entry.length > 0) {
                    obj.hasLastOrder = true;
                    obj.totalPrice = res.entry[0].totalPrice ? res.entry[0].totalPrice : '0';
                    //非现金支付
                    if (res.entry[0].totalPrice == res.entry[0].actualPay) {
                        obj.toZero = 0;
                    } else {
                        obj.toZero = parseInt(res.entry[0].actualPay) - parseInt(res.entry[0].totalPrice ? res.entry[0].totalPrice : '0');
                    }
                } else {
                    obj.hasLastOrder = false;
                    obj.totalPrice = 0;
                    obj.toZero = 0
                }
                return obj;
            }
        },
        methods: {
            //判断支付宝绑定状态
            initAliPayBindStatus: function () {
                var _isOnline = navigator.onLine;
                var bindStatus = localStorage.getItem('bindalipay');
                if (_isOnline) {
                    var res = Win.isBindAlipayAccount(); //客户端方法中获取是否绑定成功
                    if (res.status) {
                        //更新state中状态
                        this.notBindAlipay = false;
                        //更新ls中bindalipay值
                        localStorage.setItem('bindalipay', 'true');
                    } else {
                        //更新state中状态
                        this.notBindAlipay = true;
                        //更新ls中bindalipay值
                        localStorage.setItem('bindalipay', 'false');
                    }
                } else {
                    if (bindStatus && bindStatus == 'true') {
                        this.notBindAlipay = false;
                    } else if (bindStatus && bindStatus == 'false') {
                        this.notBindAlipay = true;
                    }
                }
            },
            //绑定网络状态事件 监测绑定信息
            storageCheckAliPayBindStatus: function () {
                var self = this;
                window.addEventListener("online", function () {
                    self.initAliPayBindStatus();
                }, false);
            },
            //展示授权浮层
            linktobindalipay: function () {
                this.notBindAlipay = false;
                this.$store.dispatch('setShowBindAlipay');
            },
            isMachineInput: function () {
                if (window.inputType == 'hand') {
                    return false;
                } else if (window.inputType == 'machine') {
                    return true;
                }
            },
            //根据手机号会员卡号搜索会员
            getvipinfo: function () {
                var mobile = this.mobile;
                if (Util.isPositiveInteger(mobile)) {
                    this.$store.dispatch('getVipInfo', mobile);
                    this.$store.dispatch('setBalanceInfo');
                    this.hasSearched = true;
                } else {
                    Util.toast('卡号错误', 'failed', 2000);
                }
            },
            //确定选择某个会员
            confirmvip: function () {
                this.mobile = '';
                this.isshowvipdialog = false;
            },
            //取消会员选择
            cancelvip: function () {
                this.mobile = '';
                this.isshowvipdialog = false;
                this.hasSearched = false;
                this.$store.dispatch('cancelVipInfo');
                this.$store.dispatch('setBalanceInfo');
            },
            //确定取消会员
            confrimCancelVip: function () {
                this.isshowcancelvipdialog = false;
                this.hasSearched = false;
                this.$store.dispatch('cancelVipInfo');
                this.$store.dispatch('setBalanceInfo');
            },
            //取消订单
            clearCartList: function () {
                this.$store.dispatch('clearCartList');
                this.$store.dispatch('setBalanceInfo');
            },
            //切换展示高亮行
            toggleItemCurrent: function (way) {
                this.$store.dispatch('toggleItemCurrent', way);
            },
            //组装参数构建订单
            tobuildpayorder: function () {
                if (this.$store.getters.cartList.length > 0) {
                    this.$store.dispatch('toBuildPayOrder', '1'); //1:正向收银订单
                    this.$router.push({path: '/balance/cash'});   //跳转到结算页面
                }
            },
            //重印
            reprintorder: function () {
                var param = {status: 2},
                    buildParam = JSON.stringify(param);
                var res = Win.getOrderByRuler(buildParam);
                var report = Win.getReportInfo();
                var shop = Win.getShopInfo();
                var user = Win.queryLoginUserInfo();
                var cont = {
                    report: report.status ? report.entry : {},
                    shop: shop.status ? shop.entry && shop.entry.shopName : '',
                    user: user.status ? user.entry && user.entry.realName : ''
                }
                var cfg = Util.extend(res, cont);
                Winprint(cfg, 'reprintorder');
            },
            //营收小票
            printdayreport: function () {
                var report = Win.getReportInfo();
                var shop = Win.getShopInfo();
                var user = Win.queryLoginUserInfo();
                var cont = {
                    report: report.status ? report.entry : {},
                    shop: shop.status ? shop.entry && shop.entry.shopName : '',
                    user: user.status ? user.entry && user.entry.realName : ''
                }
                Winprint(cont, 'dayreport');
            },
            //跳转到已挂单
            gotoholdlist: function () {
                if (this.$store.getters.cartList.length > 0) {
                    Util.toast('有未结算商品', 'notice', 2000);
                    return;
                }
                var holdList = JSON.parse(localStorage.getItem('holdList'));
                if (holdList && holdList.length > 0) {
                    // 判断是否可以跳转到已挂单
                    this.$router.push({path: 'holdlist'});
                }
            },
            //跳转到退货
            gotoreturngoods: function () {
                if (this.$store.getters.cartList.length > 0) {
                    Util.toast('有未结算商品', 'notice', 2000);
                    return;
                }
                this.$router.push({path: 'returngoods'});
            },
            //从子组件监听的方法
            searchitem: function ($event, barcode) {
                this.$store.dispatch('getItemByBarcode', [barcode, 'cartList']);
                this.$store.dispatch('setBalanceInfo');
            },
            //取消挂单
            cancelholdlist: function () {
                this.isshowholdlistdialog = false;
                this.remark = '';
            },
            //确认挂单
            confirmholdlist: function () {
                //构建数组
                var holdList = localStorage.getItem('holdList') ? JSON.parse(localStorage.getItem('holdList')) : [];
                var obj = {
                    holdtime: new Date().getTime(),                                             //挂单时间
                    vipInfo: this.$store.getters.vipInfo,                                      //挂单的会员信息
                    cartList: this.$store.getters.cartList,                                    //挂单列表
                    balanceInfo: this.$store.getters.balanceInfo,                              //挂单结算信息
                    remark: this.remark                                                        //挂单备注
                }
                holdList.push(obj);
                localStorage.setItem('holdList', JSON.stringify(holdList) ? JSON.stringify(holdList) : '');
                //清理结算信息 购物车 会员信息
                this.confrimCancelVip();
                this.clearCartList();
                //关闭弹层
                this.isshowholdlistdialog = false;
                this.remark = '';
            },
            //挂单后手动手动触发
            holdlistlength: function () {
                var holdList = localStorage.getItem('holdList') ? JSON.parse(localStorage.getItem('holdList')) : '';
                if (holdList != '[]') {
                    return holdList.length;
                }
                return 0;
            },
            //检测distillholdlist变化 渲染页面
            renderDistillholdlist: function () {
                var distillholdlist = localStorage.getItem('distillholdlist') ? JSON.parse(localStorage.getItem('distillholdlist')) : [];
                this.$store.dispatch('setDistillData', distillholdlist);
            },
            //高亮元素处于可视区域内
            scrollToView: function () {

            },
            reloadpage: function () {
                location.reload(true);
            }
        },
        components: {
            mainheader,
            topsearch,
            cartlist,
            bindalipay,
            LazyRender
        }
    }
</script>
<style lang="less" rel="stylesheet/less">
    .ele-modal {
        width: 540px !important; /**是否取消宽度自适应**/
    }

    .cus-cont {
        height: 150px;
        border-top: #E6E6E6 double 4px;
        text-align: center;

        .summary {
            font-size: 16px;
            color: #999;
            margin-top: 40px;
        }

        .sum {
            font-size: 40px;
            color: #333;
            font-weight: normal;
        }

    }

    .height-mini {
        height: 60px;
        font-size: 18px;
        color: #333;
    }

    .confrim-title {
        text-align: left;
        font-size: 18px;
        color: #333;
        margin-bottom: 20px;
    }

    .no-top-border {
        border-top: none;
    }

    .textarea {
        width: 480px;
        height: 150px;
        border-radius: 2px;
        background-color: #fff;
        -webkit-transition: border linear 0.2s, box-shadow linear 0.2s;
        padding: 5px 10px;
        color: #555;
        border: 1px solid #ccc;
        box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075);
        transition: border linear 0.2s, box-shadow linear 0.2s;
        font-size: 16px;
    }

    .search-panel {
        width: 500px;
        height: 40px;
        overflow: hidden;
        margin: 15px auto 15px;
        border: 1px solid #E6E6E6;
        background-color: #fff;
        border-radius: 2px;

        .code-input {
            width: 395px;
            padding-left: 8px;
            height: 40px;
            border: none;
            vertical-align: middle;
            outline: 0;
            font-size: 14px;
            color: #333;
        }

        .code-btn {
            width: 91px;
            height: 40px;
            text-align: center;
            vertical-align: middle;
            display: inline-block;
            cursor: pointer;
            font-size: 12px;
            color: #CCC;
            background: #FAFAFA;
            border-left: 1px solid #E4E4E4;
            cursor: pointer;

            .icon {
                font-size: 12px;
                line-height: 26px;
                height: 25px;
            }

            .icon-search {
                background-repeat: no-repeat;
                background-position: 50% center;
                background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAWCAYAAADEtGw7AAAAAXNSR0IArs4c6QAAAhtJREFUOBHVlL9LW1EUx80PEhK6damxiAXbJmOSRbeUOnRxE6fuBaFDKRQaiv9AHTtUBP8Al0g7dKuCcxLikiFuoot0ehAhhLx+vvHea/LeTaE6eeHmnHvO937uee+el7m5hzYSvoLb7fbSaDSqh2G4lkgkCtgA20S7W61WG7490VgM3Gw23yHaAfYoKtaaAw7y+fxWqVT648vbWNI6soIC/C4ogAZzPZvNLmJXmV+Q9Mlt9vv9n9ipvZMc+a7iTqfzbDgcnhroex75W1TMwcvkT4g/4aBPaL5GNXbtTgX62UAbPqg2ED9LJpN6VRrbvV4ve+PGfx0Y6JpJ78dlt5FKpfKDaq9URBAEK7eZac+BEReUymQynWmJd3VqovPeLEEHpoJAosFgsDBLbONoxxqKObexqHVgROpTjdc3xv/LJT9F+5IZ5nI5W3lM7MBkdpWlmrpuP6Y0AS55D4266bBYLI6f0qd1YG5cfXuAKM/GE+DrkxtUKbFf5N4Qv0b7YTIf9V0fK9Htdh+b5l/Vms1XGPX2Av4LrAq5NvN3KpWql8vlHuvYmAIrq82tVusj7ja++6wBh8QOVSn/Izv4G/iX9HXNB4+B2TAean7Tp/MAznVR9p3yJ/Uc+DEHF8hdAH8Vhc8E2wNmWQM/Aq7XdIGupi/T6u8MFuBfcNcV9qT/sebxa6pYlTP37P57gQUxj1/DPU6n028Ve5jjL/378aXrFykyAAAAAElFTkSuQmCC");
            }

            .key {
                font-size: 12px;
                line-height: 6px;
            }

        }
        .code-btn-active {
            color: #333;
            background: #FFF;

            .icon-search {
                background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAWCAYAAADEtGw7AAAAAXNSR0IArs4c6QAAAjpJREFUOBHVVD1II1EQTjZ/TToRTFbkBD1PqytCkgUL5a4wkHSSyj5wcK1gEEnvlVd4CPbaRLRXQUJIiMVZidotmyaxEA8t8uf37e1bss/dwHlVHszOzsw335s3b3Z9vnFbfreC0+n0h06nU/T7/V8Hg0EcmCfIVSAQ+FWv18tuObLvDXEikSiA7AeAURls2UfY4Bs2ePCIm25lOGiR7sFH0jIIcoqizASDQQ3Vb8P3DMn3+/3TUqnkyIXfseyKk8nkbK/Xu0Y0CpLvjUbjpwMJQ9O0ObToEieaAmYTmF0ZI2x7V5BuwWlW6kbKhGq1eg9V4DvIdzKZTITvbssm5kURgOMfuAGFD5ue4L0Fibbb7bTwy9omtm6flfyWQbKNItgyYmNyTNg2MRwcKR8uSxVBLw1CgdG9MMPEVwSh11+8wPSnUqlpqAXIIBKJmJXTLy+bmMPPIKop8vZloLCx8T7eOU3HlUrFPKWIDeuAMAzDuInH40uwP2NO86qq3jabzVsRZ6WxWOwQG6+hxy+oNqfr+qOIy9qeYwYwyxMcfiRrFrDFi7J6+hE+haTQlDOcslir1e4srEPZraCXn2k2m11G8ibMP5BJkLLnnyAsohwOhxehz+Bf73a7FzjJPOw3y1HxcJTDzzkFAUdK50WJnpKMpPDzB2Xgk1+VK/ckRsLIZZGfA8TRM3CSFevLNPPeTczsUeSOHptb/cODx2elSDEgKn5QHEVz/RcxGXh8kuPCL0Kh0MZf2nF8vgIxYuATk4hYMQAAAABJRU5ErkJggg==");
            }

        }
    }

    .search-result {
        width: 500px;
        height: 40px;
        line-height: 40px;
        text-align: left;
        text-indent: 20px;
        margin: 0 auto 0;
        background: #FFF9D4;
        border: 1px solid #EBE5C5;

        .label {
            font-size: 14px;
            color: #333;
        }

    }

    .no-result {
        margin-top: 35px;

        .tips {
            font-size: 20px;
            color: #999;
        }

        .link {
            font-size: 14px;
            color: #266BBB;
        }

    }

    .bind-panel {
        text-align: center;
        padding: 40px 0;
        .bind-title {
            font-size: 18px;
            color: #333;
            margin-bottom: 50px;
        }
        .link {
            background: #e13d31;
            border: 1px solid rgba(0, 0, 0, 0.10);
            border-radius: 4px;
            width: 219px;
            height: 48px;
            line-height: 48px;
            display: inline-block;
            font-size: 18px;
            color: #fff;
        }
    }

    /* ======================= 800分辨率 ======================= */
    @media screen and (max-width: 1023px) {
        .nav {
            padding-left: 0px;
        }
    }
    /* alipay bind style fixed */
    .h-bind-alipay {
        .bindAlipay {
            margin-top: 100px !important;
        }
    }
</style>
