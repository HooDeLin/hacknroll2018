// Copyright (c) 2014 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
SERVER_URL = "http://127.0.0.1:5000/recv_url";

function sendUrl() {
    var xhr = new XMLHttpRequest();
    xhr.open("POST", SERVER_URL, true);

    //Send the proper header information along with the request
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

    xhr.onreadystatechange = function () {//Call a function when the state changes.
        if (xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200) {
            // Request finished. Do processing here.
            uglified_img = xhr.responseText;
            // todo: figure out how to replace the image url...
            console.log("hello there the request finished running!");
        }
    }
    xhr.send("img_url=http://google.com");
}

/**
 * Get the current URL.
 *
 * @param {function(string)} callback called when the URL of the current tab
 *   is found.
 */
function getCurrentTabUrl(callback) {
    // Query filter to be passed to chrome.tabs.query - see
    // https://developer.chrome.com/extensions/tabs#method-query
    var queryInfo = {
        active: true,
        currentWindow: true
    };

    chrome.tabs.query(queryInfo, (tabs) => {
        // chrome.tabs.query invokes the callback with a list of tabs that match the
        // query. When the popup is opened, there is certainly a window and at least
        // one tab, so we can safely assume that |tabs| is a non-empty array.
        // A window can only have one active tab at a time, so the array consists of
        // exactly one tab.
        var tab = tabs[0];

        // A tab is a plain object that provides information about the tab.
        // See https://developer.chrome.com/extensions/tabs#type-Tab
        var url = tab.url;

        // tab.url is only available if the "activeTab" permission is declared.
        // If you want to see the URL of other tabs (e.g. after removing active:true
        // from |queryInfo|), then the "tabs" permission is required to see their
        // "url" properties.
        console.assert(typeof url == 'string', 'tab.url should be a string');

        callback(url);
    });

    // Most methods of the Chrome extension APIs are asynchronous. This means that
    // you CANNOT do something like this:
    //
    // var url;
    // chrome.tabs.query(queryInfo, (tabs) => {
    //   url = tabs[0].url;
    // });
    // alert(url); // Shows "undefined", because chrome.tabs.query is async.
}

/**
 * Gets the saved background color for url.
 *
 * @param {string} url URL whose background color is to be retrieved.
 * @param {function(string)} callback called with the saved background color for
 *     the given url on success, or a falsy value if no color is retrieved.
 */
function getSavedBackgroundColor(url, callback) {
    // See https://developer.chrome.com/apps/storage#type-StorageArea. We check
    // for chrome.runtime.lastError to ensure correctness even when the API call
    // fails.
    chrome.storage.sync.get(url, (items) => {
        callback(chrome.runtime.lastError ? null : items[url]);
    });
}

/**
 * Sets the given background color for url.
 *
 * @param {string} url URL for which background color is to be saved.
 * @param {string} color The background color to be saved.
 */
function saveBackgroundColor(url, color) {
    var items = {};
    items[url] = color;
    // See https://developer.chrome.com/apps/storage#type-StorageArea. We omit the
    // optional callback since we don't need to perform any action once the
    // background color is saved.
    chrome.storage.sync.set(items);
}

// This extension loads the saved background color for the current tab if one
// exists. The user can select a new background color from the dropdown for the
// current page, and it will be saved as part of the extension's isolated
// storage. The chrome.storage API is used for this purpose. This is different
// from the window.localStorage API, which is synchronous and stores data bound
// to a document's origin. Also, using chrome.storage.sync instead of
// chrome.storage.local allows the extension data to be synced across multiple
// user devices.
document.addEventListener('DOMContentLoaded', () => {

    document.getElementById('submit_button').addEventListener('click', () => {
        let facebook_name = document.getElementById('facebook_name').value;
        let facebook_id = document.getElementById('facebook_id').value;
        document.getElementById('table-body').insertAdjacentHTML('beforeend', `
        <tr id="${facebook_id }">
            <th>${facebook_id }</th>
            <th>${facebook_name }</th>
            <th><img class="delete" data-id="${facebook_id }" data-name="${facebook_name}" style="width: 15px; height: 15px;" src="thrash-can.png"></th>
        </tr>
        `)
        document.getElementsByClassName('delete')[document.getElementsByClassName('delete').length - 1].addEventListener("click", (e) => {
            let facebook_id = e.currentTarget.dataset.id;
            let facebook_name = e.currentTarget.dataset.name;
            let script = `
                window.ppl = window.ppl.filter((ppl) => { return ppl !== "${facebook_id}"});
                window.ppl_name = window.ppl_name.filter((ppl_name) => { return ppl_name !== "${facebook_name}"});
            `
            chrome.tabs.executeScript({
                code: script
            });
            removePostByBlackList();
            document.getElementById(facebook_id).remove();
        })
        document.getElementById('facebook_name').value = "";
        document.getElementById('facebook_id').value = "";
        let script = `
            if (window.ppl === undefined) {
                window.ppl = [];
                window.ppl_name = [];
            }
            window.ppl.push("${facebook_id}");
            window.ppl_name.push("${facebook_name}");
        `;
        chrome.tabs.executeScript({
            code: script,
        });
        removePostByBlackList();
    })
  });