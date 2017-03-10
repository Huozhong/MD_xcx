let util = require('util.js'),
    momentUtil = require('momentUtil.js'),
    app = getApp();

function changeNav(e, that) {
    let curnav = e.currentTarget.dataset.curnav;
    that.setData({
        currentNav: curnav,
        category: ''
    });
    that.refreshData();
}

function changeMomentCategory(e, that) {
    let category = e.currentTarget.dataset.category;
    let obj = {
        moments: [],
        hasMoreMoments: true,
        category: category ? category : '',
        hasMoreMessages: true,
        lastid: null
    };
    that.setData(obj);
    that.getMoments();
}

function showMore(e, that) {
    let mom_index = e.currentTarget.dataset.mom_index;
    momentUtil.showMore(mom_index, that);
}

function showMessageDetail(e) {
    let showMsgId = e.currentTarget.dataset.msg_id;
    wx.navigateTo({
        url: '../message/message?messageid=' + showMsgId
    });
}

function showImgs(e, that) {
    let mom_index = e.currentTarget.dataset.mom_index,
        img_index = e.currentTarget.dataset.img_index;
    let imageUrls = [];
    for (var i = 0; i < that.data.moments[mom_index].ImgList.length; i++) {
        imageUrls.push(that.data.moments[mom_index].ImgList[i].pic);
    }
    util.previewImage(that.data.moments[mom_index].ImgList[img_index].pic, imageUrls);
}

function addComm(e, that) {
    let mom_index = e.currentTarget.dataset.mom_index;
    let mom_id = e.currentTarget.dataset.mom_id;
    if (!that.data.moments[mom_index].showCommList) {
        that.getCommOfMon(mom_id, mom_index);
    } else {
        that.data.moments[mom_index].showCommList = false;
        that.setData({
            moments: that.data.moments
        })
    }
}

function ansComm(e, that) {
    let comm_index = e.currentTarget.dataset.comm_index;
    let momx = e.currentTarget.dataset.mom_index;
    that.data.moments[momx].inputFocus = true;
    let inputTxt = '回复' + that.data.moments[momx].commlist.commlist[comm_index].userInfo.NickName;
    that.data.moments[momx].inputTxt = inputTxt;
    that.data.moments[momx].btnTxt = '回复';
    let replyid = that.data.moments[momx].commlist.commlist[comm_index].userInfo.ID;
    that.setData({
        moments: that.data.moments,
        replyId: replyid
    });
}

function showGameEqInfo(e, that) {
    let eqId = e.currentTarget.dataset.eq;
    let game = e.currentTarget.dataset.game;
    that.data.roleData[game + 'RoleData'].showEq = WxParse.wxParse('html', 'html', that.data.roleData[game + 'RoleData'].RoleInfo.EquipInfo['equip' + eqId].info, that, 0);
    that.data.roleData['show' + game + 'Eq'] = true;
    that.setData({
        roleData: that.data.roleData
    });
}

function hideEqInfo(that) {
    that.data.roleData.qnmRoleData.showEq = null;
    that.data.roleData.qnRoleData.showEq = null;
    that.data.roleData.showqnmEq = false;
    that.data.roleData.showqnEq = false;
    that.setData({
        roleData: that.data.roleData
    });
}

function changeGame(e, that) {
    let game = e.currentTarget.dataset.game;
    that.data.roleData.curGame = game;
    that.setData({
        roleData: that.data.roleData
    });
    that.getroleData();
}

function addAns(e, that) {
    let mom_index = e.currentTarget.dataset.mom_index;
    let mom_id = e.currentTarget.dataset.mom_id;
    if (!that.data.messages[mom_index].showCommList) {
        that.getCommOfMsg(mom_id, mom_index);
    } else {
        that.data.messages[mom_index].showCommList = false;
        that.setData({
            messages: that.data.messages
        })
    }
}

function ansAnswer(e, that) {
    let comm_index = e.currentTarget.dataset.comm_index;
    let momx = e.currentTarget.dataset.mom_index;
    that.data.messages[momx].inputFocus = true;
    let inputTxt = '回复' + that.data.messages[momx].anslist.anslist[comm_index].userInfo.NickName;
    that.data.messages[momx].inputTxt = inputTxt;
    that.setData({
        messages: that.data.messages
    });
}

