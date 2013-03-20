/**
 * Created with JetBrains WebStorm.
 * User: mdemo
 * Date: 13-3-14
 * Time: 下午5:12
 * To change this template use File | Settings | File Templates.
 */
var hi = new Firebase('https://hi.firebaseio.com');
var authClient = new FirebaseAuthClient(hi, function(error, user) {
    if (error) {
        // an error occurred while attempting login
    } else if (user) {
        // user authenticated with Firebase
        console.log('User ID: ' + user.id + ', Provider: ' + user.provider);
    } else {
        // user is logged out
    }
});
authClient.login('password');
var mdemo = new Firebase('https://hi.firebaseio.com/mdemo');
mdemo.push($.query.get('wd'));

chrome.extension.onMessage.addListener(
    function(request, sender, sendResponse) {
        switch(request.action) {
            case 'toggle':
                console.log(request);
                break;
        }
    });