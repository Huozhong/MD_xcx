//moments.js
let app = getApp(),
    util = require('../../utils/util.js'),
    WxParse = require('../../wxParse/wxParse.js'),
    page = 0,
    lastid = null;
Page({
    data: {
        hasMore: true,
        moments: [],
        scrollTop: 10,
        pullDown: false,
        isHot: true,
        category: '',
        isLogin: false,
        showMore: false,
        momentsNoMore: false,
        isMomentList: true
    },
    // 点击单条新鲜事的评论调用
    bindAddComm: function(e) {
        let mom_index = e.currentTarget.dataset.mom_index;
        let mom_id = e.currentTarget.dataset.mom_id;
        if(!this.data.moments[mom_index].showCommList){
            this.getCommOfMon(mom_id,mom_index);
        }else{
            this.data.moments[mom_index].showCommList = false;
            this.setData({
                moments: this.data.moments
            })
        }
    },
    // 点击进入主页时调用
    bindToHome: function(e){
        let uid = e.currentTarget.dataset.userid;
        // todo   判断是不是自己
        util.toHome(uid);
    },
    // 切换好友新鲜事和热门新鲜事
    bindChangeTopNav: function(e) {
        let ishot = e.currentTarget.dataset.ishot == 1 ? true : false;
        this.setData({
            isHot: ishot,
            category: ''
        });
        this.refreshData();
    },
    // 切换新鲜事分类
    bindChangeMomentCategory: function(e) {
        let category = e.currentTarget.dataset.category;
        this.setData({
            category: category
        });
        this.refreshData();
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
        let showMomentId = e.currentTarget.dataset.mom_id;
        this.bindHideMore(e);
        wx.navigateTo({
            url: '../moment/moment?momentid='+showMomentId
        });
    },
    // 点击回复评论时调用
    bindAnsComm: function(e){
        let comm_index = e.currentTarget.dataset.comm_index;
        let momx = e.currentTarget.dataset.mom_index;
        this.data.moments[momx].inputFocus = true;
        let inputTxt = '回复'+this.data.moments[momx].commlist.commlist[comm_index].userInfo.NickName;
        this.data.moments[momx].inputTxt = inputTxt;
        this.setData({
            moments: this.data.moments
        });
    },
    // 页面加载完成时调用
    onLoad: function() {
        console.log(app.globalData);
        this.refreshData();
        util.chargeMDUserInfo();
    },
    //重新获取数据时调用
    refreshData: function() {
        page = 0;
        lastid = null;
        this.setData({
            moments: [],
            hasMore: true
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
        let that = this,
            _url = this.data.isHot ? 'qnm/gethotmoments' : 'qnm/getmoments',
            data = { 'userid': 64 };
        if (that.data.hasMore) {
            if (this.data.isHot) {
                data['page'] = page++;
            } else if (lastid) {
                data['lastid'] = lastid;
            }
            if (that.data.category != '') {
                data['category'] = that.data.category;
            }
            util.requestData(util.HOST + _url, data, function(result) {
                let resultData = result.data;
                if (resultData.code == 0 && resultData.data) {
                    let resData = that.data.isHot ? resultData.data.list : resultData.data;
                    resData = util.initMomentsOrMsgsData(resData, that, 'moment');
                    if (!that.data.isHot) {
                        lastid = resData[resData.length - 1].ID;
                    }
                    if (resData.length < 10) {
                        that.setData({
                            hasMore: false
                        });
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
    // 获取新鲜事的评论
    getCommOfMon: function(id,index){
        util.getCommOfMon(id,index,this);
    }
})
