//home.js
let util = require('../../utils/util.js'),
    WxParse = require('../../wxParse/wxParse.js'),
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
        hasMoreMessages: true,
        curUserid: 63,
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
        got_albumData: false
    },
    //事件处理函数
    // 切换顶部导航
    bindNavChange: function(e) {
        let curnav = e.currentTarget.dataset.curnav;
        this.setData({
            currentNav: curnav,
            category: ''
        });
        if(curnav == 'role'){
            this.refreshData();
        }else if(!this.data['got_'+curnav+'Data']){
            this.refreshData();
            let obj = {};
            obj['got_'+curnav+'Data'] = true;
            this.setData(obj);
        }
    },
    bindChangeMomentCategory: function(e) {
        let category = e.currentTarget.dataset.category;
        let obj = {
            moments: [],
            hasMoreMoments: true,
            category: category ? category : '',
            hasMoreMessages: true
        };
        lastid = null;
        this.setData(obj);
        this.getMoments();
    },
    initData: function() {
        let obj = {
            homeData: {},
            moments: [],
            hasMoreMoments: true,
            category: '',
            currentNav: 'home',
            msgCount: 0,
            messages: [],
            hasMoreMessages: true,
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
            got_albumData: false
        };
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
            url: '../moment/moment?momentid=' + showMomentId
        });
    },
    // 显示留言详情时调用
    bindShowMessageDetail: function(e) {
        let showMsgId = e.currentTarget.dataset.msg_id;
        wx.navigateTo({
            url: '../message/message?messageid=' + showMsgId
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
    bindToHome: function(e) {
        let uid = e.currentTarget.dataset.userid;
        if(uid == this.data.curUserid) return;
        // todo   判断是不是自己
        util.toHome(uid);
    },
    // 进入设置
    bindToSetting: function(){
        wx.navigateTo({
            url: '../settings/settings'
        });
    },
    // 添加评论
    bindAddComm: function(e) {
        let mom_index = e.currentTarget.dataset.mom_index;
        let mom_id = e.currentTarget.dataset.mom_id;
        if (!this.data.moments[mom_index].showCommList) {
            this.getCommOfMon(mom_id, mom_index);
        } else {
            this.data.moments[mom_index].showCommList = false;
            this.setData({
                moments: this.data.moments
            })
        }
    },
    // 点击回复评论时调用
    bindAnsComm: function(e) {
        let comm_index = e.currentTarget.dataset.comm_index;
        let momx = e.currentTarget.dataset.mom_index;
        this.data.moments[momx].inputFocus = true;
        let inputTxt = '回复' + this.data.moments[momx].commlist.commlist[comm_index].userInfo.NickName;
        this.data.moments[momx].inputTxt = inputTxt;
        this.setData({
            moments: this.data.moments
        });
    },
    // 显示端游装备信息
    showQnEqInfo: function(e){
        let eqId = e.currentTarget.dataset.eq;
        this.data.roleData.qnRoleData.showEq = WxParse.wxParse('html','html',this.data.roleData.qnRoleData.RoleInfo.EquipInfo['equip'+eqId].info,this,0);
        this.data.roleData.showQnEq = true;
        this.setData({
            roleData: this.data.roleData
        });
    },
    // 显示手游装备信息
    showQnmEqInfo: function(e){
        let eqId = e.currentTarget.dataset.eq;
        this.data.roleData.qnmRoleData.showEq = WxParse.wxParse('html','html',this.data.roleData.qnmRoleData.EquipInfo['equip'+eqId].info,this,0);
        this.data.roleData.showQnmEq = true;
        this.setData({
            roleData: this.data.roleData
        });
    },
    // 关闭装备信息
    hideEqInfo: function(){
        this.data.roleData.qnmRoleData.showEq = null;
        this.data.roleData.qnRoleData.showEq = null;
        this.data.roleData.showQnmEq = false;
        this.data.roleData.showQnEq = false;
        this.setData({
            roleData: this.data.roleData
        });
    },
    // 切换游戏
    changeGame: function(e){
        let game = e.currentTarget.dataset.game;
        this.data.roleData.curGame = game;
        this.setData({
            roleData: this.data.roleData
        });
        this.getroleData();
    },
    // 获取新鲜事的评论
    getCommOfMon: function(id, index) {
        util.getCommOfMon(id, index, this);
    },
    // 添加留言回复
    bindAddAns: function(e) {
        let mom_index = e.currentTarget.dataset.mom_index;
        let mom_id = e.currentTarget.dataset.mom_id;
        if (!this.data.messages[mom_index].showCommList) {
            this.getCommOfMsg(mom_id, mom_index);
        } else {
            this.data.messages[mom_index].showCommList = false;
            this.setData({
                messages: this.data.messages
            })
        }
    },
    // 点击回复留言回复时调用
    bindAnsAnswer: function(e) {
        let comm_index = e.currentTarget.dataset.comm_index;
        let momx = e.currentTarget.dataset.mom_index;
        this.data.messages[momx].inputFocus = true;
        let inputTxt = '回复' + this.data.messages[momx].anslist.anslist[comm_index].userInfo.NickName;
        this.data.messages[momx].inputTxt = inputTxt;
        this.setData({
            messages: this.data.messages
        });
    },
    // 获取新鲜事的评论
    getCommOfMsg: function(id, index) {
        util.getCommOfMsg(id, index, this);
    },
    onLoad: function(options) {
        if (options.userid) {
            this.setData({
                curUserid: options.userid
            });
        }
    },
    onShow: function() {
        this.refreshData();
    },
    onHide: function(){
        this.initData();
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
        // this.initData(true);
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
        data['targetid'] = this.data.curUserid;
        util.requestData(util.HOST + 'home', data, function(result) {
            let resData = result.data;
            if (resData.code == 0 && resData.data) {
                let momentsData = util.initMomentsOrMsgsData(resData.data.momentList, that, 'moment');
                if (momentsData[0]) lastid = momentsData[momentsData.length - 1].ID;
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
            data = { 'targetid': this.data.curUserid };
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
                if (momentsData[0]) lastid = momentsData[momentsData.length - 1].ID;
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
        if (this.data.roleData.curGame == 'qn') {
            this.getQnRoleData();
        } else {
            this.getQnmRoleData();
        }
    },
    getQnmRoleData: function() {
        if(this.data.roleData.gotQnmData){
            return;
        }
        let that = this,
            _data = {
                'targetid': this.data.curUserid
            };
        util.requestData(util.HOST + 'home/role', _data, function(result) {
            let _resData = result.data;
            if (_resData.code == 0 && _resData.data) {
                that.data.roleData.gotQnmData = true;
                that.setData({
                    roleData: that.data.roleData
                });
                if(_resData.data.RoleId){
                    let data = _resData.data;
                    if (!data.Gang) data.Gang = '无';
                    that.data.roleData.qnmRoleData = data;
                    that.setData({
                        roleData: that.data.roleData
                    });
                }else{
                    that.data.roleData.hasQnmRole = false;
                    that.setData({
                        roleData: that.data.roleData
                    });
                }
            } else {
                util.errorTip();
            }
        }, function(result) {});
    },
    getQnRoleData: function() {
        if(this.data.roleData.gotQnData){
            return;
        }
        let that = this;
        util.requestData(util.HOST + 'games/qn/users/' + this.data.curUserid + '/role_infos/bind', {}, function(result) {
            let _resData = result.data;
            if (_resData.code == 0 && _resData.data) {
                if (_resData.data.roleInfos[0]) {
                    let _roleInfos = _resData.data.roleInfos;
                    let mainRoleID = null;
                    for (var i = 0; i < _roleInfos.length; i++) {
                        _roleInfos[i].BindType == 2 ? function() {
                            mainRoleID = _roleInfos[i].RoleId;
                            i = _roleInfos.length;
                        }() : {};
                    }
                    if (!mainRoleID) mainRoleID = _roleInfos[0].RoleId;
                    util.requestData(util.HOST + 'games/qn/role_infos/' + mainRoleID, {}, function(result) {
                        that.data.roleData.gotQnData = true;
                        that.setData({
                            roleData: that.data.roleData
                        });
                        let _resData = result.data;
                        if (_resData.code == 0 && _resData.data) {
                            let data = _resData.data;
                            if (!data.Gang) data.Gang = '无';
                            that.data.roleData.qnRoleData = data;
                            that.setData({
                                roleData: that.data.roleData
                            });
                        } else {
                            util.errorTip();
                        }
                    }, function(result) {});
                }else{
                    that.data.roleData.gotQnData = true;
                    that.data.roleData.hasQnRole = false;
                    that.setData({
                        roleData: that.data.roleData
                    });
                }
            } else {
                util.errorTip();
            }
        }, function(result) {});
    },
    getmsgboardData: function() {
        let that = this,
            _data = {
                'targetid': this.data.curUserid,
                'type': 1
            };
        getDataIng = true;
        if (lastid) _data['lastid'] = lastid;
        util.requestData(util.HOST + 'qnm/getmsgs', _data, function(result) {
            getDataIng = false;
            let _resData = result.data;
            if (_resData.code == 0 && _resData.data) {
                let msgsData = util.initMomentsOrMsgsData(_resData.data, that, 'msg');
                if(msgsData[0]) lastid = msgsData[msgsData.length - 1].ID;
                if (msgsData.length < 10) {
                    that.setData({
                        hasMoreMessages: false
                    });
                }
                that.setData({
                    messages: that.data.messages.concat(msgsData)
                });
            } else {
                util.errorTip();
            }
        }, function(result) {})
    },
    getmsgNum: function() {
        let that = this;
        let data = {};
        data['targetid'] = this.data.curUserid;
        util.requestData(util.HOST + 'qnm/getmsgsnum', data, function(result) {
            let resData = result.data;
            if (resData.code == 0) {
                that.setData({
                    msgCount: resData.data
                });
                if (that.data.msgCount > 0) {
                    that.getmsgboardData();
                }
            } else {
                util.errorTip();
            }
        }, function(result) {

        })
    },
    getalbumData: function() {

    }
});
