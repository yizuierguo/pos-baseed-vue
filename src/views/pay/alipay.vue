<template>
    <div>
        <div v-if="isBindAlipay">
            <h1 class="balance-title">支付宝</h1>
            <div class="editArea">
                <ul>
                    <li class="liH">
                        <label>应收</label>
                        <template v-if="getWipingZeroStatus">
                            <input class="inputW" v-model="totalPrice" v-focus type="number" />
                            <span class="wipingZero" @click="wipingZero">取消抹零[M]</span>
                        </template>
                        <template v-else>
                            <span class="receivable">{{ getOriginalPrice | formatPrice(2) }}</span>
                            <span class="wipingZero" @click="wipingZero">抹零[M]</span>
                        </template>
                    </li>
                    <li class="wipingZeroInfo">
                        <template v-if="getWipingZeroStatus">
                            原应收  <span>{{getOriginalPrice | formatPrice(2)}}</span>，已抹零{{ getWipingZeroNum | formatPrice(2) }}
                    </template>
                    </li>
                    <li v-if="scanPrompt" class="scanPrompt">
                        请使用扫码枪，扫描支付宝付款码
                        <span @click="showScanPrompt()">手动输入付款码[F]</span>
                    </li>
                    <li v-else>
                        <label>付款码</label>
                        <input class="paymentCode" v-focus name="" type="text" @focus="inputfocus" @blur="inputblur" @keyup="updateqrcode"/>
                    </li>
                </ul>
            </div>
        </div>
        <div v-else class="notBindAlipay">
            您的支付宝尚未授权，将不能使用支付宝付款
            <div class="goBindAlipay" @click="bindAlipay">立即绑定[enter]</div>
        </div>
        <LazyRender :time="300">
            <bindalipay v-once></bindalipay>
        </LazyRender>
    </div>
</template>
<script>
    import bindalipay from '../../components/bindalipay';
    import { mapGetters } from 'vuex';
    import Util from '../../libs/util';
    import Win from '../../libs/win';
    import LazyRender from '../../components/lazy.vue';
    window.alipayInputType = 'machine'; //输入方式 hand 手动 ; machine 默认扫码枪
    export default{
        data(){
            return {
                totalPrice: '',//应收
                netReceipts: '',//实收
                wipingZeroInfo : '',
                wipingZeroAmount : '1',
                scanPrompt : true,
                isBindAlipay : false //是否绑定了支付宝
            }
        },
        components: {
            bindalipay,
            LazyRender
        },
        created:function () {
            this.init();
            this.initAliPayBindStatus();
        },
        computed: {
            ...mapGetters([
                'orderList',          //订单
                'getWipingZeroStatus',//抹零状态
                'getOriginalPrice',//原价
                'getWipingZeroBackNum',//系统抹零后价格
                'getTotalPrice',//最终抹零后的价格
            ]),
            /**
             * 获取抹零数
             * @returns {string}
             */
            getWipingZeroNum: function(){
                var data = this.getOriginalPrice - (this.totalPrice * 100);
                var totalPrice = this.totalPrice * 100;
                this.$store.dispatch('setWipingZeroNum',data);
                this.$store.dispatch('setTotalPrice',totalPrice);
                this.$store.dispatch('setPayInfo');
                return data
            },
        },
        methods : {
            init:function () {
                this.totalPrice = this.getWipingZeroStatus ? (this.getTotalPrice / 100 ).toFixed(2) : (this.getOriginalPrice / 100 ).toFixed(2);
                //设置支付类型
                this.$store.dispatch('getPayType','2')
            },
            showScanPrompt : function(){
                this.scanPrompt = !this.scanPrompt;
                console.log(this.scanPrompt);
            },
            /**
             * 抹零，仅处理系统抹零规则，不包括手动修改抹零值
             */
            wipingZero: function(){
                this.$store.dispatch('getWipingZeroStatus');
                this.$store.dispatch('getWipingZero');
                if(this.getWipingZeroStatus){
                    this.totalPrice = (this.getWipingZeroBackNum / 100).toFixed(2);
                } else {
                    this.totalPrice = this.getOriginalPrice
                }
                this.$store.dispatch('setPayInfo');
            },
            updateqrcode:function (e) {
                var code = e.target.value;
                if(Util.isPositiveInteger(code)){
                    this.$store.dispatch('setPayCode',code);
                    console.log(code);
                }else {
                    Util.toast('付款码错误','notice',2000);
                }
            },
            bindAlipay: function(){
                this.$store.dispatch('setShowBindAlipay');
            },
            //判断支付宝绑定状态
            initAliPayBindStatus:function () {
                var _isOnline = navigator.onLine;
                var bindStatus = localStorage.getItem('bindalipay');
                if(_isOnline){
                    var res = Win.isBindAlipayAccount(); //客户端方法中获取是否绑定成功
                    if(res.status){
                        //更新state中状态
                        this.isBindAlipay = true;
                        //更新ls中bindalipay值
                        localStorage.setItem('bindalipay','true');
                    }else {
                        //更新state中状态
                        this.isBindAlipay = false;
                        //更新ls中bindalipay值
                        localStorage.setItem('bindalipay','false');
                    }
                }else {
                    if(bindStatus && bindStatus == 'true'){
                        this.isBindAlipay = true;
                    }else if(bindStatus && bindStatus == 'false'){
                        this.isBindAlipay = false;
                    }
                }
            },
            //绑定网络状态事件 监测绑定信息
            storageCheckAliPayBindStatus:function () {
                var self = this;
                window.addEventListener("online", function () {
                    self.initAliPayBindStatus();
                }, false);
            },
            inputfocus:function (e) {
                window.alipayInputType = 'hand';
            },
            inputblur:function (e) {
                window.alipayInputType = 'machine';
            }
        }
    }
</script>
<style lang="less" rel="stylesheet/less" scoped>
    div, li, span, i, p, h1, h2, input {
        box-sizing: border-box;
    }
    .balance-title {
        font-size: 14px;
        color: #999;
        font-weight: normal;
        line-height: 40px;
        text-align: left;
        border-bottom: #E6E6E6 double 4px;
    }
    .scanPrompt{
        width:460px;
        height: 80px;
        background: #FFF9D4;
        border: 1px solid #EBE5C5;
        border-radius: 2px;
        margin: 20px auto;
        padding-top:20px;
        text-align:center;
        color:#333;
        font-size:18px;
        span{
            font-size: 14px;
            color: #2498F0;
            clear:both;
            display:block;
        }

    }
    .paymentCode{
        width:240px;
    }
    .notBindAlipay{
        text-align:center;
        margin-top:50px;
        font-size:18px;
    }
    .goBindAlipay{
        width:220px;
        height:50px;
        background: #E13D31;
        border: 1px solid rgba(0,0,0,0.10);
        border-radius: 4px;
        color:#fff;
        line-height:50px;
        margin: 20px auto;
    }
</style>