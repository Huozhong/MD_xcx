let util = require('../../utils/util.js'),
    app = getApp();
Page({
    data: {
        motto: 'Hello World',
        userInfo: {},
        noRoleData: false,
        curGame: 'qnm',
        curUserid: 64,
        roles: [],
        roleids: [],
        showRoles: false,
        baseUrl: "http://api.hi.163.com/md/getcode?len=2&0.1212"
    },
    checkRole: function(e) {
		let roleId = e.currentTarget.dataset.roleid,
			roleIndex = e.currentTarget.dataset.roleindex;
		this.data.roles[roleIndex].BindType = this.data.roles[roleIndex].BindType? 0:1;
		if(this.data.roles[roleIndex].BindType){
			this.data.roleids.push(roleId);
		}else{
			this.data.roleids.splice(this.data.roleids.indexOf(roleId),1);
		}
		
		this.setData({
			roleids: this.data.roleids,
			roles: this.data.roles
		});
    },
    changeGame: function(e){
    	let game = e.currentTarget.dataset.game;
    	this.setData({
    		curGame: game
    	});
    	this.getDate();
    },
    onLoad: function() {
        this.getDate();

    },
    getDate: function() {
        let that = this,
            url = util.HOST + this.data.curGame + '/getbindrole',
            data = { 'userid': this.data.curUserid };
        /*util.requestData(url, data, function(result) {
            let resData = result.data;
            resData = {
                "code": 0,
                "data": [{
                    "RoleId": 863610354,
                    "RoleName": "无恒安息",
                    "Level": 1,
                    "ServerId": "354",
                    "JobId": 1,
                    "CreateTime": 1471251600,
                    "Gender": 0,
                    "UserName": "small_beanlove@163.com",
                    "Server": "新纪元-苏堤春晓",
                    "Job": "射手",
                    "BindType": 1
                }, {
                    "RoleId": 1272770359,
                    "RoleName": "明或戊",
                    "Level": 68,
                    "ServerId": "354",
                    "JobId": 102,
                    "CreateTime": 1451610000,
                    "Gender": 1,
                    "UserName": "small_beanlove@163.com",
                    "Server": "新纪元-苏堤春晓",
                    "Job": "战魂甲士",
                    "BindType": 2
                }, {
                    "RoleId": 1361620397,
                    "RoleName": "轻狂布丁",
                    "Level": 1,
                    "ServerId": "397",
                    "JobId": 103,
                    "CreateTime": 1476331200,
                    "Gender": 1,
                    "UserName": "small_beanlove@163.com",
                    "Server": "侠侣行-白衣翩翩",
                    "Job": "断恨刀客"
                }, {
                    "RoleId": 1304730393,
                    "RoleName": "蒅指沫沫",
                    "Level": 1,
                    "ServerId": "393",
                    "JobId": 3,
                    "CreateTime": 1476950400,
                    "Gender": 1,
                    "UserName": "small_beanlove@163.com",
                    "Server": "侠侣行-落霞云归",
                    "Job": "刀客"
                }, {
                    "RoleId": 2390810406,
                    "RoleName": "乐正枰斌",
                    "Level": 1,
                    "ServerId": "406",
                    "JobId": 103,
                    "CreateTime": 1477533600,
                    "Gender": 1,
                    "UserName": "small_beanlove@163.com",
                    "Server": "侠侣行-泠泠七弦",
                    "Job": "断恨刀客"
                }, {
                    "RoleId": 629790363,
                    "RoleName": "火种",
                    "Level": 2,
                    "ServerId": "370",
                    "JobId": 102,
                    "CreateTime": 1446469200,
                    "Gender": 0,
                    "UserName": "small_beanlove@163.com",
                    "Server": "新纪元-东山秋月",
                    "Job": "战魂甲士",
                    "BindType": 1
                }, {
                    "RoleId": 1720390398,
                    "RoleName": "裴禹",
                    "Level": 1,
                    "ServerId": "398",
                    "JobId": 103,
                    "CreateTime": 1475978400,
                    "Gender": 1,
                    "UserName": "small_beanlove@163.com",
                    "Server": "侠侣行-红影佳人",
                    "Job": "断恨刀客"
                }, {
                    "RoleId": 821570389,
                    "RoleName": "益哈朗",
                    "Level": 1,
                    "ServerId": "387",
                    "JobId": 103,
                    "CreateTime": 1474966800,
                    "Gender": 1,
                    "UserName": "small_beanlove@163.com",
                    "Server": "倾城恋-笑红尘",
                    "Job": "断恨刀客"
                }, {
                    "RoleId": 910210388,
                    "RoleName": "东门少耶",
                    "Level": 1,
                    "ServerId": "387",
                    "JobId": 103,
                    "CreateTime": 1474966800,
                    "Gender": 1,
                    "UserName": "small_beanlove@163.com",
                    "Server": "倾城恋-笑红尘",
                    "Job": "断恨刀客"
                }, {
                    "RoleId": 1258770305,
                    "RoleName": "商乳呗",
                    "Level": 1,
                    "ServerId": "305",
                    "JobId": 103,
                    "CreateTime": 1479114000,
                    "Gender": 1,
                    "UserName": "small_beanlove@163.com",
                    "Server": "九州月-都江堰",
                    "Job": "断恨刀客"
                }, {
                    "RoleId": 330530358,
                    "RoleName": "huozhong",
                    "Level": 1,
                    "ServerId": "352",
                    "JobId": 2,
                    "CreateTime": 1446379200,
                    "Gender": 0,
                    "UserName": "small_beanlove@163.com",
                    "Server": "新纪元-三潭映月",
                    "Job": "金刚甲士",
                    "BindType": 1
                }, {
                    "RoleId": 1365590396,
                    "RoleName": "悠悠若梦",
                    "Level": 1,
                    "ServerId": "396",
                    "JobId": 103,
                    "CreateTime": 1476950400,
                    "Gender": 1,
                    "UserName": "small_beanlove@163.com",
                    "Server": "侠侣行-碧海潮生",
                    "Job": "断恨刀客"
                }]
            };
            if(resData.code == 0 && resData.data){
				if(resData.data[0]){
					that.setData({
						roles: resData.data
					});
				}else{
					that.setData({
						noRoleData: true
					});
				}
            }else{
            	util.errorTip();
            	that.setData({
            		noRoleData: true
            	})
            }
        }, function(result) {});*/
        let resData = {
            "code": 0,
            "data": [{
                "RoleId": 863610354,
                "RoleName": "无恒安息",
                "Level": 1,
                "ServerId": "354",
                "JobId": 1,
                "CreateTime": 1471251600,
                "Gender": 0,
                "UserName": "small_beanlove@163.com",
                "Server": "新纪元-苏堤春晓",
                "Job": "射手",
                "BindType": 1
            }, {
                "RoleId": 1272770359,
                "RoleName": "明或戊",
                "Level": 68,
                "ServerId": "354",
                "JobId": 102,
                "CreateTime": 1451610000,
                "Gender": 1,
                "UserName": "small_beanlove@163.com",
                "Server": "新纪元-苏堤春晓",
                "Job": "战魂甲士",
                "BindType": 2
            }, {
                "RoleId": 1361620397,
                "RoleName": "轻狂布丁",
                "Level": 1,
                "ServerId": "397",
                "JobId": 103,
                "CreateTime": 1476331200,
                "Gender": 1,
                "UserName": "small_beanlove@163.com",
                "Server": "侠侣行-白衣翩翩",
                "Job": "断恨刀客"
            }, {
                "RoleId": 1304730393,
                "RoleName": "蒅指沫沫",
                "Level": 1,
                "ServerId": "393",
                "JobId": 3,
                "CreateTime": 1476950400,
                "Gender": 1,
                "UserName": "small_beanlove@163.com",
                "Server": "侠侣行-落霞云归",
                "Job": "刀客"
            }, {
                "RoleId": 2390810406,
                "RoleName": "乐正枰斌",
                "Level": 1,
                "ServerId": "406",
                "JobId": 103,
                "CreateTime": 1477533600,
                "Gender": 1,
                "UserName": "small_beanlove@163.com",
                "Server": "侠侣行-泠泠七弦",
                "Job": "断恨刀客"
            }, {
                "RoleId": 629790363,
                "RoleName": "火种",
                "Level": 2,
                "ServerId": "370",
                "JobId": 102,
                "CreateTime": 1446469200,
                "Gender": 0,
                "UserName": "small_beanlove@163.com",
                "Server": "新纪元-东山秋月",
                "Job": "战魂甲士",
                "BindType": 1
            }, {
                "RoleId": 1720390398,
                "RoleName": "裴禹",
                "Level": 1,
                "ServerId": "398",
                "JobId": 103,
                "CreateTime": 1475978400,
                "Gender": 1,
                "UserName": "small_beanlove@163.com",
                "Server": "侠侣行-红影佳人",
                "Job": "断恨刀客"
            }, {
                "RoleId": 821570389,
                "RoleName": "益哈朗",
                "Level": 1,
                "ServerId": "387",
                "JobId": 103,
                "CreateTime": 1474966800,
                "Gender": 1,
                "UserName": "small_beanlove@163.com",
                "Server": "倾城恋-笑红尘",
                "Job": "断恨刀客"
            }, {
                "RoleId": 910210388,
                "RoleName": "东门少耶",
                "Level": 1,
                "ServerId": "387",
                "JobId": 103,
                "CreateTime": 1474966800,
                "Gender": 1,
                "UserName": "small_beanlove@163.com",
                "Server": "倾城恋-笑红尘",
                "Job": "断恨刀客"
            }, {
                "RoleId": 1258770305,
                "RoleName": "商乳呗",
                "Level": 1,
                "ServerId": "305",
                "JobId": 103,
                "CreateTime": 1479114000,
                "Gender": 1,
                "UserName": "small_beanlove@163.com",
                "Server": "九州月-都江堰",
                "Job": "断恨刀客"
            }, {
                "RoleId": 330530358,
                "RoleName": "huozhong",
                "Level": 1,
                "ServerId": "352",
                "JobId": 2,
                "CreateTime": 1446379200,
                "Gender": 0,
                "UserName": "small_beanlove@163.com",
                "Server": "新纪元-三潭映月",
                "Job": "金刚甲士",
                "BindType": 1
            }, {
                "RoleId": 1365590396,
                "RoleName": "悠悠若梦",
                "Level": 1,
                "ServerId": "396",
                "JobId": 103,
                "CreateTime": 1476950400,
                "Gender": 1,
                "UserName": "small_beanlove@163.com",
                "Server": "侠侣行-碧海潮生",
                "Job": "断恨刀客"
            }]
        };
        if (resData.code == 0 && resData.data) {
            if (resData.data[0]) {
            	for (var i = 0; i < resData.data.length; i++) {
            		if(resData.data[i].BindType){
            			that.data.roleids.push(resData.data[i].RoleId);
            		}
            	}
                that.setData({
                    roles: resData.data
                });
            } else {
                that.setData({
                    noRoleData: true
                });
            }
        } else {
            util.errorTip();
            that.setData({
                noRoleData: true
            })
        }
    },
    postData: function(){
    	let url = util.HOST + this.data.curGame+ '/bindrole',
    		data = {'userid': this.data.curUserid, 'roleidlist': this.data.roleids};
    	util.requsetData(url, data, function(result){
    		let resData = result.data;
    		if(resData.code == 0 && resData.data){
				wx.showToast({
				  title: '绑定成功',
				  icon: 'success',
				  duration: 500
				});
    		}else{
    			util.errorTip();
    		}
    	},function(result){});
    }
})
