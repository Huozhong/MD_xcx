//app.js
App({
  onLaunch: function () {
    //调用API从本地缓存中获取数据
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
  },
  getMDUserInfo: function () {
    let email = wx.getStorageSync('email'),
      roleid = wx.getStorageSync('roleid');
    //跳转到auth绑定认证页面
    if (!email) {
      wx.showModal({
        title: '提示',
        content: '检测到您还未绑定梦岛账号，请绑定',
        confirmText: '去绑定',
        success: function (res) {
          if (res.confirm) {
            wx.navigateTo({
              url: '../auth/auth'
            })
          } else {
            wx.switchTab({
              url: '/pages/moments/moments'
            })
          }
        }
      });
    }
  },
  getUserInfo: function (cb) {
    var that = this
    if (this.globalData.userInfo&&this.globalData.MDUserInfo) {
      typeof cb == "function" && cb(this.globalData.userInfo)
    } else {
      //调用登录接口
      wx.login({
        success: function () {
          that.getMDUserInfo();
          wx.getUserInfo({
            success: function (res) {
              that.globalData.userInfo = res.userInfo
              typeof cb == "function" && cb(that.globalData.userInfo);

            }
          })
        }
      })
    }
  },

  globalData: {
    userInfo: null,
    MDUserInfo: null
  }
})