function getHomeData(that) {
    let data = that.data.curUserId ? { 'targetid': that.data.curUserId } : {};
    util.requestData(util.HOST + 'home', data, function(result) {
        let resData = result.data;
        if (resData.code == 0 && resData.data) {
            let momentsData = util.initMomentsOrMsgsData(resData.data.momentList, that, 'moment');
            if (momentsData[0]) that.data.lastid = momentsData[momentsData.length - 1].ID;
            if (momentsData.length < 10) {
                that.setData({
                    hasMoreMoments: false
                });
            }
            if (resData.data.UserId == that.data.MYID)
                resData.data.isMySelf = true;
            that.setData({
                moments: that.data.moments.concat(momentsData),
                homeData: resData.data,
                lastid: that.data.lastid
            });
        } else {
            util.errorTip();
            that.setData({
                hasMoreMoments: false
            });
        }
    });
}

function getMoments(that) {
    that.data.getDataIng = true;
    let _url = 'qnm/getownmoments',
        data = that.data.curUserId ? { 'targetid': that.data.curUserId } : {};
    if (that.data.lastid) {
        data['lastid'] = that.data.lastid;
    }
    if (that.data.category != '') {
        data['category'] = that.data.category;
    }
    util.requestData(util.HOST + _url, data, function(result) {
        let resultData = result.data;
        if (resultData.code == 0 && resultData.data) {
            let momentsData = util.initMomentsOrMsgsData(resultData.data, that, 'moment');
            if (momentsData[0]) that.data.lastid = momentsData[momentsData.length - 1].ID;
            if (momentsData.length < 10) {
                that.setData({
                    hasMoreMoments: false
                });
            }
            that.setData({
                moments: that.data.moments.concat(momentsData)
            });
        } else {
            util.errorTip();
            that.setData({
                hasMoreMoments: false
            });
        }
        that.data.getDataIng = false;
    }, function(result) {
        that.setData({
            hasMoreMoments: false
        });
        that.data.getDataIng = false;
    });
}

function getQnmRoleData(that) {
    if (that.data.roleData.gotQnmData) {
        return;
    }
    let _data = {
        'targetid': that.data.curUserId || that.data.MYID
    };
    util.requestData(util.HOST + 'home/role', _data, function(result) {
        let _resData = result.data;
        if (_resData.code == 0 && _resData.data) {
            that.data.roleData.gotQnmData = true;
            that.setData({
                roleData: that.data.roleData
            });
            if (_resData.data.RoleId) {
                let data = _resData.data;
                if (!data.Gang) data.Gang = '无';
                that.data.roleData.qnmRoleData = data;
                that.setData({
                    roleData: that.data.roleData
                });
            } else {
                that.data.roleData.hasQnmRole = false;
                that.setData({
                    roleData: that.data.roleData
                });
            }
        } else {
            util.errorTip();
        }
    });
}

function getQnRoleData(that) {
    if (that.data.roleData.gotQnData) {
        return;
    }
    let uid = that.data.curUserId || that.data.MYID;
    util.requestData(util.HOST + 'games/qn/users/' + uid + '/role_infos/bind', {}, function(result) {
        let _resData = result.data;
        if (_resData.code == 0 && _resData.data) {
            if (_resData.data.roleInfos[0]) {
                let _roleInfos = _resData.data.roleInfos;
                let mainRoleID = null;
                for (var i = 0; i < _roleInfos.length; i++) {
                    _roleInfos[i].BindType == 2 ? function() {
                        mainRoleID = _roleInfos[i].RoleId;
                        i = _roleInfos.length;
                    }() : {};
                }
                if (!mainRoleID) mainRoleID = _roleInfos[0].RoleId;
                util.requestData(util.HOST + 'games/qn/role_infos/' + mainRoleID, {}, function(result) {
                    that.data.roleData.gotQnData = true;
                    that.setData({
                        roleData: that.data.roleData
                    });
                    let _resData = result.data;
                    if (_resData.code == 0 && _resData.data) {
                        let data = _resData.data;
                        if (!data.Gang) data.Gang = '无';
                        that.data.roleData.qnRoleData = data;
                        that.setData({
                            roleData: that.data.roleData
                        });
                    } else {
                        util.errorTip();
                    }
                });
            } else {
                that.data.roleData.gotQnData = true;
                that.data.roleData.hasQnRole = false;
                that.setData({
                    roleData: that.data.roleData
                });
            }
        } else {
            util.errorTip();
        }
    });
}

