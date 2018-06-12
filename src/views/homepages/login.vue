<template>
    <div id="content">
        <div class="panel">
            <div class="left"><img src="http://imgsize.52shangou.com/img/n/03/22/1490175401255_4389.png"></div>
            <div class="right">
                <div class="close J_close" @click="closeLogin"></div>
                <template v-if="isShowLogin">
                    <div class="login-panel">
                        <h2>登录</h2>
                        <div class="errorTips" v-bind:class="{showErrorTips: isShowLoginError}"><span
                                class="errorText J_errorText">{{loginErrorMsg}}</span></div>
                        <div class="login">
                            <label>
                                <el-dropdown trigger="click" @command="selectUser">
                                    <input maxlength="11" class="mobile J_mobile" type="tel" name=""
                                           placeholder="手机号" autofocus="autofocus" v-model="mobile"
                                           @input="checkLoginForm"
                                           @keydown.enter="focusPassword">
                                    <el-dropdown-menu slot="dropdown">
                                        <el-dropdown-item v-for="item in loginUserList" :command="JSON.stringify(item)">
                                            {{item.mobile}}
                                        </el-dropdown-item>
                                    </el-dropdown-menu>
                                </el-dropdown>
                            </label>
                            <label>
                                <input maxlength="16" class="password J_password" type="password"
                                       autocomplete="new-password" name=""
                                       placeholder="密码" v-model="password" @input="checkLoginForm"
                                       @keydown.enter="login"
                                       ref="J_password">
                            </label>
                            <div class="autoLogin">
                                <input v-bind:class="{unchecked: !isSavePassword, selected: isSavePassword}"
                                       @click="isSavePassword=!isSavePassword"
                                       id="autoLogin" type="checkbox" name="">
                                <label for="autoLogin">记住密码</label>
                                <span class="forgotPassword J_forgotPassword" @click="isShowLogin = false">忘记密码</span>
                            </div>
                            <div class="loginBtn J_loginBtn" v-bind:class="{btnNow: isLoginCanSubmit}"
                                 @click.prevent="login">
                                <span class="J_loginText">登录</span>
                                <div id="preloader-1">
                                    <span></span>
                                </div>
                            </div>
                        </div>
                    </div>
                </template>
                <template v-else>
                    <div class="forgetpassword-panel">
                        <h2>找回密码</h2>
                        <div class="errorTips" v-bind:class="{showErrorTips: isShowRetrieveError}"><span
                                class="errorText">{{retrieveErrorMsg}}</span></div>
                        <div class="forget-password J_inputArea">
                            <template v-if="isRetrievePasswordSucceed">
                                <i class="icon icon-succeed"></i>
                                <p class="succeed-text">密码设置成功</p>
                            </template>
                            <template v-else>
                                <label><input v-model="retrieveMobile" @input="checkRetrievePassForm" class="mobile"
                                              type="tel" name=""
                                              maxlength="11" autofocus="autofocus" placeholder="手机号"></label>
                                <label>
                                    <input v-model="code" @input="checkCode(), checkRetrievePassForm()" class="code"
                                           type="tel" name="" placeholder="验证码" maxlength="4">
                                    <span class="getCode" v-bind:class="[isCanSendCode ? 'codeActive' : 'codeInactive']"
                                          ref="J_sendCode" @click="getMobileCode">获取</span>
                                </label>
                                <div class="pswBox">
                                    <label>
                                        <template v-if="isSeePwd">
                                            <input class="password" v-model="retrievePassword"
                                                   @input="checkRetrievePassForm" type="text" name="" minlength="6"
                                                   autocomplete="new-password" maxlength="16" placeholder="密码 6 ~ 16位">
                                        </template>
                                        <template v-else>
                                            <input class="password" v-model="retrievePassword"
                                                   @input="checkRetrievePassForm" type="password" name="" minlength="6"
                                                   autocomplete="new-password" maxlength="16" placeholder="密码 6 ~ 16位">
                                        </template>

                                    </label>
                                    <div class="seeORhide" v-bind:class="{hide: !isSeePwd, see: isSeePwd}"
                                         @click="isSeePwd=!isSeePwd"></div>
                                </div>
                                <div class="btn" v-bind:class="[isRetrieveCanSubmit ? 'btnNow' : 'btnInactive']"
                                     @click="retrieve">确定

                                </div>
                                <div class="btn btnBack" @click="backLogin"><i class="icon icon-back"></i>返回</div>
                            </template>
                        </div>
                        <div class="tipsArea J_tipsArea hidden">
                            <i class="tipsIcon"></i>
                            密码设置成功
                        </div>
                    </div>
                </template>
            </div>
        </div>
    </div>
