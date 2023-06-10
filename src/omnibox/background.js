import { DBKey } from '../Database';
import { getValue } from '../Storage';

const dbName = DBKey.omniboxs;

export default function gotoOmnibox() {
  const url = browser.runtime.getURL(
    'dist/omnibox/index.html',
  );
  browser.tabs.create({ url });
}

browser.omnibox.setDefaultSuggestion({
  description: `Search:
      (e.g. "android" | "ios")`,
});

browser.omnibox.onInputEntered.addListener((text) => {
  let newURL = 'https://google.com';
  const src = text.trim();
  getValue(dbName)
    .then(({ omniboxs }) => {
      console.log('[omniboxs] getValue', omniboxs);
      if (omniboxs) {
        omniboxs.some((box) => {
          if (box.src === src && box.active === true) {
            newURL = box.des;
            console.log('[omniboxs] found', src, newURL);
            return true;
          }
          return false;
        });
      }

      browser.tabs.update({
        url: newURL,
      });
    })
    .catch((err) => console.error('[omnibox] onInputEntered', err));
});
