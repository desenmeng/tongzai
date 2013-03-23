/**
 * User: mdemo
 * Date: 13-3-20
 * Time: 上午11:52
 *
 */
var tongzai = Class.extend({
    init:function(){

    }
});
var hi = new Firebase('https://hi.firebaseio.com');
var mdemo = new Firebase('https://hi.firebaseio.com/mdemo');
mdemo.push($.query.get('wd'));
mdemo.on("child_added",function(snapshot){
    console.log(snapshot.val());
});
chrome.extension.onMessage.addListener(
    function(request, sender, sendResponse) {
        switch(request.action) {
            case 'toggle':
                $("#husky_chat_bar").toggle("normal");
                break;
        }
    });
