function createEle(parent, obj) {
  const ele = document.createElement(obj.name);
  if (obj.attr) {
    for (let i = 0, l = Object.keys(obj.attr).length; i < l; i += 1) {
      const key = Object.keys(obj.attr)[i];
      ele.setAttribute(key, obj.attr[key]);
    }
  }
  if (obj.content) {
    ele.textContent = obj.content;
  }

  parent?.appendChild(ele);
  return ele;
}

function isCtrlKey(e) {
  return (window.navigator.platform.match('Mac') ? e.metaKey : e.ctrlKey);
}
export { createEle, isCtrlKey };
