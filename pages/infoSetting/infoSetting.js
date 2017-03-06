let util = require('../../utils/util.js'),
    tcity = require("../../utils/citys.js"),
    app = getApp();
Page({
    data: {
        curUserid: 64,
        userInfo: {},
        settingNickName: false,
        settingSignatrue: false,
        settingAddress: false,
        nameChanged: false,
        signatureChanged: false,

        provinces: [],
        province: "",
        citys: [],
        city: "",
        value: [0, 0],
        values: [0, 0],
        showAddressPicker: false
    },
    bindChangeAvatar: function() {
        wx.chooseImage({
            count: 1,
            sizeType: ['original'], // 可以指定是原图还是压缩图，默认二者都有
            sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
            success: function(res) {
                // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
                var tempFilePaths = res.tempFilePaths
                console.log(res);
                // wx.uploadFile({
                //     url: 'http://example.weixin.qq.com/upload', //仅为示例，非真实的接口地址
                //     filePath: tempFilePaths[0],
                //     name: 'file',
                //     formData: {
                //         'user': 'test'
                //     },
                //     success: function(res) {
                //         var data = res.data
                //             //do something
                //     }
                // })
            }
        })
    },
    bindChangeNickName: function() {
        let that = this;
        util.showTip('提示','梦岛昵称修改后一个月之内不能再次修改，确认修改么？',true,'确认', function(res){
            if(res.confirm){
                that.setData({
                    settingNickName: true
                });
                wx.setNavigationBarTitle({
                    title: '设置昵称'
                })
            }
        });
    },
    bindNameInput: function(e){
        let nowV = e.detail.value;
        if(nowV != this.data.userInfo.NickName){
            this.data.nameChanged = true;
        }else{
            this.data.nameChanged = false;
        }
        this.setData({
            nameChanged: this.data.nameChanged
        });
    },
    bindChangeSignatrue: function() {
        this.setData({
            settingSignatrue: true
        });
        wx.setNavigationBarTitle({
            title: '设置签名'
        });
    },
    bindSignatrueInput: function(e){
        let nowV = e.detail.value;
        if(nowV != this.data.userInfo.Signatrue){
            this.data.signatureChanged = true;
        }else{
            this.data.signatureChanged = false;
        }
        this.setData({
            signatureChanged: this.data.signatureChanged
        });
    },
    bindChangeAddress: function() {
        this.setData({
            settingAddress: true
        });
        wx.setNavigationBarTitle({
            title: '设置地区'
        });
    },
    bindShowAvatar: function(e) {
        let url = e.currentTarget.dataset.url;
        if (!url) return;
        wx.previewImage({
            current: url,
            urls: [url]
        })
    },
    backToInfoSet: function(){
        this.setData({
            settingNickName: false,
            settingSignatrue: false,
            settingAddress: false,
            nameChanged: false,
            signatureChanged: false
        });
        wx.setNavigationBarTitle({
            title: '个人信息设置'
        });
    },
    bindChange: function(e) {
        let val = e.detail.value
        let t = this.data.values;
        let cityData = this.data.cityData;
        if (val[0] != t[0]) {
            const citys = [];
            for (let i = 0; i < cityData[val[0]].sub.length; i++) {
                citys.push(cityData[val[0]].sub[i].name)
            }
            this.setData({
                province: this.data.provinces[val[0]],
                city: cityData[val[0]].sub[0].name,
                citys: citys,
                values: val,
                value: [val[0], 0]
            })
            return;
        }
        if (val[1] != t[1]) {
            this.setData({
                city: this.data.citys[val[1]],
                values: val,
                value: [val[0], val[1]]
            })
            return;
        }
    },
    openAddressPicker: function() {
        this.setData({
            showAddressPicker: !this.data.showAddressPicker
        })
    },
    initCityData: function(province, city) {
        let that = this;
        tcity.init(that);
        let cityData = that.data.cityData;
        const provinces = [];
        const citys = [];
        let value = [];
        for (let i = 0; i < cityData.length; i++) {
            provinces.push(cityData[i].name);
            if(province && province == cityData[i].name){
                value[0] = i;
            }
        }
        let j = value.length > 0? value[0]:0;
        for (let a = 0; a < cityData[j].sub.length; a++) {
            citys.push(cityData[j].sub[a].name);
            if(city && city == cityData[j].sub[a].name){
                value[1] = a;
            }
        }
        
        that.setData({
            'provinces': provinces,
            'citys': citys,
            'province': province?province:cityData[0].name,
            'city': city?city:cityData[0].sub[0].name,
        });
        setTimeout(function(){
            that.setData({
                'value': value,
                'values': value
            });
        }, 10);
    },
    onShow: function() {
        wx.showNavigationBarLoading();
        let that = this;
        util.requestData(util.HOST + 'getuserinfo', { userid: that.data.curUserid }, function(result) {
            wx.hideNavigationBarLoading();
            let resData = result.data;
            if (resData.code == 0 && resData.data) {
                if(resData.data.Province&&resData.data.City){
                    resData.data.Address = resData.data.Province +' '+ resData.data.City;
                    if(resData.data.Address.length>15)
                        resData.data.Address = resData.data.Address.substr(0,15)+'...';
                    that.initCityData(resData.data.Province,resData.data.City);
                }
                that.setData({
                    userInfo: resData.data
                });
            } else {
                util.errorTip();
            }
        }, function(result) {});
    }
});
