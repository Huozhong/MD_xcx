let app = getApp(),
    util = require('../../utils/util.js');
Page({
    data: {
        photosData: null,
        photos: []
    },
    onLoad: function(options) {
        if(!options.photoid) wx.navigateBack();
        this.getData(options.photoid);
    },
    getData: function(photoid){
        let that = this,
            url = util.HOST + 'photos/'+ photoid,
            data = {'include': 'album_photos','userid':64};
       
        util.requestData(url,data,function(result){
            let resData = result.data;
            if(resData.code == 0 && resData.data){
                wx.setNavigationBarTitle({
                    title: resData.data.album.Name
                });
                
                for (var i = resData.data.albumPhotos.length - 1; i >= 0; i--) {
                    let photo = resData.data.albumPhotos[i];
                    if(photo.AuditStatus == 0){
                        photo.Url = photo.Url+'?imageView&'+util.AUTHINGMARK;
                    }else if(photo.AuditStatus == -2){
                        photo.Url = photo.Url+'?imageView&'+util.NOPASSEDMARK;
                    }
                    that.data.photos.push(photo.Url);
                }
                that.setData({
                    photosData: resData.data,
                    photos: that.data.photos
                });
            }else{
                util.errorTip();
            }
        },function(result){})
    }
})
