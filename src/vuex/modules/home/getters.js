/**
 * Created by yizui on 2017/2/23.
 * 作者：李绅
 * 春种一粒粟，秋成万颗子。四海无闲田，农夫犹饿死。
 * 锄禾日当午，汗滴禾下土。谁知盘中餐，粒粒皆辛苦。
 */
/*********************** 网络状态 **************************/
export const getNetWorkStatus = state => state.netWorkStatus;  //网络状态
/*********************** 商品逻辑 **************************/
export const cartList = state => state.cartList;               //购物车商品列表
export const editType = state => state.editType;               //编辑类型
export const balanceInfo = state => state.balanceInfo;         //结算信息
/*********************** 会员信息 **************************/
export const vipInfo = state => state.vipInfo;                 //会员信息
/*********************** 退货逻辑 **************************/
export const refundList = state => state.refundList;           //退货商品列表
export const refundBalanceInfo = state => state.refundBalanceInfo;           //退货结算信息
export const refundEditType = state => state.refundEditType;      //退货商品编辑类型

/*********************** 交班用户 **************************/
export const shiftUsers = state => state.shiftUsers;