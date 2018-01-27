function blacklist_personal(url, ppl, ppl_name) {
    ppl = ["hoodelin"];
    ppl_name = ["De Lin Hoo"];
    for (let i = 0; i < ppl.length; i ++) {
        if (url.includes("www.facebook.com/" + ppl[i])) {
            let script = `
            let profilePic=document.getElementsByClassName("profilePic")[0];
            if (profilePic) {
                profilePic.remove();
            }
            `;
            chrome.tabs.executeScript({
              code: script
            });
        }
    }
}

chrome.tabs.onUpdated.addListener(function(id, changedInfo, tab) {
    if (tab.url.includes("www.facebook.com")) {
        removePostByBlackList();
        blacklist_personal(tab.url);
    }
});