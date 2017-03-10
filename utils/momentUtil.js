let util = require('util.js'),
    WxParse = require('../wxParse/wxParse.js');

function showMore(index, that) {
    let moment = that.data.moments[index],
        uid = moment.userInfo.ID;
    if (moment.isMomentDetail) {
        if (moment.Type == 2) {
            wx.showActionSheet({
                itemList: ['分享新鲜事', '删除新鲜事'],
                success: function(res) {
                    let tapIndex = res.tapIndex;
                    if (tapIndex == 0) {
                        // todo  分享
                    } else if (tapIndex == 1) {
                        delMoment(index, that);
                    }
                }
            });
        } else if (moment.Type == 0) {
            wx.showActionSheet({
                itemList: ['+ 关注', '查看Ta的主页', '发送留言', '分享新鲜事', '举报'],
                success: function(res) {
                    let tapIndex = res.tapIndex;
                    if (tapIndex == 0) {
                        addFriend(index, that);
                    } else if (tapIndex == 1) {
                        util.toHome(uid);
                    } else if (tapIndex == 2) {

                    } else if (tapIndex == 3) {

                    } else if (tapIndex == 4) {

                    }
                }
            });
        } else {
            wx.showActionSheet({
                itemList: ['查看Ta的主页', '发送留言', '分享新鲜事', '举报'],
                success: function(res) {
                    let tapIndex = res.tapIndex;
                    if (tapIndex == 0) {
                        util.toHome(uid);
                    } else if (tapIndex == 1) {

                    } else if (tapIndex == 2) {

                    } else if (tapIndex == 3) {

                    }
                }
            });
        }
    }else if(that.data.isInHome){
        if (that.data.followTypeHash[moment.UserId] == 2) {
            wx.showActionSheet({
                itemList: ['查看详情', '分享新鲜事', '删除新鲜事'],
                success: function(res) {
                    let tapIndex = res.tapIndex;
                    if (tapIndex == 0) {
                        goToMomentDetail(moment.ID);
                    } else if (tapIndex == 1) {
                        // todo  分享
                    } else if (tapIndex == 2) {
                        delMoment(index, that);
                    }
                }
            });
        } else if (that.data.followTypeHash[moment.UserId] == 0 || that.data.followTypeHash[moment.UserId] == -1) {
            wx.showActionSheet({
                itemList: ['查看详情', '+ 关注', '发送留言', '分享新鲜事', '举报'],
                success: function(res) {
                    let tapIndex = res.tapIndex;
                    if (tapIndex == 0) {
                        goToMomentDetail(moment.ID);
                    } else if (tapIndex == 1) {
                        addFriend(index, that);
                    } else if (tapIndex == 2) {
                        
                    } else if (tapIndex == 3) {

                    } else if (tapIndex == 4) {

                    }
                }
            });
        } else {
            wx.showActionSheet({
                itemList: ['查看详情', '发送留言', '分享新鲜事', '举报'],
                success: function(res) {
                    let tapIndex = res.tapIndex;
                    if (tapIndex == 0) {
                        goToMomentDetail(moment.ID);
                    } else if (tapIndex == 1) {
                         
                    } else if (tapIndex == 2) {

                    } else if (tapIndex == 3) {

                    }
                }
            });
        }
    } else {
        if (that.data.followTypeHash[moment.UserId] == 2) {
            wx.showActionSheet({
                itemList: ['查看详情', '分享新鲜事', '删除新鲜事'],
                success: function(res) {
                    let tapIndex = res.tapIndex;
                    if (tapIndex == 0) {
                        goToMomentDetail(moment.ID);
                    } else if (tapIndex == 1) {
                        // todo  分享
                    } else if (tapIndex == 2) {
                        delMoment(index, that);
                    }
                }
            });
        } else if (that.data.followTypeHash[moment.UserId] == 0 || that.data.followTypeHash[moment.UserId] == -1) {
            wx.showActionSheet({
                itemList: ['查看详情', '+ 关注', '查看Ta的主页', '发送留言', '分享新鲜事', '举报'],
                success: function(res) {
                    let tapIndex = res.tapIndex;
                    if (tapIndex == 0) {
                        goToMomentDetail(moment.ID);
                    } else if (tapIndex == 1) {
                        addFriend(index, that);
                    } else if (tapIndex == 2) {
                        util.toHome(uid);
                    } else if (tapIndex == 3) {

                    } else if (tapIndex == 4) {

                    } else if (tapIndex == 5) {

                    }
                }
            });
        } else {
            wx.showActionSheet({
                itemList: ['查看详情', '查看Ta的主页', '发送留言', '分享新鲜事', '举报'],
                success: function(res) {
                    let tapIndex = res.tapIndex;
                    if (tapIndex == 0) {
                        goToMomentDetail(moment.ID);
                    } else if (tapIndex == 1) {
                        util.toHome(uid);
                    } else if (tapIndex == 2) {

                    } else if (tapIndex == 3) {

                    } else if (tapIndex == 4) {

                    }
                }
            });
        }
    }
}

function goToMomentDetail(id) {
    wx.navigateTo({
        url: '../moment/moment?momentid=' + id
    });
}

