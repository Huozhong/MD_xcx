//moments.js
let app = getApp(),
    util = require('../../utils/util.js'),
    momentUtil = require('../../utils/momentUtil.js'),
    page = 0,
    lastid = null;
Page({
    data: {
        hasMore: true,
        moments: [],
        scrollTop: 10,
        isHot: true,
        category: '',
        isLogin: false,
        showMore: false,
        momentsNoMore: false,
        isMomentList: true,
        MYID: null,
        followTypeHash: {},
        MYID: null
    },
    // 点击单条新鲜事的评论调用
    bindAddComm: function(e) {
        let mom_index = e.currentTarget.dataset.mom_index;
        let mom_id = e.currentTarget.dataset.mom_id;
        if (!this.data.moments[mom_index].showCommList) {
            this.data.moments[mom_index].inputVal = '';
            this.getCommOfMon(mom_id, mom_index);

        } else {
            this.data.moments[mom_index].showCommList = false;
            this.data.moments[mom_index].inputTxt = '输入评论内容';
            this.data.moments[mom_index].btnTxt = '评论';
            this.data.moments[mom_index].inputVal = '';
            this.setData({
                moments: this.data.moments
            })
        }
    },
    // 点击进入主页时调用
    bindToHome: function(e) {
        let uid = e.currentTarget.dataset.userid;
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
        let mom_index = e.currentTarget.dataset.mom_index;
        let type = e.currentTarget.dataset.type;
        momentUtil.likeMoment(mom_index, type, this);
    },
    // 点击图片时调用
    bindShowImgs: function(e) {
        let mom_index = e.currentTarget.dataset.mom_index,
            img_index = e.currentTarget.dataset.img_index;
        momentUtil.previewMomentImgs(mom_index, img_index, this);
    },
    // 点击显示更多时调用
    bindShowMore: function(e) {
        let mom_index = e.currentTarget.dataset.mom_index;
        momentUtil.showMore(mom_index, this);
    },
    // 点击回复评论时调用
    bindAnsComm: function(e) {
        let comm_index = e.currentTarget.dataset.comm_index;
        let mom_index = e.currentTarget.dataset.mom_index;
        momentUtil.ansComment(mom_index, comm_index, this);
    },
    inputFocus: function(e) {
        let mom_index = e.currentTarget.dataset.mom_index;
        momentUtil.commInputFocus(mom_index, this);
    },
    bindInput: function(e) {
        let val = e.detail.value,
            mom_index = e.currentTarget.dataset.mom_index;
        momentUtil.commInputing(val, mom_index, this);
    },
    submitComm: function(e) {
        let mom_index = e.currentTarget.dataset.mom_index;
        momentUtil.submitComm(mom_index, this);
    },
    // 页面加载完成时调用
    onLoad: function() {
        if (app.globalData.MDUserInfo && app.globalData.MDUserInfo.ID)
            this.setData({
                MYID: app.globalData.MDUserInfo.ID
            });
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
        // this.setData({ pullDown: true });
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
            data = {},
            _url = this.data.isHot ? 'qnm/gethotmoments' : 'qnm/getmoments',
            nokey = that.data.MYID? false : true;
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
                    if (resData.length < 10) {
                        that.setData({
                            hasMore: false
                        });
                        return;
                    }
                    if (!that.data.isHot) {
                        lastid = resData[resData.length - 1].ID;
                    }
                    that.setData({
                        moments: that.data.moments.concat(resData)
                    });
                    // setTimeout(function() {
                    //     that.setData({ pullDown: false });
                    // }, 500);
                } else {
                    that.setData({
                        hasMore: false
                    });
                    return false;
                }
            }, function(result) {
                --page;
            },nokey);
        } else {
            that.setData({
                hiddenTip: false
            })
        }
    },
    // 获取新鲜事的评论
    getCommOfMon: function(id, index) {
        util.getCommOfMon(id, index, this);
    },
    bindShowMomentDetail: function(e){
        let id = e.currentTarget.dataset.mom_id;
        momentUtil.goToMomentDetail(id);
    }
})
