<template>
    <transition name="fade" mode="out-in">
        <div class="main-header">
            <span class="logo"></span>
            <span class="info">
                <span class="title">小象掌柜</span>
                <span class="sub-title">{{shopName}}</span>
                <span class="line"></span>
                <span class="sub-title pos-user">收银员：{{realName}}</span>
                <span class="line"></span>
                <span class="sub-title clock-panel" id="J_Clock"></span>
                <!--<span id="J_Clock" class="sub-title clock-panel"><span class="month">2017/4/13</span><span class="week"> 星期四</span><span class="timer">15:51:08</span></span>-->
            </span>
            <span class="group-btn">
                <span class="btn btn-next" @click="nextshift">交班[B]</span>
                <span class="btn btn-lock" @click="lockpos">锁机[Ctrl+L]</span>
                <span class="icon icon-wifi" :class="{'icon-wifi-disabled':!getNetWorkStatus}"></span>
                <span class="icon icon-window" @click="miniwindow"></span>
            </span>
        </div>
    </transition>
</template>
<script>
    import {mapGetters} from 'vuex';
    import Util from '../libs/util';
    import Win from '../libs/win';
    var slidint = null;
    export default{
        data(){
            return {
                shopName: '',
                realName: ''
            }
        },
        mounted: function () {
            this.initClock();
            this.initNetWorkStatus();
            this.initshopinfo();
            this.queryLoginUserInfo();
        },
        computed: {
            ...mapGetters([
                'getNetWorkStatus'
            ])
        },
        methods: {
            //锁机
            lockpos: function () {
                if (this.$store.getters.cartList.length > 0) {
                    Util.toast('当前收银未结束<br>不能锁机', 'notice', 2000);
                    return;
                }
                this.$router.push({path: '/lockpos'});
            },
            //交班
            nextshift: function () {
                // 判断是否有交班员 没有就提示
                if (this.$store.getters.cartList.length > 0) {
                    Util.toast('当前收银未结束<br>不能交班', 'notice', 2000);
                    return;
                }
                if (this.$store.getters.shiftUsers.length <= 1) {
                    Util.toast('无店员可交班', 'notice', 2000);
                    return;
                }
                this.$router.push({path: '/nextshift'});
            },
            //初始化时钟
            initClock: function () {
                var self = this;
                function newTimer() {
                    stopit();
                    var today = new Date();
                    var str = '';
                    var month = today.getMonth() + 1;
                    str +=  month + "月";
                    var strDate = today.getDate();
                    if (strDate >= 0 && strDate <= 9) {strDate = "0" + strDate;}
                    str += strDate + "日";
                    str += '<span class="week">' + week() +'</span>';
                    var hh = today.getHours();
                    if (hh < 10) hh = '0' + hh;
                    var mm = today.getMinutes();
                    if (mm < 10) mm = '0' + mm;
                    var ss = today.getSeconds();
                    if (ss < 10) ss = '0' + ss;
                    str +=  hh;
                    str += ":" + mm;
                    str += ":" + ss;
                    var o = document.getElementById("J_Clock");
                    if (o) {
                        o.innerHTML = str;
                        self.slidint = setTimeout(newTimer, 1000);
                    }
                }

                function stopit() {
                    clearTimeout(self.slidint);
                }

                function week() {
                    var d, day, x, s = " ";
                    var x = new Array("周日", "周一", "周二");
                    var x = x.concat("周三", "周四", "周五");
                    var x = x.concat("周六");
                    d = new Date();
                    day = d.getDay();
                    return (s += x[day]);
                }

                newTimer();
            },
            //初始化网络状态
            initNetWorkStatus: function () {
                var self = this;
                //初始化设置网络状态
                this.$store.dispatch('setNetWorkStatus', window.navigator.onLine);
                //检测事件 更新setNetWorkStatus
                window.addEventListener("online", function () {
                    self.$store.dispatch('setNetWorkStatus', window.navigator.onLine);
                }, false);
                window.addEventListener("offline", function () {
                    self.$store.dispatch('setNetWorkStatus', window.navigator.onLine);
                }, false);
            },
            //初始化店铺信息
            initshopinfo: function () {
                var res = Win.getShopInfo();
                if (res.status) {
                    this.shopName = res.entry.shopName;
                    localStorage.setItem('posShopName',res.entry.shopName);
                } else {
                    this.shopName = '';
                    localStorage.setItem('posShopName','');
                }
            },
            //初始化交班信息
            queryLoginUserInfo: function () {
                var res = Win.queryLoginUserInfo();
                if (res.status) {
                    this.realName = (res.entry && res.entry.realName) ? res.entry.realName : '';
                    localStorage.setItem('posCurShift',this.realName);
                }
                //判断是否可以交班
                this.$store.dispatch('getShiftUsers');
            },
            //最小化窗口
            miniwindow: function () {
                Win.miniWin();
            }
        }
    }
