//index.js
//获取应用实例
let app = getApp(),
	util = require('../../utils/util.js');
Page({
    data: {
        friends: [],
        noFriendData: false,
        searchFocus: false,
        searchFriends: [],
        noSearchFriendData: false,
        searchVal: ''
    },
    onLoad: function() {
        
    },
    onShow: function(){
        console.log(app.globalData);
        if(!app.globalData.MDUserInfo.ID){
            util.showLoginTip();
            return;
        }
        this.getDate();
    },
    getDate: function(){
    	let that = this,
    		url = util.HOST + 'qnm/getcontacts';
    	util.requestData(url, null, function(result){
    		let resData = result.data;
    		if(resData.code == 0&& resData.data){
				if(resData.data[0]){
					that.setData({
						friends: resData.data
					});
				}else{
					that.setData({
						noFriendData: true
					});
				}
    		}else{
    			util.errorTip();
    		}
    	}, function(result){});
    },
    searchFocus: function(){
    	this.setData({
    		searchFocus: true
    	});
    },
    cancleSearch: function(){
    	this.setData({
    		noSearchFriendData: false,
    		searchFocus: false,
    		searchVal: '',
    		searchFriends: []
    	});	
    },
    searchInput: function(e){
    	this.setData({
    		noSearchFriendData: false,
    		searchFriends: []
    	});
    	let val = e.detail.value;
    	let myFris = this.data.friends;
    	if(val){
    		for (var i = 0; i < myFris.length; i++) {
    			if(myFris[i].NickName.indexOf(val)>=0){
    				this.data.searchFriends.push(myFris[i]);
    			}
    		}
    		if(this.data.searchFriends[0]){
    			this.setData({
    				noSearchFriendData: false,
    				searchFriends: this.data.searchFriends
    			});	
    		}else{
    			this.setData({
    				noSearchFriendData: true
    			})
    		}
    	}else{
    		this.setData({
    			noSearchFriendData: false,
    			searchFriends: []
    		});
    	}
    },
    gotoFriInform: function(){
    	wx.switchTab({
    		url: '../messages/messages'
    	})
    },
    gotoHome: function(e){
    	let userid = e.currentTarget.dataset.id;
    	wx.navigateTo({
    		url: '../home/home?userid='+userid
    	})
    }
})
