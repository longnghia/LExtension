function getValue(key = null) {
  return new Promise((resolve, reject) => {
    if (!chrome || !chrome.storage || !chrome.storage.local) {
      return reject(new Error('Storage required'));
    }

    chrome.storage.local.get(key, (val) => {
      if (val) {
        return resolve(val);
      }
      resolve();
    });
  });
}

function setValue(obj) {
  return new Promise((resolve, reject) => {
    if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
      chrome.storage.local.set(
        obj,
        () => {
          resolve('[setValue] success');
        },
      );
    }
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
