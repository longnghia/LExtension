const defaultDB = {
  background: [
    'mylivewallpapers.com-Yellow-Space-Suit-Girl.webm',
  ],
  collection: [
    'https://github.dev',
  ],
  omniboxs: [
    {
      active: true,
      src: 'ios',
      des: 'https://github.com/search?o=desc&q=stars%3A%3E%3D20+fork%3Atrue+language%3Aswift&s=updated&type=Repositories',
    },
  ],
  'read-later': [],
  read_laters: [],
  hooks: [
    {
      active: true,
      des: 'http://localhost/assests/hello.html',
      src: 'https://wttr.in/hanoi',
    },
  ],
  settings: {
    hook: {
      active: true,
      logging: false,
    },
  },
};

export const DBKey = {
  hooks: 'hooks',
  readlater: 'read_laters',
  background: 'background',
  omniboxs: 'omniboxs',
  collection: 'collection',
  settings: 'settings',
};

export default defaultDB;
