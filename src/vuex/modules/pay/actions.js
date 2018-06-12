/**
 * Created by yizui on 2017/2/23.
 * 作者：李绅
 * 春种一粒粟，秋成万颗子。四海无闲田，农夫犹饿死。
 * 锄禾日当午，汗滴禾下土。谁知盘中餐，粒粒皆辛苦。
 */

/**
 * 获取抹零状态，默认false
 * @param commit
 * @param status
 * @returns {*}
 */
export const getWipingZeroStatus = ({ commit }, status) => {
    return commit('WIPING_ZERO_STATUS', status);
}
/**
 * 抹零
 * @param commit
 * @param data
 * @returns {*}
 */
export const getWipingZero = ({ commit },arr) =>{
    return commit('WIPING_ZERO', arr);
}
/**
 * 找零
 * @param commit
 * @param data
 * @returns {*}
 */
export const setCheckChange = ({ commit }, data) =>{
    return commit('CHECK_CHANGE', data);
}
/**
 * 获取实收金额
 * @param commit
 * @param data
 * @returns {*}
 */
export const setNetReceipts = ({ commit }, data) =>{
    return commit('NET_RECEIPTS', data);
}
export const getPayType = ({ commit }, type) =>{
    return commit('GET_PAY_TYPE', type);
}
export const getCardList = ({ commit }, data) =>{
    return commit('GET_NET_RECEIPTS', data);
}
export const setWipingZeroNum = ({ commit }, data) =>{
    return commit('WIPING_ZERO_NUM', data);
}
export const setTotalPrice = ({ commit }, data) =>{
    return commit('TOTAL_PRICE', data);
}
/* 完成付款 */
export const finishPay = ({ commit }, callback) =>{
    return commit('FINISH_PAY',callback);
}

/* 根据localstorage设置订单信息 */
export const setOrderlist  = ({ commit },data) =>{
    return commit('SET_ORDER_LIST',data);
}
/* 设置付款码 */

export const setPayCode  = ({ commit },code) =>{
    return commit('SET_PAY_CODE',code);
}
//保存备注
export const setMark = ({ commit },mark) =>{
    return commit('SET_MARK',mark);
}
//设置是否显示绑定支付宝浮层
export const setShowBindAlipay = ({ commit }) =>{
    return commit('SET_SHOW_BIND_ALIPAY');
}
//设置支付信息，提供给副屏
export const setPayInfo = ({ commit }) =>{
    return commit('SET_PAY_INFO');
}
//设置副屏展示状态
export const setVicestatus = ({ commit },status) =>{
    return commit('SET_VICESTATUS',status);
}