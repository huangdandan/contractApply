$(function(){
   var contractID=GetQueryString("contractID");
   var contractType=GetQueryString("contractType");
    var subContractype = ""; // 合同子分类

    var $ctx = 'http://localhost/Po/';
//var contractType = "AC_1";//合同类型

    var contractCommonMethod = {
        init:function(){
            this.bindEvent();
            if(contractType == "AC"){
                var param = {
                    "contractId":contractID
                }
                var url = $ctx+"ac/findOne";

            }else if(contractType == "PC"){
                //合同详情 PC
                var param = {
                    "contractId":contractID
                }
                var url =$ctx+ "pc/sos/findOne";

            }else if(contractType == "SC"){

                var url =$ctx+ "/sc/findOne";
                var param = {
                    "contractId":contractID
                }
            }
            this.successList(param,url,"#setData",".contract-con");
        },
        bindEvent:function(){
            var _this = this;
            //点击申请操作按钮

            $(".J_apply_btn").click(function(){
                _this.applyOperate(this,1);
            });
            //点击模态框取消
            $(".J_model_cancel_btn").click(function(){
                _this.applyOperate(this,0);
            });
            // 点击操作按钮
            $(".apply-operate-btns .btn").click(function(){
                _this.toggleClass(this,"red-btn");
            });
            //点击历史记录
            $(".apply-operate-btns .J_history_record ").click(function(){
                //历史审批记录ajax请求参数
                /***************************************************************************/
                var recordParam = {
                    "contractId":contractID,
                    "contractType":contractType
                }
                /***************************************************************************/
                var recordUrl = $ctx+  "wf/showRecord";

                //历史记录
                _this.historyRecordDataList(recordParam,recordUrl);


                $(".apply-model").slideDown();
                $(".J_history_record_wrap").show();
                $(".model-pannel").hide();

            });
            //点击历史记录关闭按钮
            $(".J_history_record_wrap ").on("click",".J_close_icon",function(){
                $(".apply-model").slideUp();

            })
        },
        applyOperate:function(ele,token){
            //同意 驳回 完结
            // *ele: 点击元素
            // *token：1，显示弹出层，0，关闭弹出层

            var eleTxt = $(ele).text();

            if(token == 1){
                $(".model-pannel").show();
                $(".J_history_record_wrap").hide();
                $(".apply-model").slideDown();
                $(".J_model_pannel_title").text(eleTxt);
                $(".J_model_operate_btn").text(eleTxt);


                switch(eleTxt)
                {
                    case '同意':
                        suggestion(1);
                        break;
                    case '驳回':
                        suggestion(2);
                        break;
                    case '完结':
                        suggestion(3);
                        break;
                    default:
                        suggestion(1);
                }
            }else {
                $(".apply-model").slideUp();
            }


        },
        toggleClass:function(ele,className){
            $(ele).addClass(className).siblings().removeClass(className);
        },
        //数据请求公共方法
        serviceDataList:function(param,url){
            var dtd = $.Deferred();
            $.ajax({
                url : url,
                data : param,
                type : 'GET',
                dataType : 'JSON',
                success : function(result) {
                    if (result.errorCode == 'success' || result.errorCode== 0) {
                        dtd.resolve(result);

                    }
                }
            });
            return dtd.promise(); // 返回promise对象
        },
        //模板加载数据
        successList:function(param,url,scriptWrap,eleWrap){
            var _this = this;
            $.when(_this.serviceDataList(param,url))
                .done(function(data){
                    console.log(data.data);
                    var dataText = doT.template($(scriptWrap).text());
                    //加载数据
                    $(eleWrap).html(dataText(data.data));
                })
                .fail(function(){
                });
        },
        //历史记录数据显示
        historyRecordDataList:function(param,url){
            $.when(this.serviceDataList(param,url)).done(function(data){
                    if(data && data.comments.length > 0){
                        var str = '';
                        str +='<div class="apply-records pl15 pr15">';
                        str +=' <h2 class="common-title m0 border-bottom border-bottom border-top">历史审批意见 <span class="J_close_icon close-icon">×</span> </h2>';
                        str +='<div class="apply-records-con">';
                        str +='  <table class="apply-records-table" colspan="0" rowspan="0" border="1" width="100%" align="center">';
                        str +='   <thead>';
                        str +='      <tr>';
                        str +='        <th class="w60">审批人</th>';
                        str +='        <th>审批意见</th>';
                        str +='         <th class="w60">操作</th>';
                        str +='       </tr>'
                        str +='    </thead>'
                        str +='    <tbody>'
                        for(var i=0;i<data.comments.length;i++){
                            var outcome = data.comments[i].outcome;
                            var outcomeText = '';
                            if(outcome == 'approve') {
                                outcomeText = '同意';
                            } else if(outcome == 'reject') {
                                outcomeText = '驳回';
                            } else if(outcome == 'appoint') {
                                outcomeText = '委派';
                            } else if(outcome == 'terminate') {
                                outcomeText = '完结';
                            } else if (outcome == 'submit') {
                                outcomeText = '提交';
                            } else {
                                outcomeText = '驳回';
                            }
                            str +='     <tr align="center">'
                            str +='        <td>'+data.comments[i].userName+'</td>'
                            str +='        <td>'+data.comments[i].comment+'</td>'

                            str +='       <td>'+outcomeText+'</td>'
                            str +='     </tr>'

                        }

                    }
                    str +='    </tbody>'
                    str +=' </table>'
                    str +='</div>'
                    str +='</div>'
                    $(".J_history_record_wrap").html(str);
                })
                .fail(function(){
                });




        }

    };

    contractCommonMethod.init();

});
function suggestion(type) {
    switch(type){
        case 1:
            var url = $ctx + "/wf/getTasks";
            break;
        case 1:
            var url = $ctx + "/wf/getTasks";
            break;
        case 1:
            var url = $ctx + "/wf/getTasks";
            break;
    }
    $.ajax({
        url : url,
        data : {
            "status" :'1' ,
            "content":$(".main-con textarea").val()
        },
        type : 'GET',
        dataType : 'JSON',
        success : function(result) {
            if (result.errorCode == 'success') {
                var data = result.data;
            }
        },
        error : function(result) {
            if (result.status == 306) {
                tips(".artical",1);
            }
        }
    })

}
//截取字符串
function GetQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);  //获取url中"?"符后的字符串并正则匹配
    var context = "";
    if (r != null)
        context = r[2];
    reg = null;
    r = null;
    return context == null || context == "" || context == "undefined" ? "" : context;
}

/**
 * 时间戳转成时间
 * @param time
 * @returns
 */
function timeStamp2String(ele,time){
    var datetime = new Date();
    datetime.setTime(time);
    var year = datetime.getFullYear();
    var month = datetime.getMonth() + 1 < 10 ? "0" + (datetime.getMonth() + 1) : datetime.getMonth() + 1;
    var date = datetime.getDate() < 10 ? "0" + datetime.getDate() : datetime.getDate();
    var hour = datetime.getHours()< 10 ? "0" + datetime.getHours() : datetime.getHours();
    var minute = datetime.getMinutes()< 10 ? "0" + datetime.getMinutes() : datetime.getMinutes();
    var second = datetime.getSeconds()< 10 ? "0" + datetime.getSeconds() : datetime.getSeconds();
    //return year + "-" + month + "-" + date+" "+hour+":"+minute+":"+second;

    $(ele).text(year + "年" + month + "月" + date+"日");

}
