<template>
    <div id="content" class="print-test">
        <!--<div class="icon-close" @click="backHome"></div>-->
        <div class="wrapper clearfix">
            <!--左侧拦-->
            <div class="aside">
                <img src="http://imgsize.52shangou.com/img/n/03/22/1490163422396_4188.png"/>
            </div>
            <div class="section">
                <template v-if="!isStartPrint">
                    <div class="start">
                        <p class="title">小票机连接设置</p>
                        <p class="remind-text">请确保小票机已接入POS机</p>
                        <button class="start-btn print-btn" @click="startPrint">开始打印</button>
                    </div>
                </template>
                <template v-else>
                    <div class="test">
                        <p class="title">小票机打印测试</p>
                        <p class="remind-text">请确保小票机已接入POS机</p>
                        <div class="print-interface-list">
                            <table class="print-table">
                                <tbody>
                                <tr v-for="(item, index) in currentTestDeviceList">
                                    <td>接口{{index+1}}  打印检测</td>
                                    <td v-if="item.printStatus === 'start'" style="color: #E13D31;">打印中...</td>
                                    <td v-if="item.printStatus === 'finished'">打印结束</td>
                                    <td v-if="item.printStatus === 'failed'">打印失败 <i class="icon icon-wrong"></i></td>
                                    <td v-if="item.printStatus === 'succeed'">打印成功 <i class="icon icon-right"></i></td>
                                </tr>
                                </tbody>
                            </table>
                        </div>
                        <template v-if="printDeviceList.length == 0">
                            <div class="no-device">
                                <p>小票机打印失败</p>
                                <p>请检查小票机是否已接入Pos机，或是否安装打印机驱动</p>
                            </div>
                        </template>
                        <template v-if="isShowPopover">
                            <div class="popover confirm-print-result">
                                <div class="popover-body">
                                    <p>打印机是否已正确打印出小票？</p>
                                </div>
                                <div class="popover-footer">
                                    <button class="sure-btn" @click="testSucceed">是</button>
                                    <button class="gray-btn" @click="testFailed">否</button>
                                </div>
                            </div>
                        </template>
                        <template v-if="isListTestFinished">
                            <div v-if="isPrintSucceed" class="print-result">
                                <button class="sure-btn" @click="updateConfig">完成</button>
                            </div>
                            <div class="print-result" v-else>
                                <button class="sure-btn" @click="startPrint">重试</button>
                                <button class="gray-btn" @click="updateConfig">跳过</button>
                            </div>
                        </template>
                    </div>
                </template>
            </div>
        </div>
    </div>
</template>

