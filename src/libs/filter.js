import Vue from 'vue';

// 格式化手机号码
Vue.filter('formatMobile', function (value) {
	return value.replace(/(\d{3})(\d{4})/,'$1 $2 ');
});


// 格式化金额
Vue.filter('formatPrice', function (value,len) {
    return (value/100).toFixed(len || 2);
});


// 图片完整url
Vue.filter('filterImg', function (src) {
  	return 'http://imgsize.52shangou.com/img/' + src + '@100w_100h_90Q.jpg';
});

//格式化时间
Vue.filter('filterTime', function (time, format) {
    if (!time) return '';
    var t = new Date(time);
    var tf = function (i) {
        return (i < 10 ? '0' : '') + i
    };
    return format.replace(/yyyy|MM|dd|HH|mm|ss/g, function (a) {
        switch (a) {
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
});
//格式化属性
Vue.filter('formatproperty', function (property) {
    if(property.indexOf('未知') > -1) {
        return '';
    }
    return '(' + property + ')';
});
//格式化名字
Vue.filter('formatname', function (name) {
    var screenW = document.body.clientWidth;
    if(name && name.length >10 && screenW < 1024 && screenW > 960){
        return name.substr(0,8)+ '..';
    }
    if(name && name.length >10 && screenW < 960){
        return name.substr(0,6)+ '..';
    }
    if(name && name.length >10){
        return name.substr(0,10)+ '..';
    }
    return name;
});
