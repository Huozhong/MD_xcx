//messages.js
let app = getApp(),
    util = require('../../utils/util.js'),
    WxParse = require('../../wxParse/wxParse.js'),
    getDataIng = false;
Page({
    data: {
        messages: []
    },

    // 点击顶部导航时调用
    bindNavChange: function(e) {
        this.refreshData(e.currentTarget.dataset.curswx);
    },
    onLoad: function(options) {
        util.chargeMDUserInfo();
        if (options.messageid) {
            this.getMessage(options.messageid);
        } else {
            util.showTip('错误', '无留言id。', false, '确定', function() {
                wx.navigateBack();
            });
        }
    },
    getMessage: function(id) {
        let that = this,
            data = { 'messageid': id };
        util.requestData(util.HOST + 'qnm/getmsg', data, function(result) {
            let resultData = result.data;
            if (resultData.code == 0 && resultData.data[0]) {
                let resData = util.initMomentsOrMsgsData(resultData.data, that, 'msg')[0];
                resData.isMessageDetail = true;
                resData.showCommList = true;
                if (resData.anslist && resData.anslist.anslist && resData.anslist.anslist[0]) {
                    let _anslist = resData.anslist.anslist;
                    for (var i = 0; i < _anslist.length; i++) {
                        _anslist[i].Text = util.parseFace(_anslist[i].Text);
                        _anslist[i].Html = WxParse.wxParse('html', 'html', _anslist[i].Text, that, 0);
                        _anslist[i].PublishTime = util.getPublishTime(_anslist[i].Duration, _anslist[i].CreatTime);
                    }
                }
                that.setData({
                    messages: [resData]
                })
            } else {
                util.errorTip(resultData.msg);
            }
        }, function(result) {

        });
    }
})
