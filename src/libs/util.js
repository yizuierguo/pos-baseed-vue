/**
 * Created by yizui on 2017/2/9.
 * 作者：李绅
 * 春种一粒粟，秋成万颗子。四海无闲田，农夫犹饿死。
 * 锄禾日当午，汗滴禾下土。谁知盘中餐，粒粒皆辛苦。
 */
export default {
    /**
     * cookie
     * @param name
     * @returns {*}
     */
    getCookie: function (name) {
        var arr, reg = new RegExp("(^| )" + name + "=([^;]+)(;|$)");
        if (arr = document.cookie.match(reg)) {
            return arr[2];
        }
    },
    /*
     * extend:
     *
     **/
    extend : function(origin, add){
        if(!add || typeof add !== 'object') return origin;

        var keys = Object.keys(add);
        var i = keys.length;
        while(i--){
            origin[keys[i]] = add[keys[i]];
        }
        return origin;
    },
    getLionUrl : function(url){
        return 'http://' + document.domain + url;
    },
    /*
     * @function:getOuterUrl
     * @info:{
     *   处理以下三种域名:
     *   daily:daily.manage.51xianqu.com
     *    gray:gray.manage.51xianqu.com
     *    online:manage.51xianqu.com
     * }
     */
    getOuterUrl : function(url){
        // 本地环境
        if(!!~location.host.indexOf('dev.') || !!~location.host.indexOf('daily.')){
            return 'http://daily.52shangou.com' + url;
        }
        //预发
        else if(!!~location.host.indexOf('gray.')){
            return 'http://gray.52shangou.com' + url;
        }
        // 线上环境
        else {
            return 'http://www.52shangou.com' + url;
        }
    },
    getUrlParam : function(key){
        var obj = {}, arr = location.search.substr(1).split("&");
        for(i in arr){
            var n = arr[i].indexOf("=");
            -1 != n && (obj[arr[i].substr(0, n)] = decodeURIComponent(arr[i].substr(n + 1, arr[i].length)));
        }
        return obj[key];
    },
    getAllUrlParam : function(){
        var obj = {}, arr = location.search.substr(1).split("&");
        for(i in arr){
            var n = arr[i].indexOf("=");
            -1 != n && (obj[arr[i].substr(0, n)] = decodeURIComponent(arr[i].substr(n + 1, arr[i].length)));
        }
        return obj;
    },
    setAllUrlParam : function(obj){
        var str = ''
        for(var i in obj){
            if(obj.hasOwnProperty(i)){
                str += encodeURIComponent(i) + '=' + encodeURIComponent(obj[i]) + '&'
            }
        }
        str.length && (str = str.slice(0, str.length - 1));
        return str;
    },
    /**
     * 检测线上或本地跳转
     * @param path
     * @returns {*}
     */
    getLocalPath : function(path){
        var hostname = location.hostname
        if(hostname.indexOf('dev') > -1){
            return path
        } else {
            return '/crm/www/goodscenter' + path
        }
    },
    /*
     * 编码HTML特殊字符，防止存储型XSS
     */
    htmlspecialchars : function(str){
        var map = {
            '<' : '&lt;',
            '>' : '&gt;',
            '"' : '&quot;',
            "'" : '&#039;',
            '&' : '&amp;'
        };
        return str.replace(/[><&"']/g, function(item){
            return map[item];
        });
    },
    login : {
        isLogin : function(){
            var
                _uk = util.getCookie('_uk');

            if(_uk){
                return true;
            }
            return false;
        },
        goLogin : function(){
            var prefix = util.getPrefix();
            window.refreshPage = function(){
                location.reload();
            }

            if(Bridge.isInApp() && Bridge.appVersion() >= '3.0.0'){
                Bridge.callAsync('unLogin');
                return;
            }
            location.href = prefix + '/user/login.html?redirect=' + encodeURIComponent(location.href);
        }
    },
    /**
     *  Mobile格式化函数
     *  替换形如18500165858为185-0016-5858
     */
    formatMobile : function(mobile, separator){
        var reg = /^(\d{3})(\d{4})(\d{4})$/;

        mobile += '';
        separator = separator || '-';

        if(!reg.test(mobile))
            return mobile;
        return mobile.replace(reg, '$1' + separator + '$2' + separator + '$3');
    },
    /*
     * 根据时间戳返回当天开始时间戳和结束时间戳
     */
    getDayStartAndEnd : function(timestamp){
        var self = this,
            SPAN = 3600 * 24 * 1000,
            start,
            ymd = self.formatDate('YYYY-MM-DD', timestamp, '/');
        start = +new Date(ymd + ' 00:00:00');
        return {
            startTime : start,
            endTime : start + SPAN
        }
    },
    /**
     * 更灵活的格式化函数
     */
    formatDateNew : function(time, format){
        if(!time) return '';
        var t = new Date(time);
        var tf = function(i){
            return (i < 10 ? '0' : '') + i
        };
        return format.replace(/yyyy|MM|dd|HH|mm|ss/g, function(a){
            switch(a){
                case 'yyyy':
                    return tf(t.getFullYear());
                    break;
                case 'MM':
                    return tf(t.getMonth() + 1);
                    break;
                case 'dd':
                    return tf(t.getDate());
                    break;
                case 'HH':
                    return tf(t.getHours());
                    break;
                case 'mm':
                    return tf(t.getMinutes());
                    break;
                case 'ss':
                    return tf(t.getSeconds());
                    break;
            }
        })
    },
    /**
     * 格式化时间
     * 传入时间戳则获取时间戳时间,默认为now
     * 分隔符separator
     */
    formatDate : function(type, stamp, separator){
        var
            ret = '',
            d = stamp ? new Date(stamp) : new Date(),
            year = d.getFullYear(),
            month = d.getMonth() + 1 < 10 ? '0' + (d.getMonth() + 1) : d.getMonth() + 1,
            day = d.getDate() < 10 ? '0' + d.getDate() : d.getDate(),
            hours = d.getHours() < 10 ? '0' + d.getHours() : d.getHours(),
            minutes = d.getMinutes() < 10 ? '0' + d.getMinutes() : d.getMinutes(),
            seconds = d.getSeconds() < 10 ? '0' + d.getSeconds() : d.getSeconds(),
            tmpSeparator = separator;

        separator || (separator = '-');

        switch(type){
            case 'Ch-zh':
                ret = year + '年' + month + '月' + day + '日';
                break;
            case 'Ch-zh-MM-DD':
                ret = month + '月' + day + '日';
                break;
            case 'YYYY-MM-DD HH:mm:ss':
                ret = year + separator + month + separator + day +
                    ' ' + hours + ':' + minutes + ':' + seconds;
                break;
            case 'YYYY-MM-DD':
                ret = year + separator + month + separator + day;
                break;
            case 'MM-DD':
                ret = month + separator + day;
                break;
            case 'HH:mm':
                ret = hours + (tmpSeparator ? tmpSeparator : ':') + minutes;
                break;
            default:
                ret = d;
        }

        return ret;
    },
    /*
     *   大数据千分位格式化
     *   input   123456789
     *   output  123,456,789
     */
    formatSeg : function(str){
        str += '';
        return str.replace(/(\d)(?=(\d{3})+\b)/g, '$1,');
    },
    /**
     * 格式化价格
     * n为小数点位数,默认2位
     * currency,货币单位
     * negSymbol,自定义负号样式,有时候需要空一格,默认-
     */
    formatPrice : function(num, n, currency, negSymbol){
        var
            negative = false,
            numArr,
            l,
            r,
            ret;

        if(!num){
            num = 0;
        }
        n = n >= 0 && n <= 20 ? n : 2;
        if(num < 0){
            negative = true;
            num = Math.abs(num);
        }
        num = parseFloat(num / 100).toFixed(n);
        numArr = num.split('.');
        l = (numArr[0] || 0).toString();
        r = (numArr[1] || '').toString();
        ret = '';

        while(l.length > 3){
            ret = ',' + l.slice(-3) + ret;
            l = l.slice(0, l.length - 3);
        }
        if(l){
            ret = l + ret;
        }
        if(r){
            ret += '.' + r;
        }

        if(currency){
            ret = currency + ret;
        }
        if(negative){
            negSymbol || (negSymbol = '-');
            ret = negSymbol + ret;
        }

        return ret;
    },
    /*
    * 格式化人民币
    * 2799--》27.99
    * */
    formatRmb: function (value,len) {
        return (value/100).toFixed(len || 2);
    },
    /**
     * 格式化银行卡
     * 样式为中间4位隐藏
     */
    formatCardNum : function(num){
        num = num.toString();
        var
            l = num.slice(0, 4),
            r = num.slice(num.length - 4, num.length),
            ret = '';

        ret = l + '****' + r;

        return ret;
    },
    /**
     * 组装url
     * url=原始url
     * query,对象,query参数
     * noWebview, 默认添加webView参数,noWebview=true,取消
     */
    buildQuery : function(url, query, noWebview){
        var
            ret = '',
            key;

        if(!noWebview){
            ret += '&page=new-app-page';
        }
        for(key in query){
            if(query.hasOwnProperty(key)){
                ret += '&' + key + '=' + encodeURIComponent(query[key]);
            }
        }

        if(noWebview && !Object.keys(query)){
            ret = url;
        }
        else {
            ret = url + '?' + ret.slice(1);
        }

        return ret;
    },
    /**
     * 获取当前页面环境
     */
    getEnv : function(){
        var host = location.host,
            ret = 'www';
        if(/daily|dev/.test(host)){
            ret = 'daily';
        }
        else if(/gray/.test(host)){
            ret = 'gray';
        }
        return ret;
    },
    /**
     * eg : substitute('my name is {name},age is {age}',{name:'bofang',age:18})
     *      return my name is bofang,age is 18
     **/
    substitute : function(tpl, data){
        return tpl.replace(/{(.*?)}/igm, function($, $1){
            return data[$1] ? data[$1] : '';
        });
    },
    //获取指定日期的后一天
    //例如getNextDay('2014-06-25') return 2014-06-26
    getNextDay : function(dd, n){
        var strs = new Array();
        strs = dd.split("-");
        var y = strs[0];
        var m = strs[1];
        var d = strs[2];
        var t = new Date(y, m - 1, d);
        var str = t.getTime() + n * (1000 * 60 * 60 * 24);
        var newdate = new Date();
        newdate.setTime(str);
        var strYear = newdate.getFullYear();
        var strDay = newdate.getDate();
        if(strDay < 10){
            strDay = "0" + strDay;
        }
        var strMonth = newdate.getMonth() + 1;
        if(strMonth < 10){
            strMonth = "0" + strMonth;
        }
        var strdate = strYear + "-" + strMonth + "-" + strDay;
        return strdate;
    },
    //验证一个手机号是否符合规范
    checkMobileNum : function(str){
        var reg = /^0?1[3|4|5|7|8][0-9]\d{8}$/;
        if(reg.test(str)){
            return true;
        } else {
            return false;
        }
    },
    //对一个数进行下舍入
    //例如3656 最后 是3650
    floorNum: function (num) {
        if (this.checkPointTwo(num)) {
            // if(parseInt(num) == 1){
            //     return num;
            // }
            return Math.floor(parseInt(num) / 10) * 10;
        }
    },
    //是否是正整数
    isPositiveInteger : function(str){
        return /^([1-9]\d*)$/.test(str);
    },
    isValidBarcode:function (str) {
        return /^([0-9]\d*)$/.test(str);
    },
    isPositiveNumber : function(num){
        return $.isNumeric(num) && parseFloat(num) >= 0;
    },
    isGreaterZero : function(num){
        return $.isNumeric(num) && parseFloat(num) > 0;
    },
    isTwoDecimalsPlace : function(num){
        var reg = /^\d{1,4}(\.\d{1,2})?$/;
        return reg.test(num);
    },
    checkPointTwo : function(str){
        return /^\d+(\.\d{1,2})?$/g.test(str);
    },
    /**
     * 处理抹零
     * @param num
     * @returns {string}
     */
    wipingZero : function(num){
        var data = '', a = (num / 100).toFixed(2), b = a.split('.');
        if( !b[1] ) return num;
        if(b[1].substring(0,1) <= 5){
            data = b[0] + '.' + '0';
        }
        else {
            data = b[0] + '.' + '5';
        }
        return data * 100;
    },
    /**
     * 找零
     * @param receivable (应收)
     * @param netReceipts (实收)
     * @returns {string}
     */
    change : function(receivable, netReceipts){
        var change = (netReceipts * 1) - (receivable * 1);
        if(change > 0){
            return change;
        }
        return
    },

    /*
     * @Funtion:toast
     * @info:展示一个toast
     * @param {
     *    1.text:提示文案
     *    2.tipType:默认三种succeed failed notice 可以自定义class 例如 xxx 则会添加toast-icon-xxx的一个class
     *    3.timer 关闭toast时间
     *    4.callback回调
     * }
     * */
    toast : function(text, tipType, timer, callback){
        var class_obj = {
            succeed : 'toast-icon-ok',
            failed : 'toast-icon-false',
            notice : 'toast-icon-notice'
        };
        //之前显示的弹层 没有销毁之前 不创建新的 直接return 掉
        if(document.getElementById('J_Toast')){
            return;
        }
        var clazz = class_obj[tipType] ? class_obj[tipType] : ('toast-icon-' + tipType),
            xt = '<div class="toast">' +
                '<div class="toast-cont">' +
                '   <i class="toast-icon ' + clazz + '"></i>' +
                '   <p class="toast-text">' + text + '</p>' +
                '</div>' +
                '</div>';
        var root = document.createElement("div");
        root.id = 'J_Toast';
        root.className = 'toast';
        root.innerHTML = '<div class="toast-cont">' +
            '   <i class="toast-icon ' + clazz + '"></i>' +
            '   <p class="toast-text">' + text + '</p>' +
            '</div>';
        document.body.appendChild(root);
        if (timer) {
            clearTimeout(timer);
        }
        setTimeout(function () {
            var _parentElement = document.getElementById('J_Toast');
            _parentElement.parentNode.removeChild(_parentElement);
            callback && callback();
        }, timer);
    }
}
