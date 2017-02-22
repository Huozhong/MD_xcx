//moments.js
let app = getApp(),
  util = require('../../utils/util.js'),
  url = util.HOST + 'qnm/gethotmoments',
  WxParse = require('../../wxParse/wxParse.js'),
  page = 0;
Page({
  data: {
    hasMore: true,
    moments: [],
    scrollTop: 10,
    pullDown: false,
    category: ''
  },
  // 点击单条新鲜事时调用
  bindViewTap: function () {
    let link = e.currentTarget.dataset.link;
    app.news = link;
    wx.navigateTo({
      url: '../news/news'
    })
  },
  // 切换新鲜事分类
  bindChangeMomentCategory: function (e) {
    let category = e.currentTarget.dataset.category;
    if (this.data.category != category) {
      this.setData({
        category: category
      });
      this.refreshData();
    } else {
      return;
    }
  },
  // 点击新鲜事评论时调用
  bindShowComment: function(e){
    let mom_id = e.currentTarget.dataset.mom_id;
    console.log(mom_id);
  },
  // 页面显示时调用
  onShow: function () {
    // 获取页面高度
    if (wx.getStorageSync('systemInfo')) {
      let sys = wx.getStorageSync('systemInfo');
      this.setData({
        windowHeight: sys.windowHeight
      });
    }
  },
  // 页面加载完成时调用
  onLoad: function () {
    this.refreshData();
  },
  //重新获取数据时调用
  refreshData: function () {
    page = 0;
    this.setData({
      moments: []
    });
    this.getMoments();
  },
  // 页面下拉时调用
  onPullDownRefresh: function () {
    this.setData({ pullDown: true });
    wx.stopPullDownRefresh();
    this.refreshData();
  },
  // 页面滚动到底部时调用
  onReachBottom: function () {
    // this.getMoments();
  },
  // 获取新鲜事时调用
  getMoments: function () {
    let that = this;
    if (that.data.hasMore) {
      if (page == 0) {
        wx.showToast({
          title: '加载中',
          icon: 'loading',
          duration: 500
        });
      }
      let data = { 'page': page++ };
      if (that.data.category != '') {
        data['category'] = that.data.category;
      }
      util.requestData(url, data, function (result) {
        let resultData = result.data;
        if (resultData.code == 0 && resultData.data && resultData.data.list) {
          let resData = resultData.data.list;
          for (let i = 0; i < resData.length; i++) {
            resData[i].Text = util.parseFace(resData[i].Text);
            resData[i].Html = WxParse.wxParse('html', 'html', resData[i].Text, that, 0);
            resData[i].PublishTime = util.getPublishTime(resData[i].duration, resData[i].CreatTime);
          }
          that.setData({
            moments: that.data.moments.concat(resData)
          });
          setTimeout(function () {
            that.setData({ pullDown: false });
          }, 500);
        } else {
          that.setData({
            hasMore: false
          });
          return false;
        }
      }, function (result) {
        --page;
      });
    } else {
      that.setData({
        hiddenTip: false
      })
    }
  }
    // wxParseImgLoad: function (e) {
    //     var that = this;
    //     WxParse.wxParseImgLoad(e, that);
    // }
})