</template>
<script>
    import Vue from 'vue';
    import Util from '../../libs/util';
    import Win from '../../libs/win';
    import Ajax from '../../libs/io'
    import {Dropdown, DropdownMenu, DropdownItem} from 'element-ui';
    Vue.use(Dropdown);
    Vue.use(DropdownMenu);
    Vue.use(DropdownItem);
    export default{
        data(){
            return {
                isShowLogin: true,
                loginUserList: [], //登录用户列表
                mobile: '',
                password: '',
                isShowLoginError: false, //是否显示错误提示
                loginErrorMsg: '',//错误的提示信息
                isLoginCanSubmit: false,
                isSavePassword: true,
                //找回密码相关
                retrieveMobile: '',
                retrievePassword: '',
                code: '', //验证码
                isCanSendCode: false, //是否可以发送验证码
                sendCodeDelay: 60, //60秒后重发
                isSeePwd: false, //密码是否可见
                isShowRetrieveError: false,
                retrieveErrorMsg: '',
                isRetrieveCanSubmit: false, //找回密码是否可以提交
                isRetrievePasswordSucceed: false, //是否成功找回密码
            }
        },
        mounted: function () {
            this.queryLoginUserList();
        },
        methods: {
            //关闭登录
            closeLogin: function () {
                try {
                    eleph.ui.login_close();
                } catch (e) {

                }
            },
            queryLoginUserList: function () {
                try {
                    var data = Win.queryLoginUserList();
                    if (data && data.status) {
                        let loginUserList = data.entry || [];
                        let res = [];
                        for (let index = 0; index < loginUserList.length; index++) {
                            let d = loginUserList[index] || {};
                            let item = {
                                mobile: d.mobile,
                                password: d.attributes.isSavePassword == 1 ? d.password : ''
                            };
                            res.push(item);
                            if (index === 0) {
                                this.mobile = item.mobile;
                                this.password = item.password;
                                this.checkLoginForm();
                            }
                        }
                        this.loginUserList = res;
                    }
                } catch (e) {

                }
            },
            //选择登录用户
            selectUser: function (command) {
                command = JSON.parse(command);
                this.mobile = command.mobile;
                this.password = command.password;
                this.checkLoginForm();
            },
            //重置数据
            resetData: function () {
                Object.assign(this.$data, this.$options.data(), {
                    loginUserList: this.loginUserList, //登录用户列表
                });
            },
            //登录
            login: function () {
                if (!this.checkLoginForm()) return;
                try {
                    let data = Win.login(this.mobile, this.password, (this.isSavePassword ? '1' : '0'));
                    //登录成功
                    if (data.status) {
                        //设置cookie
                        let cookies = data.entry.cookies || [];
                        for (let key in cookies) {
                            document.cookie = cookies[key];
                        }
                        eleph.ui.homePage_open();
                        if (data.entry.isRegister && data.entry.isRegister == '0') {
                            this.$router.push({path: 'printtest'}); //打印测试页
                        } else {
                            this.$router.push({path: 'home'}); //首页
                        }
                    }
                    //失败
                    else {
                        this.isShowLoginError = true;
                        this.loginErrorMsg = data.message;
                    }
                } catch (e) {

                }
            },
            //校验手机号码
            checkMobile: function (type) {
                this[type] = this[type].replace(/[^0-9]/g, ''); //only number
                this.isCanSendCode = type == 'retrieveMobile' && this[type].length == 11;
                return this[type].length == 11;
            },
            //校验密码
            checkPassword: function (password) {
                return password.length >= 6;
            },
            checkLoginForm: function () {
                this.isLoginCanSubmit = false;
                if (!this.checkMobile('mobile')) return false;
                if (!this.checkPassword(this.password)) return false;
                this.isLoginCanSubmit = true;
                return true;
            },
            focusPassword: function () {
                this.$refs.J_password.focus();
                this.checkMobile();
            },
            /**
             * 找回密码
             */
            retrieve: function () {
                let self = this;
                if (!this.checkRetrievePassForm()) return;
                Ajax({
                    url: Util.getOuterUrl('/member/reset_pos_pwd.do'),
                    type: 'POST',
                    dataType: 'json',
                    data: JSON.stringify({
                        code: self.code,
                        mobile: self.retrieveMobile,
                        pwd: self.retrievePassword,
                        repwd: self.retrievePassword,
                        role: "seller"
                    }),
                    success: function (data) {
                        if (data && data.status) {
                            self.isShowRetrieveError = false;
                            self.retrieveErrorMsg = '';
                            self.isRetrievePasswordSucceed = true;
                            setTimeout(function () {
                                self.backLogin(); //返回登陆页面
                            }, 2000);
//                            Util.toast(data.message, 'succeed', 2000);
                        } else {
                            self.isShowRetrieveError = true;
                            self.retrieveErrorMsg = data.message;
                            self.isRetrievePasswordSucceed = false;
                        }
                    }
                });
            },
            //校验验证码
            checkCode: function () {
                this.code = this.code.replace(/[^0-9]/g, ''); //only number
                return this.code.length == 4;
            },
            checkRetrievePassForm: function () {
                this.isRetrieveCanSubmit = false;
                if (!this.checkMobile('retrieveMobile')) return false;
                if (!this.checkCode()) return false;
                if (!this.checkPassword(this.retrievePassword)) return false;
                this.isRetrieveCanSubmit = true;
                return true;
            },
            //倒计时
            countDown: function (delay) {
                let self = this;
                if (delay < 1) {
                    self.isCanSendCode = true;
                    self.$refs.J_sendCode.innerText = '重发验证码';
                    return;
                }
                self.$refs.J_sendCode.innerText = delay + '秒后重发';
                setTimeout(function () {
                    delay--;
                    self.countDown(delay);
                }, 1000);
            },
            //获取验证码
            getMobileCode: function () {
                let self = this;
                if (!this.isCanSendCode) return;
                Ajax({
                    url: Util.getOuterUrl('/member/sendPosAuthCode.do'),
                    data: {
                        mobile: self.retrieveMobile,
                        type: 'sms'
                    },
                    isEncrypt: true,
                    dataType: 'json',
                    success: function (data) {
                        if (data && data.status) {
                            self.isCanSendCode = false;
                            self.countDown(60); //倒计时
                            Util.toast('验证码已发送', 'succeed', 2000)
                        }
                        else {
                            Util.toast(data.message, 'failed', 2000)
                        }
                    },
                    error: function (xhr, errorType, error) {
                        if (errorType === 'timeout') {
                            Util.toast('忙坏了，让我歇会', '请稍后再试', 'failed', 2000);
                        } else {
                            Util.toast('网络连接失败', '请稍后再试', 'failed', 2000);
                        }
                    }
                })
            },
            //返回登陆
            backLogin: function () {
                this.resetData();
                this.isShowLogin = true;
            },
        },
        computed: {},
        components: {
            Dropdown,
            DropdownMenu,
            DropdownItem
        }
    }
