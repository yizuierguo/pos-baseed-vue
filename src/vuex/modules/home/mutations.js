/**
 * Created by yizui on 2017/2/23.
 * 作者：李绅
 * 春种一粒粟，秋成万颗子。四海无闲田，农夫犹饿死。
 * 锄禾日当午，汗滴禾下土。谁知盘中餐，粒粒皆辛苦。
 */
import {
    SET_NETWORT_STATUS,
    GET_ITEM_BY_BARCODE,
    DEL_CART_ITEM_FROM_LIST,
    SET_ITEM_EDIT_TYPE,
    EDIT_ITEM_AMOUNT,
    EDIT_ITEM_PRICE,
    GET_VIP_INFO,
    CANCEL_VIP_INFO,
    SET_BALANCE_INFO,
    CLEAR_CARTLIST,
    TOGGLE_ITEM_CURRENT,
    TO_BUILD_PAY_ORDER,
    SET_DISTILL_DATA,
    SET_REFUND_BALANCE_INFO,
    SET_REFUND_EDIT_TYPE,
    TO_BUILD_REFUND_ORDER,
    CLEAR_REFUND_DATA,
    GET_SHIFT_USERS
} from './mutation-type';


import Win from '../../../libs/win';
import Util from '../../../libs/util';
/*********************************** 工具方法 *****************************************/

//根据barcode判断数组中是否含有当前对象
//const checkIsHasEl =
function checkIsHasEl(list, obj) {
    var _is = false;
    list.forEach(function (item) {
        if (item.barcode === obj.barcode) {
            _is = true;
            return false;
        }
    });
    return _is;
}
//根据对象中的barcode获取obj
//const returnEl =
function returnEl(list, obj) {
    var _o = {};
    if (checkIsHasEl(list, obj)) {
        list.forEach(function (item) {
            if (item.barcode === obj.barcode) {
                _o = item;
            }
        });
        return _o;
    } else {
        return obj;
    }
}
//根据barcode获取obj
// const returnElByBarcode =
function returnElByBarcode(list, barCode) {
    var _o = {};
    list.forEach(function (item) {
        if (item.barcode === barCode) {
            _o = item;
        }
    });
    return _o;
}
//根据barcode获取itemId
function returnElByItemId(list, itemId) {
    var _o = {};
    list.forEach(function (item) {
        if (item.itemId === itemId) {
            _o = item;
        }
    });
    return _o;
}
//根据高亮项获取obj
// const returnElByCurrent =
function returnElByCurrent(list) {
    var _o = {};
    list.forEach(function (item) {
        if (item.isCurrent) {
            _o = item;
        }
    });
    return _o;
}
//获取索引
//const returnIndexOf =
function returnIndexOf(list, obj) {
    if (checkIsHasEl(list, obj)) {
        var _index = '';
        list.forEach(function (item, index) {
            if (item.itemId == obj.itemId) {
                _index = index;
            }
        });
        return _index;
    }
}
//将数据提到最前 高亮 数量+1
function highLightCur(list, obj) {
    //只有是undefined的时候才指定数量为1
    if (returnElByItemId(list, obj.itemId).amount == undefined) {
        returnElByItemId(list, obj.itemId).amount = 1;
    }
    //缓存已经存在的数据
    var newO = returnEl(list, obj);
    newO.amount = newO.amount + 1;
    list.splice(returnIndexOf(list, obj), 1);
    //把newO放到最前面
    list.unshift(newO);
    return list;
}
//根据高亮项 获取下一项
//const getHighLightCur
function getHighLightCur(list, way) {
    var l = list.length;
    var o = {};
    list.forEach(function (item, index) {
        if (item.isCurrent) {
            //向上
            if (way == 'up') {
                //第一项
                if (index == 0) {
                    o = list[l - 1];
                } else {
                    o = list[index - 1];
                }
            }
            //向下
            else if (way == 'down') {
                //最后一项
                if (index == (l - 1)) {
                    o = list[0];
                } else {
                    o = list[index + 1];
                }
            }
            item.isCurrent = false;
        }
    });
    o.isCurrent = true;
}
//根据itemCenterGmtModify 选出最近修改的商品
// const selectItemByGmtModify =
function selectItemByGmtModify(list) {
    var obj = list[0];
    list.forEach(function (item) {
        if (parseInt(obj.itemCenterGmtModify) < parseInt(item.itemCenterGmtModify)) {
            obj = item;
        } else if (parseInt(obj.itemId) < parseInt(item.itemId)) {
            obj = item;
        }
    });
    return obj;
}
/*
 * @Function:selectOnlineItem
 * @Info:根据客户端返回的商品list选取最合适的商品
 * 选取商品逻辑:{
 *    1.如果都是售卖中商品(status='100')则选择最近修改(gmtModify较大)的;
 *    2.如果既有售卖中又有非售卖中的,则从售卖中选择;
 *    3.如果没有售卖中,则选择最近修改的商品;
 * }
 * */
