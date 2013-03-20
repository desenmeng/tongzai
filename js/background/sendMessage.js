chrome.browserAction.onClicked.addListener(function(tab) {
    chrome.tabs.sendMessage(parseInt(tab.id), {
        action: 'toggle'
    });
});
