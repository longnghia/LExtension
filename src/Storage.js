function getValue(key = null) {
  return new Promise((resolve, reject) => {
    if (!browser || !browser.storage || !browser.storage.local) {
      reject(new Error('Storage required'));
    }

    browser.storage.local.get(key, (val) => {
      if (val) {
        resolve(val);
      }
      resolve();
    });
  });
}

function setValue(obj) {
  return new Promise((resolve, reject) => {
    if (typeof chrome !== 'undefined' && browser.storage && browser.storage.local) {
      browser.storage.local.set(
        obj,
        () => {
          resolve('[setValue] success');
        },
      );
    }
    reject(new Error('[Storage] No database found'));
  });
}

function getSettings() {
  return getValue('settings');
}

function putSetting(config) {
  return new Promise((resolve, reject) => {
    const settings = getSettings();
    setValue({ settings: { ...settings, ...config } })
      .then(resolve)
      .catch(reject);
  });
}

export {
  getValue, setValue, getSettings, putSetting,
};