</script>
<style rel="stylesheet/less" lang="less" scoped>
    ul, li, h1, h2, input {
        list-style-type: none;
        padding: 0;
        margin: 0;
        outline: none;
    }

    .clearfix {
        *zoom: 1;
        &:before, &:after {
            display: table;
            content: "";
            line-height: 0;
        }
        &:after {
            clear: both;
        }
    }

    .el-dropdown-menu {
        width: 268px;
        border-radius: 4px 4px 0 0;
        .el-dropdown-menu__item {
            padding-left: 10px;
            &:hover {
                background: #E13D31;
                color: #fff;
            }
        }
    }

    /*登录样式*/
    .panel {
        width: 550px;
        height: 420px;
        position: relative;
        margin: 0 auto;
        background: #fff;
        overflow: hidden;
        .left {
            float: left;
            width: 190px;
            height: 420px;
            background: #DC4437;
            overflow: hidden;
        }
        .right {
            float: right;
            width: 270px;
            height: 380px;
            overflow: hidden;
            position: relative;
            padding: 40px 45px 0 45px;
        }
        h2 {
            font-size: 20px;
            color: #333333;
            letter-spacing: 2px;
            line-height: 20px;
            font-weight: 400;
        }

        .pswBox {
            position: relative;
            margin-top: 14px;
            .seeORhide {
                position: absolute;
                height: 40px;
                width: 50px;
                right: 0;
                top: 1px;
                // background-color: #dbdbdb;
                background-size: 20px 12px;
                background-repeat: no-repeat;
                background-position: center;
            }

            .see {
                background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAMCAYAAABiDJ37AAAAAXNSR0IArs4c6QAAAbBJREFUKBWtk89LAlEQx99b0xBXBXW3ViX0oJcCEYUi6NyhiP6Bbl37a7p27FynLl3Dmz9Q6iBeJNTW0IOaiIq7fWdhxbdpdOjB8HbmzXzevJlZzjYs0zR5pVLZw34C2SU3zrkOeclms+/YzXWhfJ2xWCyeuVyuW4C0YDA4dbvdXvKbz+eTwWCwDdjHYrG4yefzT854AVitVg8AuZMkaT+RSMh+v9/pb+mj0Yg1m80vwzDeAL/OZDKvtuMSiOcdw/gcj8e9kUhEIgfAWafTYf1+n2maxhRFseOsvdfrGa1WawLwVS6XeySjFVgqlc7xhEIymfTZMDokmK7r9FQWCoXIJCzyTaVSPlz8gDId0iEvl8sKDN10Os1lWRYCarWaBSNjLBazMqRsVVUV/IbDIWs0GgylUrdQfI4MONIWnJxKu91mJGjQDyBANAEmsSQU9BPBR3TDeDwWOOFwWNBJcdrQdVav1+nogljLpqAGl7jhflNTbFg0GqVsSGV2U/B5itkskG0JJOVfx4aA9lod7EAgMPV4PNZgz2azCRrw98G2gbSj86u/3g7Z8NQu5Ndf7xsq6eSmUiiK2gAAAABJRU5ErkJggg==");
            }

            .hide {
                background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAMCAYAAABiDJ37AAAAAXNSR0IArs4c6QAAATNJREFUKBVjYBgS4Pz58/5nz569eP/+fQ5SHXz79m12oN7jZ86cCQDpZQIRhoaGG//////57du3y0F8UsCnT5/mAPXeNzEx2QDSBzYQxGBmZi4HUt5Am9YBFTCCxPABkBqgy84A6Rig3pUwtWADgV5W+Pv37xqgZAgjI+N/kBfOnTsXgc1gkBhIDqjmBNCQh0C+DVDvnIsXL+qADAW7BKgg8t+/f1eAzr4M0gC0IBzInwCU/w204CqQvg1SDASqQGwOxHeB4j3AoFoJdYAKUMzC2Nh4CVavAS2QAhp8BegVWyAtD3QByCBQsNwG8p2BmA2oORckhg5Y0AVAfKDrvIDUDgMDA5DrQBgOgF59AjRwHVwAjQGPFGRxVlbWw0xMTPnIYjA20GWXgHLpwMjjgokNLRoAFGad2lEoS7AAAAAASUVORK5CYII=");
            }
        }

        .login, .forget-password {
            margin-top: 50px;
        }

        .icon-back {
            display: inline-block;
            width: 14px;
            height: 14px;
            vertical-align: middle;
            background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAOCAYAAAAfSC3RAAAAAXNSR0IArs4c6QAAAOFJREFUKBVjYBi6oKGhgSM9Pb2XkA+YkBWAND1//nwDUMwDWRwbmxEmCNP0//9/d6DYVyCeyszMvH7atGknGRkZ/8PUwWiwRjRNMDkwDdR0jYmJKWj69Ok3kSVQnIosAWMDXaD179+/UxkZGQ4wMRCN1alAW74ANZwFyosDsSoQMwPFHgOdrgV0+hcgnwFuI9C5PyQlJQOACnYCxR/NmjXLAYg12dnZJYH8LKBBHH/+/KkGaQIBuEYQB6YZyNwB4oPA5MmTXwMNmM7KyqoJ5CqAxEgGmZmZggUFBQIka6SKBgA811eIF8LuWgAAAABJRU5ErkJggg==") no-repeat center center;

        }

        .mobile, .password {
            width: 258px;
            height: 38px;
            padding-left: 10px;
            background: #FFFFFF;
            border: 1px solid #D4D6DC;
            border-radius: 4px;
            font-size: 13px;
        }

        /*.mobile:hover, .password:hover {*/
        /*border-color: #BEDFAE;*/
        /*}*/

        .mobile:focus, .password:focus {
            border-color: #7EBF5E;
        }

        .password {
            margin: 14px 0;
        }

        .autoLogin {
            font-size: 12px;
            color: #717885;
            line-height: 12px;
            vertical-align: middle;
        }

        .forgotPassword {
            float: right;
            font-size: 12px;
            color: #717885;
            cursor: pointer;
        }

        .forgotPassword a {
            color: #717885;
            text-decoration: none;
        }

        .loginBtn {
            width: 270px;
            height: 40px;
            background: #FE9790;
            border-radius: 4px;
            color: #fff;
            font-size: 16px;
            letter-spacing: 2px;
            line-height: 40px;
            text-align: center;
            margin-top: 28px;
            cursor: pointer;
        }

        .btnNow {
            color: #fff;
            background: #E13D31;
        }

        .btnNow:hover {
            background: #EF463A;
        }

        .btnNow:active {
            background: #BD291F;
        }

        .register {
            margin-top: 19px;
            color: #717885;
            text-align: center;
            font-size: 13px;
            cursor: pointer;
        }

        .close {
            width: 26px;
            height: 26px;
            position: absolute;
            top: 0;
            right: 0;
            background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAAXNSR0IArs4c6QAAAblJREFUSA21ltFKwzAUhs9p0ZdR8L7oEPUFdiXoWwzBOREHozpB9hYK4jM4hIm71Ytd+Ao+gtLG/GmTZl3TNgMDbdLk5PtPzkmbElnl/Gq8ZT2u1SwzAk3pDeLhz2/62evfHus+3xpzFUOy9NwQDcBFSteyCcFutHv0NX97WWCsbQFckHggEiEJ2o86hzyfTV8ZS4KqGjA0Tpj4dDK+eDJdNY0luLHjZHMj2AnuRv0FYEScmDHpBbxpEy4XHEywVYgQDoRFCnTlpfPSGK46uF69EoDnviJt4OAaAR+RtnAwGbdyqQPA1uwWM9G9KSoFMK9ahNKcqfMkH91w2C6FKJ+sKkdO4JDlVD0cIMtYcVdu2UrSRzlgea3MUqbgRO+WlYl5R3mSy27tfmeIQCzyUBlKrL7xs+IUKODy21IUJFnIS4e28WXUhgVCtqrhWUJh6LNNbe+USB0cCXXsLudKlgSa4MoDefMRMQJt4b4iSsAX7iPCZ4N4O0n5478OnPB9Nv2OOgcBjrnMs+bXX69A11U54YBG9/HgWYUIZyfOUBK853NUagHUtgjgk5vLoT2u2uVfjhWDFh1lxh+ieU2T/T3JzwAAAABJRU5ErkJggg==") no-repeat center center;
            background-size: 10px 10px;
        }

        .close:active {
            background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAAXNSR0IArs4c6QAAAbFJREFUSA2tlk1OwzAQhT3uSSp1g4rECZDCpqwpSF1wGCpxlgohKHvKgh4BFgGxqNQ1Z4AM81zGckLsxBWWGiex/b35c1xjgnZyej4OHve6bTIGSikmF3NmczMcHXxsN++lvs/pi8l0xkxPw9HYbjdva6x1AoBXVXUlz9YYOttH5Be+YOaB/AoRIYgQXKoq84oBKKIR0TcRX65XD7e7N+lrCNeZYFhrjuzz47IEDC90cGcFLbBQ38X6GBxMsJ3ViDnCgvAISMLkWme4UnD13oclV6QPHGZ6ATz0FekLB5NwabYUAHOlFF216LpUUbQKYGGbiJRX5aDMmqfOiquFSC1CHwkXDPJGpSxXVlQgFGFD0xDsFos3tsde8a6q4n/3SQ80D5LVtnkSqu7PSttC54TCw0+IS7JsUZmgeejcjDqxFpk2uCYUE3PK9I8HKTi2f6S6op7UBLrg6maOiBfoC88VcQK58BwRKiazQ+avl7BaNKH6yVVgrI8ZiANnsN2UnzhDRaAAIBeONW05sdZer1fLOxcinJ04Q2Xucc5RCbi2UGQHv5/rmO+bfzn8QMZNk/EDrg6SJkUWXNgAAAAASUVORK5CYII=") no-repeat center center;
            background-size: 10px 10px;
        }

        .errorTips {
            width: 270px;
            height: 26px;
            line-height: 26px;
            font-size: 12px;
            color: #E43225;
            background: #FFEAEA;
            border-radius: 4px;
            position: absolute;
            top: 68px;
            left: 38px;
            text-align: center;
            display: none;
        }
        .showErrorTips {
            display: block;
        }

        .errorText {
            padding-left: 14px;
            position: relative;
        }

        .errorText:after {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 12px;
            height: 12px;
            background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMCAYAAABWdVznAAAAAXNSR0IArs4c6QAAARlJREFUKBV1UkEuBFEQrVfdQRgHcASJzQzBhkQs7ByAhWgW3MARHMKMkNhwAomE2PWGjcQZLC1mgmT+U/XH7/R0RiWdevXe+1Xd1R/yFyQxWO2cCKQQcpHAEJQ3Ki5a5ctl8sFBf2N5gd/DG6FsJaGeAdzPYuoAZfmhLvArXP9njjq5M+DPlWP019oFA7tepFDFueMQeJa4mFWLXIIcjZHRKJ9NzmsEHueELNnrjAXAlhNs8O7NQWYNXmxD87FD44R7cwHerdVKfYQJu3FCnXRsXhWw2nHSbde39tylusqUnjWjbarzZFM2K2ESgDzOla/baj+Fms3s2bjnSb4RhwdMZ/vutcmjiFdjvX1qX3xYvxqi0rXOveT7BeGKbLmh45YyAAAAAElFTkSuQmCC");
            color: #fff;
            border-radius: 6px;
            text-align: center;
        }

        /*各个按钮状态*/
        .inputGreen {
            border-color: #7EBF5E;
        }

        .inputRed, .inputRed:hover, .inputRed:focus {
            border-color: #E13D31;
        }

        #preloader-1 {
            width: 40px;
            position: relative;
            margin: 0 auto;
            line-height: 40px;
            text-align: center;
            font-size: 16px;
            background-color: #e43225;
            display: none;
        }

        #preloader-1 span {
            position: absolute;
            border: 8px solid transparent;
            background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAAXNSR0IArs4c6QAAAYJJREFUSA21lb9Kw1AUh5O0SqFYQUGEujr5AIKbr6A4uYmrXfsAvoAO7m6dfIFOLg6Ck5ODKEqpoKCCWmOrxu9XbiRpobb25MDHuTnN/Z0/SW88b4BFUVSGLajBKTShAZsDtqV+8lNX7gKBeZY7sA4FmHRMOP/i+/4c6z8t33sH4qvEdqEEcQHyIgcBNGAoSyVAfINdFVDFsUn4Cy6hCdewB0PZbwLEV9ixDRL7hgiu4BDqjOQJP7J1EyA+y07N/BMU68AB1BBW7N8Wd7CGgmYrYXVQRfgMP7blqX4GlWVog+a9byWOVnccS/gP0MyPET/Bm5lGtAih48hM2QkpQRFacEH1zy5u5vRgleQNzs1UE0ISV/V6e+4TcbOlOngEdfBqppoQUgcPEJ81iZ9slurgFjQmnZTmpgR3oNd0ylwdwYBX8x1/k1kCV7US5Dg29J/IxhAvwQLogWdjiE8LS/W+akmgb7DiIc9HB6C9kSQAfX/Htr4OehWVjJju02fUG7WrH9AEgAeHy4C9AAAAAElFTkSuQmCC");
            background-repeat: no-repeat;
            background-size: 100%;
            background-position: center;
            border-radius: 50%;
        }

        #preloader-1 span:nth-child(1) {
            left: 0;
            width: 24px;
            height: 24px;
            animation: spin-1 1s infinite linear;
            -webkit-animation: spin-1 1s infinite linear;

        }

        /*  #preloader-1 span:nth-child(2){
            top:20px;
            left: 20px;
            width: 40px;
            height: 40px;
            animation:spin-2 1.5s infinite linear;

            -webkit-animation:spin-2 1.5s infinite linear;

        }*/
        @keyframes spin-1 {
            0% {
                transform: rotate(0deg);
                opacity: 1;
            }
            50% {
                transform: rotate(180deg);
                opacity: 0.5;
            }
            100% {
                transform: rotate(360deg);
                opacity: 1;
            }
        }

        @-webkit-keyframes spin-1 { /* Safari 和 Chrome */
            0% {
                -webkit-transform: rotate(0deg);
                opacity: 1;
            }
            50% {
                -webkit-transform: rotate(180deg);
                opacity: 0.5;
            }
            100% {
                -webkit-transform: rotate(360deg);
                opacity: 1;
            }
        }

        .autoLogin input {
            position: relative;
            width: 12px;
            height: 12px;
            float: left;
            margin: 0 4px 0 0;
        }

        .autoLogin .unchecked:after {
            content: '';
            width: 12px;
            height: 12px;
            left: 0;
            top: 0;
            position: absolute;
            background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMCAYAAABWdVznAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA4hpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTMyIDc5LjE1OTI4NCwgMjAxNi8wNC8xOS0xMzoxMzo0MCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDpmYzJjYzA4NS0zOWVlLTQzYTktOGVmNC03YTRmMDkwZjMyYjEiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6OEY3NEI0QTBEM0MyMTFFNjhBOEZGMjlGMUI4MjNBMzEiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6OEY2RkQ5RTREM0MyMTFFNjhBOEZGMjlGMUI4MjNBMzEiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTUuNSAoTWFjaW50b3NoKSI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOmU3YzBiN2M0LWI2OGYtNGY2OS1iYzIyLWJlZWZjZWUyZWFjNiIgc3RSZWY6ZG9jdW1lbnRJRD0iYWRvYmU6ZG9jaWQ6cGhvdG9zaG9wOjlhNzY2ZjllLTFjMjctMTE3YS04MmU4LTk0NGRlNjM5ODQ2MyIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Ppl6DXgAAAAvSURBVHjaYpw5cyYDEPxnIA4wMgA1/CcWgNQyMZAIRjUMDg2MpCSNtLQ0RoAAAwBGyDRJxHm4wAAAAABJRU5ErkJggg==");
        }

        .autoLogin .selected:after {
            content: '';
            width: 12px;
            height: 12px;
            left: 0;
            top: 0;
            position: absolute;
            background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMCAYAAABWdVznAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyppVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTMyIDc5LjE1OTI4NCwgMjAxNi8wNC8xOS0xMzoxMzo0MCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTUuNSAoTWFjaW50b3NoKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo5OTQ1RjA3NEQzQkMxMUU2OEE4RkYyOUYxQjgyM0EzMSIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDo5OTQ1RjA3NUQzQkMxMUU2OEE4RkYyOUYxQjgyM0EzMSI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjk5NDVGMDcyRDNCQzExRTY4QThGRjI5RjFCODIzQTMxIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjk5NDVGMDczRDNCQzExRTY4QThGRjI5RjFCODIzQTMxIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+ktuxRgAAAFZJREFUeNpi/P//P8NDO6P/DMQBRiYSFIPAfyYGEgFRGuQPnSNeA0gx0NnEaUBXjKIB2VpcilE0gCRhmnApxnASTBMuxVj9gE8x0cGKroGRBPWMAAEGAG3sILeTz13hAAAAAElFTkSuQmCC");
        }
    }

    //找回密码样式
    .forgetpassword-panel {

        h2 {
            margin-bottom: 30px;
        }

        .close {
            width: 26px;
            height: 26px;
            position: absolute;
            top: 0;
            right: 0;
            background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAAXNSR0IArs4c6QAAAblJREFUSA21ltFKwzAUhs9p0ZdR8L7oEPUFdiXoWwzBOREHozpB9hYK4jM4hIm71Ytd+Ao+gtLG/GmTZl3TNgMDbdLk5PtPzkmbElnl/Gq8ZT2u1SwzAk3pDeLhz2/62evfHus+3xpzFUOy9NwQDcBFSteyCcFutHv0NX97WWCsbQFckHggEiEJ2o86hzyfTV8ZS4KqGjA0Tpj4dDK+eDJdNY0luLHjZHMj2AnuRv0FYEScmDHpBbxpEy4XHEywVYgQDoRFCnTlpfPSGK46uF69EoDnviJt4OAaAR+RtnAwGbdyqQPA1uwWM9G9KSoFMK9ahNKcqfMkH91w2C6FKJ+sKkdO4JDlVD0cIMtYcVdu2UrSRzlgea3MUqbgRO+WlYl5R3mSy27tfmeIQCzyUBlKrL7xs+IUKODy21IUJFnIS4e28WXUhgVCtqrhWUJh6LNNbe+USB0cCXXsLudKlgSa4MoDefMRMQJt4b4iSsAX7iPCZ4N4O0n5478OnPB9Nv2OOgcBjrnMs+bXX69A11U54YBG9/HgWYUIZyfOUBK853NUagHUtgjgk5vLoT2u2uVfjhWDFh1lxh+ieU2T/T3JzwAAAABJRU5ErkJggg==") no-repeat center center;
            background-size: 10px 10px;
        }

        .close:active {
            background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAAXNSR0IArs4c6QAAAbFJREFUSA2tlk1OwzAQhT3uSSp1g4rECZDCpqwpSF1wGCpxlgohKHvKgh4BFgGxqNQ1Z4AM81zGckLsxBWWGiex/b35c1xjgnZyej4OHve6bTIGSikmF3NmczMcHXxsN++lvs/pi8l0xkxPw9HYbjdva6x1AoBXVXUlz9YYOttH5Be+YOaB/AoRIYgQXKoq84oBKKIR0TcRX65XD7e7N+lrCNeZYFhrjuzz47IEDC90cGcFLbBQ38X6GBxMsJ3ViDnCgvAISMLkWme4UnD13oclV6QPHGZ6ATz0FekLB5NwabYUAHOlFF216LpUUbQKYGGbiJRX5aDMmqfOiquFSC1CHwkXDPJGpSxXVlQgFGFD0xDsFos3tsde8a6q4n/3SQ80D5LVtnkSqu7PSttC54TCw0+IS7JsUZmgeejcjDqxFpk2uCYUE3PK9I8HKTi2f6S6op7UBLrg6maOiBfoC88VcQK58BwRKiazQ+avl7BaNKH6yVVgrI8ZiANnsN2UnzhDRaAAIBeONW05sdZer1fLOxcinJ04Q2Xucc5RCbi2UGQHv5/rmO+bfzn8QMZNk/EDrg6SJkUWXNgAAAAASUVORK5CYII=") no-repeat center center;
            background-size: 10px 10px;
        }

        .errorTips {
            top: 78px;
            left: 45px;
            width: 270px;
            height: 26px;
            font-size: 12px;
            color: #E43225;
            line-height: 26px;
            position: absolute;
            background: #ffeaea;
            border-radius: 4px;
            text-align: center;
            display: none;
        }

        .showErrorTips {
            display: block;
        }

        .errorText {
            padding-left: 14px;
            position: relative;
        }

        .errorText:after {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 12px;
            height: 12px;
            background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMCAYAAABWdVznAAAAAXNSR0IArs4c6QAAARlJREFUKBV1UkEuBFEQrVfdQRgHcASJzQzBhkQs7ByAhWgW3MARHMKMkNhwAomE2PWGjcQZLC1mgmT+U/XH7/R0RiWdevXe+1Xd1R/yFyQxWO2cCKQQcpHAEJQ3Ki5a5ctl8sFBf2N5gd/DG6FsJaGeAdzPYuoAZfmhLvArXP9njjq5M+DPlWP019oFA7tepFDFueMQeJa4mFWLXIIcjZHRKJ9NzmsEHueELNnrjAXAlhNs8O7NQWYNXmxD87FD44R7cwHerdVKfYQJu3FCnXRsXhWw2nHSbde39tylusqUnjWjbarzZFM2K2ESgDzOla/baj+Fms3s2bjnSb4RhwdMZ/vutcmjiFdjvX1qX3xYvxqi0rXOveT7BeGKbLmh45YyAAAAAElFTkSuQmCC");
            color: #fff;
            border-radius: 6px;
            text-align: center;
        }

        .mobile, .password {
            width: 254px;
            height: 40px;
            padding-left: 14px;
            background: #FFFFFF;
            border: 1px solid #ccc;
            border-radius: 4px;
            font-size: 13px;
        }

        .mobile {
            margin-bottom: 14px;
        }

        .password {
            margin: 0 0 28px 0;
        }

        .code {
            float: left;
            width: 169px;
            height: 40px;
            padding-left: 14px;
            border: 1px solid #ccc;
            border-radius: 4px 0 0 4px;
        }

        .mobile:hover, .password:hover, .code:hover {
            border-color: #BEDFAE;
        }

        .mobile:focus, .password:focus, .code:focus {
            border-color: #7EBF5E;
        }

        .btn {
            height: 40px;
            font-size: 16px;
            letter-spacing: 2px;
            text-align: center;
            line-height: 40px;
            border-radius: 4px;
            background: #FE9790;
            color: #FFC3BF;
            cursor: pointer;
        }

        .btnInactive {
            background: #FE9790;
            color: #FFC3BF;
        }

        .btnActive {
            float: left;
            background: #E13D31;
            color: #FFF;
        }

        .btnNow {
            color: #fff;
            background: #E43225;
        }

        .btnNow:hover {
            background: #EF463A;
        }

        .btnNow:active {
            background: #BD291F;
        }

        .btnBack {
            background: #ffffff;
            font-size: 12px;
            color: #666;
            position: absolute;
            width: 100%;
            left: 0;
            bottom: 0;
            border-radius: 0;
            border-top: 1px solid #ebebeb;
            -webkit-box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.04);
            -moz-box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.04);
            box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.04);
        }

        .getCode {
            width: 84px;
            height: 40px;
            border: 1px solid #ccc;
            text-align: center;
            line-height: 42px;
            font-size: 14px;
            border-left: 0;
            display: inline-block;
            border-radius: 0 4px 4px 0;
        }

        .codeInactive {
            background: #F3F3F3;
            color: #CCCCCC;
        }

        .codeActive {
            background: #fff;
            color: #3E4452;
        }

        .pwdHide {
            display: none;
        }

        .tipsArea {
            text-align: center;
            font-size: 18px;
            color: #000;
            overflow: hidden;
        }

        .tipsIcon {
            width: 96px;
            height: 96px;
            margin: 54px auto 24px;
            display: block;
            background-image: url("data:image/png;base64,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");
        }

        .hidden {
            display: none;
        }

        .icon-succeed {
            display: block;
            height: 80px;
            margin: 91px 0 20px;
            background: url("data:image/png;base64,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") no-repeat center center;

        }

        .succeed-text {
            font-size: 18px;
            color: #333333;
            letter-spacing: 0;
            line-height: 18px;
            text-align: center;
        }
    }

</style>