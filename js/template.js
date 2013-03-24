var tongzaiDom = $('<div id="husky_chat_bar"><div id="husky_chat_sidebar"><!--Header--><div id="husky_chat_sidebar_header"><div id="husky_chat_sidebar_logo"></div><ul id="husky_chat_sidebar_header_links"><li id="husky_chat_room_online_users"><a id="husky_chat_sidebar_online_pop_up_toggle" href="#">1 Online</a></li></ul></div><!--Tabs--><div id="tabs"><ul><li style="margin-right:6px;"><a href="#tabs-1">聊天</a></li><li><a href="#tabs-2">热点</a></li></ul><!--聊天--><div id="tabs-1"><div id="husky_chat_sidebar_chatswitch"><div id="husky_chat_sidebar_chatswitch_text">大家在谈论&nbsp;<a id="queryWord" href="#"></a></div></div><div id="husky_chat_sidebar_conversation_window"><ul id="husky_chat_url_conversation_stream"></ul></div><div id="husky_chat_send_message_module" class="send_message_module"><div id="husky_chat_send_message_module_wrap"><textarea id="husky_chat_send_message_module_wrap_textarea" name="message_box" autofocus="autofocus"></textarea><a id="husky_chat_send_message_module_sendbutton"></a></div></div><div id="user_confirm"><input id="user-confirm-input" type="text" placeholder="请输入昵称"/><button id="user-confirm-button" class="btn btn-primary btn-block" type="button">加&nbsp;入&nbsp;讨&nbsp;论</button></div></div><!--热词--><div id="tabs-2"><div id="hot_topics_cloud_wrapper"><div id="hot_topics_cloud"></div></div></div></div></div></div>');
var messageYou = '<li class="husky_chat_sidebar_message"><div class="husky_chat_sidebar_message_you"><div class="husky_chat_sidebar_message_info"><strong class="husky_chat_sidebar_message_sender"><a href="#" id="husky_chat_sidebar_event_name_username" class="husky_chat_sidebar"><%=name%></a></strong><abbr class="husky_chat_sidebar_message_timestamp"><%=time%></abbr></div><div class="husky_chat_sidebar_message_body"><p class="husky_chat_sidebar_message_body_p"><%=content%></p></div></div></li>';
var messageElse = '<li class="husky_chat_sidebar_message"><div class="husky_chat_sidebar_message_else"><div class="husky_chat_sidebar_message_info"><strong class="husky_chat_sidebar_message_sender"><a href="#" id="husky_chat_sidebar_event_name_username" class="husky_chat_sidebar"><%=name%></a></strong><abbr class="husky_chat_sidebar_message_timestamp"><%=time%></abbr></div><div class="husky_chat_sidebar_message_body"><p class="husky_chat_sidebar_message_body_p"><%=content%></p></div></div></li>';
$("body").append(tongzaiDom);

function hot(data){
    var $tagCloud = $('#hot_topics_cloud');
    $tagCloud.children('a').remove();
    var hot_topics = data.hot;
    //console.log(hot_topics);
    for(var i = 1 ; i <= 28 ; i ++){
        var hot_topic = $('<a>');
        hot_topic.attr("href", hot_topics[i].url.replace("m.","www.").replace("word","wd"));
        hot_topic.attr("target", "_blank");
        hot_topic.html(hot_topics[i].word);
        hot_topic.appendTo($tagCloud);
    }
    $('#hot_topics_cloud').windstagball({
        radius:150,
        speed:3
    });
    $tagCloud.fadeIn(100);
}

