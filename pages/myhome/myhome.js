//home.js
let util = require('../../utils/util.js'),
    app = getApp(),
    lastid = null,
    getDataIng = false;
Page({
    data: {
        homeData: {},
        moments: [],
        hasMoreMoments: true,
        category: '',
        currentNav: 'home',
        msgCount: 0,
        messages: [],
        hasMoreMessages: true
    },
    //事件处理函数
    // 切换好友新鲜事和热门新鲜事
    bindNavChange: function(e) {
        let curnav = e.currentTarget.dataset.curnav;
        this.setData({
            currentNav: curnav,
            category: ''
        });
        this.refreshData();
    },
    bindChangeMomentCategory: function(e) {
        let category = e.currentTarget.dataset.category;
        lastid = null;
        this.initData(false, category);
        this.getMoments();
    },
    initData: function(initHomeData, category) {
        let obj = {
            moments: [],
            hasMoreMoments: true,
            category: category ? category : '',
            messages: [],
            hasMoreMessages: true,
            msgCount: 0
        };
        lastid = null;
        if (initHomeData) {
            obj['homeData'] = {};
        }
        this.setData(obj);
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
    // 显示留言详情时调用
    bindShowMessageDetail: function(e) {
        let showMsgId = e.currentTarget.dataset.msg_id;
        wx.navigateTo({
            url: '../message/message?messageid='+showMsgId
        });
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
    // 点击进入主页时调用
    bindToHome: function(e){
        let uid = e.currentTarget.dataset.userid;
        // todo   判断是不是自己
        util.toHome(uid);
    },
    // 添加评论
    bindAddComm: function(e) {
        let mom_index = e.currentTarget.dataset.mom_index;
        let mom_id = e.currentTarget.dataset.mom_id;
        if (!this.data.moments[mom_index].showCommList) {
            this.getCommOfMon(mom_id, mom_index);
        }else{
            this.data.moments[mom_index].showCommList = false;
            this.setData({
                moments: this.data.moments
            })
        }
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
    // 获取新鲜事的评论
    getCommOfMon: function(id, index) {
        util.getCommOfMon(id, index, this);
    },
    // 添加留言回复
    bindAddAns: function(e){
        let mom_index = e.currentTarget.dataset.mom_index;
        let mom_id = e.currentTarget.dataset.mom_id;
        if (!this.data.messages[mom_index].showCommList) {
            this.getCommOfMsg(mom_id, mom_index);
        }else{
            this.data.messages[mom_index].showCommList = false;
            this.setData({
                messages: this.data.messages
            })
        }
    },
    // 点击回复留言回复时调用
    bindAnsAnswer: function(e){
        let comm_index = e.currentTarget.dataset.comm_index;
        let momx = e.currentTarget.dataset.mom_index;
        this.data.messages[momx].inputFocus = true;
        let inputTxt = '回复'+this.data.messages[momx].anslist.anslist[comm_index].userInfo.NickName;
        this.data.messages[momx].inputTxt = inputTxt;
        this.setData({
            messages: this.data.messages
        });
    },
    // 获取新鲜事的评论
    getCommOfMsg: function(id, index) {
        util.getCommOfMsg(id, index, this);
    },
    onLoad: function() {
        this.refreshData();
    },
    // 页面下拉时调用
    onPullDownRefresh: function() {
        wx.stopPullDownRefresh();
        this.refreshData();
    },
    // 滚动到底部时调用
    onReachBottom: function() {
        let curDataType = this.data.currentType;
        if (this.data.hasMoreMessages && !getDataIng && this.data.currentNav == 'msgboard') {
            this.getmsgboardData();
        }
    },
    refreshData: function() {
        this.initData(true);
        switch (this.data.currentNav) {
            case 'home':
                this.gethomeData();
                break;
            case 'role':
                this.getroleData();
                break;
            case 'msgboard':
                this.getmsgNum();
                break;
            case 'album':
                this.getalbumData();
                break;
        }
    },
    // 获取主页数据
    gethomeData: function() {
        let that = this;
        let data = {};
        data['userid'] = 64;
        util.requestData(util.HOST + 'home', data, function(result) {
            let resData = result.data;
            if (resData.code == 0 && resData.data) {
                let momentsData = util.initMomentsOrMsgsData(resData.data.momentList, that, 'moment');
                if(momentsData[0]) lastid = momentsData[momentsData.length - 1].ID;
                if (momentsData.length < 10) {
                    that.setData({
                        hasMoreMoments: false
                    });
                }
                that.setData({
                    moments: that.data.moments.concat(momentsData),
                    homeData: resData.data
                });
            } else {
                util.errorTip();
                that.setData({
                    hasMoreMoments: false
                });
            }
        }, function(result) {

        })
    },
    // 页面滚动到底部时调用
    scrollToLower: function() {
        if (this.data.hasMoreMoments && !getDataIng) {
            this.getMoments();
        }
    },
    // 获取新鲜事时调用
    getMoments: function() {
        getDataIng = true;
        let that = this,
            _url = 'qnm/getownmoments',
            data = { 'userid': 64 };
        if (lastid) {
            data['lastid'] = lastid;
        }
        if (that.data.category != '') {
            data['category'] = that.data.category;
        }
        util.requestData(util.HOST + _url, data, function(result) {
            let resultData = result.data;
            if (resultData.code == 0 && resultData.data) {
                let momentsData = util.initMomentsOrMsgsData(resultData.data, that, 'moment');
                if(momentsData[0]) lastid = momentsData[momentsData.length - 1].ID;
                if (momentsData.length < 10) {
                    that.setData({
                        hasMoreMoments: false
                    });
                }
                that.setData({
                    moments: that.data.moments.concat(momentsData)
                });
            } else {
                util.errorTip();
                that.setData({
                    hasMoreMoments: false
                });
            }
            getDataIng = false;
        }, function(result) {
            that.setData({
                hasMoreMoments: false
            });
            getDataIng = false;
        });
    },
    getroleData: function() {

    },
    getmsgboardData: function() {
        let that = this,
            _data = {
                'targetid': 64,
                'type': 1
            };
        getDataIng = true;
        if(lastid) _data['lastid'] = lastid;
        util.requestData(util.HOST + 'qnm/getmsgs', _data, function(result) {
            getDataIng = false;
            let _resData = result.data;
            if (_resData.code == 0 && _resData.data) {
                let msgsData = util.initMomentsOrMsgsData(_resData.data, that, 'msg');
                lastid = msgsData[msgsData.length - 1].ID;
                if (msgsData.length < 10) {
                    that.setData({
                        hasMoreMessages: false
                    });
                }
                that.setData({
                    messages: that.data.messages.concat(msgsData)
                });
            }else{
                util.errorTip();
            }
        }, function(result) {})
    },
    getmsgNum: function() {
        let that = this;
        let data = {};
        data['targetid'] = 63;
        util.requestData(util.HOST + 'qnm/getmsgsnum', data, function(result) {
            let resData = result.data;
            if (resData.code == 0) {
                that.setData({
                    msgCount: resData.data
                });
                if (that.data.msgCount > 0) {
                    that.getmsgboardData();
                }
            }else{
                util.errorTip();
            }
        }, function(result) {

        })
    },
    getalbumData: function() {

    }
});
