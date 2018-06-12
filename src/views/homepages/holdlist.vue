<template>
    <div id="content">
        <header class="header hold-header">
            <mainheader></mainheader>
            <ul class="nav">
                <li><a class="current" href="">POS收银[ctrl＋1]</a></li>
                <li><a href="">闪电购订单[ctrl＋2]</a></li>
                <li><a href="">商品管理[ctrl＋3]</a></li>
                <li><a href="">会员管理[ctrl＋4]</a></li>
                <li><a href="">后台[ctrl＋5]</a></li>
            </ul>
        </header>
        <div class="container hold-container scrollbar">
            <div class="wrapper">
                <div class="aside scrollbar">
                    <ul class="tab">
                        <li>
                            <a class="tab-item" :class="{'tab-cur':current==index}" v-for="(item, index) in holdList"
                                    :key="item.time" @click="toggletab(index)">
                                <h3 class="hold-title">{{item.holdtime | filterTime('MM-dd HH:mm:ss')}}</h3>

                                <p class="cart-info">{{ item.balanceInfo.num }} 件 {{item.balanceInfo.showTotalPrice |
                                    formatPrice(1)}} 元</p>

                                <p class="cart-info" v-if="item.remark">备注：{{item.remark}}</p>
                                <span class="v-icon" v-if="item.vipInfo.name">会员：{{item.vipInfo.name}}</span>
                            </a>
                        </li>
                    </ul>
                </div>
                <div class="section">
                    <div class="section-header">
                        <table class="cart-table">
                            <thead>
                                <tr>
                                    <th width="5%">序号</th>
                                    <th width="20%">条形码</th>
                                    <th width="25%">商品名</th>
                                    <th width="10%">单位</th>
                                    <th width="20%">单价</th>
                                    <th width="10%">数量</th>
                                    <th width="10%">金额</th>
                                </tr>
                            </thead>
                        </table>
                    </div>
                    <div class="section-body">
                        <table class="cart-table">
                            <colgroup>
                                <col width="5%">
                                <col width="20%">
                                <col width="25%">
                                <col width="10%">
                                <col width="20%">
                                <col width="10%">
                                <col width="10%">
                            </colgroup>
                            <tbody>
                                <template v-if="current == i" v-for="(obj, i) in holdList">
                                    <tr v-for="(item, index) in obj.cartList" :key="item.itemId">
                                        <td>
                                            {{obj.cartList.length - index}}


                                        </td>
                                        <td>{{item.barcode}}</td>
                                        <td>{{item.itemName}}</td>
                                        <td>{{item.unit}}</td>
                                        <td>
                                            <template v-if="item.itemPrice && item.itemPrice != item.price">
                                                {{item.itemPrice | formatPrice(2)}}


                                                <del class="del-font">{{item.price | formatPrice(2)}}</del>
                                            </template>
                                            <template v-else="">
                                                {{item.price | formatPrice(2)}}


                                            </template>
                                        </td>
                                        <td>
                                            {{item.amount}}


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
                                    </tr>
                                </template>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
        <footer class="footer hold-footer">
            <div class="key-area">
                <ul class="tool-list">
                    <li><span class="tool-btn" @click="backtohome"><i class="icon icon-back"></i><span
                            class="text">返回</span><span class="key">ESC</span></span>
                    </li>
                </ul>
                <span class="balance-btn" :class="{'balance-btn-disabled':isdisabled}" @click="distillholdlist">
                    <p class="num">确定提取</p>
                    <p class="key">[enter]</p>
                </span>
            </div>
        </footer>
    </div>
</template>
<script>

    import mainheader from '../../components/mainheader';
    export default {
        data() {
            return {
                current: 0, //tab-cur
                holdList: this.returnholdList(),
                isdisabled: this.returnisdisabled()
            }
        },
        methods: {
            //从localStorage中提取挂单数据'holdList'
            returnholdList: function () {
                var holdList = localStorage.getItem('holdList') ? JSON.parse(localStorage.getItem('holdList')) : [];
                return holdList;
            },
            returnisdisabled: function () {
                return (this.holdList && this.holdList.length > 0) ? true : false;
            },
            //切换左侧tab
            toggletab: function (index) {
                this.current = index;
            },
            //挂单提取
            distillholdlist: function () {
                var index = this.current;
                var distillholdlist = this.holdList[index];
                if (distillholdlist) {
                    localStorage.setItem('distillholdlist', JSON.stringify(distillholdlist) ? JSON.stringify(distillholdlist) : '');
                    //删除挂单项
                    this.holdList.splice(index, 1);
                    if (JSON.stringify(this.holdList) != '[]') {
                        localStorage.setItem('holdList', JSON.stringify(this.holdList));
                    } else {
                        localStorage.setItem('holdList', '');
                    }
                    //跳转
                    this.$router.push({path: 'home'});
                }
            },
            //返回到首页
            backtohome: function () {
                this.$router.push({
                    path: 'home'
                });
            }
        },
        components: {
            mainheader
        }
    }
</script>
<style lang="less" rel="stylesheet/less">

    /** common less fixed **/

    .hold-header {
        height: 91px;
    }

    .hold-container {
        top: 91px;
    }

    .hold-footer {
        height: 86px;
        padding-top: 0px;
    }

    .key-area {
        margin-top: 10px;
    }

    /** layout **/

    .hold-container {
        bottom: 80px;
        background-color: #FFF;
        .wrapper {
            width: 100%;
            height: 100%;
        }
        .aside {
            float: left;
            width: 219px;
            background-color: #f3f3f3;
            height: 100%;
            overflow-y: auto;
            border-right: #E1E1E1 solid 1px;
            .tab-item {
                min-height: 78px;
                height: auto !important;
                height: 78px;
                padding: 15px;
                border-bottom: #E1E1E1 solid 1px;
                font-size: 14px;
                cursor: pointer;
                text-align: left;
                color: #666;
                position: relative;
                display: block;
                &:hover {
                    background-color: #fff;
                }
                .hold-title {
                    font-weight: normal;
                    line-height: 1.5;
                }
                .cart-info {
                    line-height: 1.6;
                }
                .v-icon {
                    width: 86px;
                    height: 26px;
                    text-align: center;
                    line-height: 26px;
                    background-color: #FCD38E;
                    border-radius: 2px;
                    color: #46474A;
                    display: inline-block;
                    font-size: 12px;
                    position: absolute;
                    top: 10px;
                    right: 10px;
                }
            }
            .tab-cur {
                background-color: #fff;
            }
        }
        .section {
            margin-left: 220px;
            overflow-y: auto;
        }
    }

    /* holdlist */

    .section-header {
        background: #FAFAFA;
        /*position: fixed;*/
        width: 100%;
        height: 40px;
        left: 0;
        z-index: 100;
    }

    .section-body {
        min-height: 400px;
        height: auto !important;
        height: 400px;
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
        tr {
            cursor: pointer;
            border-bottom: 1px solid transparent;
            border-top: 1px solid transparent;
            td {
                height: 54px;
                text-align: left;
                font-size: 16px;
                color: #333;
            }
            td:first-child {
                text-align: center;
            }
        }
        tbody tr.current {
            td {
                border-top: 1px solid #EBE5C5;
                border-bottom: 1px solid #EBE5C5;
                background: #FFF9D4;
            }
        }
        tr:hover {
            td {
                background: #FFF9D4;
                border-top: 1px solid #EBE5C5;
                border-bottom: 1px solid #EBE5C5;
            }
        }
    }

</style>