<template>
    <div>
        <h1 class="balance-title">银行卡</h1>
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
                <li>
                    <label class="bankMarkText">备注</label>
                    <input class="bankMark" v-focus @keyup="updataMark" name="" type="text" />
                </li>
                <li class="bankTips">
                    请使用银行卡刷卡器收款
                </li>
            </ul>

        </div>
    </div>
</template>
<script>
    import { mapGetters } from 'vuex';
    export default{
        data(){
            return {
                totalPrice: '',//应收
                netReceipts: '',//实收
            }
        },
        components : {

        },
        created:function(){
            this.init();
        },
        methods : {
            /**
             * 初始化数据
             */
            init: function(){
                this.totalPrice = this.getWipingZeroStatus ? (this.getTotalPrice / 100 ).toFixed(2) : (this.getOriginalPrice / 100 ).toFixed(2);
                //设置支付类型
                this.$store.dispatch('getPayType','6')
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
            updataMark:function (e) {
                var mark = e.target.value;
                this.$store.dispatch('setMark',mark);
            }
        },
        computed: {
            ...mapGetters([
                'orderList',          //订单
                'getWipingZeroStatus',//抹零状态
                'getOriginalPrice',//原价
                'getWipingZeroBackNum',//抹零后价格
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
        }
    }
</script>
<style lang="less" rel="stylesheet/less">
    .bankMark{
        width:300px;
    }
    .bankTips{
        width:300px;
        height:60px;
        line-height:60px;
        background: #FFF9D4;
        border: 1px solid #EBE5C5;
        border-radius: 2px;
        margin: 20px 0 0 100px;
        text-align:center;
        color:#333;
        font-size:18px;
    }
    label.bankMarkText{
        position:relative;
        line-height:22px;
    }
    label.bankMarkText:after{
        top:20px;
        left:0;
        font-size:12px;
        content:'(选填)';
        position:absolute;
    }
</style>