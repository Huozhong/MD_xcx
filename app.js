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
                url: '../photos/photos?photoid=24191'
            });
            // wx.switchTab({
            //     url: '../myhome/myhome'
            // });
        }, 2000);

        // wx.clearStorage();
    },
    getWxUserInfo: function(cb) {
        let that = this
        this.wxLogin(function(result) {
            console.log(result);
            util.requestData(util.HOST+'wx/login',{'code':result.code},function(result){
                let resData = result.data;
                if(resData.code == 0 && resData.data && resData.data.skey){
                    let skey = resData.data.skey,
                        isBindMd = resData.data.isBindMd;
                    that.globalData.isBindMd = isBindMd;
                    wx.setStorageSync('skey', skey);
                }else{
                    util.errorTip("微信授权失败，请稍后再试。");
                }
            },function(result){});
            wx.getUserInfo({
                success: function(res) {
                    that.globalData.userInfo = res.userInfo;
                    typeof cb == "function" && cb(result);

                }
            })
        })
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

            }, true);
        }
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
