/**
 * Utils to manipulate Facebook's SnowLift.
 * 
 */

var names = ['Idawati', 'De Lin'];

console.log('DEBUG : snowliftutils.js starts running');

function getFbSnowlift() {
    return document.getElementsByClassName("fbPhotoSnowliftContainer")[0];
}

function getFbTagsWrapper() {
    return document.getElementsByClassName('tagsWrapper')[0];
}

function filterFbTags() {
    var tagsWrapper = getFbTagsWrapper();
    if (!tagsWrapper) return;
    var children = getFbTagsWrapper().children;
    for (var i=0;i<children.length;i++) {
        var child=children[i];
        for (var j=0;j<names.length;j++) {
            if (child.text && child.text.includes(names[j])) {
                child.childNodes[0].style.background="red";
            }
        }
    }
}

//DEBUG
function doThis() {
    console.log('DEBUG : WINDOW LOADED');
    setInterval(()=>{
        filterFbTags();
        console.log('DEBUG : filterFbTags()');
    },250);
};
window.onload = doThis;