// const selectOnlineItem =
function selectOnlineItem(list) {
    var l = 0;
    var onlineArr = [];
    var toDelArr = [];
    list.forEach(function (item) {
        if (item.status == '100') {
            onlineArr.push(item);
        } else {
            toDelArr.push(item);
        }
    });
    //只有一个是在售的,则选中这个,其余的都删除
    if (onlineArr.length == 1) {
        Win.deleteItemById(String(onlineArr[0].itemId));
        return onlineArr[0];
    }
    //多个在售,则选中最近修改的,其余的都删除
    else if (onlineArr.length > 1) {
        //从多个在售中选中最近修改的
        var gmtModifyItem = selectItemByGmtModify(onlineArr);
        var delArr = [];
        //list中非gmtModifyItem 全部删除
        list.forEach(function (item) {
            if (item.itemId != gmtModifyItem.itemId) {
                delArr.push(item.itemId);
            }
        });
        Win.deleteItemById(delArr.toString());
        //返回最终筛选的
        return gmtModifyItem;
    }
    //没有在售,则从剩余中选择最近修改的,其余的都删除
    else if (onlineArr.length == 0) {
        //选中最近修改的
        var gmtModifyItem = selectItemByGmtModify(toDelArr);
        var delArr = [];
        //list中非gmtModifyItem 全部删除
        list.forEach(function (item) {
            if (item.itemId != gmtModifyItem.itemId) {
                delArr.push(item.itemId);
            }
        });
        //调用客户端
        Win.deleteItemById(delArr.toString());
        //返回最终筛选的
        return gmtModifyItem;
    }
}
/*********************************** 工具方法 end! ***********************************/
/******************************* 对外暴露的mutations *********************************/
const mutations = {
    //设置网络状态
    [SET_NETWORT_STATUS](state, status){
        state.netWorkStatus = status;
    },
    //根据商品条码获取商品信息
    //注意退货商品也走这个逻辑 通过type区分:refundList:退货页面退货列表 , cartList:首页购物车列表
    [GET_ITEM_BY_BARCODE](state, arr){
        var data = arr[0];  //客户端返回的商品数据
        var type = arr[1];  //页面类型
        //一个商品
        if (data.entry.length == 1) {
            if (data.entry[0].isCommonItem == '1') {
                data.entry[0].amount = 1;
                state.editType = 'price';
                state[type].unshift(data.entry[0]);
            } else {
                if (state[type].length == 0) {
                    data.entry[0].amount = 1;
                    // data.entry[0].isCurrent = true;
                    //是否是退货 否则到购物车
                    state[type] = data.entry;
                }
                //第二次及之后
                else if (state[type].length > 0) {
                    //相同itemId已经存在则商品数量+1 高亮 位置提到最前
                    if (checkIsHasEl(state[type], data.entry[0])) {
                        //是否是退货 否则到购物车
                        state[type] = highLightCur(state[type], data.entry[0]);
                    }
                    //否则添加一条新的数据
                    else {
                        data.entry[0].amount = 1;
                        state[type].unshift(data.entry[0]);
                    }
                }
            }
        }
        //多个商品
        else if (data.entry.length > 1) {
            //返回多个中最合适的商品
            var newItem = selectOnlineItem(data.entry);
            //第一次
            if (state[type].length == 0) {
                newItem.amount = 1;
                // newItem.isCurrent = true;
                state[type].push(newItem);
            }
            //第二次及之后
            else if (state[type].length > 0) {
                //相同itemId已经存在则商品数量+1 高亮 位置提到最前
                if (checkIsHasEl(state[type], newItem)) {
                    state[type] = highLightCur(state[type], newItem);
                }
                //否则添加一条新的数据
                else {
                    state[type].unshift(newItem);
                }
            }
        }
        //删除之前的高亮
        state[type].forEach(function (item) {
            if(item.isCurrent){
                item.isCurrent = false;
            }
        });
        //第一个高亮 防止闪烁
        state[type][0].isCurrent = true;
    },
    // 从购物车结算列表中删除某个商品by商品id
    [DEL_CART_ITEM_FROM_LIST] (state, arr) {
        var barCode = arr[0];
        var type = arr[1];  //页面类型
        var obj = barCode ? returnElByBarcode(state[type], barCode) : returnElByCurrent(state[type]);
        getHighLightCur(state[type], 'down');
        state[type].splice(returnIndexOf(state[type], obj), 1);
    },
    //设置编辑类型
    [SET_ITEM_EDIT_TYPE](state, type){
        state.editType = type;
    },
    //改数量
    [EDIT_ITEM_AMOUNT](state, [val, barCode, type]){
        var obj = returnElByBarcode(state[type], barCode);
        obj.amount = val;
        //取消编辑类型
        if (type == 'cartList') {
            state.editType = '';
        } else if (type == 'refundList') {
            state.refundEditType = '';
        }
    },
    //改价钱
    [EDIT_ITEM_PRICE](state, [val, barCode, type]){
        var obj = returnElByBarcode(state[type], barCode);
        obj.itemPrice = val;  //原价不变 只是改了售价 跟@结算的字段一致
        //取消编辑类型
        if (type == 'cartList') {
            state.editType = '';
        } else if (type == 'refundList') {
            state.refundEditType = '';
        }
    },
    //获取会员信息
    [GET_VIP_INFO](state, data){
        state.vipInfo = data.entry;
    },
    //取消会员信息
    [CANCEL_VIP_INFO](state, data){
        state.vipInfo = {};
    },
    //设置结算信息
    [SET_BALANCE_INFO](state){
        var cartList = state.cartList;
        var vipInfo = state.vipInfo;
        var isAllowMemberPrice = (vipInfo && vipInfo.isAllowMemberPrice)?vipInfo.isAllowMemberPrice:false;
        var discount = (vipInfo && vipInfo.discount && isAllowMemberPrice) ? parseInt(vipInfo.discount):100;
        var num = 0;                  //总件数
        var showTotalPrice = 0;       //展示价总价
        var salesTotalPrice = 0;      //售价总价 (结算)
        var showTotalPriceNoMember = 0; //没有会员的展示总价 (合计)
        var vipSave = 0;              //会员优惠
        var originPrice = 0;          //原总价
        cartList.forEach(function (item) {
            //原总价
            originPrice += item.itemPrice?parseInt(item.itemPrice):parseInt(item.price) * parseInt(item.amount);
            //总件数逻辑
            num += parseInt(item.amount);
            //展示价逻辑
            item.showPrice = item.price;
            item.showPriceNoMember = item.price;
            if(item.itemPrice && item.itemPrice != item.price){
                item.showPrice = item.itemPrice;
                item.showPriceNoMember = item.itemPrice;
            }else if(!item.itemPrice && isAllowMemberPrice && parseInt(item.memberPrice) < parseInt(item.price)){
                if(item.isCommonItem === '0'){
                    item.showPrice = item.memberPrice;
                }
            }
            //展示价总价逻辑
            showTotalPrice += parseInt(item.showPrice) * parseInt(item.amount);
            //售价逻辑
            item.salesPrice = Math.floor(parseInt(item.showPrice) * discount / 100);
            //售价总价逻辑
            salesTotalPrice += parseInt(item.salesPrice) * parseInt(item.amount);
            //没有会员的展示总价
            showTotalPriceNoMember += parseInt(item.showPriceNoMember) * parseInt(item.amount);
        });
        vipSave = showTotalPriceNoMember - salesTotalPrice; //会员优惠
        state.balanceInfo = {
             num:num,                  //总件数
             showTotalPrice: showTotalPrice,       //展示价总价
             salesTotalPrice: salesTotalPrice,      //售价总价 (结算)
             showTotalPriceNoMember:showTotalPriceNoMember, //没有会员的展示总价 (合计)
             vipSave:vipSave,              //会员优惠
             originPrice:originPrice          //原总价
        };
        //副屏通信
        if(cartList.length > 0){
            var obj = {
                vicestatus:'tocart',
                cartList:cartList,
                balanceInfo:state.balanceInfo,
                vipInfo:state.vipInfo,
                payInfo:{}
            }
            localStorage.setItem('vicedata', JSON.stringify(obj) ? JSON.stringify(obj) : '');
        } else {
            var obj = {
                vicestatus:'default',
                cartList:cartList,
                balanceInfo:state.balanceInfo,
                vipInfo:state.vipInfo,
                payInfo:{}
            }
            localStorage.setItem('vicedata', JSON.stringify(obj) ? JSON.stringify(obj) : '');
        }
    },
    //清空购物车列表
    [CLEAR_CARTLIST](state){
        state.cartList = [];
        //副屏通信
        localStorage.setItem('cartList', '');
    },
    //根据上下键改变高亮
    [TOGGLE_ITEM_CURRENT](state, way){
        getHighLightCur(state.cartList, way);
    },
    //构建订单参数传给支付页面
    [TO_BUILD_PAY_ORDER](state, orderType){
        var vipInfo = state.vipInfo ? state.vipInfo : {};
        var cartList = state.cartList;
        var balanceInfo = state.balanceInfo;
        var bizOrderName = [];
        var buyAmount = 0;
        var subBizOrderList = [];
        //如果购物车中没有信息 则return掉;
        if (state.cartList.length == 0) {
            return;
        }
        cartList.forEach(function (item) {
            bizOrderName.push(item.itemName);
            buyAmount += parseInt(item.amount);
            //售价逻辑
            var _o = {
                itemId: item.itemId,
                barcode: item.barcode,
                buyAmount: item.amount,
                itemName: item.itemName,
                itemOriginPrice: item.itemPrice?item.itemPrice:item.price,
                itemOriginPriceNoModify:item.price,
                itemPrice: item.salesPrice,   //sales price
                unit: item.unit,
                totalPrice: (parseInt(item.salesPrice) * parseInt(item.amount) < 1) ? 1:(parseInt(item.salesPrice) * parseInt(item.amount))  //sales price * item.amount 小于0.01的就按0.01算
            }
            subBizOrderList.push(_o);
        });
        var orderList = {
            accountId: vipInfo && vipInfo.accountId ? vipInfo.accountId : ' ',
            bizOrder: {
                actualPay: '',
                bizOrderName: (bizOrderName.join(',').length > 255)?bizOrderName.join(',').substr(0,255):bizOrderName.join(','), //处理最终字符数量
                buyAmount: buyAmount,
                memberId: vipInfo && vipInfo.memberId ? vipInfo.memberId : '',
                memberMobile: vipInfo && vipInfo.mobile ? vipInfo.mobile : '',
                memberNick: vipInfo && vipInfo.name ? vipInfo.name : '',
                orderFundList: [
                    // {
                    //     fund: '',
                    //     fundType: '',
                    //     platformSubsidy: '',
                    //     sellerSubsidy: ''
                    // }
                ],
                orderType: orderType,
                originPrice: balanceInfo['originPrice'], //原originPrice
                payTypeList: [
                    // {
                    //     actualPay: '',
                    //     payFund: '',
                    //     payQrCode: '',
                    //     payType: ''
                    // }
                ],
                remark: '',
                subBizOrderList: subBizOrderList,
                totalPrice: balanceInfo['salesTotalPrice']
            }
        }
        //对createType 2或者3的商品做处理
        var createItemArr = [];
        state.cartList && state.cartList.forEach(function (item) {
            if (item.createType == '2') {
                var itemId = item.itemId;
                var price = item.itemPrice;
                Win.updateItemPrice(itemId, price);
            } else if (item.createType == '3') {
                createItemArr.push(item);
            }
        });
        //创建线上商品
        var res = (createItemArr.length > 0) ? Win.createOnlineItem(createItemArr) : {};
        if (res.status) {
            //更新原始数据
            state.cartList.forEach(function (j) {
                res.entry && res.entry.forEach(function (item) {
                    if (j.createType == '3' && j.barcode == item.barcode) {
                        j.itemId = item.itemId;
                    }
                });
            });
            //改变传递给结算的数据
            orderList && orderList.bizOrder && orderList.bizOrder.subBizOrderList.forEach(function (j) {
                res.entry && res.entry.forEach(function (item) {
                    if (j.barcode == item.barcode) {
                        j.itemId = item.itemId;
                    }
                });
            });
        }
        orderList.balanceInfo = state.balanceInfo;
        orderList.vipInfo = state.vipInfo;
        //创建订单
        Win.payOrder(orderList);
        localStorage.setItem('orderList', JSON.stringify(orderList) ? JSON.stringify(orderList) : '');
    },
    //设置挂单数据到购物车列表
    [SET_DISTILL_DATA](state, distillholdlist){
        if (distillholdlist.length != 0) {
            state.cartList = distillholdlist['cartList'] ? distillholdlist['cartList'] : [];
            state.vipInfo = distillholdlist['vipInfo'] ? distillholdlist['vipInfo'] : {};
            state.balanceInfo = distillholdlist['balanceInfo'] ? distillholdlist['balanceInfo'] : {};
        } else {
            state.cartList = [];
            state.vipInfo = {};
            state.balanceInfo = {};
        }
        //清空localStorage
        localStorage.setItem('distillholdlist', '');
    },
    //退货结算信息
    [SET_REFUND_BALANCE_INFO](state){
        var refundList = state.refundList;
        var sum = 0; //原总价
        var num = 0; //总件数
        (state.refundList.length > 0) && refundList.forEach(function (item) {
            //计算件数
            num += parseInt(item.amount);
            /********* 计算价格 ***********/
            //如果修改了价格
            if (item.itemPrice) {
                sum += parseInt(item.itemPrice) * parseInt(item.amount);
            }
            //没有修改过价格
            else {
                sum += parseInt(item.price) * parseInt(item.amount);
            }
            /********* 计算价格 ***********/
        });
        var refundBalanceInfo = {
            sum: Util.floorNum(sum),
            num: num
        }
        state.refundBalanceInfo = refundBalanceInfo;
        //副屏通信
        if(state.refundList.length > 0){
            var obj = {
                vicestatus:'torefund',
                refundBalanceInfo:state.refundBalanceInfo,
                refundList:state.refundList
            }
            localStorage.setItem('vicedata', JSON.stringify(obj) ? JSON.stringify(obj) : '');
        } else {
            var obj = {
                vicestatus:'default'
            }
            localStorage.setItem('vicedata', JSON.stringify(obj) ? JSON.stringify(obj) : '');
        }
    },
    //退货商品编辑类型
    [SET_REFUND_EDIT_TYPE](state, type){
        state.refundEditType = type;
    },
    //构建退货订单
    [TO_BUILD_REFUND_ORDER](state, orderType){
        var refundList = state.refundList;
        var refundBalanceInfo = state.refundBalanceInfo;
        var bizOrderName = '';
        var buyAmount = 0;
        var subBizOrderList = [];
        //如果购物车中没有信息 则return掉;
        if (state.refundList.length == 0) {
            return;
        }
        refundList.forEach(function (item) {
            bizOrderName += item.itemName;
            buyAmount += parseInt(item.amount);
            //售价逻辑
            var salesPrice = item.price;
            if(item.itemPrice && item.itemPrice != item.price){
                salesPrice = item.itemPrice
            }
            var _o = {
                itemId: item.itemId,
                barcode: item.barcode,
                buyAmount: item.amount,
                itemName: item.itemName,
                itemOriginPrice: item.price,
                itemPrice: salesPrice,
                unit: item.unit,
                totalPrice: parseInt(salesPrice) * parseInt(item.amount)
            }
            subBizOrderList.push(_o);
        });
        var orderList = {
            bizOrder: {
                actualPay: '',
                bizOrderName: bizOrderName,
                buyAmount: buyAmount,
                memberId: '',
                memberMobile: '',
                memberNick: '',
                orderFundList: [
                    // {
                    //     fund: '',
                    //     fundType: '',
                    //     platformSubsidy: '',
                    //     sellerSubsidy: ''
                    // }
                ],
                orderType: orderType,
                originPrice: refundBalanceInfo['sum'],
                payTypeList: [
                    // {
                    //     actualPay: '',
                    //     payFund: '',
                    //     payQrCode: '',
                    //     payType: ''
                    // }
                ],
                remark: '',
                subBizOrderList: subBizOrderList,
                totalPrice: refundBalanceInfo['sum']
            }
        }
        orderList.bizOrder.orderFundList = []; //先清理一下
        orderList.bizOrder.actualPay = orderList.bizOrder.totalPrice;
        /******************* orderFundList *******************/
        //实退
        var obj = {
            fund:orderList.bizOrder.totalPrice,
            fundType:"1",
            platformSubsidy:orderList.bizOrder.totalPrice,
            sellerSubsidy:"0"
        };
        orderList.bizOrder.orderFundList.push(obj);
        /******************* payTypeList *********************/
        var t_obj = {
            actualPay: orderList.bizOrder.totalPrice,
            payFund: orderList.bizOrder.totalPrice,
            payQrCode: '',
            payType: '1'
        };
        orderList.bizOrder.payTypeList.push(t_obj);
        //调用方法
        Win.payOrder('',orderList.bizOrder);
        //传递给副屏的内容
        localStorage.setItem('orderList', JSON.stringify(orderList) ? JSON.stringify(orderList) : '');
    },
    //清理退货信息
    [CLEAR_REFUND_DATA](state){
        //清理refundList refundBalanceInfo refundEditType
        state.refundList = [];
        state.refundBalanceInfo = {};
        state.refundEditType = '';
    },
    //店铺店员相关
    [GET_SHIFT_USERS](state, data){
        if (data.status && (data.entry.length != 0)) {
            state.shiftUsers = data.entry;
        } else {
            state.shiftUsers = [];
        }
        //交班店员
        localStorage.setItem('shiftUsers', (JSON.stringify(state.shiftUsers) != '[]') ? JSON.stringify(state.shiftUsers) : '');
    }
}
export default mutations
