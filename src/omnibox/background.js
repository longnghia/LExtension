import { DBKey } from '../Database';
import { getValue } from '../Storage';
import { openLink, updateUrl } from '../Tabs';

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
      if (!omniboxs) return
      omniboxs.some((box) => {
        if (box.src === src && box.active === true) {
          const desUrls = box.des.split(/\s+/);
          desUrls.forEach((url, index) => {
            if (index === 0)
              updateUrl(url)
            else
              openLink(url)
          })
          console.log('[omniboxs] found', src, desUrls);
          return true;
        }
        return false;
      });
    })
    .catch((err) => console.error('[omnibox] onInputEntered', err));
});
