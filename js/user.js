/**
 * Created with JetBrains WebStorm.
 * User: mdemo
 * Date: 13-3-20
 * Time: 下午12:01
 * To change this template use File | Settings | File Templates.
 */
var hi = new Firebase('https://hi.firebaseio.com');
var authClient = new FirebaseAuthClient(hi, function(error, user) {
    if (error) {
        console.log(error);
    } else if (user) {
        chrome.tabs.getSelected(null,function(tab){
            chrome.tabs.sendMessage(parseInt(tab.id), {
                action: 'addUser',
                value:user
            });
        })
    } else {
        console.log("dddd");
    }
});
authClient.login('password',{
    email:'mem@gmail.com',
    password:'123456',
    remeberMe: true
});

