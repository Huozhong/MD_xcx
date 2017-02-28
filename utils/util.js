let face_json = require('face.js').face_json;
let WxParse = require('../wxParse/wxParse.js');
const HOST = "http://10.240.162.199:4000/md/";
// const HOST = "https://api.zhenhua.me/md/";
// const HOST = "http://api.hi.163.com/md/";

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
    wx.showToast({
        title: '加载中',
        icon: 'loading',
        duration: 10000
    });
    wx.request({
        url: url,
        method: "GET",
        data: data,
        header: {
            'Content-Type': 'application/json',
        },
        success: function(result) {
            wx.hideToast();
            successFun(result);
        },
        fail: function(result) {
            wx.hideToast();
            errorTip();
            failFun(result);
        }
    })
}

function initMomentsOrMsgsData(datas, that, type) {
    for (let i = 0; i < datas.length; i++) {
        datas[i].Text = parseFace(datas[i].Text);
        datas[i].Html = WxParse.wxParse('html', 'html', datas[i].Text, that, 0);
        datas[i].PublishTime = getPublishTime(datas[i].duration, datas[i].CreatTime);
        if(type == 'moment'){
            datas[i].showMore = false;
            datas[i].inputTxt = "输入评论内容";
        }else{
            datas[i].inputTxt = "输入回复内容";
        }
    }
    return datas;
}

// 表情解析
function preg_quote(str) {
    return (str + '').replace(/([\\\.\+\*\?\[\^\]\$\(\)\{\}\=\!<>\|\:])/g, "\\$1");
}

function parseFace(str) {
    if (typeof('face_json') == 'undefined' || !str) {
        return str;
    }
    for (let key in face_json) {
        let re = new RegExp(preg_quote(key), "g");
        str = str.replace(re, face_json[key]);
    }
    return str;
}

/*计算发表时间*/
function getPublishTime(duration, createTime) {
    if (duration <= 0)
        return "刚刚";
    let mo = duration / 1000 / 60 / 60 / 24 / 30;
    let mon = Math.floor(mo);
    let d = duration / 1000 / 60 / 60 / 24 - (30 * mon);
    let dn = Math.floor(d);
    let h = duration / 1000 / 60 / 60 - (24 * 30 * mon) - (24 * dn);
    let hn = Math.floor(h);
    let m = duration / 1000 / 60 - (24 * 30 * 60 * mon) - (24 * 60 * dn) - (60 * hn);
    let mn = Math.floor(m);
    if (mon > 12) {
        let t = new Date(createTime);
        return t.getFullYear() + "年" + (t.getMonth() + 1) + "月" + t.getDate() + "日";
    } else if (mon <= 0) {
        if (dn <= 0) {
            if (hn <= 0) {
                if (mn <= 0) {
                    return "刚刚";
                } else {
                    return mn + "分钟前";
                }
            } else {
                return hn + "小时前";
            }
        } else {
            return dn + "天前";
        }
    } else {
        return mon + "个月前";
    }
}

// 判断是否有登录梦岛
function chargeMDUserInfo(that, userinfo) {
    userinfo && that.setData({
        isLogin: true
    });
}

// 提示
function showTip(title, content, hasCancel, confirmText, cb) {
    wx.showModal({
        title: title,
        content: content,
        showCancel: hasCancel,
        confirmText: confirmText,
        success: function(res) {
            typeof cb == 'function' && cb(res);
        }
    });
}

// 数据出错时的提示
function errorTip(txt) {
    let _txt = txt || '系统错误，稍后再试！';
    showTip('错误', _txt, false, '确定');
}

// 未绑定账号时的提示
function showLoginTip() {
    showTip('提示', '检测到您还未绑定梦岛账号，请绑定', true, '去绑定', function(res) {
        if (res.confirm) {
            wx.navigateTo({
                url: '../bindMd/bindMd'
            })
        } else {
            wx.switchTab({
                url: '/pages/moments/moments'
            })
        }
    });
}

function toHome(userid) {
    wx.navigateTo({
        url: '../home/home?userid=' + userid
    });
}

function toMyHome() {
    wx.switchTab({
        url: '/pages/home/home'
    })
}

function getCommOfMon(id, index, that) {
    let _url = 'qnm/getcomosfmom',
        data = { 'userid': 64 };
    if(that.data.moments[index].comsNum == 0 && !that.data.moments[index].zanlist[0]){
        that.data.moments[index].showCommList = true;
        that.setData({
            moments: that.data.moments
        });
        return;
    }
    if (id) {
        data['targetid'] = id;
        requestData(HOST + _url, data, function(result) {
            let resultData = result.data;
            if (resultData.code == 0 && resultData.data) {
                that.data.moments[index].showCommList = true;
                let commData = resultData.data.commlist;
                let zanUsersArr = [],
                    zanlist = that.data.moments[index].zanlist;
                if (zanlist[0]) {
                    for (var i = 0; i < zanlist.length; i++) {
                        if(zanlist[i].userInfo && zanlist[i].userInfo.NickName)
                            zanUsersArr.push(zanlist[i].userInfo.NickName);
                    }
                }
                let momentData = that.data.moments[index];
                if (commData[0]) {
                    for (var i = 0; i < commData.length; i++) {
                        commData[i].Text = parseFace(commData[i].Text);
                        commData[i].Html = WxParse.wxParse('html', 'html', commData[i].Text, that, 0);
                        commData[i].PublishTime = getPublishTime(commData[i].Duration, commData[i].CreatTime);
                    }
                }
                momentData.zanUsers = zanUsersArr.join(', ');
                momentData.commlist = resultData.data;
                that.setData({
                    moments: that.data.moments
                });
            } else {
                errorTip();
            }
        }, function(result) {

        });
    }
}

function getCommOfMsg(id, index, that) {
    let _url = 'qnm/getansofmsg',
        data = { 'userid': 64 };
    if(that.data.messages[index].answerNum == 0){
        that.data.messages[index].showCommList = true;
        that.setData({
            messages: that.data.messages
        });
        return;
    }
    if (id) {
        data['messageid'] = id;
        requestData(HOST + _url, data, function(result) {
            let resultData = result.data;
            if (resultData.code == 0 && resultData.data) {
                that.data.messages[index].showCommList = true;
                let commData = resultData.data.anslist;
                let messageData = that.data.messages[index];
                if (commData[0]) {
                    for (var i = 0; i < commData.length; i++) {
                        commData[i].Text = parseFace(commData[i].Text);
                        commData[i].Html = WxParse.wxParse('html', 'html', commData[i].Text, that, 0);
                        commData[i].PublishTime = getPublishTime(commData[i].Duration, commData[i].CreatTime);
                    }
                }
                messageData.anslist = resultData.data;
                that.setData({
                    messages: that.data.messages
                });
            } else {
                errorTip();
            }
        }, function(result) {

        });
    }
}

module.exports = {
    formatTime: formatTime,
    HOST: HOST,
    requestData: requestData,
    parseFace: parseFace,
    getPublishTime: getPublishTime,
    chargeMDUserInfo: chargeMDUserInfo,
    showTip: showTip,
    showLoginTip: showLoginTip,
    errorTip: errorTip,
    initMomentsOrMsgsData: initMomentsOrMsgsData,
    toHome: toHome,
    toMyHome: toMyHome,
    getCommOfMon: getCommOfMon,
    getCommOfMsg: getCommOfMsg
}
