import {
  saveTabs, dublicateTab, save2Json, openUrl, openSelected, doFakeCtrW, reload as reloadTab,
} from './Tabs';
import { gotoHook } from './Hooks/background';
import gotoOmnibox from './omnibox/background';
import defaultDB from './Database';

const TAG = '[Background]';

browser.browserAction.setBadgeBackgroundColor({ color: 'blue' });

// put in background so contextMenus is created once only.
// hook script
browser.contextMenus.create({
  id: 'hook',
  title: 'Hook-Script',
  contexts: ['browser_action'],
  onclick() {
    console.log('[hook] goto hook');
    gotoHook();
  },
  icons: {
    16: '../../images/hook.png',
    32: '../../images/hook.png',
  },
});

// Omnibox

browser.contextMenus.create({
  id: 'omnibox',
  title: 'Omnibox',
  contexts: ['browser_action'],
  onclick: gotoOmnibox,
  icons: {
    16: '../../images/boxes.png',
    32: '../../images/boxes.png',
  },
});

// backgroundURL
browser.contextMenus.create({
  id: 'debug',
  title: 'Debug',
  contexts: ['browser_action'],
  onclick: onClickDebug,
  icons: {
    16: '../../images/debug.png',
    32: '../../images/debug.png',
  },
});

// hard reload

browser.contextMenus.create({
  id: 'reload',
  title: 'Hard reload',
  contexts: ['browser_action'],
  onclick() {
    reloadTab();
  },
  icons: {
    16: '../../images/reload.png',
    32: '../../images/reload.png',
  },
});

const readLater = 'read-later';
let isReady = false;

// check and set database
browser.storage.local.get().then((storage) => {
  if (!storage[readLater]?.length) {
    browser.storage.local.set({ 'read-later': [] });
  }

  if (!storage.collection?.length) {
    browser.storage.local.set({ collection: ['https://github.dev'] });
  }

  if (!storage.omniboxs?.length) {
    browser.storage.local.set({
      omniboxs: [
        {
          src: 'ios',
          des: 'https://github.com/search?o=desc&q=stars%3A%3E%3D20+fork%3Atrue+language%3Aswift&s=updated&type=Repositories',
        },
      ],
    });
  }

  if (!storage.background?.length) {
    browser.storage.local.set({ background: ['mylivewallpapers.com-Yellow-Space-Suit-Girl.webm'] });
  }

  if (!storage.hooks?.length) {
    console.log('[init hook ] ', { hooks: defaultDB.hooks });
    browser.storage.local.set({ hooks: defaultDB.hooks });
  }

  if (!storage.settings?.length) {
    console.log('[init settings ] ', { settings: defaultDB.settings });
    browser.storage.local.set({ settings: defaultDB.settings });
  }
});

// let db = { "read-later": [] }
let db = [];

console.log(`${TAG} Loaded.`);

setActionIcon();

function logStorageChange(changes, area) {
  console.log(`Change in storage area: ${area}`);

  const changedItems = Object.keys(changes);

  changedItems.forEach((item) => {
    console.log(`${item} has changed:`);
    console.log('Old value: ', changes[item].oldValue);
    console.log('New value: ', changes[item].newValue);
  });
}

browser.storage.onChanged.addListener(logStorageChange);

// init data
browser.storage.local.get().then((storage) => {
  isReady = true;
  setActionIcon();

  db = storage[readLater];

  console.log(`${TAG} DB Loaded`, db);

  browser.browserAction.setBadgeText({ text: `${db.length}` });
});

browser.commands.onCommand.addListener(async (command) => {
  console.log(`${TAG} command= ${command}`);
  switch (command) {
    case readLater:
      await savePages();
      break;
    case 'logTabs':
      saveTabs();
      break;
    case 'dublicateTab':
      dublicateTab();
      break;
    case 'open-in-bg' || command === 'open-in-fg':
      openSelected(command);
      break;
    case 'fakeCtrlW':
      doFakeCtrW();
      break;
    case 'save2JSON':
      save2Json();
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
    return;
  }

  const tabs = await getTabsInfo();

  browser.storage.local.get().then((storage) => {
    console.log(`${TAG} savePage`, storage);

    db = storage[readLater];

    const newTabs = tabs.filter((tab) => !tabExisted(tab));

    if (newTabs.length === 0) {
      console.log(`${TAG} Tabs exist!`, tabs);
      return;
    }

    newTabs.forEach((tab) => {
      db.push(tab);
    });

    browser.storage.local.set({ 'read-later': db }).then(() => {
      console.log(`${TAG} SUCCESS saved ${newTabs.length} tabs.`);
      updateBadge(db.length);
    }, onError);
  }, onError);
}

function onError(err) {
  console.log(`${TAG} ERROR`, err);
}

function updateBadge(length) {
  browser.storage.local.get().then((storage) => {
    browser.browserAction.setBadgeText({
      text: `${length || storage[readLater].length}`,
    });
  });
}

function tabExisted(newTab) {
  return db.some((tab) => tab.url === newTab.url);
}

async function getTabsInfo() {
  const tabs = await browser.tabs.query({ highlighted: true, currentWindow: true });
  return tabs.filter(tabValid).map(parseTabInfo);
}

function tabValid(tab) {
  // TODO: regex tab
  return tab.url?.startsWith('http') ?? false;
}

function parseTabInfo(tab) {
  return {
    url: tab.url,
    title: tab.title,
    // icon: tab.favIconUrl,
    date: Date(),
  };
}

function onClickDebug() {
  openUrl(browser.runtime.getURL('_generated_background_page.html'));
}
/*
read-later: [
    {url:title:date},
    {url:title:date},
    {url:title:date},
],
*/
