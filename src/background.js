import { saveTabs, dublicateTab, save2Json, openUrl, openSelected, doFakeCtrW } from "./Tabs"

const TAG = "[Background]"

browser.browserAction.setBadgeBackgroundColor({ 'color': 'blue' });

// let gettingActiveTab = browser.tabs.query({ active: true, currentWindow: true });
// let gettingSelectedTab = browser.tabs.query({ highlighted: true, currentWindow: true });


let readLater = "read-later"
let isReady = false

// check and set database
browser.storage.local.get().then(storage => {
    if (!storage[readLater]?.length) {
        browser.storage.local.set({ "read-later": [] })
    }

    if (!storage["collection"]?.length) {
        browser.storage.local.set({ "collection": ["https://github.dev"] })
    }

    if (!storage["omniboxs"]?.length) {
        browser.storage.local.set({
            "omniboxs": [
                {
                    src: "ios",
                    des: "https://github.com/search?o=desc&q=stars%3A%3E%3D20+fork%3Atrue+language%3Aswift&s=updated&type=Repositories"
                }
            ]
        })
    }
    
    if (!storage["background"]?.length) {
        browser.storage.local.set({ "background": ["mylivewallpapers.com-Yellow-Space-Suit-Girl.webm"] })
    }
})

// Omnibox

browser.omnibox.setDefaultSuggestion({
    description: `Search:
      (e.g. "android" | "ios")`
});

browser.omnibox.onInputEntered.addListener(function (text) {
    let newURL = "https://google.com"
    text = text.trim()
    browser.storage.local.get().then(data => {
        data && data.omniboxs && data.omniboxs.forEach(box => {
            if (box.src == text){
                newURL = box.des;
                console.log(`${TAG} found`, text), newURL;
            }
        })

        chrome.tabs.update({
            url: newURL,
        });
    })
});


// let db = { "read-later": [] }
let db = []

console.log(`${TAG} Loaded.`);

setActionIcon()

function logStorageChange(changes, area) {

    console.log(`Change in storage area: ${area}`);

    const changedItems = Object.keys(changes);

    for (const item of changedItems) {
        console.log(`${item} has changed:`);
        console.log("Old value: ", changes[item].oldValue);
        console.log("New value: ", changes[item].newValue);
    }
}

browser.storage.onChanged.addListener(logStorageChange);

// init data
browser.storage.local.get().then(storage => {
    isReady = true
    setActionIcon()

    db = storage[readLater]

    console.log(`${TAG} DB Loaded`, db);

    browser.browserAction.setBadgeText({ text: `${db.length}` });
});

browser.commands.onCommand.addListener(async (command) => {
    console.log(`${TAG} command= ${command}`);

    switch (command) {
        case readLater:
            await savePages()
            break;

        case "logTabs":
            saveTabs();
            break;
        case "dublicateTab":
            dublicateTab();
            break;
        case "open-in-bg" || command == "open-in-fg":
            openSelected(command)
            break;
        case "fakeCtrlW":
            doFakeCtrW()
            break;
        default:
            break;
    }
});

function setActionIcon() {
    console.log(`${TAG} isReady=`, isReady);
}

async function savePages() {

    if (!isReady) {
        console.log(`${TAG} Extension not ready!`);
        return
    }

    let tabs = await getTabsInfo()

    browser.storage.local.get().then(storage => {
        console.log(`${TAG} savePage`, storage);

        db = storage[readLater]

        let newTabs = tabs.filter(tab => !tabExisted(tab))

        if (newTabs.length == 0) {
            console.log(`${TAG} Tabs exist!`, tabs)
            return
        }

        newTabs.forEach(tab => {
            db.push(tab)
        })

        browser.storage.local.set({ "read-later": db }).then(function () {
            console.log(`${TAG} SUCCESS saved ${newTabs.length} tabs.`);
            updateBadge(db.length)
        }, onError)
    }, onError);
}

function onError(err) {
    console.log(`${TAG} ERROR`, err);
}

function updateBadge(length) {
    browser.storage.local.get().then(storage => {
        browser.browserAction.setBadgeText({
            text: `${length ? length : storage[readLater].length}`
        });
    });
}

function tabExisted(newTab) {
    return db.some(tab => tab.url == newTab.url)
}

async function getTabsInfo() {
    let tabs = await browser.tabs.query({ highlighted: true, currentWindow: true })
    return tabs.filter(tabValid).map(parseTabInfo)
}

function tabValid(tab) {
    // TODO: regex tab
    return tab.url?.startsWith("http") ?? false
}

function parseTabInfo(tab) {
    return {
        url: tab.url,
        title: tab.title,
        // icon: tab.favIconUrl,
        date: Date()
    }
}

/*
read-later: [
    {url:title:date},
    {url:title:date},
    {url:title:date},
],
*/