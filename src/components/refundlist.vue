<template>
    <div class="cart-list">
        <div class="cart-header">
            <table class="cart-table">
                <thead>
                <tr>
                    <th width="5%">序号</th>
                    <th width="20%">条形码</th>
                    <th width="25%">商品名</th>
                    <th width="10%">单位</th>
                    <th width="10%">单价<span class="key">O</span></th>
                    <th width="10%">数量<span class="key">P</span></th>
                    <th width="10%">金额</th>
                    <th width="10%">删除<span class="key">del</span></th>
                </tr>
                </thead>
            </table>
        </div>
        <div class="cart-body">
            <table class="cart-table">
                <colgroup>
                    <col width="5%">
                    <col width="20%">
                    <col width="25%">
                    <col width="10%">
                    <col width="10%">
                    <col width="10%">
                    <col width="10%">
                    <col width="10%">
                </colgroup>
                <tbody>
                <template v-if="refundList.length > 0">
                    <tr :class="{'current fade J_CurTr':item.isCurrent}" v-for="(item, index) in refundList"
                        :key="item.itemId">
                        <td>{{refundList.length - index}}</td>
                        <td>{{item.barcode}}</td>
                        <td>{{item.itemName | formatname}}<template v-if="item.property">{{item.property | formatproperty}}</template></td>
                        <td>{{item.unit}}</td>
                        <td>
                            <template v-if="item.isCurrent && refundEditType=='price'">
                                <template v-if="item.itemPrice && item.itemPrice != item.price">
                                    <input type="text" class="cart-input" :value="item.itemPrice | formatPrice(2)"
                                           @keyup.enter="edititemprice($event,item.barcode)">
                                </template>
                                <template v-else="">
                                    <input type="text" class="cart-input" :value="item.price | formatPrice(2)"
                                           @keyup.enter="edititemprice($event,item.barcode)">
                                </template>
                            </template>
                            <template v-else>
                                <template v-if="item.itemPrice && item.itemPrice != item.price">
                                    {{item.itemPrice | formatPrice(2)}}
                                    <del class="del-font">{{item.price | formatPrice(2)}}</del>
                                </template>
                                <template v-else="">
                                    {{item.price | formatPrice(2)}}
                                </template>
                            </template>
                        </td>
                        <td>
                            <template v-if="item.isCurrent && refundEditType=='amount'">
                                <input type="text" class="cart-input" :value="item.amount"
                                       @keyup.enter="edititemamount($event,item.barcode)">
                            </template>
                            <template v-else>
                                {{item.amount}}
                            </template>
                        </td>
                        <td>
                            <template v-if="item.itemPrice">
                                <template v-if="item.itemPrice && item.itemPrice != item.price">
                                    {{item.itemPrice * item.amount | formatPrice(2)}}

                                </template>
                                <template v-else="">
                                    {{item.price * item.amount | formatPrice(2)}}

                                </template>
                            </template>
                            <template v-else="">
                                {{item.price * item.amount | formatPrice(2)}}

                            </template>
                        </td>
                        <td><a href="#" class="btn" @click.prevent="delitembybarcode(item.barcode)"></a></td>
                    </tr>
                </template>
                <template v-else="">
                    <p class="no-list">请 扫码 或 手动输入 需退货的商品条形码</p>
                </template>
                </tbody>
            </table>
        </div>
    </div>
</template>
<script>
    import {mapGetters} from 'vuex';
    import Util from '../libs/util';

    export default{
        data(){
            return {
                msg: '这里是收银列表',
                //refundEditType:'price', //default '' //根据快捷键设置refundEditType
            }
        },
        computed: {
            ...mapGetters(['refundList', 'refundEditType'])
        },
        methods: {
            //删除商品
            delitembybarcode: function (barCode) {
                this.$store.dispatch('delCartItemFromList', [barCode,'refundList']);
                this.$store.dispatch('setRefundBalanceInfo');
            },
            //编辑数量
            edititemamount: function (e, barcode) {
                var val = e.target.value;
                if (Util.isPositiveInteger(val)) {
                    this.$store.dispatch('editItemAmount', [val, barcode,'refundList']);
                    this.$store.dispatch('setRefundBalanceInfo');
                } else {
                    Util.toast('数量错误', 'failed', 2000);
                }
            },
            //编辑价钱
            edititemprice: function (e, barcode) {
                var val = e.target.value;
                if (Util.isTwoDecimalsPlace(val)) {
                    var price = Number(val) * 100;
                    var formatPrice = parseInt(price);
                    this.$store.dispatch('editItemPrice', [formatPrice, barcode,'refundList']);
                    this.$store.dispatch('setRefundBalanceInfo');
                } else {
                    Util.toast('单价错误', 'failed', 2000);
                }
            }
        },
        components: {}
    }
