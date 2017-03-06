let app = getApp(),
    util = require('../../utils/util.js'),
    lastid = null;
Page({
    data: {
        albumData: null,
        noData: false
    },
    onLoad: function(options) {
        if(!options.albumid) wx.navigateBack();
        this.getData(options.albumid);
    },
    getData: function(albumid){
        let that = this,
            url = util.HOST + 'photo_albums/'+ albumid + '/photos',
            data = {'perPage': 15,'userid':64};
        if(lastid)
            data['lastId'] = lastid;
        util.requestData(url,data,function(result){
            let resData = result.data;
            if(resData.code == 0 && resData.data){
                wx.setNavigationBarTitle({
                    title: resData.data.album.Name
                });
                if(!resData.data.photos[0]){
                    that.data.noData = true;
                }
                for (var i = resData.data.photos.length - 1; i >= 0; i--) {
                    let photo = resData.data.photos[i];
                    if(photo.AuditStatus == 0){
                        photo.Url = photo.Url+'?imageView&thumbnail=300y300'+util.AUTHINGMARK;
                    }else if(photo.AuditStatus == -2){
                        photo.Url = photo.Url+'?imageView&thumbnail=300y300'+util.NOPASSEDMARK;
                    }else{
                        photo.Url = photo.Url+'?imageView&thumbnail=300y300';
                    }
                }
                that.setData({
                    albumData: resData.data,
                    noData: that.data.noData
                });
            }else{
                util.errorTip();
            }
        },function(result){})
    },
    goToPhotos: function(e){
        wx.navigateTo({
            url: '../photos/photos?photoid='+e.currentTarget.dataset.id
        })
    }
})
