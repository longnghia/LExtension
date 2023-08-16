/* eslint-disable import/prefer-default-export */
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

export { hashCode };