</script>
<style lang="less" rel="stylesheet/less" scoped>
    @keyframes fade-in {
        0% {
            opacity: 0;
        }
        /*初始状态 透明度为0*/
        40% {
            opacity: 0;
        }
        /*过渡状态 透明度为0*/
        100% {
            opacity: 1;
        }
        /*结束状态 透明度为1*/
    }

    .fade {
        animation: fade-in; /*动画名称*/
        animation-duration: 0.5s; /*动画持续时间*/
    }

    .cart-list {
        width: 100%;
        .cart-header {
            background: #FAFAFA;
            position: fixed;
            width: 100%;
            height: 40px;
            left: 0;
            z-index: 100;
        }
        .cart-body {
            padding-top: 40px;
            min-height: 400px;
            height: auto !important;
            height: 400px;
        }
    }

    .cart-table {
        width: 100%;
        border-collapse: collapse;
        border-spacing: 0;
        text-align: center;
        thead {
            width: 100%;
            table-layout: fixed;
            display: table;
        }
        thead th {
            height: 40px;
            border-bottom: #E1E1E1 solid 1px;
            font-size: 12px;
            color: #666;
            font-weight: normal;
            text-align: left;
        }
        thead th:first-child {
            text-align: center;
        }
        tbody tr {
            td {
                border: none;
                height: 54px;
                text-align: left;
            }
            td:first-child {
                text-align: center;
            }
        }
        tbody tr:hover{
            background-color: #FFF9D4;
            td {
                border-top: 1px solid #EBE5C5;
                border-bottom: 1px solid #EBE5C5;
            }
        }
        tbody tr.current {
            td {
                border-top: 1px solid #EBE5C5;
                border-bottom: 1px solid #EBE5C5;
                background: #FFF9D4;
            }
        }
        tbody tr:first-child {
            border-top: #fff solid 1px;
        }
        .btn {
            width: 22px;
            height: 22px;
            display: inline-block;
            background-repeat: no-repeat;
            background-position: center center;
            background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAWCAYAAADEtGw7AAAAAXNSR0IArs4c6QAAAc9JREFUOBG1lc9qwkAQxjdpzameE5JL8NSDx3gwr6BQ2j5KaR+iwdfw1paCXvoCueQBCgFvBj17M5B0viUju8sWatUBmWXm299OZv8oxIXM+Y1bFEVvu93eN01z5zhO0rZtCC2NKxoXrut++r7/kSRJbWNYwYvF4oHEGQEGtkkco0VWNH6eTqfvHGOvgQnkLpfLV/JPLPiLpwVmk8nkhXzD+isewI9GI1R5FLSbn5ZleTOfz7+Yd6gYn0/QN078x1PFj9wWFwBsFLlMhXmeJ+I4Fr0eUrohhhw0hmUdS0gwdp+q1TYqDEMxHA5FmqYaADDEkINGNTDAQkyCcaRUAcbr9VrsdjvR7/fFeDyWcEAxRgw5aExj1jUS1BucU01T17XI8/wAAhDGUOSgMQ0sxGTFBNW/qVPv93sJ58pVKHI2Y5YE2wSnxiSYyq9sILOnXDn33DaHWdyKwhThSKkbhZ7ip8JtR5FaIVkSjAfFBEdRpG0Uemr2HBrTmCVvHg71ZrP5ptUGLEQbcE5xpMzdR6WAVlUlF+M51IZVEAS3ePEue6WxIu44rTjj1Y/1mMvvBObKHjOke/qOhgOKucyBP7RCDZ79oVfhp/41qayzjn8AirgC6jKcgyMAAAAASUVORK5CYII=");
            &:hover {
                background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAWCAYAAADEtGw7AAAAAXNSR0IArs4c6QAAAchJREFUOBG1lTtuwkAQhtdOIlykonSJoXOZymfAQiRnAA4QJYcI8gGAMyQImSpngBOAKCmpQZHszD94rPVqo4jXSmbH8/g8nhkvSt1oOX9xR6PRg+M43TzPO7Q/0e7Dl+QtyQvaZ7RPB4PBj41hBU8mk+csy4YU0LAFabqN67pvvV7vS9OxWAFTBu54PP4gy6vp+M990u/33+ktMvG7EwG77/vI8lQoQqPlcvk4n8+/cYNVZly8/udRfd4vleVFyuICgUYVNS2JnuepMAxVrVYrdSJABxt89AUGWNAxmGrTJbnSqGazqaIoUnEcVwCAQQdbEAQ6F3KjYB3B1LSO6bFardRut1P1el21222GAwoZOtjW67UZpoR1Dws9BXNacTocDoqaUYIAxBIobPAxF1jQcSkIysNvOu33e4ZL5joUNtsSFoNtDpfqpHlbG8isqWQuNbfFUCmYJaVYmE4YKb1RqCkuHW4bRSoFsyTjmQlutVqVRqGmZs3hYy7KmFk8FfSUKTls6GqIo4wSxk7vPuBpmipAxUdiwChYN/6k8cTiG0+0p58qJnJOIJBrLAQcfSSfA+djUzjYy9NNV179oNfhl/416ayryr9ZXvnbcczEkAAAAABJRU5ErkJggg==");
            }
            &:active {
                background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAWCAYAAADEtGw7AAAAAXNSR0IArs4c6QAAAcBJREFUOBG1lTtOw0AQhtcGKocLuOQKeUmUuQACitwgOYBN6tTYLiiTOwDiGI6Smo7SJ3AqJIf5h0w0HhmhvFZKdmfm38/rmcnGuTMN7y/uaDS68n3/vqqqO9J0PM8Lod1sNgVNS4p9UOx9Pp9/w29HI3g8Hj+QMCHIjd2gbXrYF9lPs9nsTfuxroGn06lfFMUz+SMr/MfOwjCc0P5KdJeywHwgFFsj2os5xhfG7sR4fXr111/3Yd+UmkdJiw8ECkVTonGtVssNBgMXBIF28xo+xKAxI9myHINRfVuoXq/nhsOhi+O4BgAMPsS63W6NCwZYcDJ421I1UZ7nyLmjorgoihgOKNbwIbZYLGp7YAhLitexivV67bIs24EAxBAoYtA0DGbxiaX5ragsS4bLyTUUsaYhLAY3CY71MZiSzk1oYTancnLJudXDFpaceGlFaCldKOQUHw1vakXiMIvBuFAsuN/v1wqFnNqcQ2OHsLgrcEvhQtG9LK2EttPVBzxNUweoaAQOBliwz/aTvpCnrVarz3a7fU32rfj2nDO6m19kjxSPberTCS0yCe4x87Wp9btUaOfJL3oNP/avSbNOuv4B1q/vjaG6MxIAAAAASUVORK5CYII=");
            }
        }
    }

    .cart-input {
        width: 60px;
        border-radius: 2px;
        background-color: #fff;
        -webkit-transition: border linear .2s, box-shadow linear .2s;
        height: 18px;
        padding: 6px 4px;
        color: #555;
        vertical-align: middle;
        border: 1px solid #ccc;
        box-shadow: inset 0 1px 1px rgba(0, 0, 0, .075);
        transition: border linear .2s, box-shadow linear .2s;
        font-size: 14px;
        line-height: 22px;
    }

    .key {
        width: 34px;
        height: 16px;
        display: inline-block;
        line-height: 16px;
        text-align: center;
        background: #B6CFE3;
        border-radius: 10px;
        color: #FFF;
        font-size: 12px;
        margin-left: 4px;
    }

    .del-font {
        font-size: 14px;
        color: #999;
        margin-left: 10px;
    }
</style>
