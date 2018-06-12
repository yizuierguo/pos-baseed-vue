<template>
    <div id="content" class="vice-screen">
        <template v-if="vicedata.vicestatus == 'default'">
            <div class="vice-main">
                <img src="http://imgsize.52shangou.com/img/n/12/16/1481858053559_3148.jpg">
            </div>
        </template>
        <template v-else="">
            <div class="wrapper clearfix">
                <!-- 右侧栏 -->
                <div class="aside scrollbar">
                    <img src="http://imgsize.52shangou.com/img/n/03/09/1489039902039_7700.png" alt="">
                </div>
                <!-- 主内容 -->
                <div class="section">
                    <!-- 购物中 -->
                    <template v-if="vicedata.vicestatus == 'tocart'">
                        <div class="cart-list">
                            <div class="cart-header">
                                <table class="cart-table">
                                    <thead>
                                    <tr>
                                        <th width="10%">序号</th>
                                        <th width="40%">商品名</th>
                                        <th width="20%">单价</th>
                                        <th width="15%">数量</th>
                                        <th width="15%">金额</th>
                                    </tr>
                                    </thead>
                                </table>
                            </div>
                            <div class="cart-body">
                                <table class="cart-table">
                                    <colgroup>
                                        <col width="10%">
                                        <col width="40%">
                                        <col width="20%">
                                        <col width="15%">
                                        <col width="15%">
                                    </colgroup>
                                    <tbody>
                                    <tr class="" v-for="(item, index) in vicedata.cartList" :key="item.itemId">
                                        <td>{{vicedata.cartList.length - index}}</td>
                                        <td>{{item.itemName | formatname}}</td>
                                        <td>
                                            <template v-if="item.itemPrice && item.itemPrice != item.price">
                                                {{item.itemPrice | formatPrice(2)}} <del class="del-font">{{item.price | formatPrice(2)}}</del>
                                            </template>
                                            <template v-else-if="!item.itemPrice && vicedata.vipInfo.isAllowMemberPrice && parseInt(item.memberPrice) < parseInt(item.price)">
                                                {{item.memberPrice | formatPrice(2)}} <del class="del-font">{{item.price | formatPrice(2)}}</del>
                                            </template>
                                            <template v-else="">
                                                {{item.price | formatPrice(2)}}
                                    </template>
                                        </td>
                                        <td>{{item.amount}}</td>
                                        <td> {{item.showPrice * item.amount | formatPrice(2)}}</td>
                                    </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div class="cart-footer">
                            <p class="sum">合计：{{ vicedata.balanceInfo.showTotalPriceNoMember | formatPrice(2) }}</p>
                            <p class="sum">优惠：{{ vicedata.balanceInfo.vipSave | formatPrice(2) }}</p>
                            <span class="rmb" v-cloak>
                                {{vicedata.balanceInfo.salesTotalPrice | formatPrice(2) }} <span class="label">元</span> {{vicedata.balanceInfo.num}}<span class="label">件</span>
                            </span>
                        </div>
                    </template>
                    <!-- 待支付 -->
                    <template v-else-if="vicedata.vicestatus == 'topay'">
                        <div class="vice-cont">
                            <p class="font-x color-bb">需支付</p>
                            <p class="font-xxx color-bb">{{vicedata.payInfo.totalPrice | formatPrice(2)}}</p>
                            <p class="font-x color-bbb" v-if="vicedata.payInfo.wipingZeroNum">已抹零 {{ vicedata.payInfo.wipingZeroNum | formatPrice(2)}}</p>
                            <!--<div class="vice-error">储值卡余额不足</div>-->
                        </div>
                    </template>
                    <!-- 需找零 -->
                    <template v-else-if="vicedata.vicestatus == 'togive'">
                        <div class="vice-cont">
                            <p class="font-x color-bb">找零</p>
                            <p class="font-xxx color-bb">{{vicedata.payInfo.changeNum | formatPrice(2)}}</p>
                        </div>
                    </template>
                    <!-- 支付成功 -->
                    <template v-else-if="vicedata.vicestatus == 'paysuc'">
                        <div class="vice-cont">
                            <span class="vice-icon"></span>
                            <p class="font-x color-bbb">支付成功</p>
                            <p class="font-xxx color-bb">{{vicedata.payInfo.totalPrice | formatPrice(2)}}</p>
                        </div>
                    </template>
                    <!-- 需要支付宝授权 -->
                    <template v-else-if="vicedata.vicestatus == 'toalipayauth'">
                        <div class="vice-cont">
                            <span class="aliauth-icon"></span>
                            <p class="font-x color-bbb">抱歉，商家暂不支持支付宝收款</p>
                        </div>
                    </template>
                    <!-- 退款中 -->
                    <template v-else-if="vicedata.vicestatus == 'torefund'">
                        <div class="cart-list">
                            <div class="cart-header">
                                <table class="cart-table">
                                    <thead>
                                    <tr>
                                        <th width="10%">序号</th>
                                        <th width="45%">商品名</th>
                                        <th width="15%">单价</th>
                                        <th width="15%">数量</th>
                                        <th width="15%">金额</th>
                                    </tr>
                                    </thead>
                                </table>
                            </div>
                            <div class="cart-body">
                                <table class="cart-table">
                                    <colgroup>
                                        <col width="10%">
                                        <col width="45%">
                                        <col width="15%">
                                        <col width="15%">
                                        <col width="15%">
                                    </colgroup>
                                    <tbody>
                                    <tr class="" v-for="(item, index) in vicedata.refundList" :key="item.itemId">
                                        <td>{{vicedata.refundList.length - index}}</td>
                                        <td>{{item.itemName}}</td>
                                        <td>{{item.price | formatPrice(2)}}</td>
                                        <td>{{item.amount}}</td>
                                        <td>{{item.price * item.amount | formatPrice(2)}}</td>
                                    </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div class="cart-footer">
                            <span class="rmb" v-cloak>
                                退款 {{vicedata.refundBalanceInfo.sum | formatPrice(1) }} <span class="label">元</span>
                                {{vicedata.refundBalanceInfo.num}} <span class="label">件</span>
                            </span>
                        </div>
                    </template>
                </div>
            </div>
        </template>
    </div>
