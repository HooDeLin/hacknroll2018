function removePostByBlackList(ppl, ppl_name) {
    ppl = ["hoodelin"];
    ppl_name = ["De Lin Hoo"];
    for (let i = 0; i < ppl.length; i ++) {
      let script = `
      setInterval(() => {
          /* DELIN */
          let content_wrapper = document.getElementsByClassName("userContentWrapper");
          for (let i = 0; i < content_wrapper.length; i ++) {
              let removing = false;
              let profile_links = content_wrapper[i].getElementsByClassName("profileLink");
              for (let j = 0; j < profile_links.length; j ++) {
                  if (profile_links[j].href.includes("${ppl[i] }")) {
                      removing = true;
                      break;
                  }
              }
              let tooltips = content_wrapper[i].getElementsByTagName("a")
              for (let j = 0; j < tooltips.length; j ++) {
                  if (tooltips[j].dataset.tooltipContent !== undefined && tooltips[j].dataset.tooltipContent.includes("${ppl_name[i] }")) {
                      removing = true;
                      break;
                  }
                  if (tooltips[j].href.includes("${ppl[i] }")) {
                      removing = true;
                      break;
                  }
              }
              if (removing) {
                  content_wrapper[i].children[0].hidden = true;
                  content_wrapper[i].insertAdjacentHTML("afterbegin", '<h1 style="padding-top: 100px; padding-bottom: 100px; text-align: center; color: red; font-size: 5em; font-weight: 1800;">Nothing to see here mate!!!</h1>')
              }
          }

          /* JUHO */
          (function() {
            var tagsWrapper = document.getElementsByClassName('tagsWrapper')[0];
            if (!tagsWrapper) return;
            var children = tagsWrapper.children;
            for (var i=0;i<children.length;i++) {
                var child=children[i];
                if (child.text && child.text.includes("${ppl_name[i]}")) {
                    child.childNodes[0].style.background="red";
                }
            }
          })();
      }, 250);
      `
      chrome.tabs.executeScript({
          code: script
      });
  }
}

function blacklist_personal(url, ppl, ppl_name) {
    ppl = ["hoodelin"];
    ppl_name = ["De Lin Hoo"];
    for (let i = 0; i < ppl.length; i ++) {
        if (url.includes("www.facebook.com/" + ppl[i])) {
            let script = `
            document.getElementsByClassName("profilePic")[0].remove();
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