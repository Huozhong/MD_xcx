//app.js
let util = require('utils/util.js');
App({
    onLaunch: function() {
        var that = this;
        // 获取微信用户信息并尝试登录梦岛
        this.getWxUserInfo(function(result) {
            that.mdLogin(result);
        });
        setTimeout(function() {
            wx.navigateTo({
                url: '../moment/moment'
            });
        }, 1500);
        // wx.clearStorage();
    },
    wxLogin: function(cb) {
        //调用微信登录接口
        wx.login({
            success: function(res) {
                typeof cb == "function" && cb(res);
            }
        })
    },
    mdLogin: function(wxuser) {
        var that = this;
        let sessionid = wx.getStorageSync('sessionid');
        if (sessionid) {
            util.requestData(util.HOST + 'wxLogin', { code: wxuser.code, mdid: sessionid }, function(result) {
                that.globalData.MDUserInfo = result;
            }, function(result) {

            });
        }
    },
    getWxUserInfo: function(cb) {
        let that = this
        this.wxLogin(function(result) {
            wx.getUserInfo({
                success: function(res) {
                    that.globalData.userInfo = res.userInfo;
                    typeof cb == "function" && cb(result);

                }
            })
        })
    },
    // 从后台获取梦岛用户信息
    getMdUserDataFromServer: function(code) {

    },
    // 将梦岛用户信息存储在本地
    setMdUserInfo: function(user) {
        wx.setStorageSync('UserInfo', user);
    },
    // 从本地获取梦岛用户信息
    getMdUserInfo: function(cb) {
        typeof cb == "function" && cb(wx.getStorageSync('UserInfo'));
    },

    globalData: {
        userInfo: null,
        MDUserInfo: null
    }
})
