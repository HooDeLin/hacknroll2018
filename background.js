function removePostByBlackList(ppl, ppl_name) {
    let clear_script = `
        clearInterval(window.no_ex_secret_function);
    `;
    chrome.tabs.executeScript({
        code: clear_script
    });
    ppl = ["hoodelin"];
    ppl_name = ["De Lin Hoo"];
    for (let i = 0; i < ppl.length; i ++) {
      let script = `
      window.no_ex_secret_function = setInterval(() => {
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
                    if (child.childNodes[0].style.background !== "red") {
                        child.childNodes[0].style.background="red";
                        var xhr = new XMLHttpRequest();
                        xhr.open("POST", "http://127.0.0.1:5000/recv_url", true);
                        xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
                        xhr.onload = () => {
                            if (xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200) {
                                console.log(xhr.responseText);
                            }
                        }
                        console.log(child.child)
                        xhr.send("img_url=" + document.getElementsByClassName("spotlight")[0].src +"&width="
                        + encodeURIComponent(child.childNodes[0].style.width) + "&height="
                        + encodeURIComponent(child.childNodes[0].style.height) + "&left="
                        + encodeURIComponent(child.childNodes[0].style.left) + "&top="
                        + encodeURIComponent(child.childNodes[0].style.top));
                    }
                }
            }
          })();

          console.log('NOEX BACKGROUND RUNNING');

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