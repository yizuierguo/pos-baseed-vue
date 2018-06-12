<template>
    <div id="lock-panel">
        <div class="lock-bg">
            <div class="login-panel">
                <span class="avatar">{{curloginuser.firstname}}</span>
                <p class="name">{{curloginuser.realName}}</p>
                <input class="login-input" autocomplete="new-password" v-model="password" placeholder="输入密码" type="password" v-focus @keyup.13="submit"/>
            </div>
        </div>
    </div>
</template>
<script>
    import Util from '../../libs/util';
    import Win from '../../libs/win';
    export default{
        data(){
            return{
                password:''
            }
        },
        mounted:function () {
          document.body.style.backgroundColor = '#2E2F31';
        },
        computed:{
            curloginuser:function () {
                var res = Win.queryLoginUserInfo();
                if(res.status){
                    res.entry.firstname = res.entry.realName.substr(0,1);
                }
                return res.entry;
            }
        },
        methods: {
            submit: function () {
                var self = this;
                if(this.password != ''){
                    var res = Win.unlockpos(this.password);
                    if(res.status){
                        Util.toast('解锁成功','notice',1000,function () {
                            self.$router.push({path: 'home'});
                        });
                    }else {
                        Util.toast(res.message,'notice',2000);
                    }
                }
            }
        }
    }
</script>
<style lang="less" rel="stylesheet/less" scoped>
    #lock-panel {
        width: 100%;
        min-height:600px;
        height: auto!important;
        height: 600px;
        background: #2E2F31;
        .lock-bg {
            width: 100%;
            height: 90px;
            padding-top: 160px;
            background-color: #D33E34;
        }
        .login-panel {
            width: 370px;
            height: 265px;
            margin: 0 auto 0;
            padding-top: 45px;
            background: #FFFFFF;
            border-radius: 4px;
            text-align: center;
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
</style>