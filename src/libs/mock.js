/**
 * Created by yizui on 2017/3/14.
 * 作者：李绅
 * 春种一粒粟，秋成万颗子。四海无闲田，农夫犹饿死。
 * 锄禾日当午，汗滴禾下土。谁知盘中餐，粒粒皆辛苦。
 */
export default {
    queryItemByBarcode: function () {
        return {
            "status": true,
            "responseCode": 0,
            "message": "成功",
            "entry": [{
                "activityTags": "0",
                "barcode": "6921168509254",
                "bigPicUrl": "n/12/14/1481685845516_7979.jpg",
                "brand": "农夫山泉",
                "buyLimit": "",
                "catId": "160",
                "gmtCreate": "1490871076",
                "gmtModify": "1490871076",
                "isDelete": "0",
                "itemCenterGmtCreate": "1488887527",
                "itemCenterGmtModify": "1490434789",
                "itemId": "100217002",
                "itemName": "饮用天然水饮用天然水无法违法",
                "memberPrice": "1000",
                "price": "1200",
                "msrp": "",
                "picUrls": "n/10/28/1446012919287_9393.jpg",
                "productionDate": "0",
                "promotionEndTime": "1490434789",
                "promotionPrice": "0",
                "promotionStartTime": "1490434789",
                "promotionStatus": "0",
                "property": "550ml",
                "quantity": "-4",
                "shelfLife": "",
                "spuId": "1466",
                "status": "10",
                "type": "0",
                "unit": "瓶",
                "createType": "2",
                "isCommonItem": "0",
                "attributeCc": "0",
                "attributes": ""
             }
            ]
        }
    },
    deleteItemById: function () {
        return {
            "entry": {},
            "message": "操作成功",
            "responseCode": 47710,
            "status": true
        }
    },
    getVipInfo: function () {
        return {
            "emptyIdentifier": 1,
            "entry": {
                "accountId": 29,
                "attributeMap": {},
                "attributes": "",
                "balance": 231488,
                "discount": 95,
                "hasPassword": true,
                "hasSavingsAccount": true,
                "isAllowMemberPrice": true,
                "isAllowSdgMember": false,
                "isShopMember": true,
                "memberId": 34,
                "mobile": "13738034030",
                "name": "闪电购客户",
                "shopId": 5473
            },
            "message": "成功!",
            "responseCode": 0,
            "status": true
        }
    },
    getShiftUsers: function () {
        return {
            "entry": [
                {
                    "attributeCc": "30",
                    "attributes": "",
                    "city": "杭州",
                    "gmtCreate": "1489990431",
                    "gmtModify": "1490069023",
                    "lastLoginTime": "1489990431",
                    "level": "200",
                    "mobile": "13819174647",
                    "password": "qwe123",
                    "realName": "",
                    "userId": "2235915"
                },
                {
                    "attributeCc": "30",
                    "attributes": "",
                    "city": "杭州",
                    "gmtCreate": "1489990431",
                    "gmtModify": "1490069023",
                    "lastLoginTime": "1489990431",
                    "level": "200",
                    "mobile": "13819174647",
                    "password": "qwe123",
                    "realName": "哈哈",
                    "userId": "2235914"
                },
                {
                    "attributeCc": "30",
                    "attributes": "",
                    "city": "杭州",
                    "gmtCreate": "1489990431",
                    "gmtModify": "1490069023",
                    "lastLoginTime": "1489990431",
                    "level": "200",
                    "mobile": "13819174647",
                    "password": "qwe123",
                    "realName": "一醉的测试店铺的闪电侠",
                    "userId": "2235913"
                }, {
                    "attributeCc": "30",
                    "attributes": "",
                    "city": "杭州",
                    "gmtCreate": "1489990431",
                    "gmtModify": "1490069023",
                    "lastLoginTime": "1489990431",
                    "level": "200",
                    "mobile": "13819174647",
                    "password": "qwe123",
                    "realName": "tom",
                    "userId": "2235912"
                }
            ],
            "message": "操作成功",
            "responseCode": 0,
            "status": true
        }
    },
    goShift: function () {
        return {
            "entry": {
                "alipayPrice": 0,
                "attributeCc": "0",
                "attributes": "",
                "bankCardPrice": 0,
                "cashPrice": 0,
                "cityZenCardPrice": 0,
                "gmtCreate": "1490164699",
                "id": "3",
                "invoicePrice": 0,
                "nextUserId": "126397724",
                "nextUserName": "来了",
                "savingsCardPrice": 0,
                "sequence": "0",
                "totalItemAmount": 1,
                "totalOrderAmount": 1,
                "totalPrice": "",
                "userId": "2235916",
                "userName": "樊少mm",
                "weixinPrice": 0
            },
            "message": "默认错误",
            "responseCode": 0,
            "status": true
        }
    },
    queryLoginUserInfo: function () {
        return {
            "entry": {
                "loginType": 1,
                "mobile": "18521504883",
                "realName": "小和山老板",
                "userId": 2235912
            },
            "message": "默认错误",
            "responseCode": 0,
            "status": true
        }
    },
    unlockpos: function () {
        return {
            "entry": {},
            "message": "成功!",
            "responseCode": 0,
            "status": true
        }
    },
    getShopInfo: function () {
        return {
            "entry": {
                "attributeCc": "2",
                "attributes": "",
                "cookies": [
                    "_nss=1784e675fe57d3e6543a7651bd9b54aa;Domain=daily.52shangou.com;Path=/;Expires=Wed, 12-Apr-2017 12:14:20 GMT;",
                    "_uk=105300;Domain=.52shangou.com;Path=/;Expires=Mon, 09-Oct-2017 12:14:20 GMT;",
                    "_uk=105300;Domain=daily.52shangou.com;Path=/;Expires=Thu, 01-Jan-1970 00:00:00 GMT;",
                    "redcat_user_seller_mobile=18521504883;Domain=daily.52shangou.com;Path=/;Expires=Wed, 12-Apr-2017 12:14:20 GMT;"
                ],
                "gmtCreate": "1489406828",
                "gmtModify": "1489407394",
                "id": "1",
                "isOnlineOrder": "1",
                "isPrintWhenCount": "1",
                "isRegister": "0",
                "isSyncOnlineItemPrice": "0",
                "itemSyncTime": "",
                "ledDriverNames": {},
                "msgId": "0",
                "newItemNum": "",
                "nextVersion": "0.0.25",
                "printMargin": "0",
                "printerDriver": "",
                "printerDriverPath": "",
                "printerType": "1",
                "registerCode": "73b631740fc7c208",
                "sequence": "0",
                "shopAddress": "",
                "shopId": "4645",
                "shopName": "pos测试店铺",
                "version": "0.0.25",
                "vioceFlag": "1"
            },
            "message": "哈哈哈",
            "responseCode": 0,
            "status": true
        }
    },
    getReportInfo: function () {
        return {
            "entry": {
                "alipayPrice": 46887,
                "bankCardPrice": 1,
                "cashPrice": 1876,
                "cityZenCardPrice": 100,
                "gmtCreate": "1490756697528",
                "invoicePrice": 12991,
                "memberId": "",
                "savingsCardPrice": 2800,
                "sequence": "12",
                "totalItemAmount": "1",
                "totalOrderAmount": 108,
                "totalPrice": 270634,
                "userId": 2235916,
                "userName": "樊少mm",
                "weixinPrice": 1834
            },
            "message": "默认错误",
            "responseCode": 0,
            "status": true
        }
    },
    login: function () {
        return {
            "entry": {
                "attributeCc": "0",
                "attributes": "",
                "cookies": [
                    "_nss=56e3ee723fb8c381df9643f35e389a3b;Domain=daily.52shangou.com;Path=/;Expires=Wed, 12-Apr-2017 12:05:11 GMT;",
                    "_uk=105300;Domain=.52shangou.com;Path=/;Expires=Mon, 09-Oct-2017 12:05:11 GMT;",
                    "_uk=105300;Domain=daily.52shangou.com;Path=/;Expires=Thu, 01-Jan-1970 00:00:00 GMT;",
                    "redcat_user_seller_mobile=18521504883;Domain=daily.52shangou.com;Path=/;Expires=Wed, 12-Apr-2017 12:05:11 GMT;"
                ],
                "gmtCreate": "1489406828",
                "gmtModify": "1489406845",
                "id": "1",
                "isOnlineOrder": "1",
                "isPrintWhenCount": "1",
                "isRegister": "0",
                "isSyncOnlineItemPrice": "0",
                "itemSyncTime": "",
                "ledDriverNames": {},
                "loginType": "1",
                "msgId": "0",
                "newItemNum": "",
                "nextVersion": "0.0.25",
                "printMargin": "0",
                "printerDriver": "",
                "printerDriverPath": "",
                "printerType": "1",
                "registerCode": "73b631740fc7c208",
                "sequence": "0",
                "shopAddress": "",
                "shopId": "4645",
                "shopName": "闪电购(测试店111店)",
                "version": "0.0.25",
                "vioceFlag": "1"
            },
            "message": "登录成功",
            "responseCode": 0,
            "status": true
        }
    },
    queryLoginUserList:function() {
        return {
            "entry": [
                {
                    "attributeCc": "7",
                    "attributes": {
                        "isSavePassword": "1"
                    },
                    "city": "杭州",
                    "gmtCreate": "1489748212",
                    "gmtModify": "1489748811",
                    "lastLoginTime": "1489748212",
                    "level": "200",
                    "mobile": "12345678921",
                    "password": "123456789",
                    "realName": "樊少mm",
                    "userId": "2235916"
                },
                {
                    "attributeCc": "7",
                    "attributes": {
                        "isSavePassword": "1"
                    },
                    "city": "杭州",
                    "gmtCreate": "1489748212",
                    "gmtModify": "1489748811",
                    "lastLoginTime": "1489748212",
                    "level": "200",
                    "mobile": "98765432100",
                    "password": "123456789",
                    "realName": "樊少mm",
                    "userId": "2235916"
                },
                {
                    "attributeCc": "7",
                    "attributes": {
                        "isSavePassword": "1"
                    },
                    "city": "杭州",
                    "gmtCreate": "1489748212",
                    "gmtModify": "1489748811",
                    "lastLoginTime": "1489748212",
                    "level": "200",
                    "mobile": "18352963126",
                    "password": "123456789",
                    "realName": "樊少mm",
                    "userId": "2235916"
                },
                {
                    "attributeCc": "7",
                    "attributes": {
                        "isSavePassword": "0"
                    },
                    "city": "杭州",
                    "gmtCreate": "1489748212",
                    "gmtModify": "1489748811",
                    "lastLoginTime": "1489748212",
                    "level": "200",
                    "mobile": "789321654",
                    "password": "123456789",
                    "realName": "樊少mm",
                    "userId": "2235916"
                }
            ],
            "status": true
        }
    },
    queryPrintDeviceList: {
        "entry": [
            {
                "printDeviceName": "USB1",
                "printDevicePath": "\\?\\usb#vid_0fe6&pid_811e#5&236b55b3&0&3#{a5dcbf10-6530-11d2-901f-00c04fb951ed}",
                "printDeviceType": "1"
            },
            {
                "printDeviceName": "USB1",
                "printDevicePath": "\\?\\usb#vid_0fe6&pid_811e#5&236b55b3&0&3#{a5dcbf10-6530-11d2-901f-00c04fb951ed}",
                "printDeviceType": "1"
            },
            {
                "printDeviceName": "USB1",
                "printDevicePath": "\\?\\usb#vid_0fe6&pid_811e#5&236b55b3&0&3#{a5dcbf10-6530-11d2-901f-00c04fb951ed}",
                "printDeviceType": "1"
            },
            {
                "printDeviceName": "USB1",
                "printDevicePath": "\\?\\usb#vid_0fe6&pid_811e#5&236b55b3&0&3#{a5dcbf10-6530-11d2-901f-00c04fb951ed}",
                "printDeviceType": "1"
            },
            {
                "printDeviceName": "USB1",
                "printDevicePath": "\\?\\usb#vid_0fe6&pid_811e#5&236b55b3&0&3#{a5dcbf10-6530-11d2-901f-00c04fb951ed}",
                "printDeviceType": "1"
            },
            {
                "printDeviceName": "USB1",
                "printDevicePath": "\\?\\usb#vid_0fe6&pid_811e#5&236b55b3&0&3#{a5dcbf10-6530-11d2-901f-00c04fb951ed}",
                "printDeviceType": "1"
            }
        ],
        "message": "",
        "responseCode": 0,
        "status": true
    },
    //保存配置信息
    updateConfig: function () {
        return {
            "message": "保存成功",
            "responseCode": 0,
            "status": true
        }
    },
    //查询订单
    getOrderByRuler: function () {
        return {
            "entry": [
                {
                    "actualPay": "21000",
                    "bizOrderId": "1",
                    "bizOrderName": "新升级草木纯品",
                    "buyAmount": "2",
                    "buyerId": "0",
                    "buyerNick": "未知",
                    "cashierId": "2235916",
                    "gmtCreate": "1491381638",
                    "gmtModify": "1491381638",
                    "memberId": "0",
                    "memberMobile": "",
                    "memberNick": "",
                    "onlineBizOrderId": "",
                    "orderType": "1",
                    "originPrice": "20000",
                    "registerCode": "9",
                    "remark": "",
                    "sequence": "8",
                    "shopId": "5473",
                    "shopName": "樊少的店铺",
                    "status": "2",
                    "totalPrice": "20000",
                    "orderFundList": [
                        {
                            "bizOrderId": "1",
                            "cashierId": "2235916",
                            "fund": "20000",
                            "fundType": "1",
                            "gmtCreate": "1491381638",
                            "id": "1",
                            "platformSubsidy": "21000",
                            "sellerSubsidy": "0",
                            "shopId": "5473",
                            "attributeCc": "0",
                            "attributes": ""
                        }
                    ],
                    "payTypeList": [
                        {
                            "actualPay": "21000",
                            "bizOrderId": "1",
                            "cashierId": "2235916",
                            "gmtCreate": "1491381638",
                            "gmtModify": "1491381638",
                            "id": "1",
                            "onlineBizOrderId": "",
                            "payFund": "20000",
                            "payId": "",
                            "payQrCode": "",
                            "payStatus": "2",
                            "payTime": "",
                            "payType": "1",
                            "registerCode": "9",
                            "attributeCc": "0",
                            "attributes": ""
                        }
                    ],
                    "subBizOrderList": [
                        {
                            "barcode": "6922266440090",
                            "bizOrderId": "1",
                            "buyAmount": "2",
                            "cashierId": "2235916",
                            "gmtCreate": "1491381638",
                            "gmtModify": "1491381638",
                            "itemId": "5529896",
                            "itemName": "新升级草木纯品",
                            "itemOriginPrice": "10000",
                            "itemPrice": "",
                            "subBizOrderId": "1",
                            "totalPrice": "",
                            "unit": "袋",
                            "attributeCc": "0",
                            "attributes": ""
                        }
                    ],
                    "attributeCc": "0",
                    "attributes": ""
                }
            ],
            "message": 1,
            "responseCode": 1,
            "status": true
        }
    },
    createOnlineItem:function () {
        return {
            "status": true,
            "responseCode": 0,
            "message": "成功",
            "entry": [
                {
                    "activityTags": "",
                    "barcode": "6921168509254",
                    "bigPicUrl": "",
                    "brand": "",
                    "buyLimit": "",
                    "catId": "",
                    "gmtCreate": "",
                    "gmtModify": "",
                    "isDelete": "",
                    "itemCenterGmtCreate": "",
                    "itemCenterGmtModify": "",
                    "itemId": "100258801",
                    "itemName": "",
                    "memberPrice": "",
                    "msrp": "",
                    "picUrls": "",
                    "price": "",
                    "productionDate": "",
                    "promotionEndTime": "",
                    "promotionPrice": "",
                    "promotionStartTime": "",
                    "promotionStatus": "",
                    "property": "",
                    "quantity": "",
                    "shelfLife": "",
                    "spuId": "",
                    "status": "",
                    "type": "",
                    "unit": "",
                    "createType": "1",
                    "isCommonItem": "0",
                    "attributeCc": "0",
                    "attributes": ""
                },
                {
                    "activityTags": "",
                    "barcode": "7318690054171",
                    "bigPicUrl": "",
                    "brand": "",
                    "buyLimit": "",
                    "catId": "",
                    "gmtCreate": "",
                    "gmtModify": "",
                    "isDelete": "",
                    "itemCenterGmtCreate": "",
                    "itemCenterGmtModify": "",
                    "itemId": "100258802",
                    "itemName": "",
                    "memberPrice": "",
                    "msrp": "",
                    "picUrls": "",
                    "price": "",
                    "productionDate": "",
                    "promotionEndTime": "",
                    "promotionPrice": "",
                    "promotionStartTime": "",
                    "promotionStatus": "",
                    "property": "",
                    "quantity": "",
                    "shelfLife": "",
                    "spuId": "",
                    "status": "",
                    "type": "",
                    "unit": "",
                    "createType": "1",
                    "isCommonItem": "0",
                    "attributeCc": "0",
                    "attributes": ""
                }
            ]
        }
    },
    //查询最近一次交班数据
    queryLastShiftHandover:function () {
        return {
            "entry": [
                {
                    "attributeCc": 1,
                    "attributes": 1,
                    "bankCardPrice": 85032,
                    "cashPrice": 40631,
                    "cityZenCardPrice": 83884,
                    "gmtCreate": 1491618048918,
                    "id": 18064,
                    "invoicePrice": 62267,
                    "nextUserId": 37024,
                    "nextUserName": "测试内容8957",
                    "savingsCardPrice": 11651,
                    "sequence": 1,
                    "totalItemAmount": 61402,
                    "totalOrderAmount": 82260,
                    "totalPrice": 57233,
                    "userId": 14500,
                    "userName": "测试内容c13b",
                    "weixinPrice": 20788,
                    "alipayPrice": "3999"
                }
            ],
            "message": "message",
            "responseCode": "responseCode",
            "status": true
        }
    },
    payOrder:function () {
        return {
            "entry": "333",
            "message": "支付成功!",
            "responseCode": "400",
            "status": true
        }
    },
    //支付宝是否授权过
    isBindAlipayAccount:function () {
        return {
            "entry": {
                "appAuthToken": "201703BB92f55ef552384d0bb11337c6f3da8X33",
                "appRefreshToken": "201703BBd6b16dc4f4594d748e9773705c6a6X33",
                "attributeCc": 6,
                "attributes": "",
                "authAppId": "2017010704917118",
                "expiresIn": 31536000,
                "gmtCreate": 1490858819000,
                "id": 20,
                "reExpiresIn": 32140800,
                "shopId": 5473,
                "userId": "2088102649611332"
            },
            "message": "操作成功",
            "responseCode": 1,
            "status": true
        }
    }
}