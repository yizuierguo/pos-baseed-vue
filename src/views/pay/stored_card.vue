<template>
    <div>
        <h1 class="balance-title">储值卡</h1>
        <div class="editArea">
            <ul>
                <template v-if="getIsAllowMemberPrice">
                    <li class="liH">
                        <label>应收</label>
                        <template v-if="getWipingZeroStatus">
                            <input class="inputW" v-model="totalPrice" v-focus type="number" />
                            <span class="wipingZero" @click="wipingZero">取消抹零[M]</span>
                        </template>
                        <template v-else>
                            <span class="receivable">{{ getOriginalPrice | formatPrice(2) }}</span>
                            <span class="wipingZero" @click="wipingZero">抹零[M]</span>
                        </template>
                    </li>
                    <li class="wipingZeroInfo">
                        <template v-if="getWipingZeroStatus">
                            原应收  <span>{{getOriginalPrice | formatPrice(2)}}</span>，已抹零{{ getWipingZeroNum | formatPrice(2) }}
                        </template>
                    </li>
                    <li class="wipingZeroAmount balanceTop">
                        <label>账户余额</label>
                        <span>{{ getBalance | formatPrice(2) }}</span>
                    </li>
                    <li class="wipingZeroAmount">
                        <label>收款后余额</label>
                        <span class="fontRed">{{ backBalance }}</span>
                    </li>
                </template>
                <template v-else>
                    <li class="notVip">
                        <i class="icon"></i>
                        请返回收银，输入会员后使用
                    </li>
                </template>
            </ul>

        </div>
        <template v-if="isEncryption">
            <div class="passwordArea">
                <h2>请会员输入密码</h2>
                <div class="passwordText">
                    <div class="password"></div>
                    <div class="passwordStyle">
                        <div class="blinkLine" :style="blinkLine"></div>
                        <div class="nowPwdLocation2" :style="styleObject2"></div>
                        <span v-for="i in spans" >
                            {{i}}
                        </span>
                    </div>
                </div>
                <div class="tips">{{tips}}</div>
                <div class="cancel">取消[esc]</div>
            </div>
        </template>
    </div>
</template>
<script>
    import { mapGetters } from 'vuex';
    export default{
        data(){
            return {
                totalPrice: '',//应收
                netReceipts: '',//实收
                backBalance : '900.00',
                isEncryption : false, //是否有密码
                isVip : true,
                tips : '密码输入错误',
                spans:['','','','','',''],
                blinkLine: {
                        left:'34px',
                        display:'block',
                    },
                styleObject2: {
                        left: '0px'
                    },
                password:'',
                map:{
                    '48':'0',
                    '49':'1',
                    '50':'2',
                    '51':'3',
                    '52':'4',
                    '53':'5',
                    '54':'6',
                    '55':'7',
                    '56':'8',
                    '57':'9',
                    '96':'0',
                    '97':'1',
                    '98':'2',
                    '99':'3',
                    '100':'4',
                    '101':'5',
                    '102':'6',
                    '103':'7',
                    '104':'8',
                    '105':'9',
                },
            }
        },
        created:function(){
            this.init();
            var _this = this;
            if (!_this.isEncryption) {
                return
            }
            window.onkeydown = function(e){
                var keyDetail = _this.map[e.keyCode]||'';
                if ( e.keyCode == 8) {
                    if (_this.password.length > 0) {
                       _this.password =  _this.password.substr(0,_this.password.length-1);
                       _this.spans[_this.password.length] = '';
                    }
                }else {
                    _this.password += e.key;
                    var answer = _this.password.match(/\d{1,6}/g)||'';
                    _this.password = answer == '' ? '' : answer[0];
                    _this.spans[_this.password.length-1] = '*';
                }
                if (_this.password.length == 6) {
                    _this.blinkLine.display = 'none';
                    _this.styleObject2.left = '350px';
                    // console.log(_this.password.length)
                }else{
                    _this.blinkLine.display = 'block';
                    _this.blinkLine.left = (_this.password.length*70+34)+'px';
                    _this.styleObject2.left = (_this.password.length*70)+'px';
                }

                console.log(_this.password)
            }
        },
        components : {

        },
        methods : {
            /**
             * 初始化数据
             */
            init: function(){
                this.totalPrice = this.getWipingZeroStatus ? (this.getTotalPrice / 100 ).toFixed(2) : (this.getOriginalPrice / 100 ).toFixed(2);
                //设置支付类型
                console.log(this.getIsAllowMemberPrice);
                this.$store.dispatch('getPayType','5')
            },
            showScanPrompt : function(){
                this.scanPrompt = !this.scanPrompt;
                console.log(this.scanPrompt);
            },
            /**
             * 抹零，仅处理系统抹零规则，不包括手动修改抹零值
             */
            wipingZero: function(){
                this.$store.dispatch('getWipingZeroStatus');
                this.$store.dispatch('getWipingZero');
                if(this.getWipingZeroStatus){
                    this.totalPrice = (this.getWipingZeroBackNum / 100).toFixed(2);
                } else {
                    this.totalPrice = this.getOriginalPrice
                }
                this.$store.dispatch('setPayInfo');
            },

        },
        computed: {
            ...mapGetters([
                'orderList',          //订单
                'getBalance',
                'getIsAllowMemberPrice',
                'getWipingZeroStatus',//抹零状态
                'getOriginalPrice',//原价
                'getWipingZeroBackNum',//抹零后价格
                'getTotalPrice',//最终抹零后的价格
            ]),
            /**
             * 获取抹零数
             * @returns {string}
             */
            getWipingZeroNum : function(){
                var data = this.getOriginalPrice - (this.totalPrice * 100);
                var totalPrice = this.totalPrice * 100;
                this.$store.dispatch('setWipingZeroNum', data);
                this.$store.dispatch('setTotalPrice', totalPrice);
                this.$store.dispatch('setPayInfo');
                return data
            },
        }
    }
