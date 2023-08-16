import React from 'react';

function Empty() {
  return <img width="100%" src={browser.runtime.getURL('images/empty_list.png')} alt="empty list" />;
}

export default Empty;