</template>
<script>
    import { mapGetters } from 'vuex';

    export default{
        data(){
            return {
                /*
                 * {
                 *   1.default:默认大图
                 *   2.payment:支付{
                 *        2.1 tocart:购物中
                 *        2.2 topay:需支付
                 *        2.3 togive:需找零
                 *        2.4 paysuc:支付成功
                 *        2.5 toalipayauth:需要支付宝授权
                 *        2.6 ..
                 *   }
                 *   3.refundment:退款 {
                 *       3.1 torefund:待退款
                 *       3.2 refundsuc:退款成功
                 *       3.3 ...
                 *   }
                 * }
                 * **/
                //从ls中获取到的数据
                /*
                *  vicestatus:'tocart',
                *  cartList:cartList,
                *  balanceInfo:balanceInfo
                * */
                vicedata:{
                    vicestatus: 'default',
                    vipInfo:{},
                    cartList:[],
                    balanceInfo:{},
                    payInfo:{},
                    refundBalanceInfo:{},  //退款信息
                    refundList:[]          //退货列表
                }
            }
        },
        mounted:function () {
            var self = this;
            window.addEventListener('storage', function (e) {
                //购物车
                if(e.key == 'vicedata'){
                    if(e.newValue){
                        var data = JSON.parse(e.newValue);
                        self.vicedata.vicestatus = data['vicestatus'];
                        self.vicedata.vipInfo = data['vipInfo'];
                        self.vicedata.cartList = data['cartList'];
                        self.vicedata.balanceInfo = data['balanceInfo'];
                        self.vicedata.refundBalanceInfo = data['refundBalanceInfo'];
                        self.vicedata.refundList = data['refundList'];
                        self.vicedata.payInfo = data['payInfo'];  //支付信息
                    }else {
                        self.vicestatus = 'default';
                        self.vicedata.vipInfo = {};
                        self.vicedata.cartList = [];
                        self.vicedata.balanceInfo = {};
                        self.vicedata.refundBalanceInfo = {};
                        self.vicedata.refundList = [];
                        self.vicedata.payInfo = {};
                    }
                }
            });
        },
        computed: {
            //总价
            sum:function () {
                var sum = 0;
                this.$store.getters.cartList.forEach(function (item, index) {
                    sum += item.price*item.amount;
                });
                return sum;
            },
            amount:function () {
                var amount = 0;
                this.$store.getters.cartList.forEach(function (item, index) {
                    amount += item.amount;
                });
                return amount;
            }
        },
        components: {}
    }
