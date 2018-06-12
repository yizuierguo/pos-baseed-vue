/**
 * Created by yizui on 2017/2/9.
 * 作者：李绅
 * 春种一粒粟，秋成万颗子。四海无闲田，农夫犹饿死。
 * 锄禾日当午，汗滴禾下土。谁知盘中餐，粒粒皆辛苦。
 */
import Utils from  './util'

export default function (data) {
  var param = {
    contentType: "application/json",
    xhrFields: {
      withCredentials: true
    }
  };
  param = Utils.extend(param, data);
  param.success = function (req) {
    if (req.responseCode == 10212) {
      //todo..
      return;
    } else {
      data.success && data.success(req);
    }
  };
  param.error = function (e) {
    if (data.error) {
      data.error(e)
    }
  };
  lib.ajax(param);
}