</script>
<style lang="less" rel="stylesheet/less" scoped>

    .fade-enter-active, .fade-leave-active {
        transition: opacity .5s ease;
    }

    .fade-enter, .fade-leave-active {
        opacity: 0
    }

    .bd-r {
        border-right: #444 solid 1px;
        padding-left: 10px;
    }
    .line {
        height: 20px;
        width: 1px;
        margin: 0 10px;
        display: inline-block;
        vertical-align: middle;
        background-color: #000;
        opacity: 0.2;
    }
    .main-header {
        height: 40px;
        line-height: 40px;
        background-color: #2E2F31;
        border-bottom: #232426 solid 1px;
        font-size: 14px;
        .info,
        .logo {
            vertical-align: middle;
        }
        .logo {
            width: 20px;
            height: 20px;
            margin-left: 20px;
            margin-right: 4px;
            display: inline-block;
            vertical-align: text-bottom;
            background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAWCAYAAADEtGw7AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyppVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTMyIDc5LjE1OTI4NCwgMjAxNi8wNC8xOS0xMzoxMzo0MCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTUuNSAoTWFjaW50b3NoKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo4Mjk4MjA5M0ZCRTMxMUU2QTQzMUU1QzI1QUYwNkI0NyIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDo4Mjk4MjA5NEZCRTMxMUU2QTQzMUU1QzI1QUYwNkI0NyI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjgyOTgyMDkxRkJFMzExRTZBNDMxRTVDMjVBRjA2QjQ3IiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjgyOTgyMDkyRkJFMzExRTZBNDMxRTVDMjVBRjA2QjQ3Ii8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+KYbssAAABARJREFUeNq0lU1oXVUQx2fO/crLF69JW7VaRSrWEqWJoKgbS7FKS+lKwUUR7Ca0KioGEXTlTl2IIEjxY+OiVHRlBRddFEWFlHzUtDatbUWwKElf8vK+7tc5M8459yV5KYm46X3MfZdzzv2dmf/MmYvMDLfi8u0NETdcwC8M3qlryQOo89sBDHiMf0BTj+MZ0Bu+I86iu60Dzl++Z68Xxy9xPd2jkmwAyHJIfvKigtME/A2Smg1O6TP/Czx3bKh30G+8h3E2is3Eo3oKlOeyWpCyDD0AT+LUBiaAoY4EF+d8M7btW2h1gtWand7c2TeA9ZMqzY5xNfb0kkAT8VQzFK4WfC37CHA3azznGTw6WPNP8NPQ08laAcs7aBbqH3pJcoBvNIEaKYCDCskUYHaGwAbBI/RlzKQpzIeAh9Jq8MG6YHN48wHVTI5QJf6dGtk/aKH5KtSZAF3KxMiqo2FJGYi0+OATjCYj/lNrwPycJLuejmEjQW6k73BLn/DIQq3ZUCxkFRoUckxCBn2+wX6bV4+EpdUb7DIBRfJgX7SLEKck7IhyqgFxIHMlYCxygVBFwLKvZD24vX4V2FeK4FUg3GLB4jmQ4RZr/6HoUnzN1bExMOKBiXQu2STutyS7n6V4UjKGeFEefxRVpMq4wqQkRH4dCQd1O7HCgIixO+Z8WJAFmDUNO4okhqyXxOCBU4JFyinxdkGG7lcatktxehJOl8tpZ1JNUQFg1PYVjUWPsoW6CbaDdgP4W8r7UHBWPyK2L4z0ozL3roTv5xKZS55pmwZXKfZf5PBWq4Lg7HLNQdE6jHh71B83p67cB8HiiP8k/gT1YFK/L3p+HLTr2YpNDiaPum2G51arAvC8DLKFWm20wcthr/lufif03dYXHO9WeHppJHjFBsO5+iI3kN8MZdG6pUVUVudXwPOpPifaXnIxiMYid8U2Gb8U7JAFz4fo9hudH4JuQ9mCJCq1HpODo/uXAyM5wZlyOf9tBbxtQs65geNotSWn+Q5+HAY2TefTGvBwRvALKnx26wVoKOU/6BP2GGPXFutJnpWVh+ETvCDV3Xnygiz/VEIcV66X4h1ZHL5lx8tT2ddX0nxP/0Q2y0PQK0l6W441Om/bVhJoy/APtVL+5TJvTXfjh8NdUmHfC/xuW5dSGZ83VT62aRqqLHonHJ4MCfY3RU+nr3jbJVCJ6Kr00mfKc+nVdbsbTmYXdY4HpSVOycGwDefFUhJttXMp+Y91Ae8Xz1yJ2dC7HZTHtcaDy9A1X5DOK5rJZngY9moKX5NwqtFsdrkIx7sWE93oZdgcs+tPf8bEn2mjP9pSgfrNnA2/IOtdi/cGu3sYnkgy+quG5ue7rkPlPz9Nt+L6V4ABAGX3jIl2yLI4AAAAAElFTkSuQmCC");
        }
        .title {
            font-size: 16px;
            color: #FFF;
            margin-right: 20px;
        }
        .sub-title {
            opacity: 0.55;
            font-size: 14px;
            color: #FFFFFF;
        }
        .group-btn {
            float: right;
            margin-right: 20px;
            .btn {
                font-size: 14px;
                color: #FFF;
                background-repeat: no-repeat;
                background-position: 0 -1px;
                padding-left: 24px;
                cursor: pointer;
            }
            .btn-next {
                margin-right: 30px;
                background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAWCAYAAADEtGw7AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyppVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTMyIDc5LjE1OTI4NCwgMjAxNi8wNC8xOS0xMzoxMzo0MCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTUuNSAoTWFjaW50b3NoKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDpBMzY0MzAzN0ZCRTIxMUU2QTQzMUU1QzI1QUYwNkI0NyIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDpBMzY0MzAzOEZCRTIxMUU2QTQzMUU1QzI1QUYwNkI0NyI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOkEzNjQzMDM1RkJFMjExRTZBNDMxRTVDMjVBRjA2QjQ3IiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOkEzNjQzMDM2RkJFMjExRTZBNDMxRTVDMjVBRjA2QjQ3Ii8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+UxS/IgAAAS1JREFUeNq0lctNw0AQQFkkiyiXNEABlmuwC0g4UQAfmQsU4SagBRJ8RaKTXOGCAfmIkOCGlrfS2Fk5/uL1Sk+xvJMXZzwzq7TWB5OsvmLifHiBZ0jhDI4anUOemNgAcr1b73A5WmzJ3yCGW/iFe/BGieWLc+s6hC/YgBolrvkhI/+G60FiYpbwCpm5bohJ4BMWQ8SZ9cKypvTAB9wY56GrslVK/fDxBKe967hPKiTuXMrRzcuryFVnKghYVfJb5tnsNaREl6mQDrroeGl78rYxUTzxFqKamOOWP9S2V4of4cTuKCfTTYraFHfibGIWVWHaUdoydC02ZfIgAyWqGzj/EssND9YyCu/gSiomGCW2NmIRFisfIm/tPO7PpEVTOY7MseT3FaupDtM/AQYASJHHEfRZZQYAAAAASUVORK5CYII=");
            }
            .btn-lock {
                margin-right: 40px;
                background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAWCAYAAADEtGw7AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyppVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTMyIDc5LjE1OTI4NCwgMjAxNi8wNC8xOS0xMzoxMzo0MCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTUuNSAoTWFjaW50b3NoKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDpDQUVBOTA0OEZCRTIxMUU2QTQzMUU1QzI1QUYwNkI0NyIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDpGQTdCMUFCMkZCRTIxMUU2QTQzMUU1QzI1QUYwNkI0NyI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOkNBRUE5MDQ2RkJFMjExRTZBNDMxRTVDMjVBRjA2QjQ3IiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOkNBRUE5MDQ3RkJFMjExRTZBNDMxRTVDMjVBRjA2QjQ3Ii8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+F6eeigAAAL1JREFUeNpi/P//PwMtABMDjQCGwYyMjCgYCGyBeBMQP4NiENsWizpUAAoKZIwmVwXEf/9jApBYFV5zcBkMZNtCDfgJxBVALAnF5VAxkJwtOQZvhLquAosvy6Fym8gx+ClUsxQWg6Wgck9xGcyIHq6wiPgPlWDEGjOY8ujm0Cy5MWLJIOTmGMaBySB0NzghKYMhMTmDaINZiFV47vyFIRYUpAKig8LYyICBlKJ7eKTjI2SYc4SYoBjcqQIgwACFZva4ubwsLQAAAABJRU5ErkJggg==");
            }
            .icon {
                width: 22px;
                height: 22px;
                display: inline-block;
                cursor: pointer;
                background-repeat: no-repeat;
                background-position: 0 0px;
                vertical-align: middle;
            }
            .icon-wifi {
                margin-right: 10px;
                background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAWCAYAAADEtGw7AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyppVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTMyIDc5LjE1OTI4NCwgMjAxNi8wNC8xOS0xMzoxMzo0MCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTUuNSAoTWFjaW50b3NoKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDoxMUYwRkM2NkZCRTMxMUU2QTQzMUU1QzI1QUYwNkI0NyIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDoxMUYwRkM2N0ZCRTMxMUU2QTQzMUU1QzI1QUYwNkI0NyI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOkZBN0IxQUJCRkJFMjExRTZBNDMxRTVDMjVBRjA2QjQ3IiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOkZBN0IxQUJDRkJFMjExRTZBNDMxRTVDMjVBRjA2QjQ3Ii8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+xdig4wAAAUJJREFUeNrslb9KA0EQh28FObBKefZKyoCINqaz8U+ZysZnyEP4JkHEmE6SJlWw9Q0EO7UKBpUUgTu/CXOyrrtmQ7zOgY9LZmd+m/vtsDFFUSRVxFpSUVQmbHxJ7Fnn0YRT2IVNyHT5BZ7hHm5hZIyZ/boLgjW4gEkRHxPtqYVE2zAONE/hUZkGasaqYUrBDbh2imbQg3PIPD8i07We1trRFU0p6lvJHK5gO/aQpFZ7ckunLwt1eIIPaHkaU9iBE0U+p566lmqIVr1MinjDKdyDG3jz+PmuNuw7PY0vUc/O4nlnianozD1dNMdzf5LkyEq9whAe9PsWHII9XgNm+XjRYdietwN+prr23dOIk/7heaAu6KmJaJb75AwONHUHl7x6vtJlogPvRnflW8ryvIx4T5cQ/ztRRzxa1Pz/NZXxKcAAJaMZVDmscoUAAAAASUVORK5CYII=");
            }
            .icon-wifi-disabled {
                background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAWCAYAAADEtGw7AAAAAXNSR0IArs4c6QAAAoZJREFUOBHllD9ME1Ecx++qTSNxcHVGQ1zs/WkLRB2IJhUXHZw0Ypo4AJ3QQcq/DV1Kiw66G0gMLWsXDCQaBZK2zEZZddOYttb+u/P7fb0zr3Atkrj5S7537/3ee597931/VAWhacZdy7Zfoeg7199f+7y/H0C5fPKEeqNYLL5jn+OGT4bGJyca2exaYHT0ehWg082WnTMM48pxoezvUxS1oqpqi5VSuWyhrDx9snjqX8BhhXkrqBn1i0HdTi6lftkIy7LsxMysyEUGh1v5fL6CdAn6BL2F0tBVyM9JdQ0Znl5+Bsvb8Ln5BZsfHBq+ZMNvpg/GDyQWoTOecDRMbWy8KZmhiAABLgCc+ezcvEU4Z14oFMQficbOxzcyIFV8AIU+aA0Ssbm5ZRtmWICWUuk6k4Q/nk78JBwqxWKxm0jfh9ahBiRHBpU+BY+clKUFr2OxBxNenstwd7eg/3mOgYR9eDNyBA9AXyAuzm3XJ9lzLGgNbWLm04mZqjtzF84xHAuRQdaAawfhQRfqdIxkMusfXFu8PNd0s3IAHvwDlWEOkJ6vQCLoudeCurslFB6sR6PRawc5h+qgyZ4T/j2Tyb7XjVCTFqTSy00muaAuPBwZasgzPwR1Zix7zu3De6PrIcJWbHl53gve4XkvuNduaW9mT3w7iRnjPlHuQJeZSSZT1ZXV1Tjy/rGxe7VHD6cCKCvj45O1nd1dcSuqAb/Jvj0Dg7jhO4Key/t8e3vHxhqIe0XT9BfojKvsiEAn7skt6KzT9SveI7oeumAr4sT6cSPycPh8qvJyb68YR905186Ibi8Jzi4jGPiRBR4iFy5D2fbXQbjzgY4x4oQGzedoO/LvOwb+P5XfxkWgPk4ITPgAAAAASUVORK5CYII=");
            }
            .icon-window {
                background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAWCAYAAADEtGw7AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyppVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTMyIDc5LjE1OTI4NCwgMjAxNi8wNC8xOS0xMzoxMzo0MCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTUuNSAoTWFjaW50b3NoKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo4Mjk4MjA4RkZCRTMxMUU2QTQzMUU1QzI1QUYwNkI0NyIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDo4Mjk4MjA5MEZCRTMxMUU2QTQzMUU1QzI1QUYwNkI0NyI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjExRjBGQzcwRkJFMzExRTZBNDMxRTVDMjVBRjA2QjQ3IiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjgyOTgyMDhFRkJFMzExRTZBNDMxRTVDMjVBRjA2QjQ3Ii8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+5W0YMwAAAHNJREFUeNpi/P//PwMtABMDjQDMYE8gfgzE/ynEIDO8QAYyQoMCJCBDJcc+AWJZmMFgghEIKDHxPyLCGGkexlQHLER4CwUQG1z0dzGlETn0Im/U4FGDcWcQUFEn85861ckTZBenwwSoYGgackE/dMIYIMAAJ7ox5SF+XZwAAAAASUVORK5CYII=");
            }
        }
    }
    /* ======================= 800分辨率 ======================= */
    @media screen and (max-width:1023px){
        .pos-user {
            text-align: left;
        }
        .sub-title {
            .month,
            .week {
                display: none;
            }
        }
        .main-header .group-btn {
            .btn-next {
                margin-right: 0;
            }
            .btn-lock {
                margin-right: 10px;
            }
        }
        /*.nav {*/
        /*padding-left: 50px;*/
        /*}*/
    }
</style>