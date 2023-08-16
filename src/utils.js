/* eslint-disable no-bitwise */

const hashCode = (str) => {
  let hash = 0;
  let i; let
    chr;
  if (str.length === 0) return hash;
  for (i = 0; i < str.length; i += 1) {
    chr = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return String(hash);
};

const getIcon = (url) => {
  try {
    const { origin } = new URL(url);
    const icon = `https://www.google.com/s2/favicons?sz=64&domain=${origin}`;
    return icon;
  } catch (error) {
    console.error('$fail to get icon', error);
    return null;
  }
};

export { hashCode, getIcon };
