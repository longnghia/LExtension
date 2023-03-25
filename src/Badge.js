import { getCurrentTab } from "./Tabs"

function setBadge(text) {
    getCurrentTab().then(tab => {
        browser.browserAction.setBadgeText({
            // tabId: tab.id,
            windowId: tab.windowId,
            text: text
        });
    })
}

function setTmpBadge(text) {
    setBadge(text)
    browser.browserAction.getBadgeText({})
        .then(curBadge => {
            setTimeout(() => {
                console.log("reset")
                setBadge(curBadge)
            }, 3500);
        })
}

export { setBadge, setTmpBadge }