</script>
<style lang="less" rel="stylesheet/less">
    html, body {
        margin: 0px;
        height: 100%;
        background-color: #FAFAFA;
    }

    .vice-screen {
        height: 100%;
        //默认大图
        .vice-main {
            width: 100%;
            height: 100%;
            overflow-y: hidden;
            img {
                width: 100%;
                width: 100%;
                height: 100%;
                object-fit: fill;
            }
        }
        //分屏左右栏
        .wrapper {
            width: 100%;
            height: 100%;
        }
        .aside {
            float: right;
            width: 350px;
            background-color: #444;
            height: 100%;
            overflow-y: auto;
            position: relative;
            z-index: 100;
            img {
                width: 100%;
                height: 100%;
                object-fit: fill;
            }
        }
        .section {
            margin-right: 350px;
            overflow-y: auto;
        }
        //cart-footer
        .cart-footer {
            width: 100%;
            height: 105px;
            padding-top: 15px;
            position: absolute;
            bottom: 0;
            left: 0;
            z-index: 10;
            overflow: hidden;
            background-color: #FFF;
            border-top: #E1E1E1 solid 1px;
            .sum {
                font-size: 18px;
                color: #666;
                text-indent: 50px;
                line-height: 2.2;
            }
            .rmb {
                position: absolute;
                right: 370px;
                top: 35px;
                font-size: 36px;
                color: #E13D31;
            }
            .label {
                font-size: 16px;
            }
        }
        //
        .vice-cont {
            text-align: center;
            padding-top: 200px;
            .vice-icon {
                width: 80px;
                height: 80px;
                border-radius: 50%;
                display: inline-block;
                background-image:url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAABQCAYAAACOEfKtAAAAAXNSR0IArs4c6QAAC1lJREFUeAHtXQlwFMcV/T0zWgkhIRQZAeaSXAjMIQwpbDBBp50Q4sJOcIJjg5E4QoExxGWbijk1oJg7iYONwZhDImDHJAHKVEJRiY2EDNgODvchoJA5xCUEupBWq93p/B6YZU/N7s7soRVdJaanj9//v/3dv/t3T0MgiEEs+U0vQk2pFgqPE/xDVnpSSuMJIbEUIBYojSYEGjBeC0DqgEINvpdh/CwhtJTjuNL2nWKOzEx5vzFYYpBANizun5oomRtHctTyjERJNgDtorl9BBgoOcABFHGE/2J+xoav8QdAzAMT/A6geFI0kMqyURYJcgjQkZSC4GfRLhLCbRWIsGV+xvrTfm4L/AaguDe3PRA6U6J0JgqR4G9BXNIncJAjZGleesEuf2ml7gAuKZkWb5Tq36QSzMAuGudSsEAnEnIcm1zCZSR/JhJR0rN5XQEUi3PGSxRW4uDfQU8mdaNFyH85yr8mZm08pBdNXQDM/2pib7PZshYtaKZejPmLDnZlCQeudVFc9JzZaWvuaG1HM4BM69AwrEHworUyE8j6OB26xIPw6wWZGw9qaddnANFIROEY94EEdJIWBoJZF0E0EyBz8zIKVvhqZHwCcPG+CR0aJcu/UPMGBxMAvdpGILcTyo0VswqM3tLE+ad3QfxqSnejxVISLuAx6VGW0ZTQPUsPTfF61uCVBt4zFub/YINdvYO9ZZTGbnyMUDICNfG6pxx7rIG/PzC+S5PZ8u9wBY8BhoZwgLea6BGATLVNJrIbW+jm6S/TUssxEBvqGj+/ZyTVpVAFUNwrCkhwJ4KXqk4uPEogiOmUSFvxqTrEqQJISdm7SCgzPKDxXApmWBYW585Sq9Eswgv3TRhhkSzYdf3ndFBjMJj5bJ6Ik+305ibbbgF89+vJHU1G0zH8JRKDKUSw22Yrlii+7UB3yz63XdhkbFrZ2sFjPx5i0B29S4vd/ZAuNXBRUW6amUr73FVqbenMAUEoP8SVF8dJA7fRbbwF17itDaTm5EUjyknE8qFIRSe8nBJOFP8TvSt0QHMEW2UepU9KxWUvOcpuB6CMMKW/cyz08N2KwGzHuaEdgKSk7BdYtLe1+MOIPQK4mFi4L3eUbaIdgLhz9lD7bNFxEcdNsndsk60Ainsn9Ueb/aRtZjjGI3n0A2sJFJ7OL57cRyFhBRDAMk5JDMdnBGeAMX2nw1tPvwfd2qVoEtFMzVasZADZwIgTnVc0UQ3hyu0i42HioLnQL/EpiBTawKsD3oaObX13LFEqjVWMiXxKIL8kd1i4uqq6xD4GL/f/LcRGtrf+xI2WBmB/GkKP/OJJQ7H+QRlAsySfU9FALzSr9k8cAj/vPRkieIOVwWrjbSg4ugSqjLesab5EJDzfg/UO3h8DaZYvREK5TlbSaPhV39fswKsyVsKmI4vhdsNNzazj8YZMRoSsOjcjsrK8pgr7tEbzpJknXQgwYzG6zxTo28F+QnGnoQI1b6lmzbMyiafCHukSFy/cvlI7iEJ4gMeMxcv934BHY5OscrII07iCI0uguvG2XbqmFwptqq7XDRQkjvQGXY/baGLL58qujAUjVll/Qx7zaho1n+Jw4s0sweMCobRXwE4jOrGgT0Jq4lB4ofcku/GOUb5Vf13WvFpTlT4NOVBh2KEVpr0c0lvUKzMWmUkvOPFccfeqPObVmaqd8vRLQADR45qsH8HAUXJnLBgHN+9eQc1bBnebavzKEMNOwO2idrhp1KKCO2PBhLhRdxk1bxnUN+G5dH8HxI514Rh/t6MnfXfGgrVxrfYiFCJ4Dea7ejbZDC0aw+GmSGwzJXzKiotMgPTuowBPzftU310lZiwmDJxttyxTyl6tLQsweDiJRuzYGNhGYUKPJ0c4eQXQLa4npCQ8AdtOroZak/YpRDYaiwwXxoLxXF5zATYfWwFGc70eInhMg2HHASG6tpqd9CIw8FjoHpcC0wYvgsfi+3rMlGNBZixe6ve6W/AuV59HzVsecPBkPhE71oV1HW1TEuz3o9oa2qH7aBZk9HjeERvVd2YsJg2a57QsUypeqj4na55Gz4pCzusnw47DNbCuAH564s/APB62gXXr7OQXYVzqW9BGaGub5TbOjMWUH4rQObaHyzIXq0rhL9htTRavD5W6pOdLIsMOv0Mh2gcom9aZm6gQF+21jc6zf6adUwfnAwOnudCcsWD1yu6cRvBWInhB+0ROZp9hx2fmDszEN/t+J2f7/g+bRpy7fRz6dXgKDHykHaEoIRqe6DQcGnHAL6+9YJfHXpix+FnKOOA51xb8wp2T8MnxP0GTZHKqG+gEBLCIwxNwZ/zRcEV9OY5Py6GhyXlOJnACgvQq/BL9dQrA94zFDLfGgvF4Hn+UrSECHuOHYcdnTxyYiOZ4DEvQO7B1aFnVadyLGAICF+FEvmPbrmggBgOP80UGaHK8dbPLqey5yqPw15OrwCw1OeUFK4HnyIeogQb2HZnfAuumW4//we149Uh0Z/hpz1egU0x3tzyU3joCn54ILfAYsww7tMQAeUU55WhRHmVxf4Xk9n1gbOqbTi4ntfbO3PofTsY/AAu1qBUNcD4pX5RV2PX+ngh86e/WWVe+1wXNHjd1quIQfBaS4AEuU6mMmQwgfhvxhcdSaSjIjICsTZK6Np24+Q387dRqwN0vDS36r6qEX8cz6jKAEW2E3RgPCKellYfhH6fXIjCSW+mO3TgIfz+1ptkybisHIIOdneaESIbZPQDnDl1/AxP3BKBtuYmTFd/CzjPrcS/f2RF59Pp+2H76I3RROucFij+1dvDM/W7xR2vlvVFlDESfAilUq6hn/tEb+2HX2U12IB6+VgI7znwc0uAxDHgOrFhZAQSJfI4OLl2XdWqAf3etGHaf3yoX++5qEewsRa0MYc27L08lTUjepcgmT2OUl7zinHwq0XnKe6CeMYY48O/mj36SoPMgT8wsXKRQfKCBmBIZFfMejoV1Smagni0FPPRBV+PseZUtLnYAzhmyuhJVco1tgYfxBwigV+59/BTWzs1kByArauD4FYEeCx+wGMIxQirwooo/OnLoBOCc9E0VHOXmOBZs7e/oun/b1edeTgDKQGUmrcNpzbetHTRFfub3EzMKNyvvtk+XALLbfXgiTEWDEnyvpS23QYgjePWCwE9117RLAFnhBRkbDuOVILPcVWwt6ahE0+YP31jqTl67eaCrQguKcrbjcoF9gNPqAu75bhCzCic3J7hbDVQqocd1Iv4KZ5X31vJEmfF+LfK6mryqGsgI4AUMSRKRDuAqq7MawTDJL43i+TQ2I1GTR1UDGQGcPH4vEG4EDqh2k0g14i0xHzXvChcR9RNPwGPyeQQgK7ggo+A43gz5XFiDSMhlQRCeFYevu8Rk9iR41IVtCS0qzk3Fr9n3hF13xksaDQY6ct6wzeW28qrFPdZAhRDTRFypDAsnw8ImytExkWnegscw8RpAVomNiXjb2RD0wu5g7y024K24CN5yQpN//M7gdT4dpva6CzuCJRblzEQn6Ar0zj/4nsqxUAi+Yw+6yXH8+Lz0TZq2MnzSQFs80Lm4iicRQ/GXbDFrZ+R1iyHKMEAreAwHzRqogCnft1D0/RScLy5GAxOvpIfSE4E7xuPkeEFmQYlefOkGoMIQu93SJFlm4Z7aNOzWoXKAvRTH62X9M57bPIaM0XX7VncArUB+Mz2h0Vj3Bm5dTg+aRuK1x7iDtoymJe/Q+/5oRU6/Aag0IN/Dx9HnEcgc1MgRmO764J9SQesTJ8O4fv8Em9kiZm04oZWcWn2/A2jLALvQrKnBPBJviXwG07MRVM0HmnBcM+JwgVcZk70CR7+cn1ZwANMCtisfUABtwWRxLf8dBk7gznISLf1B19jDwfzvMP4PHSsFlIOFTTQAAAAASUVORK5CYII=');
            }
            .aliauth-icon {
                width: 100px;
                height: 100px;
                margin-bottom: 30px;
                border-radius: 50%;
                display: inline-block;
                background: #CCC;
            }
            .vice-error {
                width: 300px;
                height: 60px;
                margin: 0 auto 0;
                line-height: 60px;
                background: #FFF9D4;
                border: 1px solid #EBE5C5;
                border-radius: 2px;
                font-size: 18px;
                color: #333;
            }
            .font-x {
                font-size: 18px;
            }
            .font-xx {
                font-size: 20px;
            }
            .font-xxx {
                font-size: 64px;
            }
            .color-b {
                color: #333;
            }
            .color-bb {
                color: #666;
            }
            .color-bbb {
                 color: #999;
             }
        }
    }
    .del-font{
        font-size: 14px;
        color: #999;
        margin-left: 10px;
    }
    .vice-screen {
        //table fixed
        .cart-table tbody tr td {
            font-size: 20px;
            color: #333;
        }
        .cart-table thead th {
            font-size: 16px;
        }
    }
    /* ======================= 800分辨率 ======================= */
    @media screen and (max-width:1023px){
        .vice-screen {
            .aside {
                width: 280px;
            }
            .section {
                margin-right: 280px;
            }
        }
    }
</style>