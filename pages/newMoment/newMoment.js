let app = getApp(),
    util = require('../../utils/util.js');
Page({
    data: {
        imgUrls: [],
        inputVal: ''
    },
    onLoad: function() {},
    chooseImg: function() {
        let that = this;
        if (this.data.imgUrls.length >= 9) {
            return;
        }
        util.chooseImg(9, function(temps) {
            let duoyu = that.data.imgUrls.length + temps.length - 9;
            if (duoyu > 0) {
                temps.splice(temps.length - duoyu, duoyu);
            }
            that.data.imgUrls = that.data.imgUrls.concat(temps);
            that.setData({
                imgUrls: that.data.imgUrls
            })
        })
    }

})
