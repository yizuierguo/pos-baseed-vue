<template>
    <div id="cont">
        <div class="panel">
            <div class="bg">
                <template v-if="isshow">
                    <div class="login-panel">
                        <span class="avatar">{{curfirstname}}</span>
                        <p class="name">{{curusername}}</p>
                        <input class="login-input" autocomplete="new-password" v-model="password" placeholder="输入密码"
                               type="password"
                               v-focus @keyup.13="submit"/>
                        <div class="key-tip">
                            <span class="t-arrow"></span>
                            <span class="tips" @click="resetChosse">重选[R]</span>
                            <span class="b-arrow"></span>
                        </div>
                    </div>
                </template>
                <template v-else="">
                    <h3 class="title">选择 002班次 店员</h3>
                    <div class="list clearfix">
                        <div class="item" @click="select(item)" v-if="item.userId != userId" v-for="item in list"
                             :key="item.userId">
                            <span class="avatar">{{ item.firstname }}</span>
                            <p class="name">{{item.realName}}</p>
                        </div>
                    </div>
                </template>
            </div>
        </div>
        <ul class="tool-list clearfix">
            <li><span class="tool-btn" @click="backtohome"><i class="icon icon-back"></i><span
                    class="text">返回</span><span
                    class="key">ESC</span></span></li>
            <li><span class="tool-btn squa-btn" @click="print"><i class="icon icon-print"></i><span
                    class="text">打印班次小票</span><span
                    class="key">C</span></span></li>
        </ul>
    </div>
</template>
<script>
    import Win from '../../libs/win';
    import Util from '../../libs/util';
    import Winprint from '../../libs/winprint';
    import {mapGetters} from 'vuex';

    export default{
        data(){
            return {
                curfirstname: '',
                curusername: '',
                mobile: '',
                password: '',
                isshow: false,
                userId: '' //当前登录用户的userId
            }
        },
        computed: {
            list: function () {
                var users = JSON.parse(localStorage.getItem('shiftUsers'));
                users && (users.length > 0) && users.forEach(function (item) {
                    if (item.realName) {
                        item.firstname = item.realName && item.realName.substr(0, 1);
                        if(item.realName.length >4){
                            item.realName = item.realName.substr(0, 4);
                        }
                    }
                    //如果没有店员名字 就展示4位手机号
                    else {
                        item.firstname = item.mobile.substr((item.mobile.length - 4), 4);
                        item.realName = item.mobile;
                    }
                });
                return users;
            }
        },
        mounted: function () {
            var self = this;
            document.onkeydown = function (e) {
                switch (e.keyCode) {
                    case 82:
                        self.resetChosse();
                        break;
                    case 27:
                        self.backtohome();
                        break;
                    case 67:
                        self.print();
                        break;
                    default:
                }
            }
            this.initemployee();
            this.queryLoginUserInfo();
            document.body.style.backgroundColor = '#2E2F31';
        },
        methods: {
            //选择交班员
            select: function (index) {
                this.isshow = true;
                if (index) {
                    this.curfirstname = index.firstname;
                    this.curusername = index.username;
                    this.mobile = index.mobile;
                }
            },
            //重选
            resetChosse: function () {
                this.isshow = false;
                this.curfirstname = '';
                this.curusername = '';
                this.mobile = '';
                this.password = '';
            },
            //跳转到首页
            backtohome: function () {
                this.$router.push({path: 'home'});
            },
            //初始化交班信息
            initemployee: function () {
                this.$store.dispatch('getShiftUsers');
            },
            //初始化登录信息
            //选择交班店员的时候 要将当前用户从交班店员列表中排除掉
            queryLoginUserInfo: function () {
                var res = Win.queryLoginUserInfo();
                if (res.status) {
                    this.userId = (res.entry && res.entry.userId) ? res.entry.userId : '';
                }
            },
            //进行交班
            submit: function () {
                var obj = JSON.stringify({
                    mobile: this.mobile,
                    password: this.password
                });
                var res = Win.goShift(String(this.mobile),String(this.password));
                //登录逻辑
                if (res.status) {
                    this.mobile = '';
                    this.password = '';
                    this.$router.push({path: 'home'});
                } else {
                    Util.toast(res.message, 'failed', 2000);
                }
            },
            print: function () {
                var report = Win.queryLastShiftHandover();     //收银信息 Win.getReportInfo();
                var shop = Win.getShopInfo();          //店铺信息
                var user = Win.queryLoginUserInfo();   //收银员
                var curshift = Win.goShift();          //班次
                var cont = {
                    report: report.status ? report.entry[0] : {},
                    shop: shop.status ? shop.entry && shop.entry.shopName : '',
                    user: user.status ? user.entry && user.entry.realName : '',
                    curshift: curshift.status ? curshift.entry && curshift.entry.id : '', //当前班次
                }
                Winprint(cont, 'nextshift');
            }
        },
        components: {}
    }
