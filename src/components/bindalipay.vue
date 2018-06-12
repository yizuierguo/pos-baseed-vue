<template>
    <div>
        <div v-if="getShowBindAlipay" class="bindAlipay">
            <h2>支付宝授权</h2>
            <div class="authentication" v-if="bindStatus == '1'">
                <div class="code">
                    <input maxlength="4" class="mobileCode" v-model="code" type="tel" name="" placeholder="验证码">
                    <span v-if="codeSendDelay > 0" class="getMobileCode textGray">{{ getCodeText }}</span>
                    <span v-else class="getMobileCode" @click="getMobileCode">{{ getCodeText }}</span>
                </div>
                <div v-if="code.length == 4" class="next nextNow" @click="checkCode">下一步</div>
                <div v-else class="next">下一步</div>
            </div>
            <div v-else-if="bindStatus == '2'" class="bindCentent">
                <div class="left">
                    <h3>扫码授权</h3>
                    <div ref="J_QRcodeImg" class="QRcodeImg"></div>
                    <div v-if="isQRcodeEffective">请使用支付宝扫码授权</div>
                    <div v-else @click="getGaveUrl">二维码已失效，点击更新二维码</div>
                </div>
                <div class="right">
                    <h3>授权帮助</h3>
                    <div class="helpCentent">
                        <span>1、打开手机，使用支付宝扫一扫，扫描二维码</span>
                        <img src="http://imgsize.52shangou.com/img/n/01/10/1483978410760_6142.png">
                        <span>2、扫码后，点击“确认授权”</span>
                        <img src="http://imgsize.52shangou.com/img/n/01/10/1483978415629_916.png">
                    </div>
                </div>
            </div>
            <div v-else-if="bindStatus == '3'" class="bindOK">
                <div class="icon"></div>
                <div class="text1">支付宝绑定成功</div>
                <div class="text2">恭喜，您可以使用支付宝收款了</div>
            </div>
            <div v-else-if="bindStatus == '4'" class="bindFailHelp">
                <h2>开通失败帮助</h2>
                <div class="helpCentent">
                    <span>若您开通时出现如下“开通失败”，很抱歉！您当前的支付宝账号可能已有使用中或签约中的其他收款产品</span>
                    <img src="http://imgsize.52shangou.com/img/n/03/23/1490253474419_8722.png">
                    <span>您可以：</span>
                    <span>1、尝试使用其他支付宝账号重新帮助如您的配偶、合伙人、朋友等值得信赖的人的支付宝账号</span>
                    <span class="refresh J_refresh">更换支付宝账号重绑</span>
                    <span>2、如没有合适的支付宝账号，您需要联系支付宝，改签收款产品。请拨打电话：0571 - 88158090，按3联系人工客服。告知客服
「目前自己的支付宝签约的其他收款产品，没有办法签约当面付，需要解约目前绑定的收单产品</span>
                    <span>3、如以上方式都无法解决，您可以联系小象掌柜0571-86100014，我们会尽力帮您解决问题。</span>
                </div>
            </div>
            <div v-else-if="bindStatus == '5'" class="checkBind">
                <div class="left">
                    <h3>已开通收款？</h3>
                    <div class="checkTips">检测下是否已绑定成功</div>
                    <div class="checkBtn" @click="checkAlipayBindInfo('manual')">检查绑定</div>
                    <div class="bindFailHelp" @click="modifyBindStatus('4')">开通失败帮助</div>
                </div>
                <div class="right">
                    <h3>开通操作说明</h3>
                    <div class="helpCentent">
                        <span>1、点击“立即开通”，进行签约操作</span>
                        <img src="http://imgsize.52shangou.com/img/n/03/23/1490253314616_5799.png">
                        <span>2、填写店铺地址</span>
                        <img src="http://imgsize.52shangou.com/img/n/01/10/1483978421878_2813.png">
                        <span>3、提交后，出现如下页面即授权成功。您可在小象掌柜查看支付宝账号绑定结果！</span>
                        <img src="http://imgsize.52shangou.com/img/n/01/10/1483978424762_7951.png">
                    </div>
                </div>
            </div>
            <div v-else-if="bindStatus == '0'" class="bindFail">
                <div class="icon"></div>
                <div class="text1">抱歉，绑定失败</div>
                <div class="text2">您可能已有使用中或签约中的其他收款产品</div>
                <div class="help">
                    <div>* 如您未开通收款。<span @click="modifyBindStatus('1')">立即开通</span></div>
                    <div>* 如开通中支付宝提示“开通失败”。<span @click="modifyBindStatus('4')">查看失败帮助</span></div>
                </div>
            </div>
            <div class="close" @click="close"></div>
        </div>
        <div v-if="getShowBindAlipay" class="shade"></div>
    </div>
