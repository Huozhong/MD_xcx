let face_json = require('face.js').face_json;
const HOST = "http://api.hi.163.com/md/";

function formatTime(date) {
  let year = date.getFullYear()
  let month = date.getMonth() + 1
  let day = date.getDate()

  let hour = date.getHours()
  let minute = date.getMinutes()
  let second = date.getSeconds()


  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

function requestData(url, data, successFun, failFun) {
  wx.request({
    url: url,
    method: "GET",
    data: data,
    header: {
      'Content-Type': 'application/json',
    },
    success: function (result) {
      successFun(result);
    },
    fail: function (result) {
      failFun(result);
    }
  })
}

function preg_quote(str) {
    return (str+'').replace(/([\\\.\+\*\?\[\^\]\$\(\)\{\}\=\!<>\|\:])/g, "\\$1");
}

function parseFace(str){
    if(typeof('face_json') == 'undefined' || !str){
        return str;
    }
    for(let key in face_json){
        let re = new RegExp(preg_quote(key), "g");  
        str = str.replace(re,face_json[key]);
    }
    // $.each(face_json,function(index,item){
    //     re = new RegExp(preg_quote(index), "g");  
    //     str = str.replace(re,item);
    // })
    return str;
}

/*计算发表时间*/
function getPublishTime(duration,createTime){
    if(duration <= 0)
        return "刚刚";
    let mo  = duration / 1000 / 60 / 60 / 24 / 30;
    let mon = Math.floor(mo);
    let d    = duration / 1000 / 60 / 60 / 24 - (30 * mon);
    let dn   = Math.floor(d);
    let h    = duration/ 1000 / 60 / 60 - (24 * 30 * mon) - (24 * dn);
    let hn   = Math.floor(h);
    let m   = duration / 1000 /60 - (24 * 30 * 60 * mon) - (24 * 60 * dn) - (60 * hn);
    let mn  = Math.floor(m);
    if(mon > 12){
        let t = new Date(createTime);
        return t.getFullYear() + "年" + (t.getMonth()+1) + "月" + t.getDate() + "日";
    }
    else if(mon <= 0){
        if(dn <= 0){
            if(hn <= 0){
                if(mn <= 0){
                    return "刚刚";
                }
                else{
                    return mn + "分钟前";
                }
            }
            else{
                return hn + "小时前";
            }
        }
        else{
            return dn + "天前";
        }
    }
    else{
        return mon + "个月前";
    }
}


module.exports = {
  formatTime: formatTime,
  HOST: HOST,
  requestData: requestData,
  parseFace: parseFace,
  getPublishTime: getPublishTime
}