</script>
<style lang="less" rel="stylesheet/less" scoped>
    html, body {
        background-color: #2E2F31;
        position: relative;
        width: 100%;
        height: 100%;
    }

    #cont {
        width: 100%;
        height: 100%;
    }

    .panel {
        width: 100%;
        min-height: 600px;
        height: auto !important;
        height: 600px;
        background: #2E2F31;
        position: relative;
        .bg {
            width: 100%;
            height: 90px;
            padding-top: 160px;
            background-color: #D33E34;
        }
        .title {
            position: absolute;
            top: -50px;
            font-size: 24px;
            color: #FFF;
            text-align: center;
            font-weight: normal;
        }
        .list {
            max-width: 620px;
            width: auto !important;
            width: 620px;
            min-height: 265px;
            height: auto !important;
            height: 265px;
            margin: 0 auto 0;
            padding: 45px 50px 0;
            background: #FFF;
            border-radius: 4px;
            text-align: center;
            overflow: auto;
            .item {
                width: 150px;
                height: 150px;
                display: inline-block;
                cursor: pointer;
            }
            .avatar {
                width: 80px;
                height: 80px;
                line-height: 80px;
                display: block;
                margin: 0px auto 10px;
                border-radius: 50%;
                background: #E3E8EA;
                font-size: 30px;
                color: #FFFFFF;
            }
            .name {
                font-size: 16px;
                color: #333;
                margin-bottom: 30px;
            }
        }
        .login-panel {
            width: 370px;
            height: 265px;
            margin: 0 auto 0;
            padding-top: 45px;
            background: #FFFFFF;
            border-radius: 4px;
            text-align: center;
            position: relative;
            .avatar {
                width: 80px;
                height: 80px;
                line-height: 80px;
                display: block;
                margin: 0px auto 10px;
                border-radius: 50%;
                background: #E3E8EA;
                font-size: 30px;
                color: #FFFFFF;
            }
            .name {
                font-size: 16px;
                color: #333;
                margin-bottom: 30px;
            }
        }
        .login-input {
            width: 290px;
            height: 50px;
            padding: 0 5px;
            background: #FFFFFF;
            border: 1px solid #E6E6E6;
            border-radius: 2px;
            font-size: 16px;
            color: #999;
            line-height: 14px;
        }
    }

    .tool-list {
        width: 400px;
        position: absolute;
        bottom: 20px;
        left: 20px;
        > li {
            float: left;
            margin-right: 20px;
        }
        .tool-btn {
            width: 64px;
            height: 64px;
            border-radius: 50%;
            background: #FAFAFA;
            border: 1px solid #EBEBEB;
            display: inline-block;
            text-align: center;
            position: relative;
            cursor: pointer;
            .icon {
                width: 20px;
                height: 20px;
                margin: 4px auto 3px;
                display: block;
            }
            .icon-back {
                background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAWCAYAAADEtGw7AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyppVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTMyIDc5LjE1OTI4NCwgMjAxNi8wNC8xOS0xMzoxMzo0MCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTUuNSAoTWFjaW50b3NoKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDpDMENGMDNDQUZCREYxMUU2QTQzMUU1QzI1QUYwNkI0NyIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDpDMENGMDNDQkZCREYxMUU2QTQzMUU1QzI1QUYwNkI0NyI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOkMwQ0YwM0M4RkJERjExRTZBNDMxRTVDMjVBRjA2QjQ3IiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOkMwQ0YwM0M5RkJERjExRTZBNDMxRTVDMjVBRjA2QjQ3Ii8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+j8bKcgAAAR1JREFUeNpi/P//PwMtABMDjcDQM5gBFMb4wjkjI6OBHPPwuhhk6L9//+qpGhSUGIrTYEoNBQFGWPgyMjLiNBQo9xhIHQPiffz8/Mu7uro+4wtjDIOJdCnI0FksLCwN06ZN+0LQ4MzMTJK8D3TIA2Zm5mig4cewGcxEQTJV+PPnz+709HRXgmFMZqR9AwaLCdDl13G6eMaMGQ1MTEyNWLz9CY/BXECXr0xLS2PFm9ywGT5z5kx+KSkpTiBTHohtgbgDiG8gKdEF4hS8yQ1bWp41axYjNqdmZWWZAl07A8g0AiVJoKNAFv/HG3m4ggUZAMP1tIuLixnQ0FIgVxIYkWZUL4SAhsYBcRvcPEIGkwKAjvCBmcc4WjXBAECAAQDVDbRLW6nTwwAAAABJRU5ErkJggg==");
            }
            .icon-print {
                background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAWCAYAAADEtGw7AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyppVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTMyIDc5LjE1OTI4NCwgMjAxNi8wNC8xOS0xMzoxMzo0MCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTUuNSAoTWFjaW50b3NoKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDoxMUYwRkM2RUZCRTMxMUU2QTQzMUU1QzI1QUYwNkI0NyIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDoxMUYwRkM2RkZCRTMxMUU2QTQzMUU1QzI1QUYwNkI0NyI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjExRjBGQzZDRkJFMzExRTZBNDMxRTVDMjVBRjA2QjQ3IiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjExRjBGQzZERkJFMzExRTZBNDMxRTVDMjVBRjA2QjQ3Ii8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+Vh5hxQAAAMlJREFUeNpi/P//PwMtABMDjQDNDGaBMRgZGeGCRWsiNgNDyIc4Ixi39ocuh6uFBS1WFxNvKFi192AIY8atxBoADMEtWMVhYYIcxpQAmHksiAiL3AoU9KLEUKDjtgEpb5SgoNRQdDMojrwU6zIwpn8GQQY/mBgZ/jAQF5lTjnczcPz7T5yLiTUUn1oWfJpmBS3Fa2jaumjCGQSaVBiokNxwZ5DUtVH/SXHx7OBljEQVQjRLFcSEIVmFEDBYSCiEsKtlHHJ1HkCAAQB600aEfkzPDQAAAABJRU5ErkJggg==");
            }
            .text {
                font-size: 12px;
                color: #666;
            }
            .key {
                width: 34px;
                height: 16px;
                line-height: 16px;
                text-align: center;
                background: #B6CFE3;
                border-radius: 10px;
                position: absolute;
                bottom: -5px;
                color: #FFF;
                left: 22%;
                font-size: 12px;
            }
        }
        .squa-btn {
            width: 84px;
            border-radius: 5px;
            .key {
                left: 32%;
            }
        }
    }

    .key-tip {
        width: 76px;
        height: 36px;
        position: absolute;
        top: 20px;
        left: -15px;
        .tips {
            width: 100%;
            height: 26px;
            line-height: 26px;
            background: #FFF4CB;
            border: 1px solid #F4DD8D;
            border-radius: 0px;
            font-size: 12px;
            color: #8B572A;
            text-align: center;
            display: inline-block;
            position: absolute;
            top: 19px;
            left: 0px;
            cursor: pointer;
        }
        @w: 10px;
        .t-arrow {
            width: 0px;
            height: 0px;
            border-left: @w solid transparent;
            border-right: @w solid transparent;
            border-bottom: @w solid #f00;
            position: absolute;
            top: 11px;
            left: 1px;
            transform: rotate(-225deg);
        }
        .b-arrow {
            width: 0px;
            height: 0px;
            border-left: @w solid transparent;
            border-right: @w solid transparent;
            border-top: @w solid #f00;
            position: absolute;
            bottom: -19px;
            left: 1px;
            transform: rotate(225deg);
        }
    }
</style>