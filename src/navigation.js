export function gotoPopup() {
  const url = browser.runtime.getURL(
    'popup/index.html',
  );
  browser.tabs.create({ url });
}
