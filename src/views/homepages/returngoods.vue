<template>
    <div id="content">
        <header class="header" :class="{'refund-header':(status === 'refunding')}">
            <mainheader></mainheader>
            <ul class="nav">
                <li><a class="current" href="">POS收银[ctrl＋1]</a></li>
                <li><a href="">闪电购订单[ctrl＋2]</a></li>
                <li><a href="">商品管理[ctrl＋3]</a></li>
                <li><a href="">会员管理[ctrl＋4]</a></li>
                <li><a href="">后台[ctrl＋5]</a></li>
            </ul>
            <template v-if="status === 'refundbefore'">
                <topsearch v-on:fromtopsearch="searchitem"></topsearch>
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
            </template>
        </header>
        <div class="container scrollbar" :class="{'refund-container':(status === 'refunding')}">
            <div class="content">
                <template v-if="status === 'refundbefore'">
                    <refundlist></refundlist>
                </template>
                <template v-else-if="status === 'refunding'">
                    <div class="refund-panel">
                        <h4 class="title">退款</h4>
                        <div class="cont">
                            <p class="info"><span class="label">应退</span><span class="rmb">{{ refundBalanceInfo.sum | formatPrice(1) }}</span></p>
                        </div>
                        <span class="round l-round"></span>
                        <span class="round r-round"></span>
                    </div>
                </template>
            </div>
        </div>
        <footer class="footer" :class="{'refund-footer':(status === 'refunding')}">
            <div class="vip-info clearfix">
                <span class="cart">
                    <template v-if="status === 'refundbefore'">
                        <template v-if="refundBalanceInfo.num">
                            共 {{ refundBalanceInfo.num }} 件  合计  {{ refundBalanceInfo.sum | formatPrice(2)}}
                        </template>
                        <template v-else="">
                            共 0 件  合计 0.00
                        </template>
                    </template>
                </span>
            </div>
            <div class="key-area">
                <ul class="tool-list">
                    <li>
                        <span class="tool-btn" @click="backtohome">
                            <i class="icon icon-back"></i>
                            <span class="text">返回</span>
                            <span class="key">ESC</span>
                        </span>
                    </li>
                </ul>
                <template v-if="status === 'refundbefore'">
                    <span class="balance-btn" :class="{'balance-btn-disabled':(refundList.length==0)}" @click.prevent="tobuildrefundorder">
                        <p class="num">
                             <template v-if="refundBalanceInfo.num">
                                退款 {{ refundBalanceInfo.sum | formatPrice(1) }}
                            </template>
                            <template v-else="">
                                退款 0.0
                            </template>
                        </p>
                        <p class="key">[enter]</p>
                    </span>
                </template>
                <template v-if="status === 'refunding'">
                    <span class="balance-btn" @click.prevent="finishrefund">
                        <p class="num">完成退款</p>
                        <p class="key">[enter]</p>
                    </span>
                </template>
            </div>
        </footer>
        <!-- 今日营收 -->
        <el-dialog title="今日营收" v-model="earningdilog" :show-close="false" custom-class="ele-modal" top="30%">
            <div class="cus-cont">
                <p class="summary">已营收 {{report.totalOrderAmount}} 笔</p>
                <h4 class="sum">{{report.totalPrice | formatPrice(1)}}</h4>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button type="print" @click="printdayreport">打印营收小票[C]</el-button>
                <el-button type="cancel" @click="earningdilog = false">取消[ESC]</el-button>
              </span>
        </el-dialog>
    </div>
