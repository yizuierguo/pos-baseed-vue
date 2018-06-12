/**
 * Created by yizui on 2017/2/23.
 * 作者：李绅
 * 春种一粒粟，秋成万颗子。四海无闲田，农夫犹饿死。
 * 锄禾日当午，汗滴禾下土。谁知盘中餐，粒粒皆辛苦。
 */
import * as actions from './actions'
import * as getters from './getters'
import mutations from './mutations'

const state = {
    netWorkStatus:false,       //网络状态
    editType:'',               //编辑类型
    cartList: [],              //购物车列表
    vipInfo:{},                //会员信息
    sumNum:0,                  //总价格
    balanceInfo:{},            //结算信息
    holdList: [],              //挂单列表
    refundList:[],              //退货商品列表
    refundBalanceInfo:{},        //退货结算信息
    refundEditType:'',            //退货商品编辑类型
    shiftUsers:[],              //交班用户
    payType: ''                 //
}

export default{
    state,
    actions,
    getters,
    mutations
}