</template>
<script>
    import {mapGetters} from 'vuex';
    import Util from '../libs/util';
    import Win from '../libs/win';
    export default{
        data(){
            return {
                show: true,
                bindStatus: '1',//绑定进度(1、短信验证，2、扫码授权及签约，3、绑定成功，4、开通失败帮助，5、手动检测绑定，0、绑定失败)
                codeSendDelay: '0',
                getCodeText: '获取',
                bindingId: '',
                G_COUNT: null,
                TIMER: 120,//轮询次数
                bindAliPayStatus: false,
                code: '',
                isQRcodeEffective: true//二维码是否有效
            }
        },
        computed: {
            ...mapGetters([
                'getShowBindAlipay'
            ]),
        },
        methods: {
            getdomain: function (type) {
                var host = document.domain;
                if (host.indexOf('www') != -1 || host.indexOf('h5.m') != -1) {
                    if (type == 'ajax') {
                        return 'http://www.52shangou.com'
                    } else {
                        return 'http://h5.m.52shangou.com'
                    }
                }
                else if (host.indexOf('daily') != -1 || host.indexOf('localhost') != -1 || host.indexOf('dev') != -1) {
                    if (type == 'ajax') {
                        return 'http://daily.52shangou.com'
                    } else {
                        return 'http://daily.m.52shangou.com'
                    }
                }
                else if (host.indexOf('gray') != -1) {
                    if (type == 'ajax') {
                        return 'http://gray.52shangou.com'
                    } else {
                        return 'http://gray.m.52shangou.com'
                    }
                }
            },
            //获取验证码
            getMobileCode: function () {
                var self = this;
                lib.ajax({
                    url: self.getdomain('ajax') + '/poscrm/zg/send_alipay_binding_sms_auth_code.do',
                    isEncrypt: true,
                    dataType: 'json',
                    xhrFields: {
                        withCredentials: true,
                    },
                    success: function (data) {
                        if (data && data.status) {
                            self.codeSendDelay = 60;
                            self.reloadSend();
                            Util.toast(data.message, 'notice', 2000)
                        }
                        else {
                            Util.toast(data.message, 'notice', 2000)
                        }
                    },
                    error: function (xhr, errorType, error) {
                        var data;
                        if (xhr && xhr.responseText) {
                            data = JSON.parse(xhr.responseText);
                            Util.toast(data.message, 'notice', 2000)
                        }
                        if (errorType == 'timeout') {
                            Util.toast('忙坏了,请稍后再试', 'notice', 2000)
                        }
                        else {
                            Util.toast(data.message, 'notice', 2000)
                        }
                    }
                });
            },
            //短信发送倒计时
            reloadSend: function () {
                var self = this;
                this.codeSendDelay = this.codeSendDelay - 1;
                if (this.codeSendDelay > 0) {
                    this.getCodeText = this.codeSendDelay + '秒后重发';
                    setTimeout(self.reloadSend, 1000);
                }
                else {
                    this.getCodeText = '重发';
                }
            },
            //check手机验证码
            checkCode: function () {
                var self = this;
                lib.ajax({
                    url: self.getdomain('ajax') + '/poscrm/zg/verify_alipay_binding_sms_auth_code.do',
                    data: {
                        auth_code: self.code
                    },
                    type: 'POST',
                    dataType: 'json',
                    xhrFields: {
                        withCredentials: true,
                    },
                    success: function (data) {
                        if (data.status) {
                            self.bindStatus = '2';
                            self.getGaveUrl();
                        }
                        else {
                            console.log(data.messages)
                        }
                    },
                    timeout: 10000,
                    error: function (xhr, errorType, error) {
                        var data;
                        if (xhr && xhr.responseText) {
                            data = JSON.parse(xhr.responseText);
                        }
                        if (errorType == 'timeout') {
                            Util.toast('忙坏了，请稍后再试', 'notice', 2000);
                        } else {
                            Util.toast(data.message, 'notice', 2000);
                            // toast('网络连接失败','请稍后再试');
                        }
                    }
                });

            },
            //绑定支付宝需要先获取第三方授权链接
            getGaveUrl: function () {
                var self = this;
                self.isQRcodeEffective = true;
                lib.ajax({
                    url: self.getdomain('ajax') + '/poscrm/zg/gen_alipay_app2app_auth_redirect_url.do',
                    data: {},
                    dataType: 'json',
                    xhrFields: {withCredentials: true},
                    success: function (data) {
                        if (data.status) {
                            if (data.entry.redirect_url) {
                                debugger
                                self.QRcode(data.entry.redirect_url);
                                self.bindingId = data.entry.binding_id;
                                console.log(data);
                            }
                            self.checkBindStatus();
                            console.log(data.message)
                        }
                        else {
                            alert(data)
                        }
                    },
                    timeout: 10000,
                    error: function (xhr, errorType, error) {
                        var errorData = JSON.parse(xhr.responseText);
                        if (errorData && !errorData.status) {
                            console.log(errorData.message)
                        }
                    }
                });
            },
            //轮询绑定状态
            checkBindStatus: function () {
                var self = this;
                this.G_COUNT = setInterval(function () {
                    self.checkAlipayBindInfo();
                    if (self.TIMER <= 0 || self.bindStatus == '3') {
                        console.log('失效');
                        self.isQRcodeEffective = false;
                        clearInterval(self.G_COUNT);
                        return;
                    }
                    self.TIMER--;
                }, 5000);
            },
            //check支付宝是否绑定成功
            checkAlipayBindInfo: function (type) {
                var self = this;
                //type == 'manual' 手动检查绑定
                if (type == 'manual') {
                    self.TIMER = '0';
                }
                lib.ajax({
                    url: self.getdomain('ajax') + '/poscrm/zg/check_ongoing_alipay_binding_status.do',
                    data: {
                        binding_id: self.bindingId
                    },
                    dataType: 'json',
                    xhrFields: {
                        withCredentials: true,
                    },
                    success: function (data) {
                        if (data && data.status) {
                            if (type == 'manual') {
                                if (data.entry.alipay_auth_success && data.entry.alipay_sign_success) {
                                    self.bindStatus = '3';
                                    console.log('支付宝授权成功且签约成功')
                                }
                                else {
                                    self.bindStatus = '0';
                                }
                            }
                            //支付宝授权成功且签约成功
                            if (data.entry.alipay_auth_success && data.entry.alipay_sign_success) {
                                self.bindStatus = '3';
                                console.log('支付宝授权成功且签约成功')
                            }
                            //支付宝授权成功但签约失败
                            else if (data.entry.alipay_auth_success && !data.entry.alipay_sign_success) {
                                clearInterval(self.G_COUNT);
                                console.log('支付宝授权成功但签约失败')
                            }
                            else if (!data.entry.alipay_auth_success && data.entry.alipay_sign_success) {
                                localStorage.setItem('bindOK', 'error');
                                console.log('token失效')
                            }
                            else {
                                console.log('支付宝授权失败')
                            }
                        }
                        else {
                            console.log(data.message);
                        }
                    },
                    timeout: 10000,
                    error: function (xhr, errorType, error) {
                        var data;
                        if (xhr && xhr.responseText) {
                            data = JSON.parse(xhr.responseText);
                        }
                        if (errorType == 'timeout') {
                            Util.toast('忙坏了，请稍后再试', 'notice', 2000);
                        } else {
                            Util.toast(data.message, 'notice', 2000);
                            // toast('网络连接失败','请稍后再试');
                        }
                    }
                })
            },
            //生成二维码
            QRcode: function (url) {
                this.$refs.J_QRcodeImg.innerHTML = '';
                var qrcode = new QRCode(this.$refs.J_QRcodeImg, {
                    width: 180,//设置宽高
                    height: 180
                });
                setTimeout(qrcode.makeCode(url), 5000);
//                qrcode.makeCode(url);
            },
            close: function () {
                this.$store.dispatch('setShowBindAlipay');
                console.log('取消')
            },
            modifyBindStatus: function (type) {
                this.bindStatus = type;
            }
        }
    }
