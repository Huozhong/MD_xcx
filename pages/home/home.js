//home.js
let util = require('../../utils/util.js'),
    app = getApp();
Page({
    data: {
        motto: 'Hello World',
        userInfo: {}
    },
    //事件处理函数
    bindViewTap: function() {
        wx.navigateTo({
            url: ''
        })
    },
    onShow: function() {
        let that = this;

        app.getMdUserInfo(function(userInfo) {
            if (!userInfo) {
                util.showLoginTip();
            }else{
                that.setData({
                    userInfo: userInfo
                });    
            }
            
        })
    },
    onLoad: function() {

    }
});
