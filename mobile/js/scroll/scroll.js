$(function() {
    var scroller1 = new IScrollPullUpDown('wrapper', {
        probeType : 2,
        bounceTime : 250,
        bounceEasing : 'quadratic',
        mouseWheel : true,
        scrollbars : true,
        fadeScrollbars : true,
        interactiveScrollbars : true,
        preventDefault:false
    }, pullDownAction, pullUpAction);
    document.addEventListener('touchmove', function(e) {
        e.preventDefault();
    }, false);
    function pullDownAction(theScroller) {
        setTimeout(function() {
            theScroller.refresh();
        }, 1000);
    }

    //上拉加载更多数据代码, 还需放开iscrollconfig.js内pullUpActionHandler代码方可实现上拉加载更多功能
    function pullUpAction(theScroller) {
        $("#tips").addClass("none");
        if (currPage == 1) {
            currPage = 2;
        }
        setTimeout(function() {
            serviceDataListPull(URL, szNumVal, spNameVal, currPage, pageSize);
            theScroller.refresh();
        }, 1000);
    }

})
