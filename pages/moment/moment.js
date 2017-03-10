//moment.js
let app = getApp(),
    util = require('../../utils/util.js'),
    WxParse = require('../../wxParse/wxParse.js'),
    momentUtil = require('../../utils/momentUtil.js'),
    page = 0;
Page({
    data: {
        moments: null,
        curUserId: 64
    },
    // 点击新鲜事评论时调用
    bindAddComm: function(e) {
        this.data.moments[0].inputFocus = true;
        this.data.moments[0].inputTxt = "输入评论内容";
        this.setData({
            moments: this.data.moments
        });
    },
    // 点击回复评论时调用
    bindAnsComm: function(e) {
        let mom_index = e.currentTarget.dataset.mom_index,
            comm_index = e.currentTarget.dataset.comm_index;
        momentUtil.ansComment(mom_index,comm_index,this);
    },
    inputFocus: function(e) {
        let mom_index = e.currentTarget.dataset.mom_index;
        momentUtil.commInputFocus(mom_index,this);
    },
    // 点击显示更多时调用
    bindShowMore: function(e) {
        let mom_index = e.currentTarget.dataset.mom_index;
        momentUtil.showMore(mom_index, this);
    },
    // 点击非更多按钮处时调用
    bindHideMore: function(e) {
        this.data.moments[0].showMore = false;
        this.data.moments[0].inputFocus = false;
        this.setData({
            moments: this.data.moments
        });
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
    bindInput: function(e) {
        let val = e.detail.value,
            mom_index = e.currentTarget.dataset.mom_index;
        momentUtil.commInputing(val, mom_index, this);
    },
    submitComm: function(e) {
        let mom_index = e.currentTarget.dataset.mom_index;
        momentUtil.submitComm(mom_index,this);
    },
    // 页面加载完成时调用
    onLoad: function(options) {
        if (options.momentid) {
            this.getMoment(options.momentid);
        } else {
            util.showTip('错误', '无新鲜事id。', false, '确定', function() {
                wx.navigateBack();
            });
        }
    },
    // 获取新鲜事时调用
    getMoment: function(id) {
        let that = this,
            data = { 'targetid': id };
        util.requestData(util.HOST + 'qnm/getmoment', data, function(result) {
            let resultData = result.data;
            if (resultData.code == 0 && resultData.data[0]) {
                let resData = util.initMomentsOrMsgsData(resultData.data, that, 'moment')[0];
                resData.isMomentDetail = true;
                resData.showCommList = true;
                resData.inputFocus = false;
                let zanUsersArr = [],
                    zanlist = resData.zanlist;
                if (zanlist[0]) {
                    for (var i = 0; i < zanlist.length; i++) {
                        zanUsersArr.push(zanlist[i].userInfo.NickName);
                    }
                }
                if (resData.commlist.commlist[0]) {
                    let _commlist = resData.commlist.commlist;
                    for (var i = 0; i < _commlist.length; i++) {
                        _commlist[i].Text = util.parseFace(_commlist[i].Text);
                        _commlist[i].Html = WxParse.wxParse('html', 'html', _commlist[i].Text, that, 0);
                        _commlist[i].PublishTime = util.getPublishTime(_commlist[i].Duration, _commlist[i].CreatTime);
                        _commlist[i].isMyComm = _commlist[i].UserId == that.data.curUserId ? true : false;
                    }
                }
                resData.zanUsersArr = zanUsersArr;
                resData.zanUsers = zanUsersArr.join(', ');
                that.setData({
                    moments: [resData]
                })
            } else {
                util.errorTip(resultData.msg);
            }
        }, function(result) {

        });
    }
})
