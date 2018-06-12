<template>
    <div class="top-search">
        <div class="search-panel">
            <input v-focus v-model="barcode" class="code-input J_InputCode" @focus="inputfocus" @blur="inputblur" type="text" placeholder="扫码 或 输入商品条形码" @keydown.enter="search">
            <span class="code-btn" :class="{'code-btn-active':isActive}" @click="search">
                    <p class="num">确定</p>
                    <p class="key">[enter]</p>
                </span>
        </div>
    </div>
</template>
<script>
    import Util from '../libs/util';
    window.inputType = 'hand'; //输入方式 hand 手动 ; machine 扫码枪
    export default{
        data(){
            return{
                barcode:''
            }
        },
        methods:{
            search:function ($event) {
                if(this.barcode == '') {
                    return;
                }
                if(!Util.isValidBarcode(this.barcode)){
                    Util.toast('条形码错误','failed',2000);
                    return false;
                }
                this.$emit('fromtopsearch',$event,this.barcode);
				this.barcode = '';
            },
            inputfocus:function (e) {
                window.inputType = 'hand';
            },
            inputblur:function (e) {
                window.inputType = 'machine';
            }
        },
        computed:{
            isActive:function () {
                if(this.barcode){
                    return true;
                }
                return false;
            }
        }
    }
</script>
<style lang="less" rel="stylesheet/less">
    .top-search {
        height: 70px;
        -webkit-box-shadow:0px 5px 10px #ddd;
        box-shadow: 0px 5px 10px #ddd;
        background-color: #fff;
        .search-panel {
            width: 420px;
            height: 40px;
            float: left;
            overflow: hidden;
            margin: 15px 0 0 15px;
            border: 1px solid #E4E4E4;
            background-color: #fff;
            border-radius: 6px;
            .code-input {
                width: 337px;
                padding-left: 8px;
                height: 40px;
                border: none;
                vertical-align: middle;
                outline: 0;
                font-size: 14px;
                color: #999;
            }
            .code-btn {
                width: 70px;
                height: 40px;
                text-align: center;
                vertical-align: middle;
                display: inline-block;
                cursor: pointer;
                font-size: 14px;
                color: #CCC;
                background: #FAFAFA;
                border-left: 1px solid #E4E4E4;
                .num {
                    font-size: 14px;
                    line-height: 26px;
                }
                .key {
                    font-size: 12px;
                    line-height: 6px;
                }
            }
            .code-btn-active {
                background-color: #fff;
                color: #333;
            }
        }
    }
</style>