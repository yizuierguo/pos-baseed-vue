/**
 * Created by yizui on 2017/2/23.
 * 作者：李绅
 * 春种一粒粟，秋成万颗子。四海无闲田，农夫犹饿死。
 * 锄禾日当午，汗滴禾下土。谁知盘中餐，粒粒皆辛苦。
 */
export const orderList = state => state.orderList;                 //订单
export const getWipingZeroStatus = state => state.wipingZeroStatus;//获取抹零状态，默认false
export const getOriginalPrice = state => state.originalPrice;//获取原价
export const getWipingZeroBackNum = state => state.wipingZeroBackNum;//获取系统抹零后的价格
export const getWipingZeroNums = state => state.wipingZeroNum;//获取抹零数
export const getNetReceipts = state => state.netReceipts;//获取实收金额
export const getChangeNum = state => state.changeNum;//获取找零
export const getPayType = state => state.payType;//获取支付类型
export const getTotalPrice = state => state.totalPrice;//获取最终抹零后的价格
export const getRemark = state => state.remark;
export const getBalance = state => state.orderList.vipInfo && state.orderList.vipInfo.balance;
export const getIsAllowMemberPrice = state => state.orderList.vipInfo && state.orderList.vipInfo.isAllowMemberPrice;
export const getShowBindAlipay = state => state.showBindAlipay;