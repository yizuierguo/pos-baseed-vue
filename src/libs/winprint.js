/**
 * Created by yizui on 2017/3/12.
 * 作者：李绅
 * 春种一粒粟，秋成万颗子。四海无闲田，农夫犹饿死。
 * 锄禾日当午，汗滴禾下土。谁知盘中餐，粒粒皆辛苦。
 * @Info:调用客户端打印小票模块
 * @Des:{
 *   1.需要将本地打印的内容转化成客户端需要打印的内容格式
 *   2.示例:
 *     #{f3}我要打印\n\n
 *     #{center}1234567894635456\n
 *     #{barcodeStart}1234567894635456#{barcodeEnd}
 *     #{f1}我要打印\n我要打印\n\n
 *   3.基础语法:{
 *      字号:{f1}{f2}{f3}  //直到遇到下一个字号 否则都是这个字号
 *      居中对齐:{center}   //可能会有兼容问题 慎用 建议使用 字符计算
 *      条码:{barcodeStart}1234567894635456{barcodeEnd}  //中间放置条码内容
 *      换行: \n           //换行
 *   }
 * }
 */
import Util from '../libs/util'
/*
 |*************订单名称**************|
 |                                  |
 |
 |
 |
 |
 |
 |
 |
 |
 |
 |
 |
 |
 |
 |
 |
 |
 |
 |
 |
 |
 **/

const TOTAL_WIDTH = 32;                //每一行可打印字符数
const DEFAULT_LEFT = 0;                //从接口获取
const CENTER_WIDTH = 20;               //指定居中对齐的最大展示字符数
const SERVICE_TEL = '400-091-1717';    //400电话

const END_STR = "\n";                  //换行符
const LINE_STR = "-";                  //虚线
const SPACE_STR = " ";                 //空格
const STAR_STR = "*";                  //*️号


/*
 * @Function:getStrLength
 * @Info:获取指定的字符串长度(需要判断三种字号分别的占用长度)
 * @Param:{
 *    str:需要判断的字符串
 *    textType:文字类型 f1 f2 f3 f1是最小的字体 f2是中等字体(宽度和f1一样) f3是最大的字体
 * }
 * */
const getStrLength = function (str, textType) {
    if (textType == 'f1' || !textType) {
        return str.replace(/[^\x00-\xff]/g, "aa").length;
    } else if (textType == 'f2') {
        return str.replace(/[^\x00-\xff]/g, "aa").length;
    } else if (textType == 'f3') {
        return (str.replace(/[^\x00-\xff]/g, "aa").length * 2);
    }
}
//判断是否小于指定长度
const checkIsLessLength = function (str, len, textType) {
    if (getStrLength(str, textType) <= len) {
        return true;
    }
    return false;
}
/*
 * 例如这样的字段:  |***********闪电购订单**************|
 * Function:returnCenterStr
 * Info:返回居中对齐的整行规则字符串
 * param:{
 *    str:居中的字符串 例如:闪电购订单
 *    sign:需要补充展示的字符 例如:*
 *    len:是否超过这个长度就补充字符 例如:10
 * }
 * return:{
 *    1. ***************闪电购订单******************
 *    2. 闪电购订单闪电购订单闪电购订单闪电购订单闪电购订单
 * }
 * */
const returnCenterStr = function (str, sign, textType) {
    if (getStrLength(str, textType) <= TOTAL_WIDTH) {
        let l_r = (TOTAL_WIDTH - getStrLength(str, textType)) / 2;
        return returnPlaceSign(sign, l_r) + str + returnPlaceSign(sign, l_r);
    } else {
        return str;
    }
};