<script>
    import Util from '../../libs/util';
    import Win from '../../libs/win';
    import Ajax from '../../libs/io';
    import NativePrint from '../../libs/winprint';

    export default {
        data () {
            return {
                isStartPrint: false,
                printDeviceList: [],//printStatus
                currentTestDeviceList: [], //当前测试的驱动列表
                isShowPopover: true,
                isListTestFinished: false, //驱动列表是否测试完毕
                isPrintSucceed: false, //是否正确打印小票
                printCfg: {}, //测试打印的配置
            }
        },
        methods: {
            resetData: function () {
                Object.assign(this.$data, this.$options.data());
            },
            startPrint: function () {
                this.resetData();
                this.isStartPrint = true;
                this.queryPrintDeviceList(); //打印列表
                this.testNextDevice();
            },
            queryPrintDeviceList: function () {
                try {
                    let data = Win.queryPrintDeviceList();
                    if (data && data.status) {
                        let printDeviceList = data.entry || [];
                        let res = [];
                        for (let key in printDeviceList) {
                            let d = printDeviceList[key] || {};
                            let item = {
                                printDeviceName: d.printDeviceName,
                                printDevicePath: d.printDevicePath,
                                printDeviceType: d.printDeviceType,
                                printStatus: 'start'
                            };
                            res.push(item);
                        }
                        this.printDeviceList = res;
                    }
                } catch (e) {
                    console.log(e);
                }
            },
            //没有正确打印出小票
            testFailed: function () {
                let currentTestDeviceListLen = this.currentTestDeviceList.length;
                if (currentTestDeviceListLen > 0) {
                    this.currentTestDeviceList[currentTestDeviceListLen-1].printStatus = 'failed';
                }
                this.testNextDevice();
            },
            //正确打印小票
            testSucceed: function () {
                let currentTestDeviceListLen = this.currentTestDeviceList.length;
                if (currentTestDeviceListLen > 0) {
                    this.currentTestDeviceList[currentTestDeviceListLen-1].printStatus = 'succeed';
                }
                this.isShowPopover = false;
                this.isPrintSucceed = true;
                this.isListTestFinished = true;
            },
            //检测下一个打印驱动
            testNextDevice: function () {
                let self = this;
                let currentTestDeviceListLen = this.currentTestDeviceList.length; //当前已经检测的驱动列表长度
                let printDeviceListLen = this.printDeviceList.length; //驱动列表长度
                if (currentTestDeviceListLen >= printDeviceListLen) {
                    this.isShowPopover = false;
                    this.isPrintSucceed = false;
                    this.isListTestFinished = true;
                    return;
                }
                this.isShowPopover = false;
                this.currentTestDeviceList.push(this.printDeviceList[currentTestDeviceListLen]);
                let currentDevice = this.currentTestDeviceList[currentTestDeviceListLen];
                this.printCfg = currentDevice;
                let currentCfg = {
                    printDevicePath: currentDevice.printDevicePath,
                    printDeviceType: currentDevice.printDeviceType
                };
                NativePrint(currentCfg, 'test');
                //延迟1s改变打印状态
                setTimeout(function () {
                    if (self.currentTestDeviceList[currentTestDeviceListLen].printStatus === 'start') {
                        self.currentTestDeviceList[currentTestDeviceListLen].printStatus = 'finished';
                        self.isShowPopover = true;
                    }
                }, 1000);
            },
            //更新配置信息
            updateConfig: function () {
                //完成后，保存配置
                if (this.isPrintSucceed) {
                    let cfg = {
                        printerDriver: this.printCfg.printDeviceName,
                        printerDriverPath: this.printCfg.printDevicePath,
                        printerType: this.printCfg.printerType
                    };
                    let data = Win.updateConfig(cfg);
                    Util.toast(data.message, data && data.status ? 'succeed' : 'failed', 2000);
                }
                this.backHome();
            },
            //返回首页
            backHome: function () {
                this.$router.push({path: 'home'});
            },
        },
        computed: {},
        components: {}
    }
</script>