</script>
<style lang="less" rel="stylesheet/less" scoped>
    div, li, span, i, p, h1, h2, input {
        box-sizing: border-box;
    }

    .shade {
        position: fixed;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        z-index: 100;
        background: rgba(0, 0, 0, .4);
    }

    /**支付宝授权**/
    .bindAlipay {
        width: 750px;
        height: 600px;
        margin-top: -300px;
        margin-left: -375px;
        padding: 40px 49px 31px;
        background: #fff;
        position: absolute;
        top: 50%;
        left: 50%;
        z-index: 1000;
        border-radius: 4px;
        text-align:center;
        font-size: 16px;
        z-index: 102;
        h2 {
            font-weight: normal;
            font-size: 18px;
        }
        .authentication {
            width: 440px;
            margin: 185px auto 0;
        }
        .helpCentent {
            height: 400px;
            overflow-x: hidden;
            overflow-y: scroll;
            margin: auto;
            text-align: center;
        }
        .helpCentent span {
            width: 300px;
            color: #3E4452;
            line-height: 20px;
            display: block;
            text-align: left;
            font-size: 14px;
            margin: 26px auto 20px;
        }
        .helpCentent img {
            border: none;
        }
        .code {
            margin-top: 20px;
            overflow: hidden;
        }
        .mobileCode {
            width: 330px;
            height: 50px;
            border: 1px solid #CCCCCC;
            border-radius: 4px 0 0 4px;
            float: left;
            padding-left: 16px;
        }
        .getMobileCode {
            width: 110px;
            height: 50px;
            display: block;
            float: left;
            border: 1px solid #CCCCCC;
            border-left: none;
            background: #F3F3F3;
            line-height: 50px;
            border-radius: 0 4px 4px 0;
            cursor: pointer;
            text-align: center;
        }
        .textGray {
            color: #ccc;
        }
        .next {
            width: 440px;
            height: 50px;
            line-height: 50px;
            text-align: center;
            margin-top: 30px;
            background: #FE9790;
            border: 1px solid rgba(0, 0, 0, 0.10);
            overflow: hidden;
            border-radius: 4px;
            color: #FFC3BF;
            font-size: 18px;
            cursor: pointer;
        }
        .nextNow {
            background: #E13D31;
            color: #fff;
        }
        .close {
            position: absolute;
            right: 0;
            top: 0;
            width: 14px;
            height: 14px;
            padding: 15px;
            cursor: pointer;
            background: url('http://imgsize.52shangou.com/img/n/04/17/1492423785227_7622.png') center no-repeat;
        }
        .bindCentent {
            margin-top: 30px;
            overflow: hidden;
            border: 1px solid #e6e6e6;
            overflow: hidden;
            background: #f8f8f8;
        }
        .QRcodeImg {
            width: 180px;
            height: 180px;
            background: #fff;
            margin: 20px auto;
        }
        .left {
            float: left;
            width: 286px;
            height: 460px;
            padding-top: 20px;
            border-right: 1px solid #e6e6e6;
        }
        .right {
            width: 363px;
            height: 460px;
            overflow-x: hidden;
            overflow-y: auto;
            float: right;
            padding-top: 20px;
        }
        .esc {
            overflow: hidden;
            clear: both;
            margin: 29px auto 0;
            width: 160px;
            height: 40px;
            background: #FAFAFA;
            border: 1px solid rgba(0, 0, 0, 0.10);
            border-radius: 4px;
            line-height: 40px;
        }
        .bindOK {
            .icon {
                width: 100px;
                height: 100px;
                margin: 134px auto 34px;
                background: url('http://imgsize.52shangou.com/img/n/04/17/1492423867803_2747.png') no-repeat;
            }
            .text1 {
                font-size: 18px;
                color: #333;
                margin-bottom: 5px;
            }
            .text2 {
                font-size: 16px;
                color: #666;
            }
        }
        .bindFail {
            .icon {
                width: 100px;
                height: 100px;
                margin: 96px auto 34px;
                background: url('http://imgsize.52shangou.com/img/n/04/17/1492424246854_841.png') no-repeat;
            }
            .text1 {
                font-size: 18px;
                color: #333;
                margin-bottom: 5px;
            }
            .text2 {
                font-size: 16px;
                color: #666;
            }
            .help {
                height: 200px;
                background: #fafafa;
                position: absolute;
                bottom: 0;
                left: 0;
                right: 0;
                border-radius: 0 0 4px 4px;
                border-top: 1px solid #e6e6e6;
                padding: 65px 0 0 204px;
                text-align: left;
                div {
                    margin-bottom: 20px;
                }
                span {
                    color: #2498f0;
                    cursor: pointer;
                }
            }
        }
        .bindFailHelp {
            h2 {
                left: 49px;
                right: 0;
                position: absolute;
                top: 41px;
                background: #fff;
                text-align: left;
            }
            .helpCentent {
                height: 100%;
                text-align: left;
            }
            .helpCentent span {
                width: 100%;
                color: #3E4452;
                line-height: 22px;
                display: block;
                text-align: left;
                font-size: 14px;
                margin: 10px auto 0;
            }
            .helpCentent img {
                border: none;
                margin-top: 20px;
            }
        }
        .checkBind {
            margin-top: 30px;
            border: 1px solid #e6e6e6;
            overflow: hidden;
            background: #f8f8f8;
            .checkBtn {
                background: #e13d31;
                border: 1px solid rgba(0, 0, 0, 0.15);
                border-radius: 4px;
                width: 158px;
                height: 40px;
                color: #fff;
                line-height: 38px;
                margin: 100px auto 20px;
            }
            .checkTips {
                font-size: 14px;
                color: #666;
                margin-top: 20px;
            }
            .bindFailHelp {
                color: #2498f0;
                font-size: 14px;
            }
        }
    }
</style>