/**
 * Created by yizui on 2017/2/23.
 * 锟斤拷锟竭ｏ拷锟斤拷锟斤拷
 * 锟斤拷锟斤拷一锟斤拷锟节ｏ拷锟斤拷锟斤拷锟斤拷锟接★拷锟侥猴拷锟斤拷锟斤拷锟斤，农锟斤拷锟教讹拷锟斤拷锟斤拷
 * 锟斤拷锟斤拷锟秸碉拷锟界，锟斤拷锟轿猴拷锟斤拷锟斤拷锟斤拷谁知锟斤拷锟叫餐ｏ拷锟斤拷锟斤拷锟斤拷锟斤拷锟洁。
 */
export const SET_NETWORT_STATUS = 'SET_NETWORT_STATUS';             //设置网络状态
/************************* 商品相关 ********************************/
export const GET_ITEM_BY_BARCODE = 'GET_ITEM_BY_BARCODE';           //根据条码获取商品信息
export const DEL_CART_ITEM_FROM_LIST = 'DEL_CART_ITEM_FROM_LIST';   //根据商品barcode删除某个商品
export const SET_ITEM_EDIT_TYPE = 'SET_ITEM_EDIT_TYPE';             //设置编辑类型
export const EDIT_ITEM_AMOUNT = 'EDIT_ITEM_AMOUNT';                 //编辑商品数量
export const EDIT_ITEM_PRICE = 'EDIT_ITEM_PRICE';                   //编辑商品价钱
export const CLEAR_CARTLIST = 'CLEAR_CARTLIST';                     //清空购物车
export const TOGGLE_ITEM_CURRENT = 'TOGGLE_ITEM_CURRENT';           //根据上下键改变高亮
/************************* 商品相关 end! ***************************/
/************************* 会员相关 ********************************/
export const GET_VIP_INFO = 'GET_VIP_INFO';                         //获取会员信息
export const CANCEL_VIP_INFO = 'CANCEL_VIP_INFO';                   //取消会员
/************************* 会员相关 end! ***************************/
/************************* 结算相关 ********************************/
export const SET_BALANCE_INFO = 'SET_BALANCE_INFO';
export const TO_BUILD_PAY_ORDER = 'TO_BUILD_PAY_ORDER';             //构建订单参数传给支付页面
/************************* 结算相关 end! ***************************/

/************************* 挂单相关 ********************************/
export const SET_DISTILL_DATA = 'SET_DISTILL_DATA';                        //从挂单回传到购物车
/************************* 挂单相关 end ! **************************/


/************************* 退货相关 ********************************/
export const SET_REFUND_BALANCE_INFO = 'SET_REFUND_BALANCE_INFO';        //退货结算信息
export const SET_REFUND_EDIT_TYPE = 'SET_REFUND_EDIT_TYPE';              //退货商品编辑类型
export const TO_BUILD_REFUND_ORDER = 'TO_BUILD_REFUND_ORDER';            //构建退货订单
export const CLEAR_REFUND_DATA = 'CLEAR_REFUND_DATA';                    //清理退货信息
/************************* 退货相关 end! ***************************/


/************************* 店铺 店员相关 ****************************/
export const GET_SHIFT_USERS = 'GET_SHIFT_USERS';

/************************* 店铺 店员相关 end! ***********************/