/*
 * 例如这样的字段:  |牛肉炒饭        X1   20|
 * Function:returnCenterLRStr
 * Info:返回左/右带有占位符的规则字符串
 * param:{
 *   str:需要处理的字符串 例如:闪电购订单
 *   len:长度
 *   sign:占位符
 *   LorR:左侧还是右侧补占位符
 *   textType:文字类型 f1 f2 f3 f1是最小的字体 f2是中等字体(宽度和f1一样) f3是最大的字体
 * }
 * example:{
 *    returnLRStr('牛肉炒饭',10,' ','R','f1')
 * }
 * */
const returnLRStr = function (str, len, sign, LorR, textType) {
    if (getStrLength(str, textType) < len) {
        var l = len - getStrLength(str, textType);
        //默认左补占位符
        if (LorR.toLocaleUpperCase() == 'L' || !LorR) {
            return returnPlaceSign(sign, l) + str;
        } else if (LorR.toLocaleUpperCase() == 'R') {
            return str + returnPlaceSign(sign, l);
        }
    } else if (getStrLength(str, textType) == len) {
        return str;
    } else {
        //todo..
    }
}

//返回占位符
const returnPlaceSign = function (sign, len) {
    let str = '';
    for (var i = 1; i <= len; i++) {
        str += sign;
    }
    return str;
}
/**
 * 获取虚线字符串
 * @param row: 0: 按字数计；1-n: 按行数计
 * @param count: row=0时有效
 */
