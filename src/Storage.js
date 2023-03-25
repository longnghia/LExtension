
function getValue(key = null) {
    return new Promise(function (resolve, reject) {
        if (!chrome || !chrome.storage || !chrome.storage.local) {
            return reject(new Error('Storage required'));
        }

        chrome.storage.local.get(key, function (val) {
            if (val) {
                return resolve(val);
            }
            resolve();
        });
    });
};

function setValue(obj) {
    return new Promise(function (resolve, reject) {
        if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
            chrome.storage.local.set(obj,
                function () {
                    resolve("[setValue] success");
                }
            );
        }
    });
};

export { getValue, setValue }