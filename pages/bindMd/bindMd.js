//answer.js
var util = require('../../utils/util.js');
var md5 = require('../../utils/md5');
var WxParse = require("../../wxParse/wxParse.js");
var app = getApp();
var url = 'https://ssl.hi.163.com/qn_app/wx.php';
Page({
    data: {
        error:'',
        hideSuggest:true,
        slsit:[],
        name:'',
        loading: false
    },
    onPullDownRefresh: function () {
        wx.stopPullDownRefresh();
        this.onLoad();
    },
    onShow :function() {
        // 获取页面高度
        if (wx.getStorageSync('systemInfo')) {
            var sys = wx.getStorageSync('systemInfo');
            this.setData({
                windowHeight: sys.windowHeight
            });
        }
    },
    onLoad: function (options) {
        var wxcode = wx.getStorageSync('wxcode'),
             email = wx.getStorageSync('email'),
            roleid = wx.getStorageSync('roleid'),
            sessionid = wx.getStorageSync('sessionid');
        // app.Login();
        if(sessionid.length<0) {//无sessionid
            app.Login();//异步获取sessionid
        }

    },
    bindInput: function (e) {
        var value = e.detail.value.split('@')[0];
        this.data.slist = [
            value + '@163.com',
            value + '@126.com',
            value + '@188.com',
            value + '@vip.126.com',
            value + '@vip.163.com',
            value + '@yeah.net'
        ];
        this.setData({
            hideSuggest: false,
            slist: this.data.slist
        })

    },
    onSelect: function (e) {
        this.setData({
            name: e.currentTarget.dataset.value,
            hideSuggest: true
        });
    },
    savePersonInfo: function (e) {
        var that = this;
        var data = e.detail.value;
        var sessionid = wx.getStorageSync('sessionid');
        if(sessionid.length <= 0){
            app.Login(function (sessionid) {
                that.save(data,sessionid);
            });
        }else{
            that.save(data,sessionid);
        }


    },
    save: function (data,sessionid) {
        var that = this;
        that.setData({
            loading: true
        });
        wx.request({
            url:url + '?action=bind&roleid=' + data.roleid + '&wxid=' + sessionid,
            method: 'POST',
            data:{
                uname:data.email,
                pwd:md5.md5(data.password)
            },
            header:{
                'content-type':'application/x-www-form-urlencoded'
            },
            success: function (res) {
                that.setData({
                    loading: false
                });
                if(res.data.code == 1) {
                    wx.setStorage({
                        key:"email",
                        data:data.email
                    });
                    setTimeout(function () {
                        wx.showToast({
                            title: '提交成功, 请耐心等待审核',
                            icon: 'success',
                            duration: 2000
                        });
                        wx.navigateBack({
                            delta: 1
                        })
                    },1000);
                }else{
                   that.setData({
                       error:res.data.msg
                   })
                }


                // typeof cb == "function" && cb(this.globalData.userInfo)

            },
            fail: function () {
                that.setData({
                    loading: false
                })
            }
        });
    }


});