//注册tabs
$( "#tabs" ).tabs({
    //collapsible: true
});
//注册滚动条+调整大小
$('#husky_chat_url_conversation_stream').slimScroll({
    //height: "auto"
});
var height = $("#husky_chat_sidebar_conversation_window").height();
$(".slimScrollDiv").css("height",height);
$("#husky_chat_url_conversation_stream").css("height",height);
//滚动条调整大小
$(window).resize(function(){
    var height = $("#husky_chat_sidebar_conversation_window").height();
    $(".slimScrollDiv").css("height",height);
    $("#husky_chat_url_conversation_stream").css("height",height);
});
//获取热词
$('a#ui-id-2').click(function(){
    $('#hot_topics_cloud').hide();
    $.ajax({
        type: "get",
        async: true,
        url: "http://api.m.baidu.com/?type=hot",
        dataType: "json",
        success:function(data){
           hot(data);
        },
        error: function(event, jqXHR){
            //alert(jqXHR);
        }
    });
});
//用户输入姓名
$("#user-confirm-button").click(function(){
    if($("#user-confirm-input").val() != ""){
        $("#user_confirm").animate({
                "bottom": "-130px"},
            500,
            function(){
                $(this).hide();
                $("#husky_chat_send_message_module_wrap").fadeIn();
            });
        localStorage.setItem("userName",$("#user-confirm-input").val());
    }
    else{
        alert("输个名字吧 亲");
    }
});
if(localStorage.getItem("userName")){
    $("#user_confirm").css("display","none");
    $("#husky_chat_send_message_module_wrap").fadeIn();
}
function getTime(time){
    var hour = time.getHours();
    if(hour>12){
        hour = "下午"+(hour-12);
    }
    else{
        hour = "上午"+hour;
    }
    var min = time.getMinutes();
    var sec = time.getSeconds();
    return hour+":"+min+":"+sec;
}
function sendMessage(){
    if($("#husky_chat_send_message_module_wrap_textarea").val().trim()!=""){
        var data = {
            name:localStorage.getItem("userName"),
            time:getTime(new Date()),
            content:$("#husky_chat_send_message_module_wrap_textarea").val()
        };
        pushData(data);
        $("#husky_chat_send_message_module_wrap_textarea").val("");
    }
    else{
        alert("写点东西吧 亲");
        $("#husky_chat_send_message_module_wrap_textarea").val("");
    }
}
$("#husky_chat_send_message_module_sendbutton").click(function(){
    sendMessage();
});

function addMessageYou(data){
    var messageYouDom = baidu.template(messageYou,data);
    $("#husky_chat_url_conversation_stream").append(messageYouDom);
    $("#husky_chat_send_message_module_wrap_textarea").val("");
    //scroll To Last
    var toScrollHeight = $('#husky_chat_url_conversation_stream').scrollTop() + $(".husky_chat_sidebar_message:last").height();
    $("#husky_chat_url_conversation_stream").scrollTop(toScrollHeight);
    //console.log($('#husky_chat_url_conversation_stream').height());
    //console.log($('.slimScrollBar').height());
    $(".slimScrollBar").css("top",$('#husky_chat_url_conversation_stream').height()-$('.slimScrollBar').height()+20);

}

function addMessageElse(data){
    var messageElseDom = baidu.template(messageElse,data);
    $("#husky_chat_url_conversation_stream").append(messageElseDom);
	remind();
    //scroll To Last
    var toScrollHeight = $('#husky_chat_url_conversation_stream').scrollTop() + $(".husky_chat_sidebar_message:last").height();
    $('#husky_chat_url_conversation_stream').scrollTop(toScrollHeight);
    //console.log($('#husky_chat_url_conversation_stream').height());
    //console.log($('.slimScrollBar').height());
    $(".slimScrollBar").css("top",$('#husky_chat_url_conversation_stream').height()-$('.slimScrollBar').height()+20);
}
//push data to firebase
function pushData(data){
    mdemo.push(data);
};
//watch the add event
mdemoLimit.on('child_added', function(snapshot) {
		var message = snapshot.val();
        if(message.name == localStorage.getItem("userName")){
            addMessageYou(message)
        }
        else{
            addMessageElse(message);
        }
	});
$("#queryWord").text($.query.get('wd'));
$("#husky_chat_send_message_module_wrap_textarea").keydown(function(event){
    if(event.which == 13){
        event.preventDefault();
        sendMessage();
    }
});


