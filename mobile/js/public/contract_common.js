$(function(){

var contractCommonMethod = {
    init:function(){
      this.bindEvent();
    },
    bindEvent:function(){
       var _this = this;
      $(".J_apply_btn").click(function(){
         _this.applyOperate(this,1);
      });
       $(".J_model_cancel_btn").click(function(){
         _this.applyOperate(this,0);
      });
      $(".apply-operate-btns .btn").click(function(){
       _this.toggleClass(this,"red-btn");
      });
    
      
	  },
    applyOperate:function(ele,token){
       //同意 驳回 完结
	   // *ele: 点击元素
	   // *token：1，显示弹出层，0，关闭弹出层
	   
      var eleTxt = $(ele).text();
      
      if(token == 1){
        $(".apply-model").slideDown();
        $(".J_model_pannel_title").text(eleTxt);
        $(".J_model_operate_btn").text(eleTxt);
      }else {
        $(".apply-model").slideUp();
      }
     
     
    },
    toggleClass:function(ele,className){
       $(ele).addClass(className).siblings().removeClass(className);
    }
    
   };
   
   contractCommonMethod.init();
});