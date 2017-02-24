//moment.js
let app = getApp(),
    util = require('../../utils/util.js'),
    WxParse = require('../../wxParse/wxParse.js'),
    page = 0;
Page({
    data: {
        moments: null
    },
    bindInput: function(e){
        this.setData({
            inputTxt: '111'
        })
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
    bindAnsComm: function(e){
        let comm_index = e.currentTarget.dataset.comm_index;
        this.data.moments[0].inputFocus = true;
        let inputTxt = '回复'+this.data.moments[0].commlist.commlist[comm_index].userInfo.NickName;
        this.data.moments[0].inputTxt = inputTxt;
        this.setData({
            moments: this.data.moments
        });
    },
    // 点击显示更多时调用
    bindShowMore: function(e) {
        this.data.moments[0].showMore = true;
        this.setData({
            moments: this.data.moments
        });
    },
    // 点击非更多按钮处时调用
    bindHideMore: function(e) {
        this.data.moments[0].showMore = false;
        this.setData({
            moments: this.data.moments
        });
    },
    // 点击新鲜事点赞时调用
    bindLike: function(e) {
        if(this.data.isLogin){
            let mom_id = e.currentTarget.dataset.mom_id;
            util.requestData(util.HOST + '');
        }else{
            util.showLoginTip();
        }
    },
    // 点击图片时调用
    bindShowImgs: function(e){
        let img_index = e.currentTarget.dataset.img_index;
        let imageUrls = [];
        for (var i = 0; i < this.data.item.ImgList.length; i++) {
            imageUrls.push(this.data.item.ImgList[i].pic);
        }
        wx.previewImage({
            current: this.data.item.ImgList[img_index].pic, 
            urls: imageUrls
        })
    },
    // 页面加载完成时调用
    onLoad: function() {
        util.chargeMDUserInfo();
        let showMomentId = wx.getStorageSync('showMomentId');
        this.getMoment(showMomentId);
    },
    // 获取新鲜事时调用
    getMoment: function(id) {
        wx.showToast({
            title: '加载中',
            icon: 'loading',
            duration: 10000
        });
        let that = this,
            data = { 'targetid': id };
        util.requestData(util.HOST + 'qnm/getmoment', data, function(result) {
            wx.hideToast();
            let resultData = result.data;
            if (resultData.code == 0 && resultData.data[0]) {
                let resData = resultData.data[0];
                resData.Text = util.parseFace(resData.Text);
                resData.Html = WxParse.wxParse('html', 'html', resData.Text, that, 0);
                resData.PublishTime = util.getPublishTime(resData.duration, resData.CreatTime);
                resData.showMore = false;
                resData.inputTxt = "输入评论内容";
                resData.isMomentDetail = true;
                resData.showCommList = true;
                resData.showZanUsers = true;
                let zanUsersArr = [], zanlist = resData.zanlist;
                if(zanlist[0]){
                    for (var i = 0; i < zanlist.length; i++) {
                        zanUsersArr.push(zanlist[i].userInfo.NickName);
                    }
                }
                if(resData.commlist.commlist[0]){
                    let _commlist = resData.commlist.commlist;
                    for (var i = 0; i < _commlist.length; i++) {
                        _commlist[i].Text = util.parseFace(_commlist[i].Text);
                        _commlist[i].Html = WxParse.wxParse('html','html',_commlist[i].Text,that,0);
                        _commlist[i].PublishTime = util.getPublishTime(_commlist[i].Duration, _commlist[i].CreatTime);
                    }
                }
                resData.zanUsers = zanUsersArr.join(', ');
                that.setData({
                    moments: [resData]
                })
            } else {
                
            }
        }, function(result) {

        });
    },
    wxParseImgLoad: function(e) {
        var that = this;
        WxParse.wxParseImgLoad(e, that);
    }
})
