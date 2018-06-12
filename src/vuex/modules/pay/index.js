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
    orderList: '',//orderList,    //从购物车传递过来的参数
    payCode:'',                   //支付宝微信的付款码
    showBindAlipay:false,
    wipingZeroStatus: false,//抹零状态
    originalPrice: '',//原价
    wipingZeroBackNum: '',//抹零后
    wipingZeroNum: 0,//抹零数
    totalPrice: '',//最终应收的金额(可能是原价、系统抹零后的价格、人为抹零后的价格)
    netReceipts: '',//实收
    changeNum: '',//找零
    payType: '', //默认为空
    vipsave:'' ,  //会员优惠
    vicestatus: 'topay',
    isPaying:false //是否
}

export default{
    state,
    actions,
    getters,
    mutations
}
