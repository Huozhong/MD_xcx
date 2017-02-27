//messages.js
let app = getApp(),
    util = require('../../utils/util.js'),
    WxParse = require('../../wxParse/wxParse.js'),
    getDataIng = false;
Page({
    data: {
        urls: {
            'friinforms':'qnm/getfriinforms',
            'informs':'qnm/getinforms',
            'msginforms':'qnm/getmsginforms'
        },
        dataType: ['friinforms', 'informs', 'msginforms'],
        currentType: 'informs',
        friinforms: [],
        informs: [],
        msginforms: []
    },
    // 页面下拉时调用
    onPullDownRefresh: function() {
        wx.stopPullDownRefresh();
        this.refreshData();
    },
    // 滚动到底部时调用
    onReachBottom: function() {
        let curDataType = this.data.currentType;
        if(!this.data[curDataType + 'NoMore'] && !getDataIng){
            this.getData();
        }
    },
    // swiper切换
    bindSwiperChange: function(e) {
        this.refreshData(e.detail.current);
    },
    // 点击顶部导航时调用
    bindNavChange: function(e) {
        this.refreshData(e.currentTarget.dataset.curswx);
    },
    // 重新获取数据
    refreshData: function(type){
        this.data.friinforms.length = 0;
        this.data.informs.length = 0;
        this.data.msginforms.length = 0;
        this.setData({
            currentType: type? type : this.data.currentType,
            friinforms: this.data.friinforms,
            informs: this.data.informs,
            msginforms: this.data.msginforms,
            friinformsNoMore: false,
            informsNoMore: false,
            msginformsNoMore: false
        });
        this.getData();
    },
    onShow: function() {
        this.refreshData();
    },
    getData: function() {
        let that = this,
            _url = util.HOST + that.data.urls[this.data.currentType],
            data = { 'userid': 64 },
            curDataType = this.data.currentType;
        if (this.data[curDataType][0]) data['lastid'] = this.data[curDataType][this.data[curDataType].length - 1].ID;
        getDataIng = true;
        util.requestData(_url, data, function(result) {
            getDataIng = false;
            let resData = result.data;
            if (resData.code == 0 && resData.data) {
                let _informs = resData.data,
                    obj = {};
                if(curDataType != 'friinforms'){
                    for (var i = 0; i < _informs.length; i++) {
                        if(_informs[i].refer.Text&&_informs[i].Type!=7&&_informs[i].Type!=12){
                            _informs[i].refer.Text = util.parseFace(_informs[i].refer.Text);
                            _informs[i].TextHtml = WxParse.wxParse('html','html',_informs[i].refer.Text,that,0);
                        }
                        if((_informs[i].Type!=7||_informs[i].Type!=12)&&_informs[i].Message){
                            _informs[i].MessageHtml = WxParse.wxParse('html','html',_informs[i].Message,that,0);
                        }
                    }
                }
                obj[curDataType + 'NoMore'] = _informs.length < 10 ? true : false;
                obj[curDataType] = that.data[curDataType].concat(_informs);

                that.setData(obj);
            } else {
                util.errorTip();
            }
        }, function(result) {
            getDataIng = false;
        })
    }
})
