//home.js
let util = require('../../utils/util.js'),
    homeUtil = require('../../utils/homeUtil.js'),
    app = getApp();
Page({
    data: {
        homeData: {},
        moments: [],
        hasMoreMoments: true,
        category: '',
        currentNav: 'home',
        msgCount: 0,
        messages: [],
        hasMoreMessages: true,
        curUserId: null,
        roleData: {
            curGame: 'qnm',
            hasQnmRole: false,
            hasQnRole: false,
            qnmRoleData: {},
            qnRoleData: {},
            gotQnData: false,
            gotQnmData: false
        },
        got_homeData: true,
        got_msgboardData: false,
        got_albumData: false,
        lastid: null,
        getDataIng: false,
        MYID: null,
        isInHome: true,
        followTypeHash: {}
    },
    //事件处理函数
    // 切换顶部导航
    bindNavChange: function(e) {
        homeUtil.changeNav(e, this);
    },
    bindChangeMomentCategory: function(e) {
        homeUtil.changeMomentCategory(e, this);
    },
    // 点击显示更多时调用
    bindShowMore: function(e) {
        homeUtil.showMore(e, this);
    },
    // 显示留言详情时调用
    bindShowMessageDetail: function(e) {
        homeUtil.showMessageDetail(e);
    },
    // 点击图片时调用
    bindShowImgs: function(e) {
        homeUtil.showImgs(e, this);
    },
    // 点击进入主页时调用
    bindToHome: function(e) {
        let uid = e.currentTarget.dataset.userid;
        if (uid == this.data.curUserId) return;
        // todo   判断是不是自己
        util.toHome(uid);
    },
    // 进入设置
    bindToSetting: function() {
        wx.navigateTo({
            url: '../settings/settings'
        });
    },
    // 添加评论
    bindAddComm: function(e) {
        homeUtil.addComm(e, this);
    },
    // 点击回复评论时调用
    bindAnsComm: function(e) {
        homeUtil.ansComm(e, this);
    },
    // 显示端游装备信息
    showGameEqInfo: function(e) {
        homeUtil.showGameEqInfo(e, this);
    },
    // 关闭装备信息
    hideEqInfo: function() {
        homeUtil.hideEqInfo(this);
    },
    // 切换游戏
    changeGame: function(e) {
        homeUtil.changeGame(e, this);
    },
    // 获取新鲜事的评论
    getCommOfMon: function(id, index) {
        util.getCommOfMon(id, index, this);
    },
    // 添加留言回复
    bindAddAns: function(e) {
        homeUtil.addAns(e, this);
    },
    // 点击回复留言回复时调用
    bindAnsAnswer: function(e) {
        homeUtil.ansAnswer(e, this);
    },
    // 获取新鲜事的评论
    getCommOfMsg: function(id, index) {
        util.getCommOfMsg(id, index, this);
    },
    onLoad: function(options) {
        if (options.userid) {
            this.setData({
                curUserId: options.userid
            });
        }
        if (app.globalData.MDUserInfo.ID)
            this.setData({
                MYID: app.globalData.MDUserInfo.ID
            });
    },
    onShow: function() {
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
        if (this.data.hasMoreMessages && !this.data.getDataIng && this.data.currentNav == 'msgboard') {
            this.getmsgboardData();
        }
    },
    refreshData: function() {
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
        homeUtil.getHomeData(this);
    },
    // 页面滚动到底部时调用
    scrollToLower: function() {
        if (this.data.hasMoreMoments && !this.data.getDataIng) {
            this.getMoments();
        }
    },
    // 获取新鲜事时调用
    getMoments: function() {
        homeUtil.getMoments(this);
    },
    getroleData: function() {
        if (this.data.roleData.curGame == 'qn') {
            this.getQnRoleData();
        } else {
            this.getQnmRoleData();
        }
    },
    getQnmRoleData: function() {
        homeUtil.getQnmRoleData(this);
    },
    getQnRoleData: function() {
        homeUtil.getQnRoleData(this);
    },
    getmsgboardData: function() {
        homeUtil.getmsgboardData(this);
    },
    getmsgNum: function() {
        homeUtil.getmsgNum(this);
    },
    getalbumData: function() {
        homeUtil.getalbumData(this);
    },
    addAlbum: function() {
        wx.navigateTo({
            url: '../newAlbum/newAlbum'
        })
    },
    toAlbum: function(e) {
        let albumid = e.currentTarget.dataset.id;
        wx.navigateTo({
            url: '../album/album?albumid=' + albumid
        });
    },
    // 点击新鲜事点赞时调用
    bindLike: function(e) {
        let mom_index = e.currentTarget.dataset.mom_index;
        let type = e.currentTarget.dataset.type;
        homeUtil.likeMoment(mom_index, type, this);
    },
    inputFocus: function(e){
        homeUtil.commInputFocus(e,this);
    },
    bindInput: function(e) {
        homeUtil.commInputing(e,this);
    },
    submitComm: function(e) {
        homeUtil.submitComm(e,this);
    },
    bindShowMomentDetail: function(e){
        homeUtil.goToMomentDetail(e, this);
    }
});
