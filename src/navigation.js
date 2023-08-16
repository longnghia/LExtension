export function gotoPopup() {
  const url = browser.runtime.getURL(
    'popup/popup.html',
  );
  browser.tabs.create({ url });
}
