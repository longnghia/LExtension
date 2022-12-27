/* 
https://stackoverflow.com/questions/4129102/html5-video-dimensions
*/
let TAG = "[Newtab]"
var vid = document.getElementById("myVideo");
vid.addEventListener("loadedmetadata", function (e) {
    var width = this.videoWidth,
        height = this.videoHeight;
    document.body.style.background = "none"
    /* size */
    const ratio = innerHeight / innerWidth
    let vidRatio = height / width

    console.log(vidRatio);

    if (vidRatio > ratio) {
        vid.style.width = innerWidth + 'px'
        console.log(1);

    } else {
        vid.style.height = innerHeight + 'px'
        console.log(2);
    }
}, false);

if (localStorage["background"]) {
    let i = localStorage["background"]
    browser.storage.local.get().then(db => {
        if (db && db.background) {
            vid.src = browser.runtime.getURL(db.background[i])
        }
    })
} else {
    console.log("[Newtab] src not found");
    browser.storage.local.get().then(function (db) {
        // console.log(`${TAG} src`, browser.runtime.getURL(db.background[0]));
        // vid.src = browser.runtime.getURL(db.background[0])

        vid.src = browser.runtime.getURL("dist/newtab/Akali League of Legends.mp4")
    })
}

