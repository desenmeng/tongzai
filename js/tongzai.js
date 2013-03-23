/**
 * User: mdemo
 * Date: 13-3-20
 * Time: 上午11:52
 *
 */
var $hi,$q,$hiq,$hiqu,$hiquc;
var getQuery=function(){
	var reg = window.location.search;
	var s = reg.split('wd=');
	var value;
	if(s.length>0)
	{
		var t = s[1].split('&');
	value=t[0];	
	}
	return value;
}

function refreshUser(){
	var $user = $("#husky_chat_sidebar_online_pop_up_toggle");
	if($user[0]){
		$user[0].innerHTML = $hiquc+' Online';
	}
	
}

step=1;
var to;
var title=document.title,f=0;
function remind(){
	  f=1;
      step++;
      if (step==3) {step=1;}
      if (step==1) {document.title='【有人与你同在】';}
      if (step==2) {document.title='【　　　　　　】';}
      to=setTimeout("remind()",500);
	  setTimeout("clearRemind()",2000);
}
function clearRemind(){
	if(to)
	clearTimeout(to);
	document.title=title;
}
var tongzai = Class.extend({
    init:function(){
    }
});
$hi = new Firebase('https://hi.firebaseio.com/');
$q=getQuery();
if($q){
	$hiq=$hi.child($q);
	$hiqu=$hiq.child('user');
	$hiqu.on("value",function(dataSnapshot){
		var u=dataSnapshot.val();
		if($hiquc<2&&u>1&&!f){
			remind();
		}
		$hiquc=u;
		if($hiquc){
			refreshUser();
			$hiqu.onDisconnect().set($hiquc-1);
		}
	});
	$hiqu.transaction(function(curUserCount){
		if(curUserCount == null){
			return 1;
		}
		return curUserCount+1;
	},function(error,abort,msg){
		if(error){
		}
	});
}
var hi = new Firebase('https://hi.firebaseio.com');
var domain="https://hi.firebaseio.com/";
if($q){
	domain=domain+encodeURIComponent($q)+"/msgs";
}else{
	domain=domain+"mdemo"+"/msgs";
}
var mdemo = new Firebase(domain);
var mdemoLimit = mdemo.limit(5);

chrome.extension.onMessage.addListener(
    function(request, sender, sendResponse) {
        switch(request.action) {
            case 'toggle':
                $("#husky_chat_bar").toggle("normal");
                break;
        }
    });






