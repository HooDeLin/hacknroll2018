function removePostByBlackList() {
    let clear_script = `
        clearInterval(window.no_ex_secret_function);
    `;
    chrome.tabs.executeScript({
        code: clear_script
    });
    let script = `
      window.no_ex_secret_function = setInterval(() => {
          /* DELIN */
          if (window.ppl === undefined) {
              window.ppl = [];
              window.ppl_name = [];
          }
          for (let k = 0; k < window.ppl.length; k ++) {
            let content_wrapper = document.getElementsByClassName("userContentWrapper");
            for (let i = 0; i < content_wrapper.length; i ++) {
                let removing = false;
                let profile_links = content_wrapper[i].getElementsByClassName("profileLink");
                for (let j = 0; j < profile_links.length; j ++) {
                    if (profile_links[j].href.includes(window.ppl[k])) {
                        removing = true;
                        break;
                    }
                }
                let tooltips = content_wrapper[i].getElementsByTagName("a")
                for (let j = 0; j < tooltips.length; j ++) {
                    if (tooltips[j].dataset.tooltipContent !== undefined && tooltips[j].dataset.tooltipContent.includes(window.ppl_name[k])) {
                        removing = true;
                        break;
                    }
                    if (tooltips[j].href.includes(window.ppl[k])) {
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
                  if (child.text && child.text.includes(window.ppl_name[k])) {
                      if (!child.childNodes[0].className.includes('modified')) {
                          child.childNodes[0].classList.add('modified');
                          child.insertAdjacentHTML("beforeend", '<img class="fbPhotosPhotoTagboxBase tagBox middle-finger" style="width: '+child.childNodes[0].style.width+';height: '+child.childNodes[0].style.height+';top: '+child.childNodes[0].style.top+';left:'+child.childNodes[0].style.left+'" src="https://cdn.shopify.com/s/files/1/1061/1924/files/Middle_Finger_Emoji.png?9898922749706957214">')
                          var xhr = new XMLHttpRequest();
                          xhr.open("POST", "http://127.0.0.1:5000/recv_url", true);
                          xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
                          xhr.onload = () => {
                              if (xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200) {
                                document.getElementsByClassName("spotlight")[0].src = "data:image/png;base64," + xhr.responseText;
                                document.getElementsByClassName("middle-finger")[0].remove();
                              }
                          }
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
          }

      }, 250);
      `
      chrome.tabs.executeScript({
          code: script
      });
}