import { executeScript } from '../Tabs';
import defaultDB from '../Database';
import { getValue, setValue } from '../Storage';
import { setTmpBadge } from '../Badge';

let db = defaultDB;
let { settings, hooks } = db;
getValue().then((res) => { db = res; console.log('[hook] init', db); });

if (!localStorage.enabled) {
  localStorage.enabled = 'true';
}

if (!localStorage.enabledLog) {
  localStorage.enabledLog = 'false';
}

const logCss = 'color: blue';

function updateChange(changes, area) {
  console.log(`[hook] db changed: ${area}`);
  getValue().then((res) => {
    db = res;
    settings = db.settings;
    hooks = db.hooks;
  });
}

browser.storage.onChanged.addListener(updateChange);

browser.runtime.onMessage.addListener((message, messageSender, sendResponse) => {
  if (message.action && message.action === 'SAVE_HOOKS') {
    console.log('[received], SAVE_HOOKS');
    updateDatabase(message.payload);
  }
});

addBeforeRequestListener();

function addBeforeRequestListener() {
  console.log('[hook] addBeforeRequestListener');
  if (!db) {
    console.log('database null!');
    return;
  }
  browser.webRequest.onBeforeRequest.addListener(
    onBeforeRequestListener,
    {
      urls: ['<all_urls>'],
    },
    ['blocking'],
  );
}

function removeBeforeRequestListener() {
  console.log('[removeBeforeRequestListener]');
  browser.webRequest.onBeforeRequest.removeListener(onBeforeRequestListener);
}

function onBeforeRequestListener(info) {
  if (settings.hook.logging) {
    console.log('%c[info.url]', logCss, info.url);
  }
  const availbleKey = hasUrl(info.url);
  if (settings.hook.active && availbleKey > -1) {
    console.log(`[onBeforeRequest] has url ${info.url}`);
    const hook = hooks[availbleKey];

    if (hook && hook.des && hook.active) {
      if (hook.des.toLowerCase() === 'cancel') { //
        console.log('%c[cancel]', 'color: red', +info.url);
        setTmpBadge('X');
        return {
          cancel: true,
        };
      }
      const target = hook.des;
      setTmpBadge('~>');
      executeScript(`console.log("%c[HOOK]", "color: red", "${info.url} -> ${hook.des}")`);
      console.log('%c[redirected]', 'color: red', `from ${info.url} to ${target}`);
      return {
        redirectUrl: getChromeUrl(target),
      };
    }
    // continue the request
    // console.log("[onBeforeRequestListener] continue " + info.url);
    return {};
  }
}

// browserAction
browser.browserAction.onClicked.addListener(toggleEnabled);

function hasUrl(url) {
  if (db) {
    for (let i = 0; i < hooks.length; i++) {
      if (url.match(new RegExp(hooks[i].src)) && url != getChromeUrl(hooks[i].des)) {
        return i;
      }
    }
  }

  return -1;
}

function getChromeUrl(link) {
  if (link.startsWith('http')) { return link; }
  return browser.extension.getURL(link);
}

function toggleEnabled() {
  settings.hook.active = !settings.hook.active;
  localStorage.enabled = settings.hook.active;
  browser.browserAction.setIcon({
    path: settings.hook.active ? '../icon/icons8-hook-100-color.png' : '../icon/icons8-hook-100.png',
  });
}

function toggleEnabledLog() {
  settings.hook.logging = !settings.hook.logging;
  console.log(`enabled log: ${settings.hook.logging}`);
  localStorage.enabledLog = settings.hook.logging;
  removeBeforeRequestListener();
  addBeforeRequestListener();
}

function stripBadQueryParams(request) {
  const targetQueryParams = ['ef_id', 's_kwcid', '_bta_tid', '_bta_c', 'dm_i', 'fb_action_ids', 'fb_action_types', 'fb_source', 'fbclid', 'utm_source', 'utm_campaign', 'utm_medium', 'utm_expid', 'utm_term', 'utm_content', '_ga', 'gclid', 'campaignid', 'adgroupid', 'adid', '_gl', 'gclsrc', 'gdfms', 'gdftrk', 'gdffi', '_ke', 'trk_contact', 'trk_msg', 'trk_module', 'trk_sid', 'mc_cid', 'mc_eid', 'mkwid', 'pcrid', 'mtm_source', 'mtm_medium', 'mtm_campaign', 'mtm_keyword', 'mtm_cid', 'mtm_content', 'msclkid', 'epik', 'pp', 'pk_source', 'pk_medium', 'pk_campaign', 'pk_keyword', 'pk_cid', 'pk_content', 'redirect_log_mongo_id', 'redirect_mongo_id', 'sb_referer_host'];

  const requestedUrl = new URL(request.url);
  let match = false;

  targetQueryParams.forEach((name) => {
    if (requestedUrl.searchParams.has(name)) {
      requestedUrl.searchParams.delete(name);
      match = true;
      console.log(`[stripBadQueryParams] catched bad query: %c${request.url}`, 'color:orange');
    }
  });

  // return the stripped URL if a match is found, pass the URL on otherwise as normal (cancel: false)
  return match ? { redirectUrl: requestedUrl.href } : { cancel: false };
}

function gotoHook() {
  const url = browser.runtime.getURL(
    // 'dist/hook/index.html'
    'dist/hook/index.html',
  );
  console.log('[hook] ', url);
  const createData = {
    url,
    // TODO: index
  };
  const creating = browser.tabs.create(createData);
  creating.then(onCreated, onError);
}

function updateDatabase(newDb) {
  browser.storage.local.set(
    newDb,
    () => {
      console.log('[hook] update database successfully!', newDb);
    },
  );
}

export { gotoHook };