const getDashed = function (row, count) {
    let str = '';
    if (row === 0) {
        for (let i = 0; i < count; i++) {
            str += '-';
        }
        return str;
    }
    for (let k = 0; k < row; k++) {
        for (let i = 0; i < TOTAL_WIDTH; i++) {
            str += '-';
        }
        // str += '\n';
    }
    return str;

};
//构建测试打印的模板2
const buildPrintForTestTpl2 = function (cfg) {
    let str = '';
    str += '#{center}#{f2}小票打印测试\n\n'
        + getDashed(1) + '\n\n'
        + '#{center}#{f3}测试成功\n'
        + '#{center}#{f3}可以开始使用啦\n\n\n\n\n';
    return str;
};
//构建测试打印的模板1
const buildPrintForTestTpl = function () {
    let str = '';
    str += '#{f2}' + returnCenterStr('小票打印测试', " ") + '\n\n'
        + '#{f1}' + getDashed(1) + '\n\n'
        + '#{f3}' + returnCenterStr('测试成功', " ", 'f3') + '\n'
        + '#{f3}' + returnCenterStr('可以开始使用啦', " ", 'f3') + '\n\n\n\n\n\n';
    return str;
};
//日结小票
const buildDayReportTpl = function (cfg) {
    let sequence = cfg.report ? String(cfg.report.sequence) : ''; //机台号
    let gmtCreate = cfg.report ? Util.formatDateNew(new Date().getTime(), 'yyyy-MM-dd HH:mm:ss') : ''; //打印时间
    let totalOrderAmount = cfg.report ? String(cfg.report.totalOrderAmount) : '';   //订单总数
    let totalItemAmount = cfg.report ? String(cfg.report.totalItemAmount) : '';//商品总数
    let totalPrice = cfg.report ? String(Util.formatRmb(cfg.report.totalPrice, 2)) : '';//销售总金额
    let cashPrice = cfg.report ? String(Util.formatRmb(cfg.report.cashPrice, 2)) : '';//现金
    let alipayPrice = cfg.report ? String(Util.formatRmb(cfg.report.alipayPrice, 2)) : '';//支付宝
    let weixinPrice = cfg.report ? String(Util.formatRmb(cfg.report.weixinPrice, 2)) : '';//微信
    let bankCardPrice = cfg.report ? String(Util.formatRmb(cfg.report.bankCardPrice, 2)) : '';//银行卡
    let cityZenCardPrice = cfg.report ? String(Util.formatRmb(cfg.report.cityZenCardPrice, 2)) : '';//市民卡
    let savingsCardPrice = cfg.report ? String(Util.formatRmb(cfg.report.savingsCardPrice, 2)) : '';//储值卡
    let invoicePrice = cfg.report ? String(Util.formatRmb(cfg.report.invoicePrice, 2)) : '';// 发票
    let str = '#{f3}' + '\n\n\n\n';
    str += '#{f3}' + returnCenterStr(cfg.shop, " ", "f3") + '\n';
    str += '#{f2}' + returnCenterStr('---收银日结小票---', " ", "f2") + '\n';
    str += '#{f1}' + '收银员:' + returnLRStr(cfg.user, 18, ' ', 'R', 'f1') + '机号:' + sequence + '\n';
    str += '#{f1}' + '打印时间:' + returnLRStr(gmtCreate, 22, ' ', 'L', 'f1') + '\n';
    str += '#{f1}' + getDashed(1) + '\n';
    str += '#{f1}' + '订单总数量:' + returnLRStr(totalOrderAmount, 20, ' ', 'L', 'f1') + '\n';
    str += '#{f1}' + '商品总数量:' + returnLRStr(totalItemAmount, 20, ' ', 'L', 'f1') + '\n';
    str += '#{f1}' + '收款汇总明细：' + '\n';
    str += '#{f1}' + '现金:' + returnLRStr(cashPrice, 27, ' ', 'L', 'f1') + '\n';
    str += '#{f1}' + '支付宝:' + returnLRStr(alipayPrice, 25, ' ', 'L', 'f1') + '\n';
    str += '#{f1}' + '微信:' + returnLRStr(weixinPrice, 27, ' ', 'L', 'f1') + '\n';
    str += '#{f1}' + '银行卡:' + returnLRStr(bankCardPrice, 25, ' ', 'L', 'f1') + '\n';
    str += '#{f1}' + '市民卡:' + returnLRStr(cityZenCardPrice, 25, ' ', 'L', 'f1') + '\n';
    str += '#{f1}' + '储值卡:' + returnLRStr(savingsCardPrice, 25, ' ', 'L', 'f1') + '\n';
    str += '#{f1}' + '发票:' + returnLRStr(invoicePrice, 27, ' ', 'L', 'f1') + '\n';
    str += '#{f1}' + '总金额:' + returnLRStr(totalPrice, 25, ' ', 'L', 'f1') + '\n';
    str += '#{f1}' + getDashed(1) + '\n';
    str += '#{f1}' + '收银员签字:' + '\n';
    str += '#{f3}' + '\n\n\n\n\n\n';
    return str;
    console.log(str);
};
//班次小票
const buildNextShiftTpl = function (cfg) {
    let sequence = cfg.report ? String(cfg.report.sequence) : ''; //机台号
    let gmtCreate = cfg.report ? Util.formatDateNew(new Date().getTime(), 'yyyy-MM-dd HH:mm:ss') : ''; //  parseInt(cfg.report.gmtCreate) 打印时间
    let totalOrderAmount = cfg.report ? String(cfg.report.totalOrderAmount) : '';   //订单总数
    let totalItemAmount = cfg.report ? String(cfg.report.totalItemAmount) : '';//商品总数
    let totalPrice = cfg.report ? String(Util.formatRmb(cfg.report.totalPrice, 2)) : '';//销售总金额
    let cashPrice = cfg.report ? String(Util.formatRmb(cfg.report.cashPrice, 2)) : '';//现金
    let alipayPrice = cfg.report ? String(Util.formatRmb(cfg.report.alipayPrice, 2)) : '';//支付宝
    let weixinPrice = cfg.report ? String(Util.formatRmb(cfg.report.weixinPrice, 2)) : '';//微信
    let bankCardPrice = cfg.report ? String(Util.formatRmb(cfg.report.bankCardPrice, 2)) : '';//银行卡
    let cityZenCardPrice = cfg.report ? String(Util.formatRmb(cfg.report.cityZenCardPrice, 2)) : '';//市民卡
    let savingsCardPrice = cfg.report ? String(Util.formatRmb(cfg.report.savingsCardPrice, 2)) : '';//储值卡
    let invoicePrice = cfg.report ? String(Util.formatRmb(cfg.report.invoicePrice, 2)) : '';        // 发票
    let curshift = cfg.curshift ? ('000' + cfg.curshift) : '';        //班次
    let str = '#{f3}' + '\n\n\n\n';
    str += '#{f3}' + returnCenterStr(cfg.shop, " ", "f3") + '\n';
    str += '#{f2}' + returnCenterStr('---班次收银小票---', " ", "f2") + '\n';
    str += '#{f1}' + '当前班次:' + curshift + '\n';
    str += '#{f1}' + '收银员:' + returnLRStr(cfg.user, 18, ' ', 'R', 'f1') + '机号:' + sequence + '\n';
    str += '#{f1}' + '打印时间:' + returnLRStr(gmtCreate, 22, ' ', 'L', 'f1') + '\n';
    str += '#{f1}' + getDashed(1) + '\n';
    str += '#{f1}' + '订单总数量:' + returnLRStr(totalOrderAmount, 20, ' ', 'L', 'f1') + '\n';
    str += '#{f1}' + '商品总数量:' + returnLRStr(totalItemAmount, 20, ' ', 'L', 'f1') + '\n';
    str += '#{f1}' + '收款汇总明细：' + '\n';
    str += '#{f1}' + '现金:' + returnLRStr(cashPrice, 27, ' ', 'L', 'f1') + '\n';
    str += '#{f1}' + '支付宝:' + returnLRStr(alipayPrice, 25, ' ', 'L', 'f1') + '\n';
    str += '#{f1}' + '微信:' + returnLRStr(weixinPrice, 27, ' ', 'L', 'f1') + '\n';
    str += '#{f1}' + '银行卡:' + returnLRStr(bankCardPrice, 25, ' ', 'L', 'f1') + '\n';
    str += '#{f1}' + '市民卡:' + returnLRStr(cityZenCardPrice, 25, ' ', 'L', 'f1') + '\n';
    str += '#{f1}' + '储值卡:' + returnLRStr(savingsCardPrice, 25, ' ', 'L', 'f1') + '\n';
    str += '#{f1}' + '发票:' + returnLRStr(invoicePrice, 27, ' ', 'L', 'f1') + '\n';
    str += '#{f1}' + '总金额:' + returnLRStr(totalPrice, 25, ' ', 'L', 'f1') + '\n';
    str += '#{f1}' + getDashed(1) + '\n';
    str += '#{f1}' + '交班签字:' + '\n';
    str += '#{f3}' + '\n\n\n\n\n';
    str += '#{f1}' + '换班签字:' + '\n';
    str += '#{f3}' + '\n\n\n\n\n\n\n';
    console.log(str);
    return str;
};
//重印小票
const buildRePrintOrder = function (cfg) {
    let sequence = cfg.report ? String(cfg.report.sequence) : ''; //机台号
    let time = cfg.entry ? Util.formatDateNew(parseInt(cfg.entry[0].bizOrder.gmtCreate), 'yyyy-MM-dd HH:mm:ss') : ''; //销售时间
    let total = 0;       //总金额
    let saves = 0;       //总折扣
    let shouldPauy = cfg.entry[0].bizOrder.totalPrice;  //应付金额
    let realPay = cfg.entry[0].bizOrder.actualPay;    //实付金额
    let fixedZero = parseInt(realPay) - parseInt(shouldPauy);   //找零金额
    //支付方式
    let patType = function () {
        let payType = cfg.entry ? cfg.entry[0].bizOrder.payTypeList[0].payType : '';
        let payText = '';
        if (payType == '1') {
            payText = '现金';
        } else if (payType == '2') {
            payText = '支付宝';
        } else if (payType == '3') {
            payText = '微信';
        } else if (payType == '4') {
            payText = 'pos机';
        } else if (payType == '5') {
            payText = '储值卡';
        }
        return payText;
    };
    let str = '#{f3}' + '\n\n\n\n';
    str += '#{f2}' + returnCenterStr(cfg.shop, " ", "f2") + '\n';
    str += '#{f1}' + '收银员:' + returnLRStr(cfg.user, 20, ' ', 'R', 'f1') + '机号:' + sequence + '\n';
    str += '#{f1}' + '销售时间:' + returnLRStr(time, 23, ' ', 'L', 'f1') + '\n';
    str += '#{f1}' + returnLRStr('原价', 8, ' ', 'R', 'f1') + returnLRStr('数量', 8, ' ', 'R', 'f1') + returnLRStr('折扣', 8, ' ', 'L', 'f1') + returnLRStr('金额', 8, ' ', 'L', 'f1') + '\n';
    cfg && cfg.entry.forEach(function (item) {
        if (item.bizOrder && item.bizOrder.subBizOrderList) {
            item.bizOrder.subBizOrderList.forEach(function (i) {
                let originPrice = i.itemOriginPrice;
                let itemPrice = i.itemPrice;
                let buyAmount = i.buyAmount;
                let save = (parseInt(originPrice) - parseInt(itemPrice)) * buyAmount;
                let totalPrice = parseInt(itemPrice) * buyAmount;
                total += parseInt(originPrice) * buyAmount;
                saves += save;
                str += '#{f1}' + i.itemName + '\n';
                str += '#{f1}' + returnLRStr(Util.formatRmb(originPrice, 2), 8, ' ', 'R', 'f1') + returnLRStr(String(buyAmount), 8, ' ', 'R', 'f1') + returnLRStr(Util.formatRmb(save, 2), 8, ' ', 'R', 'f1') + Util.formatRmb(totalPrice, 2) + '\n';
            });
        }
    });
    str += '#{f1}' + '总金额:' + returnLRStr(Util.formatRmb(total, 2), 25, ' ', 'L', 'f1') + '\n';
    str += '#{f1}' + '总折扣:' + returnLRStr(Util.formatRmb(saves, 2), 25, ' ', 'L', 'f1') + '\n';
    str += '#{f1}' + '应付金额:' + returnLRStr(Util.formatRmb(shouldPauy, 2), 23, ' ', 'L', 'f1') + '\n';
    str += '#{f1}' + '实付金额:' + returnLRStr(Util.formatRmb(realPay, 2), 23, ' ', 'L', 'f1') + '\n';
    str += '#{f1}' + '找零:' + returnLRStr(Util.formatRmb(fixedZero, 2), 25, ' ', 'L', 'f1') + '\n';
    str += '#{f1}' + '支付方式:' + returnLRStr(String(patType()), 23, ' ', 'L', 'f1') + '\n';
    str += '#{f3}' + '\n\n\n\n\n\n';
    console.log(str);
    return str;
}
/**
 * 暴露客户端打印小票方法
 * @param cfg
 * @param printType: 'test': 测试打印，其他为打印小票
 */
export default function nativePrint(cfg, printType) {
    try {
        //打印测试
        if (printType && printType === 'test') {
            var content = buildPrintForTestTpl();
            eleph.service.serviceApi_PrintService_printForTest(JSON.stringify(cfg), String(content));
        }
        //日结小票
        else if (printType && printType === 'dayreport') {
            var content = buildDayReportTpl(cfg);
            eleph.service.serviceApi_PrintService_printContent(content);

        }
        //交班小票
        else if (printType && printType === 'nextshift') {
            var content = buildNextShiftTpl(cfg);
            eleph.service.serviceApi_PrintService_printContent(content);
        }
        //重印
        else if (printType && printType === 'reprintorder') {
            var content = buildRePrintOrder(cfg);
            eleph.service.serviceApi_PrintService_printContent(content);
        }

    } catch (e) {
        console.log(e);
    }
}