function delMoment(index, that) {
    util.showTip('提示', '确定要删除？', true, '确定', function(res) {
        if (res.confirm) {
            let moment = that.data.moments[index],
                mom_id = that.data.moments[index].ID,
                url = util.HOST + 'qnm/delmoment';
            util.requestData(url, { 'mid': mom_id }, function(result) {
                let resData = result.data;
                if (resData.code == 0) {
                    wx.showToast({
                        title: '删除成功',
                        icon: 'success',
                        duration: 1000,
                        success: function() {
                        	if(moment.isMomentDetail){
                        		wx.navigateBack();
                        	}else{
                        		that.data.moments.splice(index, 1);
                        		that.setData({
                        		    moments: that.data.moments
                        		});
                        	}
                        }
                    })
                } else {
                    util.errorTip(resData.msg);
                }
            }, function(result) {});
        }
        return;
    });
}

function addFriend(index, that) {
    let moment = that.data.moments[index],
        userid = moment.userInfo.ID;

    util.addFriend(userid, function() {
        if(that.data.moments[index].Type == 0 || that.data.moments[index].Type == -1){
            that.data.followTypeHash[userid] = 1;
        }
        if(that.data.isInHome){
            that.data.homeData.isgz = true;
            that.setData({
                homeData: that.data.homeData
            });
        }
        that.setData({
            followTypeHash: that.data.followTypeHash
        });
    })
}

function addFriendInHome(index, that){
    let moment = that.data.moments[index],
        userid = moment.userInfo.ID;

    util.addFriend(userid, function() {
        for (var i = 0; i < that.data.moments.length; i++) {
            if(that.data.moments[i].Type == 0){
                that.data.moments[i].Type = 1;
            }
        }
        that.setData({
            moments: that.data.moments
        });
    })
}

function likeMoment(index, type, that) {
    let mom_id = that.data.moments[index].ID;
    util.likeMoment(mom_id, type, function(data) {
        that.data.moments[index].userLike = type == '0' ? false : true;
        if (type == '1') {
            that.data.moments[index].zanlist.push(data);
            if (that.data.moments[index].zanUsersArr) {
                that.data.moments[index].zanUsersArr.push(data.userInfo.NickName);
                that.data.moments[index].zanUsers = that.data.moments[index].zanUsersArr.join(', ');
            }
        } else {
            for (var i = 0; i < that.data.moments[index].zanlist.length; i++) {
                if (that.data.moments[index].zanlist[i].userInfo.ID == data.userInfo.ID) {
                    that.data.moments[index].zanlist.splice(i, 1);
                    if (that.data.moments[index].zanUsersArr) {
                        that.data.moments[index].zanUsersArr.splice(i, 1);
                        that.data.moments[index].zanUsers = that.data.moments[index].zanUsersArr.join(', ');
                    }
                    break;
                }
            }
        }
        that.setData({
            moments: that.data.moments
        });
    });
}

function previewMomentImgs(mom_index, img_index, that) {
    let imageUrls = [];
    for (var i = 0; i < that.data.moments[mom_index].ImgList.length; i++) {
        imageUrls.push(that.data.moments[mom_index].ImgList[i].pic);
    }
    util.previewImage(that.data.moments[mom_index].ImgList[img_index].pic, imageUrls);
}

function ansComment(mom_index, comm_index, that) {
    that.data.moments[mom_index].inputFocus = true;
    let inputTxt = '回复' + that.data.moments[mom_index].commlist.commlist[comm_index].userInfo.NickName;
    that.data.moments[mom_index].inputTxt = inputTxt;
    that.data.moments[mom_index].btnTxt = '回复';
    that.data.moments[mom_index].inputVal = '';
    that.setData({
        moments: that.data.moments,
        replyId: that.data.moments[mom_index].commlist.commlist[comm_index].userInfo.ID
    });
}

function commInputFocus(mom_index, that) {
    that.data.moments[mom_index].inputFocus = true;
    that.setData({
        moments: that.data.moments
    });
}

function commInputing(val, mom_index, that) {
    that.data.moments[mom_index].inputVal = val;
    that.setData({
        moments: that.data.moments
    });
}

function submitComm(mom_index, that) {
    let mom_id = that.data.moments[mom_index].ID,
        ownid = that.data.moments[mom_index].UserId,
        val = that.data.moments[mom_index].inputVal,
        url = util.HOST + 'qnm/addcomm',
        data = {'targetid': mom_id, 'text': val, 'ownid': ownid };
    if (!val) return;
    if (that.data.moments[mom_index].btnTxt == '回复')
        data['replyid'] = that.data.replyId;
    util.requestData(url, data, function(result) {
        let resData = result.data;
        if (resData.code == 0) {
            let commData = resData.data.Comment;
            commData.Text = util.parseFace(commData.Text);
            commData.Html = WxParse.wxParse('html', 'html', commData.Text, that, 0);
            commData.PublishTime = util.getPublishTime(commData.Duration, commData.CreatTime);
            commData.isMyComm = commData.UserId == that.data.MYID ? true : false;
            that.data.moments[mom_index].commlist.commlist.unshift(commData);
            that.data.moments[mom_index].commlist.comsNum++;
            that.data.moments[mom_index].comsNum++;
            that.data.moments[mom_index].inputTxt = "输入评论内容";
            that.data.moments[mom_index].btnTxt = "评论";
            that.data.moments[mom_index].inputVal = '';
            that.setData({
                moments: that.data.moments,
                replyId: null
            })
        } else {
            util.errorTip();
        }
    }, function(result) {});
}

module.exports = {
    showMore: showMore,
    likeMoment: likeMoment,
    previewMomentImgs: previewMomentImgs,
    ansComment: ansComment,
    commInputFocus: commInputFocus,
    commInputing: commInputing,
    submitComm: submitComm,
    goToMomentDetail: goToMomentDetail
};
