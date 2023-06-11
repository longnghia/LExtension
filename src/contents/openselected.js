import { Command } from '../Const';

/* openselected */
browser.runtime.onMessage.addListener(
  (message, sender, sendResponse) => {
    if (message?.action === Command.open_selected) {
      const link = window.getSelection().toString();
      console.log('[OpenSelected]', link);
      sendResponse({
        link,
      });
      return true;
    }
    return false;
  },
);
