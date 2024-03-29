import { Command } from './Const';

/* tabs */
function saveTabs() {
  browser.tabs.query({
    currentWindow: true,
  }, (tabs) => {
    const res = tabs.reduce((pre, tab) => {
      pre.push({ title: tab.title, url: tab.url });
      return pre;
    }, []);
    const link = document.createElement('a');
    // link.href = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(tabs))
    link.href = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(res))}`;
    link.download = `${tabs[0].title}.json`;
    link.click();
  });
}

function dublicateTab() {
  createTab(null);
}

function onCreated(tab) {
  console.log(`Created new tab: ${tab.id}`);
}

function onError(error) {
  console.log(`Error: ${error}`);
}

function createTab(url, active = false) {
  browser.tabs.query({
    active: true,
    currentWindow: true,
  }, (tabs) => {
    browser.tabs.create({
      active,
      openerTabId: tabs[0].id,
      index: tabs[0].index + 1,
      url: url ?? tabs[0].url,
    })
      .then(onCreated, onError);
  });
}

function save2Json(data) {
  if (data) {
    const url = URL.createObjectURL(new Blob([JSON.stringify(data)], {
      type: 'text/plain',
    }));
    const link = document.createElement('a');
    link.href = url;
    link.download = `read_later_${new Date().toDateString().replaceAll(' ', '_')}.json`;
    link.click();
  }
}

/* Open selected */

function openUrl(link, command) {
  console.log('$link', link);
  browser.tabs.query({
    active: true,
    currentWindow: true,
  }, (tabs) => {
    browser.tabs.create({
      url: isURL(link) ? link : `https://www.google.com/search?q=${link}`,
      active: command !== 'open-in-bg',
      index: tabs[0].index + 1,
    });
  });
}

function updateUrl(url) {
  browser.tabs.update({
    url,
  });
}

function openLink(href, active = false) {
  browser.tabs.query({
    active: true,
    currentWindow: true,
  }, (tabs) => {
    browser.tabs.create({
      url: href,
      active,
      index: tabs[0].index + 1,
    });
  });
}

function isURL(string) {
  try {
    // eslint-disable-next-line no-unused-vars
    const url = new URL(string);
  } catch (e) {
    // console.error(e)
    return false;
  }
  return true;
  // return url.protocol === "http:" || url.protocol === "https:";
}

function openSelected(command) {
  browser.tabs.query({
    active: true,
    currentWindow: true,
  }, (tabs) => {
    browser.tabs.sendMessage(tabs[0].id, {
      action: Command.open_selected,
      command,
    }, (response) => {
      if (response && response.link) openUrl(response.link, command);
    });
  });
}

/* fake ctr w */
function isInCollection(tab) {
  browser.storage.local.get(null, (data) => {
    if (data.collection) {
      for (let i = 0; i < data.collection.length; i += 1) {
        const url = data.collection[i];
        if (tab.url.startsWith(url)) {
          // audio.play()
          console.log('not close postman ok :3');
          return;
        }
      }
    } else {
      console.log('collection null');
    }
    browser.tabs.remove(tab.id);
  });
}

async function doFakeCtrW() {
  console.log('ctr W!');
  const data = await browser.storage.local.get(null);
  const { collection } = data;
  if (!collection) {
    console.log('[ctrw]', 'empty collection');
    return;
  }
  const tabs = await browser.tabs.query({
    highlighted: true,
    currentWindow: true,
  });
  tabs.forEach((tab) => {
    const arr = collection.some((url) => {
      if (tab.url.startsWith(url)) {
        // audio.play()
        console.log('not close postman ok :3');
        return true;
      }
      return false;
    });
    if (!arr.length) browser.tabs.remove(tab.id);
  });
}

function getCurrentTab() {
  return new Promise((resolve, reject) => {
    browser.tabs.query({
      highlighted: true,
      currentWindow: true,
    }, (tabs) => {
      if (tabs[0]) {
        resolve(tabs[0]);
      } else {
        reject(new Error('[tabs] No tabs found'));
      }
    });
  });
}

function executeScript(str) {
  getCurrentTab().then((tab) => {
    console.log('\nexecuteScript', tab.url);
    browser.tabs.executeScript(tab.id, { code: str })
      .then((res) => { console.log('[executeScript] done', res); })
      .catch((err) => console.log('[executeScript] error', err, str));
  });
}

function reload(hard = false) {
  executeScript(`window.location.reload(${hard})`);
}

export {
  saveTabs,
  dublicateTab,
  save2Json,
  openUrl,
  openSelected,
  doFakeCtrW,
  openLink,
  createTab,
  getCurrentTab,
  executeScript,
  reload,
  updateUrl,
};
