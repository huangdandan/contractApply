//<!-- 合同审批列表 -->
var $ctx = 'http://yyop.yonyougov.com/Po';
var currPage = 1;
var pageSize = 10;
var tar = 'SC';
var oldtar = '';
var id = '';
var result = {
	data : [{
		id : '001',
		company : '用友政务',
		address : '北京用友产业园',
		money : '333333'
	}, {
		id : '002',
		company : '用友政务',
		address : '北京用友产业园',
		money : '333333'
	}]
}
$(function() {
	//serviceDataList(tar,currPage, pageSize);
	successList(result);
	//tab
	$('ul.um-tabbar-switch  Li').click(function() {
		tar = $(this).attr('data-tar');
		window.localStorage.setItem('type', tar);
		if (tar == oldtar)
			return false;
		$(this).addClass('active').siblings('.active').removeClass('active');
		$("." + tar).addClass('active').siblings('.active').removeClass('active');
		tar = oldtar;
		currPage = 1;
		successList(result);
		//serviceDataList(szNumVal, spNameVal, currPage, pageSize);

	});
})
//------------------------------------------------后台调用

function serviceDataList(pn, ps) {
	var url = $ctx + "/wf/getTasks";
	var param = {
		"status" : viewModel.status(),
		"contractName" : viewModel.contractName(),
		"contractType" : tar,
		"pageStart" : 1,
		"pageSize" : 10,
	};
	$.ajax({
		url : url,
		data : param,
		type : 'GET',
		dataType : 'JSON',
		success : function(result) {
			if (result.errorCode == 'success') {
				var data = result.data;
				if (data && data.length > 0) {
					successList(result.data);
				}
			}
		},
		error : function() {
			tips(".um-page.active .um-content");
		}
	})

}

function successList(result) {
	var dataText = doT.template($("#setData").text());
	//加载数据
	$("." + tar).html(dataText(result.data));
}

function serviceDataListPull(pn, ps) {
	var url = $ctx + "/wf/getTasks";
	var param = {
		"status" : viewModel.status(),
		"contractName" : viewModel.contractName(),
		"contractType" : tar,
		"pageStart" : pn,
		"pageSize" : ps,
	};
	$.ajax({
		type : "post",
		url : url,
		data : param,
		dataType : "json",
		success : function(data) {
			successListPull(result)
		},
		error : function(data) {
			tips(".um-page.active .um-content");
		}
	});

}

function successListPull(result) {
	if (result.errorCode == 'success') {
		var data = result.data;
		if (data && data.length > 0) {
			currPage = currPage + 1;
			var dataText = doT.template($("#setData").text());
			if (currPage == 1) {
				$("." + tar).html(dataText(data));
			} else {
				$("." + tar).append(dataText(data));
			}
		}
	}
}

//显示隐藏按钮
function showBtn(e, id) {
	id = id;
	window.localStorage.setItem('id', id);
	
	//alert(window.localStorage.getItem('id'));
	if ($(e).find(".btnCon").hasClass("active")) {
		$(e).removeClass("active");
		$(e).find(".btnCon").slideUp(300).removeClass("active");
		$(e).siblings().find(".btnCon").slideUp(300).removeClass("active");
	} else {
		$(e).addClass("active");
		$(e).find(".btnCon").slideDown(300).addClass("active");
	}
}

//查看
function checkInfo(e) {
if(tar=='SC'){
	window.location.href = "../html/SC.html"
}else if(tar=='AC'){
	window.location.href = "../html/AC.html";
}else{
    window.location.href = "../html/PC.html";
}


	$(e).addClass("btn-danger");
	event.stopPropagation();
}

//网络不给力提示
function tips(e) {
	UM.hideLoadingBar();
	var nothing = '<div class="notFound tc active"><img src="img/noconnection.png" alt="网络不给力" width="60%" style="margin-top:30%" /><p class="f14 mt30 mb10">当前网络不给力！<p><p class="f12 um-gray">请刷新试试~</p><div class="btnCon mt40 mb20"><a class="btn" id="search_btn" onclick="refresh()">刷新</a></div></div>'
	$(e).after(nothing);
}

//刷新
function refresh() {
	window.location.reload();
}
