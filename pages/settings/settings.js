let util = require('../../utils/util.js'),
	app = getApp();
Page({
	data: {},
	bindSetInfo: function(){
		wx.navigateTo({
		    url: '../infoSetting/infoSetting'
		});
	},
	onLoad: function(){},
	onShow: function(){}
});