<style lang="less" rel="stylesheet/less" scoped>
    .print-test {
        position: relative;
        height: 100%;
        overflow-y: hidden;
        * {
            box-sizing: border-box;
            outline: none;
        }
    }
    .icon-close {
        position: absolute;
        top: 15px;
        right: 15px;
        width: 18px;
        height: 18px;
        background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAOCAYAAAAfSC3RAAAAAXNSR0IArs4c6QAAAMlJREFUKBWVkrERwjAMRSVRwAJskSkyBVvQ0CQ9pGYLpsgUbMECUIDJS06c47OTQ4V9J/3nL8vWU3uu3h+97lQOXdc+ZCGa5rJ/BrltLBwNSCTUL5GeQomjhgYtjOGkqvcQQlWCHUKDdmRwSAtbkdrbLtXUW8sJqNGFO8UH/kBEKUwuB5GfgSRieBQMd4qdyBE2bf+vM8fYjelx3GqrKUR7gIvDyUGrz7EE4UjkNMbfK91jwkRwp3X/YTDGhx1epc+N3EF2h9HCfAHyfsZAyvXsGwAAAABJRU5ErkJggg==") no-repeat center center;

    }
    button {
        width: 80px;
        height: 32px;
        border: 1px solid rgba(0,0,0,0.10);
        border-radius: 4px;
        letter-spacing: 0;
    }
    .sure-btn {
        background: #E13D31;
        color: #fff;
    }
    .gray-btn {
        background: #FAFAFA;
        border-radius: 4px;
    }

    .wrapper {
        width: 100%;
        height: 100%;
    }

    //对号，错号
    .icon-right, .icon-wrong {
        display: inline-block;
        position: relative;
        box-sizing: border-box;
        width: 16px;
        height: 16px;
        vertical-align: middle;
        margin-left: 10px;
    }

    .icon-right:before, .icon-right:after {
        display: inline-block;
        position: absolute;
        box-sizing: border-box;
        content: "";
        background: #67A259;
        left: 0;
        top: 7px;
    }
    .icon-right:before {
        width: 10px;
        height: 2px;
        transform: rotate(45deg);
    }
    .icon-right:after {
        width: 18px;
        height: 2px;
        transform: rotate(-45deg);
        left: 5px;
        top: 4px;
    }

    .icon-wrong:before, .icon-wrong:after {
        display: inline-block;
        position: absolute;
        left: -2px;
        top: 6px;
        box-sizing: border-box;
        content: "";
        width: 18px;
        height: 2px;
        background: #E13D31;
    }

    .icon-wrong:before {
        transform: rotate(45deg);
    }
    .icon-wrong:after {
        transform: rotate(-45deg);
    }

    .aside {
        float: left;
        width: 350px;
        background-color: #444;
        height: 100%;
        position: relative;
        z-index: 100;
        img {
            width: 100%;
            height: 100%;
        }
    }

    .section {
        margin-left: 350px;

        .start {
            margin: 127px 40px 0 40px;
            p {
                font-size: 16px;
                color: #666666;
                letter-spacing: 0;
                line-height: 16px;
            }
            .remind-text {
                padding-bottom: 25px;
                border-bottom: 1px solid #e6e6e6;
            }
            .title {
                font-size: 28px;
                color: #333333;
                line-height: 28px;
                margin-bottom: 25px;
            }
            .start-btn {
                width: 180px;
                height: 50px;
                background: #E13D31;
                font-size: 18px;
                color: #fff;
                margin-top: 50px;
            }
        }

        //测试
        .test {
            margin: 100px 40px 0 40px;
            p {
                font-size: 14px;
                color: #666666;
                letter-spacing: 0;
                line-height: 14px;
            }
            .remind-text {
                padding-bottom: 20px;
                border-bottom: 1px solid #e6e6e6;
            }
            .title {
                font-size: 26px;
                color: #333333;
                letter-spacing: 0;
                line-height: 26px;
                margin-bottom: 31px;
            }
            .print-interface-list {
                max-height: 450px;
                overflow-y: auto;
            }
            .print-table {
                width: 100%;
                margin-top: 38px;
                font-size: 16px;
                color: #666;
                letter-spacing: 0;
                line-height: 16px;
                tbody tr td{
                    width: 50%;
                    padding: 15px 0;
                    &:first-child {
                        text-align: left;
                    }
                    &:last-child {
                        padding-right: 5px;
                        text-align: right;
                        color: #999;
                    }
                }
            }
        }

        //无打印驱动和没连接打印机的情况
        .no-device {
            padding: 25px 0;
            height: 98px;
            background:#fff9d4;
            border:1px solid #ebe5c5;
            border-radius:2px;
            font-size:18px;
            letter-spacing:0;
            text-align:center;
            p {
                &:first-child {
                    font-size:18px;
                    line-height: 18px;
                    color:#8b572a;
                    margin-bottom: 15px;
                }
                &:last-child {
                    font-size:14px;
                    line-height: 14px;
                    color:#ad7e54;
                }
            }
        }

        //弹层
        .popover {
            z-index: 99;
            position: relative;
            width: 520px;
            height: 210px;
            padding: 30px;
            background: #FFFFFF;
            border: 1px solid #E6E6E6;
            -webkit-box-shadow: 0 0 10px 0 rgba(0,0,0,0.04);
            -moz-box-shadow: 0 0 10px 0 rgba(0,0,0,0.04);
            box-shadow: 0 0 10px 0 rgba(0,0,0,0.04);
            border-radius: 4px;
            letter-spacing: 0;
            &:before, &:after {
                height: 0; width: 0;
                position: absolute;
                left: 35px;
                content: "";
                border: 10px solid transparent;
            }
            &:before {
                top: -20px;
                border-bottom-color: #e6e6e6;
            }
            &:after {
                top: -19px;
                border-bottom-color: #ffffff;
            }
            .popover-body {
                height: 100px;
                margin-top: 10px;
                p {
                    font-size: 18px;
                    color: #333333;
                    line-height: 18px;
                }
            }
            .popover-footer {
                text-align: right;
                font-size: 0; //去除按钮间的间隙
                button {
                    width: 160px;
                    height: 40px;
                    font-size: 16px;
                    &:last-child {
                        margin-left: 20px;
                    }
                }
            }
        }

        .print-result {
            position: absolute;
            bottom: 60px;
            font-size: 0;
            button {
                font-size: 18px;
                width: 180px;
                height: 50px;
                &:last-child {
                    margin-left: 24px;
                }
            }
        }


    }
</style>