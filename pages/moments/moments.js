//moments.js
let app = getApp(),
    util = require('../../utils/util.js'),
    WxParse = require('../../wxParse/wxParse.js'),
    page = 0;
Page({
    data: {
        hasMore: true,
        moments: [],
        scrollTop: 10,
        pullDown: false,
        category: '',
        isLogin: false,
        showMore: false
    },
    // 点击单条新鲜事时调用
    bindViewTap: function() {
        let link = e.currentTarget.dataset.link;
        app.news = link;
        wx.navigateTo({
            url: '../news/news'
        })
    },
    // 切换新鲜事分类
    bindChangeMomentCategory: function(e) {
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
    bindShowComment: function(e) {
        if (this.data.isLogin) {
            let mom_id = e.currentTarget.dataset.mom_id;
            util.requestData(util.HOST + '');
        } else {
            util.showLoginTip();
        }
    },
    // 点击新鲜事点赞时调用
    bindLike: function(e) {
        if (this.data.isLogin) {
            let mom_id = e.currentTarget.dataset.mom_id;
            util.requestData(util.HOST + '');
        } else {
            util.showLoginTip();
        }
    },
    // 点击非更多按钮处时调用
    bindHideMore: function(e) {
        for (let i = 0; i < this.data.moments.length; i++) {
            this.data.moments[i].showMore = false;
        }
        this.setData({
            moments: this.data.moments
        });
    },
    // 点击图片时调用
    bindShowImgs: function(e) {
        let mom_index = e.currentTarget.dataset.mom_index,
            img_index = e.currentTarget.dataset.img_index;
        let imageUrls = [];
        for (var i = 0; i < this.data.moments[mom_index].ImgList.length; i++) {
            imageUrls.push(this.data.moments[mom_index].ImgList[i].pic);
        }
        wx.previewImage({
            current: this.data.moments[mom_index].ImgList[img_index].pic, // 当前显示图片的http链接
            urls: imageUrls // 需要预览的图片http链接列表
        })
    },
    // 点击显示更多时调用
    bindShowMore: function(e) {
        let mom_index = e.currentTarget.dataset.mom_index;
        for (let i = 0; i < this.data.moments.length; i++) {
            this.data.moments[i].showMore = false;
        }
        this.data.moments[mom_index].showMore = true;
        this.setData({
            moments: this.data.moments
        });
    },
    // 显示新鲜事详情时调用
    bindShowMomentDetail: function(e) {
        let showMomentId = e.currentTarget.dataset.mom_id,
            showMomentIndex = e.currentTarget.dataset.mom_index;
        this.bindHideMore(e);
        wx.setStorageSync('showMomentId',showMomentId);
        wx.navigateTo({
            url: '../moment/moment'
        });
    },
    // 页面加载完成时调用
    onLoad: function() {
        this.refreshData();
        util.chargeMDUserInfo();
    },
    //重新获取数据时调用
    refreshData: function() {
        page = 0;
        this.setData({
            moments: []
        });
        this.getMoments();
    },
    // 页面下拉时调用
    onPullDownRefresh: function() {
        this.setData({ pullDown: true });
        wx.stopPullDownRefresh();
        this.refreshData();
    },
    // 页面滚动到底部时调用
    onReachBottom: function() {
        this.getMoments();
    },
    // 获取新鲜事时调用
    getMoments: function() {
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
            util.requestData(util.HOST + 'qnm/gethotmoments', data, function(result) {
                let resultData = result.data;
                if (resultData.code == 0 && resultData.data && resultData.data.list) {
                    let resData = resultData.data.list;
                    for (let i = 0; i < resData.length; i++) {
                        resData[i].Text = util.parseFace(resData[i].Text);
                        resData[i].Html = WxParse.wxParse('html', 'html', resData[i].Text, that, 0);
                        resData[i].PublishTime = util.getPublishTime(resData[i].duration, resData[i].CreatTime);
                        resData[i].showMore = false;
                    }
                    that.setData({
                        moments: that.data.moments.concat(resData)
                    });
                    setTimeout(function() {
                        that.setData({ pullDown: false });
                    }, 500);
                } else {
                    that.setData({
                        hasMore: false
                    });
                    return false;
                }
            }, function(result) {
                --page;
            });
        } else {
            that.setData({
                hiddenTip: false
            })
        }
    },
    wxParseImgLoad: function(e) {
        var that = this;
        WxParse.wxParseImgLoad(e, that);
    }
})
