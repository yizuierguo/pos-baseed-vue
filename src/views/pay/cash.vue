<template>
    <div>
        <h1 class="balance-title">现金</h1>
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
                    <label>实收</label>
                    <input v-model="netReceipts" v-focus class="inputW" name="" type="number" />
                </li>
                <li class="wipingZeroAmount">
                    <label>找零</label>
                    <span class="fontRed" v-if="getChangeNum">{{ getChangeNum | formatPrice(2) }}</span>
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
        created:function(){
            var self = this;
            document.onkeydown = function(e){
                if( e && e.keyCode == 77 ){
                    self.wipingZero();
                    console.log('M');
                }
            };
            self.init();
        },
        methods : {
            /**
             * 初始化数据
             */
            init: function(){
                this.totalPrice = this.getWipingZeroStatus ? (this.getTotalPrice / 100 ).toFixed(2) : (this.getOriginalPrice / 100 ).toFixed(2);
                //设置支付类型
                this.$store.dispatch('getPayType','1')
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
            },
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
            /**
             * 获取找零
             * @returns {string}
             */
            getChangeNum: function(){
                var data,
                    a = this.netReceipts * 100,//实收 单位分
                    b;
                if(this.getWipingZeroStatus){
                    b = this.totalPrice * 100; //抹零后应收
                }
                else{
                    b = this.getOriginalPrice //原价
                }
                //更新实收
                this.$store.dispatch('setNetReceipts',a);
                if( a > b ){
                    data = a - b;
                    this.$store.dispatch('setCheckChange',data);
                    this.$store.dispatch('setPayInfo');
                    return data;
                }
                return 0
            }
        },
        directives: {
            focus: {
                inserted: function (el) {
                    // 聚焦元素
                    el.focus()
                }
            }
        },
        components : {

        }
    }
</script>
<style lang="less" rel="stylesheet/less">
    .balance-title {
        font-size: 14px;
        color: #999;
        font-weight: normal;
        line-height: 40px;
        text-align: left;
        border-bottom: #E6E6E6 double 4px;
    }
    .fontRed{
        color: #F35833;
    }
    .editArea{
        margin:34px 0 0 55px;
        overflow:hidden;
        text-align:left;
        li{
            float:left;
            clear:both;
        }
        label{
            min-width:80px;
            margin:0 20px 0 0;
            font-size:16px;
            color:#666;
            line-height:40px;
            float:left;
        }
        input{
            height: 40px;
            font-size:24px;
            padding-left:10px;
            font-weight:normal;
            float:left;
            border: 1px solid #E6E6E6;
            border-radius: 2px;
            font-family:arial;
        }
        .liH{
            height: 40px;
        }
        .inputW{
            width:110px;
        }
        .wipingZero{
            width:110px;
            height:30px;
            display:inline-block;
            background: #FFF4CB;
            border: 1px solid #F4DD8D;
            border-radius: 2px;
            float:left;
            line-height:30px;
            text-align:center;
            font-size: 14px;
            color: #8B572A;
            margin:5px 0 0 20px;
        }
        .wipingZeroInfo{
            margin:10px 0;
            color:#666;
            height:16px;
            text-indent:100px;
        }
        .wipingZeroAmount{
            margin-top:30px;
            span{
                font-size: 30px;
                line-height: 30px;
                margin-top:8px;
                float:left;
            }
        }
        .receivable{
            font-size: 24px;
            line-height: 30px;
            margin-top: 5px;
            float: left;
            width: 110px;
            text-align: left;
        }
    }
</style>