</script>
<style lang="less" rel="stylesheet/less">
    @keyframes blink{
        0%{
            opacity: 0;
        }
        /*移除渐变效果*/
        50%{
            opacity: 0;
        }
        51%{
            opacity: 1;
        }
        100%{
           opacity: 1;
        }
    }
    @-webkit-keyframes blink{
        0%{
            opacity: 0;
        }
        /*移除渐变效果*/
        50%{
            opacity: 0;
        }
        51%{
            opacity: 1;
        }
        100%{
           opacity: 1;
        }
    }
    .editArea{
        .balanceTop{
            margin-top:0;
            span{
                margin-top:3px;
            }
        }
        .notVip{
            font-size:18px;
            text-align:center;
            margin: 30px 0 0 100px;
            .icon{
                width:100px;
                height:100px;
                display:block;
                margin: 0 auto 30px;
                background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw4pVUAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyppVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTMyIDc5LjE1OTI4NCwgMjAxNi8wNC8xOS0xMzoxMzo0MCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTUuNSAoTWFjaW50b3NoKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo1MENEQUFGM0Y4QUYxMUU2ODE4NTk4NjMwMDlEMjg5RSIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDo1MENEQUFGNEY4QUYxMUU2ODE4NTk4NjMwMDlEMjg5RSI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjUwQ0RBQUYxRjhBRjExRTY4MTg1OTg2MzAwOUQyODlFIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjUwQ0RBQUYyRjhBRjExRTY4MTg1OTg2MzAwOUQyODlFIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+wrshYAAACUFJREFUeNrsXVtoFFcYPju72TWXjSZRczGQ0Ai7ItHmUn2QUNRSKhQs+GIfDIi++tAWqk996JP1QQu+phT0ob4IFQqFUlOK9EGbmGpQs2BqgpckahNNjHE32dj/m5xZJ5O978ycmd3zwWHOTMLsOf83/3/u/+9hDsedO3dqo9Fo6O3bt2ryeDwhelxP+SDlg9oV/0v5OcrPaVd6NEX5COXVFAgEItu3b592cn09TivQzZs3m0iI+yiLtJfyraZW2OMZo8sflPop39/Z2flEEmLArVu3QktLS70k/EN0G7L556E9l30+34WdO3dGSpaQe/fu1b1+/fpzIuEI3e5yyAd6g8i5WFFR8dO2bdv+KwlCSBuaFxcXv6bscUrlDjXlC5T6ysrKzpDWPCpKQgYGBtrocoq+QJgmP3MBqKwxKusFyp7u7u4eLQpCRkZGgvPz899SxU7QrZe5E3Ei53xlZeU34XB4zrWEUI/p8PLy8lnKNrIiAJHyhNJX1DO75CpCiIgW0ogfKO1nRQgi5SqlY0TMuNnvVsx+4dDQ0EEiYqhYyeAD0P2oI+rqWA2hRruMvprvqKBfsBIC1fkc1fkkNfqLjiFkeHi4PhqNXqHsblaauB4IBA62t7dPCSfk9u3b78Visd8o28ZKG6N+v//jHTt2/CuMELKh78fj8V8p28AkgEmv13ugo6PjH9sJGRwc7CHb+QtlqyUPqzBL7cqnXV1d12wjhGvGn5KM1KSQpnyYj6bk3O1Fm8HNlCQjNaohI8jKUkLQm+INuGwzMqMBsoLMLDFZGGfQ5VoJd23z7hJT6sl2nJK1hlBDdUaSkRd2Y8BsqoZgioBs4s9StvmDGvnPqJG/UjAhfKIQc1M1UqwFDPg8nhlKHZkmJDOaLD5rK8koEJAhZFlQG4L1jGKetRVAyn7INC+ThZW+V69eYRdGoxSlqZioqqoKpVp5TKkhWHaVZFiCRi7b7DWEb0iAdnil/CxBnFIo2caJVBpySpJhbS+YyzizhmDf1NLS0qhbturU1tayLVu2qPnHjx+z6elpVzCCLUY+n6/NuO9rjYZgE5tbyCgrK2Otra3M7/erCXk8c0mPy883DKY2WdjeyVZ2FLoC9IXhS9N/deozF+E4l3lyQrDXljl3e+caLCwsMOqaJ+6RxzMXoZzLPKXJ6nVb6zg2NpbIP3z40I2DxSNJCcGRAPrjB26rUH19fdK8i7ALsl9DCM5nuK0maMDr6t6Z4JqaGrZu3TrXMaKXvaJTnUNuq0hDQwNTFGVVo97Y6L7JBb3s1drgGBmz/+RSwdqxcePGNc9dqiUhzsEKIfxMn6u1owi0ZJ/eZO0rBu1wuZbYR4jX62XNzc2sra1NFZYZPatk2mG2lqCsKDPKjjpYjL1q2XEOnAZTlh5w3Lp1K1u/fn3iPhKJrBrQ5To6b29vT0sINwHs7t277M2bN3n9TlVVFQuF3jWrL168YKOj1p5qKy8vr1NwKN9q6lG5dPdmtB1ma4mxjMFg0HKbBS4UeEew+oeM2kD97ry1Y9OmTTmZnHzbEmMZ5+bmLCcEXNhCyIMHD9jU1BR7+fKlet/S0qKasYqKClPbDjO0hMyG2m6gjADKjLLrp2isJMQH3yGwt1YiHo+zR49Wpv3D4TCrrKxU2xQk2OaJiQlMbGbUjs2bN+fVMOP9mdoSEAHyNmzYkJhBnp+fZ/fv37etmwUuMFdt6z7dmZkZlRANEABSJmJy1Q6jlkBLkwEmrampaRUR+rLaPbzykXZU2U0IupFGpCMG445c2o5kWgKzo38niABR+JuRCFGEgAsfd3Fk24/GYjHVFOi1JBUxWI7VvvBCxgF4B9oFEI3GGiSkI0IzVyirnQAX0JCg3XppNFvpiDELWOLVGupsyyhg+iSoaM6/7CbE6RBRRnChiKgsTEGmXpVIiDBXGjAOmSuVL9DpZQMXCvdNKAnRAR0KEQAXwjQkGo060myhTChbyWmIU7VEZJlUDaHrlCTEMWWagskS5onTaWZLpLniJisCkxUp4S/SUWUBF5IQpxEC99siCwET4YT9uKLNFQAuFPhCJ2bGRRbk6dOnwgl59uyZaO0YAxfa1Em/yMI8f/6cTU5OMjtnnXUNqToLjDIIBvzRM5+OkKMiS4PTT1izsHs/FVYS813jNxn9CUIQJUDE12kEBJPv9iC3AxyoV+3BwMDACBO4v7e6ulpdr8C6hZ3ArO74+DibnZ0VyUeku7s7jIyiY+iyyBKJIAPIdeHKIu1IyD5BCOJnMAkh0Ms+QQgPZnJDVKFgNkQsCmkmSyBu6APJ+Ayqc5EadyHBVWDDh4eHS7Exv6i/X7WEi8gybCWYiYQ9WOAyT04ID/PTJ+VkG/qMoZXWbHJAmB+4fZCystxUxSBr4/M1hMD3Bg/zI2EhIONk8a1SbQM6zVZcCElYgziXMcuKEPhxQswlKTfLzNX5VEHGUm6UQwAsukxI8ZmOCS5blhMh8AmoKMqXUn7mAjJNF+kto9/ewcHB36VnUtNM1dWurq6P0hKWxUuOwQmwFGfBZMCR8rGMGpTpH+CJmdTsqBRpwabqaDZh9rLa/Q6f5YhGJsWat3acy8bve9aE8IHMSbYSekEiN1znssuOvFzezMPj/cVkRLZsMRoIBPbkEk4vpwM7eDFCwzGB+4FdhEnIKtfYhjmfoEKcPq/X+wllZ6XMUwJBwQ7kE9MwryNtiD6G0HCSlORkQDb5xjKUgSVNNlPCAktqkKFX3zXgZoReLfgULgqAnkSJd4kRnHhPoWSYQojW+6JLD9nO70tw0Ic695gRKdoUk5WkXTm4vLz8Y7HHrcLcFKZDsh2B26ohhh4Yplk6MLNZxGRcRR3NJsMSDdEDAbBIW86y4gmdNIH1jM7OzkuWkW11DRBcDDGXyISdYO6N2hPHsitW+tItLrmCEA08rtUpqlivWwLGYKsO34FzOtUauGsJ0YCQSjyyDALHODVWCXZv9mHfVLKtOkVFiAZEluHBTHqdEiaDNOJvulzA9k7jjsKiJ8RgzsIkjCM8SoDdh4YiOJ+BIwH6XejCPgqn2QpECeCO6dVE+RaTtQDLqDg+1o9jZNRjeuKodsvpDStcocPjM3zaIsGVKj1ugMNI7i8yqHnFgzcdOHDhVxxWnIS7ChzIR8I5cBw9dnJ9/xdgAGDONeAhEL/aAAAAAElFTkSuQmCC");
            }
        }
    }
    .passwordArea{
        h2{
            text-align:center;
            font-size:18px;
            font-weight:normal;
            margin: 50px auto 32px;
        }
        width:560px;
        height:330px;
        background: #FFFFFF;
        border-radius: 4px;
        position:fixed;
        top:50%;
        left:50%;
        margin-left:-280px;
        margin-top:-165px;
        z-index:9;
        .passwordText{
            width:420px;
            height: 70px;
            margin: 0 auto;
            overflow:hidden;
            border:1px solid #E6E6E6;
            border-right:none;
            .passwordStyle{
                position:absolute;
                span{
                    width:70px;
                    height:70px;
                    display:block;
                    float:left;
                    text-align:center;
                    color:#666;
                    line-height:96px;
                    font-size:50px;
                    border-right:1px solid #E6E6E6;
                }
                .blinkLine{
                    position: absolute;
                    width: 2px;
                    top: 20px;
                    height: 30px;
                    background:#000;
                    animation: blink 1s infinite;
                     -webkit-animation: blink 1s infinite;
                }
                .nowPwdLocation2{
                    position: absolute;
                    width: 69px;
                    height: 69px;
                    display: block;
                    left: -1px;
                    top: -1px;
                    border: 1px solid rgba(82, 168, 236, .8);
                    border-radius: 2px;
                    -webkit-box-shadow: inset 0px 2px 2px rgba(0, 0, 0, 0.75), 0 0 16px rgba(82, 168, 236, 0.6);
                    box-shadow: inset 0 2px 2px rgba(0, 0, 0, 0.075), 0 0 16px rgba(82, 168, 236, 0.6);
                    z-index: 10;
                    transition: all .1s ease-in-out;
                    -webkit-transition: all .1s ease-in-out;
                }
            }
        }
        .tips{
            font-size: 16px;
            color: #E13D31;
            letter-spacing: 0;
            line-height: 16px;
            text-align:center;
            margin:20px auto 43px;
        }
        .cancel{
            width:160px;
            height: 40px;
            line-height:40px;
            text-align:center;
            margin: 0 auto;
            border: 1px solid rgba(0,0,0,0.10);
            border-radius: 4px;
            background: #FAFAFA;
            font-size: 16px;
            color: #333333;
            cursor:pointer;
        }
    }
   
</style>