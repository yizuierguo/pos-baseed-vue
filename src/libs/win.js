/*
 * @info:同客户端通信的方法统一放在这里
 * @ex:{
 *    win.register.close();
 * }
 **/

import MOCK from './mock'; //模拟数据

export default {
    //登录
    login: function (mobile, password, isSavePassword) {
        try {
            if (window.debug) {
                return JSON.stringify(MOCK.login());
            }
            return JSON.parse(eleph.service.serviceApi_UserService_login(String(mobile), String(password), String(isSavePassword)));
        } catch (e) {

        }
    },
    //登录用户列表
    queryLoginUserList: function () {
        try {
            if (window.debug){
                return MOCK.queryLoginUserList();
            }
            return JSON.parse(eleph.service.serviceApi_UserService_queryAllUserList());
        } catch (e) {

        }
    },
    //查询打印列表
    queryPrintDeviceList: function () {
        try {
            if (window.debug) {
                return JSON.stringify(MOCK.queryPrintDeviceList());
            }
            return JSON.parse(eleph.service.serviceApi_PrintService_queryPrintDeviceList());
        } catch (e) {
            console.log(e);
        }
    },
    //保存配置信息
    updateConfig: function (cfg) {
        try {
            if (window.debug) {
                return JSON.stringify(MOCK.updateConfig());
            }
            return JSON.parse(eleph.service.serviceApi_ConfigService_updateConfig(JSON.stringify(cfg)));
        } catch (e) {
            console.log(e);
        }
    },
    //根据条形码请求商品
    queryItemByBarcode: function (barcode) {
        try {
            if (window.debug) {
                return MOCK.queryItemByBarcode();
            }
            return JSON.parse(eleph.service.serviceApi_ItemService_queryItemByBarcode(barcode));
        } catch (e) {

        }
    },
    //根据商品ids删除商品
    deleteItemById: function (ids) {
        try {
            if (window.debug) {
                return MOCK.deleteItemById();
            }
            return JSON.parse(eleph.service.serviceApi_ItemService_deleteItem(ids));
        } catch (e) {

        }
    },
    //根据会员卡号手机号搜索会员信息
    getVipInfo: function (mobile) {
        try {
            if (window.debug) {
                return MOCK.getVipInfo();
            }
            return JSON.parse(eleph.service.serviceApi_MemberService_queryMember(mobile));
        } catch (e) {

        }
    },
    //创建订单
    payOrder: function (accountId,bizOrderObj) {
        try {
            if (window.debug) {
                return MOCK.payOrder();
            }
            return JSON.parse(eleph.service.serviceApi_PayService_payOrder(String(accountId),JSON.stringify(bizOrderObj)));
        } catch (e) {

        }
    },
    //取消订单
    cancelOrder:function (bizOrderId) {
        try {
            return JSON.parse(eleph.service.serviceApi_PayService_cancelPay(String(bizOrderId)));
        } catch (e) {

        }
    },
    //轮询支付状态
    loopCheckPayStatus:function (bizOrderId) {
        try {
            if (window.debug) {
                return MOCK.payOrder();
            }
            return JSON.parse(eleph.service.serviceApi_PayService_checkPayStatus(String(bizOrderId)));
        } catch (e) {

        }
    },
    //最小化窗口
    miniWin: function () {
        try {
            eleph.ui.homePage_min();
        } catch (e) {

        }
    },
    //交班会员
    getShiftUsers: function () {
        try {
            if (window.debug) {
                return MOCK.getShiftUsers();
            }
            return JSON.parse(eleph.service.serviceApi_ShiftHandoverService_getShiftUsers());
        } catch (e) {

        }
    },
    //进行交班
    goShift: function (mobile,password) {
        try {
            if (window.debug) {
                return MOCK.goShift();
            }
            return JSON.parse(eleph.service.serviceApi_ShiftHandoverService_shift(mobile,password));
        } catch (e) {

        }
    },
    //查询登录用户信息
    queryLoginUserInfo: function () {
        try {
            if (window.debug) {
                return MOCK.queryLoginUserInfo();
            }
            return JSON.parse(eleph.service.serviceApi_UserService_queryLoginUserInfo());
        } catch (e) {

        }
    },
    //解锁
    unlockpos: function (password) {
        try {
            if (window.debug) {
                return MOCK.unlockpos();
            }
            return JSON.parse(eleph.service.serviceApi_LockedService_unlock(password));
        } catch (e) {

        }
    },
    //店铺信息
    getShopInfo: function () {
        try {
            if (window.debug) {
                return MOCK.getShopInfo();
            }
            return JSON.parse(eleph.service.serviceApi_ConfigService_queryConfig());
        } catch (e) {

        }
    },
    //获取营收信息
    getReportInfo: function () {
        try {
            if (window.debug) {
                return MOCK.getReportInfo();
            }
            return JSON.parse(eleph.service.serviceApi_EarningsService_getEarning());
        } catch (e) {

        }
    },
    //订单查询
    getOrderByRuler:function (params) {
        try {
            if (window.debug) {
                return MOCK.getOrderByRuler();
            }
            return JSON.parse(eleph.service.serviceApi_BizOrderService_queryBizOrderWithSubOrderByCondition(params));
        } catch (e) {

        }
    },
    //更新商品价格
    updateItemPrice:function (itemId,price) {
        try {
            return JSON.parse(eleph.service.serviceApi_ItemService_updateItemPrice(String(itemId),String(price)));
        } catch (e) {

        }
    },
    //创建线上商品
    createOnlineItem:function (itemObj) {
        try {
            if (window.debug) {
                return MOCK.createOnlineItem();
            }
            return JSON.parse(eleph.service.serviceApi_ItemService_createItemForNewItem(JSON.stringify(itemObj)));
        } catch (e) {
            console.log(e);
        }
    },
    //获取打印班次小票数据
    queryLastShiftHandover:function () {
        try {
            if (window.debug) {
                return MOCK.queryLastShiftHandover();
            }
            return JSON.parse(eleph.service.serviceApi_ShiftHandoverService_getPrintShiftReceiptData());
        } catch (e) {
            console.log(e);
        }
    },
    //判断支付宝是否授权过
    isBindAlipayAccount: function () {
        try {
            if (window.debug) {
                return MOCK.isBindAlipayAccount();
            }
            return JSON.parse(eleph.service.serviceApi_PayService_isBindAlipayAccount());
        } catch (e) {
            console.log(e);
        }
    }
}