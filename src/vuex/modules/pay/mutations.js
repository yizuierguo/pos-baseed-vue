/**
 * Created by yizui on 2017/2/23.
 * 作者：李绅
 * 春种一粒粟，秋成万颗子。四海无闲田，农夫犹饿死。
 * 锄禾日当午，汗滴禾下土。谁知盘中餐，粒粒皆辛苦。
 */
import {
    CHECK_CHANGE,
    FINISH_PAY,
    GET_PAY_TYPE,
    NET_RECEIPTS,
    SET_MARK,
    SET_ORDER_LIST,
    SET_PAY_CODE,
    SET_PAY_INFO,
    SET_SHOW_BIND_ALIPAY,
    SET_VICESTATUS,
    TOTAL_PRICE,
    UPDATA_PAY,
    WIPING_ZERO,
    WIPING_ZERO_NUM,
    WIPING_ZERO_STATUS
} from "./mutation-type";
import Win from "../../../libs/win";
import util from "../../../libs/util";


var totalCount = 10;     //轮询次数限制
var count = 0;           //当前次数
var G_LOOP_TIMER = null; //轮询支付状态定时器
const mutations = {
    /**
     * 抹零
     * @param state
     */
        [WIPING_ZERO] (state) {
        if (util && util.wipingZero) {
            //抹零后
            state.wipingZeroBackNum = util.wipingZero(state.originalPrice);
            //已抹零
            state.wipingZeroNum = (parseInt(state.originalPrice) * 1) - (parseInt(state.wipingZeroBackNum) * 1);
        }
    },
    /**
     * 抹零状态
     * @param state
     * @param data
     */
        [WIPING_ZERO_STATUS] (state, type){
        if (type) {
            if (type == '1') {
                state.wipingZeroStatus = true;
            }
            if (type == '0') {
                state.wipingZeroStatus = false;
            }
        }
        else {
            state.wipingZeroStatus = !state.wipingZeroStatus;
        }
        if (state.wipingZeroStatus) {
            state.totalPrice = state.wipingZeroBackNum;
        }
        else {
            state.totalPrice = state.originalPrice;
        }
    },
    /**
     * 获取实收金额
     * @param state
     * @param data
     */
    [NET_RECEIPTS] (state, data){
        state.netReceipts = data;
    },
    //找零
    [CHECK_CHANGE] (state, data){
        state.changeNum = data;
    },
    //应付
    [TOTAL_PRICE] (state, data){
        state.totalPrice = data;
    },
    //抹零数
    [WIPING_ZERO_NUM] (state, data){
        state.wipingZeroNum = data;
    },
    [SET_SHOW_BIND_ALIPAY] (state){
        state.showBindAlipay = !state.showBindAlipay;
    },
    // 提交收款
    [UPDATA_PAY] (state, data) {
        //todo..
    },
    [GET_PAY_TYPE] (state, type) {
        state.payType = type;
    },

    /************* 一醉添加 ****************/
    //完成支付
    [FINISH_PAY](state, callbacks){
        if(state.isPaying){return;}
        state.isPaying = true;
        var orderList = state.orderList;
        var accountId = state.orderList.accountId;
        var totalPrice = state.wipingZeroStatus ? state.totalPrice : state.originalPrice;//应收
        orderList.bizOrder.actualPay = state.netReceipts ? state.netReceipts : state.originalPrice;  //
        orderList.bizOrder.orderFundList = [];
        orderList.bizOrder.payTypeList = [];
        /******************* orderFundList *******************/
        //实收
        if (state.originalPrice) {
            var obj = {
                fund: totalPrice,
                fundType: "1",
                platformSubsidy: totalPrice,
                sellerSubsidy: "0"
            };
            orderList.bizOrder.orderFundList.push(obj);
        }
        //抹零
        if (state.wipingZeroStatus && state.wipingZeroNum != '0.0') {
            var obj = {
                fund: state.wipingZeroNum,
                fundType: "14",
                platformSubsidy: "0",
                sellerSubsidy: state.wipingZeroNum
            };
            orderList.bizOrder.orderFundList.push(obj);
            orderList.bizOrder.totalPrice = state.totalPrice;
        }
        //其他扩展支付
        //会员折扣
        if (state.orderList.vipInfo.isAllowMemberPrice) {
            var obj = {
                fund: parseFloat(state.orderList.balanceInfo.vipSave),
                fundType: "15",
                platformSubsidy: "0",
                sellerSubsidy: parseFloat(state.orderList.balanceInfo.vipSave),
            };
            orderList.bizOrder.orderFundList.push(obj);
        }
        /******************* payTypeList *******************/
        //现金
        if (state.payType == '1') {
            var obj = {
                actualPay: state.netReceipts, //实收
                payFund: totalPrice,   //应收
                payQrCode: '',
                payType: '1'
            };
            orderList.bizOrder.payTypeList.push(obj);
        }
        //支付宝
        if (state.payType == '2') {
            var obj = {
                actualPay: totalPrice,//应收
                payFund: totalPrice,//应收
                payQrCode: state.payCode,//付款码
                payType: '2'
            };
            orderList.bizOrder.payTypeList.push(obj);
            orderList.bizOrder.actualPay = totalPrice;
        }
        //微信
        if (state.payType == '3') {
            var obj = {
                actualPay: totalPrice,//应收
                payFund: totalPrice,//应收
                payQrCode: state.payCode,         //付款码
                payType: '3'
            };
            orderList.bizOrder.payTypeList.push(obj);
            orderList.bizOrder.actualPay = totalPrice;
        }
        if (state.payType == '5') {
            var obj = {
                actualPay: totalPrice,//应收
                payFund: totalPrice,//应收
                payType: '5'
            };
            orderList.bizOrder.payTypeList.push(obj);
            orderList.bizOrder.actualPay = totalPrice;
        }
        if (state.payType == '6') {
            var obj = {
                actualPay: totalPrice,//应收
                payFund: totalPrice,//应收
                payType: '6'
            };
            orderList.bizOrder.payTypeList.push(obj);
            orderList.bizOrder.actualPay = totalPrice;
            orderList.bizOrder.remark = state.mark;
        }
        if (state.payType == '7') {
            var obj = {
                actualPay: totalPrice,//应收
                payFund: totalPrice,//应收
                payType: '7'
            };
            orderList.bizOrder.payTypeList.push(obj);
            orderList.bizOrder.actualPay = totalPrice;
            orderList.bizOrder.remark = state.mark;
        }
        if (state.payType == '8') {
            var obj = {
                actualPay: totalPrice,//应收
                payFund: totalPrice,//应收
                payType: '8',
            };
            orderList.bizOrder.payTypeList.push(obj);
            orderList.bizOrder.actualPay = totalPrice;
            orderList.bizOrder.remark = state.mark;
        }
        var res = Win.payOrder(accountId, orderList.bizOrder);
        //支付成功
        if (res.status) {
            state.vicestatus = 'paysuc';
            state.payType = '';
            callbacks[0]();
            util.toast('支付成功', 'succeed', 2000, function () {
                callbacks[1]();
            });
        }
        //支付失败
        else {
            var responseCode = res.responseCode;
            var bizOrderId = res.entry ? res.entry : '';
            //401 403 直接不处理
            if (responseCode == 401 || responseCode == 403) {
                util.toast(res.message, 'failed', 2000);
            }
            //400轮询支付状态 超过限制次数 就取消支付
            else if (responseCode == 400) {
                G_LOOP_TIMER = setInterval(function () {
                    if (count >= totalCount) {
                        Win.cancelOrder(bizOrderId);
                        window.clearInterval(G_LOOP_TIMER);
                        count = 0;
                        return;
                    }
                    console.log('count :' + count);
                    console.log('totalCount :' + totalCount);
                    count++;
                    var data = Win.loopCheckPayStatus(bizOrderId);
                    //成功
                    if(data.status){
                        //清理定时器
                        clearInterval(G_LOOP_TIMER);
                        count = 0;
                        state.vicestatus = 'paysuc';
                        state.payType = '';
                        callbacks[0]();
                        util.toast('支付成功', 'succeed', 2000, function () {
                            callbacks[1]();
                        });
                    }else {
                        //401 403 直接不处理
                        if (data.responseCode == 401 || data.responseCode == 403) {
                            //清理定时器
                            clearInterval(G_LOOP_TIMER);
                            count = 0;
                            //
                            //util.toast(res.message, 'failed', 2000);
                        }
                        //400 继续轮询
                        else if (data.responseCode == 400) {

                        }
                    }
                }, 3000);
            } else {
                util.toast(res.message, 'failed', 2000);
            }
        }
        //更改支付状态
        state.isPaying = false;
    },
    //根据ls设置订单信息
    [SET_ORDER_LIST](state, data){
        state.orderList = data;
        state.originalPrice = (data && data.bizOrder && data.bizOrder.totalPrice) ? data.bizOrder.totalPrice : 0;
    },
    [SET_PAY_CODE](state, code){
        state.payCode = code;
    },
    [SET_MARK](state, mark){
        state.mark = mark;
    },
    //提供给副屏支付数据
    [SET_PAY_INFO](state){
        var obj = {
            vicestatus: state.vicestatus,
            payInfo: {
                totalPrice: state.wipingZeroStatus ? state.totalPrice : state.originalPrice,//应收
                netReceipts: state.netReceipts,//实收
                wipingZeroNum: state.wipingZeroNum,//抹零数
                changeNum: state.changeNum//找零
            }
        };
        localStorage.setItem('vicedata', JSON.stringify(obj) ? JSON.stringify(obj) : '');
        var data = JSON.parse(localStorage.getItem('vicedata'));
        console.log(data);
    },
    [SET_VICESTATUS](state, status){
        state.vicestatus = status;
    }
}

export default mutations