/* openselected */
browser.runtime.onMessage.addListener(
  (message, sender, sendResponse) => {
    if (message?.action == 'open-selected') {
      const link = window.getSelection().toString();
      console.log('[OpenSelected]', link);
      sendResponse({
        link,
      });
      return true;
    }
  },
);

// add cdn
// document.body.appendChild(document.createElement('script')).src = 'https://cdn.jsdelivr.net/npm/sweetalert2@11';
