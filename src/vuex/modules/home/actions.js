/**
 * Created by yizui on 2017/2/23.
 * 作者：李绅
 * 春种一粒粟，秋成万颗子。四海无闲田，农夫犹饿死。
 * 锄禾日当午，汗滴禾下土。谁知盘中餐，粒粒皆辛苦。
 */
import Win from '../../../libs/win';
import Util from '../../../libs/util';
//更新网络状态
export const setNetWorkStatus = ({commit}, status) => {
    return commit('SET_NETWORT_STATUS', status);
}
/*************************** 商品相关 ******************************/
//根据条形码获取商品
export const getItemByBarcode = ({commit}, arr) => {
    var barcode = arr[0];
    var type = arr[1];
    var data = Win.queryItemByBarcode(barcode);
    if(data.status){
        return commit('GET_ITEM_BY_BARCODE', [data,type]);
    }else {
        Util.toast(data.message,'failed',1000);
    }
}
//从购物车结算列表或者退货列表中删除某个商品  通过商品barcode
export const delCartItemFromList = ({commit}, arr) => {
    var barcode = arr[0];
    var type = arr[1];
    return commit('DEL_CART_ITEM_FROM_LIST', [barcode,type]);
}
//设置商品编辑类型
export const setItemEditType = ({commit}, type) => {
    return commit('SET_ITEM_EDIT_TYPE', type);
}
//编辑商品数量
export const editItemAmount = ({commit}, [val,barcode,type]) => {
    return commit('EDIT_ITEM_AMOUNT', [val,barcode,type]);
}
//编辑商品价钱
export const editItemPrice = ({commit}, [val,barcode,type]) => {
    return commit('EDIT_ITEM_PRICE', [val,barcode,type]);
}
//设置总价
export const setBalanceInfo = ({commit}) => {
    return commit('SET_BALANCE_INFO');
}
//清空购物车
export const clearCartList = ({commit}) => {
    return commit('CLEAR_CARTLIST');
}
//改变cartList中的高亮
export const toggleItemCurrent = ({commit},way) => {
    return commit('TOGGLE_ITEM_CURRENT',way);
}
//构建订单
export const toBuildPayOrder = ({commit},orderType) =>{
    return commit('TO_BUILD_PAY_ORDER',orderType);
}
/*************************** 商品相关 end! **************************/
/*************************** 会员相关 *******************************/
export const getVipInfo = ({commit}, mobile) => {
    var data = Win.getVipInfo(mobile);
    if(data.status){
        return commit('GET_VIP_INFO', data);
    }
}
export const cancelVipInfo = ({commit}) => {
    return commit('CANCEL_VIP_INFO');
}
/*************************** 会员相关 end! **************************/

/*************************** 从挂单数据渲染 **************************/
export const setDistillData = ({commit},distillholdlist) => {
	return commit('SET_DISTILL_DATA',distillholdlist);
}
/*************************** 从挂单数据渲染 end! ********************/

/*************************** 退货相关  *****************************/
//退货商品结算信息
export const setRefundBalanceInfo = ({commit}) => {
    return commit('SET_REFUND_BALANCE_INFO');
}
//退货商品编辑类型
export const setRefundEditType = ({commit},type) => {
    return commit('SET_REFUND_EDIT_TYPE',type);
}
//构建退货订单
export const toBuildRefundOrder = ({commit},type) => {
    return commit('TO_BUILD_REFUND_ORDER',type);
}
//清理refund数据
export const clearRefundData = ({commit}) => {
    return commit('CLEAR_REFUND_DATA');
}
/*************************** 退货相关 end! *************************/
/*************************** 店铺 店员相关  *************************/
//交班店员
export const getShiftUsers = ({commit}) => {
    var data = Win.getShiftUsers();
    return commit('GET_SHIFT_USERS',data);
}
/*************************** 店铺 店员相关 end!  ********************/