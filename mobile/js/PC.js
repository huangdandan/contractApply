define(['jquery', 'knockout', 'text!./SCReviewList.html','uui', 'bootstrap'], function ($, ko,
                                                                template) {
    var app, addApp, reviewApp;
    var viewModel = {
        showPage: ko.observable(""),//显示页面，1：listpage，2：reviewPage
        data: ko.observable({}),// 不能删除
        status: ko.observable(0),//0:处理中合同,1:已处理合同
        contractName: ko.observable(""),
        dataTable : new u.DataTable({
			meta : { 
				'contractId' : {
					type : 'string'
				},	
				'taskId' : {
					type : 'string'
				},
				'category' : {
					type : 'string'
				},
				'contractType' : {
					type : 'string'
				},
				'contractName' : {
					type : 'string'
				},
				'customerName' : {
					type : 'string'
				},
				'amount' : {
					type : 'string'
				},
				'status' : {
					type : 'int'
				},
				'submitedTime':{
					type:'string'
				},
				//办理时间
				'createdTime':{
					type:'string'
				},
				//办理意见
				'outcome':{
					type:'string'
				},
				//待办理，任务创建时间
				'taskCreatedTime':{
					type:'string'
				},
				//已办理，任务完成时间
				'taskFinishedTime':{
					type:'string'
				}
			},
			pageSize: 10
		}),
		
		//当前用户信息
        currentUserInfo: new u.DataTable({
            meta: {
                'userId': {type: 'string'},
                'loginName': {type: 'string'},
                'userName': {type: 'string'},
                'coId': {type: 'string'},
                'coName': {type: 'string'},
                'roleId': {type: 'string'},
                'roleType': {type: 'string'},
                'roleName': {type: 'string'}
            }
        }, this),
        
        //当前用户信息
        commentDataTable: new u.DataTable({
            meta: {
            	'taskId': {type: 'string'},
                'userId': {type: 'string'},
                'userName': {type: 'string'},
                'comment': {type: 'string'},
                'enclosure': {type: 'string'},
                'createdTime': {type: 'string'},
                'outcome': {type: 'string'},
                'outcomeText': {type: 'string'},
            }
        }, this),

        events: {
        	 //2 初始化用户信息
            initUser: function () {
                var url = $ctx + '/cm/findCurrentUserInfo';
                $.ajax({
                    type: 'GET',
                    url: url,
                    dataType: 'JSON',
                    async: false,
                    success: function (result) {
                        var errorCode = result.errorCode;
                        if (errorCode == '0') {
                            var data = result.data;
                            viewModel.currentUserInfo.setValue('userId', data.userId);
                            viewModel.currentUserInfo.setValue('loginName', data.loginName);
                            viewModel.currentUserInfo.setValue('userName', data.userName);
                            viewModel.currentUserInfo.setValue('coId', data.coId);
                            viewModel.currentUserInfo.setValue('coName', data.coName);
                            viewModel.currentUserInfo.setValue('roleId', data.roleId);
                            viewModel.currentUserInfo.setValue('roleType', data.roleType);
                            viewModel.currentUserInfo.setValue('roleName', data.roleName);
                        } else if (errorCode == '1') {
                            var errorMsg = result.errorMsg;
                            u.showMessage({
                                msg: '当前登录用户信息不完整，请联系管理员',
                                position: "bottom",
                                msgType: "error"
                            });
                        } else {
                            u.showMessage({
                                msg: '获取当前登录用户信息出现异常',
                                position: "bottom",
                                msgType: "error"
                            });
                        }
                    },
                    error: function () {
                        u.showMessage({
                            msg: '初始化用户信息出现异常，请稍后重试',
                            position: "bottom",
                            msgType: "error"
                        });
                    }
                })
            },
            // 查询
            findAll: function () {
            	var url = $ctx + "/wf/getTasks";
                var param = {
                    "status": viewModel.status(),
                    "contractName": viewModel.contractName(),
                    "contractType":"SC",
                    "pageStart": viewModel.dataTable.pageIndex(),
                    "pageSize": 10,
                };
                $.ajax({
                    url: url,
                    data: param,
                    type: 'GET',
                    dataType: 'JSON',
                    success: function (result) {
        				if(result.errorCode == 'success') {
        					var data = result.data;
                			if(data && data.length > 0) {	
                				for(var i = 0; i < data.length; i++) {
                					var outcome = data[i].outcome;
                					if(outcome) {
                						if(outcome == 'approve') {
                							data[i].outcome = '同意';
                						} else if(outcome == 'reject') {
                							data[i].outcome = '驳回';
                						} else if(outcome == 'terminate') {
                							data[i].outcome = '完结';
                						} else if(outcome == 'appoint') {
                							data[i].outcome = '委派';
                						} else if(outcome == 'submit') {
                							data[i].outcome = '提交';
                						}
                					}
                				}
                			}
                			viewModel.dataTable.setSimpleData(result.data);
        					viewModel.dataTable.totalPages(result.totalPages);
        					viewModel.dataTable.totalRow(result.totalRow);
        				}
        			}
                })
            },
            //分页
            pageChange :function(index) {
				viewModel.dataTable.pageIndex(index);
				viewModel.events.findAll();
            },
            // 页签切换
            switchTab: function (flag, obj) {
                viewModel.status(flag);
                viewModel.events.findAll();
            },

            isShow: function (flag) {
                if (flag == viewModel.showPage()) {
                    return true;
                }
                return false
            },
            
            loadReview: function (data) {
            	var contractId = data.data.contractId.value;
            	var contractType = data.data.contractType.value;
            	var taskId = data.data.taskId.value;
            	var category = data.data.category.value;
            	var coId = data.data.coId.value;
            	
                var container = $('#reviewPage');
                var module = 'pages/sd/cm/CmContractReview';
                requirejs.undef(module);
                require([module], function (module) {
                    ko.cleanNode(container[0]);
                    container.html('');
                    container.html(module.template);
                    module.model_.events.back = function() {
                    	viewModel.events.back();
                    }
                    reviewApp = module;
                    var param = {
                    		coId:coId,
            				contractId:contractId,
            				contractType:contractType,
            				category:category,
            				taskId:taskId,
            				taskStatus:viewModel.status()
            		};
                    module.init(param);
                });
                viewModel.showPage(2);
            },
            back:function() {
            	viewModel.showPage(1);
            	viewModel.events.findAll();
            }

        }
    };

    var init = function () {
    	//viewModel.events.initUser();// 初始化用户信息
        viewModel.showPage(1);
        viewModel.status(0);
        viewModel.events.findAll();
        app = u.createApp({
            el: '.content',
            model: viewModel
        });
    }
    return {
        'model_': viewModel,
        'template': template,
        'init': init
    };
});
