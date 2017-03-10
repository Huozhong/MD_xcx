let app = getApp(),
    util = require('../../utils/util.js');
Page({
    data: {
        photosData: null,
        thumbPhotos: [],
        photos: [],
        curPhotoIndex: 0,
        showPhotoMan: false,
        editPhotoInfo: false,
        inputPlaceholder: '',
        inputVal: '',
        inputValChanged: false,
        inputType: '',
        inputLength: 0
    },
    onLoad: function(options) {
        if (!options.photoid) wx.navigateBack();
        this.setData({
            curPhotoId: options.photoid
        })
        this.getData();
    },
    getData: function() {
        let that = this,
            url = util.HOST + 'photos/' + this.data.curPhotoId,
            data = { 'include': 'album_photos', 'userid': 64 };
        util.requestData(url, data, function(result) {
            let resData = result.data;
            if (resData.code == 0 && resData.data) {
                wx.setNavigationBarTitle({
                    title: resData.data.album.Name
                });
                for (var i = 0; i < resData.data.albumPhotos.length; i++) {
                    let photo = resData.data.albumPhotos[i];
                    photo.Name = photo.Name ? photo.Name : '无';
                    photo.Desc = photo.Desc ? photo.Desc : '无';
                    that.data.photos.push(photo.Url);
                    if (photo.AuditStatus == 0) {
                        photo.Url = photo.Url + '?imageView&thumbnail=500x500' + util.AUTHINGMARK;
                    } else if (photo.AuditStatus == -2) {
                        photo.Url = photo.Url + '?imageView&thumbnail=500x500' + util.NOPASSEDMARK;
                    } else {
                        photo.Url = photo.Url + '?imageView&thumbnail=500x500';
                    }
                    that.data.thumbPhotos.push(photo.Url);
                    if (photo.ID == resData.data.photo.ID) {
                        that.data.curPhotoIndex = i;
                    }
                }
                that.setData({
                    photosData: resData.data,
                    thumbPhotos: that.data.thumbPhotos,
                    photos: that.data.photos,
                    curPhotoIndex: that.data.curPhotoIndex
                });
            } else {
                util.errorTip('未找到该图片。',function(res){
                    wx.navigateBack();
                });
            }
        }, function(result) {})
    },
    swiperChange: function(e) {
        let cur = e.detail.current;
        this.setData({
            curPhotoIndex: cur
        });
    },
    showBigPic: function() {
        let that = this;
        wx.previewImage({
            current: that.data.photos[that.data.curPhotoIndex],
            urls: that.data.photos
        })
    },
    bindShowPhotoMan: function() {
        let flag = this.data.showPhotoMan ? false : true;
        this.setData({
            showPhotoMan: flag
        });
    },
    hidePhotoMan: function() {
        this.setData({
            showPhotoMan: false
        });
    },
    setCover: function() {
        this.hidePhotoMan();
        let curp = this.data.photosData.albumPhotos[this.data.curPhotoIndex];
        let curpId = curp.ID,
            url = util.HOST + 'photos/' + curpId + 'asCover';
        let data = {'userid':64};
        util.requestData(url,data,function(result){
            let resData = result.data;
            if(resData.code == 0 && resData.data){
                wx.showToast({
                    title: '设置成功',
                    icon: 'success',
                    duration: 1000
                });
            }else{
                util.errorTip();
            }
        },function(result){});
    },
    delPhoto: function(){
        this.hidePhotoMan();
        util.showTip('提示', '确认删除？', true, '确认', function(res) {
            if(res.confirm){
                let curp = this.data.photosData.albumPhotos[this.data.curPhotoIndex];
                let curpId = curp.ID,
                    url = util.HOST + 'photos/' + curpId + 'delete';
                let data = {'userid':64};
                let that = this;
                util.requestData(url,data,function(result){
                    let resData = result.data;
                    if(resData.code == 0 && resData.data){
                        wx.showToast({
                            title: '删除成功',
                            icon: 'success',
                            duration: 1000,
                            success: function(){
                                setTimeout(function(){
                                    that.getData();
                                }, 1000);
                            }
                        });
                    }else{
                        util.errorTip();
                    }
                },function(result){});
            }
        });
    },
    editPhotoInfo: function(e){
        let type = e.currentTarget.dataset.type;
        let inputPlaceholder = type == 'name'? '此处输入图片名称' : '此处输入图片描述';
        let inputVal = '';
        if(type == 'name'){
            inputVal = this.data.photosData.albumPhotos[this.data.curPhotoIndex].Name == '无'? '' : this.data.photosData.albumPhotos[this.data.curPhotoIndex].Name;
        }else{
            inputVal = this.data.photosData.albumPhotos[this.data.curPhotoIndex].Desc == '无'? '' : this.data.photosData.albumPhotos[this.data.curPhotoIndex].Desc;
        }
        this.setData({
            editPhotoInfo: true,
            inputPlaceholder: inputPlaceholder,
            inputVal: inputVal,
            inputType: type,
            inputLength: type == 'name'? 7 : 100
        });
    },
    cancleChange: function(){
        this.setData({
            editPhotoInfo: false,
            inputPlaceholder: '',
            inputVal: '',
            inputValChanged: false,
            inputType: '',
            inputLength: 0
        });
    },
    bindInput: function(e){
        let val = e.detail.value;
        if(val!=this.data.inputVal){
            this.setData({
                inputValChanged: true,
                inputVal: val
            });
        }
    },
    save: function(e){
        if(this.data.inputValChanged){
            let val = this.data.inputVal,
                data = {'userid': 64},
                that = this,
                curp = this.data.photosData.albumPhotos[this.data.curPhotoIndex],
                curpId = curp.ID,
                key = this.data.inputType == 'name'? 'Name':'Desc',
                url = util.HOST + 'photos/'+curpId+'/update';
            data[this.data.inputType] = val;
            util.requestData(url, data, function(result){
                let resData = result.data;
                if(resData.code == 0 && resData.data){
                    wx.showToast({
                        title: '编辑成功',
                        icon: 'success',
                        duration: 1000,
                        success: function(){
                            setTimeout(function(){
                               that.cancleChange(); 
                               that.data.photosData.albumPhotos[that.data.curPhotoIndex][key] = val;
                               that.setData({
                                    photosData: that.data.photosData
                               })
                            }, 1000);
                        }
                    });
                }else{
                    util.errorTip("编辑失败");
                }
            },function(result){});
        }else{
            return;
        }
    }
})