function getmsgboardData(that) {
    let _data = {
        'targetid': that.data.curUserId || that.data.MYID,
        'type': 1
    };
    that.data.getDataIng = true;
    if (that.data.lastid) _data['lastid'] = that.data.lastid;
    util.requestData(util.HOST + 'qnm/getmsgs', _data, function(result) {
        that.data.getDataIng = false;
        let _resData = result.data;
        if (_resData.code == 0 && _resData.data) {
            let msgsData = util.initMomentsOrMsgsData(_resData.data, that, 'msg');
            if (msgsData[0]) that.data.lastid = msgsData[msgsData.length - 1].ID;
            if (msgsData.length < 10) {
                that.setData({
                    hasMoreMessages: false
                });
            }
            that.setData({
                messages: that.data.messages.concat(msgsData)
            });
        } else {
            util.errorTip();
        }
    })
}

function getmsgNum(that) {
    let data = {};
    data['targetid'] = that.data.curUserId || that.data.MYID;
    util.requestData(util.HOST + 'qnm/getmsgsnum', data, function(result) {
        let resData = result.data;
        if (resData.code == 0) {
            that.setData({
                msgCount: resData.data
            });
            if (that.data.msgCount > 0) {
                that.getmsgboardData();
            }
        } else {
            util.errorTip();
        }
    })
}

function getalbumData(that) {
    let data = { 'album_user_id': that.data.curUserId || that.data.MYID},
        url = util.HOST + 'photo_albums';
    util.requestData(url, data, function(result) {
        let resData = result.data;
        if (resData.code == 0 && resData.data) {
            that.setData({
                albumData: resData.data
            });
        } else {
            util.errorTip();
        }
    })
}

function likeMoment(index, type, that) {
    momentUtil.likeMoment(index, type, that);
}

function commInputFocus(e, that) {
    let mom_index = e.currentTarget.dataset.mom_index;
    momentUtil.commInputFocus(mom_index, that);
}

function commInputing(e, that) {
    let val = e.detail.value,
        mom_index = e.currentTarget.dataset.mom_index;
    momentUtil.commInputing(val, mom_index, that);
}

function submitComm(e, that) {
    let mom_index = e.currentTarget.dataset.mom_index;
    momentUtil.submitComm(mom_index, that);
}

function goToMomentDetail(e, that){
	let mom_id = e.currentTarget.dataset.mom_id;
	wx.navigateTo({
	    url: '../moment/moment?momentid=' + mom_id
	});
}

function addFriend(that){
	let userid = that.data.curUserId;
	util.addFriend(userid, function() {
	    if(that.data.followTypeHash[userid] == 0 || that.data.followTypeHash[userid] == -1){
	        that.data.followTypeHash[userid] = 1;
	    }
	    that.data.homeData.isgz = true;
	    that.setData({
	        followTypeHash: that.data.followTypeHash,
	        homeData: that.data.homeData
	    });
	})
}

module.exports = {
    changeNav: changeNav,
    changeMomentCategory: changeMomentCategory,
    showMore: showMore,
    showMessageDetail: showMessageDetail,
    showImgs: showImgs,
    addComm: addComm,
    ansComm: ansComm,
    showGameEqInfo: showGameEqInfo,
    hideEqInfo: hideEqInfo,
    changeGame: changeGame,
    addAns: addAns,
    ansAnswer: ansAnswer,
    getHomeData: getHomeData,
    getMoments: getMoments,
    getQnmRoleData: getQnmRoleData,
    getQnRoleData: getQnRoleData,
    getmsgboardData: getmsgboardData,
    getmsgNum: getmsgNum,
    getalbumData: getalbumData,
    likeMoment: likeMoment,
    commInputFocus: commInputFocus,
    commInputing: commInputing,
    submitComm: submitComm,
    goToMomentDetail: goToMomentDetail,
    addFriend: addFriend
};
