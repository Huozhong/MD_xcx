//answer.js
let util = require('../../utils/util.js'),
    md5 = require('../../utils/md5'),
    app = getApp();
Page({
    data: {
        email: '',
        psw: ''
    },
    emailInput: function(e) {
        var email = e.detail.value;
        this.setData({
            email: email
        })
    },
    pswInput: function(e) {
        var psw = e.detail.value;
        this.setData({
            psw: psw
        })
    },
    save: function() {
        console.log(md5.md5('qweqwe'));
        let url = util.HOST + 'wx/bindUrs',
            data = {'urs': this.data.email,'password': md5.md5(this.data.psw)};
        util.requestData(url,data,function(result){
            let resData = result.data;
            if(resData.code==0){
                if(resData.data.userInfo.ID){
                    app.globalData.MDUserInfo = resData.data.userInfo;
                }else{
                    wx.showTip('提示','你的网易通信证帐号非梦岛帐号，点击确认前往注册梦岛帐号。',true,function(res){
                        if(res.confirm){
                            // todo
                        }
                    })
                }
            }else{

            }
        },function(result){});
        
    }


});