</template>
<script>
    import mainheader from '../../components/mainheader';
    import topsearch from '../../components/topsearch';
    import refundlist from '../../components/refundlist.vue';

    import Util from '../../libs/util';
    import Win from '../../libs/win';
    import Winprint from '../../libs/winprint';

    import {mapGetters} from 'vuex';

    export default{
        data(){
            return {
                status: 'refundbefore',  //退款状态:退款前refundbefore:1.无数据 2.有数据 退款中:refunding
                earningdilog: false
            }
        },
        computed: {
            ...mapGetters(['refundBalanceInfo', 'refundList']),
            //获取营收信息
            report(){
                var res = Win.getReportInfo();
                var report = {};
                if(res.status && res.entry){
                    report.totalOrderAmount = res.entry.totalOrderAmount;
                    report.totalPrice = res.entry.totalPrice;
                }
                return report;
            }
        },
        mounted: function () {
            var self = this;
            document.onkeydown = function (e) {
                switch (e.keyCode) {
                    case 79: //o键
                        self.$store.dispatch('setRefundEditType', 'price');
                        break;
                    case 80: //p键
                        self.$store.dispatch('setRefundEditType', 'amount');
                        break;
                    case 27: //ESC键
                        self.backtohome();
                        break;
                    case 40://向下
                        e.preventDefault();
                        self.toggleItemCurrent('down');
                        break;
                    case 38://向上
                        e.preventDefault();
                        self.toggleItemCurrent('up');
                        break;
                    case 8://删除
                        //非编辑模式下 非弹层模式下 才能快捷键删除
                        if (!self.$store.state.home.refundEditType) {
                            self.$store.dispatch('delCartItemFromList', ['', 'refundList']);
                            self.$store.dispatch('setRefundBalanceInfo');
                        }
                        break;
                    default:
                }
            }
        },
        methods: {
            backtohome: function () {
                if (this.refundList.length > 0) {
                    Util.toast('有未退款商品', 'notice', 2000);
                    return;
                }
                this.$router.push({path: 'home'});
            },
            //从子组件监听的方法
            searchitem: function ($event, barcode) {
                this.$store.dispatch('getItemByBarcode', [barcode, 'refundList']);
                this.$store.dispatch('setRefundBalanceInfo');
            },
            //组装参数构建订单
            tobuildrefundorder:function () {
                if (this.$store.getters.refundList.length > 0) {
                    this.status = 'refunding';
                }
            },
            //完成退款
            finishrefund:function () {
                var self = this;
                this.$store.dispatch('toBuildRefundOrder', '2'); //2:退款订单
                Util.toast('退款成功', 'succeed', 2000,function () {
                    self.$store.dispatch('clearRefundData');
                    self.$router.push({path: 'home'});
                });
            },
            //营收小票
            printdayreport:function () {
                var report = Win.getReportInfo();
                var shop = Win.getShopInfo();
                var user = Win.queryLoginUserInfo();
                var cont = {
                    report:report.status?report.entry:{},
                    shop:shop.status?shop.entry&& shop.entry.shopName:'',
                    user:user.status?user.entry&& user.entry.realName:''
                }
                Winprint(cont,'dayreport');
            }
        },
        components: {
            mainheader,
            topsearch,
            refundlist
        }
    }
</script>
<style lang="less" rel="stylesheet/less">
    .no-list {
        font-size: 24px;
        color: #999;
        text-align: center;
        margin-top: 100px;
    }

    .refund-panel {
        width: 580px;
        height: 300px;
        padding: 25px;
        margin: 150px auto 0px;
        background: #FFFFFF;
        border: 1px solid #E6E6E6;
        box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.04);
        border-radius: 2px 2px 2px 0;
        position: relative;
        .title {
            font-size: 14px;
            color: #999;
            font-weight: normal;
            line-height: 40px;
            text-align: left;
            border-bottom: #E6E6E6 double 4px;
        }
        .cont {
            padding-top: 50px;
            .info {
                text-align: left;
                text-indent: 50px;
                .label {
                    font-size: 16px;
                    color: #666;
                    margin-right: 20px;
                }
                .rmb {
                    font-size: 36px;
                    color: #E13D31;
                    vertical-align: sub;
                }
            }
        }
        .round {
            width: 20px;
            height: 10px;
            display: block;
            border-radius: 10px 10px 0 0;
            background: #FAFAFA;
            border-top: 1px solid #E6E6E6;
            border-right: 1px solid #E6E6E6;
            border-left: 1px solid #E6E6E6;
            position: absolute;
            top: 60px;
        }
        .l-round {
            left: -7px;
            transform: rotate(-269deg);
        }
        .r-round {
            right: -7px;
            transform: rotate(270deg);
        }
    }
    /********** 退款中样式变更 ************/
    .refund-header {
        height: 90px;
    }
    .refund-footer {
        height: auto;
        padding-top: 0;
        padding-bottom: 10px;
    }
    .refund-container {
        top:90px;
    }
</style>