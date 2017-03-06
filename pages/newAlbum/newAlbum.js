let app = getApp(),
    util = require('../../utils/util.js');
Page({
    data: {
        curGame: 'qnm',
        curChannel: 0,
        albumName: '',
        inputError: false
    },
    onLoad: function() {},
    onHide: function() {
        this.setData({
            curGame: 'qnm',
            curChannel: 0,
            albumName: '',
            inputError: false
        });
    },
    changeGame: function(e) {
        let game = e.currentTarget.dataset.game;
        this.setData({
            curGame: game
        });
    },
    changeChannel: function(e) {
        let channel = e.currentTarget.dataset.channel;
        this.setData({
            curChannel: channel
        });
    },
    addAlbum: function() {
        let that = this,
            data = { 'userid': 64 };
        if (this.data.albumName == '') {
            util.errorTip('请输入相册名称！');
            this.setData({
                inputError: true
            });
        } else {
            let url = util.HOST + 'photo_albums/new';
            data['name'] = this.data.albumName;
            data['channelId'] = this.data.curChannel;
            data['game_name'] = this.data.curGame;
            util.requestData(url, data, function(result) {
                let resData = result.data;
                if (resData.code == 0 && resData.data && resData.data.photoAlbum) {
                    wx.showToast({
                        title: '添加成功',
                        icon: 'success',
                        duration: 1000,
                        success: function() {
                            setTimeout(function(){
                                wx.navigateBack({
                                    delta: 1
                                });
                            },1000)
                        }
                    });
                }else{
                    util.errorTip();
                }
            }, function(result) {});
        }

    },
    bindNameInput: function(e) {
        if(this.data.inputError){
            this.setData({
                inputError: false
            });
        }
        let name = e.detail.value;
        this.data.albumName = name;
    }

})
