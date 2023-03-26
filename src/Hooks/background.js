import { executeScript } from "../Tabs"
import defaultDB from "../Database"
import { getValue, setValue } from "../Storage"
import { setBadge, setTmpBadge } from "../Badge";
import { toastScript } from "../Script";

var db = defaultDB;
getValue().then(res => { db = res })

let enabled = localStorage['enabled'] ? JSON.parse(localStorage['enabled']) : false
let enabledLog = localStorage['enabledLog'] ? JSON.parse(localStorage['enabledLog']) : false

let logCss = "color: blue"


function updateChange(changes, area) {
    console.log(`[hook] db changed: ${area}`);
    getValue().then(res => { db = res })
}

browser.storage.onChanged.addListener(updateChange);

/* 
contextMenus in browser_action
*/


// chrome.contextMenus.create({
//     title: "Enable Hook-Script",
//     type: "checkbox",
//     contexts: ["browser_action"],
//     onclick: function () {
//         toggleEnabled()
//     },
//     checked: enabled
// });

/* 
log
*/
// chrome.contextMenus.create({
//     title: "Toggle log",
//     type: "checkbox",
//     contexts: ["browser_action"],
//     onclick: function () {
//         toggleEnabledLog()
//     },
//     checked: enabledLog

// });
/* 
hard reload
*/
// chrome.contextMenus.create({
//     title: "Hard reload",
//     type: "normal",
//     contexts: ["browser_action"],
//     onclick: function () {
//         location.reload(true);
//     },
// });

chrome.runtime.onMessage.addListener(function (message, messageSender, sendResponse) {
    if (message.action && message.action == "SAVE_HOOKS") {
        console.log('[received], SAVE_HOOKS');
        updateDatabase(message.payload)
    }
});

addBeforeRequestListener()

function addBeforeRequestListener() {
    console.log("[hook] addBeforeRequestListener")
    if (!db) {
        console.log("database null!");
        return
    }
    chrome.webRequest.onBeforeRequest.addListener(
        onBeforeRequestListener, {
        urls: ["<all_urls>"]
    },
        ["blocking"]
    );
}

function removeBeforeRequestListener() {
    console.log("[removeBeforeRequestListener]");
    chrome.webRequest.onBeforeRequest.removeListener(onBeforeRequestListener)
}

function onBeforeRequestListener(info) {
    if (enabledLog) {
        console.log("%c[info.url]", logCss, info.url);
    }
    let availbleKey = hasUrl(info.url)
    if (enabled && availbleKey > -1) {
        console.log("[onBeforeRequest] has url " + info.url);
        let hook = db.hooks[availbleKey]

        if (hook && hook["des"] && hook["active"]) {

            if (hook["des"].toLowerCase() == "cancel") { //
                console.log("%c[cancel]", "color: red", +info.url);
                setTmpBadge('X')
                return {
                    cancel: true
                }
            } else {
                let target = hook["des"];
                setTmpBadge('~>')
                executeScript(`console.log("[hook] hooked", ${info.url})`)
                console.log("%c[redirected]", "color: red", "from " + info.url + " to " + target);
                return {
                    redirectUrl: getChromeUrl(target)
                }
            }
        } else {
            // continue the request
            // console.log("[onBeforeRequestListener] continue " + info.url);
            return {}
        }
    }
}

//browserAction
chrome.browserAction.onClicked.addListener(toggleEnabled);

function hasUrl(url) {
    if (db)
        for (let i = 0; i < db.hooks.length; i++) {
            if (url.match(new RegExp(db.hooks[i]["src"])) && url != getChromeUrl(db.hooks[i]["des"])) {
                return i;
            }
        }

    return -1
}

function getChromeUrl(link) {
    if (link.startsWith("http"))
        return link
    return chrome.extension.getURL(link)
}

function toggleEnabled() {
    enabled = !enabled
    localStorage["enabled"] = enabled
    chrome.browserAction.setIcon({
        path: enabled ? "../icon/icons8-hook-100-color.png" : "../icon/icons8-hook-100.png"
    });
}

function toggleEnabledLog() {
    enabledLog = !enabledLog
    console.log("enabled log: " + enabledLog)
    localStorage["enabledLog"] = enabledLog
    removeBeforeRequestListener()
    addBeforeRequestListener()
}

function stripBadQueryParams(request) {
    const targetQueryParams = ["ef_id", "s_kwcid", "_bta_tid", "_bta_c", "dm_i", "fb_action_ids", "fb_action_types", "fb_source", "fbclid", "utm_source", "utm_campaign", "utm_medium", "utm_expid", "utm_term", "utm_content", "_ga", "gclid", "campaignid", "adgroupid", "adid", "_gl", "gclsrc", "gdfms", "gdftrk", "gdffi", "_ke", "trk_contact", "trk_msg", "trk_module", "trk_sid", "mc_cid", "mc_eid", "mkwid", "pcrid", "mtm_source", "mtm_medium", "mtm_campaign", "mtm_keyword", "mtm_cid", "mtm_content", "msclkid", "epik", "pp", "pk_source", "pk_medium", "pk_campaign", "pk_keyword", "pk_cid", "pk_content", "redirect_log_mongo_id", "redirect_mongo_id", "sb_referer_host"];

    let requestedUrl = new URL(request.url);
    let match = false;

    targetQueryParams.forEach(name => {
        if (requestedUrl.searchParams.has(name)) {
            requestedUrl.searchParams.delete(name);
            match = true;
            console.log('[stripBadQueryParams] catched bad query: %c' + request.url, 'color:orange');
        }
    });

    // return the stripped URL if a match is found, pass the URL on otherwise as normal (cancel: false)
    return match ? { redirectUrl: requestedUrl.href } : { cancel: false };
}




function gotoHook() {
    let url = browser.runtime.getURL(
        // 'dist/hook/index.html'
        'dist/hook/index.html'
    )
    console.log("[hook] ", url)
    let createData = {
        url,
        // TODO: index
    };
    let creating = browser.tabs.create(createData);
    creating.then(onCreated, onError);
}


function updateDatabase(newDb) {
    chrome.storage.local.set(newDb,
        function () {
            console.log("[hook] update database successfully!", newDb);
        }
    );
}


export { gotoHook }