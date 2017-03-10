let app = getApp(),
    util = require('../../utils/util.js');
Page({
    data: {
        curAlbumid: null,
        albumData: null,
        showAlbumMan: false,
        changeName: false,
        nameChanged: false,
        mutilOp: false,
        mutilOpType: '',
        showAlbumOptions: false,
        selectMoveAlbum: { Name: '请选择相册' },
        allChecked: false,
        mutilOpPhotosIds: [],
        noMoreData: false,
        lastid: null,
        inputVal: ''
    },
    resfreshData: function() {
        this.setData({
            albumData: null,
            showAlbumMan: false,
            changeName: false,
            nameChanged: false,
            mutilOp: false,
            mutilOpType: '',
            showAlbumOptions: false,
            selectMoveAlbum: { Name: '请选择相册' },
            allChecked: false,
            mutilOpPhotosIds: [],
            noMoreData: false,
            lastid: null
        });
    },
    onHide: function(){
        // this.resfreshData();
    },
    onLoad: function(options) {
        if (!options.albumid) wx.navigateBack();
        this.setData({
            curAlbumid: options.albumid
        })
        this.getData(options.albumid);
    },
    getData: function() {
        if(this.data.noMoreData) return;
        let that = this,
            url = util.HOST + 'photo_albums/' + this.data.curAlbumid + '/photos',
            data = { 'perPage': 5};
        if (this.data.lastid)
            data['lastId'] = this.data.lastid;
        util.requestData(url, data, function(result) {
            let resData = result.data;
            if (resData.code == 0 && resData.data) {
                wx.setNavigationBarTitle({
                    title: resData.data.album.Name
                });
                if(!resData.data.photos[0]){
                    that.data.noMoreData = true
                }
                if(resData.data.photos[0]){
                    that.data.lastid = resData.data.photos[resData.data.photos.length-1].ID;
                }
                for (var i = resData.data.photos.length - 1; i >= 0; i--) {
                    let photo = resData.data.photos[i];
                    photo.checked = false;
                    if (photo.AuditStatus == 0) {
                        photo.Url = photo.Url + '?imageView&thumbnail=300y300' + util.AUTHINGMARK;
                    } else if (photo.AuditStatus == -2) {
                        photo.Url = photo.Url + '?imageView&thumbnail=300y300' + util.NOPASSEDMARK;
                    } else {
                        photo.Url = photo.Url + '?imageView&thumbnail=300y300';
                    }
                }
                if(that.data.albumData){
                    that.data.albumData.photos = that.data.albumData.photos.concat(resData.data.photos);
                }else{
                    that.data.albumData = resData.data;
                }
                that.setData({
                    albumData: that.data.albumData,
                    noData: that.data.noData,
                    noMoreData: that.data.noMoreData,
                    lastid: that.data.lastid,
                    inputVal: that.data.albumData.album.Name
                });
            } else {
                util.errorTip();
            }
        }, function(result) {})
    },
    goToPhotos: function(e) {
        wx.navigateTo({
            url: '../photos/photos?photoid=' + e.currentTarget.dataset.id
        })
    },
    bindShowAlbumMan: function() {
        let flag = this.data.showAlbumMan ? false : true
        this.setData({
            showAlbumMan: flag
        });
    },
    bindHideAlbumMan: function() {
        this.setData({
            showAlbumMan: false
        });
    },
    changeName: function() {
        this.setData({
            changeName: true,
            showAlbumMan: false
        });
    },
    bindNameInput: function(e) {
        let nowV = e.detail.value;
        if (nowV != this.data.albumData.album.Name) {
            this.data.nameChanged = true;
        } else {
            this.data.nameChanged = false;
        }
        this.setData({
            nameChanged: this.data.nameChanged,
            inputVal: nowV
        });
    },
    cancleChange: function() {
        this.setData({
            nameChanged: false,
            changeName: false
        })
    },
    saveChange: function(){
        if(this.data.nameChanged){
            let val = this.data.inputVal,
                data = {'userid': 64},
                that = this,
                curAlbumId = this.data.albumData.album.ID,
                url = util.HOST + 'photo_albums/'+curAlbumId+'/update';
            data['name'] = val;
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
                               that.data.albumData.album.Name = val;
                               that.setData({
                                    albumData: that.data.albumData
                               });
                               wx.setNavigationBarTitle({
                                   title: val
                               });
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
    },
    delAlbum: function() {
        let that = this;
        this.setData({
            showAlbumMan: false
        });
        util.showTip('提示', '删除后相册内的图片将无法找回，确认要删除该相册？', true, '确认', function(res) {
            if (res.confirm) {
                let url = util.HOST + 'photo_albums/' + that.data.albumData.album.ID + '/delete',
                    data = { 'userid': 64 };
                util.requestData(url, data, function(result) {
                    let resData = result.data;
                    if (resData.code == 0 && resData.data) {
                        if (resData.data.msg && resData.data.msg == 'OK') {
                            wx.showToast({
                                title: '删除成功',
                                icon: 'success',
                                duration: 1000,
                                success: function() {
                                    setTimeout(function() {
                                        wx.navigateBack({
                                            delta: 1
                                        });
                                    }, 1000)
                                }
                            });
                        } else {
                            util.errorTip();
                        }
                    } else {
                        util.errorTip();
                    }
                }, function(result) {});
            } else {
                return;
            }
        });
    },
    mutilOp: function(e) {
        let type = e.currentTarget.dataset.type;
        this.setData({
            mutilOpType: type,
            mutilOp: true
        });
    },
    checkPhoto: function(e) {
        let photoIndex = e.currentTarget.dataset.index;
        this.data.albumData.photos[photoIndex].checked = this.data.albumData.photos[photoIndex].checked ? false : true;
        let id = this.data.albumData.photos[photoIndex].ID;
        if (this.data.albumData.photos[photoIndex].checked) {
            this.data.mutilOpPhotosIds.push(id);
        } else {
            this.data.mutilOpPhotosIds.splice(this.data.mutilOpPhotosIds.indexOf(id), 1);
        }
        this.setData({
            albumData: this.data.albumData
        });
    },
    selectAlbum: function(e) {
        let albumIndex = e.currentTarget.dataset.index;
        console.log(albumIndex);
        this.data.selectMoveAlbum = this.data.albumData.targetMovedAlbums[albumIndex];
        this.setData({
            selectMoveAlbum: this.data.selectMoveAlbum,
            showAlbumOptions: false
        });
    },
    bindShowAlbumOptions: function() {
        this.setData({
            showAlbumOptions: !this.data.showAlbumOptions
        });
    },
    cancleMutilOp: function() {
        for (var i = 0; i < this.data.albumData.photos.length; i++) {
            let photo = this.data.albumData.photos[i];
            photo.checked = false;
        }
        this.setData({
            albumData: this.data.albumData,
            mutilOp: false,
            mutilOpType: '',
            selectMoveAlbum: { Name: '请选择相册' }
        })
    },
    allCheck: function() {
        this.data.mutilOpPhotosIds = [];
        let flag = this.data.allChecked ? false : true;
        for (var i = 0; i < this.data.albumData.photos.length; i++) {
            let photo = this.data.albumData.photos[i];
            photo.checked = flag;
            if (flag) {
                let id = photo.ID;
                this.data.mutilOpPhotosIds.push(id);
            }
        }
        this.setData({
            albumData: this.data.albumData,
            allChecked: !this.data.allChecked
        })
    },
    confirmMutiOp: function() {
        if (!this.data.mutilOpPhotosIds[0]) {
            util.errorTip('请选择图片。');
            return false;
        }
        if (this.data.mutilOpType == 'move' && !this.data.selectMoveAlbum.ID) {
            util.errorTip('请选择目标相册。');
            return false;
        }

        let that = this;
        let con = this.data.mutilOpType == 'move' ? '确认移动？' : '确认删除？';
        util.showTip('提示', con, true, '确认', function(res) {
            if (res.confirm) {
                let data = { 'ids': that.data.mutilOpPhotosIds,'userid': 64 };
                let url = util.HOST;
                if (that.data.mutilOpType == 'move') {
                    data['to_album_id'] = that.data.selectMoveAlbum.ID;
                    url += 'photos/move';
                } else {
                    url += 'photos/delete';
                }
                util.requestData(url, data, function(result) {
                    let resData = result.data;
                    if (resData.code == 0 && resData.data) {
                        wx.showToast({
                            title: '操作成功',
                            icon: 'success',
                            duration: 1000,
                            success: function() {
                                setTimeout(function() {
                                    that.resfreshData();
                                    that.getData();
                                }, 1000)
                            }
                        });
                    } else {
                        util.errorTip();
                    }
                }, function(result) {});
            }
        });
    },
    onReachBottom: function(){
        this.getData()
    }
})
