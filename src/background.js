import { setBadge } from './Badge';
import { Command } from './Const';
import defaultDB, { DBKey } from './Database';
import { gotoHook } from './Hooks/background';
import gotoOmnibox from './omnibox/background';
import { getValue, setValue } from './Storage';
import {
  doFakeCtrW, dublicateTab, openSelected, openUrl, reload as reloadTab, save2Json, saveTabs,
} from './Tabs';

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

let isReady = false;

// check and set database
getValue().then((storage) => {
  if (!storage[DBKey.readlater]?.length) {
    setValue({ [DBKey.readlater]: defaultDB.read_laters });
  }

  if (!storage[DBKey.collection]?.length) {
    setValue({ [DBKey.collection]: defaultDB.collection });
  }

  if (!storage[DBKey.background]?.length) {
    setValue({ [DBKey.background]: defaultDB.background });
  }

  if (!storage[DBKey.hooks]?.length) {
    console.log('[init hook ] ', { [DBKey.hooks]: defaultDB.hooks });
    setValue({ [DBKey.hooks]: defaultDB.hooks });
  }

  if (!storage[DBKey.settings]?.length) {
    console.log('[init settings ] ', { [DBKey.settings]: defaultDB.settings });
    setValue({ [DBKey.settings]: defaultDB.settings });
  }

  if (!storage[DBKey.omniboxs]?.length) {
    console.log('[init omnibox ] ', { [DBKey.omniboxs]: defaultDB.omniboxs });
    setValue({ [DBKey.omniboxs]: defaultDB.omniboxs });
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
getValue().then((storage) => {
  isReady = true;
  setActionIcon();

  console.log(`${TAG} DB Loaded`, storage);
  db = storage[DBKey.readlater];
  browser.browserAction.setBadgeText({ text: `${db.length}` });
});

browser.commands.onCommand.addListener(async (command) => {
  console.log(`${TAG} command= ${command}`);
  switch (command) {
    case Command.save_read_laters:
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

  getValue().then((storage) => {
    console.log(`${TAG} savePage`, storage);

    db = storage[DBKey.readlater];

    const newTabs = tabs.filter((tab) => !tabExisted(tab));

    if (newTabs.length === 0) {
      console.log(`${TAG} Tabs exist!`, tabs);
      return;
    }

    newTabs.forEach((tab) => {
      db.push(tab);
    });

    setValue({ [DBKey.readlater]: db }).then(() => {
      console.log(`${TAG} SUCCESS saved ${newTabs.length} tabs. db=${db.length}`);
      setBadge(String(db.length));
    }, onError);
  }, onError);
}

function onError(err) {
  console.log(`${TAG} ERROR`, err);
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
