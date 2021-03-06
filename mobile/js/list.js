﻿//<!-- 合同审批列表 -->
var $ctx = 'http://localhost/Po';
var currPage=0;
var pageSize = 10;
var tar = 'SC';
var oldtar = '';
var contractID = '';
$(function() {
	serviceDataList(currPage, pageSize);
	//tab
	$('ul.um-tabbar-switch  Li').click(function() {
		tar = $(this).attr('data-tar');
		if (tar == oldtar)
			return false;
		$(this).addClass('active').siblings('.active').removeClass('active');
		$("." + tar).addClass('active').siblings('.active').removeClass('active');
        oldtar =tar;
        currPage = 0;
		serviceDataList(currPage, pageSize);

	});
})
//------------------------------------------------后台调用
//获取列表
function serviceDataList(pn, ps) {
    $(".notFound").remove();
	var url = $ctx + "/wf/getTasks";
	var param = {
		"status" :'1' ,
		"contractName" : '',
		"contractType" : tar,
		"pageStart" : pn,
		"pageSize" : ps
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
                    var dataText = doT.template($("#setData").text());
                    if (pn == 0) {
                        $("." + tar +' ul').html(dataText(data));
                    } else {
                        $("." + tar +' ul').append(dataText(data));
                    }
                    currPage=pn+1;
                }
            }
		},
		error : function(result) {
            if (result.status == 306) {
                tips(".artical",1);
            }
		}
	})

}

//显示隐藏按钮
function showBtn(e,id) {

    if ($(e).find(".apply-operate-btns").hasClass("active")) {
		$(e).removeClass("active");
		$(e).find(".apply-operate-btns").slideUp(300).removeClass("active");
		$(e).siblings().find(".apply-operate-btns").slideUp(300).removeClass("active");
	} else {
		$(e).addClass("active");
		$(e).find(".apply-operate-btns").slideDown(300).addClass("active");
	}
    event.stopPropagation();
}

//查看
function checkInfo(e) {
    contractID=$(e).attr('data-id');
if(tar=='SC'){
	window.location.href = "../html/SC.html?contractID="+contractID+"&contractType="+tar;
}else if(tar=='AC'){
	window.location.href = "../html/AC.html?contractID="+contractID+"&contractType="+tar;
}else{
    window.location.href = "../html/PC.html?contractID="+contractID+"&contractType="+tar;
}
	$(e).addClass("btn-danger");
	event.stopPropagation();
}

//网络不给力提示
function tips(e,type) {
	/*type=0 网络不给力*/
	/*type=1 身份失效*/
	if(type=0){
		imgSrc='../img/noConnection.png';
		tip='网络不给力';
	}
    if(type=1){
        imgSrc='../img/noAccess.png';
        tip='身份凭证已经失效';
    }
	var nothing = '<div class="notFound tc active"><img src='+imgSrc+' alt='+tip+' width="60%" style="margin-top:30%" /><p class="f14 mt30 mb10">'+tip+'<p>' +
		'<p class="f12 um-gray">请刷新试试~</p><div class="btnCon mt40 mb20">' +
		'<a class="btn btn-sm btn-inline" id="search_btn" onclick="refresh()">刷新</a></div></div>'
	$(e).after(nothing);
}

//刷新
function refresh() {
	window.location.reload();
}

