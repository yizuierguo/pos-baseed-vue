# pos:基于vue.js 2.0+的pos重构项目

## 前端环境相关:

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```

For detailed explanation on how things work, checkout the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).


## 项目人员:

>  前端:苏可 疯子 恺晨  一醉
>  后端:李牧 
>  交互/视觉:大v 张傲 


## 项目进度：

## 调试方法

```
        <!-- 调试 -->
        <el-dialog title="" v-model="debugdialog" size="small" :show-close="false" top="30%">
            <div class="no-top-border">
                <div><a>方法名：</a><input type="text" v-model="method"/></div>
                <div><a>参数（多个参数“|”分割）：</a><input type="text" v-model="param"/></div>
                <button type="button" @click="queryConfig">queryConfig</button>
                <button type="button" @click="updateConfig">updateConfig</button>
                <button type="button" @click="login">login</button>
                <button type="button" @click="queryPrintDeviceList">queryPrintDeviceList</button>
                <button type="button" @click="printContent">printContent</button>
                <button type="button" @click="showLedPrice">showLedPrice</button>
                <button type="button" @click="openCashBox">openCashBox</button>
                <button type="button" @click="payOrder">payOrder</button>
                <button type="button" @click="payProcessOrder">payProcessOrder</button>
                <button type="button" @click="login_close">login_close</button>
                <button type="button" @click="homePage_open">homePage_open</button>
                <button type="button" @click="homePage_close">homePage_close</button>
                <button type="button" @click="homePage_min">homePage_min</button>
                <button type="button" @click="processSwtich">processSwtich</button>
            </div>
        </el-dialog>


            //****************************** 调试方法 *********************************/
            queryConfig(){
                var result = JSON.parse(eleph.service.serviceApi_ConfigService_queryConfig());
                alert(result.status);
                alert(result.entry.gmtCreate);
            },

            updateConfig(){
                var configDO = {
                    "msgId": 1
                };
                var result = JSON.parse(eleph.service.serviceApi_ConfigService_updateConfig(JSON.stringify(configDO)));
                alert(result.status);
            },
            login(){
                var mobile = "12345678921";
                var password = "qwe123";
                var isSavePassword = "1";
                var resultString = eleph.service.serviceApi_UserService_login(mobile, password, isSavePassword);
                alert(resultString);
            },
            queryPrintDeviceList(){
                var resultString = eleph.service.serviceApi_PrintService_queryPrintDeviceList();
                alert(resultString);
            },
            printContent(){
                var content = "#{f1}我要打印\n#{f2}我要打印\n#{f3}我要打印#{f1}\n\n#{f3}我要打印\n\n\n\n";
                var resultString = eleph.service.serviceApi_PrintService_printContent(content);
                alert(resultString);
            }, showLedPrice(){
                var type = "1";
                var price = "1200";
                var resultString = eleph.service.serviceApi_PrintService_showLedPrice(type, price);
                alert(resultString);
            }, openCashBox(){
                var resultString = eleph.service.serviceApi_PrintService_openCashBox();
                alert(resultString);
            }

            , payOrder(){
                var accountId = "123";
                var bizOrder = "{\"actualPay\":\"7560\",\"bizOrderName\":\"商品名商品名商品名商品名商品名商品名商品名商品名商品名商品名商品名商品名商品名商品名商品名商品名商品名商品名商品名商品名商品名商品名商品名商品名商品名商品名商品名商品名商品名\",\"buyAmount\":\"5\",\"buyerId\":\"2132312\",\"buyerNick\":\"购买者名称\",\"cashierId\":\"1231231111111111111\",\"memberId\":\"32131312\",\"memberMobile\":\"18521504888\",\"memberNick\":\"\",\"orderType\":\"1\",\"originPrice\":\"8000\",\"remark\":\"备注备注\",\"totalPrice\":\"7560\",\"orderFundDOs\":[{\"fund\":\"7560\",\"fundType\":\"1\",\"platformSubsidy\":\"7560\",\"sellerSubsidy\":\"0\",\"shopId\":\"105300\"},{\"fund\":\"400\",\"fundType\":\"15\",\"platformSubsidy\":\"0\",\"sellerSubsidy\":\"400\"}],\"payTypeDOs\":[{\"actualPay\":7560,\"payQrCode\":\"1231231\",\"payType\":2,\"payTypeFund\":7560}],\"subBizOrderDOs\":[{\"barcode\":\"12331\",\"buyAmount\":\"2\",\"itemId\":\"1\",\"itemName\":\"商品名称\",\"itemOriginPrice\":\"1000\",\"itemPrice\":\"950\",\"totalPrice\":\"1900\",\"unit\":\"瓶\"},{\"barcode\":\"12331\",\"buyAmount\":\"3\",\"itemId\":\"1\",\"itemName\":\"商品名称\",\"itemOriginPrice\":\"2000\",\"itemPrice\":\"1900\",\"totalPrice\":\"5700\",\"unit\":\"瓶\"}]}";

                var resultString = eleph.service.serviceApi_PayService_payOrder(accountId, bizOrder);
                alert(resultString);
            }
            , payProcessOrder(){
                var payCode = this.param;
                var accountId = "123";
                var bizOrder = "{\"actualPay\":\"1\",\"bizOrderName\":\"商品名商品名商品名商品名商品名商品名商品名商品名商品名商品名商品名商品名商品名商品名商品名商品名商品名商品名商品名商品名商品名商品名商品名商品名商品名商品名商品名商品名商品名\",\"buyAmount\":\"2\",\"buyerId\":\"2132312\",\"buyerNick\":\"购买者名称\",\"cashierId\":\"1231231111111111111\",\"memberId\":\"32131312\",\"memberMobile\":\"18521504888\",\"memberNick\":\"\",\"orderType\":\"1\",\"originPrice\":\"2\",\"remark\":\"备注备注\",\"totalPrice\":\"1\",\"orderFundDOs\":[{\"fund\":\"1\",\"fundType\":\"1\",\"platformSubsidy\":\"1\",\"sellerSubsidy\":\"0\"},{\"fund\":\"1\",\"fundType\":\"14\",\"platformSubsidy\":\"0\",\"sellerSubsidy\":\"1\"}],\"payTypeDOs\":[{\"actualPay\":1,\"payQrCode\":\"" + payCode + "\",\"payType\":2,\"payFund\":1}],\"subBizOrderDOs\":[{\"barcode\":\"12331\",\"buyAmount\":\"1\",\"itemId\":\"1\",\"itemName\":\"商品名称\",\"itemOriginPrice\":\"1\",\"itemPrice\":\"1\",\"totalPrice\":\"1\",\"unit\":\"瓶\"},{\"barcode\":\"12331\",\"buyAmount\":\"1\",\"itemId\":\"1\",\"itemName\":\"商品名称\",\"itemOriginPrice\":\"1\",\"itemPrice\":\"1\",\"totalPrice\":\"1\",\"unit\":\"瓶\"}]}";

                var resultString = eleph.service.serviceApi_BizOrderTest_testPay(accountId, bizOrder);
                alert(resultString);
            }, login_close(){
                eleph.ui.login_close()();
            }
            , homePage_open(){
                eleph.ui.homePage_open();
            }
            , homePage_close(){
                eleph.ui.homePage_close();
            }
            , homePage_min(){
                eleph.ui.homePage_min();
            },
            processSwtich(){
                var method = this.method;
                var param = this.param;
                var resultString = eleph.service.serviceApi_ProcessSwtichTest_testProcessSwitch(method, param);
                alert(resultString);

            }
            //************************* 调试 **************************************/
```

